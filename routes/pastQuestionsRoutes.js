import express from "express";
import axios from "axios";
import * as pdfParseModule from "pdf-parse";
import { getDocument, OPS } from "pdfjs-dist/legacy/build/pdf.mjs";
import { createCanvas, DOMMatrix, ImageData, Path2D } from "@napi-rs/canvas";
import crypto from "crypto";
import { authenticateFirebaseUser } from "../middleware/auth.js";
import { admin, db } from "../firebase/firebaseAdmin.js";
import { deleteCloudinaryAssets, isCloudinaryAdminConfigured } from "../utils/cloudinaryCleanup.js";
import { collectCloudinaryAssets } from "../utils/mediaAssets.js";
import { v2 as cloudinary } from "cloudinary";

const questionsRoutes = express.Router();

const strip = (value) => String(value ?? "").trim();
const randomId = () => crypto.randomUUID();
const pdfParse = pdfParseModule.default ?? pdfParseModule;

if (!globalThis.DOMMatrix) globalThis.DOMMatrix = DOMMatrix;
if (!globalThis.ImageData) globalThis.ImageData = ImageData;
if (!globalThis.Path2D) globalThis.Path2D = Path2D;

const ensureAdmin = (req, res, next) => {
  if (!req.user || req.user.admin !== true) {
    return res.status(403).json({ success: false, error: "Admin access required" });
  }
  next();
};

const buildContentBlocks = (question = {}, fallbackText = "") => {
  const contentBlocks = Array.isArray(question?.content) ? question.content : [];
  if (contentBlocks.length > 0) {
    return contentBlocks.map((block, blockIndex) => {
      if (!block || typeof block !== "object") {
        return { id: `${question?.id || blockIndex}-block-${blockIndex}`, type: "text", value: String(block ?? "") };
      }

      if (block.type === "image" || block.url || block.secure_url || block.previewUrl || block.fileUrl) {
        return {
          id: block.id || `${question?.id || blockIndex}-image-${blockIndex}`,
          type: "image",
          url: block.url || block.secure_url || block.previewUrl || block.fileUrl || "",
          publicId: block.publicId || block.public_id || block.cloudinaryPublicId || "",
          caption: strip(block.caption || block.title || ""),
          questionId: block.questionId || question?.id || "",
        };
      }

      return {
        id: block.id || `${question?.id || blockIndex}-text-${blockIndex}`,
        type: "text",
        value: strip(block.value || block.text || block.content || ""),
      };
    }).filter((block) => block.type === "text" ? block.value : !!block.url);
  }

  const textValue = strip(fallbackText || question?.text || question?.content || question?.prompt || question?.question || "");
  return textValue ? [{ id: `${question?.id || randomId()}-text-0`, type: "text", value: textValue }] : [];
};

const normalizeQuestion = (question, index = 0) => {
  const rawText = strip(question?.text || question?.content || question?.prompt || question?.question || "");
  const text = rawText || `Question ${index + 1}`;
  const subQuestions = Array.isArray(question?.subQuestions)
    ? question.subQuestions.map((item, subIndex) => ({
        id: item?.id || `${question?.id || index}-sub-${subIndex}`,
        number: item?.number ?? subIndex + 1,
        text: strip(item?.text || item?.content || item?.prompt || ""),
        images: Array.isArray(item?.images) ? item.images : [],
      }))
    : [];

  const images = Array.isArray(question?.images) ? question.images : [];
  const content = buildContentBlocks(question, text);

  return {
    id: question?.id || `${index + 1}-${randomId()}`,
    number: Number(question?.number ?? index + 1),
    text,
    content,
    images,
    subQuestions,
  };
};

