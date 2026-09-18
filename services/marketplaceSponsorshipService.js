import crypto from "crypto";
import { getPool, query } from "../db/pool.js";
import {
  getMarketplaceSponsorshipPlan,
  MARKETPLACE_SPONSORSHIP_PLANS,
  toNaira,
} from "../config/marketplaceSponsorshipPlans.js";
import {
  initializeFlutterwavePayment,
  verifyFlutterwavePayment,
} from "./flutterwaveService.js";
import { sendAppNotification } from "../utils/notifications.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const PROVIDER = "flutterwave";
const PAYMENT_PREFIX = "UNIHELP-SPONSOR";

export const publicSponsorshipPlans = () =>
  MARKETPLACE_SPONSORSHIP_PLANS.filter((plan) => plan.active).map((plan) => ({
    id: plan.id,
    label: plan.label,
    durationDays: plan.durationDays,
    amount: plan.amountKobo,
    amountNaira: toNaira(plan.amountKobo),
    currency: plan.currency,
  }));

export const mapSponsorship = (row = {}) => ({
  id: row.id,
  listingId: row.listing_id,
  listingTitle: row.listing_title || row.title || "",
  sellerId: row.seller_id,
  planId: row.plan_id,
  durationDays: Number(row.duration_days || 0),
  amount: Number(row.amount || 0),
  amountNaira: toNaira(row.amount || 0),
  currency: row.currency || "NGN",
  status: row.status,
  paymentProvider: row.payment_provider,
  paymentReference: row.payment_reference,
  transactionId: row.transaction_id,
  startsAt: row.starts_at ? new Date(row.starts_at).toISOString() : null,
  expiresAt: row.expires_at ? new Date(row.expires_at).toISOString() : null,
  createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
  updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
});

const assertPaymentMatchesSponsorship = ({ paymentData, sponsorship }) => {
  const paidStatus = String(paymentData?.status || "").toLowerCase();
  const paidReference = String(paymentData?.tx_ref || paymentData?.txRef || "").trim();
  const paidCurrency = String(paymentData?.currency || "").trim().toUpperCase();
  const paidAmount = Number(paymentData?.amount);
  const expectedAmount = toNaira(sponsorship.amount);

  if (paidStatus !== "successful") {
    throw Object.assign(new Error("Payment was not successful"), { statusCode: 400 });
  }

  if (!paidReference || paidReference !== sponsorship.payment_reference) {
    throw Object.assign(new Error("Payment reference does not match this sponsorship"), { statusCode: 400 });
  }

  if (paidCurrency !== sponsorship.currency) {
    throw Object.assign(new Error("Payment currency is invalid"), { statusCode: 400 });
  }

  if (Math.abs(paidAmount - expectedAmount) > 0.01) {
    throw Object.assign(new Error("Payment amount is invalid"), { statusCode: 400 });
  }
};

