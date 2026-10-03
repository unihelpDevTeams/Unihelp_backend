import express from 'express';
import { query } from '../db/pool.js';
import { authenticateFirebaseUser } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateFirebaseUser);

// Ensure user1 < user2 for consistency in friends table
const sortIds = (id1, id2) => [id1, id2].sort();

// Get list of friends
router.get('/friends', async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT u.* 
      FROM friends f
      JOIN users u ON (f.user_id_1 = u.id OR f.user_id_2 = u.id)
      WHERE (f.user_id_1 = $1 OR f.user_id_2 = $1) AND u.id != $1
    `, [req.user.uid]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get incoming friend requests
router.get('/requests/incoming', async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT fr.id as request_id, fr.status, fr.created_at as request_created_at, u.*
      FROM friend_requests fr
      JOIN users u ON fr.sender_id = u.id
      WHERE fr.receiver_id = $1 AND fr.status = 'pending'
    `, [req.user.uid]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get outgoing friend requests
router.get('/requests/outgoing', async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT fr.id as request_id, fr.status, fr.created_at as request_created_at, u.*
      FROM friend_requests fr
      JOIN users u ON fr.receiver_id = u.id
      WHERE fr.sender_id = $1 AND fr.status = 'pending'
    `, [req.user.uid]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get blocked users
router.get('/blocked', async (req, res) => {
  try {
    const { rows } = await query(`
      SELECT u.*, b.created_at as blocked_at
      FROM blocked_users b
      JOIN users u ON b.blocked_id = u.id
      WHERE b.blocker_id = $1
    `, [req.user.uid]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Check relationship status
router.get('/status/:userId', async (req, res) => {
  try {
    const currentUid = req.user.uid;
    const targetUid = req.params.userId;
    
    if (currentUid === targetUid) {
      return res.json({ state: 'none' });
    }

    // Check blocks
    const blockRes = await query(
      `SELECT * FROM blocked_users WHERE (blocker_id = $1 AND blocked_id = $2) OR (blocker_id = $2 AND blocked_id = $1)`,
      [currentUid, targetUid]
    );
    if (blockRes.rowCount > 0) {
      const isBlockedByMe = blockRes.rows.some(r => r.blocker_id === currentUid);
      return res.json({ state: 'blocked', blockedByMe: isBlockedByMe });
    }

    // Check friends
    const [u1, u2] = sortIds(currentUid, targetUid);
    const friendRes = await query(
      `SELECT * FROM friends WHERE user_id_1 = $1 AND user_id_2 = $2`,
      [u1, u2]
    );
    if (friendRes.rowCount > 0) {
      return res.json({ state: 'friends' });
    }

    // Check requests
    const reqRes = await query(
      `SELECT * FROM friend_requests WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) AND status = 'pending'`,
      [currentUid, targetUid]
    );
    if (reqRes.rowCount > 0) {
      const request = reqRes.rows[0];
      if (request.sender_id === currentUid) return res.json({ state: 'sent', request });
      return res.json({ state: 'received', request });
    }

    res.json({ state: 'none' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Send friend request
router.post('/requests/:userId', async (req, res) => {
  try {
    const currentUid = req.user.uid;
    const targetUid = req.params.userId;
    
    if (currentUid === targetUid) return res.status(400).json({ error: 'Cannot add yourself' });

    await query(
      `INSERT INTO friend_requests (sender_id, receiver_id) VALUES ($1, $2) ON CONFLICT (sender_id, receiver_id) DO UPDATE SET status = 'pending', updated_at = NOW()`,
      [currentUid, targetUid]
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Accept friend request
router.post('/requests/:requestId/accept', async (req, res) => {
  try {
    const currentUid = req.user.uid;
    const { requestId } = req.params;

    const requestRes = await query(`SELECT * FROM friend_requests WHERE id = $1 AND receiver_id = $2 AND status = 'pending'`, [requestId, currentUid]);
    if (requestRes.rowCount === 0) return res.status(404).json({ error: 'Request not found or not pending' });

    const request = requestRes.rows[0];
    const [u1, u2] = sortIds(request.sender_id, request.receiver_id);

    await query('BEGIN');
    await query(`UPDATE friend_requests SET status = 'accepted', updated_at = NOW() WHERE id = $1`, [requestId]);
    await query(`INSERT INTO friends (user_id_1, user_id_2) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [u1, u2]);
    await query('COMMIT');

    res.json({ success: true });
  } catch (error) {
    await query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Decline friend request
router.post('/requests/:requestId/decline', async (req, res) => {
  try {
    const currentUid = req.user.uid;
    const { requestId } = req.params;
    await query(`UPDATE friend_requests SET status = 'declined', updated_at = NOW() WHERE id = $1 AND receiver_id = $2`, [requestId, currentUid]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Cancel friend request
router.delete('/requests/:requestId', async (req, res) => {
  try {
    const currentUid = req.user.uid;
    const { requestId } = req.params;
    await query(`DELETE FROM friend_requests WHERE id = $1 AND sender_id = $2 AND status = 'pending'`, [requestId, currentUid]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Remove friend
router.delete('/friends/:userId', async (req, res) => {
  try {
    const currentUid = req.user.uid;
    const targetUid = req.params.userId;
    const [u1, u2] = sortIds(currentUid, targetUid);
    
    await query(`DELETE FROM friends WHERE user_id_1 = $1 AND user_id_2 = $2`, [u1, u2]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Block user
router.post('/block/:userId', async (req, res) => {
  try {
    const currentUid = req.user.uid;
    const targetUid = req.params.userId;
    
    const [u1, u2] = sortIds(currentUid, targetUid);

    await query('BEGIN');
    await query(`INSERT INTO blocked_users (blocker_id, blocked_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [currentUid, targetUid]);
    await query(`DELETE FROM friends WHERE user_id_1 = $1 AND user_id_2 = $2`, [u1, u2]);
    await query(`DELETE FROM friend_requests WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)`, [currentUid, targetUid]);
    await query('COMMIT');

    res.json({ success: true });
  } catch (error) {
    await query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Unblock user
router.delete('/block/:userId', async (req, res) => {
  try {
    const currentUid = req.user.uid;
    const targetUid = req.params.userId;
    await query(`DELETE FROM blocked_users WHERE blocker_id = $1 AND blocked_id = $2`, [currentUid, targetUid]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get suggested friends
router.get('/suggestions', async (req, res) => {
  try {
    const currentUid = req.user.uid;
    
    // Get all excluded IDs (friends, requests, blocked)
    const { rows: excludedRows } = await query(`
      SELECT user_id_2 as excluded_id FROM friends WHERE user_id_1 = $1
      UNION
      SELECT user_id_1 as excluded_id FROM friends WHERE user_id_2 = $1
      UNION
      SELECT receiver_id as excluded_id FROM friend_requests WHERE sender_id = $1 AND status = 'pending'
      UNION
      SELECT sender_id as excluded_id FROM friend_requests WHERE receiver_id = $1 AND status = 'pending'
      UNION
      SELECT blocked_id as excluded_id FROM blocked_users WHERE blocker_id = $1
    `, [currentUid]);
    
    const excludedIds = new Set(excludedRows.map(r => r.excluded_id));
    excludedIds.add(currentUid);

    const { rows: users } = await query(`SELECT * FROM users LIMIT 120`);
    const { rows: currentUserRes } = await query(`SELECT * FROM users WHERE id = $1`, [currentUid]);
    const currentProfile = currentUserRes[0] || {};
    
    const currentInterests = new Set(Array.isArray(currentProfile.interests) ? currentProfile.interests.map(i => String(i).toLowerCase()) : []);
    
    const suggestions = users
      .filter(u => !excludedIds.has(u.id))
      .map(student => {
        const interests = Array.isArray(student.interests) ? student.interests : [];
        const sharedInterests = interests.filter((item) => currentInterests.has(String(item).toLowerCase())).length;
        let score = 0;
        if ((student.school || student.university) && (student.school || student.university) === (currentProfile.school || currentProfile.university)) score += 35;
        if (student.faculty && student.faculty === currentProfile.faculty) score += 20;
        if (student.department && student.department === currentProfile.department) score += 25;
        if (student.level && student.level === currentProfile.level) score += 12;
        score += Math.min(sharedInterests * 8, 24);
        if (student.verifiedTutor) score += 10;
        if (student.lastActiveAt) score += 4;
        const cappedScore = Math.min(score, 100);
        return { ...student, score: cappedScore, matchPercentage: cappedScore };
      })
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
      
    res.json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

export default router;
