import { Router } from "express";
import { admin, db } from "../firebase/firebaseAdmin.js";
import { authenticateFirebaseUser } from "../middleware/auth.js";
import { deleteFileFromR2, extractR2KeyFromUrl, uploadFileToR2 } from "../services/storage/r2.js";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const buildVoiceDeletePayload = (messageDoc) => {
  const data = messageDoc?.data?.() || {};
  const publicId = data.cloudinaryPublicId || data.publicId || null;
  const resourceType = data.cloudinaryResourceType || data.resourceType || "video";
  const fallbackFromUrl = typeof data.audioUrl === "string" && data.audioUrl.includes("res.cloudinary.com")
    ? data.audioUrl
    : null;
  return {
    publicId,
    resourceType,
    url: fallbackFromUrl,
  };
};

const router = Router();

// Configure multer for in-memory file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      "audio/m4a",
      "audio/mp4",
      "audio/aac",
      "audio/x-m4a",
      "audio/mpeg",
      "audio/3gpp",
      "audio/3gpp2",
      "audio/ogg",
      "audio/webm",
      "audio/wav",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files are allowed."), false);
    }
  },
});

router.post(
  "/upload",
  authenticateFirebaseUser,
  upload.single("audio"),
  async (req, res) => {
    try {
      const uid = req.user.uid;
      const { conversationId, duration } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ success: false, error: "Audio file is required." });
      }

      if (!conversationId) {
        return res.status(400).json({ success: false, error: "conversationId is required." });
      }

      const userDoc = await db.collection("users").doc(uid).get();
      if (!userDoc.exists) {
        return res.status(404).json({ success: false, error: "User not found." });
      }

      const userData = userDoc.data();
      const isPremium = Boolean(userData.premium && userData.subscriptionStatus !== "expired");
      if (!isPremium) {
        return res.status(403).json({ success: false, error: "Voice messages are available for Premium members only." });
      }

      const conversationDoc = await db.collection("conversations").doc(conversationId).get();
      if (!conversationDoc.exists) {
        return res.status(404).json({ success: false, error: "Conversation not found." });
      }

      const conversationData = conversationDoc.data();
      const memberIds = conversationData.memberIds || [];
      if (!memberIds.includes(uid)) {
        return res.status(403).json({ success: false, error: "You are not a member of this conversation." });
      }

      const parsedDuration = Math.min(Math.max(0, Number(duration) || 0), 60);

      const uploadResult = await uploadFileToR2(
        file.buffer,
        `unihelp/voice/${uid}`,
        `voice_${uid}_${Date.now()}.${file.originalname?.split(".").pop() || "m4a"}`,
        file.mimetype || "audio/m4a"
      );

      return res.status(200).json({
        success: true,
        audioUrl: uploadResult.url,
        publicId: uploadResult.publicId,
        duration: parsedDuration,
        bytes: file.size,
      });
    } catch (error) {
      console.error("[voice] Upload error:", error);

      if (error.message === "File too large" || error.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ success: false, error: "Audio file exceeds the 2 MB limit." });
      }

      if (error.message === "Only audio files are allowed.") {
        return res.status(400).json({ success: false, error: error.message });
      }

      return res.status(500).json({ success: false, error: "Voice upload failed." });
    }
  }
);

router.delete(
  "/:conversationId/:messageId",
  authenticateFirebaseUser,
  async (req, res) => {
    try {
      const uid = req.user.uid;
      const { conversationId, messageId } = req.params;

      const messageRef = db.collection("conversations").doc(conversationId).collection("messages").doc(messageId);
      const messageDoc = await messageRef.get();

      if (!messageDoc.exists) {
        return res.status(404).json({ success: false, error: "Voice message not found." });
      }

      const messageData = messageDoc.data();
      if (messageData.senderId !== uid) {
        return res.status(403).json({ success: false, error: "You can only delete your own voice messages." });
      }

      const createdAtMillis = messageData.createdAt?.toMillis?.() || messageData.createdAt?.toDate?.()?.getTime?.() || 0;
      if (!createdAtMillis || Date.now() - createdAtMillis > 60 * 60 * 1000) {
        return res.status(403).json({ success: false, error: "Messages can only be deleted within one hour." });
      }

      const deletePayload = buildVoiceDeletePayload(messageDoc);
      const r2Key = deletePayload.url ? extractR2KeyFromUrl(deletePayload.url) : null;
      if (r2Key) {
        try {
          await deleteFileFromR2(r2Key);
        } catch (error) {
          console.warn("[voice] R2 delete failed:", error);
        }
      } else if (deletePayload.publicId) {
        try {
          await deleteFileFromR2(deletePayload.publicId);
        } catch (error) {
          console.warn("[voice] R2 delete by key failed:", error);
        }
      } else if (deletePayload.url) {
        try {
          const parsedPublicId = deletePayload.url.split("/").slice(-1)[0]?.split(".")[0];
          if (parsedPublicId) {
            await deleteFileFromR2(parsedPublicId);
          }
        } catch (error) {
          console.warn("[voice] Legacy Cloudinary delete fallback skipped:", error);
        }
      }

      await messageRef.update({
        deleted: true,
        deletedAt: admin.firestore.FieldValue.serverTimestamp(),
        text: "",
        audioUrl: "",
        cloudinaryPublicId: "",
        cloudinaryResourceType: "",
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("[voice] Delete error:", error);
      return res.status(500).json({ success: false, error: "Failed to delete voice message." });
    }
  }
);

export default router;