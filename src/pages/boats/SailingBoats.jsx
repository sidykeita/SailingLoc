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
  faChevronUp,
  faCompass,
  faWind
} from '@fortawesome/free-solid-svg-icons';
import Layout from '../../Layout';
import '../../assets/css/SailingBoats.css'; // Import du fichier CSS depuis le nouveau chemin

// Importation des images (utilisation d'images existantes)
import voilier1 from '../../assets/images/AdobeStock_198032487.jpeg';
import voilier2 from '../../assets/images/AdobeStock_315021887.jpeg';
import voilier3 from '../../assets/images/AdobeStock_1028777944.jpeg';
import voilier4 from '../../assets/images/AdobeStock_1165484620.jpeg';
import voilier5 from '../../assets/images/AdobeStock_1218649634.jpeg';
import voilier6 from '../../assets/images/AdobeStock_622498772.jpeg';

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
  
  // Filtrage des voiliers en fonction des critères de recherche et des filtres
  const filteredBoats = boats.filter(boat => {
    // Filtrage par terme de recherche
    const matchesSearch = boat.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         boat.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrage par prix
    let matchesPrice = true;
    if (priceFilter === 'low') {
      matchesPrice = boat.price < 300;
    } else if (priceFilter === 'medium') {
      matchesPrice = boat.price >= 300 && boat.price <= 450;
    } else if (priceFilter === 'high') {
      matchesPrice = boat.price > 450;
    }
    
    // Filtrage par capacité
    let matchesCapacity = true;
    if (capacityFilter === 'small') {
      matchesCapacity = parseInt(boat.capacity) <= 4;
    } else if (capacityFilter === 'medium') {
      matchesCapacity = parseInt(boat.capacity) > 4 && parseInt(boat.capacity) <= 8;
    } else if (capacityFilter === 'large') {
      matchesCapacity = parseInt(boat.capacity) > 8;
    }
    
    return matchesSearch && matchesPrice && matchesCapacity;
  });

  return (
    <Layout>
      <div className="sailing-boats-page">
        <div className="container mx-auto px-4 py-8 content-container">
          <h1 className="text-3xl font-bold text-[#274991] mb-2">Location de voiliers</h1>
          <p className="text-[#333333] mb-8">Découvrez notre flotte de voiliers disponibles à la location pour des aventures inoubliables</p>
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
        </div>

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
    </Layout>
  );
};

export default SailingBoats;
