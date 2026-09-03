const attempts = new Map();

export const verificationRateLimit = (windowMs = 60_000, max = 10) => (req, res, next) => {
  const key = req.user?.uid || req.ip || "unknown";
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || now - current.startedAt >= windowMs) {
    attempts.set(key, { startedAt: now, count: 1 });
    return next();
  }
  if (current.count >= max) {
    return res.status(429).json({ success: false, error: "Too many verification attempts" });
  }
  current.count += 1;
  return next();
};