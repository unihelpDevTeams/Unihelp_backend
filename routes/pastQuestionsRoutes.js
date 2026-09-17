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
import { convertPastQuestionExtractionWithGemini } from "../services/pastQuestionGeminiConversionService.js";
import { v2 as cloudinary } from "cloudinary";

const questionsRoutes = express.Router();

const strip = (value) => String(value ?? "").trim();
const randomId = () => crypto.randomUUID();
const pdfParse = pdfParseModule.default ?? pdfParseModule;
const DOCUMENT_BLOCK_TYPES = new Set([
  "heading",
  "paragraph",
  "instruction",
  "question",
  "subquestion",
  "image",
  "diagram",
  "table",
  "equation",
  "numbered-list",
  "bullet-list",
  "caption",
  "note",
  "divider",
  "page-break",
  "section",
]);
const DOCUMENT_STATUS_VALUES = new Set(["draft", "published"]);
const PROCESSING_STATUS_VALUES = new Set(["pending", "processing", "ready", "failed", "manual_review", "conversion_blocked"]);
const TEXT_BLOCK_TYPES = new Set(["heading", "paragraph", "instruction", "caption", "note"]);
const VISUAL_BLOCK_TYPES = new Set(["image", "diagram"]);
const LIST_BLOCK_TYPES = new Set(["numbered-list", "bullet-list"]);

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

const normalizeBlockType = (value) => {
  const type = strip(value || "paragraph").toLowerCase().replace(/_/g, "-");
  if (type === "text") return "paragraph";
  if (type === "list") return "bullet-list";
  if (type === "pagebreak") return "page-break";
  return type;
};

const guessMimeType = (file = {}) => {
  const explicit = strip(file.mimeType || file.type || file.contentType);
  if (explicit) return explicit;
  const url = strip(file.url || file.fileUrl || file.downloadUrl || "");
  const fileName = strip(file.fileName || file.name || "");
  const source = `${url} ${fileName}`.toLowerCase();
  if (/\.pdf(?:\?|$|\s)/i.test(source)) return "application/pdf";
  if (/\.(jpe?g)(?:\?|$|\s)/i.test(source)) return "image/jpeg";
  if (/\.png(?:\?|$|\s)/i.test(source)) return "image/png";
  if (/\.webp(?:\?|$|\s)/i.test(source)) return "image/webp";
  return "";
};

const normalizeOriginalFile = (payload = {}) => {
  const source = payload.originalFile || {
    url: payload.fileUrl || payload.downloadUrl || payload.url || "",
    publicId: payload.cloudinaryPublicId || payload.publicId || "",
    fileName: payload.fileName || payload.name || "paper.pdf",
    resourceType: payload.cloudinaryResourceType || payload.resourceType || "",
    mimeType: payload.fileType || payload.mimeType || "",
  };

  return {
    url: strip(source.url || source.secure_url || source.fileUrl || source.downloadUrl || ""),
    publicId: strip(source.publicId || source.public_id || source.cloudinaryPublicId || ""),
    fileName: strip(source.fileName || source.name || source.original_filename || "paper.pdf"),
    mimeType: guessMimeType(source),
    resourceType: strip(source.resourceType || source.resource_type || source.cloudinaryResourceType || ""),
    size: Number(source.size || source.fileSize || source.bytes || 0) || 0,
  };
};

const normalizeAsset = (asset = {}, index = 0, fallback = {}) => {
  if (!asset || typeof asset !== "object") return null;
  const url = strip(asset.url || asset.secure_url || asset.fileUrl || asset.downloadUrl || fallback.url || "");
  const publicId = strip(asset.publicId || asset.public_id || asset.cloudinaryPublicId || fallback.publicId || "");
  if (!url && !publicId) return null;

  return {
    id: strip(asset.assetId || fallback.id || asset.id || `asset-${index}-${randomId()}`),
    type: normalizeBlockType(asset.type || asset.kind || fallback.type || "image"),
    url,
    publicId,
    fileName: strip(asset.fileName || asset.name || fallback.fileName || ""),
    mimeType: guessMimeType(asset),
    resourceType: strip(asset.resourceType || asset.resource_type || asset.cloudinaryResourceType || fallback.resourceType || "image"),
    caption: strip(asset.caption || fallback.caption || ""),
    altText: strip(asset.altText || asset.alt || fallback.altText || ""),
    pageNumber: Number(asset.pageNumber || fallback.pageNumber || 0) || undefined,
    source: strip(asset.source || fallback.source || ""),
  };
};

const upsertAsset = (assets, asset) => {
  if (!asset) return "";
  const key = asset.id || asset.publicId || asset.url;
  const existingIndex = assets.findIndex((entry) => (
    entry.id === asset.id ||
    (asset.publicId && entry.publicId === asset.publicId) ||
    (asset.url && entry.url === asset.url)
  ));
  if (existingIndex >= 0) {
    assets[existingIndex] = { ...assets[existingIndex], ...asset, id: assets[existingIndex].id || asset.id };
    return assets[existingIndex].id;
  }
  assets.push(asset);
  return asset.id || key;
};

