import express from "express";
import axios from "axios";
import * as pdfParseModule from "pdf-parse";
import crypto from "crypto";
import { authenticateFirebaseUser } from "../middleware/auth.js";
import { admin, db } from "../firebase/firebaseAdmin.js";

const questionsRoutes = express.Router();

const strip = (value) => String(value ?? "").trim();
const randomId = () => crypto.randomUUID();
const pdfParse = pdfParseModule.default ?? pdfParseModule;

const ensureAdmin = (req, res, next) => {
  if (!req.user || req.user.admin !== true) {
    return res.status(403).json({ success: false, error: "Admin access required" });
  }
  next();
};

const normalizeQuestion = (question, index = 0) => {
  const text = strip(question?.text || question?.content || question?.prompt || question?.question || "");
  const subQuestions = Array.isArray(question?.subQuestions)
    ? question.subQuestions.map((item, subIndex) => ({
        id: item?.id || `${question?.id || index}-sub-${subIndex}`,
        number: item?.number ?? subIndex + 1,
        text: strip(item?.text || item?.content || item?.prompt || ""),
        images: Array.isArray(item?.images) ? item.images : [],
      }))
    : [];

  return {
    id: question?.id || `${index + 1}-${randomId()}`,
    number: Number(question?.number ?? index + 1),
    text: text || `Question ${index + 1}`,
    images: Array.isArray(question?.images) ? question.images : [],
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
    status: payload.status || "draft",
    createdBy: payload.createdBy || "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    warnings,
    sourceType: payload.sourceType || "hybrid_document",
  };
};

const parsePdfText = async (pdfBuffer) => {
  if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
    throw new Error("A valid PDF buffer is required for text extraction");
  }

  const parsed = await pdfParse(pdfBuffer);
  return strip(parsed?.text || "");
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

const saveDraftToFirestore = async (payload) => {
  const docId = payload.id || randomId();
  const clean = {
    ...payload,
    id: docId,
    updatedAt: new Date().toISOString(),
    createdAt: payload.createdAt || new Date().toISOString(),
    status: payload.status || "draft",
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

    if (originalUrl && /\.pdf(?:\?|$)/i.test(originalUrl)) {
      try {
        const pdfBuffer = await fetchPdfBuffer(originalUrl);
        rawText = await parsePdfText(pdfBuffer);
      } catch (pdfError) {
        console.warn("[past-questions] PDF parsing failed", pdfError?.message || pdfError);
        warnings.push("PDF extraction was incomplete. Review the generated draft before publishing.");
      }
    }

    const draft = await buildDraftFromPayload({
      ...payload,
      rawText,
      originalFile: payload.originalFile || {
        url: originalUrl,
        publicId: payload.originalFile?.publicId || payload.cloudinaryPublicId || payload.publicId || "",
        fileName: payload.originalFile?.fileName || payload.fileName || payload.name || "paper.pdf",
      },
    });

    if (!draft.questions?.length) {
      warnings.push("No extractable text was found. Please review the original PDF manually.");
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

    const payload = { ...(existing.data() || {}), status: "published", updatedAt: new Date().toISOString() };
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
    await docRef.delete();
    return res.json({ success: true, deletedId: req.params.id });
  } catch (error) {
    console.error("[past-questions] delete failed", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to delete past question" });
  }
});

export default questionsRoutes;
