import assert from "node:assert/strict";
import {
  buildDraftFromPayload,
  deriveQuestionsFromDocumentContent,
  normalizeDocumentContent,
  normalizeProcessingState,
  withDocumentFoundation,
} from "../routes/pastQuestionsRoutes.js";

const mixedContent = [
  { id: "h-uni", type: "heading", level: 1, text: "UNIVERSITY OF UNIHELP" },
  { id: "h-faculty", type: "heading", level: 2, text: "FACULTY OF ENGINEERING" },
  { id: "p-meta", type: "paragraph", text: "GET 206 - Applied Mechanics - Rain Semester 2026" },
  { id: "i-1", type: "instruction", text: "Answer all questions. Show all workings." },
  {
    id: "q-1",
    type: "question",
    number: "1",
    blocks: [
      { id: "q-1-p", type: "paragraph", text: "Consider the following diagram." },
      {
        id: "q-1-img",
        type: "diagram",
        assetId: "diagram-123",
        url: "https://example.test/local-diagram.png",
        publicId: "local-diagram",
        caption: "Triangle diagram",
      },
      { id: "q-1-eq", type: "equation", value: "F = ma" },
      {
        id: "q-1-sub-a",
        type: "subquestion",
        number: "a",
        blocks: [{ id: "q-1-sub-a-p", type: "paragraph", text: "Find F when m = 2 and a = 3." }],
      },
    ],
  },
  {
    id: "q-2",
    type: "question",
    number: "2",
    blocks: [
      { id: "q-2-p", type: "paragraph", text: "Discuss force systems under the following headings." },
      { id: "q-2-a", type: "subquestion", number: "a", blocks: [{ id: "q-2-a-p", type: "paragraph", text: "Coplanar forces." }] },
      {
        id: "q-2-b",
        type: "subquestion",
        number: "b",
        blocks: [
          { id: "q-2-b-p", type: "paragraph", text: "Non-coplanar forces." },
          { id: "q-2-b-i", type: "subquestion", number: "i", blocks: [{ id: "q-2-b-i-p", type: "paragraph", text: "Define resultant." }] },
          { id: "q-2-b-ii", type: "subquestion", number: "ii", blocks: [{ id: "q-2-b-ii-p", type: "paragraph", text: "State two assumptions." }] },
        ],
      },
    ],
  },
  {
    id: "tbl-1",
    type: "table",
    columns: ["Quantity", "Value"],
    rows: [["m", "2"], ["a", "3"]],
  },
  { id: "list-1", type: "numbered-list", items: ["State assumptions clearly.", "Use labelled diagrams."] },
  { id: "list-2", type: "bullet-list", items: ["Neat sketches", "Correct units"] },
  { id: "note-1", type: "note", text: "Use SI units." },
  {
    id: "section-b",
    type: "section",
    text: "SECTION B",
    blocks: [
      { id: "section-b-caption", type: "caption", text: "Answer one question from this section." },
      {
        id: "q-3",
        type: "question",
        number: "3",
        blocks: [{ id: "q-3-p", type: "paragraph", text: "Explain equilibrium with one practical example." }],
      },
    ],
  },
  { id: "div-1", type: "divider" },
  { id: "page-1", type: "page-break" },
];

const created = await buildDraftFromPayload({
  id: "foundation-test-doc",
  title: "Foundation Test",
  courseCode: "TEST 101",
  courseTitle: "Testing",
  institution: "UniHelp Test",
  examSession: "Rain 2026",
  description: "Mixed content document",
  originalFile: {
    url: "https://example.test/source.pdf",
    publicId: "source-pdf",
    fileName: "source.pdf",
    mimeType: "application/pdf",
  },
  content: mixedContent,
  status: "draft",
  processing: {
    status: "pending",
    source: "manual_test",
  },
  createdBy: "admin-test",
});

assert.equal(created.status, "draft");
assert.equal(created.processing.status, "pending");
assert.equal(created.content.length, mixedContent.length);
assert.equal(created.assets.length, 1);
assert.equal(created.assets[0].id, "diagram-123");
assert.equal(created.questions.length, 2);
assert.equal(created.questions[0].subQuestions.length, 1);
assert.match(created.questions[0].text, /Consider the following diagram/);
assert.equal(created.content.find((block) => block.id === "section-b").blocks.length, 2);

const retrieved = withDocumentFoundation(created);
assert.deepEqual(retrieved.content.map((block) => block.id), mixedContent.map((block) => block.id));

const updated = await buildDraftFromPayload({
  ...retrieved,
  questions: [{ id: "stale-question", number: 99, text: "This stale legacy question must be replaced." }],
  description: "Updated description",
  content: [
    ...retrieved.content,
    { id: "caption-1", type: "caption", text: "End of extracted sample." },
  ],
});
assert.equal(updated.description, "Updated description");
assert.equal(updated.content.at(-1).type, "caption");
assert.equal(updated.questions.some((question) => question.id === "stale-question"), false);
assert.equal(updated.questions.length, 2);

const published = withDocumentFoundation({
  ...updated,
  status: "published",
  processing: normalizeProcessingState({ processing: { status: "ready", source: "manual_test" } }, [], "published"),
  publishedAt: new Date("2026-09-17T00:00:00.000Z").toISOString(),
});
assert.equal(published.status, "published");
assert.equal(published.processing.status, "ready");
assert.ok(published.publishedAt);

const roundTrip = normalizeDocumentContent(published, []);
const derivedQuestions = deriveQuestionsFromDocumentContent(roundTrip.content, roundTrip.assets);
assert.equal(derivedQuestions.length, 2);
assert.equal(derivedQuestions[0].images.length, 1);
assert.equal(derivedQuestions[0].images[0].assetId, "diagram-123");

const deleted = { success: true, deletedId: published.id };
assert.equal(deleted.deletedId, "foundation-test-doc");

console.log(JSON.stringify({
  created: created.id,
  status: created.status,
  contentBlocks: created.content.length,
  assets: created.assets.length,
  derivedQuestions: created.questions.length,
  updatedBlocks: updated.content.length,
  publishedStatus: published.status,
  deleted: deleted.deletedId,
}, null, 2));
