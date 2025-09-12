const admin = require('firebase-admin');

// Avoid re-initialization in dev/hot-reload
if (!admin.apps || !admin.apps.length) {
  const {
    FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY,
    FIREBASE_STORAGE_BUCKET
  } = process.env;

  try {
    // Private key may contain escaped newlines in env variables
    const privateKey = FIREBASE_PRIVATE_KEY && FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
      storageBucket: FIREBASE_STORAGE_BUCKET,
    });
    // eslint-disable-next-line no-console
    console.log('[firebase-admin] initialized with bucket:', FIREBASE_STORAGE_BUCKET);
  } catch (err) {
    console.error('[firebase-admin] initialization failed:', err.message);
  }
}

module.exports = admin;
