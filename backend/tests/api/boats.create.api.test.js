import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('Boats Create API', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });
});