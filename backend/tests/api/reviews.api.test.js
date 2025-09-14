import request from 'supertest';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

process.env.NODE_ENV = 'test';

let app;
beforeAll(async () => {
  ({ default: app } = await import('../../src/appTest.js'));
});

import Review from '../../src/models/review.js';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('Reviews API', () => {
  it('POST /api/reviews -> 201 created', async () => {
    vi.spyOn(Review, 'create').mockResolvedValue({ _id: 'rev1', rating: 5 });

    const res = await request(app)
      .post('/api/reviews')
      .send({ reservation: 'r1', user: 'u1', rating: 5, comment: 'Top' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id', 'rev1');
  });

  it('POST /api/reviews -> 409 duplicate error', async () => {
    vi.spyOn(Review, 'create').mockRejectedValue({ code: 11000 });

    const res = await request(app)
      .post('/api/reviews')
      .send({ reservation: 'r1', user: 'u1', rating: 4 });

    expect(res.status).toBe(409);
  });

  it('GET /api/reviews -> 200 list with tenant filter', async () => {
    const sample = [
      { _id: 'ra', reservation: { user: 'u1', boat: 'b1' } },
      { _id: 'rb', reservation: { user: 'u2', boat: 'b1' } },
    ];
    vi.spyOn(Review, 'find').mockReturnValue({
      populate: vi.fn(() => ({
        populate: vi.fn(() => ({ populate: vi.fn(), exec: vi.fn().mockResolvedValue(sample) })),
      })),
    });

    const res = await request(app).get('/api/reviews').query({ tenant: 'u1' });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // Filter should keep only reviews where reservation.user == 'u1'
    expect(res.body.every(r => (r.reservation?.user ?? r.reservation?.user?._id) === 'u1')).toBe(true);
  });

  it('GET /api/reviews/user/my-reviews -> 200 for authenticated user', async () => {
    vi.spyOn(Review, 'find').mockReturnValue({
      populate: vi.fn(() => ({ populate: vi.fn(), exec: vi.fn().mockResolvedValue([{ _id: 'rx' }]) })),
    });

    const res = await request(app).get('/api/reviews/user/my-reviews');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/reviews/:id -> 200 when found', async () => {
    vi.spyOn(Review, 'findById').mockResolvedValue({ _id: 'rev1' });
    const res = await request(app).get('/api/reviews/rev1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', 'rev1');
  });

  it('GET /api/reviews/:id -> 404 when not found', async () => {
    vi.spyOn(Review, 'findById').mockResolvedValue(null);
    const res = await request(app).get('/api/reviews/rev404');
    expect(res.status).toBe(404);
  });

  it('PUT /api/reviews/:id -> 200 update and 404 not found', async () => {
    vi.spyOn(Review, 'findByIdAndUpdate')
      .mockResolvedValueOnce({ _id: 'rev1', rating: 3 })
      .mockResolvedValueOnce(null);

    const ok = await request(app).put('/api/reviews/rev1').send({ rating: 3 });
    expect(ok.status).toBe(200);

    const nf = await request(app).put('/api/reviews/rev404').send({ rating: 3 });
    expect(nf.status).toBe(404);
  });

  it('DELETE /api/reviews/:id -> 200 and 404', async () => {
    vi.spyOn(Review, 'findByIdAndDelete')
      .mockResolvedValueOnce({ _id: 'rev1' })
      .mockResolvedValueOnce(null);

    const ok = await request(app).delete('/api/reviews/rev1');
    expect(ok.status).toBe(200);

    const nf = await request(app).delete('/api/reviews/rev404');
    expect(nf.status).toBe(404);
  });

  it('POST /api/reviews/:id/response -> 200 owner response added', async () => {
    const toUpdate = { _id: 'rev1', save: vi.fn().mockResolvedValue(true) };

    vi.spyOn(Review, 'findById')
      .mockResolvedValueOnce(toUpdate) // first call in controller
      .mockReturnValueOnce({
        populate: vi.fn(() => ({ exec: vi.fn().mockResolvedValue({ _id: 'rev1', ownerResponse: { text: 'ok' } }) })),
      });

    const res = await request(app)
      .post('/api/reviews/rev1/response')
      .send({ text: 'Merci !' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', 'rev1');
  });
});
