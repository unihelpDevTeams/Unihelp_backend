import { admin, db } from "../firebase/firebaseAdmin.js";

async function makeAdmin(email) {
  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();
    
    if (snapshot.empty) {
      console.log(`No user found with email: ${email}`);
      return;
    }

    const batch = db.batch();
    snapshot.forEach((doc) => {
      batch.update(doc.ref, { admin: true });
    });

    await batch.commit();
    console.log(`Successfully made ${email} an admin in Firestore!`);
  } catch (error) {
    console.error(`Error making ${email} admin:`, error);
  }
}

async function run() {
  await makeAdmin("agbajejoshua36@gmail.com");
  await makeAdmin("onakomayaokiki@gmail.com");
  process.exit(0);
}

run();
