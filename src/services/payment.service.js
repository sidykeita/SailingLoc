import axios from 'axios';
import { STRIPE_SECRET_KEY } from '../config/stripe';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Créer un client de paiement
const createPaymentIntent = async (bookingData) => {
  try {
    const response = await axios.post(
      `${API_URL}/payments/create-payment-intent`,
      bookingData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du PaymentIntent:', error);
    throw error.response?.data?.error || 'Une erreur est survenue lors de la création du paiement';
  }
};

// Confirmer un paiement réussi
const confirmPayment = async (paymentIntentId, bookingId) => {
  try {
    const response = await axios.post(
      `${API_URL}/payments/confirm`,
      { paymentIntentId, bookingId },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la confirmation du paiement:', error);
    throw error.response?.data?.error || 'Une erreur est survenue lors de la confirmation du paiement';
  }
};

// Récupérer l'historique des paiements d'un utilisateur
const getPaymentHistory = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/payments/history`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique des paiements:', error);
    throw error.response?.data?.error || 'Une erreur est survenue lors de la récupération de l\'historique des paiements';
  }
};

// Rembourser un paiement
const refundPayment = async (paymentIntentId) => {
  try {
    const response = await axios.post(
      `${API_URL}/payments/refund`,
      { paymentIntentId },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors du remboursement:', error);
    throw error.response?.data?.error || 'Une erreur est survenue lors du remboursement';
  }
};

export default {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  refundPayment
};
