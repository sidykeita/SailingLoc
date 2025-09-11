import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import reservationService from '../../services/reservation.service';
import api from '../../services/api.service';
import HeaderDashboard from '../../components/HeaderDashboard';
import LeaveReviewModal from '../../components/LeaveReviewModal';
import reviewService from '../../services/review.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faCalendarAlt,
  faMapMarkerAlt,
  faEuroSign,
  faEye,
  faCheckCircle,
  faClock,
  faTimesCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import '../../assets/css/SimpleDashboard.css';
import '../../assets/css/TenantLocations.css';

const OwnerReserve = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [flash, setFlash] = useState(null); // { type: 'success'|'error'|'warning', message: string }
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewBoat, setReviewBoat] = useState(null); // { locationId, boatId, name, type, imageUrl, existingReview }

  useEffect(() => {
    // Afficher un message après retour Stripe
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const sessionId = params.get('session_id');
    (async () => {
      try {
        if (status === 'success') {
          if (sessionId) {
            try {
              await api.post(`/stripe/confirm?session_id=${encodeURIComponent(sessionId)}`);
            } catch (_) {
              // même si la confirmation échoue, on affiche succès si Stripe a renvoyé success
            }
          }
          setFlash({ type: 'success', message: 'Paiement réussi. Votre réservation est bien enregistrée.' });
        } else if (status === 'cancel') {
          setFlash({ type: 'warning', message: 'Paiement annulé. Votre réservation n’a pas été payée.' });
        }
      } finally {
        if (status || sessionId) {
          // Nettoyer l’URL
          const url = window.location.pathname;
          window.history.replaceState({}, document.title, url);
        }
      }
    })();

    const load = async () => {
      setLoading(true);
      try {
        // On charge UNIQUEMENT les réservations effectuées par l'utilisateur courant
        const resp = await reservationService.getMyReservations();
        const list = Array.isArray(resp)
          ? resp
          : (Array.isArray(resp?.data) ? resp.data : (Array.isArray(resp?.items) ? resp.items : []));
        console.debug('[OwnerReserve] reservations loaded:', list?.length || 0);
        const mapped = (list || []).map((res) => {
          let boatImage = '';
          if (Array.isArray(res.boat?.photos) && res.boat.photos.length > 0) boatImage = res.boat.photos[0];
          else if (Array.isArray(res.boat?.images) && res.boat.images.length > 0) boatImage = res.boat.images[0];
          else if (res.boat?.imageUrl) boatImage = res.boat.imageUrl;
          else boatImage = 'https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=2070&auto=format&fit=crop';

          return {
            id: res._id || res.id,
            boatId: res.boat?._id || res.boat?.id,
            boatName: res.boat?.name || 'Bateau',
            boatType: res.boat?.type || '',
            port: res.boat?.port || res.boat?.location || '',
            startDate: res.startDate,
            endDate: res.endDate,
            status: res.status,
            price: Number(res.totalPrice || res.price || 0),
            imageUrl: boatImage,
            review: res.review || null,
          };
        });
        setReservations(mapped);
      } catch (e) {
        console.error('Erreur chargement réservations propriétaire', e);
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    let filtered = reservations;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter((r) =>
        r.boatName.toLowerCase().includes(q) || r.port.toLowerCase().includes(q) || r.boatType.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter((r) => {
        const s = new Date(r.startDate); const e = new Date(r.endDate);
        if (dateFilter === 'upcoming') return s > now;
        if (dateFilter === 'current') return s <= now && e >= now;
        if (dateFilter === 'past') return e < now;
        return true;
      });
    }
    setFilteredReservations(filtered);
  }, [reservations, searchTerm, statusFilter, dateFilter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <FontAwesomeIcon icon={faCheckCircle} className="status-icon confirmed" />;
      case 'pending': return <FontAwesomeIcon icon={faClock} className="status-icon pending" />;
      case 'cancelled': return <FontAwesomeIcon icon={faTimesCircle} className="status-icon cancelled" />;
      default: return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Chargement des réservations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header unifié */}
      <HeaderDashboard />

      {/* Main content */}
      <main className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {flash && (
            <div className={`mb-6 p-4 rounded ${flash.type==='success' ? 'bg-green-50 text-green-700 border border-green-200' : flash.type==='warning' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' : 'bg-red-50 text-red-700 border border-red-200' }`}>
              {flash.message}
            </div>
          )}
          <h1 className="font-pacifico text-primary text-3xl mb-6">Mes locations</h1>

          {/* Barre de recherche & filtres */}
          <div className="card p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1 flex gap-4 items-center">
                <div className="search-bar-locations w-full max-w-md">
                  <input
                    type="text"
                    placeholder="Rechercher par nom de bateau, destination..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FontAwesomeIcon icon={faSearch} className="search-icon" />
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="all">Tous</option>
                    <option value="confirmed">Confirmées</option>
                    <option value="pending">En attente</option>
                    <option value="cancelled">Annulées</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
                  <select 
                    value={dateFilter} 
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="all">Toutes</option>
                    <option value="upcoming">À venir</option>
                    <option value="current">En cours</option>
                    <option value="past">Passées</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des réservations (style TenantLocations) */}
          <div className="locations-list">
            {filteredReservations.length === 0 ? (
              <div className="empty-state">
                <FontAwesomeIcon icon={faExclamationTriangle} size="3x" />
                <h3>Aucune réservation trouvée</h3>
                <p>Il n'y a pas de réservation correspondant à vos critères.</p>
              </div>
            ) : (
              filteredReservations.map((r) => (
                <div key={r.id} className="location-card">
                  <div className="location-image">
                    <img src={r.imageUrl} alt={r.boatName} />
                    <div className="status-badge">
                      {getStatusIcon(r.status)}
                      <span>{getStatusText(r.status)}</span>
                    </div>
                  </div>

                  <div className="location-details">
                    <div className="location-header">
                      <h3>{r.boatName}</h3>
                      <span className="boat-type">{r.boatType}</span>
                    </div>
                    <div className="location-info">
                      <div className="info-row">
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                        <span>{r.port || 'Port inconnu'}</span>
                      </div>
                      <div className="info-row">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        <span>{new Date(r.startDate).toLocaleDateString('fr-FR')} - {new Date(r.endDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="info-row">
                        <FontAwesomeIcon icon={faEuroSign} />
                        <span>{Number(r.price || 0).toLocaleString()}€ (total)</span>
                      </div>
                    </div>
                  </div>

                  <div className="location-actions">
                    <Link to={`/boats/${r.boatId || ''}`} className="action-btn primary">
                      <FontAwesomeIcon icon={faEye} />
                      Voir détails
                    </Link>
                    {r.status === 'confirmed' && (
                      <button
                        className="action-btn secondary"
                        onClick={() => {
                          setReviewBoat({
                            locationId: r.id,
                            boatId: r.boatId,
                            name: r.boatName,
                            type: r.boatType,
                            imageUrl: r.imageUrl,
                            existingReview: r.review || null,
                          });
                          setReviewModalOpen(true);
                        }}
                      >
                        Laisser un avis
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Modale d'avis */}
          <LeaveReviewModal
            open={reviewModalOpen}
            onClose={() => { setReviewModalOpen(false); setReviewBoat(null); }}
            boat={reviewBoat}
            userId={currentUser?._id || currentUser?.id}
            onSuccess={(createdReview) => {
              // Marquer localement la réservation comme commentée
              setReservations((prev) => prev.map((res) =>
                res.id === (reviewBoat?._id || reviewBoat?.locationId || res.id)
                  ? { ...res, review: createdReview || { _id: 'temp', rating: 5 } }
                  : res
              ));
            }}
            onSubmit={async (reviewData) => {
              if (!reviewBoat?.locationId) return;
              try {
                const result = await reviewService.createReview({
                  boat: reviewBoat.boatId,
                  reservation: reviewBoat.locationId,
                  rating: reviewData.rating,
                  comment: reviewData.comment
                });
                setReservations((prev) => prev.map((res) =>
                  res.id === (reviewBoat?._id || reviewBoat?.locationId || res.id)
                    ? { ...res, review: result }
                    : res
                ));
                setReviewModalOpen(false);
                setReviewBoat(null);
              } catch (error) {
                alert('Erreur lors de l\'envoi de l\'avis : ' + (error?.message || 'Erreur inconnue'));
              }
            }}
          />

          {/* Bouton retour au tableau de bord */}
          <div className="flex justify-center mt-10">
            <Link to="/owner/dashboard" className="px-6 py-3 rounded bg-gray-500 hover:bg-gray-600 text-white">
              Retour au tableau de bord
            </Link>
          </div>
        </div>
      </main>

      {/* Footer simplifié comme pages owner */}
      <footer className="bg-primary text-white mt-12 py-8">
        <div className="container mx-auto px-4">
          <div className="mt-8 pt-8 border-t border-blue-700 text-center">
            <p>&copy; 2025 SailingLoc. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OwnerReserve;
