import React, { useState, useEffect } from 'react';
import TenantHeader from '../../components/tenant/TenantHeader';
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
  faFlag,
  faEdit
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import logoBlc from '../../assets/images/logo-blc.png';
import profileImage from '../../assets/images/profil.jpg';
import '../../assets/css/SimpleDashboard.css';
import '../../assets/css/TenantLocations.css';
import '../../assets/css/TenantReviews.css';
import reviewService from '../../services/review.service';

const TenantReviews = () => {
  const { currentUser, logout, userRole, switchRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showDiscoverMenu, setShowDiscoverMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'given'
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Reviews dynamiques depuis l'API
  const [reviewsReceived, setReviewsReceived] = useState([]);
  const [reviewsGiven, setReviewsGiven] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });

  // Chargement des reviews depuis le backend
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        // Avis donnés par l'utilisateur (reviews que j'ai postées)
        const given = await reviewService.getMyReviews().catch(() => []);

        // Normaliser en tableaux
        const givenList = Array.isArray(given?.data) ? given.data : (Array.isArray(given) ? given : []);

        // Mapper pour l'UI
        const mapToCard = (r, direction = 'received') => {
          const reviewer = r.user || r.author || r.reviewer || {};
          const owner = (r.owner && typeof r.owner === 'object') ? r.owner : (r.boat?.owner || {});
          const reservation = r.reservation || r.booking || {};
          const boat = r.boat || reservation?.boat || {};
          const createdAt = r.createdAt || r.date || new Date().toISOString();
          const port = boat?.port || reservation?.port || reservation?.location || '';
          const response = r.ownerResponse || r.response || null;
          return {
            id: r._id || r.id,
            rating: Number(r.rating || 0),
            comment: r.comment || r.text || '',
            date: createdAt,
            reviewer: {
              name: reviewer.firstName ? `${reviewer.firstName} ${reviewer.lastName || ''}`.trim() : (reviewer.name || 'Utilisateur'),
              avatar: reviewer.avatar || reviewer.photo || profileImage,
              memberSince: (reviewer.createdAt ? new Date(reviewer.createdAt).getFullYear() : '—')
            },
            owner: {
              name: owner.firstName ? `${owner.firstName} ${owner.lastName || ''}`.trim() : (owner.name || 'Propriétaire'),
              avatar: owner.avatar || owner.photo || profileImage,
              memberSince: (owner.createdAt ? new Date(owner.createdAt).getFullYear() : '—')
            },
            booking: {
              boat: boat?.name || 'Bateau',
              location: port || '—',
              dates: reservation?.startDate && reservation?.endDate
                ? `${new Date(reservation.startDate).toLocaleDateString('fr-FR')} - ${new Date(reservation.endDate).toLocaleDateString('fr-FR')}`
                : ''
            },
            response: response
              ? {
                  text: response.text,
                  date: response.createdAt || response.date
                }
              : null,
            helpful: Number(r.helpful || 0)
          };
        };

        const givenCards = givenList.map(r => mapToCard(r, 'given'));
        // Avis reçus = réponses à mes avis
        const receivedCards = givenList
          .filter(r => r.ownerResponse && r.ownerResponse.text)
          .map(r => mapToCard(r, 'received'));

        // Calcul des stats à partir de mes avis donnés
        const total = givenCards.length;
        const sum = givenCards.reduce((acc, r) => acc + (r.rating || 0), 0);
        const average = total > 0 ? +(sum / total).toFixed(1) : 0;
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        givenCards.forEach(r => {
          const key = Math.round(r.rating || 0);
          if (distribution[key] !== undefined) distribution[key] += 1;
        });

        if (!mounted) return;
        // Avis donnés = mes avis
        setReviewsGiven(givenCards);
        // Avis reçus = réponses à mes avis
        setReviewsReceived(receivedCards);
        setStats({ averageRating: average, totalReviews: total, ratingDistribution: distribution });
      } catch (e) {
        console.error('[TenantReviews] load error', e);
      } finally {
        mounted && setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [currentUser]);

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
      <TenantHeader activeSection="reviews" />

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
              <div className="stat-number">{reviewsReceived.length}</div>
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
                        width: stats.totalReviews ? `${(stats.ratingDistribution[rating] / stats.totalReviews) * 100}%` : '0%'
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
                        <span>{formatDate(review.response.date)}</span>
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