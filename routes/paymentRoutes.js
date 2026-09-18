import express from "express";

import {
  flutterwaveWebhook,
  initializePremiumPayment,
  verifyPayment,
} from "../controllers/paymentController.js";
import { authenticateFirebaseUser } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/initialize-premium",
  authenticateFirebaseUser,
  initializePremiumPayment
);

router.post(
  "/verify-payment",
  authenticateFirebaseUser,
  verifyPayment
);

router.post(
  "/flutterwave/webhook",
  flutterwaveWebhook
);

export default router;
