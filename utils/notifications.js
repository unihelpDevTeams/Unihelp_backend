import { admin, db, messaging } from "../firebase/firebaseAdmin.js";
import { sendNotification } from "./expoPush.js";
import { query } from "../db/pool.js";

const categoryForType = (type = "general") => ({
  message: "unihelp_message",
  direct_message: "unihelp_message",
  group_message: "unihelp_group_message",
  comment: "unihelp_comment",
  comment_reply: "unihelp_comment",
  like: "unihelp_like",
  announcement: "unihelp_promotion",
  promotion: "unihelp_promotion",
}[String(type).toLowerCase()] || "unihelp_general");

const mutedForRecipient = async (userId, data = {}) => {
  const targetId = data.conversationId || data.conversation_id || data.groupId || data.group_id;
  if (!targetId) return false;
  const settings = await db.collection("users").doc(userId).collection("conversationSettings").doc(String(targetId)).get();
  return settings.exists && settings.data()?.muted === true;
};

const chunkArray = (items = [], size = 500) => {
  const chunks = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
};

const clearInvalidFcmTokens = async (invalidRecipients = []) => {
  const uniqueRecipients = [
    ...new Map(
      invalidRecipients
        .filter((recipient) => recipient?.userId && recipient?.token)
        .map((recipient) => [`${recipient.userId}:${recipient.token}`, recipient])
    ).values(),
  ];

  if (uniqueRecipients.length === 0) {
    return 0;
  }

  let cleared = 0;

  for (const recipient of uniqueRecipients) {
    const userRef = db.collection("users").doc(recipient.userId);
    const userSnap = await userRef.get();
    const currentToken = userSnap.data()?.fcmToken;

    if (currentToken !== recipient.token) {
      continue;
    }

    await userRef.update({
      fcmToken: admin.firestore.FieldValue.delete(),
      pushNotificationsEnabled: false,
      pushTokenInvalidatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    cleared += 1;
  }

  return cleared;
};

export const sendAppNotification = async ({
  userIds,
  title,
  body,
  type = "general",
  category = "General",
  url = "/notifications",
  announcementId = null,
  data = {},
} = {}) => {
  const recipients = Array.isArray(userIds) ? userIds.filter(Boolean) : [userIds].filter(Boolean);

  if (!title || !body || recipients.length === 0) {
    return null;
  }

  const targetRecipients = [];
  const resolvedRecipients = [];

  for (const uid of recipients) {
    const userSnap = await db.collection("users").doc(uid).get();
    const user = userSnap.data() || {};

    let notificationId = "";
    try {
      const inserted = await query(
        `INSERT INTO notifications (user_id, title, message, category, type, url, announcement_id, read, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, false, NOW()) RETURNING id`,
        [uid, title, body, category, type, url, announcementId]
      );
      notificationId = inserted.rows?.[0]?.id?.toString() || "";
    } catch (error) {
      // A temporary notification-store failure must not prevent a real-time push.
      console.error("Could not persist notification before push:", error?.message || error);
    }
    targetRecipients.push({ userId: uid, notificationId });

    const notificationsEnabled =
      user.notificationsEnabled !== false &&
      user.notifications?.enabled !== false;

    if (!notificationsEnabled || await mutedForRecipient(uid, data)) continue;

    const tokenCandidates = [
      user.fcmToken,
      ...(await db.collection("notificationTokens")
        .where("userId", "==", uid)
        .where("active", "==", true)
        .get()
        .then((snapshot) => snapshot.docs.map((docSnap) => docSnap.data()?.token).filter(Boolean))),
    ];

    for (const token of [...new Set(tokenCandidates.filter(Boolean))]) {
      resolvedRecipients.push({ userId: uid, token, pushType: "fcm", notificationId });
    }
  }

  let sent = 0;

  // Each recipient receives its own persisted notification id, enabling tray actions to
  // mark the correct record read without opening the app.
  for (const recipient of resolvedRecipients) {
    const fcmResult = await sendNotification({
      recipients: [recipient], title, body, type, category, url,
      categoryId: categoryForType(type),
      threadId: data?.conversationId || data?.conversation_id || data?.groupId || data?.group_id || "",
      data: { ...(data || {}), notificationId: recipient.notificationId, type, category, announcementId: announcementId || "", url },
    });
    sent += fcmResult.sent || 0;
    await clearInvalidFcmTokens(fcmResult.invalidRecipients);
  }

  return {
    success: true,
    sent,
    recipients: targetRecipients.length,
    pushRecipients: resolvedRecipients.length,
  };
};
