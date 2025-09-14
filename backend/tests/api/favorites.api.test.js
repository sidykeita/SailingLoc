import request from 'supertest';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

process.env.NODE_ENV = 'test';

let app;
beforeAll(async () => {
  ({ default: app } = await import('../../src/appTest.js'));
});

import User from '../../src/models/user.js';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('Favorites API', () => {
  it('GET /api/favorites -> 200 returns favorites array', async () => {
    vi.spyOn(User, 'findById').mockReturnValue({
      populate: vi.fn().mockResolvedValue({
        favorites: [{ _id: 'b1' }, { _id: 'b2' }],
      }),
    });

    const res = await request(app).get('/api/favorites');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/favorites/:boatId -> 200 and returns updated favorites', async () => {
    vi.spyOn(User, 'findByIdAndUpdate').mockReturnValue({
      populate: vi.fn().mockResolvedValue({ favorites: [{ _id: 'b1' }] }),
    });

    const res = await request(app).post('/api/favorites/b1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('DELETE /api/favorites/:boatId -> 200 and returns updated favorites', async () => {
    vi.spyOn(User, 'findByIdAndUpdate').mockReturnValue({
      populate: vi.fn().mockResolvedValue({ favorites: [] }),
    });

    const res = await request(app).delete('/api/favorites/b1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
