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
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import boatService from '../../services/boat.service';
// Layout est maintenant géré au niveau des routes dans App.jsx
import '../../assets/css/MotorBoats.css'; // Import du fichier CSS

// Importation des images
import moteur4 from '../../assets/images/moteur4.jpeg';
import moteur5 from '../../assets/images/moteur5.jpeg';
import moteur6 from '../../assets/images/moteur6.jpeg';
import moteur7 from '../../assets/images/moteur7.jpeg';
import moteur8 from '../../assets/images/moteur8.jpeg';
import moteur9 from '../../assets/images/moteur9.jpeg';
// Suppression de l'import du logo

// Images pour le footer
// Suppression des imports pour les icônes du footer

const MotorBoats = () => {
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [capacityFilter, setCapacityFilter] = useState('all');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Effet pour gérer l'affichage du bouton de retour en haut
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
  
  // Fonction pour remonter en haut de la page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    setLoading(true);
    boatService.getAllBoats({ type: 'bateau-moteur' })
      .then(data => setBoats(data))
      .catch(() => setError('Erreur lors du chargement des bateaux'))
      .finally(() => setLoading(false));
  }, []);

  // Filtrer les bateaux en fonction des critères
  const filteredBoats = boats.filter(boat => {
    // Filtre de recherche
    const matchesSearch = boat.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          boat.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtre de prix (normalisé sur dailyPrice || pricePerDay || price)
    const normalizedPrice = Number(
      boat?.dailyPrice ?? boat?.pricePerDay ?? boat?.price ?? 0
    );
    const matchesPrice = priceFilter === 'all' || 
                        (priceFilter === 'low' && normalizedPrice < 300) ||
                        (priceFilter === 'medium' && normalizedPrice >= 300 && normalizedPrice <= 500) ||
                        (priceFilter === 'high' && normalizedPrice > 500);
    
    // Filtre de capacité
    const matchesCapacity = capacityFilter === 'all' ||
                           (capacityFilter === 'small' && parseInt(boat.capacity) <= 4) ||
                           (capacityFilter === 'medium' && parseInt(boat.capacity) > 4 && parseInt(boat.capacity) <= 8) ||
                           (capacityFilter === 'large' && parseInt(boat.capacity) > 8);
    
    return matchesSearch && matchesPrice && matchesCapacity;
  });

  return (
    <>
      <div className="motor-boats-page motor-boats-container">
        <div className="page-content container mx-auto px-4 py-8 content-container">
          <h1 className="text-3xl font-bold text-[#274991] mb-2">Location de bateaux à moteur</h1>
          <p className="text-[#333333] mb-8">Découvrez notre flotte de bateaux à moteur disponibles à la location</p>
          
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
                    <option value="medium">Intermédiaire (300€ - 500€)</option>
                    <option value="high">Premium (plus de 500€)</option>
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
          
          {/* Liste des bateaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {filteredBoats.length > 0 ? (
          filteredBoats.map((boat, index) => (
            <div key={boat._id || boat.id || index} className={`boat-card ${(boat.status === 'disponible' || boat.available) ? 'available' : ''} animated-card delay-${index % 6 + 1}`}>
              {/* Image du bateau */}
              <div className="boat-image">
                <img src={Array.isArray(boat.photos) ? boat.photos[0] : boat.photos} alt={boat.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="boat-details">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-[#274991]">{boat.name}</h2>
                  <span className="boat-price">
                    {boat.dailyPrice}€/jour
                  </span>
                </div>
                
                <p className="text-[#333333] mb-4">{boat.description}</p>
                
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
                    <FontAwesomeIcon icon={faWater} className="boat-spec-icon" />
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
                    className="inline-flex items-center text-[#274991] hover:text-[#3C83C4]"
                  >
                    Voir détails
                    <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <FontAwesomeIcon icon={faAnchor} className="text-4xl text-gray-400 mb-2" />
            <p className="text-gray-600">Aucun bateau ne correspond à vos critères de recherche.</p>
          </div>
        )}
          </div>
          
          {/* Section d'information */}
          <div className="info-section">
            <h2 className="text-2xl font-bold text-[#274991] mb-4 cursive-title">Pourquoi choisir notre flotte de bateaux à moteur ?</h2>
            <div className="info-grid">
              <div className="info-card">
                <FontAwesomeIcon icon={faAnchor} className="info-icon" />
                <h3 className="text-lg font-bold text-[#3C83C4] mb-2">Bateaux récents et entretenus</h3>
                <p className="text-[#333333]">Notre flotte est régulièrement renouvelée et entretenue par des professionnels pour vous garantir sécurité et fiabilité.</p>
              </div>
              <div className="info-card">
                <FontAwesomeIcon icon={faShip} className="info-icon" />
                <h3 className="text-lg font-bold text-[#3C83C4] mb-2">Large choix de modèles</h3>
                <p className="text-[#333333]">Du petit bateau familial au puissant yacht, nous avons le bateau idéal pour chaque occasion et chaque budget.</p>
              </div>
              <div className="info-card">
                <FontAwesomeIcon icon={faWater} className="info-icon" />
                <h3 className="text-lg font-bold text-[#3C83C4] mb-2">Assistance en mer</h3>
                <p className="text-[#333333]">Notre équipe est disponible 7j/7 pour vous assister en cas de besoin pendant votre location.</p>
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
      </div>
    </>
  );
};

export default MotorBoats;
