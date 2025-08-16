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
import boatService from '../../services/boat.service';
import PourquoiLouerSection from '../../components/PourquoiLouerSection';
// Layout est maintenant géré au niveau des routes dans App.jsx
import '../../assets/css/SailingBoats.css'; // Import du fichier CSS depuis le nouveau chemin

const SailingBoats = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [capacityFilter, setCapacityFilter] = useState('all');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
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
  
  useEffect(() => {
    setLoading(true);
    boatService.getAllBoats({ type: 'voilier' })
      .then(data => setBoats(data))
      .catch(() => setError('Erreur lors du chargement des bateaux'))
      .finally(() => setLoading(false));
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Filtrage des voiliers en fonction des critères de recherche et des filtres
  const filteredBoats = boats.filter(boat => {
    // Filtrage par terme de recherche
    const matchesSearch = boat.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         boat.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrage par prix (normalisé sur dailyPrice || pricePerDay || price)
    const normalizedPrice = Number(
      boat?.dailyPrice ?? boat?.pricePerDay ?? boat?.price ?? 0
    );
    let matchesPrice = true;
    if (priceFilter === 'low') {
      matchesPrice = normalizedPrice < 300;
    } else if (priceFilter === 'medium') {
      matchesPrice = normalizedPrice >= 300 && normalizedPrice <= 450;
    } else if (priceFilter === 'high') {
      matchesPrice = normalizedPrice > 450;
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
    <>
      <div className="sailing-boats-page sailing-boats-container">
        <div className="page-content container mx-auto px-4 py-8 content-container">
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
            
            {loading ? (
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <p className="text-lg text-gray-600">Chargement des voiliers...</p>
              </div>
            ) : error ? (
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <p className="text-lg text-gray-600">{error}</p>
              </div>
            ) : filteredBoats.length === 0 ? (
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
                    key={boat._id || boat.id || index}
                    className={`boat-card ${(boat.status === 'disponible' || boat.available) ? 'available' : ''} animated-card delay-${index % 6 + 1}`}
                  >
                    <div className="boat-image">
                      <img src={Array.isArray(boat.photos) ? boat.photos[0] : boat.photos} alt={boat.name} />
                    </div>
                    <div className="boat-details">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-[#274991]">{boat.name}</h3>
                        <span className="boat-price">{boat.dailyPrice}€/jour</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{boat.description}</p>
                      
                      <div className="boat-specs">
                        <div className="boat-spec">
                           <FontAwesomeIcon icon={faTachometerAlt} className="boat-spec-icon" />
                              <span className="boat-spec-label">Puissance</span>
                              <span className="boat-spec-value">{boat.power}</span>
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
                        <span className={`badge ${boat.status === "disponible" ? 'badge-available' : 'badge-unavailable'}`}>
                          {boat.status === "disponible" ? 'Disponible' : 'Indisponible'}
                        </span>
                        <Link 
                          to={`/boats/${boat._id}`} 
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
      
          {/* Section d'information harmonisée */}
            
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
        <PourquoiLouerSection />
      </div>
    </>
  );
};

export default SailingBoats;
