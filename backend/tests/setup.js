// Test setup file for backend tests
import { vi } from 'vitest';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/sailingloc-test';

// Global mocks for external services
global.__stripeMock = {
  checkout: {
    sessions: {
      create: vi.fn().mockResolvedValue({ id: 'cs_test_123', url: 'https://checkout.stripe.com/test' }),
      retrieve: vi.fn().mockResolvedValue({ id: 'cs_test_123', payment_status: 'paid' })
    }
  },
  paymentIntents: {
    create: vi.fn().mockResolvedValue({ id: 'pi_test_123', status: 'succeeded' })
  }
};

// Mock Firebase Admin - both default and named exports
const mockFirebaseAdmin = {
  initializeApp: vi.fn(),
  apps: [],
  credential: {
    cert: vi.fn()
  },
  storage: vi.fn(() => ({
    bucket: vi.fn(() => ({
      file: vi.fn(() => ({
        save: vi.fn().mockResolvedValue(),
        delete: vi.fn().mockResolvedValue(),
        getSignedUrl: vi.fn().mockResolvedValue(['https://example.com/file.pdf'])
      }))
    }))
  }))
};

vi.mock('firebase-admin', () => mockFirebaseAdmin);

// Mock Multer
vi.mock('multer', () => ({
  default: vi.fn(() => ({
    single: vi.fn(() => (req, res, next) => next()),
    array: vi.fn(() => (req, res, next) => next()),
    fields: vi.fn(() => (req, res, next) => next()),
    none: vi.fn(() => (req, res, next) => next()),
    any: vi.fn(() => (req, res, next) => next())
  })),
  memoryStorage: vi.fn(),
  diskStorage: vi.fn()
}));

// Mock UUID
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'test-uuid-123')
}));

// Mock Mongoose to avoid database connection
vi.mock('mongoose', () => ({
  connect: vi.fn().mockResolvedValue(),
  connection: {
    on: vi.fn(),
    once: vi.fn()
  },
  Schema: vi.fn(),
  model: vi.fn()
}));

// Mock Stripe - return a callable constructor for both CJS and ESM
vi.mock('stripe', () => {
  const StripeCtor = vi.fn(() => global.__stripeMock);
  // Attach default for ESM default import compatibility
  StripeCtor.default = StripeCtor;
  return StripeCtor;
});