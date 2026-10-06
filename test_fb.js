import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

const pk = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'unihelp-app',
    clientEmail: 'firebase-adminsdk-fbsvc@unihelp-app.iam.gserviceaccount.com',
    privateKey: pk
  })
});

admin.firestore().collection('users').limit(1).get()
  .then(snap => console.log('Found', snap.size, 'users'))
  .catch(err => console.error(err.message));
