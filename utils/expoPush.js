import { messaging } from '../firebase/firebaseAdmin.js';

const normalizeRecipient = (recipient) => {
  if (typeof recipient === 'string') {
    return {
      token: recipient,
      userId: null,
    };
  }

  if (recipient && typeof recipient === 'object') {
    return {
      token: recipient.token,
      userId: recipient.userId || null,
    };
  }

  return {
    token: null,
    userId: null,
  };
};

const normalizeFcmStringValue = (value) => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

export const sendNotification = async ({
  recipients = [],
  title,
  body,
  data = {},
  type = 'general',
  category = 'General',
  url = '/notifications',
  sound = 'default',
  priority = 'high',
}) => {
  if (!messaging) {
    console.warn('[push-debug] Firebase Admin messaging is unavailable; skipping FCM send.');
    return {
      success: false,
      sent: 0,
      recipients: 0,
      skipped: recipients.length,
      invalidTokens: [],
      invalidRecipients: [],
    };
  }

  const normalizedRecipients = recipients
    .map(normalizeRecipient)
    .filter((recipient) => typeof recipient.token === 'string' && recipient.token.trim().length > 0);

  const invalidTokens = recipients
    .map(normalizeRecipient)
    .filter((recipient) => recipient.token && recipient.token.trim().length === 0)
    .map((recipient) => recipient.token);

  if (normalizedRecipients.length === 0) {
    return {
      success: true,
      sent: 0,
      recipients: 0,
      skipped: recipients.length,
      invalidTokens,
      invalidRecipients: [],
    };
  }

  let sent = 0;
  const invalidRecipients = [];

  for (let index = 0; index < normalizedRecipients.length; index += 500) {
    const chunk = normalizedRecipients.slice(index, index + 500);
    const message = {
      notification: {
        title,
        body,
      },
      android: {
        priority: 'high',
        notification: {
          channelId: 'default',
          sound: 'default',
        },
      },
      data: Object.fromEntries(
        Object.entries({
          ...data,
          type,
          category,
          announcementId: data?.announcementId || '',
          url,
          title,
          body,
          message: body,
        }).map(([key, value]) => [key, normalizeFcmStringValue(value)])
      ),
      tokens: chunk.map((recipient) => recipient.token),
    };

    const response = await messaging.sendEachForMulticast(message);
    sent += response.successCount || 0;

    response.responses?.forEach((result, resultIndex) => {
      const recipient = chunk[resultIndex];
      if (!recipient || result?.success) {
        return;
      }

      const errorCode = result?.error?.code || '';
      const errorMessage = result?.error?.message || '';
      const invalidTokenError = /registration-token-not-registered|invalid-registration-token/i.test(`${errorCode} ${errorMessage}`);

      console.log('[push-debug] FCM send error:', {
        userId: recipient.userId,
        errorCode,
        errorMessage,
      });

      if (invalidTokenError) {
        invalidRecipients.push(recipient);
      }
    });
  }

  const uniqueInvalidRecipients = [
    ...new Map(invalidRecipients.map((recipient) => [recipient.token, recipient])).values(),
  ];

  return {
    success: true,
    sent,
    recipients: normalizedRecipients.length,
    invalidTokens: [...invalidTokens, ...uniqueInvalidRecipients.map((recipient) => recipient.token)],
    invalidRecipients: uniqueInvalidRecipients,
  };
};
