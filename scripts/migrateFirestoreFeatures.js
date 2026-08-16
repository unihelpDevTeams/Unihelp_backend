import dotenv from "dotenv";
import { initializeDatabase } from "../db/init.js";
import { getPool } from "../db/pool.js";
import { db } from "../firebase/firebaseAdmin.js";
import { normalizeAssets, replaceMedia } from "../utils/apiHelpers.js";

dotenv.config();

const toDate = (value) => {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const readCollection = async (name) => {
  const snapshot = await db.collection(name).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const migrateHostels = async (client) => {
  const docs = await readCollection("hostels");
  for (const item of docs) {
    await client.query(
      `INSERT INTO hostels (id, owner_id, title, location, price, phone, description, status, verified, premium_user, extra, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       ON CONFLICT (id) DO UPDATE SET
         owner_id=excluded.owner_id, title=excluded.title, location=excluded.location, price=excluded.price,
         phone=excluded.phone, description=excluded.description, status=excluded.status, verified=excluded.verified,
         premium_user=excluded.premium_user, extra=hostels.extra || excluded.extra, updated_at=excluded.updated_at`,
      [
        item.id,
        item.ownerId || item.userId || item.uploadedBy || "unknown",
        item.title || item.name || "Untitled hostel",
        item.location || item.area || "",
        item.price === "" || item.price == null ? null : Number(item.price),
        item.phone || item.contact || "",
        item.description || "",
        item.status || "pending",
        Boolean(item.verified),
        Boolean(item.premiumUser),
        item,
        toDate(item.createdAt) || new Date(),
        toDate(item.updatedAt) || toDate(item.createdAt) || new Date(),
      ]
    );
    await replaceMedia(client, "hostel", item.id, normalizeAssets(item));
  }
  return docs.length;
};

const migrateMarketplace = async (client) => {
  const docs = await readCollection("studentMarketplace");
  for (const item of docs) {
    await client.query(
      `INSERT INTO marketplace_items (id, seller_id, title, category, price, phone, description, status, verified, premium_user, extra, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       ON CONFLICT (id) DO UPDATE SET
         seller_id=excluded.seller_id, title=excluded.title, category=excluded.category, price=excluded.price,
         phone=excluded.phone, description=excluded.description, status=excluded.status, verified=excluded.verified,
         premium_user=excluded.premium_user, extra=marketplace_items.extra || excluded.extra, updated_at=excluded.updated_at`,
      [
        item.id,
        item.sellerId || item.ownerId || item.userId || item.uploadedBy || "unknown",
        item.title || item.name || "Untitled listing",
        item.category || "",
        item.price === "" || item.price == null ? null : Number(item.price),
        item.phone || item.contact || "",
        item.description || "",
        item.status || "pending",
        Boolean(item.verified),
        Boolean(item.premiumUser),
        item,
        toDate(item.createdAt) || new Date(),
        toDate(item.updatedAt) || toDate(item.createdAt) || new Date(),
      ]
    );
    await replaceMedia(client, "marketplace", item.id, normalizeAssets(item));
  }
  return docs.length;
};

const migrateStories = async (client) => {
  const docs = await readCollection("stories");
  let comments = 0;
  for (const item of docs) {
    const coverAsset = item.coverAsset || {};
    await client.query(
      `INSERT INTO stories (id, author_id, author_name, author_avatar, title, summary, genre, content, cover_image, cover_public_id, cover_resource_type, status, views, likes, bookmarks, chapters_count, comment_count, liked_by, expires_at, extra, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
       ON CONFLICT (id) DO UPDATE SET
         author_id=excluded.author_id, author_name=excluded.author_name, author_avatar=excluded.author_avatar,
         title=excluded.title, summary=excluded.summary, genre=excluded.genre, content=excluded.content,
         cover_image=excluded.cover_image, cover_public_id=excluded.cover_public_id, cover_resource_type=excluded.cover_resource_type,
         status=excluded.status, views=excluded.views, likes=excluded.likes, bookmarks=excluded.bookmarks,
         chapters_count=excluded.chapters_count, comment_count=excluded.comment_count, liked_by=excluded.liked_by,
         expires_at=excluded.expires_at, extra=stories.extra || excluded.extra, updated_at=excluded.updated_at`,
      [
        item.id,
        item.authorId || item.userId || item.ownerId || "unknown",
        item.authorName || item.author || "A student",
        item.authorAvatar || "",
        item.title || "Untitled story",
        item.summary || item.description || "",
        item.genre || item.category || "",
        item.content || "",
        item.coverImage || coverAsset.url || "",
        coverAsset.publicId || coverAsset.public_id || null,
        coverAsset.resourceType || coverAsset.resource_type || "image",
        item.status || "draft",
        Number(item.views || 0),
        Number(item.likes || 0),
        Number(item.bookmarks || 0),
        Number(item.chaptersCount || 0),
        Number(item.commentCount || 0),
        item.likedBy || {},
        toDate(item.expiresAt),
        item,
        toDate(item.createdAt) || new Date(),
        toDate(item.updatedAt) || toDate(item.createdAt) || new Date(),
      ]
    );

    const commentsSnap = await db.collection("stories").doc(item.id).collection("comments").get();
    for (const commentDoc of commentsSnap.docs) {
      const comment = commentDoc.data();
      await client.query(
        `INSERT INTO story_comments (id, story_id, author_id, author_name, author_avatar, text, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT (id) DO UPDATE SET text=excluded.text`,
        [
          commentDoc.id,
          item.id,
          comment.authorId || "unknown",
          comment.authorName || "Anonymous",
          comment.authorAvatar || "",
          comment.text || "",
          toDate(comment.createdAt) || new Date(),
        ]
      );
      comments += 1;
    }
  }
  return { stories: docs.length, comments };
};

const main = async () => {
  if (!db) throw new Error("Firebase Admin is not configured; cannot read Firestore");
  await initializeDatabase();
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const hostels = await migrateHostels(client);
    const marketplace = await migrateMarketplace(client);
    const storyResult = await migrateStories(client);
    await client.query("COMMIT");
    console.log("Migration completed", { hostels, marketplace, ...storyResult });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
    await getPool().end();
  }
};

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
