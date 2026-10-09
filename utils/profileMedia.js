const CLOUDINARY_HOST_PATTERN = /cloudinary\.com/i;

export const isCloudinaryUrl = (value = '') => {
  if (typeof value !== 'string') return false;
  return CLOUDINARY_HOST_PATTERN.test(value.trim());
};

export const normalizeProfileMediaValue = (value) => {
  if (typeof value !== 'string') return value ?? null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return isCloudinaryUrl(trimmed) ? null : trimmed;
};

export const normalizeProfileAsset = (asset) => {
  if (!asset || typeof asset !== 'object') return asset ?? null;
  const nextAsset = { ...asset };
  if (typeof nextAsset.url === 'string' && isCloudinaryUrl(nextAsset.url)) {
    return null;
  }
  if (typeof nextAsset.secure_url === 'string' && isCloudinaryUrl(nextAsset.secure_url)) {
    return null;
  }
  if (typeof nextAsset.fileUrl === 'string' && isCloudinaryUrl(nextAsset.fileUrl)) {
    return null;
  }
  return nextAsset;
};
