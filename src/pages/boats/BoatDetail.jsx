import React, { useState, useEffect } from 'react';
import { API_URL } from '../../lib/api';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import boatService from '../../services/boat.service';
import reviewService from '../../services/review.service';
import blockedDateService from '../../services/blockedDate.service';
import LeaveReviewModal from '../../components/LeaveReviewModal';
import { 
  faAnchor, 
  faWater, 
  faShip, 
  faTachometerAlt, 
  faCalendarAlt, 
  faUsers, 
  faRulerHorizontal,
  faArrowLeft,
  faCheck,
  faLifeRing,
  faWifi,
  faUtensils,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';
// Layout est maintenant géré au niveau des routes dans App.jsx
import { useAuth } from '../../contexts/AuthContext';
import '../../assets/css/BoatDetail.css';
import { payReservation } from '../../services/stripe.service';
// Date range picker
import { DateRange } from 'react-date-range';
import fr from 'date-fns/locale/fr';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

// Importation des images
import logoBlc from '../../assets/images/logo-blc.png';

// Images pour le footer
import facebookIcon from '../../assets/images/picto-facebook.png';
import instaIcon from '../../assets/images/picto-insta.png';
import tiktokIcon from '../../assets/images/picto-tiktok.png';
import mastercardIcon from '../../assets/images/mastercard.png';
import visaIcon from '../../assets/images/visa.png';
import applepayIcon from '../../assets/images/applepay.png';

const BoatDetail = () => {
  // ...
  // Fonction utilitaire pour savoir si une date est réservée
  function isDateReserved(dateStr) {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return reservations.some(r => {
      const rStart = new Date(r.startDate);
      const rEnd = new Date(r.endDate);
      return d >= rStart && d <= rEnd;
    });
  }

  // Fonction utilitaire pour savoir si une date est bloquée
  function isDateBlocked(dateStr) {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return blockedDates.some(b => {
      const bStart = new Date(b.startDate);
      const bEnd = new Date(b.endDate);
      return d >= bStart && d <= bEnd;
    });
  }

  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [boat, setBoat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState([{ startDate: null, endDate: null, key: 'selection' }]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [success, setSuccess] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Ajout logique pour locataire
  const isLocataire = currentUser && (currentUser.role === 'locataire' || currentUser.role === 'tenant');
  const isOwnerUser = currentUser && (currentUser.role === 'owner' || currentUser.role === 'propriétaire');
  const isBoatOwner = isOwnerUser && boat && (
    (boat.owner && (boat.owner._id === currentUser._id || boat.owner === currentUser._id))
  );
  // Autoriser la réservation si: locataire OU propriétaire (n'importe quel bateau), et bateau disponible
  const isBoatAvailable = boat && (boat.status === 'disponible' || boat.status === 'available');
  const canBook = isBoatAvailable && (isLocataire || isOwnerUser);

  // Charger les réservations confirmées et les blocages du bateau
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservationService = (await import('../../services/reservation.service')).default;
        const res = await reservationService.getReservationsByBoat(id);
        // On ne garde que les réservations confirmées
        setReservations((res || []).filter(r => r.status === 'confirmed'));
      } catch (err) {
        // On n'empêche pas l'affichage du bateau si erreur
        setReservations([]);
      }
    };
    const fetchBlockedDates = async () => {
      try {
        // Route publique: visibles pour tous afin d'indiquer les indisponibilités
        const blocks = await blockedDateService.listPublicByBoat(id);
        setBlockedDates(blocks || []);
      } catch (err) {
        // Ne bloque pas l'affichage si erreur
        setBlockedDates([]);
      }
    };
    if (id) {
      fetchReservations();
      fetchBlockedDates();
    }
  }, [id]);

  // Utilitaires calendrier
  const enumerateDates = (start, end) => {
    const list = [];
    if (!start || !end) return list;
    const cur = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    while (cur <= last) {
      list.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return list;
  };
  // Dates désactivées : réservations + blocages
  const disabledDates = [
    ...reservations.flatMap(r => enumerateDates(new Date(r.startDate), new Date(r.endDate))),
    ...blockedDates.flatMap(b => enumerateDates(new Date(b.startDate), new Date(b.endDate)))
  ];

  // Fonction pour désactiver un jour (utilisée par react-date-range)
  const isDayDisabled = (date) => {
    if (!date) return false;
    const d0 = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const match = disabledDates.some(d => {
      const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      return dd === d0;
    });
    return match;
  };

  const selectionContainsDisabled = (sel) => {
    const s = sel?.startDate ? new Date(sel.startDate) : null;
    const e = sel?.endDate ? new Date(sel.endDate) : null;
    if (!s || !e) return false;
    const days = enumerateDates(s, e);
    return days.some(isDayDisabled);
  };

  // Helpers visuels
  const isDayBlocked = (date) => {
    if (!date) return false;
    const d0 = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    return blockedDates.some(b => {
      const s = new Date(b.startDate); const e = new Date(b.endDate);
      const ds = new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime();
      const de = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime();
      return ds <= d0 && d0 <= de;
    });
  };
  const isDayReserved = (date) => {
    if (!date) return false;
    const d0 = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    return reservations.some(r => {
      const s = new Date(r.startDate); const e = new Date(r.endDate);
      const ds = new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime();
      const de = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime();
      return ds <= d0 && d0 <= de;
    });
  };

  const handleRangeChange = (item) => {
    const next = item.selection;
    if (selectionContainsDisabled(next)) {
      setError("Plage indisponible: dates réservées ou bloquées.");
      // Ne pas mettre à jour la sélection
      return;
    }
    setError('');
    setDateRange([next]);
  };

  const renderStars = (rating) => {
    const r = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    return (
      <span className="text-yellow-500" style={{ letterSpacing: 2 }}>
        {'★'.repeat(r)}{'☆'.repeat(5 - r)}
      </span>
    );
  };

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

  useEffect(() => {
    const fetchBoat = async () => {
      setLoading(true);
      try {
        console.log('ID demandé:', id); // DEBUG
        const res = await boatService.getBoatById(id);
        console.log('Réponse API:', res); // DEBUG
        setBoat(res);
      } catch (err) {
        console.error('Erreur API:', err); // DEBUG
        setError("Erreur lors du chargement du bateau");
      } finally {
        setLoading(false);
      }
    };
    fetchBoat();
  }, [id]);

  // Charger les avis du bateau
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      setReviewsLoading(true);
      try {
        const resp = await reviewService.getReviewsByBoat(id).catch((e) => {
          console.error('[BoatDetail] getReviewsByBoat error', e);
          return [];
        });
        console.log('[BoatDetail] getReviewsByBoat raw resp:', resp);
        // Normalisation des différentes formes possibles
        const pickArray = (obj) => {
          if (!obj) return [];
          if (Array.isArray(obj)) return obj;
          if (Array.isArray(obj.data)) return obj.data;
          if (Array.isArray(obj.reviews)) return obj.reviews;
          if (obj.data && Array.isArray(obj.data.reviews)) return obj.data.reviews;
          if (Array.isArray(obj.items)) return obj.items;
          if (obj.data && Array.isArray(obj.data.items)) return obj.data.items;
          if (obj.results && Array.isArray(obj.results)) return obj.results;
          return [];
        };
        const list = pickArray(resp);
        console.log('[BoatDetail] normalized reviews list length:', list.length);
        setReviews(list);
      } catch (e) {
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!boat) return <div>Bateau introuvable</div>;

  const handleReservation = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const sel = dateRange[0] || {};
    const startDate = sel.startDate ? new Date(sel.startDate) : null;
    const endDate = sel.endDate ? new Date(sel.endDate) : null;
    if (!startDate || !endDate) {
      setError("Veuillez sélectionner une date de début et de fin.");
      return;
    }
    // Vérifier la disponibilité (réservations + blocages)
    const s = new Date(startDate);
    const eD = new Date(endDate);
    const isOverlap = reservations.some(r => {
      const rStart = new Date(r.startDate);
      const rEnd = new Date(r.endDate);
      // Chevauchement strict (adjacent autorisé): s < rEnd && eD > rStart
      return (s < rEnd && eD > rStart);
    });
    if (isOverlap) {
      setError("Ce bateau est déjà réservé sur cette période. Veuillez choisir d'autres dates.");
      return;
    }
    // Vérifier les blocages du propriétaire
    const isBlocked = blockedDates.some(b => {
      const bStart = new Date(b.startDate);
      const bEnd = new Date(b.endDate);
      // Logique stricte identique (adjacent autorisé)
      return (s < bEnd && eD > bStart);
    });
    if (isBlocked) {
      setError("Ces dates sont bloquées par le propriétaire. Veuillez choisir d'autres dates.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
        },
        body: JSON.stringify({
          boatId: boat._id,
          userId: currentUser._id,
          startDate: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).toISOString().slice(0,10),
          endDate: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).toISOString().slice(0,10),
          price: boat.dailyPrice * Math.max(1, Math.floor((eD - s) / (1000 * 60 * 60 * 24)))
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors de la réservation.");
      }
      const created = await res.json();
      // Rediriger vers Stripe Checkout pour paiement (même flow pour propriétaires et locataires)
      await payReservation(created._id);
    } catch (err) {
      setError(err.message || "Erreur lors de la réservation.");
    }
  };

  return (
    <div className="boat-detail-page boat-detail-container">
      <div className="container mx-auto px-4 py-8 content-container">
        {/* Bouton retour */}
        <div className="mb-6">
          <Link to="/boats/motor" className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} /> Retour à la liste des bateaux
          </Link>
        </div>

        {/* En-tête avec nom, prix et badge Skipper obligatoire */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
          <div>
            <h1 className="boat-title flex items-center gap-3">
              {boat.name}
              {boat.skipper && (
                <span className="inline-block px-4 py-2 rounded-full bg-orange-400 text-white font-semibold text-base shadow-md animate-pulse align-middle">
                  <FontAwesomeIcon icon={faAnchor} className="mr-2" />
                  Skipper obligatoire
                </span>
              )}
            </h1>
          </div>
          <div className="price-tag">
            <span className="text-2xl font-bold">{boat.dailyPrice}€</span>
            <span className="text-gray-600"> / jour</span>
          </div>
        </div>

        {/* Galerie d'images */}
        <div className="boat-gallery">
          {boat.photos && boat.photos.length > 0 ? (
            <img src={Array.isArray(boat.photos) && boat.photos.length > 0 ? boat.photos[0] : 'https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=2070&auto=format&fit=crop'} alt={boat.name} className="boat-main-image" />
          ) : (
            <div className="boat-main-image-placeholder">Aucune image</div>
          )}
        </div>

        {/* Caractéristiques principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="feature-card">
            <FontAwesomeIcon icon={faTachometerAlt} className="feature-icon" />
            <span className="feature-label">Type</span>
            <span className="feature-value">{boat.type || '-'}</span>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faUsers} className="feature-icon" />
            <span className="feature-label">Capacité</span>
            <span className="feature-value">{boat.capacity}</span>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faRulerHorizontal} className="feature-icon" />
            <span className="feature-label">Longueur</span>
            <span className="feature-value">{boat.length}</span>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faAnchor} className="feature-icon" />
            <span className="feature-label">Emplacement</span>
            <span className="feature-value">{boat.port}</span>
          </div>
        </div>

        {/* Description et formulaire de réservation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h2 className="section-title">Description</h2>
            <p className="text-gray-600 mb-6">{boat.description}</p>

            <h2 className="section-title">Équipements</h2>
            <div className="features-list">
              {boat.features && boat.features.length > 0 ? (
                boat.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <FontAwesomeIcon icon={faCheck} className="feature-check" />
                    <span>{feature}</span>
                  </div>
                ))
              ) : (
                <span>Aucun équipement renseigné</span>
              )}
            </div>

            <h2 className="section-title">Caractéristiques techniques</h2>
            <div className="tech-specs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="tech-spec-item">
                  <span className="tech-spec-label">Année</span>
                  <span className="tech-spec-value">{boat.technicalSpecs?.year}</span>
                </div>
                <div className="tech-spec-item">
                  <span className="tech-spec-label">Moteur</span>
                  <span className="tech-spec-value">{boat.technicalSpecs?.engine}</span>
                </div>
                <div className="tech-spec-item">
                  <span className="tech-spec-label">Capacité carburant</span>
                  <span className="tech-spec-value">{boat.technicalSpecs?.fuelCapacity}</span>
                </div>
                <div className="tech-spec-item">
                  <span className="tech-spec-label">Vitesse max</span>
                  <span className="tech-spec-value">{boat.technicalSpecs?.maxSpeed}</span>
                </div>
                <div className="tech-spec-item">
                  <span className="tech-spec-label">Poids</span>
                  <span className="tech-spec-value">{boat.technicalSpecs?.weight}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de réservation */}
          <div className="booking-form">
            <h2 className="section-title">Réserver ce bateau</h2>
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleReservation}>
              <div className="mb-6">
                <label className="form-label">Sélectionnez vos dates</label>
                <button
                  type="button"
                  className="form-input flex justify-between items-center"
                  onClick={() => setShowCalendar(v => !v)}
                  disabled={!canBook}
                >
                  <span>
                    {(() => {
                      const sel = dateRange[0] || {};
                      const sd = sel.startDate ? new Date(sel.startDate) : null;
                      const ed = sel.endDate ? new Date(sel.endDate) : null;
                      if (sd && ed) return `Du ${sd.toLocaleDateString('fr-FR')} au ${ed.toLocaleDateString('fr-FR')}`;
                      if (sd) return `À partir du ${sd.toLocaleDateString('fr-FR')}`;
                      return 'Choisissez vos dates';
                    })()}
                  </span>
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </button>
                {showCalendar && (
                  <div className="mt-2">
                    <DateRange
                      onChange={handleRangeChange}
                      moveRangeOnFirstSelection={false}
                      ranges={dateRange}
                      months={1}
                      direction="horizontal"
                      locale={fr}
                      minDate={new Date()}
                      rangeColors={["#274991"]}
                      disabledDates={disabledDates}
                    />
                  </div>
                )}
                {disabledDates?.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">Les dates grisées / barrées sont indisponibles.</p>
                )}
                {selectionContainsDisabled((dateRange && dateRange[0]) || {}) && (
                  <p className="text-sm text-red-600 mt-1">Votre sélection inclut des jours indisponibles (réservés ou bloqués).</p>
                )}
              </div>
              <div className="mb-6">
                <div className="flex justify-between text-gray-700 mb-2">
                  <span>Prix par jour:</span>
                  <span className="font-bold">{boat.dailyPrice}€</span>
                </div>
                {(() => { const sel = dateRange[0] || {}; return sel.startDate && sel.endDate; })() && (
                  <div className="flex justify-between text-gray-700 mb-2">
                    <span>Durée:</span>
                    <span className="font-bold">
                      {(() => { const sel = dateRange[0] || {}; const sd = new Date(sel.startDate); const ed = new Date(sel.endDate); return Math.max(1, Math.floor((ed - sd) / (1000 * 60 * 60 * 24))); })()} jours
                    </span>
                  </div>
                )}
                {(() => { const sel = dateRange[0] || {}; return sel.startDate && sel.endDate; })() && (
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{(() => { const sel = dateRange[0] || {}; const sd = new Date(sel.startDate); const ed = new Date(sel.endDate); return boat.dailyPrice * Math.max(1, Math.floor((ed - sd) / (1000 * 60 * 60 * 24))); })()}€</span>
                  </div>
                )}
              </div>
              <button
                type="submit"
                className={`booking-button ${
                  canBook
                    ? 'booking-button-available'
                    : 'booking-button-unavailable'
                }`}
                disabled={!canBook || selectionContainsDisabled((dateRange && dateRange[0]) || {})}
              >
                {canBook ? 'Réserver maintenant' : 'Non disponible'}
              </button>
              {boat.status !== 'disponible' && (
                <p className="text-red-500 text-center mt-2">Ce bateau n'est pas disponible actuellement</p>
              )}
              {!currentUser && boat.available && (
                <div className="mt-4 text-center">
                  <Link to="/login" className="text-blue-600 hover:text-blue-800">
                    Connectez-vous pour réserver
                  </Link>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Avis des clients */}
        <div className="why-choose" style={{ marginTop: 24 }}>
          <h2 className="why-choose-title">Avis des clients</h2>
          <div className="flex items-center justify-between mb-4">
            <div>
              {(() => {
                const count = reviews.length;
                const avgNum = count ? (reviews.reduce((a, r) => a + (Number(r.rating) || 0), 0) / count) : 0;
                const avg = avgNum.toFixed(1);
                return (
                  <div className="flex items-center gap-3 text-gray-700">
                    {renderStars(Math.round(avgNum))}
                    <span>
                      <strong>{avg}</strong> ({count} avis)
                    </span>
                  </div>
                );
              })()}
            </div>
            <div>
              {(() => {
                const myPastConfirmed = reservations.find(r => (
                  (r.user?._id || r.user) === (currentUser?._id) &&
                  r.status === 'confirmed' &&
                  new Date(r.endDate) < new Date()
                ));
                const alreadyLeft = myPastConfirmed && reviews.some(rv => (
                  (rv.user?._id || rv.user) === (currentUser?._id) &&
                  (rv.reservation?._id || rv.reservation) === (myPastConfirmed?._id)
                ));
                const canLeave = Boolean(currentUser && myPastConfirmed && !alreadyLeft);
                return (
                  <button
                    className="booking-button booking-button-available"
                    onClick={() => setIsReviewModalOpen(true)}
                    disabled={!canLeave}
                    title={canLeave ? 'Laisser un avis' : (alreadyLeft ? 'Avis déjà laissé pour cette réservation' : 'Une réservation passée est requise pour laisser un avis')}
                  >
                    Laisser un avis
                  </button>
                );
              })()}
            </div>
          </div>

          {reviewsLoading ? (
            <div>Chargement des avis...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div style={{ fontSize: 32 }}>💬</div>
              <div>Aucun avis pour le moment</div>
              <div className="text-sm">Soyez le premier à laisser un avis !</div>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r._id || r.id} className="p-4 rounded-lg border border-gray-200 bg-white">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium">
                      {(r.user && (r.user.firstName || r.user.lastName))
                        ? `${r.user.firstName || ''} ${r.user.lastName || ''}`.trim()
                        : 'Utilisateur'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(r.createdAt || r.date || Date.now()).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <div>{renderStars(Number(r.rating) || 0)}</div>
                  <div className="mt-2 text-gray-700">{r.comment || r.text}</div>
                  {r.ownerResponse && (r.ownerResponse.text || r.ownerResponse.comment) && (
                    <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded">
                      <div className="text-sm text-gray-600 mb-1">
                        Réponse du propriétaire • {new Date(r.ownerResponse.createdAt || r.ownerResponse.date || Date.now()).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-gray-700">{r.ownerResponse.text || r.ownerResponse.comment}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modale Laisser un avis */}
        {isReviewModalOpen && (
          <LeaveReviewModal
            open={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            boat={{
              boatId: boat?._id,
              id: boat?._id,
              name: boat?.name,
              type: boat?.type,
              locationId: (reservations.find(r => (r.user?._id || r.user) === (currentUser?._id))?._id) || undefined,
              reservationId: (reservations.find(r => (r.user?._id || r.user) === (currentUser?._id))?._id) || undefined,
            }}
            userId={currentUser?._id}
            onSubmit={() => {}}
            onSuccess={async () => {
              // rafraîchir la liste
              try {
                const resp = await reviewService.getReviewsByBoat(id).catch(() => []);
                const pickArray = (obj) => {
                  if (!obj) return [];
                  if (Array.isArray(obj)) return obj;
                  if (Array.isArray(obj.data)) return obj.data;
                  if (Array.isArray(obj.reviews)) return obj.reviews;
                  if (obj.data && Array.isArray(obj.data.reviews)) return obj.data.reviews;
                  if (Array.isArray(obj.items)) return obj.items;
                  if (obj.data && Array.isArray(obj.data.items)) return obj.data.items;
                  if (obj.results && Array.isArray(obj.results)) return obj.results;
                  return [];
                };
                const list = pickArray(resp);
                setReviews(list);
              } catch (_) {}
              setIsReviewModalOpen(false);
            }}
          />
        )}

        {/* Informations supplémentaires (optionnel, mock) */}
        <div className="why-choose">
          <h2 className="why-choose-title">Pourquoi choisir ce bateau ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="benefit-card">
              <FontAwesomeIcon icon={faLifeRing} className="benefit-icon" />
              <h3 className="benefit-title">Sécurité garantie</h3>
              <p className="benefit-text">Équipement de sécurité complet et bateau régulièrement entretenu pour votre tranquillité.</p>
            </div>
            <div className="benefit-card">
              <FontAwesomeIcon icon={faWifi} className="benefit-icon" />
              <h3 className="benefit-title">Confort moderne</h3>
              <p className="benefit-text">Profitez d'équipements modernes pour une expérience de navigation agréable.</p>
            </div>
            <div className="benefit-card">
              <FontAwesomeIcon icon={faUtensils} className="benefit-icon" />
              <h3 className="benefit-title">Tout équipé</h3>
              <p className="benefit-text">Tout ce dont vous avez besoin est à bord pour profiter pleinement de votre journée en mer.</p>
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
  );
};

export default BoatDetail;
