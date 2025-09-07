// Clés publiques Stripe (à remplacer par vos propres clés en production)
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51P...';
const STRIPE_SECRET_KEY = import.meta.env.VITE_STRIPE_SECRET_KEY || 'sk_test_51P...';

// Options de configuration Stripe
const STRIPE_CONFIG = {
  // Devise par défaut (EUR pour euros)
  currency: 'EUR',
  
  // Options d'API Stripe
  apiVersion: '2023-10-16', // Version de l'API Stripe à utiliser
  
  // Options de localisation
  locale: 'fr', // Français
  
  // Options de style pour les éléments de paiement
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
};

export { STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY, STRIPE_CONFIG };
