import crypto from "crypto";
import express from "express";
import { getPool, query } from "../db/pool.js";
import { authenticateFirebaseUser } from "../middleware/auth.js";
import {
  cleanString,
  mapMediaRows,
  normalizeAssets,
  parsePositiveInt,
  parsePrice,
  pickExtra,
  replaceMedia,
  toIso,
} from "../utils/apiHelpers.js";
import { deleteCloudinaryAssets } from "../utils/cloudinaryCleanup.js";

const marketplaceRoutes = express.Router();
const RESERVED = ["id", "title", "category", "price", "phone", "description", "images", "imageAssets", "userId", "ownerId", "sellerId", "createdAt", "updatedAt", "status", "verified", "premiumUser"];

const isActiveSponsored = (row = {}) => Boolean(row.is_sponsored && row.sponsored_until && new Date(row.sponsored_until).getTime() > Date.now());

const requireAdmin = (req, res) => {
  if (req.user?.admin === true) return true;
  res.status(403).json({ error: "Admin access required" });
  return false;
};

const assertCloudinaryCleanupComplete = (cloudinaryResults = []) => {
  const incomplete = cloudinaryResults.filter((item) => item.skipped || item.success === false);
  if (!incomplete.length) return;

  const reasons = incomplete
    .map((item) => item.reason || item.error || item.publicId || "unknown")
    .filter(Boolean)
    .join(", ");

  throw new Error(`Cloudinary cleanup incomplete: ${reasons}`);
};

const mapItem = (row, assets = []) => ({
  id: row.id,
  ...(row.extra || {}),
  title: row.title,
  category: row.category,
  price: row.price === null ? "" : Number(row.price),
  phone: row.phone,
  description: row.description,
  userId: row.seller_id,
  ownerId: row.seller_id,
  sellerId: row.seller_id,
  status: row.status,
  verified: row.verified,
  premiumUser: row.premium_user,
  isSponsored: isActiveSponsored(row),
  sponsoredUntil: toIso(row.sponsored_until),
  sponsoredPriority: row.sponsored_priority || 0,
  sponsoredStatus: row.sponsored_status || "inactive",
  ratingAverage: row.rating_average === null || row.rating_average === undefined ? null : Number(row.rating_average),
  reviewCount: Number(row.review_count || 0),
  sellerRatingAverage: row.seller_rating_average === null || row.seller_rating_average === undefined ? null : Number(row.seller_rating_average),
  sellerReviewCount: Number(row.seller_review_count || 0),
  images: assets.map((asset) => asset.url),
  imageAssets: assets,
  createdAt: toIso(row.created_at),
  updatedAt: toIso(row.updated_at),
});

const listingSelect = `
  SELECT mi.*,
    COALESCE(ROUND(AVG(mr.rating)::numeric, 1), NULL) AS rating_average,
    COUNT(mr.id)::int AS review_count,
    seller_stats.seller_rating_average,
    COALESCE(seller_stats.seller_review_count, 0)::int AS seller_review_count
  FROM marketplace_items mi
  LEFT JOIN marketplace_reviews mr ON mr.listing_id = mi.id AND mr.hidden = FALSE
  LEFT JOIN LATERAL (
    SELECT ROUND(AVG(sr.rating)::numeric, 1) AS seller_rating_average, COUNT(sr.id)::int AS seller_review_count
    FROM marketplace_reviews sr
    WHERE sr.seller_id = mi.seller_id AND sr.hidden = FALSE
  ) seller_stats ON TRUE
`;

const listingGroupBy = "GROUP BY mi.id, seller_stats.seller_rating_average, seller_stats.seller_review_count";

const validateItem = (payload = {}, partial = false) => {
  const next = {
    title: cleanString(payload.title),
    category: cleanString(payload.category),
    price: parsePrice(payload.price),
    phone: cleanString(payload.phone),
    description: cleanString(payload.description),
    status: cleanString(payload.status, "pending") || "pending",
    verified: Boolean(payload.verified),
    premiumUser: Boolean(payload.premiumUser),
  };
  if (!partial && (!next.title || !next.category || !next.phone)) {
    return { error: "title, category and phone are required" };
  }
  return { value: next };
};

