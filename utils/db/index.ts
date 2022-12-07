import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '') as admin.ServiceAccount)
    });
  } catch (error) {
    console.log('Firebase admin initialization error', (error as Error).stack);
  }
}
export default admin.firestore();
