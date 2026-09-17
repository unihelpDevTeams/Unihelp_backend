import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createCanvas } from "@napi-rs/canvas";
import {
  buildDraftFromPayload,
  buildDocumentContentFromExtraction,
  extractPdfContent,
} from "../routes/pastQuestionsRoutes.js";

const makeStream = (dictionary, content) => {
  const body = Buffer.from(content, "binary");
  return Buffer.concat([
    Buffer.from(`${dictionary} /Length ${body.length} >>\nstream\n`, "binary"),
    body,
    Buffer.from("\nendstream", "binary"),
  ]);
};

const makeDiagramJpeg = () => {
  const canvas = createCanvas(420, 180);
  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 420, 180);
  context.strokeStyle = "#111827";
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(60, 145);
  context.lineTo(210, 35);
  context.lineTo(360, 145);
  context.stroke();
  context.fillStyle = "#111827";
  context.font = "bold 24px sans-serif";
  context.fillText("A", 45, 168);
  context.fillText("B", 355, 168);
  context.fillText("C", 204, 28);
  return canvas.toBuffer("image/jpeg", 0.92);
};

const buildPdf = ({ pages, imageBuffer = null }) => {
  const hasImage = Boolean(imageBuffer);
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids [${pages.map((_, index) => `${3 + index * 2} 0 R`).join(" ")}] /Count ${pages.length} >>`,
  ];

  pages.forEach((page, index) => {
    const pageObjectNumber = 3 + index * 2;
    const contentObjectNumber = pageObjectNumber + 1;
    const resources = hasImage
      ? "<< /Font << /F1 100 0 R >> /XObject << /Im1 101 0 R >> >>"
      : "<< /Font << /F1 100 0 R >> >>";
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources ${resources} /Contents ${contentObjectNumber} 0 R >>`);
    objects.push(makeStream("<<", page));
  });

  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  if (hasImage) {
    objects.push(makeStream("<< /Type /XObject /Subtype /Image /Width 420 /Height 180 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode", imageBuffer));
  }

  const chunks = [Buffer.from("%PDF-1.4\n%\xFF\xFF\xFF\xFF\n", "binary")];
  const offsets = [0];
  objects.forEach((object, index) => {
    const objectNumber = index < 2 + pages.length * 2 ? index + 1 : (index === 2 + pages.length * 2 ? 100 : 101);
    offsets[objectNumber] = chunks.reduce((total, chunk) => total + chunk.length, 0);
    const body = Buffer.isBuffer(object) ? object : Buffer.from(object, "binary");
    chunks.push(Buffer.from(`${objectNumber} 0 obj\n`, "binary"), body, Buffer.from("\nendobj\n", "binary"));
  });

  const size = Math.max(...Object.keys(offsets).map(Number)) + 1;
  const xrefOffset = chunks.reduce((total, chunk) => total + chunk.length, 0);
  chunks.push(Buffer.from(`xref\n0 ${size}\n0000000000 65535 f \n`, "binary"));
  for (let index = 1; index < size; index += 1) {
    const offset = offsets[index] || 0;
    chunks.push(Buffer.from(`${String(offset).padStart(10, "0")} ${offset ? "00000 n" : "65535 f"} \n`, "binary"));
  }
  chunks.push(Buffer.from(`trailer\n<< /Size ${size} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`, "binary"));
  return Buffer.concat(chunks);
};

const textPage = [
  "BT /F1 18 Tf 50 740 Td (SECTION A) Tj",
  "0 -32 Td (Answer all questions.) Tj",
  "0 -38 Td (1. Define stress.) Tj",
  "0 -30 Td (2. Explain the following:) Tj",
  "20 -28 Td (a. Elastic deformation) Tj",
  "0 -24 Td (b. Plastic deformation) Tj ET",
].join("\n");

const imagePage = [
  "BT /F1 18 Tf 50 740 Td (3. Consider the diagram below.) Tj ET",
  "q",
  "420 0 0 180 90 470 cm",
  "/Im1 Do",
  "Q",
  "BT /F1 18 Tf 50 430 Td (Calculate the force shown.) Tj ET",
].join("\n");

