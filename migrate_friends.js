import { db } from './firebase/firebaseAdmin.js';
import { query } from './db/pool.js';
import crypto from 'crypto';

async function migrateFriends() {
  console.log("Starting friend migration from Firebase to Postgres...");
  
  try {
    const snapshot = await db.collection("friends").get();
    const friendships = [];
    
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const users = data.users || [];
      if (users.length === 2 && users[0] && users[1]) {
        // Sort to ensure consistent user_id_1 and user_id_2
        const sorted = [...users].sort();
        friendships.push({
          user_id_1: sorted[0],
          user_id_2: sorted[1]
        });
      }
    });

    console.log(`Found ${friendships.length} friendships in Firebase.`);

    let inserted = 0;
    for (const f of friendships) {
      try {
        await query(
          `INSERT INTO friends (id, user_id_1, user_id_2) VALUES ($1, $2, $3) ON CONFLICT (user_id_1, user_id_2) DO NOTHING`,
          [crypto.randomUUID(), f.user_id_1, f.user_id_2]
        );
        inserted++;
        if (inserted % 10 === 0) console.log(`Migrated ${inserted} friendships...`);
      } catch (err) {
        console.error(`Error inserting friendship ${f.user_id_1} - ${f.user_id_2}:`, err.message);
      }
    }
    
    console.log(`Migration complete! Successfully inserted ${inserted} unique friendships.`);
  } catch (error) {
    console.error("Migration failed:", error);
  }
  
  process.exit(0);
}

migrateFriends();
