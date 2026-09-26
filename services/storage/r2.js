import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import path from "path";

const resolveR2Endpoint = () => {
  if (process.env.R2_ENDPOINT) return process.env.R2_ENDPOINT;
  if (process.env.R2_ACCOUNT_ID) {
    return `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  }
  return undefined;
};

export const getR2Client = () => new S3Client({
  region: "auto",
  endpoint: resolveR2Endpoint(),
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export const r2 = getR2Client();

export const isR2Configured = () => {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME &&
    process.env.R2_PUBLIC_URL
  );
};

export const generateUniqueKey = (folder, originalName) => {
  const ext = path.extname(originalName || "").toLowerCase();
  const uuid = crypto.randomUUID();
  const sanitizedFolder = String(folder || "").replace(/^\/+/, "").replace(/\/+/g, "/").replace(/\/$/, "");
  return sanitizedFolder ? `${sanitizedFolder}/${uuid}${ext}` : `${uuid}${ext}`;
};

export const getContentType = (mimetype, filename) => {
  if (mimetype && mimetype !== "application/octet-stream") return mimetype;
  const ext = path.extname(filename || "").toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".pdf":
      return "application/pdf";
    case ".mp4":
      return "video/mp4";
    case ".m4a":
      return "audio/m4a";
    case ".wav":
      return "audio/wav";
    default:
      return "application/octet-stream";
  }
};

export const extractR2KeyFromUrl = (url = "") => {
  if (!url || typeof url !== "string") return null;
  const publicUrl = (process.env.R2_PUBLIC_URL || "").replace(/\/+$/, "");
  if (publicUrl && url.startsWith(publicUrl)) {
    let key = url.slice(publicUrl.length);
    if (key.startsWith("/")) key = key.slice(1);
    return key || null;
  }
  return null;
};

export const getR2PublicUrl = (key) => {
  if (!key) return "";
  const baseUrl = (process.env.R2_PUBLIC_URL || "").replace(/\/+$/, "");
  if (!baseUrl) return "";
  return `${baseUrl}/${String(key).replace(/^\/+/, "")}`;
};

export const uploadFileToR2 = async (buffer, folder, originalName, mimetype) => {
  if (!isR2Configured()) {
    throw new Error("Cloudflare R2 is not configured.");
  }

  const key = generateUniqueKey(folder, originalName);
  const contentType = getContentType(mimetype, originalName);

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await r2.send(command);

  return {
    key,
    url: getR2PublicUrl(key),
    contentType,
    publicId: key,
    resourceType: contentType.startsWith("image/") ? "image" : contentType.startsWith("video/") ? "video" : contentType.startsWith("audio/") ? "video" : "raw",
  };
};

export const deleteFileFromR2 = async (key) => {
  if (!isR2Configured() || !key) return false;

  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: String(key).replace(/^\/+/, ""),
    });
    await r2.send(command);
    return true;
  } catch (error) {
    console.error(`[R2] Failed to delete object: ${key}`, error);
    return false;
  }
};
