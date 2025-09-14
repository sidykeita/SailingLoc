import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';

let authController;
beforeAll(async () => {
  authController = await import('../../src/controllers/authController');
});

beforeEach(() => {
  vi.restoreAllMocks();
});

const makeRes = () => {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  return res;
};

// Importer le vrai modèle et espionner ses méthodes (évite les timeouts Mongoose)
import User from '../../src/models/user.js';

describe.skip('authController.login', () => {
  it('401 si mauvais mot de passe', async () => {
    const fakeUser = {
      _id: 'u1',
      toObject: () => ({ _id: 'u1', email: 'a@a.com', password: 'hash' }),
      comparePassword: vi.fn().mockResolvedValue(false),
    };
    vi.spyOn(User, 'findOne').mockReturnValue({ select: vi.fn().mockResolvedValue(fakeUser) });

    const req = { body: { email: 'a@a.com', password: 'wrong' } };
    const res = makeRes();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json.mock.calls[0][0]).toHaveProperty('message');
  });

  it('401 si champs manquants (pas d\'email)', async () => {
    vi.spyOn(User, 'findOne').mockReturnValue({ select: vi.fn().mockResolvedValue(null) });

    const req = { body: { password: 'x' } };
    const res = makeRes();

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});
