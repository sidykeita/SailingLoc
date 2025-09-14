import request from 'supertest';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

process.env.NODE_ENV = 'test';

let app;
beforeAll(async () => {
  ({ default: app } = await import('../../src/appTest.js'));
});

import Boat from '../../src/models/boat.js';
import Reservation from '../../src/models/reservation.js';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('Reservations owner API', () => {
  it('GET /api/reservations/owner -> 200 list for owner', async () => {
    // Boats owned by injected user u1
    vi.spyOn(Boat, 'find').mockResolvedValue([{ _id: 'b1' }, { _id: 'b2' }]);

    // Reservation.find(...).populate('boat').populate('user') chain
    const sample = [{ _id: 'r1', boat: 'b1', user: 'uX' }];
    vi.spyOn(Reservation, 'find').mockReturnValue({
      populate: vi.fn(() => ({ populate: vi.fn().mockResolvedValue(sample) })),
    });

    const res = await request(app).get('/api/reservations/owner');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
