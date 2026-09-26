import express from "express";
import crypto from "crypto";
import { admin, db } from "../firebase/firebaseAdmin.js";
import { authenticateFirebaseUser } from "../middleware/auth.js";
import { query } from "../db/pool.js";
import { deleteCloudinaryAsset } from "../utils/cloudinaryCleanup.js";

const router = express.Router();

const TEXT_MAX_LENGTH = 500;
const COMMENT_MAX_LENGTH = 250;
const MAX_FEED_LIMIT = 50;
const VALID_POST_TYPES = new Set(["text", "image", "colored"]);
const VALID_BACKGROUND_PRESETS = new Set(["indigo", "violet", "blue", "green", "orange", "pink", "red", "dark"]);
const VALID_POST_AUDIENCES = new Set(["friends", "everyone", "private"]);
export const FEED_WEIGHTS = Object.freeze({
  recency: 0.30,
  engagement: 0.20,
  relationship: 0.15,
  relevance: 0.15,
  quality: 0.10,
  diversity: 0.10,
});
const REPETITION_PENALTY = 0.12;
const RANDOM_FACTOR = 0.025;
const CANDIDATE_MULTIPLIER = 4;

const ensureText = (value, fallback = "", maxLength = null) => {
  if (typeof value !== "string") return fallback;
  const text = value.trim();
  if (!text) return fallback;
  if (maxLength && text.length > maxLength) return text.slice(0, maxLength).trim();
  return text;
};

const extractHashtags = (content = "") => [...new Set(
  String(content).match(/#[a-zA-Z0-9_]{1,40}/g) || []
)].map((tag) => tag.toLowerCase());

export const validateFeedPostPayload = (payload = {}) => {
  const type = String(payload.type || "").toLowerCase();
  const audience = String(payload.audience || "friends").toLowerCase();
  if (!VALID_POST_TYPES.has(type)) {
    throw new Error("Unsupported post type");
  }
  if (!VALID_POST_AUDIENCES.has(audience)) {
    throw new Error("Invalid post audience");
  }

  if (type === "text" || type === "colored") {
    const content = ensureText(payload.content, "", TEXT_MAX_LENGTH);
    if (!content) {
      throw new Error("Post content cannot be empty");
    }

    if (type === "colored") {
      const backgroundPreset = String(payload.backgroundPreset || "").toLowerCase();
      if (!VALID_BACKGROUND_PRESETS.has(backgroundPreset)) {
        throw new Error("Invalid background preset");
      }
      return {
        type,
        content,
        backgroundPreset,
        audience,
        tags: extractHashtags(content),
      };
    }

    return { type, content, audience, tags: extractHashtags(content) };
  }

  const content = ensureText(payload.content, "", TEXT_MAX_LENGTH);
  const imageUrl = ensureText(payload.imageUrl || payload.image_url || payload.image || "", "", 2000);
  if (!imageUrl) {
    throw new Error("Image post requires an image");
  }

  return {
    type,
    content: content || "",
    audience,
    tags: extractHashtags(content),
    imageUrl,
    cloudinaryPublicId: ensureText(payload.cloudinaryPublicId || payload.publicId || payload.cloudinary_public_id || "", "", 500) || null,
  };
};

const getDateValue = (value) => {
  if (!value) return new Date(0);
  if (typeof value.toDate === "function") return value.toDate();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
};

const normalizePost = (doc) => {
  const data = doc.data() || {};
  const createdAt = getDateValue(data.createdAt);
  const updatedAt = getDateValue(data.updatedAt);
  return {
    id: doc.id,
    authorId: data.authorId || "",
    type: data.type || "text",
    content: data.content || "",
    imageUrl: data.imageUrl || "",
    cloudinaryPublicId: data.cloudinaryPublicId || "",
    backgroundPreset: data.backgroundPreset || null,
    audience: data.audience || "friends",
    category: data.category || "",
    categories: Array.isArray(data.categories) ? data.categories : [],
    tags: Array.isArray(data.tags) ? data.tags : [],
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    likesCount: Number(data.likesCount || 0),
    commentsCount: Number(data.commentsCount || 0),
    viewsCount: Number(data.viewsCount || 0),
    authorName: data.authorName || "",
    authorAvatar: data.authorAvatar || "",
  };
};

const normalizeComment = (doc) => {
  const data = doc.data() || {};
  const createdAt = getDateValue(data.createdAt);
  return {
    id: doc.id,
    postId: data.postId || "",
    authorId: data.authorId || "",
    authorName: data.authorName || "",
    authorAvatar: data.authorAvatar || "",
    content: data.content || "",
    createdAt: createdAt.toISOString(),
  };
};

const chunkArray = (items, size) => {
  const result = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }
  return result;
};

