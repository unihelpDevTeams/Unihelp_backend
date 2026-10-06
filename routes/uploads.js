import express from "express";
import multer from "multer";
import { db } from "../firebase/firebaseAdmin.js";
import { authenticateFirebaseUser } from "../middleware/auth.js";
import { deleteFileFromR2, uploadFileToR2 } from "../services/storage/r2.js";

const uploadsRoutes = express.Router();
const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS || "onakomayaokiki@gmail.com,iadejuwon77@gmail.com")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 },
});

const ALLOWED_FOLDERS = new Set(["hostels", "marketplace", "stories", "feed", "resources", "profile", "marketing"]);
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

const isAdmin = async (user) => {
  if (user?.admin || ADMIN_EMAILS.has(String(user?.email || "").trim().toLowerCase())) return true;
  if (!db || !user?.uid) return false;
  const profile = await db.collection("users").doc(user.uid).get();
  return profile.exists && profile.data()?.admin === true;
};

uploadsRoutes.post("/", authenticateFirebaseUser, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file provided" });

    const resourceType = ALLOWED_TYPES.has(req.body.resourceType) ? req.body.resourceType : "auto";
    const feature = ALLOWED_FOLDERS.has(req.body.feature) ? req.body.feature : "stories";
    if (feature === "marketing" && !(await isAdmin(req.user))) {
      return res.status(403).json({ error: "Admin access required to upload marketing media" });
    }

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
      key: result.key,
      publicId: result.publicId,
      storageProvider: "r2",
      cloudinaryPublicId: result.publicId, // Allow frontend to fall back to this
      resourceType: result.resourceType,
      cloudinaryResourceType: result.resourceType
    });
  } catch (error) {
    console.error("R2 upload failed:", error);
    res.status(500).json({ error: error.message || "Upload failed" });
  }
});

uploadsRoutes.delete("/", authenticateFirebaseUser, async (req, res) => {
  const key = req.body?.key;
  const profilePrefix = `unihelp/profile/${req.user.uid}/`;
  const isProfileKey = typeof key === "string" && key.startsWith(profilePrefix);
  const isMarketingKey = typeof key === "string" && key.startsWith("unihelp/marketing/");

  if (typeof key !== "string" || key.includes("..") || key.includes("\\")) {
    return res.status(400).json({ error: "Invalid media key" });
  }
  if (!isProfileKey && !isMarketingKey) {
    return res.status(400).json({ error: "Unsupported media key" });
  }
  if (isMarketingKey && !(await isAdmin(req.user))) {
    return res.status(403).json({ error: "Admin access required to delete marketing media" });
  }

  try {
    const deleted = await deleteFileFromR2(key);
    if (!deleted) return res.status(500).json({ error: "Failed to delete media from R2" });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("R2 media deletion failed:", error);
    return res.status(500).json({ error: error.message || "Failed to delete media from R2" });
  }
});

export default uploadsRoutes;
