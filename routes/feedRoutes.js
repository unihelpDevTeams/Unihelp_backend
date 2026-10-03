import express from "express";
import crypto from "crypto";
import { authenticateFirebaseUser } from "../middleware/auth.js";
import { query } from "../db/pool.js";
import { deleteCloudinaryAsset } from "../utils/cloudinaryCleanup.js";

const router = express.Router();

// Fire-and-forget cleanup query function
const cleanupExpiredPosts = () => {
  query(`DELETE FROM feed_posts WHERE expires_at < NOW()`).catch(err => {
    console.error("Error during expired posts cleanup:", err);
  });
};

router.get("/", authenticateFirebaseUser, async (req, res) => {
  try {
    // Perform cleanup asynchronously
    cleanupExpiredPosts();

    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const result = await query(
      `SELECT * FROM feed_posts 
       WHERE expires_at > NOW() 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const items = result.rows.map(post => ({
      id: post.id,
      authorId: post.author_id,
      authorName: post.author_name,
      authorAvatar: post.author_photo,
      university: post.university,
      type: post.type,
      audience: post.audience,
      backgroundPreset: post.background_preset,
      content: post.content,
      imageUrl: post.image_url,
      cloudinaryPublicId: post.cloudinary_public_id,
      commentsCount: post.comments_count,
      likesCount: post.likes_count,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      expiresAt: post.expires_at,
    }));

    res.json({
      success: true,
      items,
      hasMore: result.rows.length === limit,
      nextCursor: String(offset + limit)
    });
  } catch (error) {
    console.error("Error fetching feed:", error);
    res.status(500).json({ success: false, error: "Could not load feed" });
  }
});

router.post("/posts", authenticateFirebaseUser, async (req, res) => {
  try {
    const { content, imageUrl, cloudinaryPublicId, university, type, audience, backgroundPreset } = req.body;
    
    // Fallback info for user, could come from req.user
    const authorName = req.user.name || req.user.displayName || "Student";
    const authorPhoto = req.user.picture || req.user.photoURL || null;

    const result = await query(
      `INSERT INTO feed_posts 
       (author_id, author_name, author_photo, university, content, type, audience, background_preset, image_url, cloudinary_public_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [
        req.user.uid, 
        authorName, 
        authorPhoto, 
        university || null, 
        content, 
        type || 'text', 
        audience || 'everyone', 
        backgroundPreset || null, 
        imageUrl || null, 
        cloudinaryPublicId || null
      ]
    );

    const post = result.rows[0];
    const item = {
      id: post.id,
      authorId: post.author_id,
      authorName: post.author_name,
      authorAvatar: post.author_photo,
      university: post.university,
      type: post.type,
      audience: post.audience,
      backgroundPreset: post.background_preset,
      content: post.content,
      imageUrl: post.image_url,
      cloudinaryPublicId: post.cloudinary_public_id,
      commentsCount: post.comments_count,
      likesCount: post.likes_count,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      expiresAt: post.expires_at,
    };

    res.status(201).json({ success: true, item });
  } catch (error) {
    console.error("Error creating feed post:", error);
    res.status(500).json({ success: false, error: "Could not create post" });
  }
});

router.get("/users/:uid/posts", authenticateFirebaseUser, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const offset = parseInt(req.query.offset) || 0;
    
    // Support pagination for a specific user's posts
    let sql = `SELECT * FROM feed_posts WHERE author_id = $1 AND expires_at > NOW() ORDER BY created_at DESC LIMIT $2 OFFSET $3`;
    let values = [req.params.uid, limit, offset];
    
    const { rows } = await query(sql, values);
    
    const items = rows.map(post => ({
      id: post.id,
      authorId: post.author_id,
      authorName: post.author_name,
      authorAvatar: post.author_photo,
      university: post.university,
      type: post.type,
      audience: post.audience,
      backgroundPreset: post.background_preset,
      content: post.content,
      imageUrl: post.image_url,
      cloudinaryPublicId: post.cloudinary_public_id,
      commentsCount: post.comments_count,
      likesCount: post.likes_count,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      expiresAt: post.expires_at,
    }));
    
    res.json({
      success: true,
      items,
      hasMore: rows.length === limit,
      nextCursor: String(offset + limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Could not fetch user posts" });
  }
});

router.get("/posts/:id", authenticateFirebaseUser, async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM feed_posts WHERE id = $1 AND expires_at > NOW()`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    const post = result.rows[0];
    const item = {
      id: post.id,
      authorId: post.author_id,
      authorName: post.author_name,
      authorAvatar: post.author_photo,
      university: post.university,
      type: post.type,
      audience: post.audience,
      backgroundPreset: post.background_preset,
      content: post.content,
      imageUrl: post.image_url,
      cloudinaryPublicId: post.cloudinary_public_id,
      commentsCount: post.comments_count,
      likesCount: post.likes_count,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      expiresAt: post.expires_at,
    };

    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, error: "Could not fetch post" });
  }
});

router.get("/posts/:id/comments", authenticateFirebaseUser, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const result = await query(
      `SELECT * FROM feed_comments 
       WHERE post_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [req.params.id, limit, offset]
    );

    const items = result.rows.map(comment => ({
      id: comment.id,
      postId: comment.post_id,
      authorId: comment.author_id,
      authorName: comment.author_name,
      authorAvatar: comment.author_photo,
      text: comment.text,
      content: comment.text,
      likesCount: comment.likes_count,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
    }));

    res.json({
      success: true,
      items,
      hasMore: result.rows.length === limit,
      nextCursor: String(offset + limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Could not load comments" });
  }
});

router.post("/posts/:id/comments", authenticateFirebaseUser, async (req, res) => {
  try {
    const { text, content } = req.body;
    const commentText = text || content;
    if (!commentText) {
      return res.status(400).json({ success: false, error: "Comment text cannot be empty" });
    }

    const authorName = req.user.name || req.user.displayName || "Student";
    const authorPhoto = req.user.picture || req.user.photoURL || null;

    const commentResult = await query(
      `INSERT INTO feed_comments (post_id, author_id, author_name, author_photo, text)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.params.id, req.user.uid, authorName, authorPhoto, commentText]
    );

    await query(`UPDATE feed_posts SET comments_count = comments_count + 1 WHERE id = $1`, [req.params.id]);

    const comment = commentResult.rows[0];
    const item = {
      id: comment.id,
      postId: comment.post_id,
      authorId: comment.author_id,
      authorName: comment.author_name,
      authorAvatar: comment.author_photo,
      text: comment.text,
      content: comment.text,
      likesCount: comment.likes_count,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
    };

    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, error: "Could not create comment" });
  }
});

router.delete("/comments/:commentId", authenticateFirebaseUser, async (req, res) => {
  try {
    const checkResult = await query(`SELECT post_id, author_id FROM feed_comments WHERE id = $1`, [req.params.commentId]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Comment not found" });
    }

    const comment = checkResult.rows[0];
    if (comment.author_id !== req.user.uid) {
      return res.status(403).json({ success: false, error: "You can only delete your own comments" });
    }

    await query(`DELETE FROM feed_comments WHERE id = $1`, [req.params.commentId]);
    await query(`UPDATE feed_posts SET comments_count = comments_count - 1 WHERE id = $1`, [comment.post_id]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: "Could not delete comment" });
  }
});

router.post("/posts/:id/like", authenticateFirebaseUser, async (req, res) => {
  try {
    const { id } = req.params;
    
    const check = await query(`SELECT id FROM feed_post_likes WHERE post_id = $1 AND user_id = $2`, [id, req.user.uid]);
    if (check.rows.length > 0) {
      return res.json({ success: true, liked: true });
    }

    await query(`INSERT INTO feed_post_likes (post_id, user_id) VALUES ($1, $2)`, [id, req.user.uid]);
    await query(`UPDATE feed_posts SET likes_count = likes_count + 1 WHERE id = $1`, [id]);
    
    const fresh = await query(`SELECT likes_count FROM feed_posts WHERE id = $1`, [id]);

    res.status(201).json({ success: true, liked: true, likesCount: fresh.rows[0]?.likes_count || 0 });
  } catch (error) {
    res.status(500).json({ success: false, error: "Could not like post" });
  }
});

router.delete("/posts/:id/like", authenticateFirebaseUser, async (req, res) => {
  try {
    const { id } = req.params;
    
    const check = await query(`SELECT id FROM feed_post_likes WHERE post_id = $1 AND user_id = $2`, [id, req.user.uid]);
    if (check.rows.length === 0) {
      return res.json({ success: true, liked: false });
    }

    await query(`DELETE FROM feed_post_likes WHERE post_id = $1 AND user_id = $2`, [id, req.user.uid]);
    await query(`UPDATE feed_posts SET likes_count = likes_count - 1 WHERE id = $1`, [id]);

    res.json({ success: true, liked: false });
  } catch (error) {
    res.status(500).json({ success: false, error: "Could not remove like" });
  }
});

router.post("/comments/:commentId/like", authenticateFirebaseUser, async (req, res) => {
  try {
    const { commentId } = req.params;

    const check = await query(`SELECT id FROM feed_comment_likes WHERE comment_id = $1 AND user_id = $2`, [commentId, req.user.uid]);
    if (check.rows.length > 0) {
      return res.json({ success: true, liked: true }); 
    }

    await query(`INSERT INTO feed_comment_likes (comment_id, user_id) VALUES ($1, $2)`, [commentId, req.user.uid]);
    await query(`UPDATE feed_comments SET likes_count = likes_count + 1 WHERE id = $1`, [commentId]);

    const fresh = await query(`SELECT likes_count FROM feed_comments WHERE id = $1`, [commentId]);

    res.status(201).json({ success: true, liked: true, likesCount: fresh.rows[0]?.likes_count || 0 });
  } catch (error) {
    res.status(500).json({ success: false, error: "Could not like comment" });
  }
});

router.delete("/comments/:commentId/like", authenticateFirebaseUser, async (req, res) => {
  try {
    const { commentId } = req.params;

    const check = await query(`SELECT id FROM feed_comment_likes WHERE comment_id = $1 AND user_id = $2`, [commentId, req.user.uid]);
    if (check.rows.length === 0) {
      return res.json({ success: true, liked: false }); 
    }

    await query(`DELETE FROM feed_comment_likes WHERE comment_id = $1 AND user_id = $2`, [commentId, req.user.uid]);
    await query(`UPDATE feed_comments SET likes_count = likes_count - 1 WHERE id = $1`, [commentId]);

    res.json({ success: true, liked: false });
  } catch (error) {
    res.status(500).json({ success: false, error: "Could not remove comment like" });
  }
});

router.delete("/posts/:id", authenticateFirebaseUser, async (req, res) => {
  try {
    const checkResult = await query(`SELECT author_id, image_url, cloudinary_public_id FROM feed_posts WHERE id = $1`, [req.params.id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    const post = checkResult.rows[0];
    if (post.author_id !== req.user.uid) {
      return res.status(403).json({ success: false, error: "You can only delete your own posts" });
    }

    if (post.image_url || post.cloudinary_public_id) {
      await deleteCloudinaryAsset({
        publicId: post.cloudinary_public_id,
        resourceType: "image",
        url: post.image_url,
      }).catch(err => console.error("Cloudinary delete error:", err));
    }

    await query(`DELETE FROM feed_posts WHERE id = $1`, [req.params.id]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: "Could not delete post" });
  }
});

router.post("/posts/:id/report", authenticateFirebaseUser, async (req, res) => {
  try {
    const reportType = req.body?.reportType || req.body?.category || "Inappropriate content";
    const details = req.body?.details || req.body?.message || "Reported a post in the UniHelp Feed.";

    const id = crypto.randomUUID();
    await query(
      `INSERT INTO reports (id, user_id, display_name, email, report_type, title, description, attachments, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, '[]'::jsonb, 'pending')`,
      [
        id,
        req.user.uid,
        req.user.name || req.user.displayName || "Student",
        req.user.email || "",
        reportType,
        `Feed post report: ${req.params.id}`,
        details,
      ]
    );

    res.status(201).json({ success: true, message: "Report submitted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Could not submit report" });
  }
});

export default router;
