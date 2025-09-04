import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faMapMarkerAlt, faCalendarAlt, faChevronRight, faHeart, faTimes } from '@fortawesome/free-solid-svg-icons';
import portService from '../../services/port.service';
import Layout from '../../Layout';
import '../../assets/css/Home.css';

// Import des images
import backgroundImage from '../../assets/images/accueil.jpeg';
import voilierImg from '../../assets/images/voilier.jpg';
import moteurImg from '../../assets/images/moteur.jpg';
import moteur1Img from '../../assets/images/moteur1.jpeg';
import moteur2Img from '../../assets/images/moteur2.jpeg';
import moteur3Img from '../../assets/images/moteur3.jpeg';
import moteur4Img from '../../assets/images/moteur4.jpeg';
import moteur5Img from '../../assets/images/moteur5.jpeg';
import moteur6Img from '../../assets/images/moteur6.jpeg';
import marseilleImage from '../../assets/images/destinations/marseille.jpeg';
import portoCristoImage from '../../assets/images/destinations/porto-cristo.jpeg';
import bastiaImage from '../../assets/images/destinations/bastia.jpeg';

// Images de profil
import profileImg1 from '../../assets/images/jean.jpg';
import profileImg2 from '../../assets/images/fanny.jpg';
import profileImg3 from '../../assets/images/mathieu.jpg';
import boatService from '../../services/boat.service';

