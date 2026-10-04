import test from 'node:test';
import assert from 'node:assert/strict';
import { getBirthdayDateParts, isBirthdayOnDate } from '../utils/birthdayDates.js';

test('birthday date parts use the configured timezone', () => {
  const dateParts = getBirthdayDateParts(new Date('2026-02-27T23:30:00.000Z'), 'Africa/Lagos');
  assert.deepEqual(dateParts, { year: 2026, month: 2, day: 28 });
});

test('February 29 birthdays are observed on February 28 in non-leap years', () => {
  const leapDayBirthday = new Date('2000-02-29T00:00:00.000Z');
  assert.equal(isBirthdayOnDate(leapDayBirthday, { year: 2025, month: 2, day: 28 }), true);
  assert.equal(isBirthdayOnDate(leapDayBirthday, { year: 2025, month: 3, day: 1 }), false);
});

test('February 29 birthdays remain on February 29 in leap years', () => {
  const leapDayBirthday = new Date('2000-02-29T00:00:00.000Z');
  assert.equal(isBirthdayOnDate(leapDayBirthday, { year: 2024, month: 2, day: 29 }), true);
  assert.equal(isBirthdayOnDate(leapDayBirthday, { year: 2024, month: 2, day: 28 }), false);
});

test('invalid birth dates do not match a birthday', () => {
  assert.equal(isBirthdayOnDate(new Date('invalid'), { year: 2026, month: 1, day: 1 }), false);
  assert.equal(isBirthdayOnDate(null, { year: 2026, month: 1, day: 1 }), false);
});
