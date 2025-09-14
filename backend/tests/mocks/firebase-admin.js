// CommonJS stub for firebase-admin used in tests
const admin = {
  apps: [],
  initializeApp() {
    admin.apps.push({ name: 'mock-app' });
    return admin.apps[0];
  },
  credential: {
    cert() { return {}; },
  },
  storage() {
    return { bucket() { return {}; } };
  },
};

module.exports = admin;
