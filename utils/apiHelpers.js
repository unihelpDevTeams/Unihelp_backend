export const toIso = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  return value;
};

export const parsePositiveInt = (value, fallback, max = 100) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
};

export const cleanString = (value, fallback = "") =>
  typeof value === "string" ? value.trim() : fallback;

export const parsePrice = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
};

export const pickExtra = (payload = {}, reserved = []) => {
  const blocked = new Set(reserved);
  return Object.fromEntries(Object.entries(payload).filter(([key]) => !blocked.has(key)));
};

export const normalizeAssets = ({ images, imageAssets, coverAsset, coverImage } = {}) => {
  if (Array.isArray(imageAssets) && imageAssets.length) {
    return imageAssets
      .map((asset, index) => ({
        secureUrl: asset?.url || asset?.secure_url || images?.[index] || "",
        publicId: asset?.publicId || asset?.public_id || "",
        resourceType: asset?.resourceType || asset?.resource_type || "image",
        position: index,
      }))
      .filter((asset) => asset.secureUrl);
  }

  if (Array.isArray(images)) {
    return images
      .map((url, index) => ({
        secureUrl: typeof url === "string" ? url : url?.url || url?.secure_url || "",
        publicId: typeof url === "object" ? url?.publicId || url?.public_id || "" : "",
        resourceType: typeof url === "object" ? url?.resourceType || url?.resource_type || "image" : "image",
        position: index,
      }))
      .filter((asset) => asset.secureUrl);
  }

  if (coverAsset || coverImage) {
    const asset = coverAsset || {};
    const secureUrl = asset.url || asset.secure_url || coverImage || "";
    return secureUrl
      ? [{
          secureUrl,
          publicId: asset.publicId || asset.public_id || "",
          resourceType: asset.resourceType || asset.resource_type || "image",
          position: 0,
        }]
      : [];
  }

  return [];
};

export const replaceMedia = async (client, entityType, entityId, assets = []) => {
  await client.query("DELETE FROM feature_media WHERE entity_type = $1 AND entity_id = $2", [entityType, entityId]);
  for (const asset of assets) {
    await client.query(
      `INSERT INTO feature_media (entity_type, entity_id, secure_url, public_id, resource_type, position)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [entityType, entityId, asset.secureUrl, asset.publicId || null, asset.resourceType || "image", asset.position || 0]
    );
  }
};

export const mapMediaRows = (rows = []) => {
  const grouped = new Map();
  for (const row of rows) {
    if (!grouped.has(row.entity_id)) grouped.set(row.entity_id, []);
    grouped.get(row.entity_id).push({
      url: row.secure_url,
      publicId: row.public_id || "",
      resourceType: row.resource_type || "image",
    });
  }
  return grouped;
};
