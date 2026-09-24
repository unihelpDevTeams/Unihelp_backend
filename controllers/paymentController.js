import { query } from "../db/pool.js";

import {
  initializeFlutterwavePayment,
  verifyFlutterwavePayment,
} from "../services/flutterwaveService.js";
import { getPremiumAmount, getPremiumPlan } from "../config/premiumPlans.js";
import { processMarketplaceSponsorshipWebhook } from "../services/marketplaceSponsorshipService.js";

export const initializePremiumPayment = async (req, res) => {
  try {
    const {
      userId: ignoredUserId,
      email,
      name,
      billing = "monthly",
      plan = "student-premium",
      redirectUrl,
    } = req.body;

    const userId = req.user.uid;
    if (!email || !redirectUrl) {
      return res.status(400).json({
        success: false,
        error: "Missing fields",
      });
    }

    if (!["monthly", "yearly"].includes(billing)) {
      return res.status(400).json({
        success: false,
        error: "Invalid billing cycle",
      });
    }

    const selectedPlan = getPremiumPlan(plan);
    const amount = getPremiumAmount(selectedPlan.id, billing);
    const txRef = `UNIHELP_${userId}_${Date.now()}`;

    const payment = await initializeFlutterwavePayment({
      txRef,
      amount,
      redirectUrl,
      customer: {
        email: req.user.email || email,
        name: name || "UniHelp Student",
      },
      title: "UniHelp Student Premium",
      description: `${selectedPlan.name} ${billing} subscription`,
    });

    return res.status(200).json({
      success: true,
      paymentLink: payment.data?.link,
      txRef,
      amount,
      plan: selectedPlan.id,
      billing,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      error: "Could not start payment",
    });
  }
};

export const verifyPayment =
  async (req, res) => {
    try {
      const {
        transaction_id,
        userId: ignoredUserId,
        plan,
        billing,
      } = req.body;

      const userId = req.user.uid;
      if (!transaction_id) {
        return res.status(400).json({
          success: false,
          error: "Missing fields",
        });
      }

      if (!["monthly", "yearly"].includes(billing)) {
        return res.status(400).json({
          success: false,
          error: "Invalid billing cycle",
        });
      }

      /* VERIFY WITH FLUTTERWAVE */

      const verification =
        await verifyFlutterwavePayment(
          transaction_id
        );

      const paymentData =
        verification.data;

      const authenticatedEmail = String(req.user.email || "").trim().toLowerCase();
      const paidEmail = String(paymentData.customer?.email || "").trim().toLowerCase();
      if (!authenticatedEmail || !paidEmail || authenticatedEmail !== paidEmail) {
        return res.status(403).json({
          success: false,
          error: "Payment does not belong to the authenticated account",
        });
      }

      console.log(paymentData);

      const selectedPlan = getPremiumPlan(plan);
      const expectedAmount = getPremiumAmount(selectedPlan.id, billing);
      const paidAmount = Number(paymentData.amount);

      if (
        paymentData.status !==
          "successful" ||
        paidAmount !== expectedAmount
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Payment verification failed",
        });
      }

      /* CALCULATE EXPIRY */

      const now = new Date();

      let expiryDate =
        billing === "monthly"
          ? new Date(
              now.setMonth(
                now.getMonth() + 1
              )
            )
          : new Date(
              now.setFullYear(
                now.getFullYear() + 1
              )
            );

      /* SAVE SUBSCRIPTION */

      const gateway_fee = expectedAmount * 0.014;
      const net_amount = expectedAmount - gateway_fee;

      await query(
        `INSERT INTO transactions (
          transaction_id, user_id, amount, type, status, 
          gateway_fee, net_amount, payment_method, customer_email, reference, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())`,
        [
          transaction_id.toString(),
          userId,
          expectedAmount,
          'premium_subscription',
          'successful',
          gateway_fee,
          net_amount,
          paymentData.payment_type || 'card',
          paymentData.customer.email,
          paymentData.tx_ref || ''
        ]
      );

      /* UPDATE USER */

      await query(
        `UPDATE users SET
          premium = true,
          subscription_plan = $1,
          subscription_expires_at = $2,
          updated_at = NOW()
        WHERE id = $3`,
        [selectedPlan.id, expiryDate, userId]
      );

      return res.status(200).json({
        success: true,

        message:
          "Payment verified successfully",

        data: {
          premium: true,
          subscriptionExpiresAt: expiryDate.toISOString(),
          premiumExpiresAt: expiryDate.toISOString(),
          subscriptionStatus: "active",
        },
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        error:
          "Internal server error",
      });
    }
  };

export const flutterwaveWebhook = async (req, res) => {
  try {
    const configuredHash =
      process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH ||
      process.env.FLW_WEBHOOK_SECRET_HASH ||
      process.env.FLW_WEBHOOK_HASH ||
      "";
    const receivedHash = req.headers["verif-hash"];

    if (!configuredHash) {
      return res.status(500).json({ success: false, error: "Flutterwave webhook hash is not configured" });
    }

    if (receivedHash !== configuredHash) {
      return res.status(401).json({ success: false, error: "Invalid webhook signature" });
    }

    const event = String(req.body?.event || "").toLowerCase();
    if (event && !event.includes("charge.completed")) {
      return res.status(200).json({ success: true, ignored: true });
    }

    const result = await processMarketplaceSponsorshipWebhook(req.body);
    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("Flutterwave webhook failed:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Webhook processing failed",
    });
  }
};
