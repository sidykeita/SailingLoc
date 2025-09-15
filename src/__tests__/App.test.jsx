import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import App from '../App';

// Test simple pour vérifier que l'App se charge correctement
describe('App Component', () => {
  it('devrait se rendre sans erreur', () => {
    // Envelopper App dans BrowserRouter car il utilise probablement des routes
    render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Vérification simple que l'application se charge
    expect(document.body).toBeDefined();
  });
});
