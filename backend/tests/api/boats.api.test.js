import request from 'supertest';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

// Assurer l'environnement test au plus tôt
process.env.NODE_ENV = 'test';

// Mock firebase-admin et stub des modules contractuels AVANT d'importer l'app
vi.mock('firebase-admin', () => {
  const admin = {
    apps: [],
    initializeApp: vi.fn(function () {
      admin.apps.push({ name: 'mock-app' });
      return admin.apps[0];
    }),
    credential: { cert: vi.fn(() => ({})) },
    storage: vi.fn(() => ({ bucket: vi.fn() })),
  };
  return { default: admin, ...admin };
}, { virtual: true });

vi.mock('../../src/routes/contractualDocumentRoutes', () => {
  const noopRouter = (req, res, next) => next && next();
  return { default: noopRouter, ...noopRouter };
});
vi.mock('../../src/controllers/contractualDocumentController', () => {
  const ctrl = {
    uploadMiddleware: (req, res, next) => next && next(),
    uploadDocument: (req, res) => res.status(201).json({ ok: true }),
    uploadDocumentFromUrl: (req, res) => res.status(201).json({ ok: true }),
    getUserDocuments: (req, res) => res.json([]),
    deleteDocument: (req, res) => res.status(204).end(),
  };
  return { default: ctrl, ...ctrl };
});

let app;
beforeAll(async () => {
  ({ default: app } = await import('../../src/appTest.js'));
});

// Importer les modèles réels puis les monkey-patcher
import Boat from '../../src/models/boat.js';
import Reservation from '../../src/models/reservation.js';

const boatsSample = [
  { _id: 'b1', name: 'Boat One', owner: 'u1' },
  { _id: 'b2', name: 'Boat Two', owner: 'u2' },
];

describe('Boats API', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('GET /api/boats -> 200 et renvoie une liste', async () => {
    vi.spyOn(Boat, 'find').mockReturnValue({
      populate: vi.fn().mockResolvedValue(boatsSample),
    });

    const res = await request(app).get('/api/boats');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0].name).toBe('Boat One');
  });

  it('GET /api/boats/available sans dates -> 400', async () => {
    // Monkey patch Reservation.find appelé dans le controller pour éviter tout accès DB
    vi.spyOn(Reservation, 'find').mockResolvedValue([]);

    const res = await request(app).get('/api/boats/available');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('GET /api/boats/:id -> 200 quand trouvé', async () => {
    const boat = { _id: 'b1', name: 'Boat One' };
    vi.spyOn(Boat, 'findById').mockResolvedValue(boat);

    const res = await request(app).get('/api/boats/b1');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ _id: 'b1', name: 'Boat One' });
  });

  it('GET /api/boats/:id -> 404 quand non trouvé', async () => {
    vi.spyOn(Boat, 'findById').mockResolvedValue(null);

    const res = await request(app).get('/api/boats/unknown');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });

  it('PUT /api/boats/:id -> 200 quand mis à jour', async () => {
    const updated = { _id: 'b1', name: 'Boat One Updated' };
    vi.spyOn(Boat, 'findByIdAndUpdate').mockResolvedValue(updated);

    const res = await request(app)
      .put('/api/boats/b1')
      .send({ name: 'Boat One Updated' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ _id: 'b1', name: 'Boat One Updated' });
  });

  it('PUT /api/boats/:id -> 404 quand non trouvé', async () => {
    vi.spyOn(Boat, 'findByIdAndUpdate').mockResolvedValue(null);

    const res = await request(app)
      .put('/api/boats/doesnotexist')
      .send({ name: 'X' });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });

  it('DELETE /api/boats/:id -> 200 quand supprimé', async () => {
    vi.spyOn(Boat, 'findByIdAndDelete').mockResolvedValue({ _id: 'b1' });

    const res = await request(app).delete('/api/boats/b1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('DELETE /api/boats/:id -> 404 quand non trouvé', async () => {
    vi.spyOn(Boat, 'findByIdAndDelete').mockResolvedValue(null);

    const res = await request(app).delete('/api/boats/none');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });
});
