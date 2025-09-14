// Mock firebase-admin in test environment
if (process.env.NODE_ENV === 'test') {
  module.exports = {
    initializeApp: () => {},
    apps: [],
    credential: { cert: () => {} },
    storage: () => ({
      bucket: () => ({
        file: () => ({
          save: () => Promise.resolve(),
          delete: () => Promise.resolve(),
          getSignedUrl: () => Promise.resolve(['https://example.com/file.pdf'])
        })
      })
    })
  };
  return;
}

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
    // Normalize bucket name: Firebase console often shows *.firebasestorage.app, but GCS bucket is *.appspot.com
    const normalizedBucket = (FIREBASE_STORAGE_BUCKET || '')
      .replace(/^gs:\/\//, '')
      .replace(/^https:\/\/storage\.googleapis\.com\//, '')
      .replace('.firebasestorage.app', '.appspot.com')
      .trim();

    // Private key may contain escaped newlines in env variables
    const privateKey = FIREBASE_PRIVATE_KEY && FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

    if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !privateKey || !normalizedBucket) {
      console.error('[firebase-admin] Missing env variables. PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY and STORAGE_BUCKET are required');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
      storageBucket: normalizedBucket,
    });
    // eslint-disable-next-line no-console
    console.log('[firebase-admin] initialized with bucket:', normalizedBucket);
  } catch (err) {
    console.error('[firebase-admin] initialization failed:', err);
  }
}

module.exports = admin;
