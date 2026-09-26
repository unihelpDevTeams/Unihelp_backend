import express from "express";
import multer from "multer";
import { authenticateFirebaseUser } from "../middleware/auth.js";
import { normalizeUploadedAsset } from "../utils/mediaAssets.js";
import { uploadFileToR2 } from "../services/storage/r2.js";

const uploadsRoutes = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 },
});

const ALLOWED_FOLDERS = new Set(["hostels", "marketplace", "stories", "feed"]);
const ALLOWED_TYPES = new Set(["image", "video", "raw", "auto"]);

const isHtmlLikeFile = (mimetype = "", filename = "") => {
  const extension = String(filename || "").toLowerCase();
  return (
    /^(text\/html|application\/xhtml\+xml)$/i.test(String(mimetype)) ||
    /\.(html?|xhtml)$/i.test(extension)
  );
};

const validateFileTypeForResource = (mimetype = "", resourceType = "auto") => {
  if (resourceType === "image") return /^image\//.test(mimetype);
  if (resourceType === "video") return /^video\//.test(mimetype);
  if (resourceType === "raw") return !isHtmlLikeFile(mimetype);
  if (resourceType === "auto") {
    return (
      /^image\//.test(mimetype) ||
      /^video\//.test(mimetype) ||
      (!isHtmlLikeFile(mimetype) && !!mimetype)
    );
  }
  return false;
};

uploadsRoutes.post("/", authenticateFirebaseUser, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file provided" });

    const resourceType = ALLOWED_TYPES.has(req.body.resourceType) ? req.body.resourceType : "auto";
    const feature = ALLOWED_FOLDERS.has(req.body.feature) ? req.body.feature : "stories";

    if (isHtmlLikeFile(req.file.mimetype, req.file.originalname) || !validateFileTypeForResource(req.file.mimetype, resourceType)) {
      return res.status(400).json({ error: "Invalid file type: html is not allowed" });
    }

    const result = await uploadFileToR2(
      req.file.buffer,
      `unihelp/${feature}/${req.user.uid}`,
      req.file.originalname,
      req.file.mimetype
    );

    // Return the response structured like the Cloudinary response for backward compatibility
    res.status(201).json({
      url: result.url,
      secure_url: result.url,
      publicId: result.publicId,
      cloudinaryPublicId: result.publicId, // Allow frontend to fall back to this
      resourceType: result.resourceType,
      cloudinaryResourceType: result.resourceType
    });
  } catch (error) {
    console.error("R2 upload failed:", error);
    res.status(500).json({ error: error.message || "Upload failed" });
  }
});

export default uploadsRoutes;
