import crypto from "crypto";
import express from "express";
import { getPool, query } from "../db/pool.js";
import { authenticateFirebaseUser } from "../middleware/auth.js";
import { cleanString, parsePositiveInt, pickExtra, toIso } from "../utils/apiHelpers.js";
import { deleteCloudinaryAssets } from "../utils/cloudinaryCleanup.js";

const storiesRoutes = express.Router();
const RESERVED = ["id", "authorId", "authorName", "authorAvatar", "title", "summary", "description", "genre", "category", "content", "coverImage", "coverAsset", "status", "views", "likes", "likedBy", "bookmarks", "chaptersCount", "commentCount", "createdAt", "updatedAt", "expiresAt"];

const assertCloudinaryCleanupComplete = (cloudinaryResults = []) => {
  const incomplete = cloudinaryResults.filter((item) => item.skipped || item.success === false);
  if (!incomplete.length) return;

  const reasons = incomplete
    .map((item) => item.reason || item.error || item.publicId || "unknown")
    .filter(Boolean)
    .join(", ");

  throw new Error(`Cloudinary cleanup incomplete: ${reasons}`);
};

const mapStory = (row) => ({
  id: row.id,
  ...(row.extra || {}),
  authorId: row.author_id,
  authorName: row.author_name,
  authorAvatar: row.author_avatar,
  title: row.title,
  summary: row.summary,
  description: row.summary,
  genre: row.genre,
  category: row.genre,
  content: row.content,
  coverImage: row.cover_image,
  coverAsset: row.cover_image
    ? { url: row.cover_image, publicId: row.cover_public_id || "", resourceType: row.cover_resource_type || "image" }
    : null,
  status: row.status,
  views: row.views,
  likes: row.likes,
  likedBy: row.liked_by || {},
  bookmarks: row.bookmarks,
  chaptersCount: row.chapters_count,
  commentCount: row.comment_count,
  expiresAt: toIso(row.expires_at),
  createdAt: toIso(row.created_at),
  updatedAt: toIso(row.updated_at),
});

const storyPayload = (payload = {}) => {
  const coverAsset = payload.coverAsset || {};
  return {
    title: cleanString(payload.title),
    summary: cleanString(payload.summary || payload.description),
    genre: cleanString(payload.genre || payload.category),
    content: cleanString(payload.content),
    coverImage: cleanString(payload.coverImage || coverAsset.url || coverAsset.secure_url),
    coverPublicId: cleanString(coverAsset.publicId || coverAsset.public_id),
    coverResourceType: cleanString(coverAsset.resourceType || coverAsset.resource_type, "image") || "image",
    status: cleanString(payload.status, "draft") || "draft",
    expiresAt: payload.expiresAt || payload.expires_at || null,
  };
};

storiesRoutes.get("/", async (req, res) => {
  try {
    const page = parsePositiveInt(req.query.page, 1, 10000);
    const limit = parsePositiveInt(req.query.limit, 20, 100);
    const offset = (page - 1) * limit;
    const clauses = ["(expires_at IS NULL OR expires_at > NOW())"];
    const params = [];

    if (req.query.authorId || req.query.userId) {
      params.push(String(req.query.authorId || req.query.userId));
      clauses.push(`author_id = $${params.length}`);
    }
    if (req.query.status) {
      params.push(String(req.query.status));
      clauses.push(`status = $${params.length}`);
    }
    if (req.query.genre || req.query.category) {
      params.push(String(req.query.genre || req.query.category));
      clauses.push(`genre = $${params.length}`);
    }
    if (req.query.search) {
      params.push(String(req.query.search));
      clauses.push(`to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(author_name, '') || ' ' || coalesce(genre, '')) @@ plainto_tsquery('simple', $${params.length})`);
    }

    params.push(limit, offset);
    const countResult = await query(
      `SELECT COUNT(*)::int AS total FROM stories WHERE ${clauses.join(" AND ")}`,
      params.slice(0, -2)
    );
    const result = await query(
      `SELECT * FROM stories WHERE ${clauses.join(" AND ")} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    const items = result.rows.map(mapStory);
    res.json({ items, page, limit, total: countResult.rows[0]?.total || 0, hasMore: offset + items.length < (countResult.rows[0]?.total || 0) });
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ error: "Failed to fetch stories" });
  }
});

storiesRoutes.get("/:id", async (req, res) => {
  try {
    const result = await query("SELECT * FROM stories WHERE id = $1 AND (expires_at IS NULL OR expires_at > NOW())", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ error: "Story not found" });
    res.json(mapStory(result.rows[0]));
  } catch (error) {
    console.error("Error fetching story:", error);
    res.status(500).json({ error: "Failed to fetch story" });
  }
});

storiesRoutes.post("/", authenticateFirebaseUser, async (req, res) => {
  try {
    const payload = storyPayload(req.body);
    if (!payload.title) return res.status(400).json({ error: "title is required" });
    const id = req.body.id || crypto.randomUUID();
    const result = await query(
      `INSERT INTO stories (id, author_id, author_name, author_avatar, title, summary, genre, content, cover_image, cover_public_id, cover_resource_type, status, expires_at, extra)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [
        id,
        req.user.uid,
        cleanString(req.body.authorName, req.user.name || "A student"),
        cleanString(req.body.authorAvatar, req.user.picture || ""),
        payload.title,
        payload.summary,
        payload.genre,
        payload.content,
        payload.coverImage,
        payload.coverPublicId || null,
        payload.coverResourceType,
        payload.status,
        payload.expiresAt,
        pickExtra(req.body, RESERVED),
      ]
    );
    res.status(201).json(mapStory(result.rows[0]));
  } catch (error) {
    console.error("Error creating story:", error);
    res.status(500).json({ error: "Failed to create story" });
  }
});

