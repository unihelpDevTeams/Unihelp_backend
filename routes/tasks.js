import express from 'express';
import crypto from 'crypto';
import { query } from '../db/pool.js';
import { authenticateFirebaseUser } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateFirebaseUser);

router.get('/', async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT id, title, description, due_date as "dueDate", status, tags, completed, created_at as "createdAt", updated_at as "updatedAt" 
       FROM tasks WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.uid]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, due_date, status, tags } = req.body;
    const id = crypto.randomUUID();
    const { rows } = await query(
      `INSERT INTO tasks (id, user_id, title, description, due_date, status, tags, completed)
       VALUES ($1, $2, $3, $4, $5, $6, $7, false) RETURNING *`,
      [id, req.user.uid, title, description || '', due_date || null, status || 'pending', JSON.stringify(tags || [])]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, due_date, status, tags, completed } = req.body;
    const { rowCount, rows } = await query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           due_date = COALESCE($3, due_date),
           status = COALESCE($4, status),
           tags = COALESCE($5, tags),
           completed = COALESCE($6, completed),
           updated_at = NOW()
       WHERE id = $7 AND user_id = $8 RETURNING *`,
      [title, description, due_date, status, tags ? JSON.stringify(tags) : null, completed, id, req.user.uid]
    );
    if (rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await query(
      `DELETE FROM tasks WHERE id = $1 AND user_id = $2`,
      [id, req.user.uid]
    );
    if (rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

export default router;
