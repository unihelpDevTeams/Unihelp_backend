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

const hostelsRoutes = express.Router();
const RESERVED = ["id", "title", "location", "price", "phone", "description", "images", "imageAssets", "userId", "ownerId", "createdAt", "updatedAt", "status", "verified", "premiumUser"];

const assertCloudinaryCleanupComplete = (cloudinaryResults = []) => {
  const incomplete = cloudinaryResults.filter((item) => item.skipped || item.success === false);
  if (!incomplete.length) return;

  const reasons = incomplete
    .map((item) => item.reason || item.error || item.publicId || "unknown")
    .filter(Boolean)
    .join(", ");

  throw new Error(`Cloudinary cleanup incomplete: ${reasons}`);
};

const mapHostel = (row, assets = []) => ({
  id: row.id,
  ...(row.extra || {}),
  title: row.title,
  location: row.location,
  price: row.price === null ? "" : Number(row.price),
  phone: row.phone,
  description: row.description,
  userId: row.owner_id,
  ownerId: row.owner_id,
  status: row.status,
  verified: row.verified,
  premiumUser: row.premium_user,
  images: assets.map((asset) => asset.url),
  imageAssets: assets,
  createdAt: toIso(row.created_at),
  updatedAt: toIso(row.updated_at),
});

const validateHostel = (payload = {}, partial = false) => {
  const next = {
    title: cleanString(payload.title),
    location: cleanString(payload.location),
    price: parsePrice(payload.price),
    phone: cleanString(payload.phone),
    description: cleanString(payload.description),
    status: cleanString(payload.status, "pending") || "pending",
    verified: Boolean(payload.verified),
    premiumUser: Boolean(payload.premiumUser),
  };

  if (!partial && (!next.title || !next.location || !next.phone)) {
    return { error: "title, location and phone are required" };
  }

  return { value: next };
};

hostelsRoutes.get("/", async (req, res) => {
  try {
    const page = parsePositiveInt(req.query.page, 1, 10000);
    const limit = parsePositiveInt(req.query.limit, 20, 100);
    const offset = (page - 1) * limit;
    const clauses = [];
    const params = [];

    if (req.query.ownerId || req.query.userId) {
      params.push(String(req.query.ownerId || req.query.userId));
      clauses.push(`owner_id = $${params.length}`);
    }
    if (req.query.location) {
      params.push(`%${String(req.query.location).toLowerCase()}%`);
      clauses.push(`LOWER(location) LIKE $${params.length}`);
    }
    if (req.query.maxPrice) {
      params.push(parsePrice(req.query.maxPrice));
      clauses.push(`price <= $${params.length}`);
    }
    if (req.query.search) {
      params.push(String(req.query.search));
      clauses.push(`to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(location, '') || ' ' || coalesce(description, '')) @@ plainto_tsquery('simple', $${params.length})`);
    }

    const whereSql = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const countResult = await query(`SELECT COUNT(*)::int AS total FROM hostels ${whereSql}`, params);
    params.push(limit, offset);
    const result = await query(
      `SELECT * FROM hostels ${whereSql} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    const ids = result.rows.map((row) => row.id);
    const media = ids.length
      ? await query("SELECT * FROM feature_media WHERE entity_type = 'hostel' AND entity_id = ANY($1) ORDER BY position ASC", [ids])
      : { rows: [] };
    const grouped = mapMediaRows(media.rows);
    const items = result.rows.map((row) => mapHostel(row, grouped.get(row.id) || []));

    res.json({ items, page, limit, total: countResult.rows[0]?.total || 0, hasMore: offset + items.length < (countResult.rows[0]?.total || 0) });
  } catch (error) {
    console.error("Error fetching hostels:", error);
    res.status(500).json({ error: "Failed to fetch hostels" });
  }
});

hostelsRoutes.get("/:id", async (req, res) => {
  try {
    const result = await query("SELECT * FROM hostels WHERE id = $1", [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ error: "Hostel not found" });
    const media = await query("SELECT * FROM feature_media WHERE entity_type = 'hostel' AND entity_id = $1 ORDER BY position ASC", [req.params.id]);
    res.json(mapHostel(result.rows[0], mapMediaRows(media.rows).get(req.params.id) || []));
  } catch (error) {
    console.error("Error fetching hostel:", error);
    res.status(500).json({ error: "Failed to fetch hostel" });
  }
});

hostelsRoutes.post("/", authenticateFirebaseUser, async (req, res) => {
  const client = await getPool().connect();
  try {
    const { value, error } = validateHostel(req.body);
    if (error) return res.status(400).json({ error });
    const id = req.body.id || crypto.randomUUID();
    const assets = normalizeAssets(req.body);

    await client.query("BEGIN");
    const result = await client.query(
      `INSERT INTO hostels (id, owner_id, title, location, price, phone, description, status, verified, premium_user, extra)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [id, req.user.uid, value.title, value.location, value.price, value.phone, value.description, value.status, value.verified, value.premiumUser, pickExtra(req.body, RESERVED)]
    );
    await replaceMedia(client, "hostel", id, assets);
    await client.query("COMMIT");
    res.status(201).json(mapHostel(result.rows[0], assets.map((asset) => ({ url: asset.secureUrl, publicId: asset.publicId, resourceType: asset.resourceType }))));
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("Error creating hostel:", error);
    res.status(500).json({ error: "Failed to create hostel" });
  } finally {
    client.release();
  }
});