const getAcceptedFriendIds = async (uid) => {
  if (!uid || !db) return [];
  const snapshot = await db.collection("friends").where("users", "array-contains", uid).get();
  const friends = new Set();
  snapshot.docs.forEach((doc) => {
    const users = Array.isArray(doc.data()?.users) ? doc.data().users : [];
    users.forEach((memberId) => {
      if (memberId && memberId !== uid) friends.add(memberId);
    });
  });
  return [...friends];
};

const canReadPost = async (viewerUid, authorId, postData = {}) => {
  if (!viewerUid || !authorId) return false;
  if (viewerUid === authorId) return true;
  if (postData.audience === "private") return false;
  if (postData.audience === "everyone") return true;
  const friends = await getAcceptedFriendIds(viewerUid);
  return friends.includes(authorId);
};

const getVisibleAuthorIds = async (uid) => {
  const visible = new Set([uid]);
  const friends = await getAcceptedFriendIds(uid);
  friends.forEach((friendId) => visible.add(friendId));
  return [...visible];
};

const stableRandom = (value = "") => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
};

const normalizedSet = (value) => new Set(
  (Array.isArray(value) ? value : value ? [value] : [])
    .map((item) => String(item).trim().toLowerCase())
    .filter(Boolean)
);

const getPostTopics = (post) => normalizedSet([
  post.category,
  ...(post.categories || []),
  ...(post.tags || []),
]);

const getUserInterests = (profile = {}) => normalizedSet([
  ...(profile.interests || []),
  profile.department,
  profile.faculty,
  profile.school,
]);

const calculateRelevance = (post, interests) => {
  if (!interests.size) return 0.5;
  const topics = getPostTopics(post);
  if (!topics.size) return 0.2;
  const matches = [...topics].filter((topic) => interests.has(topic)).length;
  return Math.min(1, matches / Math.max(1, Math.min(topics.size, 3)));
};

const calculateQuality = (post) => {
  if (post.type === "image") return post.imageUrl ? 0.9 : 0.2;
  if (post.type === "colored") return post.content.length >= 10 ? 0.85 : 0.5;
  return post.content.length >= 20 ? 1 : 0.65;
};

const buildInteractionMap = async (uid, posts) => {
  if (!db || !uid) return new Map();
  const [likesSnapshot, commentsSnapshot] = await Promise.all([
    db.collection("feedPostLikes").where("userId", "==", uid).limit(200).get(),
    db.collection("feedComments").where("authorId", "==", uid).limit(200).get(),
  ]);
  const authorByPost = new Map(posts.map((post) => [post.id, post.authorId]));
  const interactions = new Map();
  const addInteraction = (postId) => {
    const authorId = authorByPost.get(postId);
    if (authorId) interactions.set(authorId, (interactions.get(authorId) || 0) + 1);
  };
  likesSnapshot.docs.forEach((doc) => addInteraction(doc.data()?.postId));
  commentsSnapshot.docs.forEach((doc) => addInteraction(doc.data()?.postId));
  return interactions;
};

