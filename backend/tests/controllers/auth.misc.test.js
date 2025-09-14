import { describe, it, expect, vi, beforeAll } from 'vitest';

process.env.NODE_ENV = 'test';

let authController;

beforeAll(async () => {
  ({ default: authController, ...authController } = await import('../../src/controllers/authController'));
});

const makeRes = () => {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  res.end = vi.fn(() => res);
  return res;
};

describe('authController misc', () => {
  it('logout returns 200', async () => {
    const req = {};
    const res = makeRes();

    await authController.logout(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('getCurrentUser returns 401 if no user', async () => {
    const req = {};
    const res = makeRes();

    await authController.getCurrentUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('getCurrentUser returns 200 if user present', async () => {
    const req = { user: { toObject: () => ({ _id: 'u1', email: 'a@a.com', password: 'x' }) } };
    const res = makeRes();

    await authController.getCurrentUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});
