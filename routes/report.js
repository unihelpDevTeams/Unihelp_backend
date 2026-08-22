import express from "express";
import crypto from "crypto";
import { query } from "../db/pool.js";
import { authenticateFirebaseUser } from "../middleware/auth.js";

const router = express.Router();

const validateReportInput = ({ category, details }) => {
  const errors = [];
  if (!category?.trim()) errors.push("Category is required");
  if (!details?.trim()) errors.push("Details are required");
  return errors;
};

// POST /
const handleReport = async (req, res) => {
  try {
    const { category, reportedUser, details, reportType, title, description } = req.body;

    const effectiveReportType = reportType || category;
    const effectiveDescription = description || details;
    const effectiveTitle = title || reportedUser || "";

    const errors = validateReportInput({ category: effectiveReportType, details: effectiveDescription });
    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.join(". "),
        errors,
      });
    }

    const id = crypto.randomUUID();
    const userId = req.user?.uid || null;
    const displayName = req.user?.displayName || req.user?.name || "";
    const email = req.user?.email || "";

    await query(
      `INSERT INTO reports (id, user_id, display_name, email, report_type, title, description, attachments, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')`,
      [id, userId, displayName, email, effectiveReportType.trim(), effectiveTitle.trim(), effectiveDescription.trim(), JSON.stringify([])]
    );

    res.status(201).json({
      message: "Report submitted successfully",
      id,
    });
  } catch (error) {
    console.error("Report submission error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

router.post("/", handleReport);
router.post("/report", handleReport);

// GET /
router.get("/", authenticateFirebaseUser, async (req, res) => {
  try {
    const { status, search, sortField = "created_at", sortDirection = "desc", limit = 10, offset = 0 } = req.query;
    
    let baseQuery = `FROM reports WHERE 1=1`;
    const params = [];
    
    if (status) {
      params.push(status);
      baseQuery += ` AND status = $${params.length}`;
    }
    
    if (search) {
      params.push(`%${search}%`);
      baseQuery += ` AND (title ILIKE $${params.length} OR description ILIKE $${params.length} OR report_type ILIKE $${params.length} OR display_name ILIKE $${params.length} OR email ILIKE $${params.length})`;
    }

    const countRes = await query(`SELECT COUNT(*) ${baseQuery}`, params);
    const total = parseInt(countRes.rows[0].count, 10);

    const allowedSortFields = ["created_at", "updated_at", "status", "report_type", "display_name"];
    const sort = allowedSortFields.includes(sortField) ? sortField : "created_at";
    const dir = sortDirection.toLowerCase() === "asc" ? "ASC" : "DESC";

    params.push(parseInt(limit, 10) || 10);
    const limitIdx = params.length;
    params.push(parseInt(offset, 10) || 0);
    const offsetIdx = params.length;

    const dataRes = await query(`SELECT * ${baseQuery} ORDER BY ${sort} ${dir} LIMIT $${limitIdx} OFFSET $${offsetIdx}`, params);

    res.json({
      data: dataRes.rows,
      total,
      limit: params[limitIdx - 1],
      offset: params[offsetIdx - 1]
    });
  } catch (error) {
    console.error("Fetch reports error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET /:id
router.get("/:id", authenticateFirebaseUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await query(`SELECT * FROM reports WHERE id = $1`, [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error("Fetch report error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// PATCH /:id/status
router.patch("/:id/status", authenticateFirebaseUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });

    const { rows } = await query(
      `UPDATE reports SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Status updated", data: rows[0] });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE /:id
router.delete("/:id", authenticateFirebaseUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await query(`DELETE FROM reports WHERE id = $1`, [id]);
    if (rowCount === 0) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete report error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST /:id/notes
router.post("/:id/notes", authenticateFirebaseUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    if (!note) return res.status(400).json({ message: "Note is required" });

    const noteId = crypto.randomUUID();
    const adminId = req.user?.uid || "system";
    const adminName = req.user?.name || req.user?.email || "Admin";

    const { rows } = await query(
      `INSERT INTO support_notes (id, entity_type, entity_id, admin_id, admin_name, note)
       VALUES ($1, 'report', $2, $3, $4, $5) RETURNING *`,
      [noteId, id, adminId, adminName, note]
    );
    res.status(201).json({ message: "Note added", data: rows[0] });
  } catch (error) {
    console.error("Add note error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET /:id/notes
router.get("/:id/notes", authenticateFirebaseUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await query(
      `SELECT * FROM support_notes WHERE entity_type = 'report' AND entity_id = $1 ORDER BY created_at ASC`,
      [id]
    );
    res.json(rows);
  } catch (error) {
    console.error("Fetch notes error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;