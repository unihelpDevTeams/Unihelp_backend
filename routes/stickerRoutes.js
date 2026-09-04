import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { authenticateFirebaseUser } from "../middleware/auth.js";
import { verificationRateLimit } from "../middleware/rateLimit.js";
import { getTrustedEntitlementProfile, isPremiumEntitled } from "../services/entitlementService.js";
import {
  createSticker,
  createStickerPack,
  createUploadRecord,
  deleteSticker,
  getStickerStorage,
  listStickerPacks,
  listStickers,
  recordStickerUse,
  toggleStickerFavorite,
  updateStickerPack,
  deleteStickerPack,
  createOfficialPack,
  createOfficialSticker,
  getOwnedSticker,
  updateStickerAsset,
} from "../services/stickerService.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const router = express.Router();
const configuredAdmin = (user) => Boolean(user?.admin) || new Set((process.env.ADMIN_EMAILS || "onakomayaokiki@gmail.com,iadejuwon77@gmail.com").split(",").map((email) => email.trim().toLowerCase())).has(String(user?.email || "").toLowerCase());
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (/^image\/(jpeg|png|webp)$/.test(file.mimetype) || /^video\/(mp4|webm|quicktime)$/.test(file.mimetype)) callback(null, true);
    else callback(new Error("Only JPG, PNG, WebP, MP4, WebM, and MOV files are supported."));
  },
});

const uploadBuffer = (buffer, options) => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(options, (error, result) => error ? reject(error) : resolve(result));
  stream.end(buffer);
});

const handleError = (res, error) => {
  const message = error.message || "Sticker request failed";
  const status = /Premium|limit|cannot|not found|supported|required|available|invalid/i.test(message) ? 400 : 500;
  return res.status(status).json({ success: false, message });
};

const adminOnly = async (req, res, next) => {
  const configured = new Set((process.env.ADMIN_EMAILS || "onakomayaokiki@gmail.com,iadejuwon77@gmail.com").split(",").map((email) => email.trim().toLowerCase()));
  if (req.user?.admin || configured.has(String(req.user?.email || "").toLowerCase())) return next();
  const profile = await getTrustedEntitlementProfile(req.user.uid);
  if (profile.admin === true) return next();
  return res.status(403).json({ success: false, message: "Admin access required" });
};

router.use(authenticateFirebaseUser);

router.get("/packs", async (req, res) => {
  try { res.json({ success: true, data: await listStickerPacks(req.user.uid) }); } catch (error) { handleError(res, error); }
});

router.get("/", async (req, res) => {
  try {
    const data = await listStickers(req.user.uid, { packId: req.query.packId, search: req.query.search });
    res.json({ success: true, data });
  } catch (error) { handleError(res, error); }
});

router.get("/recent", async (req, res) => {
  try { res.json({ success: true, data: await listStickers(req.user.uid, { recent: true }) }); } catch (error) { handleError(res, error); }
});

router.get("/favorites", async (req, res) => {
  try { res.json({ success: true, data: await listStickers(req.user.uid, { favorites: true }) }); } catch (error) { handleError(res, error); }
});

router.get("/storage", async (req, res) => {
  try { res.json({ success: true, data: await getStickerStorage(req.user.uid) }); } catch (error) { handleError(res, error); }
});

router.post("/admin/packs", adminOnly, async (req, res) => {
  try { res.status(201).json({ success: true, data: await createOfficialPack(req.body, req.user.uid) }); } catch (error) { handleError(res, error); }
});

router.post("/admin/stickers", adminOnly, async (req, res) => {
  try { res.status(201).json({ success: true, data: await createOfficialSticker(req.user.uid, req.body) }); } catch (error) { handleError(res, error); }
});

