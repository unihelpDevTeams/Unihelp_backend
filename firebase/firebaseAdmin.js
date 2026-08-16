import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

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

const firebasePrivateKey =
  looksLikePemKey(rawPrivateKey)
    ? rawPrivateKey.trim().replace(/^['"]|['"]$/g, "").replace(/\\n/g, "\n").replace(/\r\n/g, "\n")
    : null;

let firebaseCredential = null;

if (firebaseServiceAccount && looksLikePemKey(firebaseServiceAccount.private_key)) {
  firebaseCredential = admin.credential.cert({
    ...firebaseServiceAccount,
    private_key: firebaseServiceAccount.private_key.trim().replace(/^['"]|['"]$/g, "").replace(/\\n/g, "\n").replace(/\r\n/g, "\n"),
  });
} else if (firebaseProjectId && firebaseClientEmail && firebasePrivateKey) {
  firebaseCredential = admin.credential.cert({
    projectId: firebaseProjectId,
    clientEmail: firebaseClientEmail,
    privateKey: firebasePrivateKey,
  });
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT) {
  firebaseCredential = admin.credential.applicationDefault();
} else {
  console.warn("Firebase Admin SDK is not configured. Set a valid service account or GOOGLE_APPLICATION_CREDENTIALS to enable Firebase access.");
}

if (firebaseCredential) {
  admin.initializeApp({
    credential: firebaseCredential,
  });
}

const db = firebaseCredential ? admin.firestore() : null;
const messaging = firebaseCredential ? admin.messaging() : null;

export { admin, db, messaging };
