import express from 'express';
import { db } from '../firebase/firebaseAdmin.js';

const hostelsRoutes = express.Router();

let hostelsCache = null;
let lastCacheTime = 0;
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

hostelsRoutes.get('/', async (req, res) => {
  try {
    const now = Date.now();
    // Return cached data if within TTL
    if (hostelsCache && now - lastCacheTime < CACHE_TTL) {
      return res.json(hostelsCache);
    }

    const snapshot = await db.collection('hostels').orderBy('createdAt', 'desc').get();
    const hostels = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      };
    });

    hostelsCache = hostels;
    lastCacheTime = now;
    res.json(hostels);
  } catch (error) {
    console.error('Error fetching hostels:', error);
    res.status(500).json({ error: 'Failed to fetch hostels' });
  }
});

// Clear cache manually if needed (e.g., when a user adds a hostel)
hostelsRoutes.post('/clear-cache', (req, res) => {
  hostelsCache = null;
  lastCacheTime = 0;
  res.json({ message: "Cache cleared" });
});

export default hostelsRoutes;
