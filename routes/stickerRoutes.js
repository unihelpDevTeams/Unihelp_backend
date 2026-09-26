import express from "express";
import multer from "multer";
import { authenticateFirebaseUser } from "../middleware/auth.js";
import { uploadFileToR2, deleteFileFromR2, extractR2KeyFromUrl } from "../services/storage/r2.js";
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
  seedDefaultFreeStickers,
  updateOfficialPack,
  updateOfficialSticker,
  getOwnedSticker,
  updateStickerAsset,
  buildEditedStickerUrls,
} from "../services/stickerService.js";

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

const handleError = (res, error) => {
  const message = error.message || "Sticker request failed";
  console.error("[stickers] request failed", {
    method: res.req?.method,
    path: res.req?.originalUrl,
    uid: res.req?.user?.uid,
    email: res.req?.user?.email,
    message,
    stack: error.stack,
  });
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
    const data = await listStickers(req.user.uid, { packId: req.query.packId, search: req.query.search, owner: req.query.owner });
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

router.post("/admin/seed-defaults", adminOnly, async (req, res) => {
  try { res.json({ success: true, data: await seedDefaultFreeStickers(req.user.uid) }); } catch (error) { handleError(res, error); }
});

router.post("/admin/stickers", adminOnly, async (req, res) => {
  try { res.status(201).json({ success: true, data: await createOfficialSticker(req.user.uid, req.body) }); } catch (error) { handleError(res, error); }
});

router.patch("/admin/packs/:id", adminOnly, async (req, res) => {
  try { res.json({ success: true, data: await updateOfficialPack(req.params.id, req.body) }); } catch (error) { handleError(res, error); }
});

router.patch("/admin/stickers/:id", adminOnly, async (req, res) => {
  try { res.json({ success: true, data: await updateOfficialSticker(req.params.id, req.body) }); } catch (error) { handleError(res, error); }
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
    const result = await uploadFileToR2(
      req.file.buffer,
      `unihelp/stickers/${req.user.uid}`,
      req.file.originalname || `${req.user.uid}-${Date.now()}.${isAnimated ? "mp4" : "png"}`,
      req.file.mimetype
    );
    const thumbnailUrl = result.url;
    const data = await createUploadRecord(req.user.uid, {
      assetUrl: result.url,
      thumbnailUrl,
      cloudinaryPublicId: result.publicId,
      width: 0,
      height: 0,
      bytes: Number(req.file.size || 0),
      duration: 0,
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
    const urls = buildEditedStickerUrls(
      {
        type: "image",
        cloudinaryPublicId: sticker.cloudinaryPublicId,
        assetUrl: sticker.assetUrl,
        thumbnailUrl: sticker.thumbnailUrl,
      },
      sticker.editor || {},
      [{ effect: "background_removal" }]
    );
    const updated = await updateStickerAsset(req.user.uid, req.params.id, urls.assetUrl, urls.thumbnailUrl);
    res.json({ success: true, data: updated });
  } catch (error) { handleError(res, error); }
});

export default router;
