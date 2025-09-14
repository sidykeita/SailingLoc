import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

<<<<<<< HEAD
// In-memory favorites state and mocked User model
const state = { favorites: [] };
vi.mock('../../src/models/user', () => {
  const api = {
    findById: vi.fn(() => ({
      _id: 'u1',
      id: 'u1',
      populate: () => ({ favorites: [...state.favorites] })
    })),
    findByIdAndUpdate: vi.fn((_id, update) => {
      if (update?.$addToSet?.favorites) {
        const id = update.$addToSet.favorites;
        if (!state.favorites.includes(id)) state.favorites.push(id);
      }
      if (update?.$pull?.favorites) {
        const id = update.$pull.favorites;
        state.favorites = state.favorites.filter(x => x !== id);
      }
      return {
        populate: () => ({ favorites: [...state.favorites] })
      };
    })
  };
  return { default: api, ...api };
});
=======
const userId = '507f1f77bcf86cd799439011';
>>>>>>> acbb43b (update test)

let app;
let token;
beforeAll(async () => {
  const mod = await import('../../src/app.js');
  app = mod.default || mod;
  token = jwt.sign({ id: 'u1' }, process.env.JWT_SECRET || 'test-jwt-secret');
});

describe('Favorites API', () => {
  it('GET /api/favorites returns empty list initially', async () => {
    const res = await request(app)
      .get('/api/favorites')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/favorites/:boatId adds a favorite and returns updated list', async () => {
    const res = await request(app)
      .post('/api/favorites/boat123')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toEqual(['boat123']);
  });

  it('DELETE /api/favorites/:boatId removes a favorite and returns updated list', async () => {
    await request(app)
      .post('/api/favorites/boat123')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const res = await request(app)
      .delete('/api/favorites/boat123')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toEqual([]);
  });
});