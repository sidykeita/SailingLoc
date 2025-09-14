import request from 'supertest';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

// Env test et mock firebase-admin
process.env.NODE_ENV = 'test';
vi.mock('firebase-admin', () => {
  const admin = { apps: [], initializeApp: vi.fn(() => (admin.apps.push({}), {})), credential: { cert: vi.fn(() => ({})) }, storage: vi.fn(() => ({ bucket: vi.fn() })) };
  return { default: admin, ...admin };
}, { virtual: true });

let app;
beforeAll(async () => {
  ({ default: app } = await import('../../src/appTest.js'));
});

// Models
import Reservation from '../../src/models/reservation.js';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('Reservations API (public endpoints)', () => {
  it('GET /api/reservations -> 200 liste', async () => {
    const sample = [{ _id: 'r1' }, { _id: 'r2' }];
    // chainable populate mock
    const chain = { populate: vi.fn().mockReturnThis(), exec: vi.fn() };
    // Our controller uses await Reservation.find().populate(...), without exec; so return array directly from populate
    vi.spyOn(Reservation, 'find').mockReturnValue({
      populate: vi.fn().mockResolvedValue(sample),
    });

    const res = await request(app).get('/api/reservations');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  it('GET /api/reservations/boat/:boatId -> 200 liste', async () => {
    const sample = [{ _id: 'r1', boat: 'b1' }];
    vi.spyOn(Reservation, 'find').mockReturnValue({
      populate: vi.fn().mockResolvedValue(sample),
    });

    const res = await request(app).get('/api/reservations/boat/b1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('boat', 'b1');
  });

  it('GET /api/reservations/:id -> 200 quand trouvé', async () => {
    const item = { _id: 'r1' };
    vi.spyOn(Reservation, 'findById').mockReturnValue({
      populate: vi.fn().mockResolvedValue(item),
    });

    const res = await request(app).get('/api/reservations/r1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', 'r1');
  });

  it('GET /api/reservations/:id -> 404 quand non trouvé', async () => {
    vi.spyOn(Reservation, 'findById').mockReturnValue({
      populate: vi.fn().mockResolvedValue(null),
    });

    const res = await request(app).get('/api/reservations/unknown');
    expect(res.status).toBe(404);
  });
});
