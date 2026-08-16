import express from 'express';
import { db } from '../firebase/firebaseAdmin.js';

const storiesRoutes = express.Router();

let storiesCache = null;
let lastCacheTime = 0;
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

storiesRoutes.get('/', async (req, res) => {
  try {
    const now = Date.now();
    // Return cached data if within TTL
    if (storiesCache && now - lastCacheTime < CACHE_TTL) {
      return res.json(storiesCache);
    }

    const snapshot = await db.collection('stories').orderBy('createdAt', 'desc').get();
    const items = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      };
    });

    storiesCache = items;
    lastCacheTime = now;
    res.json(items);
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

storiesRoutes.post('/clear-cache', (req, res) => {
  storiesCache = null;
  lastCacheTime = 0;
  res.json({ message: "Cache cleared" });
});

export default storiesRoutes;
