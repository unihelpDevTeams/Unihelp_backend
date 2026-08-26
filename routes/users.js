import express from "express";
import { query } from "../db/pool.js";
import { authenticateFirebaseUser } from "../middleware/auth.js";

const router = express.Router();

// GET / - Get user profile
router.get("/", authenticateFirebaseUser, async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM users WHERE id = $1",
      [req.user.uid]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// PUT / - Update user profile
router.put("/", authenticateFirebaseUser, async (req, res) => {
  try {
    const { display_name, email, university, department, level, avatar, bio, total_points, rank_name } = req.body;
    
    // UPSERT pattern if the user doesn't exist yet, or just UPDATE if you prefer.
    // The prompt says "users (id TEXT PRIMARY KEY...)", let's do an INSERT ... ON CONFLICT DO UPDATE
    
    const result = await query(
      `INSERT INTO users (id, display_name, email, university, department, level, avatar, bio, total_points, rank_name, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
       ON CONFLICT (id) DO UPDATE SET
         display_name = EXCLUDED.display_name,
         email = EXCLUDED.email,
         university = EXCLUDED.university,
         department = EXCLUDED.department,
         level = EXCLUDED.level,
         avatar = EXCLUDED.avatar,
         bio = EXCLUDED.bio,
         total_points = COALESCE(EXCLUDED.total_points, users.total_points),
         rank_name = COALESCE(EXCLUDED.rank_name, users.rank_name),
         updated_at = NOW()
       RETURNING *`,
      [req.user.uid, display_name, email, university, department, level, avatar, bio, total_points, rank_name]
    );
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// GET /bookmarks
router.get("/bookmarks", authenticateFirebaseUser, async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM bookmarks WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.uid]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// POST /bookmarks
router.post("/bookmarks", authenticateFirebaseUser, async (req, res) => {
  try {
    const { item_id, item_type } = req.body;
    if (!item_id || !item_type) {
      return res.status(400).json({ success: false, error: "item_id and item_type are required" });
    }
    const result = await query(
      `INSERT INTO bookmarks (user_id, item_id, item_type, created_at) 
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [req.user.uid, item_id, item_type]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error adding bookmark:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// DELETE /bookmarks/:id
router.delete("/bookmarks/:id", authenticateFirebaseUser, async (req, res) => {
  try {
    const { id } = req.params;
    // Allow delete by bookmark ID or by item_id (which might be the case from UI)
    // Actually, usually users delete by item_id or ID. Let's assume ID is what they pass if it's UUID.
    // Let's also support deleting by item_id if they pass it as query params? 
    // "DELETE /bookmarks/:id" -> we will assume id is the UUID of the bookmark.
    // What if they only know item_id? Let's just delete by bookmark ID for now.
    const result = await query(
      "DELETE FROM bookmarks WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.uid]
    );
    
    // Some frontends might send item_id instead of id if they don't know the bookmark UUID.
    // Let's add a fallback if no rows are deleted and it looks like it might be an item_id.
    if (result.rowCount === 0) {
      const altResult = await query(
        "DELETE FROM bookmarks WHERE item_id = $1 AND user_id = $2 RETURNING *",
        [id, req.user.uid]
      );
      if (altResult.rowCount === 0) {
         return res.status(404).json({ success: false, error: "Bookmark not found" });
      }
      return res.json({ success: true, data: altResult.rows[0] });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// GET /activity
router.get("/activity", authenticateFirebaseUser, async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM activity_feeds WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.uid]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching activity:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

export default router;
