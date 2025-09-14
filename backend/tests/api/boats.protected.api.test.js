import request from 'supertest';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

process.env.NODE_ENV = 'test';

// Mock firebase-admin in case of accidental import
vi.mock('firebase-admin', () => {
  const admin = { apps: [], initializeApp: vi.fn(() => (admin.apps.push({}), {})), credential: { cert: vi.fn(() => ({})) }, storage: vi.fn(() => ({ bucket: vi.fn() })) };
  return { default: admin, ...admin };
}, { virtual: true });

// Mock protect to inject a fake user
vi.mock('../../src/controllers/authController', async () => {
  const actual = await vi.importActual('../../src/controllers/authController');
  const protect = (req, res, next) => {
    req.user = { id: 'u1', _id: 'u1', role: 'propriétaire', toObject: () => ({ _id: 'u1' }) };
    return next();
  };
  return { ...actual, protect };
});

let app;
beforeAll(async () => {
  ({ default: app } = await import('../../src/appTest.js'));
});

import Boat from '../../src/models/boat.js';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('Boats protected endpoints', () => {
  it('GET /api/boats/my-boats -> 200 liste des bateaux du user', async () => {
    vi.spyOn(Boat, 'find').mockResolvedValue([
      { _id: 'b1', owner: 'u1', name: 'Mine' },
    ]);

    const res = await request(app)
      .get('/test/boats/my-boats');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('owner');
  });
});
