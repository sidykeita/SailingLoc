import { describe, it, expect, beforeAll, vi } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
<<<<<<< HEAD

// In-memory mock for ContractualDocument model (constructor + statics)
vi.mock('../../src/models/contractualDocument', () => {
  const store = [];
  let seq = 1;
  function ContractualDocument(data) {
    Object.assign(this, data);
    this._id = this._id || `doc${seq++}`;
    this.uploadedAt = this.uploadedAt || new Date();
    this.save = vi.fn(async () => {
      const idx = store.findIndex(d => d._id === this._id);
      if (idx >= 0) store[idx] = this; else store.push(this);
      return this;
    });
  }
  ContractualDocument.findOneAndDelete = vi.fn(async ({ userId, documentType }) => {
    const idx = store.findIndex(d => d.userId === userId && d.documentType === documentType);
    if (idx >= 0) { const [removed] = store.splice(idx, 1); return removed; }
    return null;
  });
  ContractualDocument.find = vi.fn(async ({ userId }) => {
    return store
      .filter(d => d.userId === userId)
      .sort((a, b) => (b.uploadedAt?.getTime?.() || 0) - (a.uploadedAt?.getTime?.() || 0));
  });
  ContractualDocument.findOne = vi.fn(async ({ _id, userId }) => {
    return store.find(d => d._id === _id && d.userId === userId) || null;
  });
  ContractualDocument.findByIdAndDelete = vi.fn(async (id) => {
    const idx = store.findIndex(d => d._id === id);
    if (idx >= 0) { const [removed] = store.splice(idx, 1); return removed; }
    return null;
  });
  return { default: ContractualDocument, ...ContractualDocument };
});
=======
import { fileURLToPath } from 'url';
import path from 'path';

const userId = '507f1f77bcf86cd799439011';
>>>>>>> acbb43b (update test)

let app;
let token;
beforeAll(async () => {
<<<<<<< HEAD
  app = (await import('../../src/app.js')).default;
  token = jwt.sign({ id: 'u1', _id: 'u1' }, process.env.JWT_SECRET || 'test-jwt-secret');
=======
  // Reset module graph and re-apply global setup mocks
  vi.resetModules();
  await import('../setup.js');

  // Prepare absolute paths for CJS requires
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const authMiddlewarePath = path.resolve(__dirname, '../../src/middlewares/authMiddleware.js');
  const docModelPath = path.resolve(__dirname, '../../src/models/contractualDocument.js');

  // Mock auth middleware (absolute path to match require in routes)
  vi.doMock(authMiddlewarePath, () => {
    return (req, _res, next) => { req.user = { id: userId }; next(); };
  });

  // In-memory mock for ContractualDocument model (constructor + statics) - absolute path
  const store = [];
  let seq = 1;
  vi.doMock(docModelPath, () => {
    function ContractualDocument(data) {
      Object.assign(this, data);
      this._id = this._id || `doc${seq++}`;
      this.uploadedAt = this.uploadedAt || new Date();
      this.save = vi.fn(async () => {
        const idx = store.findIndex(d => d._id === this._id);
        if (idx >= 0) store[idx] = this; else store.push(this);
        return this;
      });
    }
    ContractualDocument.findOneAndDelete = vi.fn(async ({ userId, documentType }) => {
      const idx = store.findIndex(d => d.userId === userId && d.documentType === documentType);
      if (idx >= 0) { const [removed] = store.splice(idx, 1); return removed; }
      return null;
    });
    ContractualDocument.find = vi.fn(async ({ userId }) => {
      return store
        .filter(d => d.userId === userId)
        .sort((a, b) => (b.uploadedAt?.getTime?.() || 0) - (a.uploadedAt?.getTime?.() || 0));
    });
    ContractualDocument.findOne = vi.fn(async ({ _id, userId }) => {
      return store.find(d => d._id === _id && d.userId === userId) || null;
    });
    ContractualDocument.findByIdAndDelete = vi.fn(async (id) => {
      const idx = store.findIndex(d => d._id === id);
      if (idx >= 0) { const [removed] = store.splice(idx, 1); return removed; }
      return null;
    });
    return { default: ContractualDocument, ...ContractualDocument };
  });

  const mod = await import('../../src/app.js');
  app = mod.default || mod;
  token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'test-jwt-secret');
>>>>>>> acbb43b (update test)
});

describe('Contractual Documents API', () => {
  let createdId;

  it('POST /api/contractual-documents/upload-url creates metadata', async () => {
    const payload = {
      documentType: 'contratLocation',
      firebaseUrl: 'https://example.com/contrat.pdf',
      firebasePath: 'contractual-documents/u1/contratLocation_u1_1.pdf',
      originalName: 'contrat.pdf',
      fileSize: 12345,
      mimeType: 'application/pdf'
    };
    const res = await request(app)
      .post('/api/contractual-documents/upload-url')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(201);

    expect(res.body).toMatchObject({
      userId: 'u1',
      documentType: 'contratLocation',
      firebaseUrl: payload.firebaseUrl,
      firebasePath: payload.firebasePath
    });
    expect(res.body).toHaveProperty('_id');
    createdId = res.body._id;
  });

  it('GET /api/contractual-documents returns user docs', async () => {
    const res = await request(app)
      .get('/api/contractual-documents')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('DELETE /api/contractual-documents/:id removes a document', async () => {
    const res = await request(app)
      .delete(`/api/contractual-documents/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toHaveProperty('message');

    const after = await request(app)
      .get('/api/contractual-documents')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    // Could be 0 if only one existed
    expect(Array.isArray(after.body)).toBe(true);
  });
});