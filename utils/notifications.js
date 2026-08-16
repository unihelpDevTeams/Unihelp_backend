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

const clearInvalidExpoPushTokens = async (invalidRecipients = []) => {
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
    const currentToken = userSnap.data()?.expoPushToken;

    if (currentToken !== recipient.token) {
      continue;
    }

    await userRef.update({
      expoPushToken: admin.firestore.FieldValue.delete(),
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

  const resolvedRecipients = [];

  for (const uid of recipients) {
    const userSnap = await db.collection("users").doc(uid).get();
    const user = userSnap.data() || {};

    const notificationsEnabled =
      user.notificationsEnabled !== false &&
      user.notifications?.enabled !== false;

    if (!notificationsEnabled) continue;

    if (user.expoPushToken) {
      resolvedRecipients.push({ userId: uid, token: user.expoPushToken, pushType: "expo" });
    } else if (user.fcmToken) {
      resolvedRecipients.push({ userId: uid, token: user.fcmToken, pushType: "fcm" });
    }
  }

  if (resolvedRecipients.length === 0) {
    return { success: true, sent: 0, recipients: 0 };
  }

  let sent = 0;
  const expoRecipients = resolvedRecipients.filter((item) => item.pushType === "expo");
  const legacyRecipients = resolvedRecipients.filter((item) => item.pushType !== "expo");

  if (expoRecipients.length > 0) {
    const expoResult = await sendNotification({
      recipients: expoRecipients,
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

    sent += expoResult.sent || 0;
    await clearInvalidExpoPushTokens(expoResult.invalidRecipients);
  }

  if (legacyRecipients.length > 0) {
    for (const tokenBatch of chunkArray(legacyRecipients, 500)) {
      const response = await messaging.sendEachForMulticast({
        notification: {
          title,
          body,
        },
        data: {
          type,
          category,
          announcementId: announcementId || "",
          url,
          title,
          body,
          message: body,
          ...(data || {}),
        },
        tokens: tokenBatch.map((item) => item.token),
      });

      sent += response.successCount || 0;
    }
  }

  const insertSql = `
    INSERT INTO notifications (user_id, title, message, category, type, url, announcement_id, read, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, false, NOW())
  `;

  for (const recipient of resolvedRecipients) {
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
    recipients: resolvedRecipients.length,
  };
};
