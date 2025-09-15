import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

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