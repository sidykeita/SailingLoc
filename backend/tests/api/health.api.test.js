import request from 'supertest';
import { describe, it, expect, vi, beforeAll } from 'vitest';

// Mock firebase-admin AVANT d'importer l'app
vi.mock('firebase-admin', () => {
  const admin = {
    apps: [],
    initializeApp: vi.fn(function () {
      admin.apps.push({ name: 'mock-app' });
      return admin.apps[0];
    }),
    credential: { cert: vi.fn(() => ({})) },
    storage: vi.fn(() => ({ bucket: vi.fn() })),
  };
  return { default: admin, ...admin };
});

// Mock direct du module backend/src/config/firebaseAdmin.js (court-circuite tout accès SDK)
vi.mock('backend/src/config/firebaseAdmin', () => {
  return { default: {}, __esModule: true };
});

// Stub de la route contractuelle (évite d'importer le controller qui dépend de firebase-admin)
vi.mock('backend/src/routes/contractualDocumentRoutes', () => {
  const noop = (req, res, next) => next && next();
  // compat CJS/ESM
  return { default: noop, ...noop };
});

// Stub du controller contractuel directement pour plus de sécurité
vi.mock('backend/src/controllers/contractualDocumentController', () => {
  const ctrl = {
    uploadMiddleware: (req, res, next) => next && next(),
    uploadDocument: (req, res) => res.status(201).json({ ok: true }),
    uploadDocumentFromUrl: (req, res) => res.status(201).json({ ok: true }),
    getUserDocuments: (req, res) => res.json([]),
    deleteDocument: (req, res) => res.status(204).end(),
  };
  return { default: ctrl, ...ctrl };
});

let app;
beforeAll(async () => {
  ({ default: app } = await import('../../src/appTest.js'));
});

describe('Health API', () => {
  it('GET /health -> 200 { ok: true }', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('GET / -> 200 text', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/API SailingLoc fonctionne/i);
  });
});
