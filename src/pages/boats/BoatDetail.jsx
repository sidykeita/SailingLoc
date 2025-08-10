import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import boatService from '../../services/boat.service';
import { 
  faAnchor, 
  faWater, 
  faShip, 
  faTachometerAlt, 
  faCalendarAlt, 
  faUsers, 
  faRulerHorizontal,
  faArrowLeft,
  faCheck,
  faLifeRing,
  faWifi,
  faUtensils,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';
// Layout est maintenant géré au niveau des routes dans App.jsx
import { useAuth } from '../../contexts/AuthContext';
import '../../assets/css/BoatDetail.css';

// Importation des images
import logoBlc from '../../assets/images/logo-blc.png';

// Images pour le footer
import facebookIcon from '../../assets/images/picto-facebook.png';
import instaIcon from '../../assets/images/picto-insta.png';
import tiktokIcon from '../../assets/images/picto-tiktok.png';
import mastercardIcon from '../../assets/images/mastercard.png';
import visaIcon from '../../assets/images/visa.png';
import applepayIcon from '../../assets/images/applepay.png';

const BoatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [boat, setBoat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [success, setSuccess] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const fetchBoat = async () => {
      setLoading(true);
      try {
        console.log('ID demandé:', id); // DEBUG
        const res = await boatService.getBoatById(id);
        console.log('Réponse API:', res); // DEBUG
        setBoat(res);
      } catch (err) {
        console.error('Erreur API:', err); // DEBUG
        setError("Erreur lors du chargement du bateau");
      } finally {
        setLoading(false);
      }
    };
    fetchBoat();
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!boat) return <div>Bateau introuvable</div>;

  const handleReservation = (e) => {
    e.preventDefault();
    
    // Validation de base
    if (!startDate || !endDate) {
      setError('Veuillez sélectionner des dates de début et de fin');
      return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      setError('La date de fin doit être postérieure à la date de début');
      return;
    }

    // Dans une application réelle, vous enverriez ces données à votre API
    // axios.post('/api/reservations', { boatId: id, startDate, endDate, userId: currentUser.id })
    
    setSuccess('Votre demande de réservation a été envoyée avec succès !');
    setError('');
    
    // Redirection après quelques secondes
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Galerie */}
      {boat.photos && boat.photos.length > 0 && (
        <div className="mb-6">
          <img src={boat.photos[0]} alt={boat.name} className="rounded-lg shadow w-full max-h-96 object-cover" />
        </div>
      )}
      {/* Titre et infos principales */}
      <h1 className="text-3xl font-bold mb-2">{boat.name} <span className="text-lg font-normal text-gray-500">({boat.model})</span></h1>
      <div className="mb-4 text-gray-600">Type : {boat.type} | Port : {boat.port} | {boat.length} m | {boat.capacity} pers. | {boat.cabins} cabines</div>
      <div className="mb-6 text-xl font-semibold text-primary">{boat.dailyPrice} € / jour</div>
      {/* Description */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-1">Description</h2>
        <p>{boat.description}</p>
      </div>
      {/* Caractéristiques techniques */}
      {boat.technicalSpecs && (
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-1">Caractéristiques techniques</h2>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Année : {boat.technicalSpecs.year}</li>
            <li>Moteur : {boat.technicalSpecs.engine}</li>
            <li>Capacité carburant : {boat.technicalSpecs.fuelCapacity}</li>
            <li>Vitesse max : {boat.technicalSpecs.maxSpeed}</li>
            <li>Poids : {boat.technicalSpecs.weight}</li>
          </ul>
        </div>
      )}
      {/* Équipements */}
      {boat.features && boat.features.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-1">Équipements</h2>
          <ul className="list-disc ml-6 text-gray-700">
            {boat.features.map((feat, idx) => <li key={idx}>{feat}</li>)}
          </ul>
        </div>
      )}
      {/* Statut/location/skipper */}
      <div className="mb-6">
        <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 mr-2">{boat.status}</span>
        {boat.skipper && <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700">Skipper obligatoire</span>}
      </div>
      {/* Formulaire de réservation */}
      <div className="booking-form">
        <h2 className="section-title">Réserver ce bateau</h2>
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleReservation}>
          <div className="mb-4">
            <label htmlFor="startDate" className="form-label">Date de début</label>
            <div className="relative">
              <div className="input-icon">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <input
                type="date"
                id="startDate"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                disabled={!boat.available}
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="endDate" className="form-label">Date de fin</label>
            <div className="relative">
              <div className="input-icon">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <input
                type="date"
                id="endDate"
                className="form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
                disabled={!boat.available}
              />
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Prix par jour:</span>
              <span className="font-bold">{boat.dailyPrice}€</span>
            </div>
            {startDate && endDate && (
              <div className="flex justify-between text-gray-700 mb-2">
                <span>Durée:</span>
                <span className="font-bold">
                  {Math.max(1, Math.floor((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)))} jours
                </span>
              </div>
            )}
            {startDate && endDate && (
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{boat.dailyPrice * Math.max(1, Math.floor((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)))}€</span>
              </div>
            )}
          </div>
          
          <button
            type="submit"
            className={`booking-button ${
              boat.available
                ? 'booking-button-available'
                : 'booking-button-unavailable'
            }`}
            disabled={!boat.available}
          >
            {boat.available ? 'Réserver maintenant' : 'Non disponible'}
          </button>
          
          {!boat.available && (
            <p className="text-red-500 text-center mt-2">Ce bateau n'est pas disponible actuellement</p>
          )}
          
          {!currentUser && boat.available && (
            <div className="mt-4 text-center">
              <Link to="/login" className="text-blue-600 hover:text-blue-800">
                Connectez-vous pour réserver
              </Link>
            </div>
          )}
        </form>
      </div>
      {/* Bouton retour */}
      <button onClick={() => window.history.back()} className="btn-secondary">← Retour</button>
      {/* Bouton pour remonter en haut de la page */}
      {showScrollTop && (
        <button className="scroll-top-btn" onClick={scrollToTop}>
          <FontAwesomeIcon icon={faChevronUp} />
        </button>
      )}
    </div>
  );
};

export default BoatDetail;
