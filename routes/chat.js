import express from "express";
import { authenticateFirebaseUser } from "../middleware/auth.js";
import { db } from "../firebase/firebaseAdmin.js";
import { FieldValue } from "firebase-admin/firestore";
import { sendAppNotification } from "../utils/notifications.js";
import { query } from "../db/pool.js";

const router = express.Router();

router.post("/:conversationId/messages", authenticateFirebaseUser, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const user = req.user;
    const payload = req.body;
    const messageRef = db.collection("conversations").doc(conversationId).collection("messages").doc();
    const now = FieldValue.serverTimestamp();
    
    const messageData = {
      ...payload,
      id: messageRef.id,
      senderId: user.uid,
      deliveredTo: [user.uid],
      readBy: [user.uid],
      reactions: {},
      createdAt: now,
    };
    
    await messageRef.set(messageData);
    
    // Update conversation metadata
    const convRef = db.collection("conversations").doc(conversationId);
    const convDoc = await convRef.get();
    if (convDoc.exists) {
      const convData = convDoc.data();
      const receiverId = convData.memberIds?.find(id => id !== user.uid);
      const messageType = payload.type || 'text';
      const lastMessageText = messageType === 'voice' ? '🎤 Voice message' : (payload.text || 'Attachment');
      
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
        const notifBody = messageType === 'voice' ? '🎤 Sent a voice message' : (payload.text || 'Sent an attachment');
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
