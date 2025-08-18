import React, { useState, useEffect } from 'react';
import TenantHeader from '../../components/tenant/TenantHeader';
import { getFavorites, removeFavorite as removeFavoriteApi } from '../../services/favoriteService';
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

  // Données favoris dynamiques
  const [favorites, setFavorites] = useState([]);
  const [stats] = useState({
    totalFavorites: 0,
    availableNow: 0,
    averagePrice: 0,
    locations: []
  });

  useEffect(() => {
    setLoading(true);
    getFavorites()
      .then(res => {
        setFavorites(res.data);
        setLoading(false);
      })
      .catch(() => {
        setFavorites([]);
        setLoading(false);
      });
  }, []);

  const removeFavorite = async (boatId) => {
    setLoading(true);
    try {
      await removeFavoriteApi(boatId);
      setFavorites(prev => prev.filter(fav => fav._id !== boatId));
    } catch (e) {
      // Optionally afficher une erreur
    }
    setLoading(false);
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
      <TenantHeader activeSection="favorites" />

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
              <div key={favorite._id || favorite.id} className="favorite-card">
                <div className="card-image">
                  <img src={Array.isArray(favorite.photos) && favorite.photos.length > 0 ? favorite.photos[0] : (Array.isArray(favorite.images) && favorite.images.length > 0 ? favorite.images[0] : 'https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=2070&auto=format&fit=crop')} alt={favorite.name} />
                  <div className="card-overlay">
                    <button 
                      className="favorite-btn active"
                      onClick={() => removeFavorite(favorite._id || favorite.id)}
                    >
                      <FontAwesomeIcon icon={faHeart} />
                    </button>
                    <div className="availability-badge">
                      {(favorite.status === 'disponible' || favorite.available) ? (
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
                    <span>Propriétaire: {favorite.owner?.firstName || ''} {favorite.owner?.lastName || favorite.owner?.name || ''}</span>
                  </div>

                  <div className="capacity">
                    <FontAwesomeIcon icon={faUsers} />
                    <span>Jusqu'à {favorite.capacity} personnes</span>
                  </div>

                  <p className="description">{favorite.description}</p>

                  <div className="amenities">
                    {Array.isArray(favorite.amenities) && favorite.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="amenity-tag">{amenity}</span>
                    ))}
                    {Array.isArray(favorite.amenities) && favorite.amenities.length > 3 && (
                      <span className="amenity-more">+{favorite.amenities.length - 3}</span>
                    )}
                  </div>

                  <div className="card-footer">
                    <div className="price">
                      <span className="price-amount">{favorite.dailyPrice || favorite.price || 0}€</span>
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