marketplaceRoutes.get("/", async (req, res) => {
  try {
    const page = parsePositiveInt(req.query.page, 1, 10000);
    const limit = parsePositiveInt(req.query.limit, 20, 100);
    const offset = (page - 1) * limit;
    const clauses = [];
    const params = [];

    if (req.query.ownerId || req.query.userId || req.query.sellerId) {
      params.push(String(req.query.ownerId || req.query.userId || req.query.sellerId));
      clauses.push(`mi.seller_id = $${params.length}`);
    }
    if (req.query.category) {
      params.push(`%${String(req.query.category).toLowerCase()}%`);
      clauses.push(`LOWER(mi.category) LIKE $${params.length}`);
    }
    if (req.query.maxPrice) {
      params.push(parsePrice(req.query.maxPrice));
      clauses.push(`mi.price <= $${params.length}`);
    }
    if (req.query.minPrice) {
      params.push(parsePrice(req.query.minPrice));
      clauses.push(`mi.price >= $${params.length}`);
    }
    if (req.query.search) {
      params.push(String(req.query.search));
      clauses.push(`to_tsvector('simple', coalesce(mi.title, '') || ' ' || coalesce(mi.category, '') || ' ' || coalesce(mi.description, '') || ' ' || coalesce(mi.extra->>'location', '')) @@ plainto_tsquery('simple', $${params.length})`);
    }
    if (req.query.sponsored === "active") {
      clauses.push("mi.is_sponsored = TRUE AND mi.sponsored_until > NOW()");
    }

    const whereSql = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const countResult = await query(`SELECT COUNT(*)::int AS total FROM marketplace_items mi ${whereSql}`, params);
    params.push(limit, offset);
    const sort = String(req.query.sort || "newest");
    const orderSql = sort === "price_asc"
      ? "ORDER BY mi.price ASC NULLS LAST, mi.created_at DESC"
      : sort === "price_desc"
        ? "ORDER BY mi.price DESC NULLS LAST, mi.created_at DESC"
        : sort === "rating_desc"
          ? "ORDER BY review_count DESC, rating_average DESC NULLS LAST, mi.created_at DESC"
          : "ORDER BY (mi.is_sponsored = TRUE AND mi.sponsored_until > NOW()) DESC, mi.sponsored_priority DESC, mi.created_at DESC";
    const result = await query(`${listingSelect} ${whereSql} ${listingGroupBy} ${orderSql} LIMIT $${params.length - 1} OFFSET $${params.length}`, params);
    const ids = result.rows.map((row) => row.id);
    const media = ids.length ? await query("SELECT * FROM feature_media WHERE entity_type = 'marketplace' AND entity_id = ANY($1) ORDER BY position ASC", [ids]) : { rows: [] };
    const grouped = mapMediaRows(media.rows);
    const items = result.rows.map((row) => mapItem(row, grouped.get(row.id) || []));
    res.json({ items, page, limit, total: countResult.rows[0]?.total || 0, hasMore: offset + items.length < (countResult.rows[0]?.total || 0) });
  } catch (error) {
    console.error("Error fetching marketplace listings:", error);
    res.status(500).json({ error: "Failed to fetch marketplace listings" });
  }
});

marketplaceRoutes.get("/admin/sponsored", authenticateFirebaseUser, async (req, res) => {
  if (!requireAdmin(req, res)) return;
  try {
    const result = await query(
      `${listingSelect}
       WHERE mi.is_sponsored = TRUE OR mi.sponsored_until IS NOT NULL
       ${listingGroupBy}
       ORDER BY is_sponsored DESC, sponsored_until DESC NULLS LAST, sponsored_priority DESC, created_at DESC`
    );
    const ids = result.rows.map((row) => row.id);
    const media = ids.length ? await query("SELECT * FROM feature_media WHERE entity_type = 'marketplace' AND entity_id = ANY($1) ORDER BY position ASC", [ids]) : { rows: [] };
    const grouped = mapMediaRows(media.rows);
    res.json({ items: result.rows.map((row) => mapItem(row, grouped.get(row.id) || [])) });
  } catch (error) {
    console.error("Error fetching sponsored marketplace listings:", error);
    res.status(500).json({ error: "Failed to fetch sponsored listings" });
  }
});

