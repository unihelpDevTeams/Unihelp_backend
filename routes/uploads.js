import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { authenticateFirebaseUser } from "../middleware/auth.js";
import { normalizeUploadedAsset } from "../utils/mediaAssets.js";

const uploadsRoutes = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 },
});

const ALLOWED_FOLDERS = new Set(["hostels", "marketplace", "stories"]);
const ALLOWED_TYPES = new Set(["image", "video", "raw", "auto"]);

const validateFileTypeForResource = (mimetype = "", resourceType = "auto") => {
  if (resourceType === "image") return /^image\//.test(mimetype);
  if (resourceType === "video") return /^video\//.test(mimetype);
  if (resourceType === "raw") return true;
  if (resourceType === "auto") {
    return /^image\//.test(mimetype) || /^video\//.test(mimetype);
  }
  return false;
};

const uploadBuffer = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    stream.end(buffer);
  });

uploadsRoutes.post("/", authenticateFirebaseUser, upload.single("file"), async (req, res) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ error: "Cloudinary is not configured on the server" });
    }

    if (!req.file) return res.status(400).json({ error: "No file provided" });

    const resourceType = ALLOWED_TYPES.has(req.body.resourceType) ? req.body.resourceType : "auto";
    const feature = ALLOWED_FOLDERS.has(req.body.feature) ? req.body.feature : "stories";

    if (!validateFileTypeForResource(req.file.mimetype, resourceType)) {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    const result = await uploadBuffer(req.file.buffer, {
      folder: `unihelp/${feature}/${req.user.uid}`,
      resource_type: resourceType,
      public_id: req.body.publicId || undefined,
      overwrite: false,
    });

    res.status(201).json(normalizeUploadedAsset(result));
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default uploadsRoutes;
