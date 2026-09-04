import express from "express";
import { authenticateFirebaseUser } from "../middleware/auth.js";
import { db } from "../firebase/firebaseAdmin.js";
import { FieldValue } from "firebase-admin/firestore";
import { sendAppNotification } from "../utils/notifications.js";
import { query } from "../db/pool.js";
import { isStickerAccessible } from "../services/stickerService.js";

const router = express.Router();

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
    let sticker = null;
    if (messageType === "sticker") {
      sticker = await isStickerAccessible(user.uid, payload.stickerId);
      if (!sticker) return res.status(403).json({ success: false, error: "This sticker is unavailable" });
    }
    const messageRef = db.collection("conversations").doc(conversationId).collection("messages").doc();
    const now = FieldValue.serverTimestamp();
    
    const messageData = {
      ...payload,
      id: messageRef.id,
      type: messageType,
      senderId: user.uid,
      ...(sticker ? { stickerId: sticker.id, sticker: { id: sticker.id, type: sticker.type, assetUrl: sticker.assetUrl, thumbnailUrl: sticker.thumbnailUrl, name: sticker.name } } : {}),
      deliveredTo: [user.uid],
      readBy: [user.uid],
      reactions: {},
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
        const sql = `
          INSERT INTO notifications (user_id, title, message, category, type, url, read, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        `;
        await query(sql, [
          receiverId,
          payload.senderName || "New Message",
          notifBody,
          "Message",
          "direct_message",
          `/messages?conversationId=${conversationId}`,
          false
        ]);
        
        // Push notification
        try {
          await sendAppNotification({
            userIds: [receiverId],
            title: payload.senderName || "New Message",
            body: notifBody,
            type: 'message',
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
    const conversation = await db.collection("conversations").doc(conversationId).get();
    if (!conversation.exists || !conversation.data().memberIds?.includes(req.user.uid)) {
      return res.status(403).json({ success: false, error: "You are not a member of this conversation" });
    }
    const messagesRef = db.collection("conversations").doc(conversationId).collection("messages");
    // Limit to last 50 messages for initial load
    const snapshot = await messagesRef.orderBy("createdAt", "desc").limit(50).get();
    const messages = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
      };
    });
    // Reverse so they are in chronological order
    res.status(200).json({ success: true, messages: messages.reverse() });
  } catch (error) {
    console.error("Chat get error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
