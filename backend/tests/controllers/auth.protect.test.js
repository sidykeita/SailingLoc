import { describe, it, expect, vi, beforeEach } from 'vitest';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';

// Import real model and spy on it so controller uses the spied method
import User from '../../src/models/user.js';

let authController;
beforeEach(async () => {
  vi.resetModules();
  vi.restoreAllMocks();
  ({ default: authController, ...authController } = await import('../../src/controllers/authController'));
});

const makeRes = () => {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  return res;
};

const makeNext = () => vi.fn();

import jwt from 'jsonwebtoken';

describe('authController.protect', () => {
  it('calls next and sets req.user when token valid', async () => {
    const token = jwt.sign({ id: 'u1' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = makeRes();
    const next = makeNext();

    vi.spyOn(User, 'findById').mockResolvedValue({ _id: 'u1', toObject: () => ({ _id: 'u1' }) });

    await authController.protect(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeTruthy();
  });

  it('401 when no token', async () => {
    const req = { headers: {} };
    const res = makeRes();
    const next = makeNext();

    await authController.protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
  });

  it('401 when token invalid', async () => {
    const req = { headers: { authorization: 'Bearer invalid.token' } };
    const res = makeRes();
    const next = makeNext();

    // userMock not used because jwt.verify will throw
    await authController.protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
  });
});
