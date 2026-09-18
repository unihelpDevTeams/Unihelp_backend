import { db } from "../firebase/firebaseAdmin.js";
import { sendAppNotification } from "./notifications.js";

const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS || "onakomayaokiki@gmail.com,iadejuwon77@gmail.com")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
);

const findAdminUserIds = async () => {
  if (!db) return [];

  const adminIds = new Set();

  for (const email of ADMIN_EMAILS) {
    const snap = await db.collection("users").where("email", "==", email).limit(5).get();
    snap.forEach((doc) => adminIds.add(doc.id));
  }

  const adminSnap = await db.collection("users").where("admin", "==", true).limit(50).get();
  adminSnap.forEach((doc) => adminIds.add(doc.id));

  return [...adminIds];
};

const truncate = (value = "", max = 140) => {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max - 1)}...` : text;
};

export const notifyAdminsOfSupportItem = async ({
  kind,
  id,
  title,
  body,
  submitter,
} = {}) => {
  try {
    const userIds = await findAdminUserIds();
    if (!userIds.length) {
      console.warn("[support-admin-notify] No admin recipients found", { kind, id });
      return null;
    }

    const labels = {
      contact: "New contact message",
      report: "New user report",
      suggestion: "New suggestion",
    };

    return sendAppNotification({
      userIds,
      title: labels[kind] || "New support item",
      body: truncate(`${title || "Untitled"}${submitter ? ` from ${submitter}` : ""}${body ? `: ${body}` : ""}`),
      type: "admin_support",
      category: "Support",
      url: "/adminpanel/support-center",
      data: {
        supportKind: kind || "",
        supportId: id || "",
      },
    });
  } catch (error) {
    console.error("[support-admin-notify] Failed to notify admins", {
      kind,
      id,
      error: error?.message || error,
    });
    return null;
  }
};
