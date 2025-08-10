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
    <div className="boat-detail-page boat-detail-container">
      <div className="container mx-auto px-4 py-8 content-container">
        {/* Bouton retour */}
        <div className="mb-6">
          <Link to="/boats/motor" className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} /> Retour à la liste des bateaux
          </Link>
        </div>

        {/* En-tête avec nom et prix */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="boat-title">{boat.name}</h1>
          <div className="price-tag">
            <span className="text-2xl font-bold">{boat.dailyPrice}€</span>
            <span className="text-gray-600"> / jour</span>
          </div>
        </div>

        {/* Galerie d'images */}
        <div className="boat-gallery">
          {boat.photos && boat.photos.length > 0 ? (
            <img src={boat.photos[0]} alt={boat.name} className="boat-main-image" />
          ) : (
            <div className="boat-main-image-placeholder">Aucune image</div>
          )}
        </div>

        {/* Caractéristiques principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="feature-card">
            <FontAwesomeIcon icon={faTachometerAlt} className="feature-icon" />
            <span className="feature-label">Puissance</span>
            <span className="feature-value">{boat.power || boat.technicalSpecs?.engine || '-'}</span>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faUsers} className="feature-icon" />
            <span className="feature-label">Capacité</span>
            <span className="feature-value">{boat.capacity}</span>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faRulerHorizontal} className="feature-icon" />
            <span className="feature-label">Longueur</span>
            <span className="feature-value">{boat.length}</span>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faAnchor} className="feature-icon" />
            <span className="feature-label">Emplacement</span>
            <span className="feature-value">{boat.port}</span>
          </div>
        </div>

        {/* Description et formulaire de réservation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h2 className="section-title">Description</h2>
            <p className="text-gray-600 mb-6">{boat.description}</p>

            <h2 className="section-title">Équipements</h2>
            <div className="features-list">
              {boat.features && boat.features.length > 0 ? (
                boat.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <FontAwesomeIcon icon={faCheck} className="feature-check" />
                    <span>{feature}</span>
                  </div>
                ))
              ) : (
                <span>Aucun équipement renseigné</span>
              )}
            </div>

            <h2 className="section-title">Caractéristiques techniques</h2>
            <div className="tech-specs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="tech-spec-item">
                  <span className="tech-spec-label">Année</span>
                  <span className="tech-spec-value">{boat.technicalSpecs?.year}</span>
                </div>
                <div className="tech-spec-item">
                  <span className="tech-spec-label">Moteur</span>
                  <span className="tech-spec-value">{boat.technicalSpecs?.engine}</span>
                </div>
                <div className="tech-spec-item">
                  <span className="tech-spec-label">Capacité carburant</span>
                  <span className="tech-spec-value">{boat.technicalSpecs?.fuelCapacity}</span>
                </div>
                <div className="tech-spec-item">
                  <span className="tech-spec-label">Vitesse max</span>
                  <span className="tech-spec-value">{boat.technicalSpecs?.maxSpeed}</span>
                </div>
                <div className="tech-spec-item">
                  <span className="tech-spec-label">Poids</span>
                  <span className="tech-spec-value">{boat.technicalSpecs?.weight}</span>
                </div>
              </div>
            </div>
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
        </div>

        {/* Informations supplémentaires (optionnel, mock) */}
        <div className="why-choose">
          <h2 className="why-choose-title">Pourquoi choisir ce bateau ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="benefit-card">
              <FontAwesomeIcon icon={faLifeRing} className="benefit-icon" />
              <h3 className="benefit-title">Sécurité garantie</h3>
              <p className="benefit-text">Équipement de sécurité complet et bateau régulièrement entretenu pour votre tranquillité.</p>
            </div>
            <div className="benefit-card">
              <FontAwesomeIcon icon={faWifi} className="benefit-icon" />
              <h3 className="benefit-title">Confort moderne</h3>
              <p className="benefit-text">Profitez d'équipements modernes pour une expérience de navigation agréable.</p>
            </div>
            <div className="benefit-card">
              <FontAwesomeIcon icon={faUtensils} className="benefit-icon" />
              <h3 className="benefit-title">Tout équipé</h3>
              <p className="benefit-text">Tout ce dont vous avez besoin est à bord pour profiter pleinement de votre journée en mer.</p>
            </div>
          </div>
        </div>

        {/* Statut/location/skipper */}
        <div className="mb-6 mt-8">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 mr-2">{boat.status}</span>
          {boat.skipper && <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700">Skipper obligatoire</span>}
        </div>

        {/* Bouton pour remonter en haut de la page */}
        {showScrollTop && (
          <button className="scroll-top-btn" onClick={scrollToTop}>
            <FontAwesomeIcon icon={faChevronUp} />
          </button>
        )}
      </div>
    </div>
  );
};

export default BoatDetail;