const scannedPage = [
  "q",
  "420 0 0 180 90 470 cm",
  "/Im1 Do",
  "Q",
].join("\n");

const fixtureDir = new URL("./fixtures/", import.meta.url);
await fs.mkdir(fixtureDir, { recursive: true });

const textPdf = buildPdf({ pages: [textPage] });
const imagePdf = buildPdf({ pages: [imagePage], imageBuffer: makeDiagramJpeg() });
const scannedPdf = buildPdf({ pages: [scannedPage], imageBuffer: makeDiagramJpeg() });
const mixedPdf = buildPdf({ pages: [textPage, imagePage], imageBuffer: makeDiagramJpeg() });

await Promise.all([
  fs.writeFile(new URL("./fixtures/extraction-text.pdf", import.meta.url), textPdf),
  fs.writeFile(new URL("./fixtures/extraction-image.pdf", import.meta.url), imagePdf),
  fs.writeFile(new URL("./fixtures/extraction-scanned.pdf", import.meta.url), scannedPdf),
  fs.writeFile(new URL("./fixtures/extraction-mixed.pdf", import.meta.url), mixedPdf),
]);

const textExtraction = await extractPdfContent(textPdf, "text-fixture");
assert.equal(textExtraction.pageCount, 1);
assert.match(textExtraction.pages[0].text, /SECTION A/);
assert.match(textExtraction.pages[0].text, /Define stress/);
assert.ok(textExtraction.pages[0].elements.length > 0);

const imageExtraction = await extractPdfContent(imagePdf, "image-fixture");
assert.match(imageExtraction.pages[0].text, /diagram below/);
assert.ok(imageExtraction.assets.length >= 1);
assert.equal(imageExtraction.pages[0].elements.some((element) => element.type === "image"), true);
const imageDraft = await buildDraftFromPayload({
  id: "image-extraction-draft",
  title: "Image Extraction Draft",
  originalFile: {
    url: "local-fixture://extraction-image.pdf",
    fileName: "extraction-image.pdf",
    mimeType: "application/pdf",
  },
  content: buildDocumentContentFromExtraction(imageExtraction),
  extractedContent: imageExtraction,
  processing: { status: "manual_review", source: "pdf" },
});
assert.equal(imageDraft.questions.length, 0);
assert.equal((imageDraft.extractedContent?.assets || []).length >= 1, true);

const scannedExtraction = await extractPdfContent(scannedPdf, "scanned-fixture");
assert.equal(scannedExtraction.stats.textLength, 0);
assert.equal(scannedExtraction.stats.scannedPageCount, 1);
assert.equal(scannedExtraction.warnings.some((warning) => /OCR is required/i.test(warning)), true);

const mixedExtraction = await extractPdfContent(mixedPdf, "mixed-fixture");
assert.equal(mixedExtraction.pageCount, 2);
assert.equal(mixedExtraction.pages[0].elements[0].type, "text");
assert.equal(mixedExtraction.pages[1].elements.some((element) => element.type === "image"), true);

console.log(JSON.stringify({
  textPdf: {
    pages: textExtraction.pageCount,
    textLength: textExtraction.stats.textLength,
    elements: textExtraction.pages[0].elements.length,
  },
  imagePdf: {
    imagesDetected: imageExtraction.stats.imageCount,
    assets: imageExtraction.assets.length,
    imageAssignedToQuestion: imageDraft.questions.some((question) => question.images?.length),
  },
  scannedPdf: {
    textLength: scannedExtraction.stats.textLength,
    scannedPages: scannedExtraction.stats.scannedPageCount,
    warnings: scannedExtraction.warnings,
  },
  mixedPdf: {
    pages: mixedExtraction.pageCount,
    secondPageElements: mixedExtraction.pages[1].elements.map((element) => element.type),
  },
}, null, 2));
