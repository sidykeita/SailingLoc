import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mocks avant import d'App
vi.mock('../config/recaptcha', () => ({ RECAPTCHA_SITE_KEY: 'test-key', isRecaptchaEnabled: false }));
vi.mock('../lib/api', () => ({ API_URL: 'http://localhost:5000/api' }));
vi.mock('../services/firebase.js', () => ({ storage: {} }));
vi.mock('../firebase', () => ({ storage: {} }));
vi.mock('firebase/storage', () => ({ ref: vi.fn(), uploadBytes: vi.fn(), getDownloadURL: vi.fn() }));
vi.mock('../pages/auth/Login.jsx', () => ({ default: () => null }));
vi.mock('../pages/boats/AddBoat.jsx', () => ({ default: () => null }));
vi.mock('../pages/boats/EditBoat.jsx', () => ({ default: () => null }));
vi.mock('../pages/dashboard/SimpleDashboard.jsx', () => ({ default: () => null }));
vi.mock('../contexts/AuthContext', () => ({ useAuth: () => ({ currentUser: null, userRole: 'tenant', loading: false }) }));
// Mock Home pour une assertion simple
vi.mock('../pages/home/Home.jsx', () => ({ default: () => <div>Accueil</div> }));

import App from '../App';

describe('Routing (smoke)', () => {
  it('affiche Accueil sur la route /', () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Accueil')).toBeInTheDocument();
  });

  it('redirige les routes inconnues vers / (Accueil)', () => {
    render(
      <MemoryRouter initialEntries={["/route-inconnue"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Accueil')).toBeInTheDocument();
  });
});
