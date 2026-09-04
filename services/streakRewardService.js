import { admin, db } from "../firebase/firebaseAdmin.js";
import { randomInt, randomBytes } from "node:crypto";
import { isPremiumEntitled } from "./entitlementService.js";
import { sendAppNotification } from "../utils/notifications.js";

export const STREAK_MILESTONES = [
  { days: 7, title: "7 Day Streak", rewards: [
    { id: "tokens-20", label: "+20 AI Tokens", type: "ai_tokens", value: 20, weight: 30 },
    { id: "tokens-30", label: "+30 AI Tokens", type: "ai_tokens", value: 30, weight: 20 },
    { id: "tokens-50", label: "+50 AI Tokens", type: "ai_tokens", value: 50, weight: 8 },
    { id: "discount-10", label: "10% Premium Discount", type: "premium_discount", value: 10, expirationDays: 7, weight: 8 },
    { id: "premium-1-day", label: "1 Free Premium Day", type: "free_premium_days", value: 1, weight: 2 },
    { id: "badge-warrior", label: "7 Day Warrior Badge", type: "badge", value: "7-day-warrior", weight: 32 },
  ] },
  { days: 14, title: "14 Day Streak", rewards: [
    { id: "tokens-30", label: "+30 AI Tokens", type: "ai_tokens", value: 30, weight: 25 },
    { id: "tokens-50", label: "+50 AI Tokens", type: "ai_tokens", value: 50, weight: 20 },
    { id: "tokens-100", label: "+100 AI Tokens", type: "ai_tokens", value: 100, weight: 5 },
    { id: "discount-20", label: "20% Premium Discount", type: "premium_discount", value: 20, expirationDays: 7, weight: 5 },
    { id: "premium-2-days", label: "2 Free Premium Days", type: "free_premium_days", value: 2, weight: 2 },
    { id: "badge-scholar", label: "14 Day Scholar Badge", type: "badge", value: "14-day-scholar", weight: 41 },
  ] },
  { days: 21, title: "21 Day Streak", rewards: [
    { id: "tokens-50", label: "+50 AI Tokens", type: "ai_tokens", value: 50, weight: 30 },
    { id: "tokens-100", label: "+100 AI Tokens", type: "ai_tokens", value: 100, weight: 12 },
    { id: "badge-champion", label: "21 Day Champion Badge", type: "badge", value: "21-day-champion", weight: 58 },
  ] },
  { days: 30, title: "30 Day Streak", rewards: [
    { id: "tokens-100", label: "+100 AI Tokens", type: "ai_tokens", value: 100, weight: 25 },
    { id: "tokens-200", label: "+200 AI Tokens", type: "ai_tokens", value: 200, weight: 5 },
    { id: "badge-legend", label: "30 Day Legend Badge", type: "badge", value: "30-day-legend", weight: 70 },
  ] },
  { days: 60, title: "60 Day Streak", rewards: [
    { id: "tokens-200", label: "+200 AI Tokens", type: "ai_tokens", value: 200, weight: 20 },
    { id: "badge-master", label: "60 Day Master Badge", type: "badge", value: "60-day-master", weight: 80 },
  ] },
  { days: 90, title: "90 Day Streak", rewards: [
    { id: "tokens-500", label: "+500 AI Tokens", type: "ai_tokens", value: 500, weight: 10 },
    { id: "badge-legendary", label: "90 Day Legendary Badge", type: "badge", value: "90-day-legendary", weight: 90 },
  ] },
];

const dateKey = (date) => date.toISOString().slice(0, 10);
const monthResetKey = (date = new Date()) => `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-01`;
const dayDifference = (from, to) => Math.round((parseDateKey(to).getTime() - parseDateKey(from).getTime()) / 86400000);
const parseDateKey = (value) => new Date(`${value}T00:00:00.000Z`);

const cloneDefaultMilestones = () => JSON.parse(JSON.stringify(STREAK_MILESTONES));

