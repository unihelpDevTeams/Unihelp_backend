import { randomBytes } from "node:crypto";
import { admin, db } from "../firebase/firebaseAdmin.js";
import { isPremiumEntitled, getTrustedEntitlementProfile } from "./entitlementService.js";

export const STICKER_LIMITS = {
  maxStorageBytes: Number(process.env.STICKER_MAX_STORAGE_BYTES || 100 * 1024 * 1024),
  maxPacks: Number(process.env.STICKER_MAX_PACKS || 10),
  maxStickers: Number(process.env.STICKER_MAX_STICKERS || 300),
  maxAnimated: Number(process.env.STICKER_MAX_ANIMATED || 30),
  maxImageBytes: Number(process.env.STICKER_MAX_IMAGE_BYTES || 10 * 1024 * 1024),
  maxVideoBytes: Number(process.env.STICKER_MAX_VIDEO_BYTES || 25 * 1024 * 1024),
  maxVideoSeconds: Number(process.env.STICKER_MAX_VIDEO_SECONDS || 10),
};

const stickerCollection = () => db.collection("stickers");
const packCollection = () => db.collection("stickerPacks");
const userRef = (uid) => db.collection("users").doc(uid);
const cleanText = (value, max) => String(value || "").trim().slice(0, max);

const toPublicSticker = (snapshot) => {
  const item = snapshot.data ? snapshot.data() : snapshot;
  return {
    id: snapshot.id || item.id,
    packId: item.packId || null,
    ownerId: item.ownerId || null,
    name: item.name || "Sticker",
    type: item.type || "image",
    assetUrl: item.assetUrl || "",
    thumbnailUrl: item.thumbnailUrl || item.assetUrl || "",
    width: Number(item.width || 0),
    height: Number(item.height || 0),
    duration: Number(item.duration || 0),
    isAnimated: Boolean(item.isAnimated),
    isPremium: Boolean(item.isPremium),
    isActive: item.isActive !== false,
    createdAt: item.createdAt || null,
  };
};

const visibleSticker = (sticker, uid, premium) =>
  sticker.isActive !== false &&
  ((sticker.ownerId === uid) || (!sticker.ownerId && (!sticker.isPremium || premium)));

export const listStickerPacks = async (uid) => {
  const profile = await getTrustedEntitlementProfile(uid);
  const snapshot = await packCollection().where("isActive", "==", true).orderBy("order", "asc").limit(100).get();
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .filter((pack) => pack.ownerId === uid || (!pack.ownerId && (!pack.isPremium || isPremiumEntitled(profile))));
};

export const listStickers = async (uid, { packId, search, recent = false, favorites = false } = {}) => {
  const profile = await getTrustedEntitlementProfile(uid);
  const premium = isPremiumEntitled(profile);
  let snapshots;

  if (recent || favorites) {
    const subcollection = recent ? "stickerRecent" : "stickerFavorites";
    const refs = await userRef(uid).collection(subcollection).orderBy("updatedAt", "desc").limit(50).get();
    const stickerIds = refs.docs.map((item) => item.id);
    if (!stickerIds.length) return [];
    snapshots = await Promise.all(stickerIds.map((id) => stickerCollection().doc(id).get()));
  } else {
    const [official, custom] = await Promise.all([
      stickerCollection().where("ownerId", "==", null).where("isActive", "==", true).limit(300).get(),
      stickerCollection().where("ownerId", "==", uid).where("isActive", "==", true).limit(STICKER_LIMITS.maxStickers).get(),
    ]);
    snapshots = [...official.docs, ...custom.docs];
  }

  return snapshots
    .filter((item) => item.exists)
    .map(toPublicSticker)
    .filter((sticker) => (!packId || sticker.packId === packId) && visibleSticker(sticker, uid, premium))
    .filter((sticker) => !search || sticker.name.toLowerCase().includes(String(search).toLowerCase()))
    .slice(0, 300);
};