marketplaceRoutes.get("/:id", async (req, res) => {
  try {
    const result = await query(`${listingSelect} WHERE mi.id = $1 ${listingGroupBy}`, [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ error: "Marketplace listing not found" });
    const media = await query("SELECT * FROM feature_media WHERE entity_type = 'marketplace' AND entity_id = $1 ORDER BY position ASC", [req.params.id]);
    res.json(mapItem(result.rows[0], mapMediaRows(media.rows).get(req.params.id) || []));
  } catch (error) {
    console.error("Error fetching marketplace listing:", error);
    res.status(500).json({ error: "Failed to fetch marketplace listing" });
  }
});

marketplaceRoutes.post("/", authenticateFirebaseUser, async (req, res) => {
  const client = await getPool().connect();
  try {
    const { value, error } = validateItem(req.body);
    if (error) return res.status(400).json({ error });
    const id = req.body.id || crypto.randomUUID();
    const assets = normalizeAssets(req.body);

    await client.query("BEGIN");
    const result = await client.query(
      `INSERT INTO marketplace_items (id, seller_id, title, category, price, phone, description, status, verified, premium_user, extra)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [id, req.user.uid, value.title, value.category, value.price, value.phone, value.description, value.status, value.verified, value.premiumUser, pickExtra(req.body, RESERVED)]
    );
    await replaceMedia(client, "marketplace", id, assets);
    await client.query("COMMIT");
    res.status(201).json(mapItem(result.rows[0], assets.map((asset) => ({ url: asset.secureUrl, publicId: asset.publicId, resourceType: asset.resourceType }))));
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("Error creating marketplace listing:", error);
    res.status(500).json({ error: "Failed to create marketplace listing" });
  } finally {
    client.release();
  }
});

marketplaceRoutes.put("/:id", authenticateFirebaseUser, async (req, res) => {
  const client = await getPool().connect();
  try {
    const existing = await client.query("SELECT * FROM marketplace_items WHERE id = $1", [req.params.id]);
    if (!existing.rowCount) return res.status(404).json({ error: "Marketplace listing not found" });
    if (existing.rows[0].seller_id !== req.user.uid && req.user.admin !== true) {
      return res.status(403).json({ error: "You can only edit your own marketplace listings" });
    }
    const merged = {
      title: req.body.title ?? existing.rows[0].title,
      category: req.body.category ?? existing.rows[0].category,
      price: req.body.price ?? existing.rows[0].price,
      phone: req.body.phone ?? existing.rows[0].phone,
      description: req.body.description ?? existing.rows[0].description,
      status: req.body.status ?? existing.rows[0].status,
      verified: req.body.verified ?? existing.rows[0].verified,
      premiumUser: req.body.premiumUser ?? existing.rows[0].premium_user,
    };
    const { value } = validateItem(merged, true);

    await client.query("BEGIN");
    const result = await client.query(
      `UPDATE marketplace_items SET title=$2, category=$3, price=$4, phone=$5, description=$6, status=$7, verified=$8, premium_user=$9, extra=extra || $10::jsonb, updated_at=NOW()
       WHERE id=$1 RETURNING *`,
      [req.params.id, value.title, value.category, value.price, value.phone, value.description, value.status, value.verified, value.premiumUser, pickExtra(req.body, RESERVED)]
    );
    if (req.body.images || req.body.imageAssets) await replaceMedia(client, "marketplace", req.params.id, normalizeAssets(req.body));
    await client.query("COMMIT");
    const media = await query("SELECT * FROM feature_media WHERE entity_type = 'marketplace' AND entity_id = $1 ORDER BY position ASC", [req.params.id]);
    res.json(mapItem(result.rows[0], mapMediaRows(media.rows).get(req.params.id) || []));
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("Error updating marketplace listing:", error);
    res.status(500).json({ error: "Failed to update marketplace listing" });
  } finally {
    client.release();
  }
});

const mapReview = (row = {}) => ({
  id: row.id,
  listingId: row.listing_id,
  reviewerId: row.reviewer_id,
  reviewerName: row.reviewer_name,
  reviewerAvatar: row.reviewer_avatar,
  sellerId: row.seller_id,
  rating: Number(row.rating),
  comment: row.comment || "",
  hidden: Boolean(row.hidden),
  createdAt: toIso(row.created_at),
  updatedAt: toIso(row.updated_at),
});

marketplaceRoutes.get("/:id/reviews", async (req, res) => {
  try {
    const page = parsePositiveInt(req.query.page, 1, 10000);
    const limit = parsePositiveInt(req.query.limit, 10, 50);
    const offset = (page - 1) * limit;
    const params = [req.params.id];
    const includeHidden = req.query.includeHidden === "true";
    const hiddenSql = includeHidden ? "" : "AND hidden = FALSE";
    const countResult = await query(`SELECT COUNT(*)::int AS total FROM marketplace_reviews WHERE listing_id = $1 ${hiddenSql}`, params);
    params.push(limit, offset);
    const result = await query(
      `SELECT * FROM marketplace_reviews WHERE listing_id = $1 ${hiddenSql} ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      params
    );
    const total = countResult.rows[0]?.total || 0;
    res.json({ items: result.rows.map(mapReview), page, limit, total, hasMore: offset + result.rows.length < total });
  } catch (error) {
    console.error("Error fetching marketplace reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

marketplaceRoutes.post("/:id/reviews", authenticateFirebaseUser, async (req, res) => {
  try {
    const listing = await query("SELECT id, seller_id FROM marketplace_items WHERE id = $1", [req.params.id]);
    if (!listing.rowCount) return res.status(404).json({ error: "Marketplace listing not found" });
    const rating = Number(req.body.rating);
    const comment = cleanString(req.body.comment);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ error: "rating must be an integer from 1 to 5" });
    if (!comment) return res.status(400).json({ error: "comment is required" });
    if (listing.rows[0].seller_id === req.user.uid) return res.status(400).json({ error: "You cannot review your own listing" });
    const reviewerName = cleanString(req.body.reviewerName, req.user.name || req.user.email || "UniHelp student");
    const reviewerAvatar = cleanString(req.body.reviewerAvatar, req.user.picture || "");
    const result = await query(
      `INSERT INTO marketplace_reviews (id, listing_id, reviewer_id, reviewer_name, reviewer_avatar, seller_id, rating, comment)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (listing_id, reviewer_id)
       DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment, reviewer_name = EXCLUDED.reviewer_name, reviewer_avatar = EXCLUDED.reviewer_avatar, hidden = FALSE, updated_at = NOW()
       RETURNING *`,
      [crypto.randomUUID(), req.params.id, req.user.uid, reviewerName, reviewerAvatar, listing.rows[0].seller_id, rating, comment]
    );
    res.status(201).json(mapReview(result.rows[0]));
  } catch (error) {
    console.error("Error saving marketplace review:", error);
    res.status(500).json({ error: "Failed to save review" });
  }
});

marketplaceRoutes.patch("/:id/reviews/:reviewId", authenticateFirebaseUser, async (req, res) => {
  try {
    const existing = await query("SELECT * FROM marketplace_reviews WHERE id = $1 AND listing_id = $2", [req.params.reviewId, req.params.id]);
    if (!existing.rowCount) return res.status(404).json({ error: "Review not found" });
    const review = existing.rows[0];
    const isOwner = review.reviewer_id === req.user.uid;
    if (!isOwner && req.user.admin !== true) return res.status(403).json({ error: "You can only edit your own review" });

    const rating = req.body.rating === undefined ? review.rating : Number(req.body.rating);
    const comment = req.body.comment === undefined ? review.comment : cleanString(req.body.comment);
    const hidden = req.body.hidden === undefined ? review.hidden : Boolean(req.body.hidden);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ error: "rating must be an integer from 1 to 5" });
    if (!comment) return res.status(400).json({ error: "comment is required" });
    if (hidden !== review.hidden && req.user.admin !== true) return res.status(403).json({ error: "Only admins can hide reviews" });

    const result = await query(
      "UPDATE marketplace_reviews SET rating=$3, comment=$4, hidden=$5, updated_at=NOW() WHERE id=$1 AND listing_id=$2 RETURNING *",
      [req.params.reviewId, req.params.id, rating, comment, hidden]
    );
    res.json(mapReview(result.rows[0]));
  } catch (error) {
    console.error("Error updating marketplace review:", error);
    res.status(500).json({ error: "Failed to update review" });
  }
});

