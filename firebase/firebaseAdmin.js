import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const normalizePrivateKey = (value) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().replace(/^['"]|['"]$/g, "");
  const withNewlines = trimmed.replace(/\\n/g, "\n").replace(/\r\n/g, "\n");
  return withNewlines;
};

const looksLikeServiceAccountJson = (value) =>
  typeof value === "string" &&
  value.trim().startsWith("{") &&
  value.includes('"private_key"') &&
  value.includes('"client_email"');

const parseJsonEnv = (value) => {
  if (!value) return null;
  const trimmed = value.trim().replace(/^['"]|['"]$/g, "");

  try {
    return JSON.parse(trimmed);
  } catch (error) {
    console.warn("Invalid FIREBASE_SERVICE_ACCOUNT JSON; falling back to other credential sources.", error.message);
    return null;
  }
};

const looksLikePemKey = (value) =>
  typeof value === "string" &&
  value.includes("BEGIN PRIVATE KEY") &&
  value.includes("END PRIVATE KEY");

const buildServiceAccountCert = (serviceAccount = {}) => {
  if (!serviceAccount || !serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
    return null;
  }

  const normalizedKey = normalizePrivateKey(serviceAccount.private_key);
  if (!looksLikePemKey(normalizedKey)) {
    return null;
  }

  return admin.credential.cert({
    ...serviceAccount,
    project_id: serviceAccount.project_id,
    client_email: serviceAccount.client_email,
    private_key: normalizedKey,
  });
};

const firebaseServiceAccount = parseJsonEnv(process.env.FIREBASE_SERVICE_ACCOUNT);
const firebaseProjectId =
  process.env.FIREBASE_PROJECT_ID ||
  firebaseServiceAccount?.project_id ||
  process.env.GCLOUD_PROJECT ||
  process.env.GCP_PROJECT;

const firebaseClientEmail =
  process.env.FIREBASE_CLIENT_EMAIL ||
  firebaseServiceAccount?.client_email ||
  process.env.GOOGLE_CLIENT_EMAIL;

const rawPrivateKey =
  process.env.FIREBASE_PRIVATE_KEY ||
  firebaseServiceAccount?.private_key ||
  process.env.GOOGLE_PRIVATE_KEY;

const firebasePrivateKey = looksLikeServiceAccountJson(rawPrivateKey)
  ? (() => {
      console.warn("[firebaseAdmin] FIREBASE_PRIVATE_KEY looks like a full service-account JSON object. Use FIREBASE_SERVICE_ACCOUNT instead.");
      return null;
    })()
  : (looksLikePemKey(normalizePrivateKey(rawPrivateKey)) ? normalizePrivateKey(rawPrivateKey) : null);

let firebaseCredential = null;

if (firebaseServiceAccount) {
  firebaseCredential = buildServiceAccountCert(firebaseServiceAccount);
}

if (!firebaseCredential && firebaseProjectId && firebaseClientEmail && firebasePrivateKey) {
  firebaseCredential = admin.credential.cert({
    projectId: firebaseProjectId,
    clientEmail: firebaseClientEmail,
    privateKey: firebasePrivateKey,
  });
}

if (!firebaseCredential && (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT)) {
  firebaseCredential = admin.credential.applicationDefault();
}

if (!firebaseCredential) {
  console.warn("Firebase Admin SDK is not configured. Set a valid service account or GOOGLE_APPLICATION_CREDENTIALS to enable Firebase access.");
} else {
  try {
    admin.initializeApp({
      credential: firebaseCredential,
      projectId: firebaseProjectId || undefined,
    });
    console.log("[firebaseAdmin] Firebase Admin initialized successfully.");
  } catch (error) {
    console.error("[firebaseAdmin] Failed to initialize Firebase Admin SDK.", error?.message || error);
  }
}

const db = firebaseCredential ? admin.firestore() : null;
const messaging = firebaseCredential ? admin.messaging() : null;

export { admin, db, messaging };
