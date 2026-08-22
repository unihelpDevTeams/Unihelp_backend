import express from "express";
import { query } from "../db/pool.js";
import { authenticateFirebaseUser } from "../middleware/auth.js";

const router = express.Router();

// Get all cgpa_tracker records for req.user.uid
router.get("/", authenticateFirebaseUser, async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM cgpa_tracker WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.uid]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching CGPA trackers:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Create a new cgpa_tracker record
router.post("/", authenticateFirebaseUser, async (req, res) => {
  try {
    const { semesters, cgpa, scale } = req.body;
    const result = await query(
      "INSERT INTO cgpa_tracker (user_id, semesters, cgpa, scale) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.user.uid, JSON.stringify(semesters) || "[]", cgpa, scale]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error creating CGPA tracker:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Update a cgpa_tracker record
router.put("/:id", authenticateFirebaseUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { semesters, cgpa, scale } = req.body;
    const result = await query(
      "UPDATE cgpa_tracker SET semesters = $1, cgpa = $2, scale = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 AND user_id = $5 RETURNING *",
      [JSON.stringify(semesters) || "[]", cgpa, scale, id, req.user.uid]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Record not found or not authorized" });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error updating CGPA tracker:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Delete a cgpa_tracker record
router.delete("/:id", authenticateFirebaseUser, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      "DELETE FROM cgpa_tracker WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.uid]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Record not found or not authorized" });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error deleting CGPA tracker:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

export default router;
