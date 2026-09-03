const parseProductIds = (value, fallback) => {
  const ids = String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return ids.length ? ids : fallback;
};

export const GOOGLE_PLAY_PACKAGE_NAME =
  process.env.GOOGLE_PLAY_PACKAGE_NAME || "com.zenithdev.unihelp";

export const GOOGLE_PLAY_PRODUCTS = parseProductIds(
  process.env.GOOGLE_PLAY_SUBSCRIPTION_PRODUCT_IDS,
  ["unihelp_premium_monthly", "unihelp_premium_yearly"]
);

export const isGooglePlayProduct = (productId) =>
  GOOGLE_PLAY_PRODUCTS.includes(String(productId || ""));

export const getGooglePlayBilling = (productId) =>
  String(productId || "").includes("year") ? "yearly" : "monthly";