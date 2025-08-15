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
  faStar,
  faStarHalfAlt,
  faCalendar,
  faFilter,
  faSort,
  faEye,
  faReply,
  faFlag
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import logoBlc from '../../assets/images/logo-blc.png';
import profileImage from '../../assets/images/profil.jpg';
import '../../assets/css/SimpleDashboard.css';
import '../../assets/css/TenantLocations.css';
import '../../assets/css/TenantReviews.css';

const TenantReviews = () => {
  const { currentUser, logout, userRole, switchRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showDiscoverMenu, setShowDiscoverMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'given'
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Mock reviews data
  const [reviewsReceived] = useState([
    {
      id: 1,
      reviewer: {
        name: 'Marie Dubois',
        avatar: profileImage,
        memberSince: '2022'
      },
      rating: 5,
      date: '2024-03-15',
      booking: {
        boat: 'Voilier Oceanis 40',
        location: 'Marseille',
        dates: '10-17 Mars 2024'
      },
      comment: 'Excellente expérience avec Timothy ! Le bateau était en parfait état, très propre et bien équipé. Timothy a été très accueillant et nous a donné de précieux conseils pour naviguer dans la région. Communication parfaite du début à la fin. Je recommande vivement !',
      helpful: 12,
      response: null
    },
    {
      id: 2,
      reviewer: {
        name: 'Jean-Pierre Martin',
        avatar: profileImage,
        memberSince: '2021'
      },
      rating: 4,
      date: '2024-02-28',
      booking: {
        boat: 'Catamaran Lagoon 42',
        location: 'Cannes',
        dates: '25-28 Février 2024'
      },
      comment: 'Très bon séjour ! Le catamaran était conforme à la description et Timothy a été disponible pour répondre à nos questions. Seul petit bémol : quelques équipements de sécurité auraient mérité d\'être renouvelés, mais rien de grave. Dans l\'ensemble, une expérience positive que je renouvellerai.',
      helpful: 8,
      response: {
        date: '2024-03-01',
        text: 'Merci Jean-Pierre pour votre retour constructif ! J\'ai pris note de vos remarques concernant les équipements de sécurité et je vais procéder aux renouvellements nécessaires. Au plaisir de vous revoir bientôt !'
      }
    },
    {
      id: 3,
      reviewer: {
        name: 'Sophie Laurent',
        avatar: profileImage,
        memberSince: '2023'
      },
      rating: 5,
      date: '2024-01-20',
      booking: {
        boat: 'Voilier Beneteau First 35',
        location: 'Nice',
        dates: '18-22 Janvier 2024'
      },
      comment: 'Une semaine de rêve ! Timothy est un hôte exceptionnel, très professionnel et passionné. Le voilier est magnifique et parfaitement entretenu. Les explications techniques étaient claires et rassurantes. Merci pour cette belle découverte de la Côte d\'Azur !',
      helpful: 15,
      response: {
        date: '2024-01-21',
        text: 'Merci Sophie pour ce magnifique retour ! C\'était un plaisir de partager ma passion avec vous. À bientôt sur les flots !'
      }
    }
  ]);

  const [reviewsGiven] = useState([
    {
      id: 1,
      owner: {
        name: 'Pierre Durand',
        avatar: profileImage,
        memberSince: '2020'
      },
      rating: 5,
      date: '2024-02-10',
      booking: {
        boat: 'Yacht Princess 50',
        location: 'Monaco',
        dates: '5-10 Février 2024'
      },
      comment: 'Bateau exceptionnel et propriétaire très accueillant ! Pierre nous a fait découvrir les plus beaux mouillages de la région. Tout était parfait : l\'accueil, l\'état du bateau, les conseils prodigués. Une expérience inoubliable que je recommande sans hésitation.',
      helpful: 0
    },
    {
      id: 2,
      owner: {
        name: 'Catherine Moreau',
        avatar: profileImage,
        memberSince: '2019'
      },
      rating: 4,
      date: '2024-01-15',
      booking: {
        boat: 'Voilier Jeanneau Sun Odyssey',
        location: 'Saint-Tropez',
        dates: '12-16 Janvier 2024'
      },
      comment: 'Très belle expérience ! Le voilier était en bon état et Catherine très disponible. Quelques petits détails d\'entretien à prévoir mais rien qui n\'ait gâché notre plaisir. La région est magnifique et les conseils de navigation très utiles.',
      helpful: 0
    }
  ]);

  const [stats] = useState({
    averageRating: 4.7,
    totalReviews: 28,
    ratingDistribution: {
      5: 18,
      4: 7,
      3: 2,
      2: 1,
      1: 0
    }
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} className="star filled" />);
    }

    if (hasHalfStar) {
      stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} className="star filled" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={faStarEmpty} className="star empty" />);
    }

    return stars;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const filteredReviews = (reviews) => {
    let filtered = [...reviews];

    if (filterRating !== 'all') {
      const rating = parseInt(filterRating);
      filtered = filtered.filter(review => review.rating === rating);
    }

    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'rating-high') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'rating-low') {
      filtered.sort((a, b) => a.rating - b.rating);
    }

    return filtered;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Chargement de vos avis...</p>
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
          <Link to="/reviews" className="nav-link active">Mes avis</Link>
          <Link to="/favorites" className="nav-link">Mes favoris</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-container">
        <div className="reviews-page">
          <div className="page-header">
            <h1>Mes avis</h1>
            <p>Consultez les avis que vous avez reçus et donnés</p>
          </div>

          {/* Reviews Stats */}
          <div className="reviews-stats">
            <div className="stats-card">
              <div className="stat-number">{stats.averageRating}</div>
              <div className="stat-stars">{renderStars(stats.averageRating)}</div>
              <div className="stat-label">Note moyenne</div>
            </div>
            <div className="stats-card">
              <div className="stat-number">{stats.totalReviews}</div>
              <div className="stat-label">Avis reçus</div>
            </div>
            <div className="stats-card">
              <div className="stat-number">{reviewsGiven.length}</div>
              <div className="stat-label">Avis donnés</div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="rating-distribution">
            <h3>Répartition des notes</h3>
            <div className="distribution-bars">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="distribution-row">
                  <span className="rating-label">{rating} étoiles</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${(stats.ratingDistribution[rating] / stats.totalReviews) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="count">{stats.ratingDistribution[rating]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="reviews-tabs">
            <button 
              className={`tab ${activeTab === 'received' ? 'active' : ''}`}
              onClick={() => setActiveTab('received')}
            >
              Avis reçus ({reviewsReceived.length})
            </button>
            <button 
              className={`tab ${activeTab === 'given' ? 'active' : ''}`}
              onClick={() => setActiveTab('given')}
            >
              Avis donnés ({reviewsGiven.length})
            </button>
          </div>

          {/* Filters and Sort */}
          <div className="reviews-controls">
            <div className="filter-group">
              <FontAwesomeIcon icon={faFilter} />
              <select 
                value={filterRating} 
                onChange={(e) => setFilterRating(e.target.value)}
              >
                <option value="all">Toutes les notes</option>
                <option value="5">5 étoiles</option>
                <option value="4">4 étoiles</option>
                <option value="3">3 étoiles</option>
                <option value="2">2 étoiles</option>
                <option value="1">1 étoile</option>
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
                <option value="rating-high">Note décroissante</option>
                <option value="rating-low">Note croissante</option>
              </select>
            </div>
          </div>

          {/* Reviews List */}
          <div className="reviews-list">
            {activeTab === 'received' ? (
              filteredReviews(reviewsReceived).map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <img src={review.reviewer.avatar} alt={review.reviewer.name} />
                      <div>
                        <h4>{review.reviewer.name}</h4>
                        <p>Membre depuis {review.reviewer.memberSince}</p>
                      </div>
                    </div>
                    <div className="review-meta">
                      <div className="review-rating">
                        {renderStars(review.rating)}
                      </div>
                      <div className="review-date">
                        <FontAwesomeIcon icon={faCalendar} />
                        {formatDate(review.date)}
                      </div>
                    </div>
                  </div>

                  <div className="booking-info">
                    <strong>{review.booking.boat}</strong> • {review.booking.location} • {review.booking.dates}
                  </div>

                  <div className="review-content">
                    <p>{review.comment}</p>
                  </div>

                  {review.response && (
                    <div className="review-response">
                      <div className="response-header">
                        <FontAwesomeIcon icon={faReply} />
                        <span>Votre réponse • {formatDate(review.response.date)}</span>
                      </div>
                      <p>{review.response.text}</p>
                    </div>
                  )}

                  <div className="review-actions">
                    <button className="action-btn">
                      <FontAwesomeIcon icon={faEye} />
                      Voir la réservation
                    </button>
                    {!review.response && (
                      <button className="action-btn primary">
                        <FontAwesomeIcon icon={faReply} />
                        Répondre
                      </button>
                    )}
                    <button className="action-btn">
                      <FontAwesomeIcon icon={faFlag} />
                      Signaler
                    </button>
                    <span className="helpful-count">
                      {review.helpful} personnes ont trouvé cet avis utile
                    </span>
                  </div>
                </div>
              ))
            ) : (
              filteredReviews(reviewsGiven).map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <img src={review.owner.avatar} alt={review.owner.name} />
                      <div>
                        <h4>{review.owner.name}</h4>
                        <p>Propriétaire depuis {review.owner.memberSince}</p>
                      </div>
                    </div>
                    <div className="review-meta">
                      <div className="review-rating">
                        {renderStars(review.rating)}
                      </div>
                      <div className="review-date">
                        <FontAwesomeIcon icon={faCalendar} />
                        {formatDate(review.date)}
                      </div>
                    </div>
                  </div>

                  <div className="booking-info">
                    <strong>{review.booking.boat}</strong> • {review.booking.location} • {review.booking.dates}
                  </div>

                  <div className="review-content">
                    <p>{review.comment}</p>
                  </div>

                  <div className="review-actions">
                    <button className="action-btn">
                      <FontAwesomeIcon icon={faEye} />
                      Voir la réservation
                    </button>
                    <button className="action-btn">
                      <FontAwesomeIcon icon={faEdit} />
                      Modifier l'avis
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {filteredReviews(activeTab === 'received' ? reviewsReceived : reviewsGiven).length === 0 && (
            <div className="empty-state">
              <FontAwesomeIcon icon={faStar} className="empty-icon" />
              <h3>Aucun avis trouvé</h3>
              <p>
                {activeTab === 'received' 
                  ? 'Vous n\'avez pas encore reçu d\'avis avec ces critères.'
                  : 'Vous n\'avez pas encore donné d\'avis avec ces critères.'
                }
              </p>
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

export default TenantReviews;
