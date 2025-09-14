import { test, expect } from '@playwright/test';
import { login } from './utils/auth';
import { applyFilters } from './utils/filter';

// NOTE: Assumes a tenant account exists with these credentials in the test env.
const TENANT = { email: process.env.E2E_TENANT_EMAIL || 'tenant@test.com', password: process.env.E2E_TENANT_PASSWORD || 'password' };

test('Locataire – recherche, filtrage, détail, réservation (Stripe mock)', async ({ page }) => {
  // Mock Stripe API calls from frontend to keep tests offline
  await page.route('**/api/stripe/**', async route => {
    const url = route.request().url();
    if (url.endsWith('/confirm')) {
      return route.fulfill({ status: 200, body: JSON.stringify({ ok: true, status: 'paid' }) });
    }
    return route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
  });

  await login(page, TENANT.email, TENANT.password);

  // Aller à la page de recherche/liste
  await page.goto('/boats');

  // Appliquer les filtres cohérents avec les règles métier
  await applyFilters(page, { port: 'Marseille', start: '2025-01-11', end: '2025-01-13' });

  // Vérifier qu'au moins un bateau est proposé
  const cards = page.getByTestId('boat-card');
  await expect(cards).toHaveCountGreaterThan(0);

  // Ouvrir une fiche bateau
  await cards.first().click();
  await expect(page).toHaveURL(/boat\//);

  // Lancer le flux de réservation
  const reserveBtn = page.getByRole('button', { name: /r[ée]server/i });
  await expect(reserveBtn).toBeVisible();
  await reserveBtn.click();

  // Simuler paiement/confirmation (mock stripe ci-dessus)
  const payBtn = page.getByRole('button', { name: /payer|confirmer/i });
  if (await payBtn.count()) await payBtn.click();

  // Vérifier confirmation UI
  await expect(page.getByText(/r[ée]servation.*confirm[ée]/i)).toBeVisible();
});
