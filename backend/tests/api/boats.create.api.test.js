import request from 'supertest';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

process.env.NODE_ENV = 'test';

let app;
beforeAll(async () => {
  ({ default: app } = await import('../../src/appTest.js'));
});

import Boat from '../../src/models/boat.js';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('Boats create API', () => {
  it('POST /api/boats -> 201 quand création OK', async () => {
    const created = { _id: 'b1', name: 'New Boat' };
    vi.spyOn(Boat, 'create').mockResolvedValue(created);

    const res = await request(app)
      .post('/api/boats')
      .send({ name: 'New Boat', model: 'X', type: 'motor', port: 'Nice', length: 10, capacity: 4, cabins: 2, skipper: false, dailyPrice: 100, owner: 'u1' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ _id: 'b1', name: 'New Boat' });
  });

  it('POST /api/boats -> 400 quand validation/erreur', async () => {
    vi.spyOn(Boat, 'create').mockRejectedValue(new Error('validation failed'));

    const res = await request(app)
      .post('/api/boats')
      .send({ name: 'Incomplete' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});
