import express from "express";

import {
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

export default router;
