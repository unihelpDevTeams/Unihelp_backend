import express from "express";

import { admin, db } from "../firebase/firebaseAdmin.js";
import { authenticateFirebaseUser } from "../middleware/auth.js";
import { getPool } from "../db/pool.js";

const router = express.Router();
const CONFIRMATION = "DELETE EVERYTHING";
const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS || "onakomayaokiki@gmail.com,iadejuwon77@gmail.com")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
);

const requireAdmin = async (req, res, next) => {
  if (req.user?.admin || ADMIN_EMAILS.has(String(req.user?.email || "").trim().toLowerCase())) {
    return next();
  }

  if (!db) return res.status(503).json({ success: false, error: "Firebase admin is unavailable" });
  const profile = await db.collection("users").doc(req.user.uid).get();
  if (profile.exists && profile.data()?.admin === true) return next();
  return res.status(403).json({ success: false, error: "Admin access required" });
};

const quoteIdentifier = (value) => `"${String(value).replaceAll('"', '""')}"`;

const wipePostgres = async () => {
  const pool = getPool();
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'"
    );
    const tables = result.rows.map((row) => row.tablename).filter(Boolean);
    if (tables.length) {
      await client.query(
        `TRUNCATE TABLE ${tables.map(quoteIdentifier).join(", ")} RESTART IDENTITY CASCADE`
      );
    }
    return tables.length;
  } finally {
    client.release();
  }
};

const wipeFirestore = async () => {
  if (!db) throw new Error("Firebase admin is unavailable");
  const collections = await db.listCollections();
  await Promise.all(collections.map((collection) => db.recursiveDelete(collection)));
  return collections.length;
};

const wipeAuthUsers = async () => {
  let pageToken;
  let deletedUsers = 0;

  do {
    const page = await admin.auth().listUsers(1000, pageToken);
    if (page.users.length) {
      const result = await admin.auth().deleteUsers(page.users.map((user) => user.uid));
      deletedUsers += result.successCount;
      if (result.failureCount) {
        throw new Error(`Firebase deleted ${result.successCount} users but failed to delete ${result.failureCount}`);
      }
    }
    pageToken = page.pageToken;
  } while (pageToken);

  return deletedUsers;
};

router.post("/", authenticateFirebaseUser, requireAdmin, async (req, res) => {
  if (process.env.NODE_ENV !== "development" || process.env.ENABLE_DATABASE_WIPE !== "true") {
    return res.status(403).json({
      success: false,
      error: "Database wipe is disabled. Set NODE_ENV=development and ENABLE_DATABASE_WIPE=true on the backend first.",
    });
  }

  if (req.body?.confirmation !== CONFIRMATION) {
    return res.status(400).json({ success: false, error: `Type ${CONFIRMATION} exactly to continue` });
  }

  try {
    const [firestoreCollections, postgresTables, authUsers] = await Promise.all([
      wipeFirestore(),
      wipePostgres(),
      wipeAuthUsers(),
    ]);

    return res.json({
      success: true,
      data: { firestoreCollections, postgresTables, authUsers },
    });
  } catch (error) {
    console.error("[database-wipe] failed", error);
    return res.status(500).json({ success: false, error: error.message || "Database wipe failed" });
  }
});

export default router;
