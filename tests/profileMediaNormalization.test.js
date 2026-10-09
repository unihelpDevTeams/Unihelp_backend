import test from 'node:test';
import assert from 'node:assert/strict';

import {
  isCloudinaryUrl,
  normalizeProfileAsset,
  normalizeProfileMediaValue,
} from '../utils/profileMedia.js';

test('cloudinary URLs are detected', () => {
  assert.equal(isCloudinaryUrl('https://res.cloudinary.com/demo/image/upload/v1/test.jpg'), true);
  assert.equal(isCloudinaryUrl('https://cdn.example.com/avatar.png'), false);
});

test('legacy cloudinary profile media is removed from stored values', () => {
  assert.equal(normalizeProfileMediaValue('https://res.cloudinary.com/demo/image/upload/v1/test.jpg'), null);
  assert.equal(normalizeProfileMediaValue('https://cdn.example.com/avatar.png'), 'https://cdn.example.com/avatar.png');
});

test('legacy cloudinary asset objects are discarded', () => {
  assert.equal(normalizeProfileAsset({ url: 'https://res.cloudinary.com/demo/image/upload/v1/test.jpg', publicId: 'legacy' }), null);
  assert.deepEqual(normalizeProfileAsset({ url: 'https://r2.example.com/profile/test.jpg', publicId: 'unihelp/profile/test' }), {
    url: 'https://r2.example.com/profile/test.jpg',
    publicId: 'unihelp/profile/test',
  });
});
