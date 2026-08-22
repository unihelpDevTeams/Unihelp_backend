import express from "express";
import { query } from "../db/pool.js";
import { authenticateFirebaseUser } from "../middleware/auth.js";

const router = express.Router();

// Get all gpa_records for req.user.uid
router.get("/", authenticateFirebaseUser, async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM gpa_records WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.uid]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching GPA records:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Create a new gpa_records
router.post("/", authenticateFirebaseUser, async (req, res) => {
  try {
    const { GPA, classification, courses } = req.body;
    const result = await query(
      "INSERT INTO gpa_records (user_id, gpa, classification, courses) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.user.uid, GPA, classification, JSON.stringify(courses) || "[]"]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error creating GPA record:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Delete a gpa_records
router.delete("/:id", authenticateFirebaseUser, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      "DELETE FROM gpa_records WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.uid]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Record not found or not authorized" });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error deleting GPA record:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

export default router;
