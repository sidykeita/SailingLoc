import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faAnchor, 
  faWater, 
  faShip, 
  faTachometerAlt, 
  faUsers, 
  faSearch, 
  faFilter, 
  faArrowRight,
  faUser,
  faBars,
  faTimes,
  faChevronUp,
  faWind,
  faCompass
} from '@fortawesome/free-solid-svg-icons';
import HomeNavigation from '../../components/navigation/HomeNavigation';
import './SailingBoats.css'; // Import du fichier CSS

// Importation des images (utilisation d'images existantes)
import voilier1 from '../../assets/images/AdobeStock_198032487.jpeg';
import voilier2 from '../../assets/images/AdobeStock_315021887.jpeg';
import voilier3 from '../../assets/images/AdobeStock_1028777944.jpeg';
import voilier4 from '../../assets/images/AdobeStock_1165484620.jpeg';
import voilier5 from '../../assets/images/AdobeStock_1218649634.jpeg';
import voilier6 from '../../assets/images/AdobeStock_622498772.jpeg';
import logoBlc from '../../assets/images/logo-blc.png';

// Images pour le footer
import facebookIcon from '../../assets/images/picto-facebook.png';
import instaIcon from '../../assets/images/picto-insta.png';
import tiktokIcon from '../../assets/images/picto-tiktok.png';
import mastercardIcon from '../../assets/images/mastercard.png';
import visaIcon from '../../assets/images/visa.png';
import applepayIcon from '../../assets/images/applepay.png';

