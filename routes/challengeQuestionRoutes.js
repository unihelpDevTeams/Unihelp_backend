import express from "express";
import challengeQuestions from "../data/challengeQuestions.js";

const challengeQuestionRoutes = express.Router();

challengeQuestionRoutes.get("/", (req, res) => {
  res.json(challengeQuestions);
});

challengeQuestionRoutes.get("/:id", (req, res) => {
  const questionId = req.params.id;
  const question = challengeQuestions.find((q) => q.id === questionId);
  if (!question) {
    return res.status(404).json({
      error: "Question not found"
    });
  }
  res.json(question);
});

challengeQuestionRoutes.get("/category/:category", (req, res) => {
  const category = req.params.category;
  const questions = challengeQuestions.filter((q) => q.category === category);
  res.json(questions);
});

export default challengeQuestionRoutes;