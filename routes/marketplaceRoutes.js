import express from 'express';
import { db } from '../firebase/firebaseAdmin.js';

const marketplaceRoutes = express.Router();

let marketplaceCache = null;
let lastCacheTime = 0;
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

marketplaceRoutes.get('/', async (req, res) => {
  try {
    const now = Date.now();
    // Return cached data if within TTL
    if (marketplaceCache && now - lastCacheTime < CACHE_TTL) {
      return res.json(marketplaceCache);
    }

    const snapshot = await db.collection('studentMarketplace').orderBy('createdAt', 'desc').get();
    const items = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      };
    });

    marketplaceCache = items;
    lastCacheTime = now;
    res.json(items);
  } catch (error) {
    console.error('Error fetching marketplace listings:', error);
    res.status(500).json({ error: 'Failed to fetch marketplace listings' });
  }
});

marketplaceRoutes.post('/clear-cache', (req, res) => {
  marketplaceCache = null;
  lastCacheTime = 0;
  res.json({ message: "Cache cleared" });
});

export default marketplaceRoutes;
