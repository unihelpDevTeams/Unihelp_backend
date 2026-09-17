import fs from "fs/promises";
import { createCanvas } from "@napi-rs/canvas";
import {
  attachVisualsToQuestions,
  buildDraftFromPayload,
  extractPdfVisuals,
  fetchPdfBuffer,
  normalizeQuestionBlocks,
  parsePdfText,
} from "../routes/pastQuestionsRoutes.js";
import { isCloudinaryAdminConfigured } from "../utils/cloudinaryCleanup.js";
import { v2 as cloudinary } from "cloudinary";

const pdfString = (value) => String(value).replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");

const makeStream = (dictionary, content) => {
  const body = Buffer.from(content, "binary");
  return Buffer.concat([Buffer.from(`${dictionary} /Length ${body.length} >>\nstream\n`, "binary"), body, Buffer.from("\nendstream", "binary")]);
};

const makeDiagramJpeg = () => {
  const canvas = createCanvas(500, 220);
  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 500, 220);
  context.strokeStyle = "#111827";
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(80, 170);
  context.lineTo(250, 45);
  context.lineTo(420, 170);
  context.stroke();
  context.fillStyle = "#111827";
  context.font = "bold 26px sans-serif";
  context.fillText("A", 65, 202);
  context.fillText("B", 410, 202);
  context.fillText("F", 242, 38);
  return canvas.toBuffer("image/jpeg", 0.92);
};

const buildPdf = (imageBuffer, includeText = true) => {
  const pageResources = "<< /Font << /F1 8 0 R >> /XObject << /Im1 5 0 R >> >>";
  const pageOneText = includeText ? "BT /F1 20 Tf 50 740 Td (Question 1) Tj 0 -30 Td (Explain the principle of equilibrium.) Tj ET" : "";
  const pageTwoText = includeText ? "BT /F1 20 Tf 50 740 Td (Question 2) Tj 0 -30 Td (Using the diagram below, calculate the force at A.) Tj ET" : "";
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R 6 0 R] /Count 2 >>",
    `${"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources "}${pageResources} /Contents 4 0 R >>`,
    makeStream("<<", pageOneText),
    makeStream("<< /Type /XObject /Subtype /Image /Width 500 /Height 220 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode", imageBuffer),
    `${"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources "}${pageResources} /Contents 7 0 R >>`,
    makeStream("<<", pageTwoText + "\nq\n500 0 0 220 56 430 cm\n/Im1 Do\nQ"),
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  const chunks = [Buffer.from("%PDF-1.4\n%\xFF\xFF\xFF\xFF\n", "binary")];
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets[index + 1] = chunks.reduce((total, chunk) => total + chunk.length, 0);
    const body = Buffer.isBuffer(object) ? object : Buffer.from(object, "binary");
    chunks.push(Buffer.from(`${index + 1} 0 obj\n`, "binary"), body, Buffer.from("\nendobj\n", "binary"));
  });
  const xrefOffset = chunks.reduce((total, chunk) => total + chunk.length, 0);
  chunks.push(Buffer.from(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`, "binary"));
  offsets.slice(1).forEach((offset) => chunks.push(Buffer.from(`${String(offset).padStart(10, "0")} 00000 n \n`, "binary")));
  chunks.push(Buffer.from(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`, "binary"));
  return Buffer.concat(chunks);
};

const uploadPdf = (pdfBuffer) => new Promise((resolve, reject) => {
  const upload = cloudinary.uploader.upload_stream({
    folder: "unihelp/past-questions",
    public_id: "real-pdf-fixture-original",
    resource_type: "raw",
    format: "pdf",
    overwrite: true,
  }, (error, result) => {
    if (error) reject(error);
    else resolve(result);
  });
  upload.end(pdfBuffer);
});

const main = async () => {
  const fixturePath = new URL("./fixtures/past-question-with-diagram.pdf", import.meta.url);
  const pdfBuffer = buildPdf(makeDiagramJpeg());
  await fs.mkdir(new URL("./fixtures/", import.meta.url), { recursive: true });
  await fs.writeFile(fixturePath, pdfBuffer);

  const uploadedOriginal = isCloudinaryAdminConfigured() ? await uploadPdf(pdfBuffer) : null;
  const originalFile = uploadedOriginal ? {
    url: uploadedOriginal.secure_url || uploadedOriginal.url || "",
    publicId: uploadedOriginal.public_id || "",
    resourceType: uploadedOriginal.resource_type || "raw",
    fileName: "past-question-with-diagram.pdf",
  } : {
    url: "local-fixture://past-question-with-diagram.pdf",
    fileName: "past-question-with-diagram.pdf",
  };
  const downloadedPdf = uploadedOriginal ? await fetchPdfBuffer(originalFile.url) : pdfBuffer;

  const rawText = await parsePdfText(downloadedPdf);
  const visualExtraction = await extractPdfVisuals(downloadedPdf, "real-pdf-fixture");
  const questions = normalizeQuestionBlocks({ text: rawText });
  const associatedQuestions = attachVisualsToQuestions(questions, visualExtraction.pages);
  const draft = await buildDraftFromPayload({
    title: "Real PDF Diagram Test",
    courseCode: "TEST 201",
    originalFile,
    rawText,
    questions: associatedQuestions,
    status: "review_required",
  });

  const scannedPdfBuffer = buildPdf(makeDiagramJpeg(), false);
  const scannedText = await parsePdfText(scannedPdfBuffer);
  const scannedVisuals = await extractPdfVisuals(scannedPdfBuffer, "scanned-pdf-fixture");
  const scannedQuestions = normalizeQuestionBlocks({ text: scannedText });

  console.log(JSON.stringify({
    testPdf: fixturePath.pathname,
    pdfBytes: pdfBuffer.length,
    textExtracted: Boolean(rawText),
    questionsDetected: draft.questions.length,
    visualPagesDetected: visualExtraction.pages.length,
    extractedVisualAssets: visualExtraction.pages.filter((page) => page.asset).length,
    extractedVisualPublicIds: visualExtraction.pages.map((page) => page.asset?.publicId).filter(Boolean),
    visualQuestions: draft.questions.filter((question) => question.images?.length).map((question) => ({
      number: question.number,
      text: question.text,
      imageCount: question.images.length,
      imageUrls: question.images.map((image) => image.url),
    })),
    cloudinaryConfigured: visualExtraction.cloudinaryConfigured,
    scannedPages: visualExtraction.pages.filter((page) => page.isScanned).length,
    originalPdfPreserved: Boolean(draft.originalFile?.url) && draft.originalFile.url === originalFile.url,
    originalPdfDownloadedAfterUpload: downloadedPdf.length === pdfBuffer.length,
    originalPdfCloudinary: uploadedOriginal ? {
      url: originalFile.url,
      publicId: originalFile.publicId,
      resourceType: originalFile.resourceType,
    } : null,
    scannedPdf: {
      textExtracted: Boolean(scannedText),
      questionsDetected: scannedQuestions.length,
      visualPagesDetected: scannedVisuals.pages.length,
      requiresManualReview: scannedVisuals.hasScannedPage && !scannedText,
      ocrAvailable: false,
    },
  }, null, 2));
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});