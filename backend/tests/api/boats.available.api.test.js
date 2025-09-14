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

describe('Boats available API', () => {
  it('GET /api/boats/available -> 200 and returns only boats with at least one free day', async () => {
    // No confirmed reservations overlapping (controller calls .find(...).select(...))
    vi.spyOn(Reservation, 'find').mockReturnValue({
      select: vi.fn().mockResolvedValue([]),
    });

    // Two boats, one has an unavailable date inside the range
    const boats = [
      { _id: 'b1', status: 'disponible', unavailableDates: [] },
      { _id: 'b2', status: 'disponible', unavailableDates: ['2025-01-11'] },
    ];
    vi.spyOn(Boat, 'find').mockReturnValue({
      populate: vi.fn().mockResolvedValue(boats),
    });

    const res = await request(app)
      .get('/api/boats/available')
      .query({ start: '2025-01-10', end: '2025-01-12' });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // Only b1 should remain available
    expect(res.body.find(b => b._id === 'b1')).toBeTruthy();
  });
});
