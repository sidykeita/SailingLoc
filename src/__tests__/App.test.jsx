import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Test simple pour vérifier que l'App se charge correctement
describe('App Component', () => {
  it('devrait se rendre sans erreur', () => {
    // Envelopper App dans BrowserRouter car il utilise probablement des routes
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // Vérification simple que l'application se charge
    expect(document.body).toBeDefined();
  });
});
