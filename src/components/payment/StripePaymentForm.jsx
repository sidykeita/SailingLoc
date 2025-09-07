import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_PUBLIC_KEY, STRIPE_CONFIG } from '../../config/stripe';

// Initialiser Stripe avec la clé publique
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const StripePaymentForm = ({ amount, onSuccess, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [succeeded, setSucceeded] = useState(false);
  
  const stripe = useStripe();
  const elements = useElements();

  // Créer un PaymentIntent lors du chargement du composant
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/payments/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            amount: Math.round(amount * 100), // Montant en centimes
            currency: STRIPE_CONFIG.currency,
            metadata: {
              // Ajoutez ici des métadonnées supplémentaires si nécessaire
            }
          })
        });
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Erreur lors de la création du PaymentIntent:', err);
        setPaymentError('Une erreur est survenue lors de la préparation du paiement.');
        onError && onError(err.message);
      }
    };
    
    if (amount > 0) {
      createPaymentIntent();
    }
  }, [amount, onError]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js n'a pas encore été chargé, on ne fait rien
      return;
    }
    
    setIsProcessing(true);
    setPaymentError(null);
    
    try {
      // Confirmer le paiement avec Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            // Ajoutez ici les détails de facturation si nécessaire
          },
        },
        // Rediriger l'utilisateur après un paiement réussi
        return_url: `${window.location.origin}/payment/success`,
      });
      
      if (error) {
        // Afficher l'erreur à l'utilisateur
        setPaymentError(error.message);
        onError && onError(error);
      } else if (paymentIntent.status === 'succeeded') {
        // Le paiement a réussi
        setSucceeded(true);
        onSuccess && onSuccess(paymentIntent);
      }
    } catch (err) {
      console.error('Erreur lors du traitement du paiement:', err);
      setPaymentError('Une erreur inattendue est survenue lors du traitement de votre paiement.');
      onError && onError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Options de style pour l'élément de carte
  const cardElementOptions = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
    hidePostalCode: true, // Masquer le champ de code postal si non nécessaire
  };

  if (succeeded) {
    return (
      <div className="text-center py-4">
        <div className="text-green-500 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Paiement réussi !</h3>
        <p className="text-gray-600">Votre réservation a été confirmée.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <CardElement options={cardElementOptions} />
      </div>
      
      {paymentError && (
        <div className="text-red-500 text-sm">
          {paymentError}
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || isProcessing || !clientSecret}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${(!stripe || isProcessing || !clientSecret) ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
      >
        {isProcessing ? 'Traitement en cours...' : `Payer ${amount.toFixed(2)} €`}
      </button>
      
      <div className="text-xs text-gray-500 mt-2">
        <p>Paiement sécurisé avec Stripe</p>
        <div className="flex justify-center space-x-2 mt-1">
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visa/visa-original.svg" alt="Visa" className="h-6" />
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mastercard/mastercard-original.svg" alt="Mastercard" className="h-6" />
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" alt="Apple Pay" className="h-6" />
        </div>
      </div>
    </form>
  );
};

// Wrapper pour fournir le contexte Stripe
const StripePaymentFormWrapper = (props) => {
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Paiement sécurisé</h2>
      <StripePaymentForm {...props} />
    </div>
  );
};

export default StripePaymentFormWrapper;