export const getStickerUpload = async (uid, uploadId) => {
  const ref = db.collection("stickerUploads").doc(uploadId);
  const snapshot = await ref.get();
  if (!snapshot.exists || snapshot.data().ownerId !== uid || snapshot.data().used) throw new Error("Sticker upload is no longer available");
  return { ref, data: snapshot.data() };
};

export const createSticker = async (uid, payload = {}) => {
  const profile = await getTrustedEntitlementProfile(uid);
  if (!isPremiumEntitled(profile)) throw new Error("Custom stickers are available for Premium members only");
  const idempotencyKey = cleanText(payload.idempotencyKey, 100);
  if (!idempotencyKey) throw new Error("idempotencyKey is required");
  const safeIdempotencyKey = idempotencyKey.replace(/[^a-zA-Z0-9_-]/g, "");
  if (!safeIdempotencyKey) throw new Error("Invalid idempotency key");
  const operationRef = userRef(uid).collection("stickerOperations").doc(safeIdempotencyKey);
  const uploadRef = db.collection("stickerUploads").doc(String(payload.uploadId || ""));

  const stickerRef = stickerCollection().doc();
  const result = await db.runTransaction(async (transaction) => {
    const [userSnapshot, operationSnapshot, uploadSnapshot] = await Promise.all([
      transaction.get(userRef(uid)),
      transaction.get(operationRef),
      transaction.get(uploadRef),
    ]);
    if (operationSnapshot.exists) return operationSnapshot.data().sticker;
    if (!uploadSnapshot.exists || uploadSnapshot.data().ownerId !== uid) throw new Error("Sticker upload is no longer available");
    if (uploadSnapshot.data().used) throw new Error("Sticker upload is already attached to another sticker");
    const user = userSnapshot.exists ? userSnapshot.data() : {};
    const currentBytes = Number(user.stickerStorageBytes || 0);
    const currentCount = Number(user.customStickerCount || 0);
    const animatedCount = Number(user.animatedStickerCount || 0);
    if (currentBytes + Number(upload.bytes || 0) > STICKER_LIMITS.maxStorageBytes) throw new Error("Sticker storage limit reached");
    if (currentCount >= STICKER_LIMITS.maxStickers) throw new Error("Sticker limit reached");
    if (upload.isAnimated && animatedCount >= STICKER_LIMITS.maxAnimated) throw new Error("Animated sticker limit reached");

    const sticker = {
      id: stickerRef.id,
      packId: payload.packId || null,
      ownerId: uid,
      name: cleanText(payload.name, 80) || "My Sticker",
      type: upload.type,
      assetUrl: upload.assetUrl,
      thumbnailUrl: upload.thumbnailUrl || upload.assetUrl,
      cloudinaryPublicId: upload.cloudinaryPublicId,
      width: upload.width || 0,
      height: upload.height || 0,
      fileSize: Number(upload.bytes || 0),
      duration: Number(upload.duration || 0),
      isAnimated: Boolean(upload.isAnimated),
      isPremium: true,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    transaction.set(stickerRef, sticker);
    transaction.set(uploadRef, { used: true, usedAt: admin.firestore.FieldValue.serverTimestamp(), stickerId: stickerRef.id }, { merge: true });
    transaction.set(userRef(uid), {
      stickerStorageBytes: currentBytes + Number(upload.bytes || 0),
      customStickerCount: currentCount + 1,
      animatedStickerCount: animatedCount + (upload.isAnimated ? 1 : 0),
    }, { merge: true });
    const publicSticker = { ...sticker, id: stickerRef.id };
    transaction.set(operationRef, { sticker: publicSticker, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    return publicSticker;
  });
  return toPublicSticker(result);
};

export const recordStickerUse = async (uid, stickerId) => {
  const snapshot = await stickerCollection().doc(stickerId).get();
  if (!snapshot.exists) throw new Error("Sticker not found");
  const sticker = snapshot.data();
  const profile = await getTrustedEntitlementProfile(uid);
  if (!visibleSticker(sticker, uid, isPremiumEntitled(profile))) throw new Error("You cannot use this sticker");
  await userRef(uid).collection("stickerRecent").doc(stickerId).set({ stickerId, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  const recent = await userRef(uid).collection("stickerRecent").orderBy("updatedAt", "desc").limit(51).get();
  if (recent.size > 50) await recent.docs[50].ref.delete();
  return toPublicSticker({ id: stickerId, data: () => sticker });
};

export const toggleStickerFavorite = async (uid, stickerId, favorite) => {
  const sticker = await stickerCollection().doc(stickerId).get();
  if (!sticker.exists) throw new Error("Sticker not found");
  const profile = await getTrustedEntitlementProfile(uid);
  if (!visibleSticker(sticker.data(), uid, isPremiumEntitled(profile))) throw new Error("You cannot favorite this sticker");
  const ref = userRef(uid).collection("stickerFavorites").doc(stickerId);
  if (favorite) await ref.set({ stickerId, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  else await ref.delete();
  return { favorite };
};

export const getStickerStorage = async (uid) => {
  const snapshot = await userRef(uid).get();
  const data = snapshot.exists ? snapshot.data() : {};
  return { usedBytes: Number(data.stickerStorageBytes || 0), limitBytes: STICKER_LIMITS.maxStorageBytes, stickerCount: Number(data.customStickerCount || 0), animatedCount: Number(data.animatedStickerCount || 0) };
};

export const createStickerPack = async (uid, payload = {}) => {
  const profile = await getTrustedEntitlementProfile(uid);
  if (!isPremiumEntitled(profile)) throw new Error("Custom sticker packs are available for Premium members only");
  const packRef = packCollection().doc();
  const user = await userRef(uid).get();
  if (Number(user.data()?.customStickerPackCount || 0) >= STICKER_LIMITS.maxPacks) throw new Error("Sticker pack limit reached");
  const pack = { id: packRef.id, ownerId: uid, name: cleanText(payload.name, 60) || "My Stickers", description: cleanText(payload.description, 180), isPremium: true, isActive: true, stickerIds: [], createdAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp() };
  const batch = db.batch();
  batch.set(packRef, pack);
  batch.set(userRef(uid), { customStickerPackCount: admin.firestore.FieldValue.increment(1) }, { merge: true });
  await batch.commit();
  return { ...pack, id: packRef.id };
};

export const createOfficialPack = async (payload = {}, adminUid) => {
  const packRef = packCollection().doc();
  const pack = { id: packRef.id, ownerId: null, name: cleanText(payload.name, 60) || "UniHelp Stickers", description: cleanText(payload.description, 180), category: cleanText(payload.category, 40) || "Reactions", coverStickerId: payload.coverStickerId || null, isPremium: Boolean(payload.isPremium), isActive: payload.isActive !== false, order: Number(payload.order || 0), createdBy: adminUid, createdAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp() };
  await packRef.set(pack);
  return { ...pack, id: packRef.id };
};

export const createOfficialSticker = async (adminUid, payload = {}) => {
  const { ref: uploadRef, data: upload } = await getStickerUpload(adminUid, payload.uploadId);
  const stickerRef = stickerCollection().doc();
  const sticker = { id: stickerRef.id, packId: payload.packId || null, ownerId: null, name: cleanText(payload.name, 80) || "UniHelp Sticker", type: upload.type, assetUrl: upload.assetUrl, thumbnailUrl: upload.thumbnailUrl || upload.assetUrl, cloudinaryPublicId: upload.cloudinaryPublicId, width: upload.width || 0, height: upload.height || 0, fileSize: Number(upload.bytes || 0), duration: Number(upload.duration || 0), isAnimated: Boolean(upload.isAnimated), isPremium: Boolean(payload.isPremium), isActive: true, createdBy: adminUid, createdAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp() };
  const batch = db.batch();
  batch.set(stickerRef, sticker);
  batch.set(uploadRef, { used: true, usedAt: admin.firestore.FieldValue.serverTimestamp(), stickerId: stickerRef.id }, { merge: true });
  await batch.commit();
  return toPublicSticker({ id: stickerRef.id, data: () => sticker });
};

export const updateStickerPack = async (uid, packId, payload = {}) => {
  const ref = packCollection().doc(packId);
  const snapshot = await ref.get();
  if (!snapshot.exists || snapshot.data().ownerId !== uid) throw new Error("Sticker pack not found");
  const updates = {
    ...(payload.name !== undefined ? { name: cleanText(payload.name, 60) || "My Stickers" } : {}),
    ...(payload.description !== undefined ? { description: cleanText(payload.description, 180) } : {}),
    ...(Array.isArray(payload.stickerIds) ? { stickerIds: payload.stickerIds.slice(0, 30) } : {}),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  await ref.update(updates);
  return { id: packId, ...snapshot.data(), ...updates };
};

export const deleteStickerPack = async (uid, packId) => {
  const ref = packCollection().doc(packId);
  const snapshot = await ref.get();
  if (!snapshot.exists || snapshot.data().ownerId !== uid) throw new Error("Sticker pack not found");
  const batch = db.batch();
  batch.delete(ref);
  batch.set(userRef(uid), { customStickerPackCount: admin.firestore.FieldValue.increment(-1) }, { merge: true });
  await batch.commit();
  return { id: packId, deleted: true };
};

export const deleteSticker = async (uid, stickerId) => {
  const ref = stickerCollection().doc(stickerId);
  const snapshot = await ref.get();
  if (!snapshot.exists || snapshot.data().ownerId !== uid || snapshot.data().isActive === false) throw new Error("Sticker not found");
  await ref.update({ isActive: false, deletedAt: admin.firestore.FieldValue.serverTimestamp(), deletedBy: uid });
  await userRef(uid).set({ stickerStorageBytes: admin.firestore.FieldValue.increment(-Number(snapshot.data().fileSize || 0)), customStickerCount: admin.firestore.FieldValue.increment(-1), animatedStickerCount: admin.firestore.FieldValue.increment(snapshot.data().isAnimated ? -1 : 0) }, { merge: true });
  return { id: stickerId, deleted: true };
};

export const getOwnedSticker = async (uid, stickerId) => {
  const snapshot = await stickerCollection().doc(stickerId).get();
  if (!snapshot.exists || snapshot.data().ownerId !== uid || snapshot.data().isActive === false) throw new Error("Sticker not found");
  const profile = await getTrustedEntitlementProfile(uid);
  if (!isPremiumEntitled(profile)) throw new Error("Custom sticker enhancements are available for Premium members only");
  return { id: snapshot.id, ...snapshot.data() };
};

export const updateStickerAsset = async (uid, stickerId, assetUrl) => {
  const ref = stickerCollection().doc(stickerId);
  await ref.update({ assetUrl, thumbnailUrl: assetUrl, backgroundRemoved: true, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  return { id: stickerId, assetUrl, thumbnailUrl: assetUrl, backgroundRemoved: true };
};

export const createUploadRecord = async (uid, uploadResult) => {
  const ref = db.collection("stickerUploads").doc(randomBytes(12).toString("hex"));
  await ref.set({ ...uploadResult, ownerId: uid, used: false, createdAt: admin.firestore.FieldValue.serverTimestamp() });
  return { uploadId: ref.id, ...uploadResult };
};

export const isStickerAccessible = async (uid, stickerId) => {
  const snapshot = await stickerCollection().doc(stickerId).get();
  if (!snapshot.exists) return null;
  const profile = await getTrustedEntitlementProfile(uid);
  const sticker = snapshot.data();
  if (!visibleSticker(sticker, uid, isPremiumEntitled(profile))) return null;
  return { id: snapshot.id, ...sticker };
};
