import express from "express";
import { authenticateFirebaseUser } from "../middleware/auth.js";
import { verificationRateLimit } from "../middleware/rateLimit.js";
import {
  getGoogleSubscriptionStatus,
  processGoogleRtdn,
  verifyGoogleSubscription,
} from "../controllers/googleSubscriptionController.js";

const router = express.Router();

router.post("/google/verify", authenticateFirebaseUser, verificationRateLimit(), verifyGoogleSubscription);
router.get("/google/status", authenticateFirebaseUser, getGoogleSubscriptionStatus);
router.post("/google/rtdn", express.json(), processGoogleRtdn);

export default router;