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

const marketplaceRoutes = express.Router();
const RESERVED = ["id", "title", "category", "price", "phone", "description", "images", "imageAssets", "userId", "ownerId", "sellerId", "createdAt", "updatedAt", "status", "verified", "premiumUser"];

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
  images: assets.map((asset) => asset.url),
  imageAssets: assets,
  createdAt: toIso(row.created_at),
  updatedAt: toIso(row.updated_at),
});

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
      clauses.push(`seller_id = $${params.length}`);
    }
    if (req.query.category) {
      params.push(`%${String(req.query.category).toLowerCase()}%`);
      clauses.push(`LOWER(category) LIKE $${params.length}`);
    }
    if (req.query.maxPrice) {
      params.push(parsePrice(req.query.maxPrice));
      clauses.push(`price <= $${params.length}`);
    }
    if (req.query.search) {
      params.push(String(req.query.search));
      clauses.push(`to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(category, '') || ' ' || coalesce(description, '')) @@ plainto_tsquery('simple', $${params.length})`);
    }

    const whereSql = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const countResult = await query(`SELECT COUNT(*)::int AS total FROM marketplace_items ${whereSql}`, params);
    params.push(limit, offset);
    const result = await query(`SELECT * FROM marketplace_items ${whereSql} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`, params);
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

marketplaceRoutes.get("/:id", async (req, res) => {
  try {
    const result = await query("SELECT * FROM marketplace_items WHERE id = $1", [req.params.id]);
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

marketplaceRoutes.delete("/:id", authenticateFirebaseUser, async (req, res) => {
  try {
    const existing = await query("SELECT seller_id FROM marketplace_items WHERE id = $1", [req.params.id]);
    if (!existing.rowCount) return res.status(404).json({ error: "Marketplace listing not found" });
    if (existing.rows[0].seller_id !== req.user.uid && req.user.admin !== true) {
      return res.status(403).json({ error: "You can only delete your own marketplace listings" });
    }
    await query("DELETE FROM feature_media WHERE entity_type = 'marketplace' AND entity_id = $1", [req.params.id]);
    await query("DELETE FROM marketplace_items WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting marketplace listing:", error);
    res.status(500).json({ error: "Failed to delete marketplace listing" });
  }
});

marketplaceRoutes.post("/clear-cache", (req, res) => res.json({ message: "PostgreSQL route does not use route cache" }));

export default marketplaceRoutes;
