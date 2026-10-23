import express from "express";
import { authenticateFirebaseUser } from "../middleware/auth.js";
import { db } from "../firebase/firebaseAdmin.js";
import { FieldValue } from "firebase-admin/firestore";
import { sendAppNotification } from "../utils/notifications.js";
import { isStickerAccessible } from "../services/stickerService.js";
import { getMediaRetentionConfig } from "../services/mediaRetention.js";

const router = express.Router();
const DEFAULT_MESSAGE_PAGE_SIZE = 20;

const parsePositiveInt = (value, fallback) => {
  const next = Number(value ?? fallback);
  if (!Number.isFinite(next) || next <= 0) return fallback;
  return next;
};

const getMessageRetentionConfig = () => getMediaRetentionConfig({
  retentionDays: process.env.MEDIA_RETENTION_DAYS,
  maxUndeliveredDays: process.env.MEDIA_MAX_UNDELIVERED_DAYS,
});

const normalizeMessageAttachment = (attachment = {}, index = 0, conversationId = "") => {
  if (!attachment || typeof attachment !== "object") return null;

  const url = attachment.url || attachment.fileUrl || attachment.secure_url || attachment.downloadUrl || attachment.previewUrl || "";
  const publicId = attachment.publicId || attachment.cloudinaryPublicId || attachment.key || attachment.public_id || "";
  const fileName = attachment.fileName || attachment.name || `attachment-${index + 1}`;
  const mimeType = attachment.mimeType || attachment.type || attachment.fileType || "";
  const size = Number(attachment.size || attachment.fileSize || 0) || 0;
  const originalSize = Number(attachment.originalSize || attachment.originalFileSize || size) || 0;
  const uploadedSize = Number(attachment.uploadedSize || size) || 0;
  const config = getMessageRetentionConfig();

  return {
    id: attachment.id || `media-${conversationId}-${index}-${Date.now()}`,
    url,
    fileName,
    mimeType,
    size,
    originalSize,
    uploadedSize,
    compressionStatus: attachment.compressionStatus || (uploadedSize < originalSize ? "optimized" : "original"),
    key: attachment.key || attachment.storageKey || publicId,
    duration: Number(attachment.duration || 0) || 0,
    publicId,
    storageProvider: attachment.storageProvider || attachment.storage_provider || (url || publicId ? "r2" : "unknown"),
    mediaStatus: url ? "uploaded" : "failed",
    deliveryStatus: "pending_delivery",
    downloadedBy: [],
    retentionDays: config.retentionDays,
    maxUndeliveredDays: config.maxUndeliveredDays,
    retentionExpiresAt: new Date(Date.now() + config.retentionDays * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  };
};

const normalizeMessageAttachments = (attachments = [], conversationId = "") => {
  if (!Array.isArray(attachments)) return [];
  const normalized = attachments.map((attachment, index) => normalizeMessageAttachment(attachment, index, conversationId)).filter(Boolean);
  return normalized;
};

router.post("/:conversationId/messages", authenticateFirebaseUser, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const user = req.user;
    const payload = req.body;
    const convRef = db.collection("conversations").doc(conversationId);
    const convDoc = await convRef.get();
    if (!convDoc.exists) return res.status(404).json({ success: false, error: "Conversation not found" });
    const convData = convDoc.data();
    if (!Array.isArray(convData.memberIds) || !convData.memberIds.includes(user.uid)) {
      return res.status(403).json({ success: false, error: "You are not a member of this conversation" });
    }
    const messageType = payload.type || "text";
    if (!["text", "voice", "image", "video", "sticker"].includes(messageType)) {
      return res.status(400).json({ success: false, error: "Unsupported message type" });
    }
    const attachments = normalizeMessageAttachments(payload.attachments, conversationId);
    let sticker = null;
    if (messageType === "sticker") {
      sticker = await isStickerAccessible(user.uid, payload.stickerId);
      if (!sticker) return res.status(403).json({ success: false, error: "This sticker is unavailable" });
    }
    const messageRef = db.collection("conversations").doc(conversationId).collection("messages").doc();
    const now = FieldValue.serverTimestamp();
    
    const retentionConfig = getMessageRetentionConfig();
    const messageData = {
      ...payload,
      attachments: attachments.map((attachment) => ({
        ...attachment,
        retentionDays: retentionConfig.retentionDays,
        maxUndeliveredDays: retentionConfig.maxUndeliveredDays,
        deliveryStatus: 'pending_delivery',
        mediaStatus: attachment.url ? 'uploaded' : 'failed',
        retentionExpiresAt: new Date(Date.now() + retentionConfig.retentionDays * 24 * 60 * 60 * 1000).toISOString(),
      })),
      id: messageRef.id,
      type: messageType,
      senderId: user.uid,
      ...(sticker ? { stickerId: sticker.id, sticker: { id: sticker.id, type: sticker.type, assetUrl: sticker.assetUrl, thumbnailUrl: sticker.thumbnailUrl, name: sticker.name, editor: sticker.editor || null } } : {}),
      deliveredTo: [user.uid],
      readBy: [user.uid],
      reactions: {},
      mediaState: attachments.length ? {
        status: "pending_delivery",
        retentionDays: retentionConfig.retentionDays,
        maxUndeliveredDays: retentionConfig.maxUndeliveredDays,
        retentionExpiresAt: new Date(Date.now() + retentionConfig.retentionDays * 24 * 60 * 60 * 1000).toISOString(),
        finalRecipients: convData.memberIds.filter((memberId) => memberId !== user.uid),
        downloadedBy: [],
      } : null,
      createdAt: now,
    };
    
    await messageRef.set(messageData);
    
    // Update conversation metadata
      const receiverId = convData.memberIds?.find(id => id !== user.uid);
      const lastMessageText = messageType === 'voice' ? '🎤 Voice message' : messageType === 'sticker' ? '🎟️ Sticker' : (payload.text || 'Attachment');
      
      const updateData = {
        lastMessage: lastMessageText,
        lastSenderId: user.uid,
        updatedAt: now,
      };
      
      if (receiverId) {
        updateData[`unread.${receiverId}`] = FieldValue.increment(1);
      }
      
      await convRef.update(updateData);

      if (receiverId) {
        const unreadRef = db.collection("unreadCounts").doc(`${conversationId}_${receiverId}`);
        await unreadRef.set({
          conversationId,
          userId: receiverId,
          count: FieldValue.increment(1),
          updatedAt: now,
        }, { merge: true });
      }
      
      // Emit via socket
      const io = req.app.get("io");
      if (io) {
        // Send to conversation room
        messageData.createdAt = new Date().toISOString(); // convert timestamp for json
        io.to(`conv_${conversationId}`).emit("receive_message", messageData);
      }
      
      if (receiverId) {
        // Save notification
        const notifBody = messageType === 'voice' ? '🎤 Sent a voice message' : messageType === 'sticker' ? '🎟️ Sent a sticker' : (payload.text || 'Sent an attachment');
        // sendAppNotification persists the linked notification and sends the push.
        // Do not insert a second row here: it creates duplicate direct-message alerts.
        try {
          await sendAppNotification({
            userIds: [receiverId],
            title: payload.senderName || "New Message",
            body: notifBody,
            type: 'direct_message',
            category: 'Message',
            url: `/messages?conversationId=${conversationId}`,
            data: { conversationId },
          });
        } catch (e) {
          console.error("Failed to send push:", e);
        }
      }
    res.status(200).json({ success: true, message: messageData });
  } catch (error) {
    console.error("Chat post error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

router.get("/:conversationId/messages", authenticateFirebaseUser, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit: limitParam, cursor } = req.query;
    const conversation = await db.collection("conversations").doc(conversationId).get();
    if (!conversation.exists || !conversation.data().memberIds?.includes(req.user.uid)) {
      return res.status(403).json({ success: false, error: "You are not a member of this conversation" });
    }

    const requestedLimit = Number(limitParam) || DEFAULT_MESSAGE_PAGE_SIZE;
    const pageSize = Math.min(Math.max(requestedLimit, 1), 50);
    const messagesRef = db.collection("conversations").doc(conversationId).collection("messages");

    let queryRef = messagesRef.orderBy("createdAt", "desc");
    if (cursor) {
      const cursorDoc = await messagesRef.doc(String(cursor)).get();
      if (cursorDoc.exists) {
        queryRef = queryRef.startAfter(cursorDoc);
      }
    }
    const snapshot = await queryRef.limit(pageSize).get();

    const messages = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
      };
    });

    const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
    const nextSnapshot = lastVisibleDoc
      ? await messagesRef.orderBy("createdAt", "desc").startAfter(lastVisibleDoc).limit(1).get()
      : { docs: [] };

    const hasMore = snapshot.docs.length === pageSize && nextSnapshot.docs.length > 0;

    res.status(200).json({
      success: true,
      messages: messages.reverse(),
      cursor: snapshot.docs[snapshot.docs.length - 1]?.id || null,
      hasMore,
    });
  } catch (error) {
    console.error("Chat get error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