marketplaceRoutes.delete("/:id/reviews/:reviewId", authenticateFirebaseUser, async (req, res) => {
  try {
    const existing = await query("SELECT * FROM marketplace_reviews WHERE id = $1 AND listing_id = $2", [req.params.reviewId, req.params.id]);
    if (!existing.rowCount) return res.status(404).json({ error: "Review not found" });
    if (existing.rows[0].reviewer_id !== req.user.uid && req.user.admin !== true) {
      return res.status(403).json({ error: "You can only delete your own review" });
    }
    await query("DELETE FROM marketplace_reviews WHERE id = $1 AND listing_id = $2", [req.params.reviewId, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting marketplace review:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

marketplaceRoutes.post("/:id/sponsor", authenticateFirebaseUser, async (req, res) => {
  if (!requireAdmin(req, res)) return;
  try {
    const days = parsePositiveInt(req.body.days, 7, 365);
    const priority = parsePositiveInt(req.body.priority, 1, 100);
    const until = req.body.sponsoredUntil ? new Date(req.body.sponsoredUntil) : new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    if (Number.isNaN(until.getTime())) return res.status(400).json({ error: "Invalid sponsoredUntil date" });
    const result = await query(
      "UPDATE marketplace_items SET is_sponsored=TRUE, sponsored_until=$2, sponsored_priority=$3, sponsored_status='active', updated_at=NOW() WHERE id=$1 RETURNING *",
      [req.params.id, until.toISOString(), priority]
    );
    if (!result.rowCount) return res.status(404).json({ error: "Marketplace listing not found" });
    res.json(mapItem(result.rows[0], []));
  } catch (error) {
    console.error("Error sponsoring marketplace listing:", error);
    res.status(500).json({ error: "Failed to sponsor listing" });
  }
});

marketplaceRoutes.delete("/:id/sponsor", authenticateFirebaseUser, async (req, res) => {
  if (!requireAdmin(req, res)) return;
  try {
    const result = await query(
      "UPDATE marketplace_items SET is_sponsored=FALSE, sponsored_until=NULL, sponsored_priority=0, sponsored_status='inactive', updated_at=NOW() WHERE id=$1 RETURNING *",
      [req.params.id]
    );
    if (!result.rowCount) return res.status(404).json({ error: "Marketplace listing not found" });
    res.json(mapItem(result.rows[0], []));
  } catch (error) {
    console.error("Error removing marketplace sponsorship:", error);
    res.status(500).json({ error: "Failed to remove sponsorship" });
  }
});

marketplaceRoutes.delete("/:id", authenticateFirebaseUser, async (req, res) => {
  try {
    const existing = await query("SELECT seller_id FROM marketplace_items WHERE id = $1", [req.params.id]);
    if (!existing.rowCount) return res.status(404).json({ error: "Marketplace listing not found" });
    if (existing.rows[0].seller_id !== req.user.uid && req.user.admin !== true) {
      return res.status(403).json({ error: "You can only delete your own marketplace listings" });
    }

    const mediaRows = await query(
      "SELECT secure_url, public_id, resource_type FROM feature_media WHERE entity_type = 'marketplace' AND entity_id = $1",
      [req.params.id]
    );

    const assets = mediaRows.rows
      .filter((row) => row.secure_url || row.public_id)
      .map((row) => ({
        url: row.secure_url || "",
        publicId: row.public_id || "",
        resourceType: row.resource_type || "image",
      }))
      .filter((asset) => asset.url || asset.publicId);

    if (assets.length) {
      const cloudinaryResults = await deleteCloudinaryAssets(assets);
      assertCloudinaryCleanupComplete(cloudinaryResults);
    }

    await query("DELETE FROM feature_media WHERE entity_type = 'marketplace' AND entity_id = $1", [req.params.id]);
    await query("DELETE FROM marketplace_items WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting marketplace listing:", error);
    res.status(500).json({ error: error.message || "Failed to delete marketplace listing" });
  }
});

marketplaceRoutes.post("/clear-cache", (req, res) => res.json({ message: "PostgreSQL route does not use route cache" }));

export default marketplaceRoutes;
