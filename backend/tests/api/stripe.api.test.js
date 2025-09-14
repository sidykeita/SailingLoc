import { describe, it, expect, beforeAll, vi } from 'vitest';
import request from 'supertest';

// Ensure Stripe mock returns a session with metadata so confirmPayment doesn't need DB fallback
global.__stripeMock.checkout.sessions.retrieve.mockResolvedValue({
  id: 'cs_test_123',
  payment_status: 'paid',
  metadata: { reservationId: 'r1' },
  payment_intent: 'pi_123'
});

// Mock Reservation and Payment models
const reservationState = { paid: false };
vi.mock('../../src/models/reservation', () => {
  const api = {
    findById: vi.fn(async (id) => {
      if (id === 'r1') return { _id: 'r1', paymentStatus: reservationState.paid ? 'paid' : 'unpaid' };
      return null;
    }),
    findByIdAndUpdate: vi.fn(async (_id, update) => {
      if (update?.$set?.paymentStatus === 'paid') reservationState.paid = true;
      return { _id: 'r1', paymentStatus: 'paid', paymentSessionId: 'cs_test_123', paymentIntentId: 'pi_123' };
    }),
    findOne: vi.fn(async () => null)
  };
  return { default: api, ...api };
});

vi.mock('../../src/models/payment', () => {
  const api = {
    create: vi.fn(async (data) => ({ _id: 'pay1', ...data }))
  };
  return { default: api, ...api };
});

let app;
beforeAll(async () => {
  app = (await import('../../src/app.js')).default;
});

describe('Stripe API - confirm', () => {
  it('POST /api/stripe/confirm confirms payment and updates reservation', async () => {
    const res = await request(app)
      .post('/api/stripe/confirm?session_id=cs_test_123')
      .expect(200);

    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('reservation');
    expect(res.body.reservation.paymentStatus).toBe('paid');
    expect(res.body).toHaveProperty('payment');
  });

  it('POST /api/stripe/confirm returns 400 when session_id missing', async () => {
    const res = await request(app)
      .post('/api/stripe/confirm')
      .expect(400);
    expect(res.body).toHaveProperty('message');
  });
});