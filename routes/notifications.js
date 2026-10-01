import crypto from "node:crypto";
import express from "express";

import { authenticateFirebaseUser } from "../middleware/auth.js";
import { admin, db, messaging } from "../firebase/firebaseAdmin.js";
import { sendNotification } from "../utils/expoPush.js";
import { query } from "../db/pool.js";

const router = express.Router();

const chunkArray = (items = [], size = 500) => {
  const chunks = [];

  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }

  return chunks;
};

const NOTIFICATION_ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS || "onakomayaokiki@gmail.com,iadejuwon77@gmail.com")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
);
const NOTIFICATION_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

const deleteExpiredFirestoreNotifications = async (cutoff) => {
  if (!db) return 0;

  let deletedCount = 0;
  let cursor = null;

  while (true) {
    let expiredQuery = db
      .collectionGroup("items")
      .where("createdAt", "<", cutoff)
      .orderBy("createdAt")
      .limit(500);

    if (cursor) expiredQuery = expiredQuery.startAfter(cursor);

    const snapshot = await expiredQuery.get();
    if (snapshot.empty) break;

    const notificationDocs = snapshot.docs.filter((document) =>
      document.ref.parent.id === "items" &&
      document.ref.parent.parent?.parent?.id === "notifications"
    );

    if (notificationDocs.length) {
      const batch = db.batch();
      notificationDocs.forEach((document) => batch.delete(document.ref));
      await batch.commit();
      deletedCount += notificationDocs.length;
    }

    cursor = snapshot.docs[snapshot.docs.length - 1];
    if (snapshot.docs.length < 500) break;
  }

  return deletedCount;
};

export const cleanupExpiredNotifications = async () => {
  const cutoff = new Date(Date.now() - NOTIFICATION_RETENTION_MS);
  const tasks = [];

  if (process.env.DATABASE_URL) {
    tasks.push(
      query("DELETE FROM notifications WHERE created_at < $1", [cutoff])
        .then((result) => ({ postgresDeleted: result.rowCount || 0 }))
    );
  }

  if (db) {
    tasks.push(
      deleteExpiredFirestoreNotifications(cutoff)
        .then((firestoreDeleted) => ({ firestoreDeleted }))
    );
  }

  const results = await Promise.allSettled(tasks);
  const totals = { postgresDeleted: 0, firestoreDeleted: 0, failures: 0 };

  for (const result of results) {
    if (result.status === "rejected") {
      totals.failures += 1;
      console.error("Notification retention cleanup failed:", result.reason);
    } else {
      Object.assign(totals, result.value);
    }
  }

  return totals;
};

const isNotificationAdmin = async (user) => {
  if (user?.admin || NOTIFICATION_ADMIN_EMAILS.has(String(user?.email || "").trim().toLowerCase())) {
    return true;
  }

  if (!user?.uid || !db) return false;

  const userSnap = await db.collection("users").doc(user.uid).get();
  return userSnap.exists && userSnap.data()?.admin === true;
};

const parseNotificationCursor = (rawCursor) => {
  if (typeof rawCursor !== "string") return null;

  try {
    const cursor = JSON.parse(rawCursor);
    if (
      typeof cursor?.createdAt !== "string" ||
      Number.isNaN(Date.parse(cursor.createdAt)) ||
      !/^\d+$/.test(String(cursor.id || ""))
    ) {
      return null;
    }

    return {
      createdAt: new Date(cursor.createdAt).toISOString(),
      id: String(cursor.id),
    };
  } catch {
    return null;
  }
};

const SELF_NOTIFICATION_TYPES = new Set([
  "group_created",
  "story_published",
  "payment",
  "user_blocked",
  "user_unblocked",
]);

