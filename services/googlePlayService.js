import crypto from "node:crypto";
import { google } from "googleapis";
import {
  GOOGLE_PLAY_PACKAGE_NAME,
  GOOGLE_PLAY_PRODUCTS,
  isGooglePlayProduct,
} from "../config/googlePlay.js";

const getCredentials = () => {
  const raw = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("Google Play service account is not configured");
  const credentials = JSON.parse(raw);
  if (!credentials.client_email || !credentials.private_key) {
    throw new Error("Google Play service account is incomplete");
  }
  return {
    ...credentials,
    private_key: credentials.private_key.replace(/\\n/g, "\n"),
  };
};

const getPublisher = () => {
  const auth = new google.auth.GoogleAuth({
    credentials: getCredentials(),
    scopes: ["https://www.googleapis.com/auth/androidpublisher"],
  });
  return google.androidpublisher({ version: "v3", auth });
};

export const tokenRecordId = (purchaseToken) =>
  crypto.createHash("sha256").update(purchaseToken).digest("hex");

const normalizeSubscription = (response, requestedProductId) => {
  const data = response.data || {};
  const lineItem = data.lineItems?.find(
    (item) => item.productId === requestedProductId
  ) || data.lineItems?.[0];
  const state = String(data.subscriptionState || "").replace(
    "SUBSCRIPTION_STATE_",
    ""
  ).toLowerCase();
  const expiryTime = lineItem?.expiryTime || null;
  const expiryMs = expiryTime ? Date.parse(expiryTime) : NaN;

  return {
    packageName: data.packageName,
    productId: lineItem?.productId || requestedProductId,
    orderId: lineItem?.latestSuccessfulOrderId || null,
    status: state || "unknown",
    expiryTime,
    autoRenewing: Boolean(lineItem?.autoRenewingPlan?.autoRenewEnabled),
    acknowledged: data.acknowledgementState === "ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED",
    active:
      ["active", "in_grace_period", "canceled"].includes(state) &&
      Number.isFinite(expiryMs) &&
      expiryMs > Date.now(),
    rawState: data.subscriptionState || null,
  };
};

export async function verifyGooglePlaySubscription({ purchaseToken, productId }) {
  if (!purchaseToken || !isGooglePlayProduct(productId)) {
    throw new Error("Unsupported Google Play subscription");
  }

  const publisher = getPublisher();
  const response = await publisher.purchases.subscriptionsv2.get({
    packageName: GOOGLE_PLAY_PACKAGE_NAME,
    token: purchaseToken,
  });
  const subscription = normalizeSubscription(response, productId);

  if (
    subscription.packageName !== GOOGLE_PLAY_PACKAGE_NAME ||
    !isGooglePlayProduct(subscription.productId) ||
    !GOOGLE_PLAY_PRODUCTS.includes(productId)
  ) {
    throw new Error("Google Play subscription does not belong to UniHelp");
  }

  if (!subscription.acknowledged) {
    await publisher.purchases.subscriptions.acknowledge({
      packageName: GOOGLE_PLAY_PACKAGE_NAME,
      subscriptionId: subscription.productId,
      token: purchaseToken,
      requestBody: {},
    });
    subscription.acknowledged = true;
  }

  return subscription;
}