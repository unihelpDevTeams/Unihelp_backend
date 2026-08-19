import express from "express";
import { Readable } from "node:stream";
import { db } from "../firebase/firebaseAdmin.js";
import { authenticateFirebaseUser } from "../middleware/auth.js";
import formulas from "../data/formulas.js";
import challengeQuestions from "../data/challengeQuestions.js";

const offlineLibraryRoutes = express.Router();

const RESOURCE_COLLECTIONS = {
  note: "notes",
  notes: "notes",
  studyMaterial: "study_materials",
  studyMaterials: "study_materials",
  question: "questions",
  questions: "questions",
  pastQuestion: "questions",
  pastQuestions: "questions",
};

const toDate = (value) => {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const isPremiumProfileActive = (profile = {}) => {
  if (!profile?.premium) return false;
  if (String(profile.subscriptionStatus || "").toLowerCase() === "expired") return false;
  const expiry = toDate(profile.subscriptionExpiresAt || profile.premiumExpiresAt || profile.expiresAt);
  return !expiry || expiry.getTime() > Date.now();
};

const buildEntitlement = (uid, profile = {}) => {
  const expiresAt = toDate(profile.subscriptionExpiresAt || profile.premiumExpiresAt || profile.expiresAt);
  return {
    userId: uid,
    premium: isPremiumProfileActive(profile),
    expiresAt: expiresAt ? expiresAt.toISOString() : null,
    lastValidatedAt: new Date().toISOString(),
    version: 1,
    source: "users",
  };
};

const cleanResourceType = (value = "") => String(value || "").trim();

const normalizeFormulaId = (id) => {
  const numeric = Number(id);
  return Number.isFinite(numeric) ? numeric : String(id);
};

const findFormulaPayload = (resourceId) => {
  if (!resourceId || resourceId === "all") return formulas;
  const id = normalizeFormulaId(resourceId);
  return formulas.find((item) => item.id === id || String(item.id) === String(id)) || null;
};

const findChallengePayload = (resourceId) => {
  if (!resourceId || resourceId === "all") return challengeQuestions;
  const id = String(resourceId);
  const byId = challengeQuestions.find((item) => String(item.id) === id);
  if (byId) return byId;
  const byCategory = challengeQuestions.filter((item) => String(item.category) === id);
  return byCategory.length ? byCategory : null;
};

const getProtectedDocumentUrl = (resource = {}) => {
  const firstFile = Array.isArray(resource.files) ? resource.files[0] : resource.files;
  return [
    resource.fileUrl,
    resource.pdfUrl,
    resource.downloadUrl,
    resource.url,
    resource.fileAsset?.url,
    resource.fileAsset?.secure_url,
    firstFile?.url,
    firstFile?.secure_url,
  ].find((value) => typeof value === "string" && /^https?:\/\//i.test(value));
};

const readResource = async ({ resourceType, resourceId }) => {
  const type = cleanResourceType(resourceType);

  if (["formula", "formulas", "flashcards"].includes(type)) {
    return { resourceType: "formulas", contentKind: "structured", data: findFormulaPayload(resourceId) };
  }

  if (["challenge", "challenges"].includes(type)) {
    return { resourceType: "challenge", contentKind: "structured", data: findChallengePayload(resourceId) };
  }

  const collectionName = RESOURCE_COLLECTIONS[type];
  if (!collectionName || !resourceId) return null;

  const snap = await db.collection(collectionName).doc(String(resourceId)).get();
  if (!snap.exists) return null;

  return {
    resourceType: collectionName === "questions" ? "pastQuestions" : "notes",
    contentKind: "document",
    data: { id: snap.id, ...snap.data() },
  };
};

offlineLibraryRoutes.use(authenticateFirebaseUser);

offlineLibraryRoutes.get("/entitlement", async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: "Firebase Admin is not configured" });
    }

    const userSnap = await db.collection("users").doc(req.user.uid).get();
    const profile = userSnap.exists ? userSnap.data() : {};
    return res.json({ success: true, entitlement: buildEntitlement(req.user.uid, profile) });
  } catch (error) {
    console.error("[offline-library] entitlement failed", error);
    return res.status(500).json({ success: false, error: "Could not validate entitlement" });
  }
});

