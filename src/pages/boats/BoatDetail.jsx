import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import HomeNavigation from '../../components/navigation/HomeNavigation';
import { useAuth } from '../../contexts/AuthContext';
import './BoatDetail.css';

// Importation des images
import moteur4 from '../../assets/images/moteur4.jpeg';
import moteur5 from '../../assets/images/moteur5.jpeg';
import moteur6 from '../../assets/images/moteur6.jpeg';
import moteur7 from '../../assets/images/moteur7.jpeg';
import moteur8 from '../../assets/images/moteur8.jpeg';
import moteur9 from '../../assets/images/moteur9.jpeg';
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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
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

  // Simuler la récupération des données du bateau depuis l'API
  useEffect(() => {
    // Dans une application réelle, vous feriez un appel API ici
    // fetch(`/api/boats/${id}`) ou axios.get(`/api/boats/${id}`)
    
    // Pour l'instant, nous utilisons des données simulées
    const mockBoats = [
      {
        id: "1",
        name: "Speedster 250",
        description: "Le Speedster 250 est un bateau à moteur rapide et élégant, parfait pour les sorties en mer et les activités nautiques. Avec son design aérodynamique et son moteur puissant, il offre des sensations fortes tout en garantissant confort et sécurité à tous les passagers.",
        power: "250 CV",
        capacity: "6 personnes",
        length: "7,5 mètres",
        image: moteur4,
        price: 350,
        available: true,
        features: [
          "Plateforme de baignade",
          "Bain de soleil avant",
          "Douche de pont",
          "Radio Bluetooth",
          "Glacière",
          "Équipement de sécurité complet"
        ],
        technicalSpecs: {
          year: 2023,
          engine: "Mercury 250 HP",
          fuelCapacity: "200 litres",
          maxSpeed: "45 nœuds",
          weight: "1800 kg"
        },
        location: "Port de La Rochelle"
      },
      {
        id: "2",
        name: "Cruiser 180",
        description: "Idéal pour les croisières côtières avec tout le confort nécessaire. Le Cruiser 180 est spacieux et stable, offrant une expérience de navigation agréable même pour les débutants.",
        power: "180 CV",
        capacity: "8 personnes",
        length: "8,2 mètres",
        image: moteur5,
        price: 450,
        available: true,
        features: [
          "Cabine avec couchette double",
          "Toilettes marines",
          "Cuisine équipée",
          "Taud de soleil",
          "Échelle de bain",
          "GPS/Traceur"
        ],
        technicalSpecs: {
          year: 2022,
          engine: "Yamaha 180 HP",
          fuelCapacity: "250 litres",
          maxSpeed: "35 nœuds",
          weight: "2200 kg"
        },
        location: "Port de Marseille"
      },
      {
        id: "3",
        name: "Fisherman Pro",
        description: "Spécialement conçu pour la pêche avec de nombreux équipements dédiés. Sa stabilité et sa maniabilité en font le compagnon idéal pour les passionnés de pêche en mer.",
        power: "150 CV",
        capacity: "4 personnes",
        length: "6,5 mètres",
        image: moteur6,
        price: 280,
        available: false,
        features: [
          "Vivier à appâts",
          "Porte-cannes",
          "Table de découpe",
          "Sondeur/GPS",
          "Viviers intégrés",
          "Coffres de rangement"
        ],
        technicalSpecs: {
          year: 2021,
          engine: "Suzuki 150 HP",
          fuelCapacity: "180 litres",
          maxSpeed: "38 nœuds",
          weight: "1500 kg"
        },
        location: "Port de Brest"
      },
      {
        id: "4",
        name: "Family Boat 220",
        description: "Spacieux et confortable, idéal pour les sorties en famille. Avec ses nombreux espaces de rangement et son aménagement bien pensé, il garantit des journées agréables sur l'eau.",
        power: "220 CV",
        capacity: "10 personnes",
        length: "9 mètres",
        image: moteur9,
        price: 520,
        available: true,
        features: [
          "Grand bain de soleil",
          "Cuisine extérieure",
          "Douche de pont",
          "Cabine spacieuse",
          "Table pique-nique",
          "Toit ouvrant"
        ],
        technicalSpecs: {
          year: 2023,
          engine: "Mercury 220 HP",
          fuelCapacity: "300 litres",
          maxSpeed: "32 nœuds",
          weight: "2800 kg"
        },
        location: "Port de Nice"
      },
      {
        id: "5",
        name: "Sport 300",
        description: "Performances exceptionnelles pour les amateurs de sensations fortes. Ce bateau sportif combine vitesse et maniabilité pour une expérience nautique incomparable.",
        power: "300 CV",
        capacity: "4 personnes",
        length: "7 mètres",
        image: moteur8,
        price: 600,
        available: true,
        features: [
          "Sièges sport",
          "Direction assistée",
          "Système audio premium",
          "Écran tactile",
          "Trim automatique",
          "Mode performance"
        ],
        technicalSpecs: {
          year: 2023,
          engine: "Twin Mercury 150 HP",
          fuelCapacity: "280 litres",
          maxSpeed: "65 nœuds",
          weight: "1800 kg"
        },
        location: "Port de Cannes"
      },
      {
        id: "6",
        name: "Coastal Explorer",
        description: "Parfait pour explorer les côtes et les criques isolées. Sa coque robuste et son équipement de navigation avancé vous permettent de découvrir des endroits inaccessibles en toute sécurité.",
        power: "200 CV",
        capacity: "6 personnes",
        length: "7,8 mètres",
        image: moteur7,
        price: 400,
        available: true,
        features: [
          "GPS marine avancé",
          "Réservoir d'eau douce",
          "Plateforme arrière",
          "Taud de camping",
          "Propulseur d'étrave",
          "Radar"
        ],
        technicalSpecs: {
          year: 2022,
          engine: "Yamaha 200 HP",
          fuelCapacity: "220 litres",
          maxSpeed: "40 nœuds",
          weight: "2100 kg"
        },
        location: "Port de La Rochelle"
      }
    ];

    setTimeout(() => {
      const foundBoat = mockBoats.find(b => b.id === id);
      setBoat(foundBoat || null);
      setLoading(false);
    }, 800); // Simuler un délai de chargement
  }, [id]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!boat) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Bateau non trouvé</h1>
        <p className="text-lg text-gray-600 mb-6">Le bateau que vous recherchez n'existe pas ou a été retiré.</p>
        <Link to="/boats/motor" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md inline-flex items-center">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Retour à la liste des bateaux
        </Link>
      </div>
    );
  }

  return (
    <div className="boat-detail-container">
      <header className="boat-detail-header">
        <HomeNavigation />
      </header>
      <div className="container mx-auto px-4 py-8 content-container">
      {/* Bouton retour */}
      <div className="mb-6">
        <Link to="/boats/motor" className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} />
          Retour à la liste des bateaux
        </Link>
      </div>
      
      {/* En-tête avec nom et prix */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="boat-title">{boat.name}</h1>
        <div className="price-tag">
          <span className="text-2xl font-bold">{boat.price}€</span>
          <span className="text-gray-600"> / jour</span>
        </div>
      </div>
      
      {/* Galerie d'images */}
      <div className="boat-gallery">
        {boat.image && (
          <img src={boat.image} alt={boat.name} className="boat-main-image" />
        )}
      </div>
      
      {/* Caractéristiques principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="feature-card">
          <FontAwesomeIcon icon={faTachometerAlt} className="feature-icon" />
          <span className="feature-label">Puissance</span>
          <span className="feature-value">{boat.power}</span>
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
          <span className="feature-value">{boat.location}</span>
        </div>
      </div>
      
      {/* Description et formulaire de réservation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <h2 className="section-title">Description</h2>
          <p className="text-gray-600 mb-6">{boat.description}</p>
          
          <h2 className="section-title">Équipements</h2>
          <div className="features-list">
            {boat.features.map((feature, index) => (
              <div key={index} className="feature-item">
                <FontAwesomeIcon icon={faCheck} className="feature-check" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          
          <h2 className="section-title">Caractéristiques techniques</h2>
          <div className="tech-specs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="tech-spec-item">
                <span className="tech-spec-label">Année</span>
                <span className="tech-spec-value">{boat.technicalSpecs.year}</span>
              </div>
              <div className="tech-spec-item">
                <span className="tech-spec-label">Moteur</span>
                <span className="tech-spec-value">{boat.technicalSpecs.engine}</span>
              </div>
              <div className="tech-spec-item">
                <span className="tech-spec-label">Capacité carburant</span>
                <span className="tech-spec-value">{boat.technicalSpecs.fuelCapacity}</span>
              </div>
              <div className="tech-spec-item">
                <span className="tech-spec-label">Vitesse max</span>
                <span className="tech-spec-value">{boat.technicalSpecs.maxSpeed}</span>
              </div>
              <div className="tech-spec-item">
                <span className="tech-spec-label">Poids</span>
                <span className="tech-spec-value">{boat.technicalSpecs.weight}</span>
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
                <span className="font-bold">{boat.price}€</span>
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
                  <span>{boat.price * Math.max(1, Math.floor((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)))}€</span>
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
      
      {/* Informations supplémentaires */}
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
      
      {/* Bouton pour remonter en haut de la page */}
      {showScrollTop && (
        <button className="scroll-top-btn" onClick={scrollToTop}>
          <FontAwesomeIcon icon={faChevronUp} />
        </button>
      )}
    </div>
      
    {/* Footer */}
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Nous faire confiance</h3>
          <div className="rating-info">
            <p><strong>Note : 4.8 / 5</strong> calculée à partir de <br/>5 000 avis</p>
            <p>Une communauté passionnée</p>
          </div>
        </div>

        <div className="footer-section">
          <h3>Besoin de conseils ?</h3>
          <p>Nous sommes joignables :</p>
          <p>Du lundi au vendredi : 9h00 à 20h00</p>
          <p>Samedi et Dimanche : 10h00 à 18h00</p>
        </div>

        <div className="footer-section">
          <h3>Réseaux sociaux</h3>
          <div className="social-icons">
            <a href="#" className="social-icon">
              <img src={facebookIcon} alt="Facebook" />
            </a>
            <a href="#" className="social-icon">
              <img src={instaIcon} alt="Instagram" />
            </a>
            <a href="#" className="social-icon">
              <img src={tiktokIcon} alt="TikTok" />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Paiement vérifié par</h3>
          <div className="payment-icons">
            <img src={mastercardIcon} alt="Mastercard" className="payment-icon" />
            <img src={visaIcon} alt="Visa" className="payment-icon" />
            <img src={applepayIcon} alt="Apple Pay" className="payment-icon" />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p> SailingLoc 2025</p>
          <div className="footer-links">
            <a href="#">Mentions légales</a>
            <a href="#">CGU / CGV</a>
            <a href="#">Partenaires</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
  );
};

export default BoatDetail;
