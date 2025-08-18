import React, { useState, useEffect } from 'react';
import reservationService from '../../backup/reservationService.js';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faChevronDown, 
  faEnvelope, 
  faMobileAlt, 
  faIdCard, 
  faFileAlt, 
  faQuestionCircle, 
  faChevronRight, 
  faSignOutAlt, 
  faExchangeAlt,
  faFilter,
  faCalendarAlt,
  faMapMarkerAlt,
  faEuroSign,
  faEye,
  faDownload,
  faStar,
  faCheckCircle,
  faClock,
  faTimesCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import logoBlc from '../../assets/images/logo-blc.png';
import profileImage from '../../assets/images/profil.jpg';
import '../../assets/css/SimpleDashboard.css';
import '../../assets/css/TenantLocations.css';

const TenantLocations = () => {
  const { currentUser, logout, userRole, switchRole } = useAuth();
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // États pour les menus déroulants
  const [showDiscoverMenu, setShowDiscoverMenu] = useState(false);
  const [showBoatSubmenu, setShowBoatSubmenu] = useState(false);
  const [showDestinationsSubmenu, setShowDestinationsSubmenu] = useState(false);
  const [showModelsSubmenu, setShowModelsSubmenu] = useState(false);
  const [showAboutSubmenu, setShowAboutSubmenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    filterLocations();
  }, [locations, searchTerm, statusFilter, dateFilter]);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const reservations = await reservationService.getMyReservations();
      // Adapter le mapping selon la structure réelle de l'API
      const mappedLocations = (reservations || []).map((res) => ({
        id: res.id,
        boatName: res.boat?.name || 'Bateau',
        boatType: res.boat?.type || '',
        location: res.boat?.location || '',
        startDate: res.startDate,
        endDate: res.endDate,
        status: res.status,
        price: res.price,
        totalPrice: res.totalPrice || res.price,
        imageUrl: res.boat?.imageUrl || '/api/placeholder/300/200',
        bookingDate: res.createdAt || res.bookingDate,
        guests: res.guests || res.nbGuests,
        owner: res.boat?.owner?.name || '',
        features: res.boat?.features || []
      }));
      setLocations(mappedLocations);
    } catch (error) {
      if (error && error.response) {
        console.error('Erreur lors du chargement des locations:', error.response);
      } else {
        console.error('Erreur lors du chargement des locations:', error);
      }
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const filterLocations = () => {
    let filtered = locations;

    // Filtre par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(location =>
        location.boatName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.boatType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(location => location.status === statusFilter);
    }

    // Filtre par date
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(location => {
        const startDate = new Date(location.startDate);
        const endDate = new Date(location.endDate);
        
        switch (dateFilter) {
          case 'upcoming':
            return startDate > now;
          case 'current':
            return startDate <= now && endDate >= now;
          case 'past':
            return endDate < now;
          default:
            return true;
        }
      });
    }

    setFilteredLocations(filtered);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon confirmed" />;
      case 'pending':
        return <FontAwesomeIcon icon={faClock} className="status-icon pending" />;
      case 'completed':
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon completed" />;
      case 'cancelled':
        return <FontAwesomeIcon icon={faTimesCircle} className="status-icon cancelled" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmée';
      case 'pending':
        return 'En attente';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Chargement de vos locations...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header identique au SimpleDashboard */}
      <header className="main-header">
        <div className="header-left">
          <div className="header-logo">
            <img src={logoBlc} alt="Sailing Loc" />
          </div>
        </div>
        
        
        <div className="header-actions">
          <div className="dropdown">
            <div className="dropdown-toggle" onClick={() => setShowDiscoverMenu(!showDiscoverMenu)}>
              <span>Découvrir</span>
              <FontAwesomeIcon icon={faChevronDown} />
            </div>
            {showDiscoverMenu && (
              <div className="dropdown-menu discover-menu">
                <div className="dropdown-list">
                  <div className="dropdown-list-item has-submenu">
                    <div 
                      className="dropdown-item" 
                      onClick={() => setShowBoatSubmenu(!showBoatSubmenu)}
                    >
                      Location de bateau <FontAwesomeIcon icon={faChevronRight} className="submenu-arrow" />
                    </div>
                    {showBoatSubmenu && (
                      <div className="submenu-container">
                        <Link to="/boats/motor" className="submenu-link">Bateaux à moteur</Link>
                        <Link to="/boats/sailing" className="submenu-link">Voiliers</Link>
                      </div>
                    )}
                  </div>
                  <div className="dropdown-list-item has-submenu">
                    <div 
                      className="dropdown-item" 
                      onClick={() => setShowDestinationsSubmenu(!showDestinationsSubmenu)}
                    >
                      Meilleures destinations <FontAwesomeIcon icon={faChevronRight} className="submenu-arrow" />
                    </div>
                    {showDestinationsSubmenu && (
                      <div className="submenu-container">
                        <Link to="/destinations/la-rochelle" className="submenu-link">La Rochelle</Link>
                        <Link to="/destinations/bastia" className="submenu-link">Bastia</Link>
                        <Link to="/destinations/porto-cristo" className="submenu-link">Porto Cristo</Link>
                      </div>
                    )}
                  </div>
                  <div className="dropdown-list-item has-submenu">
                    <div 
                      className="dropdown-item" 
                      onClick={() => setShowModelsSubmenu(!showModelsSubmenu)}
                    >
                      Modèles Populaires <FontAwesomeIcon icon={faChevronRight} className="submenu-arrow" />
                    </div>
                    {showModelsSubmenu && (
                      <div className="submenu-container">
                        <Link to="/models/beneteau" className="submenu-link">Beneteau</Link>
                        <Link to="/models/jeanneau" className="submenu-link">Jeanneau</Link>
                        <Link to="/models/lagoon" className="submenu-link">Lagoon</Link>
                      </div>
                    )}
                  </div>

                  <div className="dropdown-list-item">
                    <Link to="/help" className="dropdown-item">Aide</Link>
                  </div>
                  <div className="dropdown-list-item has-submenu">
                    <div 
                      className="dropdown-item" 
                      onClick={() => setShowAboutSubmenu(!showAboutSubmenu)}
                    >
                      A propos <FontAwesomeIcon icon={faChevronRight} className="submenu-arrow" />
                    </div>
                    {showAboutSubmenu && (
                      <div className="submenu-container">
                        <Link to="/about/company" className="submenu-link">Notre entreprise</Link>
                        <Link to="/about/team" className="submenu-link">L'équipe</Link>
                        <Link to="/about/contact" className="submenu-link">Nous contacter</Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="dropdown">
            <div className="user-dropdown" onClick={() => setShowUserMenu(!showUserMenu)}>
              <div className="flag-icon">
                <img src="/france-flag.svg" alt="Drapeau français" />
              </div>
              <div className="user-avatar">
                <img src={profileImage} alt="Photo de profil" onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentNode.textContent = 'Ce';
                }} />
              </div>
              <span>celine</span>
              <FontAwesomeIcon icon={faChevronDown} />
            </div>
            {showUserMenu && (
              <div className="dropdown-menu user-menu">
                <Link to="/dashboard" className="dropdown-item">
                  <span>Tableau de bord</span>
                </Link>
                <Link to="/locations" className="dropdown-item active">
                  <span>Mes locations</span>
                </Link>

                <Link to="/reviews" className="dropdown-item">
                  <span>Mes avis</span>
                </Link>
                <Link to="/favorites" className="dropdown-item">
                  <span>Mes favoris</span>
                </Link>

                <div className="dropdown-item logout-item" onClick={handleLogout}>
                  <span>Déconnexion</span>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Menu de navigation secondaire */}
      <div className="secondary-nav">
        <div className="secondary-nav-container">
          <Link to="/dashboard" className="nav-link">Tableau de bord</Link>
          <Link to="/locations" className="nav-link active">Mes locations</Link>
          <Link to="/reviews" className="nav-link">Mes avis</Link>
          <Link to="/favorites" className="nav-link">Mes favoris</Link>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="dashboard-container" style={{ backgroundColor: 'white', minHeight: '100vh' }}>
        <div className="locations-page">
          <div className="page-header">
            <h1>Mes locations</h1>
            <p>Gérez toutes vos réservations de bateaux</p>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="search-filters-section">
            <div className="search-bar-locations">
              <input
                type="text"
                placeholder="Rechercher par nom de bateau, destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
            </div>
            
            <button 
              className="filters-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FontAwesomeIcon icon={faFilter} />
              Filtres
            </button>
          </div>

          {/* Filtres */}
          {showFilters && (
            <div className="filters-panel">
              <div className="filter-group">
                <label>Statut</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">Tous les statuts</option>
                  <option value="confirmed">Confirmées</option>
                  <option value="pending">En attente</option>
                  <option value="completed">Terminées</option>
                  <option value="cancelled">Annulées</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Période</label>
                <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                  <option value="all">Toutes les périodes</option>
                  <option value="upcoming">À venir</option>
                  <option value="current">En cours</option>
                  <option value="past">Passées</option>
                </select>
              </div>
            </div>
          )}

          {/* Statistiques rapides */}
          <div className="stats-cards">
            <div className="stat-card">
              <h3>{locations.filter(l => l.status === 'confirmed').length}</h3>
              <p>Locations confirmées</p>
            </div>
            <div className="stat-card">
              <h3>{locations.filter(l => l.status === 'pending').length}</h3>
              <p>En attente</p>
            </div>
            <div className="stat-card">
              <h3>{locations.filter(l => l.status === 'cancelled').length}</h3>
              <p>Annulées</p>
            </div>
            <div className="stat-card">
              <h3>{locations.reduce((sum, l) => sum + l.totalPrice, 0).toLocaleString()}€</h3>
              <p>Total dépensé</p>
            </div>
          </div>

          {/* Liste des locations */}
          <div className="locations-list">
            {filteredLocations.length === 0 ? (
              <div className="empty-state">
                <FontAwesomeIcon icon={faExclamationTriangle} size="3x" />
                <h3>Aucune location trouvée</h3>
                <p>Aucune location ne correspond à vos critères de recherche.</p>
                <Link to="/boats/motor" className="cta-button">
                  Découvrir nos bateaux
                </Link>
              </div>
            ) : (
              filteredLocations.map((location) => (
                <div key={location.id} className="location-card">
                  <div className="location-image">
                    <img src={location.imageUrl} alt={location.boatName} />
                    <div className="status-badge">
                      {getStatusIcon(location.status)}
                      <span>{getStatusText(location.status)}</span>
                    </div>
                  </div>
                  
                  <div className="location-details">
                    <div className="location-header">
                      <h3>{location.boatName}</h3>
                      <span className="boat-type">{location.boatType}</span>
                    </div>
                    
                    <div className="location-info">
                      <div className="info-row">
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                        <span>{location.location}</span>
                      </div>
                      <div className="info-row">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        <span>{formatDate(location.startDate)} - {formatDate(location.endDate)}</span>
                      </div>
                      <div className="info-row">
                        <FontAwesomeIcon icon={faEuroSign} />
                        <span>{location.totalPrice.toLocaleString()}€ (total)</span>
                      </div>
                    </div>
                    
                    <div className="location-features">
                      {location.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="feature-tag">{feature}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="location-actions">
                    <button className="action-btn primary">
                      <FontAwesomeIcon icon={faEye} />
                      Voir détails
                    </button>
                    <button className="action-btn secondary">
                      <FontAwesomeIcon icon={faDownload} />
                      Facture
                    </button>
                    {location.status === 'completed' && (
                      <button className="action-btn secondary">
                        <FontAwesomeIcon icon={faStar} />
                        Laisser un avis
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-primary text-white mt-12 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-montserrat font-bold text-lg mb-4">À PROPOS</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">À propos</a></li>
                <li><a href="#" className="hover:underline">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:underline">CGU</a></li>
                <li><a href="#" className="hover:underline">Mentions légales</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-montserrat font-bold text-lg mb-4">NOUS FAIRE CONFIANCE</h3>
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              <p>Note : 4.8 / 5 calculée à partir de 5 000 avis</p>
              <a href="#" className="text-coral hover:underline mt-2 inline-block">Avis de notre communauté</a>
            </div>
            
            <div>
              <h3 className="font-montserrat font-bold text-lg mb-4">CONTACT</h3>
              <p className="mb-2">Besoin de conseils ?</p>
              <p className="mb-2">Nous sommes joignables :</p>
              <p className="mb-1">Du lundi au vendredi : 8h00 à 20h00</p>
              <p className="mb-2">Samedi et Dimanche : 10h00 à 18h00</p>
              <a href="mailto:contact@sailingloc.com" className="flex items-center text-coral hover:underline">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                contact@sailingloc.com
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-blue-700 text-center">
            <p>&copy; 2025 SailingLoc. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TenantLocations;