const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const DEFAULT_MEDIA_RETENTION_CONFIG = {
  retentionDays: 7,
  maxUndeliveredDays: 30,
};

export const parsePositiveInt = (value, fallback = DEFAULT_MEDIA_RETENTION_CONFIG.retentionDays) => {
  const next = Number(value ?? fallback);
  if (!Number.isFinite(next) || next <= 0) return fallback;
  return next;
};

export const getMediaRetentionConfig = (overrides = {}) => ({
  retentionDays: parsePositiveInt(overrides.retentionDays ?? process.env.MEDIA_RETENTION_DAYS, DEFAULT_MEDIA_RETENTION_CONFIG.retentionDays),
  maxUndeliveredDays: parsePositiveInt(
    overrides.maxUndeliveredDays ?? process.env.MEDIA_MAX_UNDELIVERED_DAYS,
    DEFAULT_MEDIA_RETENTION_CONFIG.maxUndeliveredDays,
  ),
});

export const getAttachmentRecipientSet = (attachment = {}, message = {}, conversationMembers = []) => {
  const attachmentDownloaded = Array.isArray(attachment?.downloadedBy)
    ? attachment.downloadedBy
    : Array.isArray(message?.mediaState?.downloadedBy)
      ? message.mediaState.downloadedBy
      : [];

  const finalRecipients = Array.isArray(message?.mediaState?.finalRecipients)
    ? message.mediaState.finalRecipients
    : Array.isArray(conversationMembers)
      ? conversationMembers.filter((memberId) => memberId && memberId !== message?.senderId)
      : [];

  return {
    downloadedBy: [...new Set(attachmentDownloaded.filter(Boolean))],
    finalRecipients: [...new Set(finalRecipients.filter(Boolean))],
  };
};

export const evaluateMediaRetention = ({
  attachment = {},
  recipientIds = [],
  message = {},
  now = Date.now(),
} = {}) => {
  if (!attachment || !attachment.url) {
    return { shouldDelete: false, reason: 'missing-attachment', eligibleAt: null, pendingRecipients: [] };
  }

  const config = getMediaRetentionConfig({
    retentionDays: attachment.retentionDays ?? message?.mediaState?.retentionDays,
    maxUndeliveredDays: attachment.maxUndeliveredDays ?? message?.mediaState?.maxUndeliveredDays,
  });

  const createdSource = attachment.createdAt || message?.createdAt || new Date(now).toISOString();
  const createdAtMs = new Date(createdSource).getTime();
  const effectiveRecipients = Array.isArray(recipientIds) && recipientIds.length
    ? recipientIds
    : getAttachmentRecipientSet(attachment, message, []).finalRecipients;

  const finalRecipients = [...new Set((effectiveRecipients || []).filter(Boolean))];
  const downloadedBy = [...new Set((attachment?.downloadedBy || message?.mediaState?.downloadedBy || []).filter(Boolean))];
  const pendingRecipients = finalRecipients.filter((recipientId) => !downloadedBy.includes(recipientId));
  const retentionDeadline = createdAtMs + config.retentionDays * DAY_IN_MS;
  const maxUndeliveredDeadline = createdAtMs + config.maxUndeliveredDays * DAY_IN_MS;

  if (pendingRecipients.length > 0) {
    if (now >= maxUndeliveredDeadline) {
      return {
        shouldDelete: true,
        reason: 'max-undelivered-retention-exceeded',
        eligibleAt: new Date(maxUndeliveredDeadline).toISOString(),
        pendingRecipients,
        finalRecipients,
      };
    }

    return {
      shouldDelete: false,
      reason: 'awaiting-recipient-download',
      eligibleAt: new Date(maxUndeliveredDeadline).toISOString(),
      pendingRecipients,
      finalRecipients,
    };
  }

  if (now >= retentionDeadline) {
    return {
      shouldDelete: true,
      reason: 'retention-window-exceeded',
      eligibleAt: new Date(retentionDeadline).toISOString(),
      pendingRecipients,
      finalRecipients,
    };
  }

  return {
    shouldDelete: false,
    reason: 'retention-window-open',
    eligibleAt: new Date(retentionDeadline).toISOString(),
    pendingRecipients,
    finalRecipients,
  };
};
