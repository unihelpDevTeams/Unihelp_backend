import express from "express";
import { FieldPath } from "firebase-admin/firestore";
import { authenticateFirebaseUser } from "../middleware/auth.js";
import { db } from "../firebase/firebaseAdmin.js";

const router = express.Router();
const PAGE_SIZE = 500;

const normalize = (value) => String(value ?? "")
  .normalize("NFKD")
  .replace(/\p{Diacritic}/gu, "")
  .toLowerCase()
  .replace(/[^\p{L}\p{N}]+/gu, " ")
  .trim();

const firstValue = (...values) => values.find((value) => String(value ?? "").trim());

const normalizeNoteDetails = (details = {}) => ({
  type: "note",
  title: normalize(details.title),
  course: normalize(firstValue(details.course, details.courseCode)),
  school: normalize(firstValue(details.school, details.institution)),
  schoolId: normalize(details.schoolId || details.institutionId),
  department: normalize(firstValue(details.department, details.dept)),
  departmentId: normalize(details.departmentId || details.deptId),
  level: normalize(details.level),
});

const normalizeQuestionDetails = (details = {}) => ({
  type: "question",
  courseCode: normalize(firstValue(details.courseCode, details.course)),
  school: normalize(firstValue(details.school, details.institution)),
  schoolId: normalize(details.schoolId || details.institutionId),
  year: normalize(details.year),
  examType: normalize(details.examType),
  session: normalize(firstValue(details.semester, details.session, details.examSession)),
  department: normalize(firstValue(details.department, details.dept)),
  departmentId: normalize(details.departmentId || details.deptId),
  level: normalize(details.level),
});

const noteDetailsFromRecord = (record = {}) => normalizeNoteDetails(record);
const questionDetailsFromRecord = (record = {}) => normalizeQuestionDetails(record);

const sameIdentity = (left, right, idField, nameField) => {
  if (left[idField] && right[idField]) return left[idField] === right[idField];
  return Boolean(left[nameField] && right[nameField] && left[nameField] === right[nameField]);
};

const compatibleOptionalIdentity = (left, right, idField, nameField) => {
  if (left[idField] && right[idField]) return left[idField] === right[idField];
  if (left[nameField] && right[nameField]) return left[nameField] === right[nameField];
  return true;
};

const isDuplicate = (candidate, existing) => {
  if (candidate.type === "note") {
    return candidate.title && candidate.course && (candidate.school || candidate.schoolId) &&
      candidate.title === existing.title &&
      candidate.course === existing.course &&
      sameIdentity(candidate, existing, "schoolId", "school") &&
      compatibleOptionalIdentity(candidate, existing, "departmentId", "department") &&
      (!candidate.level || !existing.level || candidate.level === existing.level);
  }

  return candidate.courseCode && (candidate.school || candidate.schoolId) && candidate.year && candidate.examType &&
    candidate.courseCode === existing.courseCode &&
    sameIdentity(candidate, existing, "schoolId", "school") &&
    candidate.year === existing.year &&
    candidate.examType === existing.examType &&
    (!candidate.session || !existing.session || candidate.session === existing.session) &&
    compatibleOptionalIdentity(candidate, existing, "departmentId", "department") &&
    (!candidate.level || !existing.level || candidate.level === existing.level);
};

const findDuplicateRecord = async ({ collectionName, fields, candidate, type, excludeId }) => {
  let cursor = null;

  while (true) {
    let request = db.collection(collectionName)
      .orderBy(FieldPath.documentId())
      .select(...fields)
      .limit(PAGE_SIZE);
    if (cursor) request = request.startAfter(cursor);

    const snapshot = await request.get();
    for (const document of snapshot.docs) {
      if (excludeId && document.id === String(excludeId)) continue;
      const record = { id: document.id, ...document.data() };
      const existing = type === "note"
        ? noteDetailsFromRecord(record)
        : questionDetailsFromRecord(record);
      if (isDuplicate(candidate, existing)) return record;
    }
    if (snapshot.docs.length < PAGE_SIZE) break;
    cursor = snapshot.docs[snapshot.docs.length - 1];
  }

  return null;
};

router.post("/check-duplicate", authenticateFirebaseUser, async (req, res) => {
  const { type, details, excludeId } = req.body || {};
  if (!["note", "question"].includes(type) || !details || typeof details !== "object") {
    return res.status(400).json({ error: "Resource type and document details are required." });
  }
  const candidate = type === "note"
    ? normalizeNoteDetails(details)
    : normalizeQuestionDetails(details);
  const requiredDetails = type === "note"
    ? [candidate.title, candidate.course, candidate.school || candidate.schoolId]
    : [candidate.courseCode, candidate.school || candidate.schoolId, candidate.year, candidate.examType];
  if (requiredDetails.some((value) => !value)) {
    return res.status(400).json({ error: "Complete the required document details before checking for duplicates." });
  }
  if (!db) {
    return res.status(503).json({ error: "Resource database is unavailable. Please try again." });
  }

  try {
    const collectionName = type === "note" ? "notes" : "questions";
    const fields = type === "note"
      ? ["title", "course", "courseCode", "school", "institution", "schoolId", "institutionId", "department", "dept", "departmentId", "deptId", "level"]
      : ["courseCode", "course", "school", "institution", "schoolId", "institutionId", "year", "examType", "session", "semester", "examSession", "department", "dept", "departmentId", "deptId", "level"];
    const match = await findDuplicateRecord({
      collectionName,
      fields,
      candidate,
      type,
      excludeId,
    });

    return res.json({
      duplicate: Boolean(match),
      match: match
        ? {
            id: match.id,
            title: match.title || match.courseTitle || match.courseCode || "",
            school: match.school || match.institution || "",
            year: match.year || "",
          }
        : null,
    });
  } catch (error) {
    console.error("[resources] Duplicate check failed", error);
    return res.status(500).json({ error: "Could not verify whether this document already exists." });
  }
});

export default router;
