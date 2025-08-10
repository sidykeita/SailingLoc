import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faAnchor, 
  faWater, 
  faShip, 
  faUsers, 
  faChevronUp,
  faArrowLeft,
  faWind,
  faCompass,
  faCalendarAlt,
  faUser,
  faCheck,
  faLifeRing,
  faShieldAlt,
  faMapMarkerAlt,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import '../../assets/css/SailingBoatDetail.css'; // Import du fichier CSS
import '../../assets/css/BoatDetail.css'; // Import pour style identique aux autres annonces

// Importation des nouvelles images des voiliers
import boatService from '../../services/boat.service';

const SailingBoatDetail = () => {
  const { id } = useParams();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const [boat, setBoat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    boatService.getBoatById(id)
      .then((data) => setBoat(data))
      .catch(() => setError("Erreur lors du chargement du bateau"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diff = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
      setNumberOfDays(diff);
      setTotalPrice(boat ? diff * (boat.pricePerDay || 0) : 0);
    } else {
      setNumberOfDays(1);
      setTotalPrice(boat ? boat.pricePerDay || 0 : 0);
    }
  }, [startDate, endDate, boat]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (loading) return <div className="boat-detail-loading">Chargement...</div>;
  if (error) return <div className="boat-detail-error">{error}</div>;
  if (!boat) return <div className="boat-detail-notfound">Bateau non trouvé.</div>;

  return (
    <div className="boat-detail-page boat-detail-container">
      <div className="container mx-auto px-4 py-8 content-container">
        {/* Bouton retour */}
        <div className="mb-6">
          <Link to="/boats/sailing" className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} /> Retour à la liste des bateaux
          </Link>
        </div>

        {/* En-tête avec nom et prix */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="boat-title">{boat.name}</h1>
          <div className="price-tag">
            <span className="text-2xl font-bold">{boat.dailyPrice || boat.pricePerDay}€</span>
            <span className="text-gray-600"> / jour</span>
          </div>
        </div>

        {/* Galerie d'images */}
        <div className="boat-gallery">
          {boat.photos && boat.photos.length > 0 ? (
            <img src={Array.isArray(boat.photos) ? boat.photos[0] : boat.photos} alt={boat.name} className="boat-main-image" />
          ) : (
            <div className="boat-main-image-placeholder">Aucune image</div>
          )}
        </div>

        {/* Caractéristiques principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="feature-card">
            <FontAwesomeIcon icon={faUsers} className="feature-icon" />
            <span className="feature-label">Capacité</span>
            <span className="feature-value">{boat.capacity}</span>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faShip} className="feature-icon" />
            <span className="feature-label">Longueur</span>
            <span className="feature-value">{boat.length}</span>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faAnchor} className="feature-icon" />
            <span className="feature-label">Emplacement</span>
            <span className="feature-value">{boat.port || boat.location || 'Port inconnu'}</span>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faWind} className="feature-icon" />
            <span className="feature-label">Voiles</span>
            <span className="feature-value">{boat.sails || '-'}</span>
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
                  <span className="tech-spec-value">{boat.technicalSpecs?.year || '-'}</span>
                </div>
                <div className="tech-spec-item">
                  <span className="tech-spec-label">Tirant d'eau</span>
                  <span className="tech-spec-value">{boat.technicalSpecs?.draft || '-'}</span>
                </div>
                <div className="tech-spec-item">
                  <span className="tech-spec-label">Surface de voile</span>
                  <span className="tech-spec-value">{boat.sailArea || boat.technicalSpecs?.sailArea || '-'}</span>
                </div>
                <div className="tech-spec-item">
                  <span className="tech-spec-label">Largeur</span>
                  <span className="tech-spec-value">{boat.technicalSpecs?.beam || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de réservation */}
          <div className="booking-form">
            <h2 className="section-title">Réserver ce bateau</h2>
            <div className="mb-4">
              <label className="form-label">Date de début</label>
              <div className="relative">
                <div className="input-icon">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </div>
                <input
                  type="date"
                  className="form-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  disabled={!boat.available}
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="form-label">Date de fin</label>
              <div className="relative">
                <div className="input-icon">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                </div>
                <input
                  type="date"
                  className="form-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split('T')[0]}
                  disabled={!boat.available}
                />
              </div>
            </div>
            <div className="mb-6">
              <div className="flex justify-between text-gray-700 mb-2">
                <span>Prix par jour:</span>
                <span className="font-bold">{boat.dailyPrice || boat.pricePerDay}€</span>
              </div>
              {startDate && endDate && (
                <div className="flex justify-between text-gray-700 mb-2">
                  <span>Durée:</span>
                  <span className="font-bold">{Math.max(1, Math.floor((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)))} jours</span>
                </div>
              )}
              {startDate && endDate && (
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{(boat.dailyPrice || boat.pricePerDay) * Math.max(1, Math.floor((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)))}€</span>
                </div>
              )}
            </div>
            <button
              className={`booking-button ${boat.available ? 'booking-button-available' : 'booking-button-unavailable'}`}
              disabled={!boat.available}
            >
              {boat.available ? 'Réserver maintenant' : 'Non disponible'}
            </button>
            {!boat.available && (
              <p className="text-red-500 text-center mt-2">Ce bateau n'est pas disponible actuellement</p>
            )}
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="why-choose">
          <h2 className="why-choose-title">Pourquoi choisir ce bateau ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="benefit-card">
              <FontAwesomeIcon icon={faLifeRing} className="benefit-icon" />
              <h3 className="benefit-title">Sécurité garantie</h3>
              <p className="benefit-text">Équipement de sécurité complet et bateau régulièrement entretenu pour votre tranquillité.</p>
            </div>
            <div className="benefit-card">
              <FontAwesomeIcon icon={faCompass} className="benefit-icon" />
              <h3 className="benefit-title">Navigation précise</h3>
              <p className="benefit-text">Instruments de navigation fiables pour des sorties sereines.</p>
            </div>
            <div className="benefit-card">
              <FontAwesomeIcon icon={faUsers} className="benefit-icon" />
              <h3 className="benefit-title">Confort à bord</h3>
              <p className="benefit-text">Parfait pour groupes et familles, espaces optimisés.</p>
            </div>
          </div>
        </div>

        {/* Statut */}
        <div className="mb-6 mt-8">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 mr-2">{boat.status}</span>
        </div>

        {/* Scroll top */}
        {showScrollTop && (
          <button className="scroll-top-btn" onClick={scrollToTop} aria-label="Retour en haut">
            <FontAwesomeIcon icon={faChevronUp} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SailingBoatDetail;