const rankFeedPosts = (posts = [], { viewerUid, interests, interactionMap, randomSeed }) => {
  const now = Date.now();
  const scored = posts.map((post) => {
    const ageHours = Math.max(0, (now - new Date(post.createdAt).getTime()) / (60 * 60 * 1000));
    const recency = Math.exp(-ageHours / 48);
    const engagement = Math.min(1, (Math.log1p(post.likesCount || 0) + (2 * Math.log1p(post.commentsCount || 0))) / 12);
    const relationship = post.authorId === viewerUid ? 1 : Math.min(1, 0.55 + ((interactionMap.get(post.authorId) || 0) / 10));
    const relevance = calculateRelevance(post, interests);
    const quality = calculateQuality(post);
    return {
      post,
      baseScore: (recency * FEED_WEIGHTS.recency)
        + (engagement * FEED_WEIGHTS.engagement)
        + (relationship * FEED_WEIGHTS.relationship)
        + (relevance * FEED_WEIGHTS.relevance)
        + (quality * FEED_WEIGHTS.quality)
        + (stableRandom(`${randomSeed}:${post.id}`) * RANDOM_FACTOR),
    };
  });

  const ranked = [];
  const remaining = [...scored];
  while (remaining.length) {
    const candidateWindow = remaining.slice(0, 8);
    candidateWindow.sort((left, right) => {
      const recentAuthors = ranked.slice(-3).map((item) => item.post.authorId);
      const leftRepeat = recentAuthors.filter((id) => id === left.post.authorId).length;
      const rightRepeat = recentAuthors.filter((id) => id === right.post.authorId).length;
      const leftDiversity = leftRepeat ? 0 : 1;
      const rightDiversity = rightRepeat ? 0 : 1;
      const leftScore = left.baseScore + (leftDiversity * FEED_WEIGHTS.diversity) - (leftRepeat * REPETITION_PENALTY);
      const rightScore = right.baseScore + (rightDiversity * FEED_WEIGHTS.diversity) - (rightRepeat * REPETITION_PENALTY);
      return rightScore - leftScore;
    });
    const selected = candidateWindow[0];
    ranked.push(selected);
    remaining.splice(remaining.indexOf(selected), 1);
  }
  return ranked.map(({ post }) => post);
};

router.get("/", authenticateFirebaseUser, async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: "Feed service is unavailable" });
    }

    const limit = Math.min(Number(req.query.limit) || 20, MAX_FEED_LIMIT);
    const cursor = req.query.cursor ? new Date(String(req.query.cursor)) : null;
    const uid = req.user.uid;
    const authorIds = await getVisibleAuthorIds(uid);

    if (!authorIds.length) {
      return res.json({ success: true, items: [], nextCursor: null, hasMore: false });
    }

    const candidateLimit = Math.min(limit * CANDIDATE_MULTIPLIER, 100);
    const collections = [];
    for (const ids of chunkArray(authorIds, 10)) {
      let queryRef = db.collection("feedPosts").where("authorId", "in", ids).orderBy("createdAt", "desc");
      if (cursor && !Number.isNaN(cursor.getTime())) {
        queryRef = queryRef.startAfter(cursor);
      }
      collections.push(queryRef.limit(candidateLimit).get());
    }
    collections.push(
      db.collection("feedPosts")
        .where("audience", "==", "everyone")
        .orderBy("createdAt", "desc")
        .limit(candidateLimit)
        .get()
    );

    const snapshots = await Promise.all(collections);
    const results = [];
    const seen = new Set();

    snapshots.forEach((snapshot) => {
      snapshot.docs.forEach((doc) => {
        const id = doc.id;
        if (seen.has(id)) return;
        seen.add(id);
        results.push(normalizePost(doc));
      });
    });

    const profileSnapshot = await db.collection("users").doc(uid).get();
    const viewerProfile = profileSnapshot.exists ? profileSnapshot.data() : {};
    const interactionMap = await buildInteractionMap(uid, results);
    const visibleResults = rankFeedPosts(
      results.filter((post) => post.authorId === uid || post.audience !== "private"),
      { viewerUid: uid, interests: getUserInterests(viewerProfile), interactionMap, randomSeed: Math.random() }
    );
    const paged = visibleResults.slice(0, limit);
    const oldestCandidate = results.reduce((oldest, post) => (
      !oldest || new Date(post.createdAt) < new Date(oldest.createdAt) ? post : oldest
    ), null);
    const hasMore = snapshots.some((snapshot) => snapshot.size === candidateLimit);
    const nextCursor = hasMore && oldestCandidate ? oldestCandidate.createdAt : null;

    return res.json({ success: true, items: paged, nextCursor, hasMore: Boolean(nextCursor) });
  } catch (error) {
    console.error("Error fetching feed:", error);
    return res.status(500).json({ success: false, error: error.message || "Could not load your feed" });
  }
});

