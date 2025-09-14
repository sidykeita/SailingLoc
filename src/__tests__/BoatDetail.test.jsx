import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mocks services & env
vi.mock('../lib/api', () => ({ API_URL: 'http://localhost:5000/api' }));
vi.mock('../contexts/AuthContext', () => ({ useAuth: () => ({ currentUser: { _id: 'me', role: 'tenant' } }) }));

vi.mock('../services/boat.service', () => ({
  __esModule: true,
  default: {
    getBoatById: vi.fn().mockResolvedValue({
      _id: 'boat1', name: 'Bateau Test', dailyPrice: 100, status: 'disponible', photos: [], port: 'Marseille', features: [],
    }),
  },
}));

vi.mock('../services/review.service', () => ({
  __esModule: true,
  default: {
    getReviewsByBoat: vi.fn().mockResolvedValue([
      { _id: 'rev1', rating: 5, user: 'u1', comment: 'Top', createdAt: '2025-01-01T00:00:00Z' },
    ]),
  },
}));

vi.mock('../services/blockedDate.service', () => ({
  __esModule: true,
  default: { listPublicByBoat: vi.fn().mockResolvedValue([]) },
}));

vi.mock('../services/user.service', () => ({
  __esModule: true,
  default: {
    getUserById: vi.fn().mockResolvedValue({ _id: 'u1', firstName: 'Jean', lastName: 'Dupont', profilePhotoUrl: 'https://example.com/jd.jpg' }),
    getPublicUserById: vi.fn().mockResolvedValue(null),
  },
}));

vi.mock('../services/reservation.service', () => ({
  __esModule: true,
  default: { getReservationsByBoat: vi.fn().mockResolvedValue([]) },
}));

vi.mock('../services/stripe.service', () => ({ payReservation: vi.fn().mockResolvedValue(undefined) }));

import BoatDetail from '../pages/boats/BoatDetail.jsx';

describe('BoatDetail (mini)', () => {
  it('affiche le nom du bateau', async () => {
    render(
      <MemoryRouter initialEntries={["/boats/boat1"]}>
        <Routes>
          <Route path="/boats/:id" element={<BoatDetail />} />
        </Routes>
      </MemoryRouter>
    );

    const title = await screen.findByText('Bateau Test');
    expect(title).toBeInTheDocument();
  });
});
