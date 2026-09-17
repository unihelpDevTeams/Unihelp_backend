import axios from "axios";

const DEFAULT_MODELS = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
const MAX_EXTRACTION_CHARS = 80000;

const strip = (value) => String(value ?? "").trim();

const resolveModels = () => {
  const configured = String(process.env.GEMINI_MODEL || process.env.GEMINI_MODELS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return configured.length ? configured : DEFAULT_MODELS;
};

const getGeminiApiKey = () => process.env.GEMINI_API_KEY || "";

const compactExtractionForGemini = (extractedContent = {}) => {
  let usedChars = 0;
  const pages = (extractedContent.pages || []).map((page) => {
    const elements = (page.elements || []).map((element) => {
      if (element.type === "image") {
        return {
          id: element.id,
          type: "image",
          assetId: element.assetId,
          pageNumber: element.pageNumber,
          order: element.order,
          extractionStatus: element.extractionStatus,
        };
      }

      const rawText = strip(element.text || "");
      const remaining = Math.max(0, MAX_EXTRACTION_CHARS - usedChars);
      const text = rawText.slice(0, remaining);
      usedChars += text.length;
      return {
        id: element.id,
        type: "text",
        text,
        pageNumber: element.pageNumber,
        order: element.order,
      };
    }).filter((element) => element.type === "image" || element.text);

    return {
      pageNumber: page.pageNumber,
      textLength: page.textLength,
      isScanned: page.isScanned,
      warnings: page.warnings || [],
      elements,
    };
  });

  return {
    source: extractedContent.source || "pdf",
    pageCount: extractedContent.pageCount || pages.length,
    stats: extractedContent.stats || {},
    warnings: extractedContent.warnings || [],
    truncated: usedChars >= MAX_EXTRACTION_CHARS,
    pages,
  };
};

const buildConversionPrompt = ({ extractedContent, assets = [], metadata = {} }) => {
  const compact = compactExtractionForGemini(extractedContent);
  const assetSummary = assets.map((asset) => ({
    id: asset.id,
    type: asset.type || "image",
    pageNumber: asset.pageNumber,
    extractionStatus: asset.extractionStatus,
    hasUrl: Boolean(asset.url),
    publicId: asset.publicId || "",
  }));

  return `You are converting deterministic PDF extraction data into UniHelp document JSON.

STRICT CONTENT INTEGRITY RULES:
- Do not invent questions, answers, words, numbers, mathematical values, dates, names, diagrams, or tables.
- Do not solve or explain questions.
- Preserve the extracted wording. Only remove obvious spacing/line-wrap artifacts.
- If text is missing, keep it missing. Do not reconstruct it.
- Use only asset IDs from the provided asset list. Do not invent URLs or asset IDs.
- Return JSON only. No markdown. No explanation.

Allowed block types:
heading, paragraph, instruction, question, subquestion, image, diagram, table, equation, numbered-list, bullet-list, caption, note, divider, page-break, section.

Target shape:
{
  "content": [
    { "type": "heading", "text": "SECTION A" },
    { "type": "instruction", "text": "Answer all questions." },
    {
      "type": "question",
      "number": "1",
      "blocks": [
        { "type": "paragraph", "text": "Define stress." }
      ]
    }
  ],
  "warnings": []
}

For image/diagram blocks use:
{ "type": "image", "assetId": "existing-asset-id", "caption": "" }

If scanned/OCR-required extraction has insufficient text, return:
{ "content": [], "warnings": ["Manual review required: OCR unavailable for scanned PDF."] }

Document metadata:
${JSON.stringify(metadata)}

Valid extracted assets:
${JSON.stringify(assetSummary)}

Extracted PDF data:
${JSON.stringify(compact)}`;
};

const extractJsonText = (text = "") => {
  const trimmed = strip(text).replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) return trimmed;
  const objectStart = trimmed.indexOf("{");
  const objectEnd = trimmed.lastIndexOf("}");
  if (objectStart >= 0 && objectEnd > objectStart) {
    return trimmed.slice(objectStart, objectEnd + 1);
  }
  throw new Error("Gemini did not return JSON.");
};

const parseGeminiConversionResponse = (responseData) => {
  const text = responseData?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text)
    .filter(Boolean)
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("Gemini returned an empty conversion response.");
  }

  const parsed = JSON.parse(extractJsonText(text));
  if (Array.isArray(parsed)) {
    return { content: parsed, warnings: [] };
  }
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Gemini conversion JSON must be an object or array.");
  }
  return {
    content: Array.isArray(parsed.content) ? parsed.content : [],
    warnings: Array.isArray(parsed.warnings) ? parsed.warnings.map(strip).filter(Boolean) : [],
  };
};

const callGeminiConversion = async ({ extractedContent, assets, metadata }) => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("Gemini API key is not configured on the server.");
  }

  const prompt = buildConversionPrompt({ extractedContent, assets, metadata });
  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0,
      topP: 0.8,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    },
  };

  let lastError = null;
  for (const version of ["v1", "v1beta"]) {
    for (const model of resolveModels()) {
      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`,
          payload,
          { timeout: 45000 }
        );
        return { responseData: response.data, model, apiVersion: version };
      } catch (error) {
        const status = error.response?.status;
        const message = error.response?.data?.error?.message || error.message || "";
        if (status === 400 && /API key not valid|API_KEY_INVALID|invalid API key|INVALID_ARGUMENT/i.test(message)) {
          throw new Error("The Gemini API key configured on the server is invalid.");
        }
        lastError = error;
      }
    }
  }

  throw new Error(lastError?.response?.data?.error?.message || lastError?.message || "Gemini conversion failed.");
};

export const convertPastQuestionExtractionWithGemini = async ({
  extractedContent,
  assets = [],
  metadata = {},
  requestGemini = callGeminiConversion,
} = {}) => {
  if (!extractedContent || typeof extractedContent !== "object") {
    throw new Error("Extracted content is required for Gemini conversion.");
  }

  const result = await requestGemini({ extractedContent, assets, metadata });
  const converted = parseGeminiConversionResponse(result.responseData || result);
  return {
    ...converted,
    model: result.model || "mock",
    apiVersion: result.apiVersion || "mock",
  };
};

export {
  buildConversionPrompt,
  compactExtractionForGemini,
  parseGeminiConversionResponse,
};
