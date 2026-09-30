import { admin, db, messaging } from "../firebase/firebaseAdmin.js";
import { sendNotification } from "./expoPush.js";
import { query } from "../db/pool.js";

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

    targetRecipients.push({ userId: uid });

    const notificationsEnabled =
      user.notificationsEnabled !== false &&
      user.notifications?.enabled !== false;

    if (!notificationsEnabled) continue;

    const tokenCandidates = [
      user.fcmToken,
      ...(await db.collection("notificationTokens")
        .where("userId", "==", uid)
        .where("active", "==", true)
        .get()
        .then((snapshot) => snapshot.docs.map((docSnap) => docSnap.data()?.token).filter(Boolean))),
    ];

    for (const token of [...new Set(tokenCandidates.filter(Boolean))]) {
      resolvedRecipients.push({ userId: uid, token, pushType: "fcm" });
    }
  }

  let sent = 0;

  if (resolvedRecipients.length > 0) {
    const fcmResult = await sendNotification({
      recipients: resolvedRecipients,
      title,
      body,
      data: {
        ...(data || {}),
        type,
        category,
        announcementId: announcementId || "",
        url,
      },
    });

    sent += fcmResult.sent || 0;
    await clearInvalidFcmTokens(fcmResult.invalidRecipients);
  }

  const insertSql = `
    INSERT INTO notifications (user_id, title, message, category, type, url, announcement_id, read, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, false, NOW())
  `;

  for (const recipient of targetRecipients) {
    await query(insertSql, [
      recipient.userId,
      title,
      body,
      category,
      type,
      url,
      announcementId
    ]);
  }

  return {
    success: true,
    sent,
    recipients: targetRecipients.length,
    pushRecipients: resolvedRecipients.length,
  };
};
