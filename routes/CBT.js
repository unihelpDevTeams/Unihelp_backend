import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const cbtRoutes = express.Router();
const MAX_QUESTIONS_PER_REQUEST = 100;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CBT_DATA_DIRECTORY = path.resolve(__dirname, "../CBT-data");

const normalize = (value) => String(value || "").trim().toLowerCase();

const toPublicQuestion = ({ correctIndex, explanation, ...question }) => question;

const parseLimit = (value) => {
  if (value === undefined) return 20;

  const limit = Number(value);
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_QUESTIONS_PER_REQUEST) {
    return null;
  }

  return limit;
};

const shuffle = (questions) => {
  const result = [...questions];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
};

const getJsonFiles = (directory) => {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return getJsonFiles(entryPath);
    return entry.isFile() && entry.name.endsWith(".json") ? [entryPath] : [];
  });
};

const loadQuestionBanks = () => {
  const questionIds = new Set();

  return getJsonFiles(CBT_DATA_DIRECTORY).flatMap((filePath) => {
    let bank;
    try {
      bank = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (error) {
      console.error(`[cbt] Unable to read ${filePath}:`, error.message);
      return [];
    }

    const { school, level, department, course, questions } = bank;
    if (!school || !level || !department || !course?.code || !Array.isArray(questions)) {
      console.error(`[cbt] Ignoring invalid question bank: ${filePath}`);
      return [];
    }

    return questions.flatMap((question) => {
      const validQuestion =
        question?.id &&
        question?.prompt &&
        Array.isArray(question?.answers) &&
        question.answers.length >= 2 &&
        Number.isInteger(question?.correctIndex) &&
        question.correctIndex >= 0 &&
        question.correctIndex < question.answers.length;

      if (!validQuestion || questionIds.has(question.id)) {
        console.error(`[cbt] Ignoring invalid or duplicate question ${question?.id || "without an id"}`);
        return [];
      }

      questionIds.add(question.id);
      return [{
        ...question,
        school,
        level: String(level),
        department,
        course: course.code,
        courseTitle: course.title || course.code,
      }];
    });
  });
};

const cbtQuestions = loadQuestionBanks();

// GET /api/cbt?school=&level=&department=&course=&difficulty=&limit=&shuffle=true
cbtRoutes.get("/", (req, res) => {
  const { school, level, department, course, difficulty, shuffle: shouldShuffle } = req.query;
  const limit = parseLimit(req.query.limit);

  if (limit === null) {
    return res.status(400).json({
      success: false,
      error: `limit must be an integer between 1 and ${MAX_QUESTIONS_PER_REQUEST}`,
    });
  }

  if (shouldShuffle !== undefined && shouldShuffle !== "true" && shouldShuffle !== "false") {
    return res.status(400).json({ success: false, error: "shuffle must be either true or false" });
  }

  let questions = cbtQuestions.filter((question) => {
    if (school && normalize(question.school) !== normalize(school)) return false;
    if (level && normalize(question.level) !== normalize(level)) return false;
    if (department && normalize(question.department) !== normalize(department)) return false;
    if (course && normalize(question.course) !== normalize(course)) return false;
    if (difficulty && normalize(question.difficulty) !== normalize(difficulty)) return false;
    return true;
  });

  if (shouldShuffle === "true") questions = shuffle(questions);

  const selectedQuestions = questions.slice(0, limit).map(toPublicQuestion);
  return res.json({
    success: true,
    total: questions.length,
    count: selectedQuestions.length,
    questions: selectedQuestions,
  });
});

// GET /api/cbt/meta - schools, levels, departments, and courses available for CBT.
cbtRoutes.get("/meta", (req, res) => {
  const uniqueValues = (key) =>
    [...new Set(cbtQuestions.map((question) => question[key]))].sort((a, b) =>
      String(a).localeCompare(String(b))
    );

  return res.json({
    success: true,
    totalQuestions: cbtQuestions.length,
    schools: uniqueValues("school"),
    levels: uniqueValues("level"),
    departments: uniqueValues("department"),
    courses: [...new Map(cbtQuestions.map((question) => [question.course, {
      code: question.course,
      title: question.courseTitle,
    }])).values()],
    difficulties: uniqueValues("difficulty"),
  });
});

// GET /api/cbt/:id
cbtRoutes.get("/:id", (req, res) => {
  const question = cbtQuestions.find((item) => item.id === req.params.id);
  if (!question) return res.status(404).json({ success: false, error: "Question not found" });

  return res.json({ success: true, question: toPublicQuestion(question) });
});

// POST /api/cbt/submit
// Body: { answers: [{ questionId: "...", selectedIndex: 0 }] }
cbtRoutes.post("/submit", (req, res) => {
  const { answers } = req.body || {};

  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ success: false, error: "answers must be a non-empty array" });
  }
  if (answers.length > MAX_QUESTIONS_PER_REQUEST) {
    return res.status(400).json({
      success: false,
      error: `A maximum of ${MAX_QUESTIONS_PER_REQUEST} answers can be submitted at once`,
    });
  }

  const seenQuestionIds = new Set();
  const results = [];

  for (const answer of answers) {
    const questionId = answer?.questionId;
    const selectedIndex = answer?.selectedIndex;

    if (typeof questionId !== "string" || !Number.isInteger(selectedIndex)) {
      return res.status(400).json({
        success: false,
        error: "Each answer requires a questionId string and an integer selectedIndex",
      });
    }
    if (seenQuestionIds.has(questionId)) {
      return res.status(400).json({ success: false, error: "Each question can only be submitted once" });
    }
    seenQuestionIds.add(questionId);

    const question = cbtQuestions.find((item) => item.id === questionId);
    if (!question) {
      return res.status(400).json({ success: false, error: `Unknown questionId: ${questionId}` });
    }
    if (selectedIndex < 0 || selectedIndex >= question.answers.length) {
      return res.status(400).json({
        success: false,
        error: `selectedIndex is invalid for questionId: ${questionId}`,
      });
    }

    results.push({
      questionId,
      selectedIndex,
      correctIndex: question.correctIndex,
      isCorrect: selectedIndex === question.correctIndex,
      explanation: question.explanation,
    });
  }

  const score = results.filter((result) => result.isCorrect).length;
  return res.json({
    success: true,
    score,
    total: results.length,
    percentage: Number(((score / results.length) * 100).toFixed(2)),
    results,
  });
});

export default cbtRoutes;
