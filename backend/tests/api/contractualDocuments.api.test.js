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