router.post("/upload", verificationRateLimit(60 * 60 * 1000, 20), upload.single("file"), async (req, res) => {
  try {
    const profile = await getTrustedEntitlementProfile(req.user.uid);
    if (!isPremiumEntitled(profile) && !configuredAdmin(req.user)) return res.status(403).json({ success: false, message: "Custom stickers are available for Premium members only" });
    if (!req.file) return res.status(400).json({ success: false, message: "Sticker media is required" });
    const isAnimated = req.file.mimetype.startsWith("video/");
    const rotation = [0, 90, 180, 270].includes(Number(req.body.rotation)) ? Number(req.body.rotation) : 0;
    const maxBytes = isAnimated ? 25 * 1024 * 1024 : 10 * 1024 * 1024;
    if (req.file.size > maxBytes) return res.status(413).json({ success: false, message: `Sticker media exceeds the ${maxBytes / (1024 * 1024)} MB limit` });
    const result = await uploadBuffer(req.file.buffer, {
      folder: `unihelp/stickers/${req.user.uid}`,
      resource_type: isAnimated ? "video" : "image",
      transformation: isAnimated
        ? [{ width: 512, height: 512, crop: "limit", quality: "auto", audio_codec: "none", format: "mp4", ...(rotation ? { angle: rotation } : {}) }]
        : [{ width: 512, height: 512, crop: "limit", quality: "auto", fetch_format: "auto", ...(rotation ? { angle: rotation } : {}) }],
    });
    if (isAnimated && Number(result.duration || 0) > 10) {
      await cloudinary.uploader.destroy(result.public_id, { resource_type: "video" });
      return res.status(400).json({ success: false, message: "Video stickers can be up to 10 seconds" });
    }
    const thumbnailUrl = cloudinary.url(result.public_id, {
      secure: true,
      resource_type: isAnimated ? "video" : "image",
      transformation: [{ width: 256, height: 256, crop: "fill", quality: "auto", fetch_format: "auto" }],
    });
    const data = await createUploadRecord(req.user.uid, {
      assetUrl: result.secure_url,
      thumbnailUrl,
      cloudinaryPublicId: result.public_id,
      width: result.width || 0,
      height: result.height || 0,
      bytes: Number(result.bytes || req.file.size),
      duration: Number(result.duration || 0),
      type: isAnimated ? "animated" : "image",
      isAnimated,
    });
    res.status(201).json({ success: true, data });
  } catch (error) { handleError(res, error); }
});

router.post("/", verificationRateLimit(60 * 60 * 1000, 20), async (req, res) => {
  try { res.status(201).json({ success: true, data: await createSticker(req.user.uid, req.body) }); } catch (error) { handleError(res, error); }
});

router.post("/packs", async (req, res) => {
  try { res.status(201).json({ success: true, data: await createStickerPack(req.user.uid, req.body) }); } catch (error) { handleError(res, error); }
});

router.patch("/packs/:id", async (req, res) => {
  try { res.json({ success: true, data: await updateStickerPack(req.user.uid, req.params.id, req.body) }); } catch (error) { handleError(res, error); }
});

router.delete("/packs/:id", async (req, res) => {
  try { res.json({ success: true, data: await deleteStickerPack(req.user.uid, req.params.id) }); } catch (error) { handleError(res, error); }
});

router.post("/:id/use", async (req, res) => {
  try { res.json({ success: true, data: await recordStickerUse(req.user.uid, req.params.id) }); } catch (error) { handleError(res, error); }
});

router.post("/:id/favorite", async (req, res) => {
  try { res.json({ success: true, data: await toggleStickerFavorite(req.user.uid, req.params.id, req.body?.favorite !== false) }); } catch (error) { handleError(res, error); }
});

router.delete("/:id/favorite", async (req, res) => {
  try { res.json({ success: true, data: await toggleStickerFavorite(req.user.uid, req.params.id, false) }); } catch (error) { handleError(res, error); }
});

router.delete("/:id", async (req, res) => {
  try { res.json({ success: true, data: await deleteSticker(req.user.uid, req.params.id) }); } catch (error) { handleError(res, error); }
});

router.post("/:id/remove-background", async (req, res) => {
  try {
    const sticker = await getOwnedSticker(req.user.uid, req.params.id);
    if (sticker.isAnimated) return res.status(400).json({ success: false, message: "Background removal is available for image stickers only" });
    if (!sticker.cloudinaryPublicId) return res.status(400).json({ success: false, message: "Sticker asset is unavailable" });
    const assetUrl = cloudinary.url(sticker.cloudinaryPublicId, { secure: true, transformation: [{ effect: "background_removal" }, { width: 512, height: 512, crop: "limit", fetch_format: "auto" }] });
    const updated = await updateStickerAsset(req.user.uid, req.params.id, assetUrl);
    res.json({ success: true, data: updated });
  } catch (error) { handleError(res, error); }
});

export default router;