const validateMilestones = (milestones) => {
  const supportedTypes = new Set(["ai_tokens", "badge", "premium_discount", "free_premium_days"]);
  if (!Array.isArray(milestones) || milestones.length === 0) throw new Error("Invalid milestone configuration");
  const seenDays = new Set();
  milestones.forEach((milestone) => {
    if (!Number.isInteger(Number(milestone.days)) || Number(milestone.days) < 1 || seenDays.has(Number(milestone.days))) {
      throw new Error("Invalid milestone configuration");
    }
    seenDays.add(Number(milestone.days));
    if (!Array.isArray(milestone.rewards) || milestone.rewards.length === 0) throw new Error("Invalid reward configuration");
    const enabledRewards = milestone.rewards.filter((reward) => reward.enabled !== false && Number(reward.weight) > 0);
    if (!enabledRewards.length || enabledRewards.some((reward) => {
      if (!reward.id || !reward.label || !supportedTypes.has(reward.type)) return true;
      if (reward.type === "ai_tokens" || reward.type === "free_premium_days") return !Number.isFinite(Number(reward.value)) || Number(reward.value) <= 0;
      if (reward.type === "premium_discount") return !Number.isFinite(Number(reward.value)) || Number(reward.value) <= 0 || Number(reward.value) > 100;
      return typeof reward.value !== "string" || !reward.value.trim();
    })) {
      throw new Error("Invalid reward configuration");
    }
  });
  return milestones.map((milestone) => ({
    ...milestone,
    days: Number(milestone.days),
    title: String(milestone.title || `${milestone.days} Day Streak`),
    enabled: milestone.enabled !== false,
  }));
};

export const getConfiguredMilestones = async () => {
  if (!db) return cloneDefaultMilestones();
  const snapshot = await db.collection("rewardConfigs").doc("streakMilestones").get();
  if (!snapshot.exists || !Array.isArray(snapshot.data()?.milestones)) return cloneDefaultMilestones();
  return validateMilestones(snapshot.data().milestones);
};