const isAuthorizedUserNotification = async (uid, recipientIds, type, data = {}) => {
  if (recipientIds.length === 1 && recipientIds[0] === uid && SELF_NOTIFICATION_TYPES.has(type)) {
    return true;
  }

  if (type === "group_message") {
    const { groupId, messageId } = data;
    if (!groupId || !messageId || recipientIds.includes(uid)) return false;

    const groupRef = db.collection("groups").doc(groupId);
    const [messageSnap, membersSnap, senderMembershipSnap] = await Promise.all([
      groupRef.collection("messages").doc(messageId).get(),
      groupRef.collection("members").get(),
      groupRef.collection("members").doc(uid).get(),
    ]);

    if (!messageSnap.exists || !senderMembershipSnap.exists) return false;
    const message = messageSnap.data() || {};
    const createdAt = message.createdAt?.toDate?.();
    const messageAge = createdAt ? Date.now() - createdAt.getTime() : Number.POSITIVE_INFINITY;
    if (message.senderId !== uid || messageAge < 0 || messageAge > 5 * 60 * 1000) {
      return false;
    }

    const memberIds = new Set(membersSnap.docs.map((member) => member.id));
    return recipientIds.every((recipientId) => memberIds.has(recipientId));
  }

  if (recipientIds.length !== 1) return false;
  const recipientId = recipientIds[0];
  const pairId = [uid, recipientId].sort().join("_");

  const friendRequestStatusByType = {
    friend_request_received: { from: uid, to: recipientId, status: "pending" },
    friend_request_accepted: { from: recipientId, to: uid, status: "accepted" },
    friend_request_declined: { from: recipientId, to: uid, status: "declined" },
  };

  if (friendRequestStatusByType[type]) {
    const requestSnap = await db.collection("friendRequests").doc(pairId).get();
    const request = requestSnap.data() || {};
    const expected = friendRequestStatusByType[type];
    return requestSnap.exists && Object.entries(expected).every(([key, value]) => request[key] === value);
  }

  if (type === "friend_removed") {
    const friendshipSnap = await db.collection("friends").doc(pairId).get();
    const members = friendshipSnap.data()?.users || [];
    return friendshipSnap.exists && members.includes(uid) && members.includes(recipientId);
  }

  if (type === "message_request_received") {
    const requestId = `${uid}_${recipientId}`;
    if (data.requestId !== requestId) return false;
    const requestSnap = await db.collection("messageRequests").doc(requestId).get();
    const request = requestSnap.data() || {};
    return requestSnap.exists && request.from === uid && request.to === recipientId && request.status === "pending";
  }

  if (type === "message_request_accepted") {
    const requestSnap = await db.collection("messageRequests").doc(`${recipientId}_${uid}`).get();
    const request = requestSnap.data() || {};
    return requestSnap.exists && request.from === recipientId && request.to === uid && request.status === "accepted";
  }

  if (type === "message_request_declined") {
    const requestSnap = await db.collection("messageRequests").doc(`${uid}_${recipientId}`).get();
    const request = requestSnap.data() || {};
    return requestSnap.exists && request.from === uid && request.to === recipientId && request.status === "declined";
  }

  return false;
};