const normalizeDocumentBlock = (block, index = 0, assets = [], parentId = "doc") => {
  if (typeof block === "string") {
    return {
      id: `${parentId}-paragraph-${index}-${randomId()}`,
      type: "paragraph",
      order: index,
      text: strip(block),
    };
  }

  if (!block || typeof block !== "object") {
    return {
      id: `${parentId}-paragraph-${index}-${randomId()}`,
      type: "paragraph",
      order: index,
      text: strip(block),
    };
  }

  const type = normalizeBlockType(block.type);
  if (!DOCUMENT_BLOCK_TYPES.has(type)) {
    throw new Error(`Unsupported document block type: ${block.type || type}`);
  }

  const id = strip(block.id || `${parentId}-${type}-${index}-${randomId()}`);
  const normalized = {
    id,
    type,
    order: Number(block.order ?? index),
  };
  if (block.pageNumber !== undefined) {
    normalized.pageNumber = Number(block.pageNumber) || undefined;
  }
  if (block.position && typeof block.position === "object") {
    normalized.position = block.position;
  }
  if (block.sourceElementId) {
    normalized.sourceElementId = strip(block.sourceElementId);
  }

  if (TEXT_BLOCK_TYPES.has(type)) {
    normalized.text = strip(block.text || block.value || block.content || "");
    if (type === "heading") {
      normalized.level = Math.min(Math.max(Number(block.level || 1), 1), 6);
    }
  }

  if (type === "equation") {
    normalized.value = strip(block.value || block.text || block.content || "");
    normalized.format = strip(block.format || "plain");
  }

  if (LIST_BLOCK_TYPES.has(type)) {
    normalized.items = Array.isArray(block.items)
      ? block.items.map((item) => strip(typeof item === "object" ? item.text || item.value : item)).filter(Boolean)
      : [];
  }

  if (type === "table") {
    normalized.columns = Array.isArray(block.columns) ? block.columns.map((item) => strip(item)) : [];
    normalized.rows = Array.isArray(block.rows) ? block.rows : [];
    normalized.caption = strip(block.caption || "");
  }

  if (VISUAL_BLOCK_TYPES.has(type)) {
    const asset = normalizeAsset(block, assets.length, {
      id: block.assetId || block.id,
      type,
      caption: block.caption,
      altText: block.altText,
    });
    const assetId = strip(block.assetId || asset?.id || "");
    normalized.assetId = assetId || id;
    normalized.url = strip(block.url || block.secure_url || block.previewUrl || block.fileUrl || asset?.url || "");
    normalized.publicId = strip(block.publicId || block.public_id || block.cloudinaryPublicId || asset?.publicId || "");
    normalized.caption = strip(block.caption || asset?.caption || "");
    normalized.altText = strip(block.altText || block.alt || asset?.altText || "");
    if (asset?.pageNumber && !normalized.pageNumber) {
      normalized.pageNumber = asset.pageNumber;
    }
    upsertAsset(assets, asset || normalizeAsset({
      id: normalized.assetId,
      type,
      url: normalized.url,
      publicId: normalized.publicId,
      caption: normalized.caption,
      altText: normalized.altText,
    }, assets.length));
  }

  if (type === "question" || type === "subquestion") {
    normalized.number = strip(block.number ?? block.label ?? index + 1);
    const nested = Array.isArray(block.blocks)
      ? block.blocks
      : Array.isArray(block.content)
        ? block.content
        : [];
    const fallbackText = strip(block.text || block.value || block.prompt || "");
    const nestedBlocks = nested.map((item, blockIndex) => normalizeDocumentBlock(item, blockIndex, assets, id));
    normalized.blocks = fallbackText
      ? [{ id: `${id}-prompt`, type: "paragraph", order: 0, text: fallbackText }, ...nestedBlocks.map((item) => ({ ...item, order: item.order + 1 }))]
      : nestedBlocks;
  }

  if (type === "section") {
    normalized.text = strip(block.text || block.title || block.value || block.content || "");
    const nested = Array.isArray(block.blocks)
      ? block.blocks
      : Array.isArray(block.content)
        ? block.content
        : [];
    normalized.blocks = nested.map((item, blockIndex) => normalizeDocumentBlock(item, blockIndex, assets, id));
  }

  return normalized;
};

const convertLegacyQuestionToDocumentBlock = (question = {}, index = 0, assets = []) => {
  const questionId = strip(question.id || `question-${index + 1}-${randomId()}`);
  const blocks = [];
  const text = strip(question.text || question.content || question.prompt || question.question || "");
  if (text) {
    blocks.push({ id: `${questionId}-text`, type: "paragraph", order: blocks.length, text });
  }

  const contentBlocks = Array.isArray(question.content) ? question.content : [];
  contentBlocks.forEach((block) => {
    if (block?.type === "image" || block?.url || block?.secure_url || block?.previewUrl || block?.fileUrl) return;
    const textValue = strip(block?.value || block?.text || block?.content || "");
    if (textValue && textValue !== text) {
      blocks.push({ id: block.id || `${questionId}-text-${blocks.length}`, type: "paragraph", order: blocks.length, text: textValue });
    }
  });

  const images = [
    ...(Array.isArray(question.images) ? question.images : []),
    ...contentBlocks.filter((block) => block?.type === "image" || block?.url || block?.secure_url || block?.previewUrl || block?.fileUrl),
  ];
  images.forEach((image, imageIndex) => {
    const asset = normalizeAsset(image, assets.length, {
      id: image?.id || `${questionId}-image-${imageIndex}`,
      type: "image",
      source: "legacy_question",
    });
    const assetId = upsertAsset(assets, asset);
    if (assetId) {
      blocks.push({
        id: `${questionId}-image-${imageIndex}`,
        type: "image",
        order: blocks.length,
        assetId,
        url: asset.url,
        publicId: asset.publicId,
        caption: asset.caption,
        altText: asset.altText,
      });
    }
  });

  if (Array.isArray(question.subQuestions)) {
    question.subQuestions.forEach((subQuestion, subIndex) => {
      blocks.push(convertLegacyQuestionToDocumentBlock({ ...subQuestion, images: subQuestion.images || [] }, subIndex, assets));
      blocks[blocks.length - 1].type = "subquestion";
      blocks[blocks.length - 1].order = blocks.length - 1;
    });
  }

  return {
    id: questionId,
    type: "question",
    order: index,
    number: strip(question.number ?? index + 1),
    blocks,
  };
};

const normalizeDocumentContent = (payload = {}, questions = []) => {
  const assets = Array.isArray(payload.assets)
    ? payload.assets.map((asset, index) => normalizeAsset(asset, index)).filter(Boolean)
    : [];
  const sourceBlocks = Array.isArray(payload.content) && payload.content.length
    ? payload.content
    : questions.map((question, index) => convertLegacyQuestionToDocumentBlock(question, index, assets));

  const content = sourceBlocks.map((block, index) => normalizeDocumentBlock(block, index, assets));
  return { content, assets };
};