const SailingBoats = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [capacityFilter, setCapacityFilter] = useState('all');
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
  
  // Données simulées des voiliers avec les images importées
  const boats = [
    {
      id: "s1",
      name: "Oceanis 40.1",
      description: "Voilier moderne et confortable, idéal pour les croisières côtières et hauturières",
      sailArea: "95 m²",
      capacity: "8 personnes",
      length: "12,9 mètres",
      image: voilier1,
      price: 450,
      available: true
    },
    {
      id: "s2",
      name: "Sun Odyssey 410",
      description: "Voilier performant avec un design innovant et des espaces de vie optimisés",
      sailArea: "85 m²",
      capacity: "6 personnes",
      length: "12,3 mètres",
      image: voilier2,
      price: 420,
      available: true
    },
    {
      id: "s3",
      name: "Dufour 430",
      description: "Alliance parfaite entre performance, confort et élégance pour des navigations de rêve",
      sailArea: "93 m²",
      capacity: "8 personnes",
      length: "13,2 mètres",
      image: voilier3,
      price: 480,
      available: false
    },
    {
      id: "s4",
      name: "Bavaria C45",
      description: "Grand voilier familial offrant des volumes généreux et une navigation facile",
      sailArea: "108 m²",
      capacity: "10 personnes",
      length: "14,5 mètres",
      image: voilier4,
      price: 550,
      available: true
    },
    {
      id: "s5",
      name: "First 27",
      description: "Voilier sportif et rapide pour les amateurs de sensations et de régates",
      sailArea: "45 m²",
      capacity: "4 personnes",
      length: "8,4 mètres",
      image: voilier5,
      price: 280,
      available: true
    },
    {
      id: "s6",
      name: "Hanse 388",
      description: "Voilier moderne au design épuré offrant d'excellentes performances de navigation",
      sailArea: "72 m²",
      capacity: "6 personnes",
      length: "11,4 mètres",
      image: voilier6,
      price: 380,
      available: true
    }
  ];
  
  // Filtrer les bateaux en fonction des critères
  const filteredBoats = boats.filter(boat => {
    // Filtre de recherche
    const matchesSearch = boat.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          boat.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtre de prix
    const matchesPrice = priceFilter === 'all' || 
                        (priceFilter === 'low' && boat.price < 300) ||
                        (priceFilter === 'medium' && boat.price >= 300 && boat.price <= 450) ||
                        (priceFilter === 'high' && boat.price > 450);
    
    // Filtre de capacité
    const matchesCapacity = capacityFilter === 'all' ||
                           (capacityFilter === 'small' && parseInt(boat.capacity) <= 4) ||
                           (capacityFilter === 'medium' && parseInt(boat.capacity) > 4 && parseInt(boat.capacity) <= 8) ||
                           (capacityFilter === 'large' && parseInt(boat.capacity) > 8);
    
    return matchesSearch && matchesPrice && matchesCapacity;
  });

  // Fonction pour afficher un en-tête personnalisé sans modifier les autres pages
  const CustomHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    
    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
    };
    
    return (
      <header className="sailing-boats-header">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="logo">
            <Link to="/">
              <img src={logoBlc} alt="SAILING.LOC" className="h-10" />
            </Link>
          </div>
          
          {/* Bouton hamburger pour mobile */}
          <button 
            className="hamburger-button" 
            onClick={toggleMenu}
            aria-label="Menu principal"
          >
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
          </button>
          
          {/* Navigation */}
          <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
            <ul>
              <li><Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Accueil</Link></li>
              <li><Link to="/boats/motor" className="nav-link" onClick={() => setMenuOpen(false)}>Bateaux à moteur</Link></li>
              <li><Link to="/boats/sailing" className="nav-link" onClick={() => setMenuOpen(false)}>Voiliers</Link></li>
              <li><Link to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>À propos</Link></li>
              <li><Link to="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>Contact</Link></li>
              <li><Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}><FontAwesomeIcon icon={faUser} /></Link></li>
            </ul>
          </nav>
        </div>
      </header>
    );
  };

  return (
    <div className="sailing-boats-container">
      {/* Utilisation de l'en-tête personnalisé au lieu de HomeNavigation */}
      <CustomHeader />
      <div className="container mx-auto px-4 py-8 content-container">
      <h1 className="text-3xl font-bold text-[#274991] mb-2">Location de voiliers</h1>
      <p className="text-[#333333] mb-8">Découvrez notre flotte de voiliers disponibles à la location pour des aventures inoubliables</p>
      
      {/* Filtres et recherche */}
      <div className="filters-section">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Barre de recherche */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
            <div className="filter-input">
              <FontAwesomeIcon icon={faSearch} className="filter-icon" />
              <input
                type="text"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nom ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Filtre de prix */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Prix par jour</label>
            <div className="filter-input">
              <FontAwesomeIcon icon={faFilter} className="filter-icon" />
              <select
                id="price"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="all">Tous les prix</option>
                <option value="low">Économique (moins de 300€)</option>
                <option value="medium">Intermédiaire (300€ - 450€)</option>
                <option value="high">Premium (plus de 450€)</option>
              </select>
            </div>
          </div>
          
          {/* Filtre de capacité */}
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">Capacité</label>
            <div className="filter-input">
              <FontAwesomeIcon icon={faUsers} className="filter-icon" />
              <select
                id="capacity"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={capacityFilter}
                onChange={(e) => setCapacityFilter(e.target.value)}
              >
                <option value="all">Toutes capacités</option>
                <option value="small">Petit groupe (jusqu'à 4 pers.)</option>
                <option value="medium">Groupe moyen (5-8 pers.)</option>
                <option value="large">Grand groupe (plus de 8 pers.)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Résultats de la recherche */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-[#274991] mb-4">Voiliers disponibles ({filteredBoats.length})</h2>
        
        {filteredBoats.length === 0 ? (
          <div className="bg-gray-100 p-8 rounded-lg text-center">
            <p className="text-lg text-gray-600">Aucun voilier ne correspond à vos critères de recherche.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setPriceFilter('all');
                setCapacityFilter('all');
              }}
              className="mt-4 bg-[#274991] text-white px-4 py-2 rounded-md hover:bg-[#1e3a73] transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBoats.map((boat, index) => (
              <div 
                key={boat.id} 
                className={`boat-card ${boat.available ? 'available' : ''} animated-card delay-${index % 6 + 1}`}
              >
                <div className="boat-image">
                  <img src={boat.image} alt={boat.name} />
                </div>
                <div className="boat-details">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-[#274991]">{boat.name}</h3>
                    <span className="boat-price">{boat.price}€/jour</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{boat.description}</p>
                  
                  <div className="boat-specs">
                    <div className="boat-spec">
                      <FontAwesomeIcon icon={faWind} className="boat-spec-icon" />
                      <span className="boat-spec-label">Surface de voile</span>
                      <span className="boat-spec-value">{boat.sailArea}</span>
                    </div>
                    <div className="boat-spec">
                      <FontAwesomeIcon icon={faUsers} className="boat-spec-icon" />
                      <span className="boat-spec-label">Capacité</span>
                      <span className="boat-spec-value">{boat.capacity}</span>
                    </div>
                    <div className="boat-spec">
                      <FontAwesomeIcon icon={faShip} className="boat-spec-icon" />
                      <span className="boat-spec-label">Longueur</span>
                      <span className="boat-spec-value">{boat.length}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className={`badge ${boat.available ? 'badge-available' : 'badge-unavailable'}`}>
                      {boat.available ? 'Disponible' : 'Indisponible'}
                    </span>
                    <Link 
                      to={`/boats/sailing/${boat.id}`} 
                      className="text-[#274991] hover:text-[#66C7C7] font-medium flex items-center transition-colors"
                    >
                      Voir détails
                      <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Section d'information */}
      <div className="info-section">
        <h2 className="text-2xl font-semibold text-[#274991] mb-6 text-center">Pourquoi louer un voilier avec nous ?</h2>
        <div className="info-grid">
          <div className="info-card">
            <FontAwesomeIcon icon={faShip} className="info-icon" />
            <h3 className="text-lg font-semibold text-[#274991] mb-2">Flotte moderne et entretenue</h3>
            <p className="text-gray-600">Nos voiliers sont régulièrement entretenus et répondent aux normes de sécurité les plus strictes.</p>
          </div>
          <div className="info-card">
            <FontAwesomeIcon icon={faCompass} className="info-icon" />
            <h3 className="text-lg font-semibold text-[#274991] mb-2">Conseils personnalisés</h3>
            <p className="text-gray-600">Notre équipe de marins expérimentés vous guide pour choisir le voilier adapté à votre niveau et vos besoins.</p>
          </div>
          <div className="info-card">
            <FontAwesomeIcon icon={faAnchor} className="info-icon" />
            <h3 className="text-lg font-semibold text-[#274991] mb-2">Assistance 24/7</h3>
            <p className="text-gray-600">Une assistance technique est disponible à tout moment pendant votre location pour une navigation sereine.</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="site-footer mt-12">
        <div className="footer-container">
          <div className="footer-section">
            <h3>À propos de SAILING.LOC</h3>
            <p>Spécialiste de la location de bateaux depuis 2010, nous proposons une large gamme de voiliers et bateaux à moteur pour tous les budgets.</p>
          </div>
          <div className="footer-section">
            <h3>Liens utiles</h3>
            <p><Link to="/about" className="text-white hover:text-[#66C7C7]">À propos</Link></p>
            <p><Link to="/contact" className="text-white hover:text-[#66C7C7]">Contact</Link></p>
            <p><Link to="/terms" className="text-white hover:text-[#66C7C7]">Conditions générales</Link></p>
            <p><Link to="/privacy" className="text-white hover:text-[#66C7C7]">Politique de confidentialité</Link></p>
          </div>
          <div className="footer-section">
            <h3>Suivez-nous</h3>
            <div className="social-icons">
              <a href="#" className="social-icon"><img src={facebookIcon} alt="Facebook" /></a>
              <a href="#" className="social-icon"><img src={instaIcon} alt="Instagram" /></a>
              <a href="#" className="social-icon"><img src={tiktokIcon} alt="TikTok" /></a>
            </div>
            <h3 className="mt-4">Paiements sécurisés</h3>
            <div className="payment-icons">
              <span className="payment-icon"><img src={visaIcon} alt="Visa" /></span>
              <span className="payment-icon"><img src={mastercardIcon} alt="Mastercard" /></span>
              <span className="payment-icon"><img src={applepayIcon} alt="Apple Pay" /></span>
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; 2025 SAILING.LOC - Tous droits réservés</p>
        </div>
      </footer>
      
      {/* Bouton de scroll vers le haut */}
      {showScrollTop && (
        <button 
          className="scroll-top-btn"
          onClick={scrollToTop}
          aria-label="Retour en haut"
        >
          <FontAwesomeIcon icon={faChevronUp} />
        </button>
      )}
    </div>
    </div>
  );
};

export default SailingBoats;
