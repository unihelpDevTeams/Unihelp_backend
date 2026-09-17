import assert from "node:assert/strict";
import {
  convertPastQuestionExtractionWithGemini,
  parseGeminiConversionResponse,
} from "../services/pastQuestionGeminiConversionService.js";
import {
  deriveQuestionsFromDocumentContent,
  validateGeminiDocumentContent,
} from "../routes/pastQuestionsRoutes.js";

const mockResponse = (content, warnings = []) => ({
  responseData: {
    candidates: [{
      content: {
        parts: [{ text: JSON.stringify({ content, warnings }) }],
      },
    }],
  },
  model: "mock-gemini",
  apiVersion: "mock",
});

const extractedContent = {
  source: "pdf",
  pageCount: 1,
  stats: { textLength: 180, imageCount: 1, scannedPageCount: 0 },
  warnings: [],
  pages: [{
    pageNumber: 1,
    isScanned: false,
    elements: [
      { id: "el-1", type: "text", text: "SECTION A", pageNumber: 1, order: 0 },
      { id: "el-2", type: "text", text: "Answer all questions.", pageNumber: 1, order: 1 },
      { id: "el-3", type: "text", text: "1. Define stress.", pageNumber: 1, order: 2 },
      { id: "img-el-1", type: "image", assetId: "asset-1", pageNumber: 1, order: 3 },
    ],
  }],
};

const assets = [{
  id: "asset-1",
  type: "image",
  url: "https://example.test/local-image.png",
  publicId: "local-image",
  pageNumber: 1,
}];

const basicConversion = await convertPastQuestionExtractionWithGemini({
  extractedContent,
  assets,
  metadata: { title: "Mock Past Question" },
  requestGemini: async () => mockResponse([
    { type: "heading", text: "SECTION A" },
    { type: "instruction", text: "Answer all questions." },
    {
      type: "question",
      number: "1",
      blocks: [{ type: "paragraph", text: "Define stress." }],
    },
  ]),
});
const basicValidated = validateGeminiDocumentContent(basicConversion.content, assets);
assert.equal(basicValidated.warnings.length, 0);
assert.equal(basicValidated.content[0].type, "heading");
assert.equal(deriveQuestionsFromDocumentContent(basicValidated.content, assets).length, 1);

const nestedConversion = await convertPastQuestionExtractionWithGemini({
  extractedContent,
  assets,
  requestGemini: async () => mockResponse([
    {
      type: "question",
      number: "3",
      blocks: [
        { type: "paragraph", text: "Answer the following:" },
        { type: "subquestion", number: "a", blocks: [{ type: "paragraph", text: "Define elasticity." }] },
        { type: "subquestion", number: "b", blocks: [{ type: "paragraph", text: "Define plasticity." }] },
      ],
    },
  ]),
});
const nestedValidated = validateGeminiDocumentContent(nestedConversion.content, assets);
const nestedQuestions = deriveQuestionsFromDocumentContent(nestedValidated.content, assets);
assert.equal(nestedQuestions[0].subQuestions.length, 2);

const validImage = validateGeminiDocumentContent([
  {
    type: "question",
    number: "2",
    blocks: [
      { type: "paragraph", text: "Study the diagram below." },
      { type: "image", assetId: "asset-1", caption: "" },
    ],
  },
], assets);
assert.equal(validImage.warnings.length, 0);
assert.equal(validImage.content[0].blocks[1].assetId, "asset-1");

const invalidImage = validateGeminiDocumentContent([
  {
    type: "question",
    number: "2",
    blocks: [
      { type: "paragraph", text: "Study the diagram below." },
      { type: "image", assetId: "invented-asset", caption: "" },
    ],
  },
], assets);
assert.equal(invalidImage.content[0].blocks.some((block) => block.type === "image"), false);
assert.equal(invalidImage.warnings.some((warning) => /invalid asset/i.test(warning)), true);

const mixedValidated = validateGeminiDocumentContent([
  { type: "heading", text: "SECTION B" },
  { type: "instruction", text: "Attempt two questions." },
  { type: "paragraph", text: "Use g = 9.8 m/s^2 where necessary." },
  {
    type: "question",
    number: "4",
    blocks: [
      { type: "paragraph", text: "Consider the following diagram." },
      { type: "image", assetId: "asset-1" },
      { type: "equation", value: "F = ma" },
      {
        type: "table",
        columns: ["Quantity", "Value"],
        rows: [["m", "2 kg"], ["a", "3 m/s^2"]],
      },
      { type: "subquestion", number: "a", blocks: [{ type: "paragraph", text: "Find F." }] },
    ],
  },
  { type: "note", text: "Show workings." },
  {
    type: "section",
    text: "SECTION C",
    blocks: [
      { type: "paragraph", text: "Use the data supplied below." },
      { type: "numbered-list", items: ["Read the graph.", "State assumptions."] },
    ],
  },
  { type: "divider" },
], assets);
assert.equal(mixedValidated.content.length, 7);
assert.equal(mixedValidated.content[3].blocks.some((block) => block.type === "table"), true);
assert.equal(mixedValidated.content[5].type, "section");
assert.equal(mixedValidated.content[5].blocks.length, 2);

assert.throws(
  () => parseGeminiConversionResponse({ candidates: [{ content: { parts: [{ text: "{not json" }] } }] }),
  /JSON|Expected/i
);

await assert.rejects(
  () => convertPastQuestionExtractionWithGemini({
    extractedContent,
    assets,
    requestGemini: async () => {
      throw new Error("Gemini unavailable");
    },
  }),
  /Gemini unavailable/
);

console.log(JSON.stringify({
  basic: basicValidated.content.map((block) => block.type),
  nestedSubquestions: nestedQuestions[0].subQuestions.length,
  validImageWarnings: validImage.warnings.length,
  invalidImageWarnings: invalidImage.warnings,
  mixedTypes: mixedValidated.content.map((block) => block.type),
  invalidResponseHandled: true,
  apiFailureHandled: true,
}, null, 2));
