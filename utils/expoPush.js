import { Expo } from 'expo-server-sdk';

const expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
});

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
  ttlSeconds = 300,
  badge = 0,
}) => {
  const normalizedRecipients = recipients.map(normalizeRecipient);
  const validRecipients = normalizedRecipients.filter((recipient) => (
    typeof recipient.token === 'string' && Expo.isExpoPushToken(recipient.token)
  ));
  const invalidTokens = normalizedRecipients
    .filter((recipient) => recipient.token && !Expo.isExpoPushToken(recipient.token))
    .map((recipient) => recipient.token);

  if (invalidTokens.length > 0) {
    console.log('[push-debug] Skipping invalid Expo push tokens:', {
      count: invalidTokens.length,
    });
  }

  if (validRecipients.length === 0) {
    return {
      success: true,
      sent: 0,
      recipients: 0,
      skipped: recipients.length,
      tickets: [],
      receipts: {},
      invalidTokens,
      invalidRecipients: [],
    };
  }

  const chunks = [];
  for (let index = 0; index < validRecipients.length; index += 100) {
    chunks.push(validRecipients.slice(index, index + 100));
  }

  const tickets = [];
  const receiptIdToRecipient = new Map();
  const invalidRecipients = [];

  for (const chunk of chunks) {
    const messages = chunk.map((recipient) => ({
      to: recipient.token,
      sound,
      title,
      body,
      data: {
        ...data,
        type,
        category,
        url,
        title,
        body,
        message: body,
      },
      priority,
      ttl: ttlSeconds,
      badge,
      channelId: 'default',
    }));

    const chunkTickets = await expo.sendPushNotificationsAsync(messages);
    tickets.push(...chunkTickets);

    chunkTickets.forEach((ticket, index) => {
      const recipient = chunk[index];

      if (ticket.status === 'ok' && ticket.id) {
        receiptIdToRecipient.set(ticket.id, recipient);
        return;
      }

      console.log('[push-debug] Expo push ticket error:', {
        status: ticket.status,
        error: ticket.details?.error,
        message: ticket.message,
        userId: recipient?.userId,
      });

      if (ticket.details?.error === 'DeviceNotRegistered') {
        invalidRecipients.push(recipient);
      }
    });
  }

  const receiptIds = [...receiptIdToRecipient.keys()];
  const receipts = {};

  for (const receiptIdChunk of expo.chunkPushNotificationReceiptIds(receiptIds)) {
    const receiptChunk = await expo.getPushNotificationReceiptsAsync(receiptIdChunk);
    Object.assign(receipts, receiptChunk);

    Object.entries(receiptChunk).forEach(([receiptId, receipt]) => {
      const recipient = receiptIdToRecipient.get(receiptId);

      if (receipt.status === 'ok') {
        return;
      }

      console.log('[push-debug] Expo push receipt error:', {
        status: receipt.status,
        error: receipt.details?.error,
        message: receipt.message,
        userId: recipient?.userId,
      });

      if (receipt.details?.error === 'DeviceNotRegistered' && recipient) {
        invalidRecipients.push(recipient);
      }
    });
  }

  const uniqueInvalidRecipients = [
    ...new Map(invalidRecipients.map((recipient) => [recipient.token, recipient])).values(),
  ];

  console.log('[push-debug] Expo push send result:', {
    requested: recipients.length,
    valid: validRecipients.length,
    tickets: tickets.length,
    receipts: Object.keys(receipts).length,
    invalid: uniqueInvalidRecipients.length,
  });

  return {
    success: true,
    sent: tickets.length,
    recipients: validRecipients.length,
    tickets,
    receipts,
    invalidTokens: [...invalidTokens, ...uniqueInvalidRecipients.map((recipient) => recipient.token)],
    invalidRecipients: uniqueInvalidRecipients,
  };
};