const collectTextFromDocumentBlocks = (blocks = []) => {
  const lines = [];
  blocks.forEach((block) => {
    if (!block || typeof block !== "object") return;
    if (block.text) lines.push(block.text);
    if (block.value) lines.push(block.value);
    if (Array.isArray(block.items) && block.items.length) lines.push(block.items.join("\n"));
    if (Array.isArray(block.blocks)) lines.push(...collectTextFromDocumentBlocks(block.blocks));
  });
  return lines.filter(Boolean);
};

const collectImagesFromDocumentBlocks = (blocks = [], assetsById = new Map()) => {
  const images = [];
  blocks.forEach((block) => {
    if (!block || typeof block !== "object") return;
    if (VISUAL_BLOCK_TYPES.has(block.type)) {
      const asset = assetsById.get(block.assetId) || {};
      images.push({
        id: block.id,
        url: block.url || asset.url || "",
        publicId: block.publicId || asset.publicId || "",
        caption: block.caption || asset.caption || "",
        assetId: block.assetId || asset.id || "",
      });
    }
    if (Array.isArray(block.blocks)) {
      images.push(...collectImagesFromDocumentBlocks(block.blocks, assetsById));
    }
  });
  return images.filter((image) => image.url || image.publicId);
};

const deriveQuestionsFromDocumentContent = (content = [], assets = []) => {
  const assetsById = new Map(assets.map((asset) => [asset.id, asset]));
  return content
    .filter((block) => block?.type === "question")
    .map((block, index) => ({
      id: block.id || `${index + 1}-${randomId()}`,
      number: Number(block.number) || index + 1,
      text: collectTextFromDocumentBlocks(block.blocks || []).join("\n\n") || `Question ${block.number || index + 1}`,
      content: (block.blocks || []).map((item) => {
        if (VISUAL_BLOCK_TYPES.has(item.type)) {
          const asset = assetsById.get(item.assetId) || {};
          return {
            id: item.id,
            type: "image",
            url: item.url || asset.url || "",
            publicId: item.publicId || asset.publicId || "",
            caption: item.caption || asset.caption || "",
            questionId: block.id,
          };
        }
        return {
          id: item.id,
          type: "text",
          value: item.text || item.value || "",
        };
      }).filter((item) => item.type === "image" ? item.url : item.value),
      images: collectImagesFromDocumentBlocks(block.blocks || [], assetsById),
      subQuestions: (block.blocks || [])
        .filter((item) => item.type === "subquestion")
        .map((item, subIndex) => ({
          id: item.id,
          number: item.number || subIndex + 1,
          text: collectTextFromDocumentBlocks(item.blocks || []).join("\n\n"),
          images: collectImagesFromDocumentBlocks(item.blocks || [], assetsById),
        })),
    }));
};

const buildDocumentContentFromExtraction = (extraction = {}) => {
  const content = [];
  (extraction.pages || []).forEach((page, pageIndex) => {
    if (pageIndex > 0) {
      content.push({
        id: `page-${page.pageNumber}-break`,
        type: "page-break",
        order: content.length,
        pageNumber: page.pageNumber,
      });
    }

    (page.elements || []).forEach((element) => {
      if (element.type === "text" && strip(element.text)) {
        content.push({
          id: element.id,
          type: "paragraph",
          order: content.length,
          text: element.text,
          pageNumber: element.pageNumber,
          position: element.position,
          sourceElementId: element.id,
        });
      }

      if (element.type === "image") {
        const asset = (extraction.assets || []).find((entry) => entry.id === element.assetId) || {};
        content.push({
          id: element.id,
          type: "image",
          order: content.length,
          assetId: element.assetId,
          url: asset.url || "",
          publicId: asset.publicId || "",
          caption: asset.caption || "",
          altText: asset.altText || "",
          pageNumber: element.pageNumber,
          position: element.position,
          sourceElementId: element.id,
        });
      }
    });
  });
  return content;
};

const sanitizeGeminiBlock = (block, index = 0, validAssetIds = new Set(), warnings = [], parentId = "gemini") => {
  if (!block || typeof block !== "object") {
    warnings.push("Gemini returned a non-object content block.");
    return null;
  }

  const type = normalizeBlockType(block.type);
  if (!DOCUMENT_BLOCK_TYPES.has(type)) {
    warnings.push(`Gemini returned unsupported block type: ${block.type || "unknown"}.`);
    return null;
  }

  const id = strip(block.id || `${parentId}-${type}-${index}-${randomId()}`);
  const output = {
    id,
    type,
    order: index,
  };

  if (block.pageNumber !== undefined) output.pageNumber = Number(block.pageNumber) || undefined;
  if (block.sourceElementId) output.sourceElementId = strip(block.sourceElementId);

  if (TEXT_BLOCK_TYPES.has(type)) {
    const text = strip(block.text || block.value || block.content || "");
    if (!text) {
      warnings.push(`Gemini returned an empty ${type} block.`);
      return null;
    }
    output.text = text;
    if (type === "heading") {
      output.level = Math.min(Math.max(Number(block.level || 1), 1), 6);
    }
    return output;
  }

  if (type === "equation") {
    const value = strip(block.value || block.text || block.content || "");
    if (!value) {
      warnings.push("Gemini returned an empty equation block.");
      return null;
    }
    output.value = value;
    output.format = strip(block.format || "plain");
    return output;
  }

  if (LIST_BLOCK_TYPES.has(type)) {
    output.items = Array.isArray(block.items)
      ? block.items.map((item) => strip(typeof item === "object" ? item.text || item.value : item)).filter(Boolean)
      : [];
    if (!output.items.length) {
      warnings.push(`Gemini returned an empty ${type} block.`);
      return null;
    }
    return output;
  }

  if (type === "table") {
    output.columns = Array.isArray(block.columns) ? block.columns.map((item) => strip(item)) : [];
    output.rows = Array.isArray(block.rows) ? block.rows : [];
    output.caption = strip(block.caption || "");
    if (!output.rows.length) {
      warnings.push("Gemini returned a table without rows.");
    }
    return output;
  }

  if (VISUAL_BLOCK_TYPES.has(type)) {
    const assetId = strip(block.assetId || block.id || "");
    if (!assetId || !validAssetIds.has(assetId)) {
      warnings.push(`Gemini returned an invalid asset reference: ${assetId || "missing"}.`);
      return null;
    }
    output.assetId = assetId;
    output.caption = strip(block.caption || "");
    output.altText = strip(block.altText || block.alt || "");
    return output;
  }

  if (type === "section") {
    output.text = strip(block.text || block.title || block.value || "");
    const nested = Array.isArray(block.blocks)
      ? block.blocks
      : Array.isArray(block.content)
        ? block.content
        : [];
    output.blocks = nested
      .map((item, blockIndex) => sanitizeGeminiBlock(item, blockIndex, validAssetIds, warnings, id))
      .filter(Boolean)
      .map((item, order) => ({ ...item, order }));
    if (!output.text && !output.blocks.length) {
      warnings.push("Gemini returned an empty section block.");
      return null;
    }
    return output;
  }

  if (type === "question" || type === "subquestion") {
    output.number = strip(block.number ?? block.label ?? "");
    if (!output.number) {
      warnings.push(`Gemini returned a ${type} without a number.`);
    }
    const nested = Array.isArray(block.blocks)
      ? block.blocks
      : Array.isArray(block.content)
        ? block.content
        : [];
    const fallbackText = strip(block.text || block.prompt || "");
    const blocks = [];
    if (fallbackText) {
      blocks.push({
        id: `${id}-prompt`,
        type: "paragraph",
        order: blocks.length,
        text: fallbackText,
      });
    }
    nested.forEach((item, blockIndex) => {
      const sanitized = sanitizeGeminiBlock(item, blocks.length || blockIndex, validAssetIds, warnings, id);
      if (sanitized) blocks.push({ ...sanitized, order: blocks.length });
    });
    if (!blocks.length) {
      warnings.push(`Gemini returned an empty ${type} block.`);
      return null;
    }
    output.blocks = blocks;
    return output;
  }

  return output;
};