const activateSponsorshipWithClient = async ({ client, sponsorshipId, transactionId, paymentData }) => {
  const sponsorshipResult = await client.query(
    `SELECT ms.*, mi.title AS listing_title, mi.seller_id AS current_seller_id
     FROM marketplace_sponsorships ms
     JOIN marketplace_items mi ON mi.id = ms.listing_id
     WHERE ms.id = $1
     FOR UPDATE`,
    [sponsorshipId]
  );

  if (!sponsorshipResult.rowCount) {
    throw Object.assign(new Error("Sponsorship request not found"), { statusCode: 404 });
  }

  const sponsorship = sponsorshipResult.rows[0];
  if (sponsorship.current_seller_id !== sponsorship.seller_id) {
    throw Object.assign(new Error("Listing ownership changed before payment could be activated"), { statusCode: 409 });
  }

  if (sponsorship.status === "active") {
    if (String(sponsorship.transaction_id || "") !== String(transactionId || "")) {
      throw Object.assign(new Error("Sponsorship has already been activated with a different transaction"), { statusCode: 409 });
    }
    return sponsorship;
  }

  if (!["pending_payment", "payment_pending"].includes(String(sponsorship.status || ""))) {
    throw Object.assign(new Error("Sponsorship is not awaiting payment"), { statusCode: 409 });
  }

  const reusedTransaction = await client.query(
    "SELECT id FROM marketplace_sponsorships WHERE transaction_id = $1 AND id <> $2 LIMIT 1",
    [String(transactionId), sponsorshipId]
  );
  if (reusedTransaction.rowCount) {
    throw Object.assign(new Error("This payment transaction has already been used"), { statusCode: 409 });
  }

  assertPaymentMatchesSponsorship({ paymentData, sponsorship });

  const activeWindow = await client.query(
    `SELECT MAX(expires_at) AS active_until
     FROM marketplace_sponsorships
     WHERE listing_id = $1 AND status = 'active' AND expires_at > NOW()`,
    [sponsorship.listing_id]
  );

  const now = new Date();
  const activeUntil = activeWindow.rows[0]?.active_until ? new Date(activeWindow.rows[0].active_until) : null;
  const startsAt = activeUntil && activeUntil.getTime() > now.getTime() ? activeUntil : now;
  const expiresAt = new Date(startsAt.getTime() + Number(sponsorship.duration_days) * DAY_MS);

  const activated = await client.query(
    `UPDATE marketplace_sponsorships
     SET status = 'active',
         transaction_id = $2,
         starts_at = $3,
         expires_at = $4,
         updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [sponsorshipId, String(transactionId), startsAt.toISOString(), expiresAt.toISOString()]
  );

  await client.query(
    `UPDATE marketplace_items
     SET is_sponsored = TRUE,
         sponsored_until = GREATEST(COALESCE(sponsored_until, NOW()), $2::timestamptz),
         sponsored_priority = GREATEST(COALESCE(sponsored_priority, 0), 1),
         sponsored_status = 'active',
         updated_at = NOW()
     WHERE id = $1`,
    [sponsorship.listing_id, expiresAt.toISOString()]
  );

  return {
    ...activated.rows[0],
    listing_title: sponsorship.listing_title,
  };
};

export const initializeMarketplaceSponsorship = async ({
  listingId,
  sellerId,
  planId,
  user,
  redirectUrl,
}) => {
  const plan = getMarketplaceSponsorshipPlan(planId);
  if (!plan) {
    throw Object.assign(new Error("Invalid sponsorship plan"), { statusCode: 400 });
  }

  const listing = await query("SELECT id, seller_id, title, status FROM marketplace_items WHERE id = $1", [listingId]);
  if (!listing.rowCount) {
    throw Object.assign(new Error("Marketplace listing not found"), { statusCode: 404 });
  }
  if (listing.rows[0].seller_id !== sellerId) {
    throw Object.assign(new Error("You can only sponsor your own listing"), { statusCode: 403 });
  }

  const status = String(listing.rows[0].status || "").toLowerCase();
  if (["deleted", "blocked", "removed", "rejected"].includes(status)) {
    throw Object.assign(new Error("This listing cannot be sponsored"), { statusCode: 400 });
  }

  const paymentReference = `${PAYMENT_PREFIX}-${crypto.randomUUID()}`;
  const sponsorshipId = crypto.randomUUID();
  const fallbackRedirect = `${process.env.APP_URL || "https://unihelp.app"}/marketplace/sponsorship/return`;

  const inserted = await query(
    `INSERT INTO marketplace_sponsorships
      (id, listing_id, seller_id, plan_id, duration_days, amount, currency, status, payment_provider, payment_reference)
     VALUES ($1,$2,$3,$4,$5,$6,$7,'pending_payment',$8,$9)
     RETURNING *`,
    [
      sponsorshipId,
      listingId,
      sellerId,
      plan.id,
      plan.durationDays,
      plan.amountKobo,
      plan.currency,
      PROVIDER,
      paymentReference,
    ]
  );

  const payment = await initializeFlutterwavePayment({
    txRef: paymentReference,
    amount: toNaira(plan.amountKobo),
    redirectUrl: redirectUrl || fallbackRedirect,
    customer: {
      email: user?.email || "",
      name: user?.name || user?.displayName || "UniHelp Seller",
    },
    title: "UniHelp Marketplace Sponsorship",
    description: `${listing.rows[0].title} - ${plan.label} promotion`,
  });

  return {
    sponsorship: mapSponsorship({ ...inserted.rows[0], listing_title: listing.rows[0].title }),
    paymentLink: payment.data?.link,
    txRef: paymentReference,
    amount: plan.amountKobo,
    amountNaira: toNaira(plan.amountKobo),
    currency: plan.currency,
  };
};

export const verifyMarketplaceSponsorshipPayment = async ({ sponsorshipId, sellerId, transactionId }) => {
  if (!transactionId) {
    throw Object.assign(new Error("Missing transaction id"), { statusCode: 400 });
  }

  const ownership = await query(
    "SELECT id FROM marketplace_sponsorships WHERE id = $1 AND seller_id = $2",
    [sponsorshipId, sellerId]
  );
  if (!ownership.rowCount) {
    throw Object.assign(new Error("Sponsorship request not found"), { statusCode: 404 });
  }

  return processMarketplaceSponsorshipPayment({ sponsorshipId, transactionId });
};

export const processMarketplaceSponsorshipPayment = async ({ sponsorshipId, transactionId }) => {
  const verification = await verifyFlutterwavePayment(transactionId);
  const paymentData = verification.data || {};

  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const activated = await activateSponsorshipWithClient({
      client,
      sponsorshipId,
      transactionId,
      paymentData,
    });
    await client.query("COMMIT");

    sendAppNotification({
      userIds: [activated.seller_id],
      title: "Listing promoted",
      body: `${activated.listing_title || "Your listing"} is now sponsored until ${new Date(activated.expires_at).toLocaleDateString("en-NG")}.`,
      type: "marketplace_sponsorship",
      category: "Marketplace",
      url: `/view/listing/${activated.listing_id}`,
      data: { listingId: activated.listing_id, sponsorshipId: activated.id },
    }).catch((error) => console.warn("Sponsorship notification failed:", error.message));

    return mapSponsorship(activated);
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
  }
};

export const processMarketplaceSponsorshipWebhook = async (payload = {}) => {
  const data = payload.data || payload;
  const txRef = String(data.tx_ref || data.txRef || "").trim();
  const transactionId = data.id || data.transaction_id || data.transactionId;

  if (!txRef.startsWith(`${PAYMENT_PREFIX}-`) || !transactionId) {
    return { ignored: true };
  }

  const sponsorship = await query(
    "SELECT id FROM marketplace_sponsorships WHERE payment_reference = $1 LIMIT 1",
    [txRef]
  );
  if (!sponsorship.rowCount) {
    return { ignored: true };
  }

  return processMarketplaceSponsorshipPayment({
    sponsorshipId: sponsorship.rows[0].id,
    transactionId,
  });
};

export const listMarketplaceSponsorships = async ({ sellerId, status, listingId, admin = false } = {}) => {
  const clauses = [];
  const params = [];

  if (!admin) {
    params.push(sellerId);
    clauses.push(`ms.seller_id = $${params.length}`);
  }
  if (status) {
    params.push(status);
    clauses.push(`ms.status = $${params.length}`);
  }
  if (listingId) {
    params.push(listingId);
    clauses.push(`ms.listing_id = $${params.length}`);
  }

  const whereSql = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const result = await query(
    `SELECT ms.*, mi.title AS listing_title
     FROM marketplace_sponsorships ms
     LEFT JOIN marketplace_items mi ON mi.id = ms.listing_id
     ${whereSql}
     ORDER BY ms.created_at DESC
     LIMIT 200`,
    params
  );

  return result.rows.map(mapSponsorship);
};
