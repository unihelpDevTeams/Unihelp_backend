/**
 * Optional Cloudinary -> R2 migration script.
 *
 * This script is intentionally manual and non-destructive.
 * It scans for legacy Cloudinary URLs, re-uploads them to R2, and updates
 * the record where possible while preserving the original reference.
 */

import axios from "axios";
import { query } from "../db/pool.js";
import { db } from "../firebase/firebaseAdmin.js";
import { uploadFileToR2 } from "../services/storage/r2.js";
import { extractPublicIdFromUrl } from "../utils/cloudinaryCleanup.js";

const cloudinaryAssetUrl = (value) => typeof value === "string" ? value : "";

const migrateRows = async () => {
  if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !process.env.R2_BUCKET_NAME || !process.env.R2_PUBLIC_URL) {
    throw new Error("R2 credentials are not configured. Fill .env before running this migration.");
  }

  const { rows } = await query("SELECT id, avatar FROM users WHERE avatar LIKE '%res.cloudinary.com%' LIMIT 100");
  for (const row of rows) {
    const sourceUrl = cloudinaryAssetUrl(row.avatar);
    if (!sourceUrl) continue;
    const publicId = extractPublicIdFromUrl(sourceUrl);
    if (!publicId) continue;
    const response = await axios.get(sourceUrl, { responseType: "arraybuffer" });
    const contentType = response.headers["content-type"] || "application/octet-stream";
    const fileBuffer = Buffer.from(response.data);
    const uploaded = await uploadFileToR2(fileBuffer, `unihelp/migration/users/${row.id}`, `${publicId}.jpg`, contentType);
    await query("UPDATE users SET avatar = $2 WHERE id = $1", [row.id, uploaded.url]);
    console.log(`Migrated user ${row.id} -> ${uploaded.url}`);
  }
};

export const migrateStorage = async () => {
  console.log("[migration] Starting optional Cloudinary -> R2 migration...");
  await migrateRows();
  const storiesSnapshot = await db.collection("stories").where("coverImage", ">=", "https://res.cloudinary.com").get();
  for (const doc of storiesSnapshot.docs) {
    const sourceUrl = cloudinaryAssetUrl(doc.data().coverImage);
    if (!sourceUrl) continue;
    const publicId = extractPublicIdFromUrl(sourceUrl);
    if (!publicId) continue;
    const response = await axios.get(sourceUrl, { responseType: "arraybuffer" });
    const fileBuffer = Buffer.from(response.data);
    const uploaded = await uploadFileToR2(fileBuffer, `unihelp/migration/stories/${doc.id}`, `${publicId}.jpg`, response.headers["content-type"] || "image/jpeg");
    await doc.ref.update({ coverImage: uploaded.url, coverPublicId: uploaded.publicId });
    console.log(`Migrated story ${doc.id} -> ${uploaded.url}`);
  }
  console.log("[migration] Complete. No Cloudinary resources were deleted automatically.");
};

// Run manually: node scripts/migrateStorage.js
// import { migrateStorage } from './scripts/migrateStorage.js';
// migrateStorage().catch(console.error);