// Date range picker
import { DateRange } from 'react-date-range';
import fr from 'date-fns/locale/fr';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const Home = () => {
  const [selectedBoatType, setSelectedBoatType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedPort, setSelectedPort] = useState(null);
  const [selectedDate, setSelectedDate] = useState(''); // legacy support (non utilisé avec le calendrier)
  const [selectedEndDate, setSelectedEndDate] = useState(''); // legacy support
  const [dateRange, setDateRange] = useState([{ startDate: null, endDate: null, key: 'selection' }]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [expandedTestimonials, setExpandedTestimonials] = useState([false, false, false]);
  const [boatsDynamiques, setBoatsDynamiques] = useState([]);
  const [boatsLoading, setBoatsLoading] = useState(true);
  const [boatsError, setBoatsError] = useState('');
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const todayStr = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    setBoatsLoading(true);
    boatService.getAllBoats()
      .then(data => setBoatsDynamiques(data))
      .catch(() => setBoatsError('Erreur lors du chargement des bateaux'))
      .finally(() => setBoatsLoading(false));
  }, []);

  const scrollToContent = () => {
    const contentSection = document.querySelector('.community-favorites');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const results = portService.searchPorts(searchQuery);
      setSearchResults(results);
      setShowResults(results.length > 0);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectPort = (port) => {
    setSelectedPort(port);
    setSearchQuery(port.name);
    setShowResults(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedPort(null);
    setSearchResults([]);
    setShowResults(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowResults(false);
    const r = dateRange[0] || {};
    const toIso = (d) => (d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0, 10) : '');
    const startNorm = r.startDate ? toIso(r.startDate) : (selectedDate || (selectedEndDate ? selectedEndDate : ''));
    const endNorm = r.endDate ? toIso(r.endDate) : selectedEndDate;
    if (selectedPort) {
      const params = new URLSearchParams();
      params.set('location', selectedPort.name);
      if (startNorm) params.set('start', startNorm);
      if (endNorm) params.set('end', endNorm);
      navigate(`/boats?${params.toString()}`);
    } else if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('query', searchQuery.trim());
      if (startNorm) params.set('start', startNorm);
      if (endNorm) params.set('end', endNorm);
      navigate(`/boats?${params.toString()}`);
    }
  };

  useEffect(() => {
    const { startDate, endDate } = dateRange[0] || {};
    if (startDate && endDate) setShowCalendar(false);
  }, [dateRange]);

  const toggleTestimonial = (index, e) => {
    e.preventDefault();
    const newExpandedState = [...expandedTestimonials];
    newExpandedState[index] = !newExpandedState[index];
    setExpandedTestimonials(newExpandedState);
  };

  console.log('Composant Home rendu');

  const countByCity = (name) => {
    const q = String(name || '').toLowerCase();
    if (!q) return 0;
    return boatsDynamiques.filter((boat) => {
      const fields = [boat?.location, boat?.city, boat?.port, boat?.destination]
        .filter(Boolean)
        .map((v) => String(v).toLowerCase());
      return fields.some((v) => v.includes(q));
    }).length;
  };

  const activeCityQuery = (selectedPort?.name || searchQuery || '').trim().toLowerCase();
  const displayedBoats = activeCityQuery
    ? boatsDynamiques.filter((boat) => {
        const candidates = [
          boat?.location,
          boat?.city,
          boat?.port,
          boat?.destination,
        ]
          .filter(Boolean)
          .map((v) => String(v).toLowerCase());
        return candidates.some((v) => v.includes(activeCityQuery));
      })
    : boatsDynamiques;

  return (
    <Layout>
      <div className="home-page">
        <div className="hero-section" style={{ backgroundImage: `url(${backgroundImage})` }}>
          <div className="hero-content">
            <div className="search-container">
              <h1>Louez votre bateau en un clic !</h1>
              <p>Comparez les offres pour votre bateau en un clic et réservez en ligne des voiliers et bateaux à moteur</p>

              <div className="search-box">
                <div className="search-input-group location-group" ref={searchRef}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Où souhaitez-vous louer un bateau ?" 
                    className="search-input" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (searchResults.length > 0) {
                        setShowResults(true);
                      }
                    }}
                  />
                  {searchQuery && (
                    <button 
                      type="button" 
                      className="clear-search-btn" 
                      onClick={clearSearch}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  )}

                  {showResults && searchResults.length > 0 && (
                    <div className="search-results">
                      {searchResults.map((port) => (
                        <div 
                          key={port.id} 
                          className="search-result-item"
                          onClick={() => handleSelectPort(port)}
                        >
                          {port.name} - {port.country}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="search-input-group date-group" style={{ position: 'relative' }}>
                  <FontAwesomeIcon icon={faCalendarAlt} className="search-icon" />
                  <button
                    type="button"
                    className="search-input date-trigger"
                    onClick={() => setShowCalendar((v) => !v)}
                    aria-label="Choisir une période"
                    style={{
                      textAlign: 'left',
                      paddingLeft: 40,
                      paddingRight: 36,
                      backgroundColor: '#fff',
                      color: (() => {
                        const { startDate, endDate } = dateRange[0] || {};
                        return startDate || endDate ? undefined : '#888';
                      })(),
                    }}
                  >
                    {(() => {
                      const { startDate, endDate } = dateRange[0] || {};
                      if (startDate && endDate) return `Du ${new Date(startDate).toLocaleDateString('fr-FR')} au ${new Date(endDate).toLocaleDateString('fr-FR')}`;
                      if (startDate) return `À partir du ${new Date(startDate).toLocaleDateString('fr-FR')}`;
                      return 'Choisissez vos dates';
                    })()}
                  </button>
                  {(() => {
                    const { startDate, endDate } = dateRange[0] || {};
                    return (startDate || endDate) ? (
                      <button
                        type="button"
                        className="clear-search-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDateRange([{ startDate: null, endDate: null, key: 'selection' }]);
                        }}
                        aria-label="Effacer les dates"
                        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    ) : null;
                  })()}
                  {showCalendar && (
                    <div style={{ position: 'absolute', top: '110%', left: 0, zIndex: 1000, transform: 'scale(0.9)', transformOrigin: 'top left' }}>
                      <style>{`
                        /* Masque la zone de plages prédéfinies et tout bouton associé */
                        .rdrDefinedRangesWrapper { display: none !important; }
                        .rdrStaticRange { display: none !important; }
                        .rdrInputRanges { display: none !important; }
                      `}</style>
                      <DateRange
                        onChange={(item) => setDateRange([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={dateRange}
                        months={1}
                        direction="horizontal"
                        locale={fr}
                        minDate={new Date(todayStr)}
                        rangeColors={["#274991"]}
                      />
                    </div>
                  )}
                </div>

                <button 
                  className="search-button" 
                  onClick={handleSearch}
                >
                  <FontAwesomeIcon icon={faSearch} className="search-button-icon" />
                  Rechercher
                </button>
              </div>

              <div className="boat-type-selector">
                <Link 
                  to="/boats/sailing"
                  className={`boat-type-btn ${selectedBoatType === 'voilier' ? 'active' : ''}`}
                  onClick={() => setSelectedBoatType('voilier')}
                >
                  <img src={voilierImg} alt="Voilier" className="boat-type-icon" />
                  <span>Voilier</span>
                </Link>
                <Link 
                  to="/boats/motor"
                  className={`boat-type-btn ${selectedBoatType === 'moteur' ? 'active' : ''}`}
                  onClick={() => setSelectedBoatType('moteur')}
                >
                  <img src={moteurImg} alt="Bateau à moteur" className="boat-type-icon" />
                  <span>Bateau à moteur</span>
                </Link>

              </div>
            </div>
          </div>
        </div>

        <section className="community-favorites">
          <div className="section-container">
            <h2 className="section-title">Les coups de coeur de la communauté</h2>
            <div className="boat-cards">
              {boatsLoading ? (
                <div className="boat-card loading">Chargement des bateaux...</div>
              ) : boatsError ? (
                <div className="boat-card error">{boatsError}</div>
              ) : displayedBoats.length === 0 ? (
                <div className="boat-card empty">{activeCityQuery ? `Aucun bateau disponible pour \"${activeCityQuery}\"` : 'Aucun bateau à afficher'}</div>
              ) : (
                Array.isArray(displayedBoats) && displayedBoats.slice(0, 3).map((boat) => (
                  <Link to={`/boats/${boat._id}`} className="boat-card-link" key={boat._id}>
                    <div className="boat-card">
                      <div className="boat-card-header">
                        <img src={Array.isArray(boat.photos) ? boat.photos[0] : boat.photos} alt={boat.name} className="boat-image" />
                        <button className="favorite-btn" onClick={e => e.preventDefault()}><FontAwesomeIcon icon={faHeart} /></button>
                      </div>
                      <div className="boat-info">
                        <div className="boat-header">
                          <h3>{boat.location || boat.port || 'Port inconnu'}</h3>
                          {/* Note : rating mocké, à remplacer si besoin plus tard */}
                          <div className="boat-rating">★★★★★</div>
                        </div>
                        <p className="boat-description">{boat.name} • {boat.length || '?'}m • {boat.capacity || '?'} pers{boat.type ? ` • ${boat.type}` : ''}</p>
                        <p className="boat-owner">Proposé par <span>{boat.owner && (boat.owner.firstName || boat.owner.lastName) ? `${boat.owner.firstName || ''} ${boat.owner.lastName || ''}`.trim() : 'Propriétaire'}</span></p>
                        <div className="boat-price">
                          <span className="price-label">à partir de</span>
                          <div className="price-value">{boat.dailyPrice || boat.price || '?'} € / jour</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="destinations">
          <div className="section-container">
            <h2 className="section-title">Choisissez votre destination<br />en France et en Europe</h2>
            <div className="destination-cards">
              <Link to="/destinations/marseille" className="destination-card-link">
                <div className="destination-card">
                  <img src={marseilleImage} alt="Marseille" className="destination-image" />
                  <div className="destination-name">Marseille</div>
                  <div className="destination-overlay">
                    <h3>Marseille</h3>
                    <p>{countByCity('Marseille')} bateaux disponibles</p>
                    <span className="destination-link">Explorer</span>
                  </div>
                </div>
              </Link>

              <Link to="/destinations/porto-cristo" className="destination-card-link">
                <div className="destination-card">
                  <img src={portoCristoImage} alt="Porto Cristo" className="destination-image" />
                  <div className="destination-name">Porto Cristo</div>
                  <div className="destination-overlay">
                    <h3>Porto Cristo</h3>
                    <p>{countByCity('Porto Cristo')} bateaux disponibles</p>
                    <span className="destination-link">Explorer</span>
                  </div>
                </div>
              </Link>

              <Link to="/destinations/bastia" className="destination-card-link">
                <div className="destination-card">
                  <img src={bastiaImage} alt="Bastia" className="destination-image" />
                  <div className="destination-name">Bastia</div>
                  <div className="destination-overlay">
                    <h3>Bastia</h3>
                    <p>{countByCity('Bastia')} bateaux disponibles</p>
                    <span className="destination-link">Explorer</span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="view-all-destinations">
              <Link to="/destinations" className="view-all-destinations-button">Découvrez nos autres destinations</Link>
            </div>
          </div>
        </section>

        <section className="testimonials">
          <div className="section-container">
            <h2 className="section-title">Nos utilisateurs vous partagent<br />leur expérience inoubliable</h2>
            <div className="testimonial-cards">
              <div className="testimonial-card">
                <div className="testimonial-header">
                  <img src={profileImg1} alt="Jean" className="profile-image" />
                  <div className="profile-info">
                    <h3>Jean</h3>
                    <p>Paris<br />Location voilier Beneteau Oceanis 45 à Marseille</p>
                  </div>
                </div>
                <div className="testimonial-content">
                  <p>
                    Excellente expérience avec ce voilier ! Le propriétaire était très accueillant et nous a donné de bons conseils pour notre itinéraire. Le bateau était impeccable et très confortable. Je recommande vivement !
                    {expandedTestimonials[0] && (
                      <span className="extended-content">
                        <br /><br />
                        Nous avons navigué pendant une semaine le long de la côte méditerranéenne et c'était magique. Le voilier est parfaitement équipé avec tout le nécessaire pour cuisiner et se détendre. La navigation était fluide et le bateau très stable même avec un peu de vent. Le propriétaire nous a même suggéré quelques criques secrètes où nous avons pu jeter l'ancre loin de la foule. Une expérience à refaire sans hésiter !
                      </span>
                    )}
                  </p>
                  <a href="#" className="read-more" onClick={(e) => toggleTestimonial(0, e)}>
                    {expandedTestimonials[0] ? 'Voir moins' : 'Lire la suite'}
                  </a>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="testimonial-header">
                  <img src={profileImg2} alt="Fanny" className="profile-image" />
                  <div className="profile-info">
                    <h3>Fanny</h3>
                    <p>Marseille<br />Location bateau Bayliner E42 Cuddy à Cavalaire-sur-Mer</p>
                  </div>
                </div>
                <div className="testimonial-content">
                  <p>
                    Nous avons loués le bateau tout une journée avec 5 de mes amis et c'était super ! Très bon accueil, pas eu besoin de nous occuper du moteur, tout était top ! Merci encore nous reviendrons !
                    {expandedTestimonials[1] && (
                      <span className="extended-content">
                        <br /><br />
                        Le propriétaire nous a fait une présentation complète du bateau avant de partir et nous a même montré les meilleurs spots pour se baigner. Le bateau était très spacieux et confortable, parfait pour notre groupe. Nous avons pu profiter du soleil sur le pont et même faire du snorkeling dans des eaux cristallines. La journée s'est terminée par un magnifique coucher de soleil en mer. Une expérience à vivre absolument !
                      </span>
                    )}
                  </p>
                  <a href="#" className="read-more" onClick={(e) => toggleTestimonial(1, e)}>
                    {expandedTestimonials[1] ? 'Voir moins' : 'Lire la suite'}
                  </a>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="testimonial-header">
                  <img src={profileImg3} alt="Mathieu" className="profile-image" />
                  <div className="profile-info">
                    <h3>Mathieu</h3>
                    <p>Lille<br />Location voilier Jeanneau Dufay à La Seyne-sur-Mer</p>
                  </div>
                </div>
                <div className="testimonial-content">
                  <p>
                    Je ne peut que recommander ! Il a pris soin du bateau et est très à l'écoute des informations données par le propriétaire. Le point de vue d'un propriétaire, très rassurant. Je lui laisser mon voilier quand il veut !
                    {expandedTestimonials[2] && (
                      <span className="extended-content">
                        <br /><br />
                        En tant que propriétaire, je suis toujours inquiet quand je loue mon voilier, mais cette expérience m'a complètement rassuré. Le locataire a respecté toutes les consignes et a ramené le bateau dans un état impeccable. La communication était excellente avant, pendant et après la location. C'est un vrai plaisir de rencontrer des passionnés de voile qui respectent le matériel. Je recommande vivement cette plateforme pour la qualité des échanges et la sécurité qu'elle offre.
                      </span>
                    )}
                  </p>
                  <a href="#" className="read-more" onClick={(e) => toggleTestimonial(2, e)}>
                    {expandedTestimonials[2] ? 'Voir moins' : 'Lire la suite'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