offlineLibraryRoutes.post("/authorize", async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ success: false, error: "Firebase Admin is not configured" });
    }

    const { resourceType, resourceId } = req.body || {};
    const userSnap = await db.collection("users").doc(req.user.uid).get();
    const profile = userSnap.exists ? userSnap.data() : {};
    const entitlement = buildEntitlement(req.user.uid, profile);

    if (!entitlement.premium) {
      return res.status(403).json({
        success: false,
        error: "Offline Library is available with UniHelp Premium.",
        entitlement,
      });
    }

    const resolved = await readResource({ resourceType, resourceId });
    if (!resolved?.data) {
      return res.status(404).json({ success: false, error: "Resource not found", entitlement });
    }

    const resource = resolved.data;
    const premiumRequired = resource.premiumRequired !== false;
    const offlineAllowed = resource.offlineAllowed !== false;

    if (!offlineAllowed || (!premiumRequired && req.body?.premiumOnly === true)) {
      return res.status(403).json({ success: false, error: "This resource is not eligible for offline saving.", entitlement });
    }

    return res.json({
      success: true,
      entitlement,
      resource: {
        id: String(resource.id || resourceId || resolved.resourceType),
        type: resolved.resourceType,
        title: resource.title || resource.name || resource.subject || "UniHelp resource",
        contentVersion: String(resource.contentVersion || resource.version || resource.updatedAt?._seconds || resource.updatedAt || resource.createdAt?._seconds || "1"),
        contentKind: resolved.contentKind,
        premiumRequired,
        offlineAllowed,
        payload: resolved.contentKind === "structured" ? resource : null,
        metadata: resolved.contentKind === "document" ? resource : null,
        // The client receives an authenticated proxy, never the Cloudinary URL.
        contentUrl: resolved.contentKind === "document"
          ? `/api/offline-library/content/${encodeURIComponent(cleanResourceType(resourceType))}/${encodeURIComponent(resourceId)}`
          : null,
      },
    });
  } catch (error) {
    console.error("[offline-library] authorize failed", error);
    return res.status(500).json({ success: false, error: "Could not authorize offline resource" });
  }
});

offlineLibraryRoutes.get("/content/:resourceType/:resourceId", async (req, res) => {
  try {
    if (!db) return res.status(503).json({ success: false, error: "Firebase Admin is not configured" });

    const userSnap = await db.collection("users").doc(req.user.uid).get();
    const entitlement = buildEntitlement(req.user.uid, userSnap.exists ? userSnap.data() : {});
    if (!entitlement.premium) return res.status(403).json({ success: false, error: "Offline access requires active Premium." });

    const resolved = await readResource({ resourceType: req.params.resourceType, resourceId: req.params.resourceId });
    const remoteUrl = getProtectedDocumentUrl(resolved?.data);
    if (resolved?.contentKind !== "document" || !remoteUrl) {
      return res.status(404).json({ success: false, error: "Protected document not found" });
    }

    const upstream = await fetch(remoteUrl);
    if (!upstream.ok || !upstream.body) {
      return res.status(502).json({ success: false, error: "Protected document could not be retrieved" });
    }

    res.status(200);
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/pdf");
    if (upstream.headers.get("content-length")) res.setHeader("Content-Length", upstream.headers.get("content-length"));
    Readable.fromWeb(upstream.body).pipe(res);
  } catch (error) {
    console.error("[offline-library] protected content failed", error);
    return res.status(500).json({ success: false, error: "Could not retrieve protected document" });
  }
});

offlineLibraryRoutes.post("/sync", async (req, res) => {
  try {
    const { id, type, action, payload } = req.body || {};
    if (!id || !type) return res.status(400).json({ success: false, error: "Missing sync item fields" });

    await db
      .collection("users")
      .doc(req.user.uid)
      .collection("offlineSync")
      .doc(String(id))
      .set({
        type,
        action: action || "update",
        payload: payload || {},
        syncedAt: new Date(),
      }, { merge: true });

    return res.json({ success: true, id });
  } catch (error) {
    console.error("[offline-library] sync failed", error);
    return res.status(500).json({ success: false, error: "Could not sync offline action" });
  }
});

export default offlineLibraryRoutes;