const normalizeQuestionBlocks = (draft = {}) => {
  const blockList = Array.isArray(draft.questions) ? draft.questions : [];
  if (blockList.length > 0) {
    return blockList.map((item, index) => normalizeQuestion(item, index));
  }

  const text = strip(draft.text || draft.rawText || draft.content || "");
  if (!text) return [];

  const segments = text
    .split(/\n\s*(?:QUESTION|Question)\s*\d+\s*[:\-]?\s*\n?/gi)
    .map((part) => part.trim())
    .filter(Boolean);

  if (segments.length > 1) {
    return segments.map((segment, index) => ({
      id: `${index + 1}-${randomId()}`,
      number: index + 1,
      text: segment,
      images: [],
      subQuestions: [],
    }));
  }

  const paragraphs = text
    .split(/\n{2,}|\r\n\r\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  return paragraphs.map((paragraph, index) => ({
    id: `${index + 1}-${randomId()}`,
    number: index + 1,
    text: paragraph,
    images: [],
    subQuestions: [],
  }));
};

const buildDraftFromPayload = async (payload = {}) => {
  const courseCode = strip(payload.courseCode || payload.course || "");
  const courseTitle = strip(payload.courseTitle || payload.courseName || payload.subject || "");
  const department = strip(payload.department || payload.dept || "");
  const institution = strip(payload.institution || payload.school || "");
  const session = strip(payload.session || payload.semester || "");
  const year = Number(payload.year || 0) || undefined;
  const examType = strip(payload.examType || "Examination");
  const title = strip(payload.title || `${courseCode || "Course"} ${session || year || "Academic"}`);
  const originalFile = payload.originalFile || {
    url: payload.fileUrl || payload.downloadUrl || payload.url || "",
    publicId: payload.cloudinaryPublicId || payload.publicId || "",
    fileName: payload.fileName || payload.name || "paper.pdf",
  };

  const textSource = strip(payload.rawText || payload.text || "");
  const extractedQuestions = normalizeQuestionBlocks({ questions: payload.questions, text: textSource });
  const baseQuestions = extractedQuestions.length ? extractedQuestions : [{
    id: randomId(),
    number: 1,
    text: textSource || "No extracted text was detected. Please review the original PDF and rewrite the question text.",
    images: Array.isArray(payload.images) ? payload.images : [],
    subQuestions: [],
  }];

  const warnings = [];
  if (!textSource) warnings.push("Some content may require review.");
  if (!baseQuestions.length) warnings.push("No question blocks were detected automatically.");

  return {
    id: payload.id || randomId(),
    courseCode,
    courseTitle,
    department,
    institution,
    session,
    year,
    examType,
    title,
    originalFile,
    questions: baseQuestions,
    unassignedVisualAssets: Array.isArray(payload.unassignedVisualAssets) ? payload.unassignedVisualAssets : [],
    status: payload.status || "draft",
    processingStatus: payload.processingStatus || payload.status || "draft",
    createdBy: payload.createdBy || "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    warnings,
    sourceType: payload.sourceType || "hybrid_document",
    hasVisualContent: Boolean(payload.hasVisualContent || baseQuestions.some((entry) => Array.isArray(entry.images) && entry.images.length > 0)),
    visualContentSummary: payload.visualContentSummary || (baseQuestions.some((entry) => Array.isArray(entry.images) && entry.images.length > 0) ? "Diagram and image content detected in the source paper." : "Text-only extraction was detected for this paper."),
  };
};

const parsePdfText = async (pdfBuffer) => {
  if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
    throw new Error("A valid PDF buffer is required for text extraction");
  }

  if (typeof pdfParse === "function") {
    const parsed = await pdfParse(pdfBuffer);
    return strip(String(parsed?.text || "").replace(/--\s*\d+\s+of\s+\d+\s*--/gi, ""));
  }

  if (typeof pdfParseModule.PDFParse === "function") {
    const parser = new pdfParseModule.PDFParse({ data: pdfBuffer });
    try {
      const parsed = await parser.getText();
      return strip(String(parsed?.text || "").replace(/--\s*\d+\s+of\s+\d+\s*--/gi, ""));
    } finally {
      await parser.destroy?.();
    }
  }

  throw new Error("The installed pdf-parse package does not expose a supported text parser");
};

const fetchPdfBuffer = async (pdfUrl) => {
  if (!pdfUrl) {
    throw new Error("No PDF url was provided for processing");
  }

  const response = await axios.get(pdfUrl, {
    responseType: "arraybuffer",
    timeout: 30000,
  });

  if (!response?.data) {
    throw new Error("PDF download returned an empty body");
  }

  return Buffer.isBuffer(response.data) ? response.data : Buffer.from(response.data);
};

const uploadRenderedPage = (pngBuffer, pageNumber, sourceId) => new Promise((resolve, reject) => {
  if (!isCloudinaryAdminConfigured()) {
    resolve(null);
    return;
  }

  const upload = cloudinary.uploader.upload_stream({
    folder: "unihelp/past-questions",
    public_id: `${sourceId || "paper"}-page-${pageNumber}`,
    resource_type: "image",
    overwrite: true,
  }, (error, result) => {
    if (error) reject(error);
    else resolve(result);
  });

  upload.end(pngBuffer);
});

