import request from 'supertest';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

process.env.NODE_ENV = 'test';
process.env.STRIPE_SECRET_KEY = 'sk_test_123';
process.env.FRONTEND_URL = 'http://localhost:5173';

// Centralized Stripe mocks so we can change return values per test
const sessionsCreate = vi.fn();
const sessionsRetrieve = vi.fn();
const intentsRetrieve = vi.fn();
const constructEvent = vi.fn();

// Provide a global mock so stripeController uses it via getStripe()
global.__stripeMock = {
  checkout: { sessions: { create: sessionsCreate, retrieve: sessionsRetrieve, list: vi.fn().mockResolvedValue({ data: [] }) } },
  paymentIntents: { retrieve: intentsRetrieve },
  webhooks: { constructEvent },
};

let app;
beforeAll(async () => {
  ({ default: app } = await import('../../src/appTest.js'));
});

import Reservation from '../../src/models/reservation.js';
import Payment from '../../src/models/payment.js';

beforeEach(() => {
  vi.restoreAllMocks();
  sessionsCreate.mockReset();
  sessionsRetrieve.mockReset();
  intentsRetrieve.mockReset();
  constructEvent.mockReset();
});

describe('Stripe API', () => {
  it('POST /api/stripe/create-checkout-session -> 200 returns id and url', async () => {
    sessionsCreate.mockResolvedValue({ id: 'cs_test_1', url: 'https://stripe/checkout/1' });

    const res = await request(app)
      .post('/api/stripe/create-checkout-session')
      .send({ amount: 1500, currency: 'eur', description: 'Test' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 'cs_test_1');
    expect(res.body).toHaveProperty('url');
  });

  it('POST /api/stripe/reservations/:id/checkout -> 200 when reservation exists', async () => {
    const reservation = {
      _id: '64b5f8e2d1a7c3b5f0a1b2d9',
      price: 120,
      startDate: '2025-01-02',
      endDate: '2025-01-05',
      boat: { _id: 'b1' },
      user: { _id: 'u1', role: 'locataire' },
    };
    vi.spyOn(Reservation, 'findById').mockReturnValue({ populate: vi.fn().mockResolvedValue(reservation) });
    sessionsCreate.mockResolvedValue({ id: 'cs_test_2', url: 'https://stripe/checkout/2' });

    const res = await request(app)
      .post('/api/stripe/reservations/64b5f8e2d1a7c3b5f0a1b2d9/checkout')
      .send({});

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 'cs_test_2');
  });

  it('POST /api/stripe/confirm -> 200 confirms payment and creates Payment record', async () => {
    sessionsRetrieve.mockResolvedValue({
      id: 'cs_test_3',
      payment_status: 'paid',
      metadata: { reservationId: '64b5f8e2d1a7c3b5f0a1b2aa' },
      payment_intent: 'pi_123',
      amount_total: 15000,
    });

    vi.spyOn(Reservation, 'findById').mockResolvedValue({ _id: '64b5f8e2d1a7c3b5f0a1b2aa', paymentStatus: 'pending' });
    vi.spyOn(Reservation, 'findOne').mockReturnValue({ select: vi.fn().mockResolvedValue(null) });
    vi.spyOn(Reservation, 'findByIdAndUpdate').mockResolvedValue({ _id: '64b5f8e2d1a7c3b5f0a1b2aa', paymentStatus: 'paid' });
    vi.spyOn(Payment, 'create').mockResolvedValue({ _id: 'pay1' });

    const res = await request(app)
      .post('/api/stripe/confirm')
      .query({ session_id: 'cs_test_3' })
      .send({});

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('reservation');
  });
});
