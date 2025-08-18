import React, { useState, useEffect } from 'react';
import LeaveReviewModal from '../../components/LeaveReviewModal';
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

  // Pour la modale d'avis
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewBoat, setReviewBoat] = useState(null);

  const [showBoatSubmenu, setShowBoatSubmenu] = useState(false);
  const [showDestinationsSubmenu, setShowDestinationsSubmenu] = useState(false);
  const [showModelsSubmenu, setShowModelsSubmenu] = useState(false);
  const [showAboutSubmenu, setShowAboutSubmenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // --- États & handlers pour les avis (manquants auparavant) ---
  const [openReviewId, setOpenReviewId] = useState(null);
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const handleSubmitReview = async (location) => {
    setReviewLoading(true);
    setReviewError('');
    setReviewSuccess('');
    try {
      // TODO: Intégrer l’appel à ton API d’avis ici
      console.log('Avis envoyé :', {
        reservationId: location.id,
        boatId: location.boatId,
        rating: reviewStars,
        comment: reviewComment
      });

      setReviewSuccess('Votre avis a bien été enregistré.');
      // Mock: rattacher l’avis au location courant côté UI
      setLocations((prev) =>
        prev.map((l) =>
          l.id === location.id
            ? { ...l, review: { rating: reviewStars, comment: reviewComment }, editingReview: false }
            : l
        )
      );
      setTimeout(() => {
        setOpenReviewId(null);
        setReviewStars(0);
        setReviewComment('');
        setReviewSuccess('');
      }, 1500);
    } catch (e) {
      setReviewError("Erreur lors de l’envoi de l’avis.");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleCancelReview = () => {
    setOpenReviewId(null);
    setReviewStars(0);
    setReviewComment('');
    setReviewError('');
    setReviewSuccess('');
  };
  // -------------------------------------------------------------

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
      const mappedLocations = (reservations || []).map((res) => {
        // Image du bateau
        let boatImage = '';
        if (Array.isArray(res.boat?.photos) && res.boat.photos.length > 0) {
          boatImage = res.boat.photos[0];
        } else if (Array.isArray(res.boat?.images) && res.boat.images.length > 0) {
          boatImage = res.boat.images[0];
        } else if (res.boat?.imageUrl) {
          boatImage = res.boat.imageUrl;
        } else {
          boatImage = '/api/placeholder/300/200';
        }

        return {
          id: res.id,
          boatId: res.boat?._id || res.boat?.id || '',
          boatName: res.boat?.name || 'Bateau',
          boatType: res.boat?.type || '',
          location: res.boat?.location || '',
          startDate: res.startDate,
          endDate: res.endDate,
          status: res.status,
          price: Number(res.price ?? 0),
          totalPrice: Number(res.totalPrice ?? res.price ?? 0),
          imageUrl: boatImage,
          bookingDate: res.createdAt || res.bookingDate,
          guests: res.guests || res.nbGuests,
          owner: res.boat?.owner?.name || '',
          features: res.boat?.features || [],
          review: res.review || null, // si l’API renvoie déjà un avis
          editingReview: false
        };
      });
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

    if (searchTerm) {
      filtered = filtered.filter((location) =>
        location.boatName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.boatType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((location) => location.status === statusFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter((location) => {
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
      console.error('Erreur lors de la déconnexion', error);
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
      {/* Header */}
      <header className="main-header">
        <div className="header-left">
          <div className="header-logo">
            <img src={logoBlc} alt="Sailing Loc" />
          </div>
        </div>

        <div className="header-actions">
          <div className="dropdown">
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
                <img
                  src={profileImage}
                  alt="Photo de profil"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    if (e.target.parentNode) e.target.parentNode.textContent = 'Ce';
                  }}
                />
              </div>
              <span>{currentUser?.email || 'Utilisateur'}</span>
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

      {/* Navigation secondaire */}
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

          {/* Barre de recherche & filtres */}
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

          {/* Panneau filtres */}
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

          {/* Stats */}
          <div className="stats-cards">
            <div className="stat-card">
              <h3>{locations.filter((l) => l.status === 'confirmed').length}</h3>
              <p>Locations confirmées</p>
            </div>
            <div className="stat-card">
              <h3>{locations.filter((l) => l.status === 'pending').length}</h3>
              <p>En attente</p>
            </div>
            <div className="stat-card">
              <h3>{locations.filter((l) => l.status === 'cancelled').length}</h3>
              <p>Annulées</p>
            </div>
            <div className="stat-card">
              <h3>
                {locations
                  .reduce((sum, l) => sum + Number(l.totalPrice || 0), 0)
                  .toLocaleString()}
                €
              </h3>
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
                    <img
                      src={
                        location.imageUrl && location.imageUrl !== '/api/placeholder/300/200'
                          ? location.imageUrl
                          : 'https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=2070&auto=format&fit=crop'
                      }
                      alt={location.boatName}
                    />
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
                        <span>
                          {formatDate(location.startDate)} - {formatDate(location.endDate)}
                        </span>
                      </div>
                      <div className="info-row">
                        <FontAwesomeIcon icon={faEuroSign} />
                        <span>{Number(location.totalPrice || 0).toLocaleString()}€ (total)</span>
                      </div>
                    </div>
                  </div>

                  <div className="location-actions">
                    <Link
                      to={`/boats/${location.boatId || location.id || ''}`}
                      className="action-btn primary"
                    >
                      <FontAwesomeIcon icon={faEye} />
                      Voir détails
                    </Link>

                    {location.status === 'confirmed' && (
                      <>
                        {!location.review || location.editingReview ? (
                          <>
                            <button
                              className="action-btn secondary"
                              onClick={() => setOpenReviewId(location.id)}
                              disabled={openReviewId === location.id}
                              aria-expanded={openReviewId === location.id}
                              aria-controls={`review-block-${location.id}`}
                            >
                              <FontAwesomeIcon icon={faStar} />
                              {location.review ? 'Modifier mon avis' : 'Laisser un avis'}
                            </button>

                            
                                                      </>
                        ) : (
                          // Lecture seule si avis déjà laissé
                          <div
                            className="review-block"
                            style={{
                              background: '#f6f8fa',
                              borderRadius: 8,
                              marginTop: 16,
                              padding: 16,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  style={{
                                    color: star <= (location.review?.rating || 0) ? '#FFD700' : '#ccc',
                                    fontSize: 24
                                  }}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <div style={{ marginBottom: 8 }}>{location.review?.comment}</div>
                            <button
                              className="text-coral underline ml-2"
                              onClick={() => {
                                setReviewBoat({ name: location.boatName, type: location.boatType });
                                setReviewModalOpen(true);
                              }}
                            >
                              Laisser un avis
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>  
            )))}
          </div>
          </div>
        </div>
      </div>
    )

      {/* Modale d'avis */}
      <LeaveReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        boat={reviewBoat}
        onSubmit={(reviewData) => {
          // TODO : envoyer reviewData au backend ici
          setReviewModalOpen(false);
        }}
      />

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
              <a href="mailto:contact@sailingloc.com" className="flex items-center text-coral hover:underline">contact@sailingloc.com</a>
            </div>
          </div>
          </div>
          </footer>

  // Bloc d'avis extérieur (hors mapping)
  const locationToReview = locations.find(l => l.id === openReviewId);

  return (
    <div className="tenant-locations-wrapper">
      {/* ... mapping des locations ... */}
      {filteredLocations.map((location) => (
        <div key={location.id} className="location-card">
          {/* Ici, ton rendu habituel de la carte location, exemple simplifié : */}
          <div className="flex items-center gap-4">
            <img src={location.boatImage} alt={location.boatName} style={{width:80,height:60,borderRadius:8,objectFit:'cover'}} />
            <div className="flex-1">
              <div className="font-semibold text-lg">{location.boatName}</div>
              <div className="text-xs text-gray-500">{location.boatType}</div>
              <div className="text-xs text-gray-400">{location.startDate} - {location.endDate}</div>
              <div className="mt-2">
                <button className="action-btn secondary" onClick={() => setOpenReviewId(location.id)}>
                  <FontAwesomeIcon icon={faStar} /> {location.review ? 'Modifier mon avis' : 'Laisser un avis'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Bloc d'avis extérieur */}
      {openReviewId && locationToReview && (
        <div
          id={`review-block-${openReviewId}`}
          className="review-block"
          style={{
            background: '#fff',
            borderRadius: 16,
            margin: '32px auto',
            padding: 24,
            boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
            maxWidth: 480,
            border: '1px solid #f0f0f0',
            position: 'relative',
            zIndex: 100,
            left: 0,
            right: 0
          }}
        >
          <div style={{fontWeight:600, marginBottom: 8}}>Laisser un avis</div>
          <div style={{marginBottom: 6}}>
            <span style={{fontWeight:500}}>Bateau :</span> <span>{locationToReview.boatName}</span> <span style={{fontSize:12, color:'#888', marginLeft:8}}>Type : {locationToReview.boatType}</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
            {[1,2,3,4,5].map(star => (
              <span
                key={star}
                style={{fontSize:'2rem',color:star<=reviewStars?'#FFD600':'#E0E0E0',cursor:'pointer'}}
                onClick={()=>setReviewStars(star)}
                aria-label={star+' étoiles'}
              >★</span>
            ))}
          </div>
          <div className="text-xs text-gray-500 mb-2">{['Médiocre','Passable','Bien','Très bien','Excellent'][reviewStars-1] || ''}</div>
          <textarea
            className="review-textarea"
            style={{width:'100%',minHeight:60,borderRadius:6,border:'1px solid #ddd',padding:8,marginBottom:8}}
            placeholder="Partagez votre expérience avec ce bateau... (minimum 10 caractères)"
            value={reviewComment}
            onChange={e=>setReviewComment(e.target.value)}
            maxLength={1000}
          />
          <div className="text-xs text-gray-400 mb-2">{reviewComment.length}/1000 caractères</div>
          {reviewError && <div style={{ color: 'red', marginBottom: 8 }}>{reviewError}</div>}
          {reviewSuccess && <div style={{ color: 'green', marginBottom: 8 }}>{reviewSuccess}</div>}
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <button type="button" className="action-btn secondary" onClick={handleCancelReview}>Annuler</button>
            <button type="button" className="action-btn primary" onClick={()=>{
              if(reviewComment.trim().length<10){setReviewError('Votre avis doit contenir au moins 10 caractères.');return;}
              setReviewError('');
              handleSubmitReview(locationToReview);
            }} disabled={reviewStars===0 || reviewComment.trim().length<10 || reviewLoading}>
              {reviewLoading ? 'Envoi...' : 'Envoyer'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantLocations;

