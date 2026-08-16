import express from "express";
import formulas from "../data/formulas.js";

const formulasRoutes = express.Router();

formulasRoutes.get("/", (req, res) => {
  res.json(formulas);
});

formulasRoutes.get("/:id", (req, res) => {
  const formulaId = parseInt(req.params.id);
  const formula = formulas.find(
    (f) => f.id === formulaId
  );
  if (!formula) {
    return res.status(404).json({
      error: "Formula not found"
    });
  }

  res.json(formula);
});

formulasRoutes.get("/category/:category", (req, res) => {
  const category = req.params.category.toLowerCase();
  const filteredFormulas = formulas.filter(
    (f) => f.category.toLowerCase() === category
  );
  if (filteredFormulas.length === 0) {
    return res.status(404).json({
      error: "No formulas found for this category"
    });
  }
  res.json(filteredFormulas);
});

formulasRoutes.get ("/subject/:subject", (req, res) => {
  const subject = req.params.subject.toLowerCase();
  const filteredFormulas = formulas.filter(
    (f) => f.subject.toLowerCase() === subject
  );
  if (filteredFormulas.length === 0) {
    return res.status(404).json({
      error: "No formulas found for this subject"
    });
  }
  res.json(filteredFormulas);
}); 

export default formulasRoutes;