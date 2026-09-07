import { admin } from "../firebase/firebaseAdmin.js";

const ADMIN_EMAILS = new Set([
  "onakomayaokiki@gmail.com",
  "iadejuwon77@gmail.com",
]);

export const authenticateFirebaseUser = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    if (!token) {
      console.warn("[auth] Missing bearer token", {
        method: req.method,
        path: req.originalUrl,
      });
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    req.user = await admin.auth().verifyIdToken(token);
    if (ADMIN_EMAILS.has(String(req.user.email || "").trim().toLowerCase())) {
      req.user.admin = true;
    }
    next();
  } catch (error) {
    console.error("[auth] Failed to verify Firebase token", error);
    res.status(401).json({ success: false, error: "Invalid authentication token" });
  }
};
