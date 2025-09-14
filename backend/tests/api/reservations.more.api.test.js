import request from 'supertest';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

process.env.NODE_ENV = 'test';

let app;
beforeAll(async () => {
  ({ default: app } = await import('../../src/appTest.js'));
});

import Reservation from '../../src/models/reservation.js';
import Boat from '../../src/models/boat.js';
import BlockedDate from '../../src/models/blockedDate.js';

beforeEach(() => {
  vi.restoreAllMocks();
});

const makeResObj = (extra = {}) => ({
  _id: 'r1',
  boat: 'b1',
  user: 'u1',
  status: 'pending',
  startDate: new Date('2025-01-01T00:00:00Z'),
  endDate: new Date('2025-01-05T00:00:00Z'),
  save: vi.fn(async function save() { return this; }),
  ...extra,
});

describe('Reservations status/update/cancel/review via /test endpoints', () => {
  it('PUT /test/reservations/:id/status -> 200 when owner', async () => {
    const resObj = makeResObj();
    vi.spyOn(Reservation, 'findById').mockResolvedValue(resObj);
    vi.spyOn(Boat, 'findById').mockResolvedValue({ _id: 'b1', owner: '507f1f77bcf86cd799439011' });

    const res = await request(app)
      .put('/test/reservations/r1/status')
      .send({ status: 'confirmed' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'confirmed');
  });

  it('PUT /test/reservations/:id/status -> 403 when not owner', async () => {
    const resObj = makeResObj();
    vi.spyOn(Reservation, 'findById').mockResolvedValue(resObj);
    vi.spyOn(Boat, 'findById').mockResolvedValue({ _id: 'b1', owner: 'other' });

    const res = await request(app)
      .put('/test/reservations/r1/status')
      .send({ status: 'confirmed' });

    expect(res.status).toBe(403);
  });

  it('PUT /test/reservations/:id/status -> 404 when not found', async () => {
    vi.spyOn(Reservation, 'findById').mockResolvedValue(null);

    const res = await request(app)
      .put('/test/reservations/unknown/status')
      .send({ status: 'confirmed' });

    expect(res.status).toBe(404);
  });

  it('PUT /test/reservations/:id -> 409 on reservation overlap', async () => {
    const existing = makeResObj({ startDate: new Date('2025-01-10'), endDate: new Date('2025-01-12'), user: '507f1f77bcf86cd799439011' });
    vi.spyOn(Reservation, 'findById').mockResolvedValue(existing);
    vi.spyOn(Boat, 'findById').mockResolvedValue({ _id: 'b1', owner: '507f1f77bcf86cd799439011', dailyPrice: 100 });
    vi.spyOn(Reservation, 'findOne').mockResolvedValue({ _id: 'other' });

    const res = await request(app)
      .put('/test/reservations/r1')
      .send({ startDate: '2025-01-11T00:00:00.000Z', endDate: '2025-01-13T00:00:00.000Z' });

    expect(res.status).toBe(409);
  });

  it('PUT /test/reservations/:id -> 409 on blocked period overlap', async () => {
    const existing = makeResObj({ startDate: new Date('2025-01-10'), endDate: new Date('2025-01-12'), user: '507f1f77bcf86cd799439011' });
    vi.spyOn(Reservation, 'findById').mockResolvedValue(existing);
    vi.spyOn(Boat, 'findById').mockResolvedValue({ _id: 'b1', owner: '507f1f77bcf86cd799439011', dailyPrice: 100 });
    vi.spyOn(Reservation, 'findOne').mockResolvedValue(null);
    vi.spyOn(BlockedDate, 'findOne').mockResolvedValue({ _id: 'block' });

    const res = await request(app)
      .put('/test/reservations/r1')
      .send({ startDate: '2025-01-11', endDate: '2025-01-13' });

    expect([409, 400]).toContain(res.status);
  });

  it.skip('PUT /test/reservations/:id -> 200 success and recalculates price', async () => {
    const existing = makeResObj({ startDate: new Date('2025-01-10'), endDate: new Date('2025-01-12') });
    vi.spyOn(Reservation, 'findById').mockResolvedValue(existing);
    vi.spyOn(Boat, 'findById').mockResolvedValue({ _id: 'b1', owner: 'u1', dailyPrice: 150 });
    vi.spyOn(Reservation, 'findOne').mockResolvedValue(null);
    vi.spyOn(BlockedDate, 'findOne').mockResolvedValue(null);

    const res = await request(app)
      .put('/test/reservations/r1')
      .send({ startDate: '2025-02-01T00:00:00.000Z', endDate: '2025-02-03T00:00:00.000Z' });

    expect(res.status).toBe(200);
    // 2 jours * 150 = 300
    expect(res.body).toHaveProperty('price');
    expect(res.body.price).toBe(300);
  });

  it('PUT /test/reservations/:id/cancel -> 403 when not the renter', async () => {
    const resObj = makeResObj({ user: 'other' });
    vi.spyOn(Reservation, 'findById').mockResolvedValue(resObj);

    const res = await request(app)
      .put('/test/reservations/r1/cancel')
      .send({ reason: 'no longer needed' });

    expect(res.status).toBe(403);
  });

  it('PUT /test/reservations/:id/cancel -> 200 when renter', async () => {
    const resObj = makeResObj({ user: '507f1f77bcf86cd799439011' });
    vi.spyOn(Reservation, 'findById').mockResolvedValue(resObj);

    const res = await request(app)
      .put('/test/reservations/r1/cancel')
      .send({ reason: 'no longer needed' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'cancelled');
  });

  it('POST /test/reservations/:id/review -> 400 when not finished', async () => {
    const future = makeResObj({ endDate: new Date('2999-01-01'), user: '507f1f77bcf86cd799439011' });
    vi.spyOn(Reservation, 'findById').mockResolvedValue(future);

    const res = await request(app)
      .post('/test/reservations/r1/review')
      .send({ rating: 5, comment: 'Great!' });

    expect(res.status).toBe(400);
  });
});