const validateGeminiDocumentContent = (blocks = [], assets = []) => {
  const warnings = [];
  if (!Array.isArray(blocks)) {
    throw new Error("Gemini conversion content must be an array.");
  }
  const validAssetIds = new Set((assets || []).map((asset) => asset.id).filter(Boolean));
  const sanitized = blocks
    .map((block, index) => sanitizeGeminiBlock(block, index, validAssetIds, warnings))
    .filter(Boolean)
    .map((block, order) => ({ ...block, order }));

  const normalized = normalizeDocumentContent({ content: sanitized, assets }, []);
  return {
    content: normalized.content,
    assets: normalized.assets,
    warnings: Array.from(new Set(warnings)),
  };
};

const collectDocumentValidationErrors = (blocks = [], assets = [], path = "content", seenIds = new Set()) => {
  const errors = [];
  const assetIds = new Set((assets || []).map((asset) => asset.id).filter(Boolean));
  blocks.forEach((block, index) => {
    const label = `${path}[${index}]`;
    if (!block?.id) errors.push(`${label} is missing an id.`);
    if (block?.id && seenIds.has(block.id)) errors.push(`${label} has a duplicate id.`);
    if (block?.id) seenIds.add(block.id);
    if (!DOCUMENT_BLOCK_TYPES.has(block?.type)) errors.push(`${label} has an unsupported type.`);
    if (Number(block?.order) !== index) errors.push(`${label} has an invalid order.`);
    if (VISUAL_BLOCK_TYPES.has(block?.type)) {
      if (!block.assetId) errors.push(`${label} is missing assetId.`);
      if (block.assetId && !assetIds.has(block.assetId)) errors.push(`${label} references a missing asset.`);
    }
    if (block?.type === "table") {
      const columns = Array.isArray(block.columns) ? block.columns : [];
      const rows = Array.isArray(block.rows) ? block.rows : [];
      if (!Array.isArray(block.columns) || !Array.isArray(block.rows)) {
        errors.push(`${label} has an invalid table structure.`);
      }
      rows.forEach((row, rowIndex) => {
        if (!Array.isArray(row) || (columns.length && row.length !== columns.length)) {
          errors.push(`${label}.rows[${rowIndex}] does not match the table columns.`);
        }
      });
    }
    if (Array.isArray(block?.blocks)) {
      errors.push(...collectDocumentValidationErrors(block.blocks, assets, `${label}.blocks`, seenIds));
    }
  });
  return errors;
};

const normalizeProcessingState = (payload = {}, warnings = [], status = "draft") => {
  const processing = payload.processing && typeof payload.processing === "object" ? payload.processing : {};
  const legacyStatus = strip(payload.processingStatus || payload.status || "");
  const requestedStatus = normalizeBlockType(processing.status || legacyStatus || (status === "published" ? "ready" : "pending"));
  const normalizedStatus = requestedStatus === "review-required" || requestedStatus === "review_required"
    ? "manual_review"
    : requestedStatus === "published"
      ? "ready"
      : requestedStatus;

  return {
    ...processing,
    status: PROCESSING_STATUS_VALUES.has(normalizedStatus) ? normalizedStatus : "pending",
    source: strip(processing.source || payload.processingSource || "pdf"),
    warnings: Array.from(new Set([
      ...(Array.isArray(processing.warnings) ? processing.warnings.map(strip).filter(Boolean) : []),
      ...(Array.isArray(warnings) ? warnings.map(strip).filter(Boolean) : []),
    ])),
    error: processing.error || payload.processingError || null,
    updatedAt: processing.updatedAt || new Date().toISOString(),
  };
};

const normalizeDocumentStatus = (value) => {
  const status = strip(value || "draft").toLowerCase();
  return DOCUMENT_STATUS_VALUES.has(status) ? status : "draft";
};

