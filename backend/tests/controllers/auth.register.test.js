import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';

// Mocks avant import du controller
const userMock = {
  findOne: vi.fn(),
  create: vi.fn(),
};
vi.mock('../../src/models/user', () => ({ default: userMock, ...userMock }));

const docMock = { insertMany: vi.fn() };
vi.mock('../../src/models/contractualDocument', () => ({ default: docMock, ...docMock }));

const sessionMock = {
  startTransaction: vi.fn(),
  commitTransaction: vi.fn(),
  abortTransaction: vi.fn(),
  endSession: vi.fn(),
};
vi.mock('mongoose', async () => {
  const actual = await vi.importActual('mongoose');
  return { ...actual, startSession: vi.fn().mockResolvedValue(sessionMock) };
});

let authController;
beforeAll(async () => {
  authController = await import('../../src/controllers/authController');
});

beforeEach(() => {
  vi.restoreAllMocks();
  sessionMock.startTransaction.mockClear();
});

const makeRes = () => {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  return res;
};

describe.skip('authController.register', () => {
  it('201 happy path propriétaire avec documents', async () => {
    userMock.findOne.mockResolvedValue(null);
    const created = { _id: 'u1', toObject: () => ({ _id: 'u1', email: 'a@a.com', password: 'hash' }) };
    userMock.create.mockResolvedValue([created]);
    docMock.insertMany.mockResolvedValue([]);

    const req = {
      body: {
        firstName: 'A', lastName: 'B', email: 'a@a.com', password: 'pwd', phone: '1',
        role: 'propriétaire', ownerStatus: 'particulier',
        documents: [
          { documentType: 'contratLocation', firebasePath: 'p/1', firebaseUrl: 'u' },
          { documentType: 'attestationAssurance', firebasePath: 'p/2', firebaseUrl: 'u' },
          { documentType: 'cvMarin', firebasePath: 'p/3', firebaseUrl: 'u' },
          { documentType: 'permisBateau', firebasePath: 'p/4', firebaseUrl: 'u' },
        ],
      },
    };
    const res = makeRes();

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
    const payload = res.json.mock.calls[0][0];
    expect(payload).toHaveProperty('token');
    expect(payload).toHaveProperty('user');
  });

  it('400 si email déjà utilisé', async () => {
    userMock.findOne.mockResolvedValue({ _id: 'uExisting' });

    const req = { body: { email: 'exists@a.com', password: 'x' } };
    const res = makeRes();

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0]).toHaveProperty('message');
  });
});