router.post("/posts", authenticateFirebaseUser, async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: "Feed service is unavailable" });
    }

    const payload = validateFeedPostPayload(req.body || {});
    const now = new Date();
    const postId = crypto.randomUUID();
    const authorProfileSnapshot = await db.collection("users").doc(req.user.uid).get();
    const authorProfile = authorProfileSnapshot.exists ? authorProfileSnapshot.data() : {};

    const doc = {
      id: postId,
      authorId: req.user.uid,
      authorName: authorProfile.username || authorProfile.displayName || req.user.name || req.user.displayName || req.user.email || "Student",
      authorAvatar: authorProfile.photoThumb || authorProfile.photoURL || authorProfile.photo || authorProfile.avatar || req.user.picture || req.user.photoURL || "",
      type: payload.type,
      content: payload.content || "",
      createdAt: now,
      updatedAt: now,
      likesCount: 0,
      commentsCount: 0,
      viewsCount: 0,
      audience: payload.audience,
      tags: payload.tags,
    };

    if (payload.type === "image") {
      doc.imageUrl = payload.imageUrl;
      doc.cloudinaryPublicId = payload.cloudinaryPublicId || "";
    }

    if (payload.type === "colored") {
      doc.backgroundPreset = payload.backgroundPreset;
    }

    await db.collection("feedPosts").doc(postId).set(doc);
    return res.status(201).json({ success: true, item: normalizePost({ data: () => doc, id: postId }) });
  } catch (error) {
    console.error("Error creating feed post:", error);
    return res.status(400).json({ success: false, error: error.message || "Could not create your post" });
  }
});

router.get("/users/:uid/posts", authenticateFirebaseUser, async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: "Feed service is unavailable" });
    }

    const targetUid = String(req.params.uid || "");
    const canRead = req.user.uid === targetUid || (await getAcceptedFriendIds(req.user.uid)).includes(targetUid);
    if (!canRead) {
      return res.status(403).json({ success: false, error: "You do not have access to this user's posts" });
    }

    const limit = Math.min(Number(req.query.limit) || 20, MAX_FEED_LIMIT);
    const snapshot = await db.collection("feedPosts")
      .where("authorId", "==", targetUid)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    const items = snapshot.docs
      .map(normalizePost)
      .filter((post) => targetUid === req.user.uid || post.audience !== "private");
    return res.json({ success: true, items });
  } catch (error) {
    console.error("Error fetching user feed posts:", error);
    return res.status(500).json({ success: false, error: error.message || "Could not load user posts" });
  }
});

const assertPostVisible = async (viewerUid, postId) => {
  const snapshot = await db.collection("feedPosts").doc(postId).get();
  if (!snapshot.exists) {
    throw Object.assign(new Error("Post not found"), { statusCode: 404 });
  }

  const authorId = snapshot.data()?.authorId;
  const canRead = await canReadPost(viewerUid, authorId, snapshot.data());
  if (!canRead) {
    throw Object.assign(new Error("You do not have access to this post"), { statusCode: 403 });
  }

  return snapshot;
};

