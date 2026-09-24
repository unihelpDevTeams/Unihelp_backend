import express from 'express';
import { query } from '../db/pool.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const statsQuery = await query(`
      SELECT 
        COUNT(*) as total_transactions,
        SUM(CASE WHEN status = 'successful' THEN 1 ELSE 0 END) as success_count,
        SUM(CASE WHEN status != 'successful' THEN 1 ELSE 0 END) as failed_count,
        COALESCE(SUM(amount), 0) as total_revenue,
        COALESCE(SUM(net_amount), 0) as net_revenue,
        COALESCE(SUM(amount) FILTER (WHERE DATE(created_at) = CURRENT_DATE), 0) as today_revenue,
        COALESCE(SUM(amount) FILTER (WHERE created_at >= date_trunc('week', CURRENT_DATE)), 0) as this_week_revenue,
        COALESCE(SUM(amount) FILTER (WHERE created_at >= date_trunc('month', CURRENT_DATE)), 0) as this_month_revenue
      FROM transactions
    `);

    const typeBreakdownQuery = await query(`
      SELECT type, COALESCE(SUM(amount), 0) as amount
      FROM transactions
      GROUP BY type
    `);

    const stats = statsQuery.rows[0];
    const breakdown = typeBreakdownQuery.rows;

    res.json({
      success: true,
      data: {
        total_revenue: parseFloat(stats.total_revenue),
        today_revenue: parseFloat(stats.today_revenue),
        this_week_revenue: parseFloat(stats.this_week_revenue),
        this_month_revenue: parseFloat(stats.this_month_revenue),
        total_transactions: parseInt(stats.total_transactions),
        success_count: parseInt(stats.success_count || 0),
        failed_count: parseInt(stats.failed_count || 0),
        net_revenue: parseFloat(stats.net_revenue),
        reinvestment: parseFloat(stats.net_revenue) * 0.5,
        breakdown
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.get('/transactions', async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status, search, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let values = [];
    let paramIndex = 1;

    if (type) {
      whereConditions.push(`type = $${paramIndex}`);
      values.push(type);
      paramIndex++;
    }

    if (status) {
      whereConditions.push(`status = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }

    if (search) {
      whereConditions.push(`(transaction_id ILIKE $${paramIndex} OR customer_email ILIKE $${paramIndex} OR reference ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }
    
    if (startDate) {
      whereConditions.push(`created_at >= $${paramIndex}`);
      values.push(startDate);
      paramIndex++;
    }
    
    if (endDate) {
      whereConditions.push(`created_at <= $${paramIndex}`);
      values.push(endDate);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countResult = await query(`SELECT COUNT(*) FROM transactions ${whereClause}`, values);
    const total = parseInt(countResult.rows[0].count);

    values.push(limit, offset);
    const transactions = await query(`
      SELECT * FROM transactions
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, values);

    res.json({
      success: true,
      data: transactions.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
