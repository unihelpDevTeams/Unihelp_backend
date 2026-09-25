import test from 'node:test';
import assert from 'node:assert/strict';

import { validateFeedPostPayload } from '../routes/feedRoutes.js';

test('text posts require non-empty content', () => {
  assert.throws(() => validateFeedPostPayload({ type: 'text', content: '   ' }), /empty|content/i);
});

test('invalid background presets are rejected', () => {
  assert.throws(() => validateFeedPostPayload({ type: 'colored', content: 'Hello', backgroundPreset: 'rainbow' }), /background/i);
});

test('everyone audience is accepted', () => {
  const payload = validateFeedPostPayload({ type: 'text', content: 'Hello', audience: 'everyone' });
  assert.equal(payload.audience, 'everyone');
});

test('image posts require a valid image url', () => {
  assert.throws(() => validateFeedPostPayload({ type: 'image', content: 'Hello' }), /image/i);
});

test('valid text post payload passes', () => {
  const payload = validateFeedPostPayload({ type: 'text', content: 'Hello everyone' });
  assert.equal(payload.type, 'text');
  assert.equal(payload.content, 'Hello everyone');
});