const normalizeNotificationToken = (value) => {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const getNotificationTokenDocId = (userId, token) => {
  const normalizedToken = normalizeNotificationToken(token);
  if (!userId || !normalizedToken) {
    return null;
  }
  return `${String(userId)}_${crypto.createHash("sha256").update(normalizedToken).digest("hex")}`;
};

const getActiveNotificationTokensForUser = async (uid) => {
  if (!uid || !db) {
    return [];
  }

  const notificationsSnap = await db
    .collection("notificationTokens")
    .where("userId", "==", uid)
    .where("active", "==", true)
    .get();

  return notificationsSnap.docs
    .map((docSnap) => normalizeNotificationToken(docSnap.data()?.token))
    .filter(Boolean);
};

const ensureNotificationTokenRecord = async (uid, token, platform = "android") => {
  const normalizedToken = normalizeNotificationToken(token);
  if (!uid || !normalizedToken || !db) {
    return null;
  }

  const tokenDocId = getNotificationTokenDocId(uid, normalizedToken);
  if (!tokenDocId) {
    return null;
  }

  const timestamp = admin.firestore.FieldValue.serverTimestamp();
  const tokenRef = db.collection("notificationTokens").doc(tokenDocId);

  await tokenRef.set(
    {
      userId: uid,
      token: normalizedToken,
      platform,
      active: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    { merge: true }
  );

  await db.collection("users").doc(uid).set(
    {
      fcmToken: normalizedToken,
      pushNotificationsEnabled: true,
      pushTokenUpdatedAt: timestamp,
      deviceType: platform,
    },
    { merge: true }
  );

  return normalizedToken;
};

const deactivateNotificationToken = async (uid, token) => {
  const normalizedToken = normalizeNotificationToken(token);
  if (!uid || !normalizedToken || !db) {
    return false;
  }

  const tokenDocId = getNotificationTokenDocId(uid, normalizedToken);
  if (!tokenDocId) {
    return false;
  }

  await db.collection("notificationTokens").doc(tokenDocId).set(
    {
      active: false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  const userRef = db.collection("users").doc(uid);
  const userSnap = await userRef.get();
  const userData = userSnap.data() || {};

  if (userData.fcmToken === normalizedToken) {
    await userRef.set(
      {
        fcmToken: admin.firestore.FieldValue.delete(),
        pushNotificationsEnabled: false,
        pushTokenInvalidatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  }

  return true;
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
    const deactivated = await deactivateNotificationToken(recipient.userId, recipient.token);
    if (deactivated) {
      cleared += 1;
    }
  }

  console.log("[push-debug] Cleared invalid FCM tokens:", { cleared });
  return cleared;
};

const normalizeFcmStringValue = (value) => {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const buildMessagePayload = ({
  title,
  body,
  type = "general",
  category = "General",
  url = "/",
  announcementId = null,
  data = {},
}) => {
  const stringifiedData = Object.fromEntries(
    Object.entries({
      ...data,
      type,
      category,
      announcementId: announcementId || "",
      url,
      title,
      body,
      message: body,
    }).map(([key, value]) => [key, normalizeFcmStringValue(value)])
  );

  return {
    notification: {
      title,
      body,
    },
    android: {
      priority: "high",
      notification: {
        channelId: "default",
        sound: "default",
      },
    },
    data: stringifiedData,
    webpush: {
      notification: {
        title,
        body,
      },
      fcmOptions: {
        link: url,
      },
    },
  };
};

const getReminderWindowKey = (date = new Date()) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

const buildReminderNotificationId = (userId, reminderWindowKey) => `${userId}_${reminderWindowKey}`;

export const sendStudyReminderNotifications = async () => {
  try {
    const now = new Date();
    const inactiveSince = new Date(now.getTime() - 20 * 60 * 60 * 1000); // 20 hours
    const reminderWindowKey = getReminderWindowKey(now);

    const [fcmUsersSnap, notificationTokenSnap] = await Promise.all([
      db.collection("users").where("fcmToken", ">", "").get(),
      db.collection("notificationTokens").where("active", "==", true).get(),
    ]);
    const tokenUsers = new Map();
    fcmUsersSnap.forEach((userSnap) => tokenUsers.set(userSnap.id, userSnap));
    notificationTokenSnap.forEach((tokenSnap) => {
      const notificationToken = tokenSnap.data() || {};
      if (!notificationToken.userId || !notificationToken.token) return;
      const userSnap = tokenUsers.get(notificationToken.userId) || { id: notificationToken.userId, data: () => ({}) };
      tokenUsers.set(notificationToken.userId, userSnap);
    });

    const recipients = [];

    for (const [userId, docSnap] of tokenUsers.entries()) {
      const user = docSnap.data() || {};
      const notificationsEnabled =
        user.notificationsEnabled !== false &&
        user.notifications?.enabled !== false;

      const tokenCandidates = [
        user.fcmToken,
        ...(await getActiveNotificationTokensForUser(userId)),
      ];
      const token = [...new Set(tokenCandidates.filter(Boolean))][0];
      if (!notificationsEnabled || !token) continue;

      const lastSeenAt = user.lastStudyActivityAt || user.lastActive || user.createdAt;
      const lastReminderAt = user.lastStudyReminderAt;

      if (!lastSeenAt) continue;

      const lastSeenDate = lastSeenAt.toDate ? lastSeenAt.toDate() : new Date(lastSeenAt);
      const lastReminderDate = lastReminderAt?.toDate ? lastReminderAt.toDate() : null;

      if (lastSeenDate > inactiveSince) continue;

      if (lastReminderDate) {
        const hoursSinceLastReminder = (now.getTime() - lastReminderDate.getTime()) / (1000 * 60 * 60);
        if (hoursSinceLastReminder < 24) continue;
      }

      recipients.push({
        userId,
        token,
        pushType: "fcm",
      });
    }

    if (recipients.length === 0) {
      return { success: true, sent: 0, skipped: 0 };
    }

    const reminderPayload = buildMessagePayload({
      title: "You haven't studied today",
      body: "A quick study session now will keep your streak alive.",
      type: "study-reminder",
      category: "Reminder",
      url: "/",
    });

    const processedRecipients = [];
    let sent = 0;

    for (const batch of chunkArray(recipients, 500)) {
      const notificationBatch = db.batch();
      const tokenBatch = [];

      for (const recipient of batch) {
        const reminderDocRef = db.collection("notifications").doc(buildReminderNotificationId(recipient.userId, reminderWindowKey));
        const reminderDocSnap = await reminderDocRef.get();

        if (reminderDocSnap.exists) {
          console.log("[reminder] skipped - already processed", { userId: recipient.userId, reminderWindowKey });
          continue;
        }

        // Just write a stub document to Firestore so we don't process it again
        notificationBatch.set(reminderDocRef, { processed: true, createdAt: admin.firestore.FieldValue.serverTimestamp() });

        const sql = `
          INSERT INTO notifications (user_id, title, message, category, type, url, read, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        `;
        await query(sql, [
          recipient.userId,
          reminderPayload.notification.title,
          reminderPayload.notification.body,
          "Reminder",
          "study-reminder",
          "/notifications",
          false
        ]);

        tokenBatch.push(recipient);
      }

      if (tokenBatch.length > 0) {
        const fcmRecipients = tokenBatch.filter((item) => item.pushType === "fcm");

        if (fcmRecipients.length > 0) {
          const response = await messaging.sendEachForMulticast({
            ...reminderPayload,
            tokens: fcmRecipients.map((item) => item.token),
          });
          sent += response.successCount || 0;
        }

        await notificationBatch.commit();
        processedRecipients.push(...tokenBatch.map((item) => item.userId));
      }
    }

    if (processedRecipients.length === 0) {
      return { success: true, sent: 0, recipients: 0, skipped: recipients.length };
    }

    const reminderBatch = db.batch();
    processedRecipients.forEach((userId) => {
      reminderBatch.set(
        db.collection("users").doc(userId),
        {
          lastStudyReminderAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    });

    await reminderBatch.commit();

    return {
      success: true,
      sent,
      recipients: processedRecipients.length,
      skipped: recipients.length - processedRecipients.length,
    };
  } catch (error) {
    console.error("Study reminder job failed:", error);
    return { success: false, error: error.message };
  }
};

router.get("/", authenticateFirebaseUser, async (req, res) => {
  try {
    const { pageSize = 20 } = req.query;
    const limitSize = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 100);
    const cursor = req.query.cursor ? parseNotificationCursor(req.query.cursor) : null;

    if (req.query.cursor && !cursor) {
      return res.status(400).json({ success: false, message: "Invalid notification cursor." });
    }

    const cursorClause = cursor ? "AND (created_at, id) < ($3::timestamptz, $4::bigint)" : "";
    const params = cursor
      ? [req.user.uid, limitSize + 1, cursor.createdAt, cursor.id]
      : [req.user.uid, limitSize + 1];

    const sql = `
      SELECT id, user_id, title, message, category, type, url, announcement_id, read, created_at
      FROM notifications
      WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
      ${cursorClause}
      ORDER BY created_at DESC, id DESC
      LIMIT $2
    `;
    const { rows } = await query(sql, params);
    const hasMore = rows.length > limitSize;
    const pageRows = rows.slice(0, limitSize);

    const items = pageRows.map((row) => ({
      id: row.id.toString(),
      userId: row.user_id,
      title: row.title,
      message: row.message,
      body: row.message, // backwards compatibility
      category: row.category,
      type: row.type,
      url: row.url,
      route: row.url, // backwards compatibility
      announcementId: row.announcement_id,
      read: row.read,
      createdAt: row.created_at.toISOString(),
    }));

    const lastRow = pageRows[pageRows.length - 1];
    const nextCursor = hasMore && lastRow
      ? { createdAt: lastRow.created_at.toISOString(), id: lastRow.id.toString() }
      : null;

    return res.status(200).json({ items, cursor: nextCursor, hasMore });
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
});

router.delete("/:id", authenticateFirebaseUser, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "Notification id is required." });
    }

    const { rowCount } = await query(
      "DELETE FROM notifications WHERE id = $1 AND user_id = $2",
      [id, req.user.uid]
    );

    if (rowCount > 0) {
      return res.status(200).json({ success: true });
    }

    // Support both the current per-user collection and the older root-level format.
    const userNotificationRef = db
      .collection("notifications")
      .doc(req.user.uid)
      .collection("items")
      .doc(id);
    const userNotificationSnapshot = await userNotificationRef.get();
    if (userNotificationSnapshot.exists) {
      await userNotificationRef.delete();
      return res.status(200).json({ success: true });
    }

    const legacyRef = db.collection("notifications").doc(id);
    const legacySnapshot = await legacyRef.get();
    if (
      legacySnapshot.exists &&
      (legacySnapshot.data()?.userId === req.user.uid ||
        legacySnapshot.data()?.recipientId === req.user.uid)
    ) {
      await legacyRef.delete();
      return res.status(200).json({ success: true });
    }

    return res.status(404).json({ success: false, message: "Notification not found" });
  } catch (error) {
    console.error("Failed to delete notification:", error);
    return res.status(500).json({ success: false, message: "Failed to delete notification" });
  }
});

router.post("/:id/read", authenticateFirebaseUser, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { rowCount } = await query(
      "UPDATE notifications SET read = true WHERE id = $1 AND user_id = $2",
      [id, req.user.uid]
    );

    if (rowCount > 0) {
      return res.status(200).json({ success: true });
    }

    // Attempt to update legacy Firebase notification if not found in PG
    const legacyRef = db.collection("notifications").doc(id);
    const legacySnapshot = await legacyRef.get();
    if (legacySnapshot.exists && (legacySnapshot.data()?.userId === req.user.uid || legacySnapshot.data()?.recipientId === req.user.uid)) {
      await legacyRef.update({ read: true });
      return res.status(200).json({ success: true });
    }

    return res.status(404).json({ success: false, message: "Notification not found" });
  } catch (error) {
    console.error("Failed to mark notification read:", error);
    return res.status(500).json({ success: false, message: "Failed to mark read" });
  }
});

const registerNotificationToken = async (req, res) => {
  try {
    const { token, expoPushToken, platform = "android", deviceType = "android" } = req.body || {};
    const normalizedToken = normalizeNotificationToken(token || expoPushToken);

    if (!normalizedToken) {
      return res.status(400).json({
        success: false,
        message: "A native FCM token is required.",
      });
    }

    if (normalizedToken.startsWith("ExponentPushToken[")) {
      return res.status(400).json({
        success: false,
        message: "Expo push tokens are no longer supported. Use a native FCM token from the Android device.",
      });
    }

    const savedToken = await ensureNotificationTokenRecord(req.user.uid, normalizedToken, platform || deviceType || "android");

    if (!savedToken) {
      return res.status(500).json({
        success: false,
        message: "Failed to persist notification token.",
      });
    }

    console.log("[push-debug] FCM token saved:", {
      uid: req.user.uid,
      platform: platform || deviceType || "android",
    });

    return res.status(200).json({
      success: true,
      message: "Push token saved.",
      token: savedToken,
    });
  } catch (error) {
    console.error("Push token update failed:", error);
    return res.status(500).json({ success: false, message: "Failed to save push token." });
  }
};

router.post("/register-token", authenticateFirebaseUser, registerNotificationToken);
router.post("/push-token", authenticateFirebaseUser, registerNotificationToken);

router.post("/test", authenticateFirebaseUser, async (req, res) => {
  try {
    if (!messaging) {
      return res.status(503).json({ success: false, message: "Firebase Admin messaging is not configured." });
    }

    const { title = "UniHelp Test", body = "Direct FCM is working!", data = { type: "test" } } = req.body || {};
    const recipientTokens = await getActiveNotificationTokensForUser(req.user.uid);

    if (!recipientTokens.length) {
      return res.status(404).json({ success: false, message: "No active FCM tokens found for this user." });
    }

    const payload = buildMessagePayload({
      title,
      body,
      type: "test",
      category: "General",
      url: "/notifications",
      data,
    });

    const response = await messaging.sendEachForMulticast({
      ...payload,
      tokens: recipientTokens,
    });

    return res.status(200).json({
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses?.slice(0, 3),
    });
  } catch (error) {
    console.error("FCM test notification failed:", error);
    return res.status(500).json({ success: false, message: "Failed to send test notification." });
  }
});

router.post("/send-user", authenticateFirebaseUser, async (req, res) => {
  try {
    const {
      userIds = [],
      userId = null,
      title,
      body,
      type = "general",
      category = "General",
      url = "/",
      announcementId = null,
      data = {},
    } = req.body || {};

    const requestedIds = Array.isArray(userIds) ? userIds : [userId];
    const ids = [...new Set(requestedIds
      .filter((id) => typeof id === "string")
      .map((id) => id.trim())
      .filter(Boolean))];

    if (!title || !body || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title, body, and at least one user are required.",
      });
    }

    if (
      !(await isNotificationAdmin(req.user)) &&
      !(await isAuthorizedUserNotification(req.user.uid, ids, type, data || {}))
    ) {
      return res.status(403).json({ success: false, message: "You cannot send this notification." });
    }

    const recipients = [];
    const targetUsers = [];

    for (const uid of ids) {
      const userSnap = await db.collection("users").doc(uid).get();
      const user = userSnap.data() || {};

      targetUsers.push({ userId: uid });

      const notificationsEnabled =
        user.notificationsEnabled !== false &&
        user.notifications?.enabled !== false;

      if (!notificationsEnabled) continue;

      const tokenCandidates = [user.fcmToken, ...(await getActiveNotificationTokensForUser(uid))];
      const uniqueTokens = [...new Set(tokenCandidates.filter(Boolean))];

      for (const token of uniqueTokens) {
        recipients.push({ userId: uid, token, pushType: "fcm" });
      }
    }

    const payload = buildMessagePayload({
      title,
      body,
      type,
      category,
      url,
      announcementId,
      data,
    });

    let sent = 0;
    const fcmRecipients = recipients.filter((item) => item.pushType === "fcm");

    if (fcmRecipients.length > 0) {
      const fcmResult = await sendNotification({
        recipients: fcmRecipients,
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

    for (const recipient of targetUsers) {
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

    return res.status(200).json({ success: true, sent, recipients: targetUsers.length, pushRecipients: recipients.length });
  } catch (error) {
    console.error("User notification send failed:", error);
    return res.status(500).json({ success: false, message: "Failed to send user notification." });
  }
});

router.post("/broadcast", authenticateFirebaseUser, async (req, res) => {
  try {
    if (!(await isNotificationAdmin(req.user))) {
      return res.status(403).json({ success: false, message: "Admin access required." });
    }

    const {
      title,
      body,
      category = "General",
      announcementId = null,
      url = "/announcements",
    } = req.body || {};

    if (!title || !body) {
      return res.status(400).json({
        success: false,
        message: "Title and body are required.",
      });
    }

    const usersSnap = await db.collection("users").get();
    const recipients = [];
    const targetUsers = [];

    for (const doc of usersSnap.docs) {
      const user = doc.data() || {};
      const notificationsEnabled =
        user.notificationsEnabled !== false &&
        user.notifications?.enabled !== false;

      if (!notificationsEnabled) continue;

      targetUsers.push({
        userId: doc.id,
      });

      const tokenCandidates = [user.fcmToken, ...(await getActiveNotificationTokensForUser(doc.id))];
      const uniqueTokens = [...new Set(tokenCandidates.filter(Boolean))];

      for (const token of uniqueTokens) {
        recipients.push({
          userId: doc.id,
          token,
          pushType: "fcm",
        });
      }
    }

    const message = buildMessagePayload({
      title,
      body,
      type: "announcement",
      category,
      url,
      announcementId,
    });

    let sent = 0;

    if (recipients.length > 0) {
      const fcmResult = await sendNotification({
        recipients,
        title,
        body,
        data: {
          type: "announcement",
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

    const batchChunks = chunkArray(targetUsers, 450);

    for (const batchRecipients of batchChunks) {
      for (const recipient of batchRecipients) {
        await query(insertSql, [
          recipient.userId,
          title,
          body,
          category,
          "announcement",
          url,
          announcementId
        ]);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Notification broadcast completed.",
      recipients: recipients.length,
      sent,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to broadcast notification.",
    });
  }
});

export default router;
