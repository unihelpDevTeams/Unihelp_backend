import express from "express";
import { authenticateFirebaseUser } from "../middleware/auth.js";
import { db } from "../firebase/firebaseAdmin.js";
import {
  getConfiguredMilestones,
  getMilestoneConfig,
  getRewardInventory,
  saveMilestoneConfig,
  getStreakState,
  recordStreakAndUnlockRewards,
  spinStreakReward,
} from "../services/streakRewardService.js";

const router = express.Router();
const ADMIN_EMAILS = new Set((process.env.ADMIN_EMAILS || "onakomayaokiki@gmail.com,iadejuwon77@gmail.com")
  .split(",").map((email) => email.trim().toLowerCase()).filter(Boolean));

const requireAdmin = async (req, res, next) => {
  if (req.user?.admin || ADMIN_EMAILS.has(String(req.user?.email || "").toLowerCase())) return next();
  const profile = db ? await db.collection("users").doc(req.user.uid).get() : null;
  if (profile?.data()?.admin === true) return next();
  return res.status(403).json({ success: false, message: "Admin access required" });
};

const handleError = (res, error) => {
  const message = error.message || "Streak request failed";
  const status = /already|not found|configuration|required/i.test(message) ? 409 : 500;
  return res.status(status).json({ success: false, message });
};

router.get("/milestones", authenticateFirebaseUser, async (req, res) => {
  try {
    res.json({ success: true, data: await getMilestoneConfig() });
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/admin/config", authenticateFirebaseUser, requireAdmin, async (req, res) => {
  try {
    res.json({ success: true, data: await getConfiguredMilestones() });
  } catch (error) {
    handleError(res, error);
  }
});

router.put("/admin/config", authenticateFirebaseUser, requireAdmin, async (req, res) => {
  try {
    res.json({ success: true, data: await saveMilestoneConfig(req.body?.milestones, req.user.uid) });
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/", authenticateFirebaseUser, async (req, res) => {
  try {
    res.json({ success: true, data: await getStreakState(req.user.uid) });
  } catch (error) {
    console.error("[streak] Failed to fetch state", error);
    handleError(res, error);
  }
});

router.post("/check-in", authenticateFirebaseUser, async (req, res) => {
  try {
    const data = await recordStreakAndUnlockRewards(req.user.uid);
    res.json({ success: true, data });
  } catch (error) {
    console.error("[streak] Failed to record check-in", error);
    handleError(res, error);
  }
});

router.get("/rewards", authenticateFirebaseUser, async (req, res) => {
  try {
    res.json({ success: true, data: await getRewardInventory(req.user.uid) });
  } catch (error) {
    console.error("[streak] Failed to fetch rewards", error);
    handleError(res, error);
  }
});

router.post("/rewards/:rewardId/spin", authenticateFirebaseUser, async (req, res) => {
  try {
    const idempotencyKey = req.get("Idempotency-Key") || req.body?.idempotencyKey;
    const data = await spinStreakReward(req.user.uid, req.params.rewardId, idempotencyKey);
    res.json({ success: true, data });
  } catch (error) {
    console.error("[streak] Failed to spin reward", error);
    handleError(res, error);
  }
});

export default router;
