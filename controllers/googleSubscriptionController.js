import { db } from "../firebase/firebaseAdmin.js";
import {
  GOOGLE_PLAY_PACKAGE_NAME,
  getGooglePlayBilling,
  isGooglePlayProduct,
} from "../config/googlePlay.js";
import {
  tokenRecordId,
  verifyGooglePlaySubscription,
} from "../services/googlePlayService.js";

const toDate = (value) => (value ? new Date(value) : null);

const updateUserEntitlement = async (uid, subscription) => {
  const userRef = db.collection("users").doc(uid);
  const snapshot = await userRef.get();
  const existing = snapshot.exists ? snapshot.data() : {};
  const googleOwnsEntitlement = existing.subscriptionProvider === "google_play" ||
    existing.subscriptionProvider == null;
  const premium = googleOwnsEntitlement ? subscription.active : Boolean(existing.premium);

  await userRef.set({
    premium,
    verified: true,
    subscriptionProvider: "google_play",
    subscriptionProductId: subscription.productId,
    subscriptionBilling: getGooglePlayBilling(subscription.productId),
    subscriptionStatus: subscription.status,
    subscriptionExpiresAt: toDate(subscription.expiryTime),
    subscriptionAutoRenewing: subscription.autoRenewing,
    updatedAt: new Date(),
  }, { merge: true });
};

export const verifyGoogleSubscription = async (req, res) => {
  try {
    const { purchaseToken, productId } = req.body || {};
    const uid = req.user.uid;
    if (!purchaseToken || !productId || !isGooglePlayProduct(productId)) {
      return res.status(400).json({ success: false, error: "Valid purchase token and product are required" });
    }

    const ref = db.collection("googlePlaySubscriptions").doc(tokenRecordId(purchaseToken));
    const existing = await ref.get();
    if (existing.exists && existing.data().userId && existing.data().userId !== uid) {
      return res.status(409).json({ success: false, error: "This purchase belongs to another UniHelp account" });
    }

    const subscription = await verifyGooglePlaySubscription({ purchaseToken, productId });
    await ref.set({
      userId: uid,
      provider: "google_play",
      packageName: GOOGLE_PLAY_PACKAGE_NAME,
      productId: subscription.productId,
      purchaseToken,
      orderId: subscription.orderId,
      status: subscription.status,
      expiryTime: toDate(subscription.expiryTime),
      autoRenewing: subscription.autoRenewing,
      acknowledged: subscription.acknowledged,
      lastVerifiedAt: new Date(),
      updatedAt: new Date(),
      createdAt: existing.exists ? existing.data().createdAt || new Date() : new Date(),
    }, { merge: true });
    await updateUserEntitlement(uid, subscription);

    return res.json({
      success: true,
      entitlement: {
        premium: subscription.active,
        productId: subscription.productId,
        status: subscription.status,
        expiresAt: subscription.expiryTime,
        autoRenewing: subscription.autoRenewing,
      },
    });
  } catch (error) {
    console.error("[google-play] verification failed", error);
    return res.status(502).json({ success: false, error: "Could not verify Google Play subscription" });
  }
};

export const getGoogleSubscriptionStatus = async (req, res) => {
  try {
    const snapshot = await db.collection("googlePlaySubscriptions")
      .where("userId", "==", req.user.uid)
      .orderBy("updatedAt", "desc")
      .limit(1)
      .get();
    const subscription = snapshot.docs[0]?.data();
    return res.json({
      success: true,
      entitlement: subscription ? {
        premium: ["active", "in_grace_period", "canceled"].includes(subscription.status) &&
          (!subscription.expiryTime || subscription.expiryTime.toDate().getTime() > Date.now()),
        productId: subscription.productId,
        status: subscription.status,
        expiresAt: subscription.expiryTime?.toDate?.().toISOString() || null,
        autoRenewing: Boolean(subscription.autoRenewing),
      } : { premium: false, status: "none", expiresAt: null },
    });
  } catch (error) {
    console.error("[google-play] status failed", error);
    return res.status(500).json({ success: false, error: "Could not load subscription status" });
  }
};

export const processGoogleRtdn = async (req, res) => {
  try {
    const expected = process.env.GOOGLE_PLAY_RTDN_TOKEN;
    if (!expected || req.headers.authorization !== `Bearer ${expected}`) {
      return res.status(401).send("Unauthorized");
    }
    const encoded = req.body?.message?.data;
    const notification = encoded ? JSON.parse(Buffer.from(encoded, "base64").toString("utf8")) : null;
    const token = notification?.subscriptionNotification?.purchaseToken;
    if (!token) return res.status(204).send();
    const ref = db.collection("googlePlaySubscriptions").doc(tokenRecordId(token));
    const record = await ref.get();
    if (!record.exists || !record.data().userId) return res.status(204).send();
    const productId = record.data().productId;
    const subscription = await verifyGooglePlaySubscription({ purchaseToken: token, productId });
    await ref.set({
      productId: subscription.productId,
      orderId: subscription.orderId,
      status: subscription.status,
      expiryTime: toDate(subscription.expiryTime),
      autoRenewing: subscription.autoRenewing,
      acknowledged: subscription.acknowledged,
      lastVerifiedAt: new Date(),
      updatedAt: new Date(),
    }, { merge: true });
    await updateUserEntitlement(record.data().userId, subscription);
    return res.status(204).send();
  } catch (error) {
    console.error("[google-play] RTDN processing failed", error);
    return res.status(500).send("Retry later");
  }
};