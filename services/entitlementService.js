import { db } from "../firebase/firebaseAdmin.js";

const toDate = (value) => {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const isPremiumEntitled = (profile = {}) => {
  if (!profile.premium) return false;
  if (["expired", "paused", "on_hold", "pending"].includes(String(profile.subscriptionStatus || "").toLowerCase())) return false;
  const expiry = toDate(profile.subscriptionExpiresAt || profile.premiumExpiresAt || profile.expiresAt);
  return !expiry || expiry.getTime() > Date.now();
};

export const getTrustedEntitlementProfile = async (uid) => {
  const snapshot = await db.collection("users").doc(uid).get();
  const profile = snapshot.exists ? snapshot.data() : {};
  return { ...profile, uid, premium: isPremiumEntitled(profile) };
};