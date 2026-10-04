import { query } from '../db/pool.js';
import { sendAppNotification } from './notifications.js';
import { getBirthdayDateParts } from './birthdayDates.js';

const TIME_ZONE = process.env.BIRTHDAY_TIME_ZONE || 'Africa/Lagos';
const STALE_CLAIM_MS = 60 * 60 * 1000;

export async function sendBirthdayGreetingNotifications(now = new Date()) {
  const { year, month, day } = getBirthdayDateParts(now, TIME_ZONE);
  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

  const birthdayUsers = await query(
    `SELECT id, display_name
     FROM users
     WHERE date_of_birth IS NOT NULL
       AND EXTRACT(MONTH FROM date_of_birth) = $1
       AND (
         EXTRACT(DAY FROM date_of_birth) = $2
         OR ($1 = 2 AND $2 = 28 AND $3 = FALSE AND EXTRACT(DAY FROM date_of_birth) = 29)
       )`,
    [month, day, isLeapYear]
  );

  const result = { birthdays: birthdayUsers.rows.length, sent: 0, skipped: 0, failed: 0 };

  for (const user of birthdayUsers.rows) {
    const claim = await query(
      `INSERT INTO birthday_greetings (user_id, birthday_year, status, attempts, attempted_at)
       VALUES ($1, $2, 'processing', 1, NOW())
       ON CONFLICT (user_id, birthday_year) DO UPDATE
         SET status = 'processing',
             attempts = birthday_greetings.attempts + 1,
             attempted_at = NOW()
         WHERE birthday_greetings.status <> 'sent'
           AND (
             birthday_greetings.status <> 'processing'
             OR birthday_greetings.attempted_at < NOW() - ($3 * INTERVAL '1 millisecond')
           )
       RETURNING user_id`,
      [user.id, year, STALE_CLAIM_MS]
    );

    if (!claim.rowCount) {
      result.skipped += 1;
      continue;
    }

    const firstName = String(user.display_name || '').trim().split(/\s+/)[0] || 'there';
    try {
      const delivery = await sendAppNotification({
        userIds: user.id,
        title: `Happy birthday, ${firstName}!`,
        body: 'Wishing you a wonderful day filled with joy, laughter, and success. Celebrate big!',
        type: 'birthday',
        category: 'Birthday',
        url: '/notifications',
        data: { birthdayYear: String(year) },
      });
      if (!delivery?.success) throw new Error('Birthday notification could not be delivered.');

      await query(
        `UPDATE birthday_greetings
         SET status = 'sent', sent_at = NOW(), attempted_at = NOW()
         WHERE user_id = $1 AND birthday_year = $2`,
        [user.id, year]
      );
      result.sent += 1;
    } catch (error) {
      await query(
        `UPDATE birthday_greetings
         SET status = 'failed', attempted_at = NOW()
         WHERE user_id = $1 AND birthday_year = $2`,
        [user.id, year]
      );
      result.failed += 1;
      console.error(`[birthday] failed to notify ${user.id}:`, error?.message || error);
    }
  }

  return result;
}