router.get("/posts/:id/comments", authenticateFirebaseUser, async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: "Feed service is unavailable" });
    }
    const snapshot = await assertPostVisible(req.user.uid, req.params.id);
    const commentsSnap = await db.collection("feedComments").where("postId", "==", req.params.id).orderBy("createdAt", "desc").limit(50).get();
    const items = commentsSnap.docs.map(normalizeComment);
    return res.json({ success: true, items, post: normalizePost(snapshot) });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ success: false, error: error.message || "Could not load comments" });
  }
});

router.put("/posts/:id", authenticateFirebaseUser, async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: "Feed service is unavailable" });
    }

    const postRef = db.collection("feedPosts").doc(req.params.id);
    const snapshot = await postRef.get();
    if (!snapshot.exists) return res.status(404).json({ success: false, error: "Post not found" });
    if (snapshot.data()?.authorId !== req.user.uid) {
      return res.status(403).json({ success: false, error: "You can only edit your own posts" });
    }

    const existing = snapshot.data() || {};
    const payload = validateFeedPostPayload({
      type: existing.type,
      content: req.body?.content,
      imageUrl: existing.imageUrl,
      cloudinaryPublicId: existing.cloudinaryPublicId,
      backgroundPreset: req.body?.backgroundPreset || existing.backgroundPreset,
      audience: req.body?.audience || existing.audience || "friends",
    });
    const updates = {
      content: payload.content,
      updatedAt: new Date(),
      audience: payload.audience,
      tags: payload.tags,
    };
    if (existing.type === "colored") updates.backgroundPreset = payload.backgroundPreset;

    await postRef.update(updates);
    const fresh = await postRef.get();
    return res.json({ success: true, item: normalizePost(fresh) });
  } catch (error) {
    const statusCode = error.statusCode || 400;
    return res.status(statusCode).json({ success: false, error: error.message || "Could not edit post" });
  }
});

router.post("/posts/:id/view", authenticateFirebaseUser, async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: "Feed service is unavailable" });
    }
    await assertPostVisible(req.user.uid, req.params.id);
    await db.collection("feedPosts").doc(req.params.id).update({
      viewsCount: admin.firestore.FieldValue.increment(1),
    });
    return res.json({ success: true });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ success: false, error: error.message || "Could not record post view" });
  }
});

router.post("/posts/:id/comments", authenticateFirebaseUser, async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: "Feed service is unavailable" });
    }
    await assertPostVisible(req.user.uid, req.params.id);
    const content = ensureText(req.body?.content || "", COMMENT_MAX_LENGTH);
    if (!content) {
      return res.status(400).json({ success: false, error: "Comment content cannot be empty" });
    }

    const commentId = crypto.randomUUID();
    const comment = {
      id: commentId,
      postId: req.params.id,
      authorId: req.user.uid,
      authorName: req.user.name || req.user.displayName || req.user.email || "Student",
      authorAvatar: req.user.picture || req.user.photoURL || "",
      content,
      createdAt: new Date(),
    };

    await db.collection("feedComments").doc(commentId).set(comment);

    const postRef = db.collection("feedPosts").doc(req.params.id);
    await postRef.update({ commentsCount: admin.firestore.FieldValue.increment(1), updatedAt: new Date() });

    return res.status(201).json({ success: true, item: normalizeComment({ data: () => comment, id: commentId }) });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ success: false, error: error.message || "Could not post comment" });
  }
});

