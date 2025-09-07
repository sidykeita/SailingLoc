import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_PUBLIC_KEY } from '../../config/stripe';
import StripePaymentForm from '../../components/payment/StripePaymentForm';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

// Initialiser Stripe avec la clé publique
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Récupérer les données de la réservation depuis l'état de la navigation
  const { bookingData } = location.state || {};
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Vérifier si l'utilisateur est connecté et si les données de réservation sont présentes
  useEffect(() => {
    if (!currentUser) {
      // Rediriger vers la page de connexion avec un état pour revenir à la page de paiement
      navigate('/login', { state: { from: '/payment' } });
      return;
    }
    
    if (!bookingData) {
      setError('Aucune donnée de réservation trouvée. Veuillez réessayer.');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(false);
  }, [currentUser, bookingData, navigate]);
  
  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Paiement réussi:', paymentIntent);
    setPaymentSuccess(true);
    
    // Ici, vous pourriez appeler votre API pour confirmer la réservation
    // après un paiement réussi
    // Exemple :
    // confirmBooking(bookingData.bookingId, paymentIntent.id);
  };
  
  const handlePaymentError = (error) => {
    console.error('Erreur de paiement:', error);
    setError(`Erreur lors du traitement du paiement: ${error.message || 'Veuillez réessayer'}`);
  };
  
  const handleBackToBooking = () => {
    // Rediriger vers la page de réservation ou la page d'accueil
    navigate(bookingData?.boatId ? `/boats/${bookingData.boatId}` : '/');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des détails du paiement...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBackToBooking}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Retour à la réservation
          </button>
        </div>
      </div>
    );
  }
  
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-green-500 mb-4">
            <FontAwesomeIcon icon={faCheckCircle} size="3x" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement réussi !</h2>
          <p className="text-gray-600 mb-6">Merci pour votre réservation. Un email de confirmation vous a été envoyé.</p>
          
          <div className="bg-gray-50 p-4 rounded-md text-left mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Détails de la réservation</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Bateau :</span> {bookingData.boatName || 'Non spécifié'}</p>
              <p><span className="font-medium">Période :</span> {bookingData.startDate} - {bookingData.endDate}</p>
              <p><span className="font-medium">Montant :</span> {bookingData.amount} €</p>
              <p><span className="font-medium">Référence :</span> {`#${Math.random().toString(36).substr(2, 9).toUpperCase()}`}</p>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            <a
              href="/user/bookings"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Voir mes réservations
            </a>
            <button
              onClick={handleBackToBooking}
              className="w-full bg-white text-gray-700 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Récupérer le montant total depuis les données de réservation
  const amount = bookingData?.amount || 0;
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={handleBackToBooking}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Retour à la réservation
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Finalisez votre réservation</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Détails de la réservation */}
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Récapitulatif de la réservation</h2>
            
            {bookingData && (
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-md overflow-hidden">
                    {bookingData.boatImage && (
                      <img 
                        src={bookingData.boatImage} 
                        alt={bookingData.boatName} 
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{bookingData.boatName || 'Bateau non spécifié'}</h3>
                    <p className="text-sm text-gray-500">
                      {bookingData.startDate} - {bookingData.endDate}
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Détails du prix</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Prix de base</span>
                      <span>{bookingData.basePrice || '0.00'} €</span>
                    </div>
                    {bookingData.fees && bookingData.fees > 0 && (
                      <div className="flex justify-between">
                        <span>Frais de service</span>
                        <span>{bookingData.fees.toFixed(2)} €</span>
                      </div>
                    )}
                    {bookingData.discount && bookingData.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Réduction</span>
                        <span>-{bookingData.discount.toFixed(2)} €</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-200 font-medium text-gray-900">
                      <span>Total</span>
                      <span>{amount.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Formulaire de paiement */}
          <div className="md:sticky md:top-4 h-fit">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Paiement sécurisé</h2>
              <Elements stripe={stripePromise}>
                <StripePaymentForm 
                  amount={amount} 
                  onSuccess={handlePaymentSuccess} 
                  onError={handlePaymentError} 
                />
              </Elements>
              
              <div className="mt-6 text-xs text-gray-500">
                <p className="mb-2">Vos données sont sécurisées et cryptées.</p>
                <div className="flex items-center justify-center space-x-4">
                  <span>Paiement sécurisé par</span>
                  <img 
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/stripe/stripe-original.svg" 
                    alt="Stripe" 
                    className="h-6" 
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>En effectuant cette réservation, vous acceptez nos </p>
              <p>
                <a href="/conditions-generales" className="text-blue-600 hover:underline">Conditions générales</a> 
                et notre 
                <a href="/politique-confidentialite" className="text-blue-600 hover:underline ml-1">Politique de confidentialité</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
