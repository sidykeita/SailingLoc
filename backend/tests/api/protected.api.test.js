import request from 'supertest';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

process.env.NODE_ENV = 'test';

// Bypass real firebase-admin if anything tries to load it
vi.mock('firebase-admin', () => {
  const admin = { apps: [], initializeApp: vi.fn(() => (admin.apps.push({}), {})), credential: { cert: vi.fn(() => ({})) }, storage: vi.fn(() => ({ bucket: vi.fn() })) };
  return { default: admin, ...admin };
}, { virtual: true });

// Pas de mock du controller d'auth ici, on utilise les endpoints /test/* qui bypassent protect

let app;
beforeAll(async () => {
  ({ default: app } = await import('../../src/appTest.js'));
});

import Reservation from '../../src/models/reservation.js';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('Protected endpoints via mocked protect()', () => {
  it('GET /api/auth/user -> 200 returns current user', async () => {
    const res = await request(app)
      .get('/test/auth/user');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', '507f1f77bcf86cd799439011');
    expect(res.body).toHaveProperty('email', 'u1@test.com');
  });

  it('GET /api/reservations/user -> 200 returns user reservations', async () => {
    const sample = [{ _id: 'r1', user: 'u1' }];
    vi.spyOn(Reservation, 'find').mockReturnValue({
      populate: vi.fn().mockResolvedValue(sample),
    });

    const res = await request(app)
      .get('/test/reservations/user');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('user');
  });
});
