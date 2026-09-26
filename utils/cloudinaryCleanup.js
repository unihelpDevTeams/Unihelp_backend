import { v2 as cloudinary } from "cloudinary";
import { deleteFileFromR2 } from "../services/storage/r2.js";

const VALID_RESOURCE_TYPES = new Set(["image", "video", "raw"]);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const isCloudinaryAdminConfigured = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

export const normalizeResourceType = (resourceType) => {
  if (VALID_RESOURCE_TYPES.has(resourceType)) return resourceType;
  return "image";
};

export const extractR2KeyFromUrl = (url = "") => {
  if (!url || typeof url !== "string") return null;
  const publicUrl = process.env.R2_PUBLIC_URL || "";
  if (publicUrl && url.startsWith(publicUrl)) {
    let key = url.slice(publicUrl.length);
    if (key.startsWith("/")) key = key.slice(1);
    return key;
  }
  return null;
};

/**
 * Extract the Cloudinary public ID from a Cloudinary URL.
 */
export const extractPublicIdFromUrl = (url = "") => {
  if (!url || typeof url !== "string") return null;
  // Must be a Cloudinary URL
  if (!url.includes("res.cloudinary.com")) return null;

  try {
    const parsed = new URL(url);
    const uploadIndex = parsed.pathname.indexOf("/upload/");
    if (uploadIndex === -1) return null;

    const afterUpload = parsed.pathname.slice(uploadIndex + "/upload/".length);
    const segments = afterUpload.split("/").filter(Boolean);
    while (segments.length) {
      const first = segments[0];
      const isVersion = /^v\d+$/.test(first);
      const isTransformation = first
        .split(",")
        .some((part) => /^(a|ar|b|c|co|d|dl|e|f|fl|g|h|l|o|pg|q|r|t|w|x|y|z)_/i.test(part));

      if (!isVersion && !isTransformation) break;
      segments.shift();
    }

    if (!segments.length) return null;

    const publicIdWithExtension = decodeURIComponent(segments.join("/"));
    return publicIdWithExtension.replace(/\.[a-zA-Z0-9]+$/, "");
  } catch {
    return null;
  }
};

export const deleteCloudinaryAsset = async ({ publicId, resourceType, url }) => {
  const knownR2Prefixes = [
    "unihelp/",
    "profiles/",
    "marketplace/",
    "hostels/",
    "stories/",
    "past-questions/",
    "stickers/",
    "voice/",
    "feed/",
  ];

  const r2KeyFromUrl = extractR2KeyFromUrl(url);
  const r2KeyFromPublicId = typeof publicId === "string" && publicId.trim() && knownR2Prefixes.some((prefix) => publicId.trim().startsWith(prefix))
    ? publicId.trim()
    : null;

  const r2Key = r2KeyFromUrl || r2KeyFromPublicId;

  if (r2Key) {
    const type = normalizeResourceType(resourceType);
    const success = await deleteFileFromR2(r2Key);
    return { success, publicId: r2Key, resourceType: type, result: success ? "deleted" : "failed" };
  }

  // Otherwise, proceed with Cloudinary logic
  const effectivePublicId = publicId || extractPublicIdFromUrl(url);

  if (!effectivePublicId) {
    console.log("[cloudinary] Skipping asset because publicId is missing.");
    return { skipped: true, reason: "missing_public_id" };
  }

  if (!isCloudinaryAdminConfigured()) {
    console.log("[cloudinary] Skipping asset because Admin API credentials are not configured.");
    return { skipped: true, reason: "missing_cloudinary_config", publicId: effectivePublicId };
  }

  const type = normalizeResourceType(resourceType);

  try {
    console.log(`[cloudinary] Deleting Cloudinary asset: ${effectivePublicId} (${type})`);
    const result = await cloudinary.uploader.destroy(effectivePublicId, {
      resource_type: type,
      invalidate: true,
    });
    console.log(`[cloudinary] Deleted successfully: ${effectivePublicId}`, result);
    return { success: true, publicId: effectivePublicId, resourceType: type, result };
  } catch (error) {
    console.error(`[cloudinary] Cloudinary deletion failed: ${effectivePublicId}`, error);
    return {
      success: false,
      publicId: effectivePublicId,
      resourceType: type,
      error: error.message || "Cloudinary deletion failed",
    };
  }
};

export const deleteCloudinaryAssets = async (assets = []) => {
  const unique = [];
  const seen = new Set();

  for (const asset of assets) {
    const pid = asset?.publicId || extractPublicIdFromUrl(asset?.url);
    if (!pid) {
      unique.push(asset);
      continue;
    }

    const key = `${asset.resourceType || "image"}:${pid}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push({ ...asset, publicId: pid });
  }

  const results = [];

  for (const asset of unique) {
    results.push(await deleteCloudinaryAsset(asset));
  }

  return results;
};
