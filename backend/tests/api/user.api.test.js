import request from 'supertest';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

process.env.NODE_ENV = 'test';
// Mock Payment model to avoid Mongoose model recompilation and casting
const paymentMock = { deleteMany: vi.fn() };
vi.mock('../../src/models/payment', () => ({ default: paymentMock, ...paymentMock }));

let app;
beforeAll(async () => {
  ({ default: app } = await import('../../src/appTest.js'));
});

import User from '../../src/models/user.js';
import Reservation from '../../src/models/reservation.js';
import Boat from '../../src/models/boat.js';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('User API via /test endpoints', () => {
  it('GET /test/auth/users -> 200 list', async () => {
    vi.spyOn(User, 'find').mockReturnValue({ select: vi.fn().mockResolvedValue([{ _id: 'u1' }]) });

    const res = await request(app).get('/test/auth/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /test/auth/users/:id -> 200 when found', async () => {
    vi.spyOn(User, 'findById').mockReturnValue({ select: vi.fn().mockResolvedValue({ _id: 'u1' }) });

    const res = await request(app).get('/test/auth/users/u1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', 'u1');
  });

  it('PUT /test/auth/users/:id -> 200 update', async () => {
    vi.spyOn(User, 'findByIdAndUpdate').mockReturnValue({
      select: vi.fn().mockResolvedValue({ _id: 'u1', email: 'new@test.com' })
    });

    const res = await request(app)
      .put('/test/auth/users/u1')
      .send({ email: 'new@test.com' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('email', 'new@test.com');
  });

  it('PATCH /test/auth/users/:id/profile -> 404 when user missing', async () => {
    vi.spyOn(User, 'findByIdAndUpdate').mockReturnValue({
      select: vi.fn().mockResolvedValue(null)
    });

    const res = await request(app)
      .patch('/test/auth/users/u404/profile')
      .send({ email: 'x@test.com' });
    expect(res.status).toBe(404);
  });

  it('DELETE /test/auth/users/:id -> 200 delete', async () => {
    vi.spyOn(User, 'findByIdAndDelete').mockResolvedValue({ _id: 'u1' });

    const res = await request(app).delete('/test/auth/users/u1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it.skip('DELETE /test/auth/me (locataire) -> 200 and cascades reservations & payments', async () => {
    const userWithPassword = {
      _id: 'u1',
      role: 'locataire',
      isDeleted: false,
      comparePassword: vi.fn().mockResolvedValue(true),
    };
    vi.spyOn(User, 'findById').mockReturnValue({ select: vi.fn().mockResolvedValue(userWithPassword) });
    vi.spyOn(Reservation, 'find').mockReturnValue({
      select: vi.fn().mockResolvedValue([
        { _id: '64b5f8e2d1a7c3b5f0a1b2c3' },
        { _id: '64b5f8e2d1a7c3b5f0a1b2c4' },
      ])
    });
    vi.spyOn(Payment, 'deleteMany').mockResolvedValue({ deletedCount: 2 });
    vi.spyOn(Reservation, 'deleteMany').mockResolvedValue({ deletedCount: 2 });
    vi.spyOn(User, 'findByIdAndDelete').mockResolvedValue({ _id: 'u1' });

    const res = await request(app)
      .delete('/test/auth/me')
      .send({ currentPassword: 'secret' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('details');
    expect(res.body.details).toHaveProperty('deletedReservations');
    expect(res.body.details).toHaveProperty('deletedPayments');
  });

  it('DELETE /test/auth/me (propriétaire) -> 200 and sets boats unavailable', async () => {
    const userWithPassword = {
      _id: 'u1',
      role: 'propriétaire',
      isDeleted: false,
      comparePassword: vi.fn().mockResolvedValue(true),
    };
    vi.spyOn(User, 'findById').mockReturnValue({ select: vi.fn().mockResolvedValue(userWithPassword) });
    vi.spyOn(Boat, 'updateMany').mockResolvedValue({ modifiedCount: 3 });
    vi.spyOn(User, 'findByIdAndDelete').mockResolvedValue({ _id: 'u1' });

    const res = await request(app)
      .delete('/test/auth/me')
      .send({ currentPassword: 'secret' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('details');
    expect(res.body.details).toHaveProperty('updatedBoats', 3);
  });

  it('DELETE /test/auth/me -> 400 when password missing', async () => {
    const res = await request(app)
      .delete('/test/auth/me')
      .send({});
    expect(res.status).toBe(400);
  });
});
