import test from 'node:test';
import assert from 'node:assert/strict';

import {
  evaluateMediaRetention,
  getMediaRetentionConfig,
} from '../services/mediaRetention.js';

test('retention allows a delivered attachment to live for the configured window', () => {
  const config = getMediaRetentionConfig({ retentionDays: 7, maxUndeliveredDays: 30 });
  const result = evaluateMediaRetention({
    attachment: {
      id: 'a1',
      url: 'https://r2.example.com/media/a1.jpg',
      downloadedBy: ['u2'],
      createdAt: new Date('2026-01-01T00:00:00Z').toISOString(),
      retentionDays: config.retentionDays,
      maxUndeliveredDays: config.maxUndeliveredDays,
      deliveryStatus: 'downloaded',
    },
    recipientIds: ['u2'],
    message: {
      senderId: 'u1',
      mediaState: {
        status: 'available_for_download',
        downloadedBy: ['u2'],
        finalRecipients: ['u2'],
      },
      createdAt: new Date('2026-01-01T00:00:00Z'),
    },
    now: new Date('2026-01-04T00:00:00Z').getTime(),
  });

  assert.equal(result.shouldDelete, false);
  assert.equal(result.reason, 'retention-window-open');
});

test('undelivered attachments expire after the maximum undelivered retention window', () => {
  const config = getMediaRetentionConfig({ retentionDays: 7, maxUndeliveredDays: 30 });
  const result = evaluateMediaRetention({
    attachment: {
      id: 'a2',
      url: 'https://r2.example.com/media/a2.jpg',
      downloadedBy: [],
      createdAt: new Date('2025-12-01T00:00:00Z').toISOString(),
      retentionDays: config.retentionDays,
      maxUndeliveredDays: config.maxUndeliveredDays,
      deliveryStatus: 'pending_delivery',
    },
    recipientIds: ['u2'],
    message: {
      senderId: 'u1',
      mediaState: {
        status: 'pending_delivery',
        downloadedBy: [],
        finalRecipients: ['u2'],
      },
      createdAt: new Date('2025-12-01T00:00:00Z'),
    },
    now: new Date('2025-12-31T00:00:00Z').getTime(),
  });

  assert.equal(result.shouldDelete, true);
  assert.equal(result.reason, 'max-undelivered-retention-exceeded');
});

test('attachments with one remaining recipient still require download before deletion', () => {
  const config = getMediaRetentionConfig({ retentionDays: 7, maxUndeliveredDays: 30 });
  const result = evaluateMediaRetention({
    attachment: {
      id: 'a3',
      url: 'https://r2.example.com/media/a3.jpg',
      downloadedBy: ['u2'],
      createdAt: new Date('2026-01-01T00:00:00Z').toISOString(),
      retentionDays: config.retentionDays,
      maxUndeliveredDays: config.maxUndeliveredDays,
      deliveryStatus: 'available_for_download',
    },
    recipientIds: ['u2', 'u3'],
    message: {
      senderId: 'u1',
      mediaState: {
        status: 'available_for_download',
        downloadedBy: ['u2'],
        finalRecipients: ['u2', 'u3'],
      },
      createdAt: new Date('2026-01-01T00:00:00Z'),
    },
    now: new Date('2026-01-10T00:00:00Z').getTime(),
  });

  assert.equal(result.shouldDelete, false);
  assert.equal(result.reason, 'awaiting-recipient-download');
});