hostelsRoutes.put("/:id", authenticateFirebaseUser, async (req, res) => {
  const client = await getPool().connect();
  try {
    const existing = await client.query("SELECT * FROM hostels WHERE id = $1", [req.params.id]);
    if (!existing.rowCount) return res.status(404).json({ error: "Hostel not found" });
    if (existing.rows[0].owner_id !== req.user.uid && req.user.admin !== true) {
      return res.status(403).json({ error: "You can only edit your own hostel listings" });
    }

    const merged = {
      title: req.body.title ?? existing.rows[0].title,
      location: req.body.location ?? existing.rows[0].location,
      price: req.body.price ?? existing.rows[0].price,
      phone: req.body.phone ?? existing.rows[0].phone,
      description: req.body.description ?? existing.rows[0].description,
      status: req.body.status ?? existing.rows[0].status,
      verified: req.body.verified ?? existing.rows[0].verified,
      premiumUser: req.body.premiumUser ?? existing.rows[0].premium_user,
    };
    const { value } = validateHostel(merged, true);

    await client.query("BEGIN");
    const result = await client.query(
      `UPDATE hostels SET title=$2, location=$3, price=$4, phone=$5, description=$6, status=$7, verified=$8, premium_user=$9, extra=extra || $10::jsonb, updated_at=NOW()
       WHERE id=$1 RETURNING *`,
      [req.params.id, value.title, value.location, value.price, value.phone, value.description, value.status, value.verified, value.premiumUser, pickExtra(req.body, RESERVED)]
    );
    if (req.body.images || req.body.imageAssets) await replaceMedia(client, "hostel", req.params.id, normalizeAssets(req.body));
    await client.query("COMMIT");
    const media = await query("SELECT * FROM feature_media WHERE entity_type = 'hostel' AND entity_id = $1 ORDER BY position ASC", [req.params.id]);
    res.json(mapHostel(result.rows[0], mapMediaRows(media.rows).get(req.params.id) || []));
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("Error updating hostel:", error);
    res.status(500).json({ error: "Failed to update hostel" });
  } finally {
    client.release();
  }
});

hostelsRoutes.delete("/:id", authenticateFirebaseUser, async (req, res) => {
  try {
    const existing = await query("SELECT owner_id FROM hostels WHERE id = $1", [req.params.id]);
    if (!existing.rowCount) return res.status(404).json({ error: "Hostel not found" });
    if (existing.rows[0].owner_id !== req.user.uid && req.user.admin !== true) {
      return res.status(403).json({ error: "You can only delete your own hostel listings" });
    }

    const mediaRows = await query(
      "SELECT secure_url, public_id, resource_type FROM feature_media WHERE entity_type = 'hostel' AND entity_id = $1",
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

    await query("DELETE FROM feature_media WHERE entity_type = 'hostel' AND entity_id = $1", [req.params.id]);
    await query("DELETE FROM hostels WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting hostel:", error);
    res.status(500).json({ error: error.message || "Failed to delete hostel" });
  }
});

hostelsRoutes.post("/clear-cache", (req, res) => res.json({ message: "PostgreSQL route does not use route cache" }));

export default hostelsRoutes;