const buildDraftFromPayload = async (payload = {}) => {
  const courseCode = strip(payload.courseCode || payload.course || "");
  const courseTitle = strip(payload.courseTitle || payload.courseName || payload.subject || "");
  const department = strip(payload.department || payload.dept || "");
  const institution = strip(payload.institution || payload.school || "");
  const session = strip(payload.session || payload.semester || "");
  const examSession = strip(payload.examSession || session || "");
  const year = Number(payload.year || 0) || undefined;
  const examType = strip(payload.examType || "Examination");
  const title = strip(payload.title || `${courseCode || "Course"} ${session || year || "Academic"}`);
  const originalFile = normalizeOriginalFile(payload);
  const status = normalizeDocumentStatus(payload.status);

  const textSource = strip(payload.rawText || payload.text || "");
  const hasNativeContent = Array.isArray(payload.content) && payload.content.length > 0;
  const extractedQuestions = hasNativeContent ? [] : normalizeQuestionBlocks({ questions: payload.questions, text: textSource });
  const baseQuestions = extractedQuestions.length ? extractedQuestions : (hasNativeContent ? [] : [{
    id: randomId(),
    number: 1,
    text: textSource || "No extracted text was detected. Please review the original PDF and rewrite the question text.",
    images: Array.isArray(payload.images) ? payload.images : [],
    subQuestions: [],
  }]);
  const { content, assets } = normalizeDocumentContent(payload, baseQuestions);
  const derivedQuestions = deriveQuestionsFromDocumentContent(content, assets);
  const validationErrors = collectDocumentValidationErrors(content, assets);
  if (validationErrors.length) {
    throw new Error(`Invalid document content: ${validationErrors.slice(0, 5).join(" ")}`);
  }
  const questions = hasNativeContent ? derivedQuestions : (baseQuestions.length ? baseQuestions : derivedQuestions);

  const warnings = [];
  if (!textSource) warnings.push("Some content may require review.");
  if (!questions.length && !content.length) warnings.push("No document content blocks were detected automatically.");
  const processing = normalizeProcessingState(payload, warnings, status);
  const createdAt = payload.createdAt || new Date().toISOString();
  const publishedAt = status === "published"
    ? payload.publishedAt || new Date().toISOString()
    : payload.publishedAt || null;

  return {
    id: payload.id || randomId(),
    courseCode,
    courseTitle,
    department,
    institution,
    session,
    examSession,
    year,
    examType,
    description: strip(payload.description || payload.summary || ""),
    title,
    originalFile,
    extractedContent: payload.extractedContent || null,
    content,
    assets,
    questions,
    unassignedVisualAssets: Array.isArray(payload.unassignedVisualAssets) ? payload.unassignedVisualAssets : [],
    status,
    processing,
    processingStatus: status === "published" ? "published" : processing.status,
    createdBy: payload.createdBy || "admin",
    createdAt,
    updatedAt: new Date().toISOString(),
    publishedAt,
    warnings: processing.warnings,
    sourceType: payload.sourceType || "hybrid_document",
    hasVisualContent: Boolean(payload.hasVisualContent || assets.some((entry) => ["image", "diagram"].includes(entry.type))),
    visualContentSummary: payload.visualContentSummary || (assets.length ? "Diagram and image content detected in the source paper." : "Text-only extraction was detected for this paper."),
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

const sortTextItemsForReading = (items = []) => [...items].sort((left, right) => {
  const leftY = Number(left.transform?.[5] || 0);
  const rightY = Number(right.transform?.[5] || 0);
  if (Math.abs(rightY - leftY) > 2) return rightY - leftY;
  return Number(left.transform?.[4] || 0) - Number(right.transform?.[4] || 0);
});

const buildTextLines = (items = []) => {
  const sorted = sortTextItemsForReading(items)
    .map((item) => ({
      text: strip(item.str || ""),
      x: Number(item.transform?.[4] || 0),
      y: Number(item.transform?.[5] || 0),
      width: Number(item.width || 0),
      height: Number(item.height || 0),
    }))
    .filter((item) => item.text);

  const lines = [];
  sorted.forEach((item) => {
    const current = lines[lines.length - 1];
    if (!current || Math.abs(current.y - item.y) > Math.max(3, item.height * 0.75)) {
      lines.push({
        text: item.text,
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
        items: [item],
      });
      return;
    }

    const separator = item.x > current.x + current.width + 3 ? " " : "";
    current.text = `${current.text}${separator}${item.text}`.trim();
    current.width = Math.max(current.width, item.x + item.width - current.x);
    current.height = Math.max(current.height, item.height);
    current.items.push(item);
  });

  return lines;
};

const lineLooksLikeStandaloneHeading = (line = "") => {
  const value = strip(line);
  return value.length > 1 && value.length <= 80 && value === value.toUpperCase() && /[A-Z]/.test(value);
};

const lineLooksLikeListItem = (line = "") => /^(\(?[a-zA-Z0-9ivxlcdm]+\)|[a-zA-Z0-9ivxlcdm]+[.)]|[-•*])\s+/.test(strip(line));

const buildTextElements = (lines = [], pageNumber = 1, sourceId = "pdf") => {
  const elements = [];
  let paragraphLines = [];
  let paragraphStart = null;

  const flushParagraph = () => {
    if (!paragraphLines.length) return;
    const first = paragraphStart || paragraphLines[0];
    elements.push({
      id: `${sourceId}-page-${pageNumber}-text-${elements.length + 1}`,
      type: "text",
      text: paragraphLines.map((line) => line.text).join("\n"),
      pageNumber,
      order: elements.length,
      position: {
        x: first.x,
        y: first.y,
      },
      lineCount: paragraphLines.length,
    });
    paragraphLines = [];
    paragraphStart = null;
  };

  lines.forEach((line, index) => {
    const previous = lines[index - 1];
    const verticalGap = previous ? Math.abs(previous.y - line.y) : 0;
    const startsNewParagraph = !previous || verticalGap > Math.max(15, line.height * 1.8) || lineLooksLikeStandaloneHeading(line.text) || lineLooksLikeListItem(line.text);
    if (startsNewParagraph) flushParagraph();
    if (!paragraphStart) paragraphStart = line;
    paragraphLines.push(line);
  });
  flushParagraph();

  return elements;
};

const uploadRenderedPage = (pngBuffer, pageNumber, sourceId, imageIndex = 0) => new Promise((resolve, reject) => {
  if (!isCloudinaryAdminConfigured()) {
    resolve(null);
    return;
  }

  const upload = cloudinary.uploader.upload_stream({
    folder: "unihelp/past-questions",
    public_id: `${sourceId || "paper"}-page-${pageNumber}-image-${imageIndex + 1}`,
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

const extractPdfContent = async (pdfBuffer, sourceId = randomId()) => {
  if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
    throw new Error("A valid PDF buffer is required for PDF content extraction");
  }

  const pdf = await getDocument({ data: new Uint8Array(pdfBuffer), disableWorker: true }).promise;
  const pages = [];
  const assets = [];
  const warnings = [];
  let totalTextLength = 0;
  let totalImageCount = 0;
  let extractedImageCount = 0;
  let scannedPageCount = 0;

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    const [textContent, operatorList] = await Promise.all([
      page.getTextContent(),
      page.getOperatorList(),
    ]);

    const lines = buildTextLines(textContent.items || []);
    const text = lines.map((line) => line.text).join("\n").trim();
    const textElements = buildTextElements(lines, pageNumber, sourceId);
    const imageOperators = operatorList.fnArray
      .map((operator, operatorIndex) => ({ operator, operatorIndex, args: operatorList.argsArray[operatorIndex] }))
      .filter((entry) => entry.operator === OPS.paintImageXObject || entry.operator === OPS.paintImageXObjectRepeat);
    const isScanned = !text && imageOperators.length > 0;
    const pageWarnings = [];
    const imageElements = [];

    totalTextLength += text.length;
    totalImageCount += imageOperators.length;
    if (isScanned) {
      scannedPageCount += 1;
      pageWarnings.push("Scanned/image-only page detected; OCR is required but not configured.");
    }

    const seenImageObjects = new Set();
    for (let imageIndex = 0; imageIndex < imageOperators.length; imageIndex += 1) {
      const entry = imageOperators[imageIndex];
      const imageName = entry.args?.[0] || "";
      const elementId = `${sourceId}-page-${pageNumber}-image-${imageIndex + 1}`;
      let imageObject = null;
      let uploaded = null;
      let extractionStatus = "detected";

      if (imageName && seenImageObjects.has(`${pageNumber}:${imageName}`)) {
        extractionStatus = "duplicate_reference";
      } else {
        if (imageName) seenImageObjects.add(`${pageNumber}:${imageName}`);
        imageObject = await getResolvedPageObject(page.objs, imageName);
        const pngBuffer = imageObjectToPng(imageObject);
        if (pngBuffer) {
          try {
            uploaded = await uploadRenderedPage(pngBuffer, pageNumber, sourceId, imageIndex);
            extractionStatus = uploaded ? "uploaded" : "cloudinary_unconfigured";
            if (uploaded) extractedImageCount += 1;
          } catch (uploadError) {
            extractionStatus = "upload_failed";
            pageWarnings.push(`Image ${imageIndex + 1} on page ${pageNumber} could not be uploaded.`);
          }
        } else {
          extractionStatus = "unsupported_image_data";
          pageWarnings.push(`Image ${imageIndex + 1} on page ${pageNumber} could not be converted from PDF data.`);
        }
      }

      const asset = {
        id: elementId,
        type: "image",
        url: uploaded?.secure_url || uploaded?.url || "",
        publicId: uploaded?.public_id || "",
        fileName: `${elementId}.png`,
        mimeType: "image/png",
        resourceType: uploaded?.resource_type || "image",
        caption: "",
        altText: "",
        pageNumber,
        source: "pdf_extraction",
        extractionStatus,
        width: Number(imageObject?.width || 0) || undefined,
        height: Number(imageObject?.height || 0) || undefined,
        operatorIndex: entry.operatorIndex,
      };
      assets.push(asset);
      imageElements.push({
        id: elementId,
        type: "image",
        assetId: asset.id,
        pageNumber,
        order: textElements.length + imageElements.length,
        operatorIndex: entry.operatorIndex,
        position: {
          x: null,
          y: null,
          width: asset.width || null,
          height: asset.height || null,
        },
        extractionStatus,
      });
    }

    if (imageOperators.length && !isCloudinaryAdminConfigured()) {
      pageWarnings.push("Embedded images were detected, but Cloudinary Admin API is not configured for extracted asset uploads.");
    }

    const elements = [...textElements, ...imageElements]
      .sort((left, right) => {
        if (left.position?.y != null && right.position?.y != null && Math.abs(right.position.y - left.position.y) > 2) {
          return right.position.y - left.position.y;
        }
        return Number(left.operatorIndex ?? left.order) - Number(right.operatorIndex ?? right.order);
      })
      .map((element, order) => ({ ...element, order }));

    pages.push({
      pageNumber,
      width: viewport.width,
      height: viewport.height,
      text,
      textLength: text.length,
      lines,
      elements,
      imageCount: imageOperators.length,
      extractedImageCount: imageElements.filter((element) => element.extractionStatus === "uploaded").length,
      isScanned,
      warnings: pageWarnings,
    });
    warnings.push(...pageWarnings);
  }

  if (totalTextLength === 0 && totalImageCount > 0) {
    warnings.push("Scanned PDF detected. OCR is required but not configured.");
  } else if (pdf.numPages > 0 && totalTextLength / pdf.numPages < 25 && totalImageCount > 0) {
    warnings.push("Low text extraction detected; document may be scanned or image-heavy.");
  }
  if (totalImageCount > 0 && extractedImageCount < totalImageCount && isCloudinaryAdminConfigured()) {
    warnings.push("Some embedded images could not be extracted or uploaded.");
  }

  return {
    source: "pdf",
    pageCount: pdf.numPages,
    pages,
    assets,
    warnings: Array.from(new Set(warnings.filter(Boolean))),
    stats: {
      textLength: totalTextLength,
      imageCount: totalImageCount,
      extractedImageCount,
      scannedPageCount,
      cloudinaryConfigured: isCloudinaryAdminConfigured(),
    },
  };
};

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

const withDocumentFoundation = (item = {}) => {
  const questions = Array.isArray(item.questions) ? item.questions.map((question, index) => normalizeQuestion(question, index)) : [];
  const { content, assets } = normalizeDocumentContent(item, questions);
  const status = normalizeDocumentStatus(item.status);
  const processing = normalizeProcessingState(item, item.warnings || [], status);

  return {
    ...item,
    status,
    processing,
    processingStatus: item.processingStatus || (status === "published" ? "published" : processing.status),
    originalFile: normalizeOriginalFile(item),
    content,
    assets,
    questions: questions.length ? questions : deriveQuestionsFromDocumentContent(content, assets),
    warnings: processing.warnings,
    publishedAt: status === "published" ? item.publishedAt || item.updatedAt || null : item.publishedAt || null,
  };
};

questionsRoutes.get("/", authenticateFirebaseUser, async (req, res) => {
  try {
    if (!db) {
      return res.json({ items: [], total: 0, hasMore: false });
    }

    const snapshot = await db.collection("questions").orderBy("createdAt", "desc").limit(100).get();
    const isAdminUser = req.user?.admin === true;
    const items = snapshot.docs
      .map((doc) => withDocumentFoundation({ id: doc.id, ...doc.data() }))
      .filter((item) => isAdminUser || item.status === "published");
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
    const item = withDocumentFoundation({ id: doc.id, ...doc.data() });
    if (item.status !== "published" && req.user?.admin !== true) {
      return res.status(404).json({ success: false, error: "Past question not found" });
    }
    return res.json({ success: true, item });
  } catch (error) {
    console.error("[past-questions] fetch failed", error);
    return res.status(500).json({ success: false, error: "Unable to load past question" });
  }
});

questionsRoutes.post("/process", authenticateFirebaseUser, ensureAdmin, async (req, res) => {
  try {
    const payload = req.body || {};
    const originalUrl = strip(payload.originalFile?.url || payload.fileUrl || payload.downloadUrl || payload.url || "");
    let extractedContent = payload.extractedContent || null;
    let extractedDocumentContent = Array.isArray(payload.content) ? payload.content : [];
    let warnings = [];
    let extractionStats = {
      pageCount: 0,
      textLength: 0,
      imageCount: 0,
      extractedImageCount: 0,
      scannedPageCount: 0,
      cloudinaryConfigured: isCloudinaryAdminConfigured(),
    };
    let extractionAssets = [];

    if (originalUrl && /\.pdf(?:\?|$)/i.test(originalUrl)) {
      try {
        const pdfBuffer = await fetchPdfBuffer(originalUrl);
        extractedContent = await extractPdfContent(pdfBuffer, payload.id || randomId());
        extractedDocumentContent = buildDocumentContentFromExtraction(extractedContent);
        extractionAssets = (extractedContent.assets || []).filter((asset) => asset.url || asset.publicId);
        extractionStats = {
          pageCount: extractedContent.pageCount || 0,
          ...(extractedContent.stats || {}),
        };
        warnings.push(...(extractedContent.warnings || []));
      } catch (pdfError) {
        console.warn("[past-questions] PDF parsing failed", pdfError?.message || pdfError);
        warnings.push("PDF extraction was incomplete. Review the generated draft before publishing.");
        extractedContent = {
          source: "pdf",
          pageCount: 0,
          pages: [],
          assets: [],
          warnings,
          stats: extractionStats,
          error: pdfError?.message || "PDF extraction failed",
        };
      }
    } else if (originalUrl) {
      warnings.push("The uploaded source is not a PDF, so PDF content extraction was skipped.");
    }

    const baseDraft = await buildDraftFromPayload({
      ...payload,
      rawText: "",
      text: "",
      questions: Array.isArray(payload.questions) ? payload.questions : [],
      content: extractedDocumentContent,
      assets: [...(Array.isArray(payload.assets) ? payload.assets : []), ...extractionAssets],
      extractedContent,
      status: "draft",
      processing: {
        status: warnings.length ? "manual_review" : "ready",
        source: "pdf",
        warnings,
      },
      originalFile: payload.originalFile || {
        url: originalUrl,
        publicId: payload.originalFile?.publicId || payload.cloudinaryPublicId || payload.publicId || "",
        fileName: payload.originalFile?.fileName || payload.fileName || payload.name || "paper.pdf",
      },
    });
    const draft = {
      ...baseDraft,
      extractedContent,
      unassignedVisualAssets: [],
      hasVisualContent: Boolean(baseDraft.hasVisualContent || extractionStats.imageCount > 0),
      visualContentSummary: extractionStats.imageCount
        ? `${extractionStats.imageCount} embedded image reference(s) detected in the source PDF.`
        : baseDraft.visualContentSummary,
      visualExtraction: {
        pageCount: extractionStats.pageCount || 0,
        visualPageCount: (extractedContent?.pages || []).filter((page) => page.imageCount > 0).length,
        extractedAssetCount: extractionStats.extractedImageCount || 0,
        unassignedAssetCount: 0,
        scannedPageCount: extractionStats.scannedPageCount || 0,
        cloudinaryConfigured: extractionStats.cloudinaryConfigured,
      },
      processing: normalizeProcessingState({
        ...baseDraft,
        processing: baseDraft.processing,
        processingStatus: warnings.length ? "manual_review" : "ready",
      }, warnings, "draft"),
    };

    if (!draft.content?.length && !warnings.includes("No extractable content was found. Please review the original PDF manually.")) {
      warnings.push("No extractable content was found. Please review the original PDF manually.");
    }

    if (warnings.length) {
      draft.warnings = Array.from(new Set([...(draft.warnings || []), ...warnings]));
      draft.processing = normalizeProcessingState({ ...draft, processing: draft.processing }, draft.warnings, draft.status);
    }

    return res.status(200).json({
      success: true,
      draft,
      warnings: draft.warnings || [],
      processing: {
        status: draft.processing.status,
        message: "PDF extraction completed and the draft is ready for conversion/review.",
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
    const docRef = db ? db.collection("questions").doc(req.params.id) : null;
    const existing = docRef ? await docRef.get() : null;
    const existingData = existing?.exists ? withDocumentFoundation({ id: existing.id, ...existing.data() }) : {};
    const body = req.body || {};
    const payload = await buildDraftFromPayload({
      ...existingData,
      ...body,
      id: req.params.id,
      originalFile: body.originalFile ?? existingData.originalFile,
      extractedContent: body.extractedContent ?? existingData.extractedContent,
      assets: body.assets ?? existingData.assets,
      processing: body.processing ?? existingData.processing,
      questions: body.questions ?? existingData.questions,
    });
    const saved = await saveDraftToFirestore(payload);
    return res.json({ success: true, item: saved });
  } catch (error) {
    console.error("[past-questions] update failed", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to update past question" });
  }
});

questionsRoutes.post("/:id/convert", authenticateFirebaseUser, ensureAdmin, async (req, res) => {
  const docRef = db ? db.collection("questions").doc(req.params.id) : null;
  try {
    if (!docRef) {
      return res.status(503).json({ success: false, error: "Past question database is unavailable" });
    }

    const existing = await docRef.get();
    if (!existing.exists) {
      return res.status(404).json({ success: false, error: "Past question not found" });
    }

    const existingItem = withDocumentFoundation({ id: existing.id, ...existing.data() });
    const extractedContent = existingItem.extractedContent;
    if (!extractedContent?.pages?.length) {
      return res.status(400).json({ success: false, error: "No extracted PDF content is available for conversion." });
    }

    const extractionStats = extractedContent.stats || {};
    const extractionWarnings = Array.isArray(extractedContent.warnings) ? extractedContent.warnings : [];
    if ((Number(extractionStats.textLength || 0) === 0 && Number(extractionStats.scannedPageCount || 0) > 0) || extractionWarnings.some((warning) => /OCR is required/i.test(warning))) {
      const manualPayload = {
        processing: {
          ...(existingItem.processing || {}),
          status: "conversion_blocked",
          stage: "conversion_blocked",
          source: "gemini_conversion",
          warnings: Array.from(new Set([...(existingItem.processing?.warnings || []), ...extractionWarnings, "Gemini conversion skipped because OCR/manual review is required."])),
          error: "OCR/manual review required before conversion.",
          updatedAt: new Date().toISOString(),
        },
        processingStatus: "conversion_blocked",
        updatedAt: new Date().toISOString(),
      };
      await docRef.set(manualPayload, { merge: true });
      return res.status(422).json({
        success: false,
        error: "OCR/manual review is required before Gemini conversion.",
        item: withDocumentFoundation({ ...existingItem, ...manualPayload }),
      });
    }

    console.log("[past-questions] Gemini conversion started", { id: req.params.id });
    await docRef.set({
      processing: {
        ...(existingItem.processing || {}),
        status: "processing",
        stage: "converting",
        source: "gemini_conversion",
        error: null,
        updatedAt: new Date().toISOString(),
      },
      processingStatus: "processing",
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    const conversion = await convertPastQuestionExtractionWithGemini({
      extractedContent,
      assets: existingItem.assets || [],
      metadata: {
        title: existingItem.title,
        courseCode: existingItem.courseCode,
        courseTitle: existingItem.courseTitle,
        examSession: existingItem.examSession || existingItem.session,
        institution: existingItem.institution,
      },
    });

    const validation = validateGeminiDocumentContent(conversion.content, existingItem.assets || []);
    const warnings = Array.from(new Set([
      ...(existingItem.warnings || []),
      ...(conversion.warnings || []),
      ...validation.warnings,
    ]));
    const processingStatus = validation.content.length && !validation.warnings.length ? "ready" : "manual_review";
    const payload = {
      content: validation.content,
      assets: validation.assets,
      questions: deriveQuestionsFromDocumentContent(validation.content, validation.assets),
      extractedContent,
      originalFile: existingItem.originalFile,
      status: "draft",
      processing: {
        ...(existingItem.processing || {}),
        status: processingStatus,
        stage: "converted",
        source: "gemini_conversion",
        warnings,
        error: null,
        model: conversion.model,
        apiVersion: conversion.apiVersion,
        updatedAt: new Date().toISOString(),
      },
      processingStatus,
      warnings,
      updatedAt: new Date().toISOString(),
    };

    await docRef.set(payload, { merge: true });
    console.log("[past-questions] Gemini conversion completed", { id: req.params.id, status: processingStatus, warnings: validation.warnings.length });
    return res.json({
      success: true,
      item: withDocumentFoundation({ ...existingItem, ...payload }),
      warnings,
      conversion: {
        status: processingStatus,
        model: conversion.model,
      },
    });
  } catch (error) {
    console.error("[past-questions] Gemini conversion failed", { id: req.params.id, message: error.message });
    if (docRef) {
      await docRef.set({
        processing: {
          status: "failed",
          stage: "conversion_failed",
          source: "gemini_conversion",
          warnings: ["Gemini conversion failed. The extracted source remains available for retry."],
          error: error.message || "Gemini conversion failed.",
          updatedAt: new Date().toISOString(),
        },
        processingStatus: "failed",
        updatedAt: new Date().toISOString(),
      }, { merge: true }).catch(() => {});
    }
    return res.status(502).json({
      success: false,
      error: error.message || "Gemini conversion failed.",
    });
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
      processing: {
        ...((existing.data() || {}).processing || {}),
        status: "ready",
        updatedAt: new Date().toISOString(),
      },
      processingStatus: "published",
      updatedAt: new Date().toISOString(),
      publishedAt: (existing.data() || {}).publishedAt || new Date().toISOString(),
    };
    await docRef.set(payload, { merge: true });
    return res.json({ success: true, item: withDocumentFoundation({ id: req.params.id, ...payload }) });
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
      ...(Array.isArray(data.assets) ? data.assets : []),
      ...(Array.isArray(data.content) ? data.content : []),
      ...(Array.isArray(data.extractedContent?.assets) ? data.extractedContent.assets : []),
      ...(Array.isArray(data.unassignedVisualAssets) ? data.unassignedVisualAssets : []),
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
  buildDocumentContentFromExtraction,
  deriveQuestionsFromDocumentContent,
  extractPdfContent,
  normalizeDocumentContent,
  normalizeProcessingState,
  normalizeQuestion,
  normalizeQuestionBlocks,
  parsePdfText,
  fetchPdfBuffer,
  extractPdfVisuals,
  attachVisualsToQuestions,
  saveDraftToFirestore,
  validateGeminiDocumentContent,
  withDocumentFoundation,
};

export default questionsRoutes;