const imageObjectToPng = (imageObject) => {
  const width = Number(imageObject?.width || 0);
  const height = Number(imageObject?.height || 0);
  const source = imageObject?.data;
  if (!width || !height || !source) return null;

  const pixelCount = width * height;
  const rgba = new Uint8ClampedArray(pixelCount * 4);
  if (source.length === pixelCount * 4) {
    rgba.set(source);
  } else if (source.length === pixelCount * 3) {
    for (let index = 0; index < pixelCount; index += 1) {
      const sourceOffset = index * 3;
      const targetOffset = index * 4;
      rgba[targetOffset] = source[sourceOffset];
      rgba[targetOffset + 1] = source[sourceOffset + 1];
      rgba[targetOffset + 2] = source[sourceOffset + 2];
      rgba[targetOffset + 3] = 255;
    }
  } else if (source.length === pixelCount) {
    for (let index = 0; index < pixelCount; index += 1) {
      const value = source[index];
      const targetOffset = index * 4;
      rgba[targetOffset] = value;
      rgba[targetOffset + 1] = value;
      rgba[targetOffset + 2] = value;
      rgba[targetOffset + 3] = 255;
    }
  } else {
    return null;
  }

  const canvas = createCanvas(width, height);
  canvas.getContext("2d").putImageData(new ImageData(rgba, width, height), 0, 0);
  return canvas.toBuffer("image/png");
};

const getResolvedPageObject = (objects, objectId) => new Promise((resolve) => {
  if (!objectId) {
    resolve(null);
    return;
  }

  if (objects.has(objectId)) {
    resolve(objects.get(objectId));
    return;
  }

  objects.get(objectId, (resolvedObject) => resolve(resolvedObject));
});

const extractPdfVisuals = async (pdfBuffer, sourceId = randomId()) => {
  if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
    throw new Error("A valid PDF buffer is required for visual extraction");
  }

  const pdf = await getDocument({ data: new Uint8Array(pdfBuffer), disableWorker: true }).promise;
  const pages = [];
  let hasScannedPage = false;

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const [textContent, operatorList] = await Promise.all([
      page.getTextContent(),
      page.getOperatorList(),
    ]);
    const text = strip((textContent.items || []).map((item) => item.str || "").join(" "));
    const imageCount = operatorList.fnArray.filter((operator) => (
      operator === OPS.paintImageXObject || operator === OPS.paintImageXObjectRepeat
    )).length;
    const isScanned = !text && imageCount > 0;
    if (isScanned) hasScannedPage = true;

    if (imageCount > 0 || isScanned) {
      const imageOperatorIndex = operatorList.fnArray.findIndex((operator) => (
        operator === OPS.paintImageXObject || operator === OPS.paintImageXObjectRepeat
      ));
      const imageName = imageOperatorIndex >= 0 ? operatorList.argsArray[imageOperatorIndex]?.[0] : null;
      const imageObject = await getResolvedPageObject(page.objs, imageName);
      const pngBuffer = imageObjectToPng(imageObject);
      const uploaded = pngBuffer ? await uploadRenderedPage(pngBuffer, pageNumber, sourceId) : null;
      pages.push({
        pageNumber,
        text,
        imageCount,
        isScanned,
        extracted: true,
        extractedImageDimensions: imageObject ? { width: imageObject.width, height: imageObject.height } : null,
        asset: uploaded ? {
          id: `${sourceId}-page-${pageNumber}`,
          url: uploaded.secure_url || uploaded.url || "",
          publicId: uploaded.public_id || "",
          resourceType: uploaded.resource_type || "image",
          fileName: `${sourceId}-page-${pageNumber}.png`,
          caption: `Visual content from page ${pageNumber}`,
          pageNumber,
        } : null,
      });
    }
  }

  return {
    pages,
    pageCount: pdf.numPages,
    hasScannedPage,
    cloudinaryConfigured: isCloudinaryAdminConfigured(),
  };
};

