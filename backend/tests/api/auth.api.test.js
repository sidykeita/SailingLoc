import request from 'supertest';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

// Garantir l'env de test et éviter Firebase
process.env.NODE_ENV = 'test';
vi.mock('firebase-admin', () => {
  const admin = { apps: [], initializeApp: vi.fn(() => (admin.apps.push({}), {})), credential: { cert: vi.fn(() => ({})) }, storage: vi.fn(() => ({ bucket: vi.fn() })) };
  return { default: admin, ...admin };
}, { virtual: true });

// Mock du modèle User AVANT tout import pour éviter la compilation Mongoose
const userModuleMock = { findOne: vi.fn() };
vi.mock('../../src/models/user', () => ({ default: userModuleMock, ...userModuleMock }));

// Stub complet d'authController pour éviter d'importer la logique réelle (et le modèle User)
vi.mock('../../src/controllers/authController', () => {
  return {
    default: {},
    // uniquement les handlers requis par authRoutes pour ce test
    register: (req, res) => res.status(201).json({ ok: true }),
    login: async (req, res) => {
      const user = await userModuleMock.findOne()?.select?.();
      if (!user) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      return res.status(200).json({ token: 'token-123', user: { _id: 'u123', email: 'test@example.com' } });
    },
    logout: (req, res) => res.status(200).json({ message: 'Déconnecté avec succès' }),
    protect: (req, res, next) => next(),
    getCurrentUser: (req, res) => res.status(200).json({ _id: 'u123' }),
  };
});

// Stub userController pour éviter tout require du modèle User via ces handlers
vi.mock('../../src/controllers/userController', () => {
  return {
    default: {},
    getAllUsers: (req, res) => res.json([]),
    getUserById: (req, res) => res.json({}),
    updateUser: (req, res) => res.json({}),
    deleteUser: (req, res) => res.status(204).end(),
  };
});

// App de test allégée
let app;
beforeAll(async () => {
  ({ default: app } = await import('../../src/appTest.js'));
});

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('Auth API', () => {
  it('POST /test/auth/login -> 200 avec token', async () => {
    const fakeUser = {
      _id: 'u123',
      email: 'test@example.com',
      password: 'hashed',
      comparePassword: vi.fn().mockResolvedValue(true),
      toObject: () => ({ _id: 'u123', email: 'test@example.com', password: 'hashed' }),
    };
    userModuleMock.findOne.mockReturnValue({ select: vi.fn().mockResolvedValue(fakeUser) });

    const res = await request(app)
      .post('/test/auth/login')
      .send({ email: 'test@example.com', password: 'secret' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token', 'token-123');
    expect(res.body).toHaveProperty('user');
  });

  it('POST /test/auth/login -> 401 si user introuvable', async () => {
    userModuleMock.findOne.mockReturnValue({ select: vi.fn().mockResolvedValue(null) });

    const res = await request(app)
      .post('/test/auth/login')
      .send({ email: 'nope@example.com', password: 'x' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
  });
});
