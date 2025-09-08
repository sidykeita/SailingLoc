import api from './api.service';

/**
 * Create a Stripe Checkout Session and return the redirect URL.
 * amount: number in cents
 * currency: 'eur' by default
 * description: product/booking description
 * metadata: object with ids (e.g., reservationId, userId, boatId)
 */
export async function createCheckout({ amount, currency = 'eur', description, metadata = {} }) {
  const { data } = await api.post('/stripe/create-checkout-session', {
    amount,
    currency,
    description,
    metadata,
  });
  return data; // { id, url }
}

/**
 * Helper to start the redirect to the Stripe-hosted Checkout page
 */
export async function redirectToCheckout(params) {
  const { url } = await createCheckout(params);
  if (url) {
    window.location.href = url;
  } else {
    throw new Error('URL de paiement non disponible');
  }
}

/**
 * Create checkout session for a reservation and redirect
 */
export async function payReservation(reservationId) {
  const { data } = await api.post(`/stripe/reservations/${reservationId}/checkout`);
  if (data?.url) {
    window.location.href = data.url;
  } else {
    throw new Error('URL de paiement non disponible');
  }
}