const attachVisualsToQuestions = (questions, visualPages = []) => {
  if (!visualPages.length || !questions.length) return questions;
  const hasExplicitQuestionNumbers = visualPages.some((page) => (
    /(?:question|q\.?)[\s#:-]*\d+/i.test(page.text || "")
  ));
  const questionNumbers = new Set(questions.map((question, index) => Number(question.number || index + 1)));
  const assignments = new Map();

  visualPages.forEach((page, pageIndex) => {
    const pageQuestionNumbers = [...page.text.matchAll(/(?:question|q\.?)[\s#:-]*(\d+)/gi)]
      .map((match) => Number(match[1]))
      .filter((number) => questionNumbers.has(number));
    const targetNumber = pageQuestionNumbers.length === 1
      ? pageQuestionNumbers[0]
      : pageQuestionNumbers.length === 0 && !hasExplicitQuestionNumbers
        ? Number(questions[pageIndex]?.number || pageIndex + 1)
        : null;
    if (targetNumber) {
      assignments.set(targetNumber, [...(assignments.get(targetNumber) || []), page]);
    }
  });

  return questions.map((question, questionIndex) => {
    const questionNumber = Number(question.number || questionIndex + 1);
    const images = (assignments.get(questionNumber) || []).map((page) => page.asset).filter(Boolean);
    if (!images.length) return question;
    return {
      ...question,
      images: [...(question.images || []), ...images],
      content: [
        ...(question.content || []),
        ...images.map((image) => ({
          id: image.id,
          type: "image",
          url: image.url,
          publicId: image.publicId,
          caption: image.caption,
          questionId: question.id,
        })),
      ],
    };
  });
};

const saveDraftToFirestore = async (payload) => {
  const docId = payload.id || randomId();
  const clean = {
    ...payload,
    id: docId,
    updatedAt: new Date().toISOString(),
    createdAt: payload.createdAt || new Date().toISOString(),
    status: payload.status || "draft",
    processingStatus: payload.processingStatus || payload.status || "draft",
  };

  if (!db) {
    return clean;
  }

  const ref = db.collection("questions").doc(docId);
  await ref.set(clean, { merge: true });
  return { ...clean, firestoreId: docId };
};

questionsRoutes.get("/", authenticateFirebaseUser, async (req, res) => {
  try {
    if (!db) {
      return res.json({ items: [], total: 0, hasMore: false });
    }

    const snapshot = await db.collection("questions").orderBy("createdAt", "desc").limit(100).get();
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return res.json({ items, total: items.length, hasMore: false });
  } catch (error) {
    console.error("[past-questions] list failed", error);
    return res.status(500).json({ success: false, error: "Unable to fetch past questions" });
  }
});

questionsRoutes.get("/:id", authenticateFirebaseUser, async (req, res) => {
  try {
    if (!db) {
      return res.status(404).json({ success: false, error: "Past question collection is unavailable" });
    }

    const doc = await db.collection("questions").doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, error: "Past question not found" });
    }
    return res.json({ success: true, item: { id: doc.id, ...doc.data() } });
  } catch (error) {
    console.error("[past-questions] fetch failed", error);
    return res.status(500).json({ success: false, error: "Unable to load past question" });
  }
});

questionsRoutes.post("/process", authenticateFirebaseUser, ensureAdmin, async (req, res) => {
  try {
    const payload = req.body || {};
    const originalUrl = strip(payload.originalFile?.url || payload.fileUrl || payload.downloadUrl || payload.url || "");
    let rawText = strip(payload.rawText || payload.text || "");
    let warnings = [];
    let visualExtraction = {
      pages: [],
      pageCount: 0,
      hasScannedPage: false,
      cloudinaryConfigured: isCloudinaryAdminConfigured(),
    };

    if (originalUrl && /\.pdf(?:\?|$)/i.test(originalUrl)) {
      try {
        const pdfBuffer = await fetchPdfBuffer(originalUrl);
        rawText = await parsePdfText(pdfBuffer);
        visualExtraction = await extractPdfVisuals(pdfBuffer, payload.id || randomId());
        if (visualExtraction.hasScannedPage) {
          warnings.push("One or more scanned pages have been preserved visually but require manual text review because OCR is not configured.");
        }
        if (visualExtraction.pages.some((page) => page.imageCount > 0) && !visualExtraction.cloudinaryConfigured) {
          warnings.push("Visual pages were detected, but Cloudinary is not configured, so extracted visual assets could not be uploaded.");
        }
      } catch (pdfError) {
        console.warn("[past-questions] PDF parsing failed", pdfError?.message || pdfError);
        warnings.push("PDF extraction was incomplete. Review the generated draft before publishing.");
      }
    }

    const baseDraft = await buildDraftFromPayload({
      ...payload,
      rawText,
      status: "review_required",
      processingStatus: "review_required",
      originalFile: payload.originalFile || {
        url: originalUrl,
        publicId: payload.originalFile?.publicId || payload.cloudinaryPublicId || payload.publicId || "",
        fileName: payload.originalFile?.fileName || payload.fileName || payload.name || "paper.pdf",
      },
    });
    const associatedQuestions = attachVisualsToQuestions(baseDraft.questions || [], visualExtraction.pages);
    const assignedAssetKeys = new Set(associatedQuestions.flatMap((question) => (
      Array.isArray(question.images) ? question.images.map((image) => image.publicId || image.url).filter(Boolean) : []
    )));
    const unassignedVisualAssets = visualExtraction.pages
      .map((page) => page.asset)
      .filter((asset) => asset && !assignedAssetKeys.has(asset.publicId || asset.url));
    const draft = {
      ...baseDraft,
      questions: associatedQuestions,
      unassignedVisualAssets,
      hasVisualContent: Boolean(baseDraft.hasVisualContent || visualExtraction.pages.length),
      visualContentSummary: visualExtraction.pages.length
        ? `${visualExtraction.pages.length} visual page asset(s) extracted from the source PDF.`
        : baseDraft.visualContentSummary,
      visualExtraction: {
        pageCount: visualExtraction.pageCount,
        visualPageCount: visualExtraction.pages.length,
        extractedAssetCount: visualExtraction.pages.filter((page) => page.asset?.url).length,
        unassignedAssetCount: unassignedVisualAssets.length,
        scannedPageCount: visualExtraction.pages.filter((page) => page.isScanned).length,
        cloudinaryConfigured: visualExtraction.cloudinaryConfigured,
      },
    };

    if (!draft.questions?.length) {
      warnings.push("No extractable text was found. Please review the original PDF manually.");
    }
    if (unassignedVisualAssets.length) {
      warnings.push("Some visual pages contain multiple question markers and were preserved for manual question association.");
    }

    if (warnings.length) {
      draft.warnings = Array.from(new Set([...(draft.warnings || []), ...warnings]));
    }

    return res.status(200).json({
      success: true,
      draft,
      warnings: draft.warnings || [],
      processing: {
        status: "review_required",
        message: "The generated draft is ready for admin review.",
      },
    });
  } catch (error) {
    console.error("[past-questions] process failed", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to process past question PDF" });
  }
});

questionsRoutes.post("/", authenticateFirebaseUser, ensureAdmin, async (req, res) => {
  try {
    const payload = await buildDraftFromPayload(req.body || {});
    const saved = await saveDraftToFirestore(payload);
    return res.status(201).json({ success: true, item: saved });
  } catch (error) {
    console.error("[past-questions] create failed", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to save past question draft" });
  }
});

questionsRoutes.put("/:id", authenticateFirebaseUser, ensureAdmin, async (req, res) => {
  try {
    const payload = await buildDraftFromPayload({ ...(req.body || {}), id: req.params.id });
    const saved = await saveDraftToFirestore(payload);
    return res.json({ success: true, item: saved });
  } catch (error) {
    console.error("[past-questions] update failed", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to update past question" });
  }
});

questionsRoutes.post("/:id/publish", authenticateFirebaseUser, ensureAdmin, async (req, res) => {
  try {
    const docRef = db ? db.collection("questions").doc(req.params.id) : null;
    if (!docRef) {
      return res.status(503).json({ success: false, error: "Past question database is unavailable" });
    }

    const existing = await docRef.get();
    if (!existing.exists) {
      return res.status(404).json({ success: false, error: "Past question not found" });
    }

    const payload = {
      ...(existing.data() || {}),
      status: "published",
      processingStatus: "published",
      updatedAt: new Date().toISOString(),
    };
    await docRef.set(payload, { merge: true });
    return res.json({ success: true, item: { id: req.params.id, ...payload } });
  } catch (error) {
    console.error("[past-questions] publish failed", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to publish past question" });
  }
});

questionsRoutes.delete("/:id", authenticateFirebaseUser, ensureAdmin, async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: "Past question database is unavailable" });
    }

    const docRef = db.collection("questions").doc(req.params.id);
    const existing = await docRef.get();
    if (!existing.exists) {
      return res.status(404).json({ success: false, error: "Past question not found" });
    }

    const data = existing.data() || {};
    const gatheredAssets = [
      ...(Array.isArray(data.questions) ? data.questions.flatMap((question) => Array.isArray(question.images) ? question.images : []) : []),
      ...(data.originalFile ? [data.originalFile] : []),
    ];
    const assets = collectCloudinaryAssets(gatheredAssets);
    if (assets.length) {
      await deleteCloudinaryAssets(assets);
    }

    await docRef.delete();
    return res.json({ success: true, deletedId: req.params.id, deletedAssets: assets.length });
  } catch (error) {
    console.error("[past-questions] delete failed", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to delete past question" });
  }
});

export {
  buildDraftFromPayload,
  normalizeQuestion,
  normalizeQuestionBlocks,
  parsePdfText,
  fetchPdfBuffer,
  extractPdfVisuals,
  attachVisualsToQuestions,
  saveDraftToFirestore,
};

export default questionsRoutes;
