import { db } from '../firebase/firebaseAdmin.js';
import { deleteFileFromR2, extractR2KeyFromUrl } from './storage/r2.js';
import { evaluateMediaRetention, getMediaRetentionConfig } from './mediaRetention.js';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const normalizeTimestamp = (value) => {
  if (!value) return 0;
  if (typeof value.toDate === 'function') return value.toDate().getTime();
  if (typeof value === 'string') return new Date(value).getTime();
  if (typeof value === 'number') return value;
  return 0;
};

const collectAttachmentCandidates = async (limit = 200) => {
  const config = getMediaRetentionConfig();
  const cutoff = Date.now() - Math.max(config.retentionDays, config.maxUndeliveredDays) * DAY_IN_MS;
  const conversationsSnap = await db.collection('conversations').get();

  const candidates = [];
  for (const conversationDoc of conversationsSnap.docs) {
    const messagesSnap = await conversationDoc.ref.collection('messages')
      .where('createdAt', '<=', new Date(cutoff))
      .limit(limit)
      .get();

    for (const messageDoc of messagesSnap.docs) {
      const data = messageDoc.data();
      const attachments = Array.isArray(data.attachments) ? data.attachments : [];
      for (const attachment of attachments) {
        if (!attachment || !attachment.url) continue;
        const createdAt = normalizeTimestamp(data.createdAt || attachment.createdAt);
        const shouldConsider = createdAt && createdAt <= cutoff;
        if (!shouldConsider) continue;

        candidates.push({
          conversationId: conversationDoc.id,
          messageId: messageDoc.id,
          messageRef: messageDoc.ref,
          attachment,
          message: data,
          recipientIds: (conversationDoc.data()?.memberIds || []).filter((memberId) => memberId && memberId !== data.senderId),
        });
      }
    }
  }

  return candidates;
};

export const cleanupExpiredMediaAttachments = async ({ dryRun = false, limit = 100 } = {}) => {
  if (!db) {
    return { scanned: 0, deleted: 0, skipped: 0, dryRun, reason: 'firebase-unavailable' };
  }

  const candidates = await collectAttachmentCandidates(limit);
  let deleted = 0;
  let skipped = 0;

  for (const candidate of candidates) {
    const decision = evaluateMediaRetention({
      attachment: candidate.attachment,
      recipientIds: candidate.recipientIds,
      message: candidate.message,
      now: Date.now(),
    });

    if (!decision.shouldDelete) {
      skipped += 1;
      continue;
    }

    if (dryRun) {
      deleted += 1;
      continue;
    }

    try {
      const key = extractR2KeyFromUrl(candidate.attachment.url);
      if (key) {
        const removed = await deleteFileFromR2(key);
        if (!removed) {
          await candidate.messageRef.update({
            mediaState: {
              ...(candidate.message.mediaState || {}),
              status: 'failed',
              cleanupStatus: 'failed',
              cleanupError: 'r2-delete-failed',
            },
          });
          skipped += 1;
          continue;
        }
      }

      const attachments = (candidate.message.attachments || []).map((entry) => {
        if (entry?.id !== candidate.attachment.id && entry?.publicId !== candidate.attachment.publicId) return entry;
        return {
          ...entry,
          mediaStatus: 'deleted',
          deliveryStatus: 'deleted',
          deletedAt: new Date().toISOString(),
          expired: true,
        };
      });

      await candidate.messageRef.update({
        attachments,
        mediaState: {
          ...(candidate.message.mediaState || {}),
          status: 'deleted',
          cleanupStatus: 'deleted',
          cleanupDeletedAt: new Date().toISOString(),
          retentionDecision: decision.reason,
        },
      });
      deleted += 1;
    } catch (error) {
      console.error('[media-retention-cleanup] failed', candidate.messageId, error);
      skipped += 1;
    }
  }

  return { scanned: candidates.length, deleted, skipped, dryRun };
};