router.delete("/comments/:commentId", authenticateFirebaseUser, async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: "Feed service is unavailable" });
    }
    const commentRef = db.collection("feedComments").doc(req.params.commentId);
    const snapshot = await commentRef.get();
    if (!snapshot.exists) return res.status(404).json({ success: false, error: "Comment not found" });
    if (snapshot.data()?.authorId !== req.user.uid) {
      return res.status(403).json({ success: false, error: "You can only delete your own comments" });
    }

    await commentRef.delete();
    const postId = snapshot.data()?.postId;
    if (postId) {
      const postRef = db.collection("feedPosts").doc(postId);
      await postRef.update({ commentsCount: admin.firestore.FieldValue.increment(-1), updatedAt: new Date() });
    }
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Could not delete comment" });
  }
});

router.post("/posts/:id/like", authenticateFirebaseUser, async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: "Feed service is unavailable" });
    }
    await assertPostVisible(req.user.uid, req.params.id);
    const likeId = `${req.params.id}_${req.user.uid}`;
    const likeRef = db.collection("feedPostLikes").doc(likeId);
    const existing = await likeRef.get();
    if (existing.exists) {
      return res.json({ success: true, liked: true, likesCount: Number((await db.collection("feedPosts").doc(req.params.id).get()).data()?.likesCount || 0) });
    }

    await likeRef.set({ postId: req.params.id, userId: req.user.uid, createdAt: new Date() });
    const postRef = db.collection("feedPosts").doc(req.params.id);
    const next = await postRef.update({ likesCount: admin.firestore.FieldValue.increment(1), updatedAt: new Date() });
    const fresh = await postRef.get();
    return res.status(201).json({ success: true, liked: true, likesCount: Number(fresh.data()?.likesCount || 0), result: next });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ success: false, error: error.message || "Could not like post" });
  }
});

router.delete("/posts/:id/like", authenticateFirebaseUser, async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: "Feed service is unavailable" });
    }
    await assertPostVisible(req.user.uid, req.params.id);
    const likeId = `${req.params.id}_${req.user.uid}`;
    const likeRef = db.collection("feedPostLikes").doc(likeId);
    const existing = await likeRef.get();
    if (!existing.exists) {
      return res.json({ success: true, liked: false });
    }
    await likeRef.delete();
    const postRef = db.collection("feedPosts").doc(req.params.id);
    const fresh = await postRef.get();
    if (fresh.exists) {
      await postRef.update({ likesCount: admin.firestore.FieldValue.increment(-1), updatedAt: new Date() });
    }
    return res.json({ success: true, liked: false });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Could not remove like" });
  }
});

router.delete("/posts/:id", authenticateFirebaseUser, async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: "Feed service is unavailable" });
    }

    const postRef = db.collection("feedPosts").doc(req.params.id);
    const snapshot = await postRef.get();
    if (!snapshot.exists) return res.status(404).json({ success: false, error: "Post not found" });
    if (snapshot.data()?.authorId !== req.user.uid) {
      return res.status(403).json({ success: false, error: "You can only delete your own posts" });
    }

    const data = snapshot.data() || {};
    if (data.imageUrl || data.cloudinaryPublicId) {
      await deleteCloudinaryAsset({
        publicId: data.cloudinaryPublicId,
        resourceType: "image",
        url: data.imageUrl,
      });
    }

    const commentsSnap = await db.collection("feedComments").where("postId", "==", req.params.id).get();
    await Promise.all(commentsSnap.docs.map((commentDoc) => commentDoc.ref.delete()));

    const likesSnap = await db.collection("feedPostLikes").where("postId", "==", req.params.id).get();
    await Promise.all(likesSnap.docs.map((likeDoc) => likeDoc.ref.delete()));

    await postRef.delete();
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Could not delete post" });
  }
});

router.post("/posts/:id/report", authenticateFirebaseUser, async (req, res) => {
  try {
    const reportType = ensureText(req.body?.reportType || req.body?.category || "Inappropriate content", 80) || "Inappropriate content";
    const details = ensureText(req.body?.details || req.body?.message || "", 1500) || "Reported a post in the UniHelp Feed.";

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

    return res.status(201).json({ success: true, message: "Report submitted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Could not submit report" });
  }
});

export default router;
