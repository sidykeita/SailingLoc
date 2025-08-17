import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faChevronDown, 
  faChevronRight, 
  faSignOutAlt, 
  faExchangeAlt,
  faUser,
  faHeart,
  faMapMarkerAlt,
  faUsers,
  faAnchor,
  faFilter,
  faSort,
  faEye,
  faShare,
  faTrash,
  faCalendar,
  faEuro,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartEmpty } from '@fortawesome/free-regular-svg-icons';
import logoBlc from '../../assets/images/logo-blc.png';
import profileImage from '../../assets/images/profil.jpg';
import '../../assets/css/SimpleDashboard.css';
import '../../assets/css/TenantLocations.css';
import '../../assets/css/TenantFavorites.css';

const TenantFavorites = () => {
  const { currentUser, logout, userRole, switchRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showDiscoverMenu, setShowDiscoverMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Mock favorites data
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      type: 'voilier',
      name: 'Oceanis 40 - "Liberté"',
      location: 'Marseille, France',
      owner: 'Pierre Durand',
      rating: 4.8,
      reviewCount: 24,
      price: 180,
      capacity: 8,
      images: [profileImage],
      description: 'Magnifique voilier parfait pour découvrir les calanques marseillaises. Équipé de tout le confort moderne.',
      amenities: ['WiFi', 'Cuisine équipée', 'Douche', 'GPS'],
      dateAdded: '2024-03-10',
      available: true
    },
    {
      id: 2,
      type: 'catamaran',
      name: 'Lagoon 42 - "Évasion"',
      location: 'Cannes, France',
      owner: 'Marie Dubois',
      rating: 4.9,
      reviewCount: 31,
      price: 320,
      capacity: 10,
      images: [profileImage],
      description: 'Catamaran spacieux et confortable, idéal pour des vacances en famille ou entre amis sur la Côte d\'Azur.',
      amenities: ['Climatisation', 'Plancha', 'Kayaks', 'Équipement snorkeling'],
      dateAdded: '2024-02-28',
      available: true
    },
    {
      id: 3,
      type: 'yacht',
      name: 'Princess 50 - "Prestige"',
      location: 'Monaco',
      owner: 'Jean-Claude Martin',
      rating: 5.0,
      reviewCount: 18,
      price: 850,
      capacity: 12,
      images: [profileImage],
      description: 'Yacht de luxe pour une expérience exceptionnelle. Service haut de gamme et équipements premium.',
      amenities: ['Jacuzzi', 'Bar', 'Jet ski', 'Service de conciergerie'],
      dateAdded: '2024-01-15',
      available: false
    },
    {
      id: 4,
      type: 'voilier',
      name: 'Beneteau First 35 - "Aventure"',
      location: 'Nice, France',
      owner: 'Sophie Laurent',
      rating: 4.7,
      reviewCount: 15,
      price: 150,
      capacity: 6,
      images: [profileImage],
      description: 'Voilier sportif parfait pour les passionnés de navigation. Performances exceptionnelles et sensations garanties.',
      amenities: ['Pilote automatique', 'Spi asymétrique', 'Winch électrique'],
      dateAdded: '2024-01-20',
      available: true
    },
    {
      id: 5,
      type: 'catamaran',
      name: 'Fountaine Pajot 40 - "Sérénité"',
      location: 'Saint-Tropez, France',
      owner: 'Antoine Moreau',
      rating: 4.6,
      reviewCount: 22,
      price: 280,
      capacity: 8,
      images: [profileImage],
      description: 'Catamaran élégant et performant, parfait pour explorer les îles d\'Hyères en toute tranquillité.',
      amenities: ['Panneaux solaires', 'Dessalinisateur', 'Annexe avec moteur'],
      dateAdded: '2024-03-05',
      available: true
    }
  ]);

  const [stats] = useState({
    totalFavorites: 5,
    availableNow: 4,
    averagePrice: 356,
    locations: ['Marseille', 'Cannes', 'Monaco', 'Nice', 'Saint-Tropez']
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const removeFavorite = (id) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'voilier':
        return faAnchor;
      case 'catamaran':
        return faAnchor;
      case 'yacht':
        return faAnchor;
      default:
        return faAnchor;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'voilier':
        return 'Voilier';
      case 'catamaran':
        return 'Catamaran';
      case 'yacht':
        return 'Yacht';
      default:
        return type;
    }
  };

  const filteredFavorites = () => {
    let filtered = [...favorites];

    if (filterType !== 'all') {
      filtered = filtered.filter(fav => fav.type === filterType);
    }

    if (filterLocation !== 'all') {
      filtered = filtered.filter(fav => fav.location.includes(filterLocation));
    }

    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} className="star filled" />);
    }

    if (hasHalfStar) {
      stars.push(<FontAwesomeIcon key="half" icon={faStar} className="star half" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={faStar} className="star empty" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Chargement de vos favoris...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header className="main-header">
        <div className="header-left">
          <div className="header-logo">
            <img src={logoBlc} alt="Sailing Loc" />
          </div>
        </div>
        
        <div className="header-center">
          <nav className="main-nav">
            <div className="nav-item dropdown">
              <button 
                className="nav-button"
                onClick={() => setShowDiscoverMenu(!showDiscoverMenu)}
              >
                <span>Découvrir</span>
                <FontAwesomeIcon icon={showDiscoverMenu ? faChevronDown : faChevronRight} />
              </button>
              {showDiscoverMenu && (
                <div className="dropdown-menu">
                  <Link to="/boats">Tous les bateaux</Link>
                  <Link to="/destinations">Destinations</Link>
                  <Link to="/experiences">Expériences</Link>
                </div>
              )}
            </div>
            <Link to="/help" className="nav-button">Aide</Link>
          </nav>
        </div>

        <div className="header-right">
          <div className="search-container">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input type="text" placeholder="Rechercher..." />
          </div>
          
          <div className="user-menu dropdown">
            <button 
              className="user-button"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <img src={profileImage} alt="Profile" className="user-avatar" />
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
            {showUserMenu && (
              <div className="dropdown-menu user-dropdown">
                <div className="user-info">
                  <img src={profileImage} alt="Profile" />
                  <div>
                    <p className="user-name">Timothy Miafouna</p>
                    <p className="user-role">{userRole === 'owner' ? 'Propriétaire' : 'Locataire'}</p>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <Link to="/profile" className="dropdown-item">
                  <FontAwesomeIcon icon={faUser} />
                  <span>Mon profil</span>
                </Link>
                <button 
                  className="dropdown-item role-switch"
                  onClick={() => switchRole(userRole === 'owner' ? 'tenant' : 'owner')}
                >
                  <FontAwesomeIcon icon={faExchangeAlt} />
                  <span>Passer en {userRole === 'owner' ? 'locataire' : 'propriétaire'}</span>
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout" onClick={logout}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Se déconnecter</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Secondary Navigation */}
      <div className="secondary-nav">
        <div className="secondary-nav-container">
          <Link to="/dashboard" className="nav-link">Tableau de bord</Link>
          <Link to="/locations" className="nav-link">Mes locations</Link>
          <Link to="/account" className="nav-link">Mon compte</Link>
          <Link to="/reviews" className="nav-link">Mes avis</Link>
          <Link to="/favorites" className="nav-link active">Mes favoris</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-container">
        <div className="favorites-page">
          <div className="page-header">
            <h1>Mes favoris</h1>
            <p>Retrouvez tous les bateaux que vous avez ajoutés à vos favoris</p>
          </div>

          {/* Favorites Stats */}
          <div className="favorites-stats">
            <div className="stats-card">
              <div className="stat-number">{stats.totalFavorites}</div>
              <div className="stat-label">Favoris</div>
            </div>
            <div className="stats-card">
              <div className="stat-number">{stats.availableNow}</div>
              <div className="stat-label">Disponibles maintenant</div>
            </div>
            <div className="stats-card">
              <div className="stat-number">{stats.averagePrice}€</div>
              <div className="stat-label">Prix moyen/jour</div>
            </div>
            <div className="stats-card">
              <div className="stat-number">{stats.locations.length}</div>
              <div className="stat-label">Destinations</div>
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="favorites-controls">
            <div className="filter-group">
              <FontAwesomeIcon icon={faFilter} />
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Tous les types</option>
                <option value="voilier">Voiliers</option>
                <option value="catamaran">Catamarans</option>
                <option value="yacht">Yachts</option>
              </select>
            </div>
            <div className="filter-group">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <select 
                value={filterLocation} 
                onChange={(e) => setFilterLocation(e.target.value)}
              >
                <option value="all">Toutes les destinations</option>
                <option value="Marseille">Marseille</option>
                <option value="Cannes">Cannes</option>
                <option value="Monaco">Monaco</option>
                <option value="Nice">Nice</option>
                <option value="Saint-Tropez">Saint-Tropez</option>
              </select>
            </div>
            <div className="sort-group">
              <FontAwesomeIcon icon={faSort} />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Plus récents</option>
                <option value="oldest">Plus anciens</option>
                <option value="price-low">Prix croissant</option>
                <option value="price-high">Prix décroissant</option>
                <option value="rating">Mieux notés</option>
              </select>
            </div>
          </div>

          {/* Favorites Grid */}
          <div className="favorites-grid">
            {filteredFavorites().map(favorite => (
              <div key={favorite.id} className="favorite-card">
                <div className="card-image">
                  <img src={favorite.images[0]} alt={favorite.name} />
                  <div className="card-overlay">
                    <button 
                      className="favorite-btn active"
                      onClick={() => removeFavorite(favorite.id)}
                    >
                      <FontAwesomeIcon icon={faHeart} />
                    </button>
                    <div className="availability-badge">
                      {favorite.available ? (
                        <span className="available">Disponible</span>
                      ) : (
                        <span className="unavailable">Indisponible</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="card-content">
                  <div className="card-header">
                    <div className="boat-type">
                      <FontAwesomeIcon icon={getTypeIcon(favorite.type)} />
                      <span>{getTypeLabel(favorite.type)}</span>
                    </div>
                    <div className="rating">
                      <div className="stars">
                        {renderStars(favorite.rating)}
                      </div>
                      <span className="rating-text">
                        {favorite.rating} ({favorite.reviewCount})
                      </span>
                    </div>
                  </div>

                  <h3 className="boat-name">{favorite.name}</h3>

                  <div className="location">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span>{favorite.location}</span>
                  </div>

                  <div className="owner">
                    <FontAwesomeIcon icon={faUser} />
                    <span>Propriétaire: {favorite.owner}</span>
                  </div>

                  <div className="capacity">
                    <FontAwesomeIcon icon={faUsers} />
                    <span>Jusqu'à {favorite.capacity} personnes</span>
                  </div>

                  <p className="description">{favorite.description}</p>

                  <div className="amenities">
                    {favorite.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="amenity-tag">{amenity}</span>
                    ))}
                    {favorite.amenities.length > 3 && (
                      <span className="amenity-more">+{favorite.amenities.length - 3}</span>
                    )}
                  </div>

                  <div className="card-footer">
                    <div className="price">
                      <span className="price-amount">{favorite.price}€</span>
                      <span className="price-unit">/jour</span>
                    </div>
                    <div className="card-actions">
                      <button className="action-btn secondary">
                        <FontAwesomeIcon icon={faShare} />
                        Partager
                      </button>
                      <button className="action-btn primary">
                        <FontAwesomeIcon icon={faEye} />
                        Voir détails
                      </button>
                    </div>
                  </div>

                  <div className="added-date">
                    <FontAwesomeIcon icon={faCalendar} />
                    <span>Ajouté le {new Date(favorite.dateAdded).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFavorites().length === 0 && (
            <div className="empty-state">
              <FontAwesomeIcon icon={faHeartEmpty} className="empty-icon" />
              <h3>Aucun favori trouvé</h3>
              <p>
                {filterType !== 'all' || filterLocation !== 'all' 
                  ? 'Aucun bateau ne correspond à vos critères de recherche.'
                  : 'Vous n\'avez pas encore ajouté de bateaux à vos favoris.'
                }
              </p>
              <Link to="/boats" className="cta-button">
                <FontAwesomeIcon icon={faSearch} />
                Découvrir des bateaux
              </Link>
            </div>
          )}

          {/* Quick Actions */}
          {favorites.length > 0 && (
            <div className="quick-actions">
              <h3>Actions rapides</h3>
              <div className="actions-grid">
                <button className="quick-action-btn">
                  <FontAwesomeIcon icon={faShare} />
                  <span>Partager ma liste</span>
                </button>
                <button className="quick-action-btn">
                  <FontAwesomeIcon icon={faCalendar} />
                  <span>Planifier un voyage</span>
                </button>
                <button className="quick-action-btn">
                  <FontAwesomeIcon icon={faFilter} />
                  <span>Recherche avancée</span>
                </button>
                <button 
                  className="quick-action-btn danger"
                  onClick={() => {
                    if (window.confirm('Êtes-vous sûr de vouloir supprimer tous vos favoris ?')) {
                      setFavorites([]);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  <span>Vider la liste</span>
                </button>
              </div>
            </div>
          )}
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
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1">4.8/5 - 2,847 avis</span>
              </div>
              <p className="text-sm">Plus de 10,000 clients satisfaits</p>
            </div>
            
            <div>
              <h3 className="font-montserrat font-bold text-lg mb-4">CONTACT</h3>
              <div className="space-y-2">
                <p>📞 +33 4 91 00 00 00</p>
                <p>✉️ contact@sailingloc.com</p>
                <p>📍 Marseille, France</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-600 mt-8 pt-8 text-center">
            <p>&copy; 2025 SailingLoc. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TenantFavorites;