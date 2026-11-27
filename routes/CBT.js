import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const cbtRoutes = express.Router();
const MAX_QUESTIONS_PER_REQUEST = 100;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CBT_DATA_DIRECTORY = path.resolve(__dirname, "../CBT-data");

const normalize = (value) => String(value || "").trim().toLowerCase();
const catalogId = ({ school, level, department, course }) =>
  [school, level, department, course].map((value) => encodeURIComponent(String(value))).join("|");

// Some imported CBT banks were saved as UTF-8 and later read as Windows-1252.
// Repair those sequences at the API boundary so every client receives real
// mathematical symbols (², ₈, ∩, √, −, …) instead of âˆ©/Â²-style mojibake.
const WINDOWS_1252_BYTES = new Map([
  ["€", 0x80], ["‚", 0x82], ["ƒ", 0x83], ["„", 0x84], ["…", 0x85], ["†", 0x86], ["‡", 0x87],
  ["ˆ", 0x88], ["‰", 0x89], ["Š", 0x8A], ["‹", 0x8B], ["Œ", 0x8C], ["Ž", 0x8E], ["‘", 0x91],
  ["’", 0x92], ["“", 0x93], ["”", 0x94], ["•", 0x95], ["–", 0x96], ["—", 0x97], ["˜", 0x98],
  ["™", 0x99], ["š", 0x9A], ["›", 0x9B], ["œ", 0x9C], ["ž", 0x9E], ["Ÿ", 0x9F],
]);
const encodeWindows1252 = (value) => Buffer.from([...value].map((character) => {
  const code = character.codePointAt(0);
  return WINDOWS_1252_BYTES.get(character) ?? (code <= 0xFF ? code : 0x3F);
}));

const repairTextEncoding = (value) => {
  if (typeof value !== "string") return value;
  let repaired = value;
  for (let pass = 0; pass < 2 && /(?:Ã.|Â.|â.|á.)/.test(repaired); pass += 1) {
    try {
      const candidate = encodeWindows1252(repaired).toString("utf8");
      if (candidate.includes("�")) break;
      repaired = candidate;
    } catch {
      break;
    }
  }
  return repaired;
};