storiesRoutes.put("/:id", authenticateFirebaseUser, async (req, res) => {
  try {
    const existing = await query("SELECT * FROM stories WHERE id = $1", [req.params.id]);
    if (!existing.rowCount) return res.status(404).json({ error: "Story not found" });
    if (existing.rows[0].author_id !== req.user.uid && req.user.admin !== true) {
      return res.status(403).json({ error: "You can only edit your own stories" });
    }
    const payload = storyPayload({
      title: req.body.title ?? existing.rows[0].title,
      summary: req.body.summary ?? existing.rows[0].summary,
      genre: req.body.genre ?? existing.rows[0].genre,
      content: req.body.content ?? existing.rows[0].content,
      coverImage: req.body.coverImage ?? existing.rows[0].cover_image,
      coverAsset: req.body.coverAsset,
      status: req.body.status ?? existing.rows[0].status,
      expiresAt: req.body.expiresAt ?? existing.rows[0].expires_at,
    });
    const result = await query(
      `UPDATE stories SET title=$2, summary=$3, genre=$4, content=$5, cover_image=$6, cover_public_id=coalesce($7, cover_public_id), cover_resource_type=$8, status=$9, expires_at=$10, extra=extra || $11::jsonb, updated_at=NOW()
       WHERE id=$1 RETURNING *`,
      [req.params.id, payload.title, payload.summary, payload.genre, payload.content, payload.coverImage, payload.coverPublicId || null, payload.coverResourceType, payload.status, payload.expiresAt, pickExtra(req.body, RESERVED)]
    );
    res.json(mapStory(result.rows[0]));
  } catch (error) {
    console.error("Error updating story:", error);
    res.status(500).json({ error: "Failed to update story" });
  }
});

storiesRoutes.delete("/:id", authenticateFirebaseUser, async (req, res) => {
  try {
    const existing = await query("SELECT author_id, cover_image, cover_public_id, cover_resource_type FROM stories WHERE id = $1", [req.params.id]);
    if (!existing.rowCount) return res.status(404).json({ error: "Story not found" });
    if (existing.rows[0].author_id !== req.user.uid && req.user.admin !== true) {
      return res.status(403).json({ error: "You can only delete your own stories" });
    }

    const story = existing.rows[0];
    const assets = [];
    if (story.cover_image || story.cover_public_id) {
      assets.push({
        url: story.cover_image || "",
        publicId: story.cover_public_id || "",
        resourceType: story.cover_resource_type || "image",
      });
    }

    if (assets.length) {
      const cloudinaryResults = await deleteCloudinaryAssets(assets);
      assertCloudinaryCleanupComplete(cloudinaryResults);
    }

    await query("DELETE FROM stories WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting story:", error);
    res.status(500).json({ error: error.message || "Failed to delete story" });
  }
});

storiesRoutes.post("/:id/views", async (req, res) => {
  try {
    await query("UPDATE stories SET views = views + 1 WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error("Error incrementing story view:", error);
    res.status(500).json({ error: "Failed to increment story view" });
  }
});

storiesRoutes.post("/:id/like", authenticateFirebaseUser, async (req, res) => {
  try {
    const result = await query("SELECT liked_by, likes FROM stories WHERE id = $1", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ error: "Story not found" });
    const likedBy = result.rows[0].liked_by || {};
    const liked = !likedBy[req.user.uid];
    if (liked) likedBy[req.user.uid] = true;
    else delete likedBy[req.user.uid];
    const likes = Math.max(0, Number(result.rows[0].likes || 0) + (liked ? 1 : -1));
    await query("UPDATE stories SET liked_by = $2, likes = $3, updated_at = NOW() WHERE id = $1", [req.params.id, likedBy, likes]);
    res.json({ liked, likes });
  } catch (error) {
    console.error("Error toggling story like:", error);
    res.status(500).json({ error: "Failed to toggle story like" });
  }
});

storiesRoutes.get("/:id/comments", async (req, res) => {
  try {
    const result = await query("SELECT * FROM story_comments WHERE story_id = $1 ORDER BY created_at DESC LIMIT 100", [req.params.id]);
    res.json(result.rows.map((row) => ({
      id: row.id,
      storyId: row.story_id,
      authorId: row.author_id,
      authorName: row.author_name,
      authorAvatar: row.author_avatar,
      text: row.text,
      createdAt: toIso(row.created_at),
    })));
  } catch (error) {
    console.error("Error fetching story comments:", error);
    res.status(500).json({ error: "Failed to fetch story comments" });
  }
});

storiesRoutes.post("/:id/comments", authenticateFirebaseUser, async (req, res) => {
  const client = await getPool().connect();
  try {
    const text = cleanString(req.body.text);
    if (!text) return res.status(400).json({ error: "Comment cannot be empty" });
    const id = req.body.id || crypto.randomUUID();
    await client.query("BEGIN");
    const result = await client.query(
      `INSERT INTO story_comments (id, story_id, author_id, author_name, author_avatar, text)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [id, req.params.id, req.user.uid, cleanString(req.body.authorName, req.user.name || "Anonymous"), cleanString(req.body.authorAvatar, req.user.picture || ""), text]
    );
    await client.query("UPDATE stories SET comment_count = comment_count + 1 WHERE id = $1", [req.params.id]);
    await client.query("COMMIT");
    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("Error creating story comment:", error);
    res.status(500).json({ error: "Failed to create story comment" });
  } finally {
    client.release();
  }
});

storiesRoutes.post("/clear-cache", (req, res) => res.json({ message: "PostgreSQL route does not use route cache" }));

export default storiesRoutes;
