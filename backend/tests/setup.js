import { vi } from 'vitest';

// Assurer l'environnement de test très tôt
process.env.NODE_ENV = 'test';

// Mock firebase-admin to avoid requiring real SDK / credentials during tests
vi.mock('firebase-admin', () => {
  const admin = {
    apps: [],
    initializeApp: vi.fn(() => {
      // simulate one initialized app to avoid re-init loops
      admin.apps.push({ name: 'mock-app' });
      return admin.apps[0];
    }),
    credential: {
      cert: vi.fn(() => ({})),
    },
    storage: vi.fn(() => ({ bucket: vi.fn() })),
  };
  // Provide both default and named for ESM/CJS compatibility
  return { default: admin, ...admin };
}, { virtual: true });

// You can mock other external SDKs here if needed (e.g., stripe)
// vi.mock('stripe', () => ({ default: function Stripe() { return {}; } }));