const MATH_PATTERN = /[=+−–×÷√∛∜∫∑∏≤≥≠≈∞∩∪∈∉∂∆πθλμσ²³⁴⁵⁶⁷⁸⁹⁰¹₀₁₂₃₄₅₆₇₈₉]|\b(?:log|ln|sin|cos|tan|cot|sec|csc|matrix|det|lim|integral|differentiate|coefficient)\b/i;
const SUPER_TO_ASCII = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁺': '+', '⁻': '-', '⁼': '=', '⁽': '(', '⁾': ')', 'ⁿ': 'n', 'ⁱ': 'i', 'ˣ': 'x', 'ʸ': 'y' };
const SUB_TO_ASCII = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', '₊': '+', '₋': '-', '₌': '=', '₍': '(', '₎': ')' };
const toLatex = (value) => {
  let latex = String(value || '').trim();
  latex = latex.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁿⁱˣʸ]+/g, (group) => `^{${[...group].map((char) => SUPER_TO_ASCII[char] || char).join('')}}`);
  latex = latex.replace(/[₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎]+/g, (group) => `_{${[...group].map((char) => SUB_TO_ASCII[char] || char).join('')}}`);
  latex = latex
    .replace(/∛\(([^()]+)\)/g, '\\sqrt[3]{$1}')
    .replace(/∜\(([^()]+)\)/g, '\\sqrt[4]{$1}')
    .replace(/√\(([^()]+)\)/g, '\\sqrt{$1}')
    .replace(/√/g, '\\sqrt{}')
    .replace(/∫/g, '\\int ')
    .replace(/∑/g, '\\sum ')
    .replace(/∏/g, '\\prod ')
    .replace(/∩/g, '\\cap ')
    .replace(/∪/g, '\\cup ')
    .replace(/∈/g, '\\in ')
    .replace(/∉/g, '\\notin ')
    .replace(/≤/g, '\\le ')
    .replace(/≥/g, '\\ge ')
    .replace(/≠/g, '\\ne ')
    .replace(/≈/g, '\\approx ')
    .replace(/∞/g, '\\infty ')
    .replace(/[−–]/g, '-')
    .replace(/×/g, '\\times ')
    .replace(/÷/g, '\\div ')
    .replace(/π/g, '\\pi ')
    .replace(/θ/g, '\\theta ')
    .replace(/λ/g, '\\lambda ')
    .replace(/μ/g, '\\mu ')
    .replace(/σ/g, '\\sigma ')
    .replace(/∆/g, '\\Delta ');
  latex = latex.replace(/(?<![A-Za-z])([0-9]+)\/([0-9]+)(?![A-Za-z])/g, '\\frac{$1}{$2}');
  return latex;
};
const isFormulaOnly = (value) => {
  const text = String(value || '').trim();
  const numericOrVariableFormula = /^[0-9a-zA-Z\s,./=+\-−–(){}]+$/.test(text) && /(?:[=\/]|\d\s*[+\-−–]\s*\d|[a-zA-Z]\s*=)/.test(text);
  return Boolean(text) && (MATH_PATTERN.test(text) || numericOrVariableFormula) && !/\b(?:the|this|that|which|and|or|is|are|with|from|find|solve|simplify|determine|coefficient)\b/i.test(text);
};
const extractPromptFormula = (prompt) => {
  const candidates = [...String(prompt || '').matchAll(/\b(?:in|of|where|simplify)\s+(.+?)(?:[.?!]|$)/gi)]
    .map((match) => match[1]?.trim())
    .filter(Boolean);
  const candidate = candidates.find(isFormulaOnly);
  return candidate || null;
};
const decorateQuestion = (question) => {
  const prompt = repairTextEncoding(question.prompt);
  const answers = question.answers.map(repairTextEncoding);
  const explanation = repairTextEncoding(question.explanation || "");
  return {
    ...question,
    prompt,
    answers,
    explanation,
    containsMath: MATH_PATTERN.test([prompt, ...answers, explanation].join(" ")),
    math: {
      promptDisplay: extractPromptFormula(prompt),
      promptLatex: (() => {
        const expression = extractPromptFormula(prompt);
        return expression ? toLatex(expression) : null;
      })(),
      answerLatex: answers.map((answer) => isFormulaOnly(answer) ? toLatex(answer) : null),
    },
  };
};

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
  const questionIdCounts = new Map();

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

      if (!validQuestion) {
        console.error(`[cbt] Ignoring invalid question ${question?.id || "without an id"}`);
        return [];
      }

      const duplicateCount = questionIdCounts.get(question.id) || 0;
      questionIdCounts.set(question.id, duplicateCount + 1);
      return [{
        ...decorateQuestion(question),
        // Some imported banks reuse IDs. Keep every valid item addressable for marking.
        id: duplicateCount ? `${question.id}--${duplicateCount + 1}` : question.id,
        school,
        level: String(level),
        department,
        course: course.code,
        courseTitle: course.title || course.code,
        courseId: catalogId({ school, level, department, course: course.code }),
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

// GET /api/cbt/meta - a structured university > level > department > course catalog.
cbtRoutes.get("/meta", (req, res) => {
  const uniqueValues = (key) =>
    [...new Set(cbtQuestions.map((question) => question[key]))].sort((a, b) =>
      String(a).localeCompare(String(b))
    );

  const courses = [...new Map(cbtQuestions.map((question) => [question.courseId, {
    id: question.courseId,
    school: question.school,
    level: question.level,
    department: question.department,
    code: question.course,
    title: question.courseTitle,
  }])).values()].sort((a, b) =>
    [a.school, a.level, a.department, a.code].join("|").localeCompare(
      [b.school, b.level, b.department, b.code].join("|")
    )
  );
  const courseQuestionCounts = cbtQuestions.reduce((counts, question) => {
    counts[question.courseId] = (counts[question.courseId] || 0) + 1;
    return counts;
  }, {});

  const catalog = Object.values(courses.reduce((schools, course) => {
    const school = schools[course.school] ||= { school: course.school, levels: {} };
    const level = school.levels[course.level] ||= { level: course.level, departments: {} };
    const department = level.departments[course.department] ||= {
      department: course.department,
      courses: [],
    };
    department.courses.push(course);
    return schools;
  }, {})).map((school) => ({
    school: school.school,
    levels: Object.values(school.levels).map((level) => ({
      level: level.level,
      departments: Object.values(level.departments),
    })),
  }));

  return res.json({
    success: true,
    totalQuestions: cbtQuestions.length,
    schools: uniqueValues("school"),
    levels: uniqueValues("level"),
    departments: uniqueValues("department"),
    courses,
    catalog,
    courseQuestionCounts,
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
// Body: { answers: [{ questionId: "...", selectedIndex: 0 | null }] }
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

    if (typeof questionId !== "string" || (selectedIndex !== null && !Number.isInteger(selectedIndex))) {
      return res.status(400).json({
        success: false,
        error: "Each answer requires a questionId string and an integer selectedIndex (or null when skipped)",
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
    if (selectedIndex !== null && (selectedIndex < 0 || selectedIndex >= question.answers.length)) {
      return res.status(400).json({
        success: false,
        error: `selectedIndex is invalid for questionId: ${questionId}`,
      });
    }

    results.push({
      questionId,
      selectedIndex,
      correctIndex: question.correctIndex,
      isCorrect: selectedIndex !== null && selectedIndex === question.correctIndex,
      isSkipped: selectedIndex === null,
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