export const saveMilestoneConfig = async (milestones, uid) => {
  if (!db) throw new Error("Reward service is not configured");
  const validated = validateMilestones(milestones);
  await db.collection("rewardConfigs").doc("streakMilestones").set({
    milestones: validated,
    updatedBy: uid,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return validated;
};

const chooseWeightedReward = (rewards) => {
  const enabled = rewards.filter((reward) => reward.enabled !== false && Number(reward.weight) > 0);
  const total = enabled.reduce((sum, reward) => sum + Number(reward.weight), 0);
  if (!total) throw new Error("Invalid reward configuration");
  let cursor = randomInt(0, 1000000) / 1000000 * total;
  return enabled.find((reward) => (cursor -= Number(reward.weight)) < 0) || enabled[enabled.length - 1];
};

const publicReward = (reward) => ({
  id: reward.id,
  label: reward.label,
  type: reward.type,
  value: reward.value,
});

const buildState = (user = {}, rewards = []) => ({
  streakCount: Number(user.streakCount || 0),
  bestStreak: Math.max(Number(user.bestStreak || 0), Number(user.streakCount || 0)),
  streakDates: Array.isArray(user.streakDates) ? user.streakDates : [],
  lastActiveDate: user.lastActiveDate || "",
  streakFreezeBalance: Number(user.streakFreezeBalance || 0),
  streakFreezeResetAt: user.streakFreezeResetAt || null,
  pendingRewards: rewards.filter((reward) => reward.status === "available").map((reward) => ({
    id: reward.id,
    milestone: reward.milestone,
    title: reward.title,
    status: reward.status,
  })),
});

const readRewardDocs = async (uid) => {
  const snapshot = await db.collection("users").doc(uid).collection("streakRewards").get();
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
};

export const recordStreakAndUnlockRewards = async (uid) => {
  if (!db) throw new Error("Reward service is not configured");
  const milestones = (await getConfiguredMilestones()).filter((milestone) => milestone.enabled !== false);
  const userRef = db.collection("users").doc(uid);
  const result = await db.runTransaction(async (transaction) => {
    const userSnap = await transaction.get(userRef);
    const user = userSnap.exists ? userSnap.data() : {};
    const today = dateKey(new Date());
    const lastActiveDate = user.lastActiveDate || "";
    const existingDates = Array.isArray(user.streakDates) ? user.streakDates : [];

    if (lastActiveDate === today) {
      return { user, unlocked: [] };
    }

    const yesterday = dateKey(new Date(Date.now() - 86400000));
    const premium = isPremiumEntitled(user);
    const currentMonth = monthResetKey();
    const freezeResetAt = user.streakFreezeResetAt?.toDate?.()?.toISOString?.() || String(user.streakFreezeResetAt || "");
    const resetFreeze = premium && (!freezeResetAt || freezeResetAt < currentMonth);
    const freezeBalance = resetFreeze ? 1 : Number(user.streakFreezeBalance || 0);
    const missedOneDay = lastActiveDate && dayDifference(lastActiveDate, today) === 2;
    const freezeUsed = missedOneDay && freezeBalance > 0;
    const nextStreak = lastActiveDate === yesterday || freezeUsed ? Number(user.streakCount || 0) + 1 : 1;
    const streakDates = [...new Set([...existingDates, today])].sort().slice(-400);
    const nextUser = {
      streakCount: nextStreak,
      bestStreak: Math.max(Number(user.bestStreak || 0), nextStreak),
      streakDates,
      lastActiveDate: today,
      lastActiveAt: admin.firestore.FieldValue.serverTimestamp(),
      streakFreezeBalance: Math.max(0, freezeBalance - (freezeUsed ? 1 : 0)),
      streakFreezeResetAt: currentMonth,
      streakFreezeLastUsedAt: freezeUsed ? admin.firestore.FieldValue.serverTimestamp() : user.streakFreezeLastUsedAt || null,
    };

    const crossed = milestones.filter((milestone) =>
      milestone.days <= nextStreak && milestone.days > Number(user.bestStreak || user.streakCount || 0)
    );
    const rewardRefs = crossed.map((milestone) => userRef.collection("streakRewards").doc(String(milestone.days)));
    const existingRewards = await Promise.all(rewardRefs.map((ref) => transaction.get(ref)));
    const unlocked = [];

    transaction.set(userRef, nextUser, { merge: true });
    crossed.forEach((milestone, index) => {
      if (existingRewards[index].exists) return;
      const rewardRef = rewardRefs[index];
      const reward = {
        id: rewardRef.id,
        userId: uid,
        milestone: milestone.days,
        title: milestone.title,
        rewardType: "spin",
        status: "available",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      transaction.set(rewardRef, reward);
      unlocked.push({ id: rewardRef.id, milestone: milestone.days, title: milestone.title, status: "available" });
    });

    return { user: { ...user, ...nextUser }, unlocked };
  });

  const rewards = await readRewardDocs(uid);
  if (result.unlocked.length) {
    try {
      await sendAppNotification({
        userIds: uid,
        title: `${result.unlocked[0].milestone}-day streak reward unlocked`,
        body: "Your streak reward is waiting. Open Rewards to spin.",
        type: "streak-reward",
        category: "Streak",
        url: "/rewards",
      });
    } catch (error) {
      console.warn("[streak] Milestone notification failed", error.message);
    }
  }
  return { ...buildState(result.user, rewards), unlocked: result.unlocked };
};

export const getStreakState = async (uid) => {
  if (!db) throw new Error("Reward service is not configured");
  const userSnap = await db.collection("users").doc(uid).get();
  const rewards = await readRewardDocs(uid);
  return buildState(userSnap.exists ? userSnap.data() : {}, rewards);
};

export const spinStreakReward = async (uid, rewardId, idempotencyKey) => {
  if (!db) throw new Error("Reward service is not configured");
  if (!rewardId || !idempotencyKey) throw new Error("rewardId and idempotencyKey are required");
  const userRef = db.collection("users").doc(uid);
  const rewardRef = userRef.collection("streakRewards").doc(String(rewardId));
  const safeIdempotencyKey = String(idempotencyKey).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 100);
  if (!safeIdempotencyKey) throw new Error("Invalid idempotency key");
  const spinRef = userRef.collection("streakSpins").doc(safeIdempotencyKey);
  const milestones = await getConfiguredMilestones();

  return db.runTransaction(async (transaction) => {
    const [rewardSnap, spinSnap, userSnap] = await Promise.all([
      transaction.get(rewardRef),
      transaction.get(spinRef),
      transaction.get(userRef),
    ]);
    if (spinSnap.exists) return spinSnap.data().result;
    if (!rewardSnap.exists) throw new Error("Reward not found");
    const reward = rewardSnap.data();
    if (reward.status !== "available") throw new Error("This reward has already been claimed");

    const milestone = milestones.find((item) => item.days === Number(reward.milestone));
    if (!milestone) throw new Error("Milestone configuration not found");
    const availableRewards = milestone.rewards.filter((item) => item.enabled !== false && Number(item.weight) > 0);
    const selected = chooseWeightedReward(availableRewards);
    const user = userSnap.exists ? userSnap.data() : {};
    const result = {
      rewardId: reward.id,
      milestone: reward.milestone,
      reward: publicReward(selected),
      wheelIndex: availableRewards.findIndex((item) => item.id === selected.id),
      wheelSegments: availableRewards.map(publicReward),
    };
    const transactionRef = db.collection("rewardTransactions").doc();

    const now = new Date();
    const expiresAt = new Date(now.getTime() + Number(selected.expirationDays || 7) * 86400000);
    let grant = {};
    if (selected.type === "ai_tokens") {
      transaction.set(userRef, { aiTokenBalance: Number(user.aiTokenBalance || 0) + Number(selected.value) }, { merge: true });
      grant = { amount: Number(selected.value) };
    } else if (selected.type === "badge") {
      const badges = Array.isArray(user.badges) ? user.badges : [];
      if (!badges.includes(selected.value)) transaction.set(userRef, { badges: [...badges, selected.value] }, { merge: true });
      grant = { badge: selected.value };
    } else if (selected.type === "premium_discount") {
      const couponRef = db.collection("rewardCoupons").doc();
      const code = `UNI${randomBytes(5).toString("hex").toUpperCase()}`;
      transaction.set(couponRef, {
        userId: uid,
        code,
        percentage: Number(selected.value),
        used: false,
        expiresAt,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      grant = { code, percentage: Number(selected.value), expiresAt: expiresAt.toISOString() };
    } else if (selected.type === "free_premium_days") {
      const existingExpiry = user.premiumExpiresAt?.toDate?.() || user.subscriptionExpiresAt?.toDate?.() || null;
      const premiumExpiry = new Date(Math.max(existingExpiry?.getTime() || now.getTime(), now.getTime()) + Number(selected.value) * 86400000);
      transaction.set(userRef, {
        premium: true,
        premiumExpiresAt: premiumExpiry,
        subscriptionStatus: "active",
        subscriptionProvider: user.subscriptionProvider || "streak_reward",
      }, { merge: true });
      grant = { days: Number(selected.value), expiresAt: premiumExpiry.toISOString() };
    }
    transaction.set(transactionRef, {
      userId: uid,
      type: selected.type,
      source: `${reward.milestone}_day_streak`,
      milestone: reward.milestone,
      rewardId: selected.id,
      value: selected.value,
      status: "claimed",
      expiresAt: selected.type === "premium_discount" ? expiresAt : null,
      grant,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    transaction.set(rewardRef, {
      status: "claimed",
      claimedAt: admin.firestore.FieldValue.serverTimestamp(),
      selectedRewardId: selected.id,
      transactionId: transactionRef.id,
    }, { merge: true });
    transaction.set(spinRef, { result, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    return result;
  });
};

export const getRewardInventory = async (uid) => {
  if (!db) throw new Error("Reward service is not configured");
  const [rewards, transactions] = await Promise.all([
    readRewardDocs(uid),
    db.collection("rewardTransactions").where("userId", "==", uid).limit(100).get(),
  ]);
  return {
    rewards,
    history: transactions.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || ""))),
  };
};

export const getMilestoneConfig = async () => (await getConfiguredMilestones()).map((milestone) => ({
  days: milestone.days,
  title: milestone.title,
  rewards: milestone.rewards.map(publicReward),
}));
