import express from 'express';
import { query } from '../db/pool.js';
import { authenticateFirebaseUser } from '../middleware/auth.js';

const router = express.Router();

// Get the shared migration status
router.get('/', authenticateFirebaseUser, async (req, res) => {
  try {
    const result = await query("SELECT checked_items FROM migration_status LIMIT 1");
    if (result.rows.length === 0) {
      // Return default if empty
      return res.json({ checkedItems: {} });
    }
    res.json({ checkedItems: result.rows[0].checked_items || {} });
  } catch (error) {
    console.error('Error fetching migration status:', error);
    res.status(500).json({ error: 'Failed to fetch migration status' });
  }
});

// Update the shared migration status
router.put('/', authenticateFirebaseUser, async (req, res) => {
  const { checkedItems } = req.body;
  try {
    // Check if a row exists
    const existing = await query("SELECT id FROM migration_status LIMIT 1");
    if (existing.rows.length === 0) {
      await query("INSERT INTO migration_status (checked_items) VALUES ($1)", [checkedItems]);
    } else {
      await query("UPDATE migration_status SET checked_items = $1, updated_at = CURRENT_TIMESTAMP", [checkedItems]);
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating migration status:', error);
    res.status(500).json({ error: 'Failed to update migration status' });
  }
});

export default router;
