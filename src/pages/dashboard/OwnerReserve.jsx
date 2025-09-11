import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import boatService from '../../services/boat.service';
import blockedDateService from '../../services/blockedDate.service';
import reservationService from '../../services/reservation.service';
import { API_URL } from '../../lib/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faChevronDown,
  faChevronRight,
  faSignOutAlt,
  faFilter,
  faCalendarAlt,
  faMapMarkerAlt,
  faEuroSign,
  faEye,
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

const OwnerReserve = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [boats, setBoats] = useState([]);
  const [filteredBoats, setFilteredBoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [portFilter, setPortFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Menus
  const [showDiscoverMenu, setShowDiscoverMenu] = useState(false);
  const [showBoatSubmenu, setShowBoatSubmenu] = useState(false);
  const [showDestinationsSubmenu, setShowDestinationsSubmenu] = useState(false);
  const [showModelsSubmenu, setShowModelsSubmenu] = useState(false);
  const [showAboutSubmenu, setShowAboutSubmenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Réservation
  const [selectedBoat, setSelectedBoat] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBoats();
  }, []);

  useEffect(() => {
    filterBoats();
  }, [boats, searchTerm, portFilter, typeFilter]);

  const fetchBoats = async () => {
    setLoading(true);
    try {
      // Récupérer tous les bateaux disponibles (pas seulement les miens)
      const allBoats = await boatService.getAllBoats();
      const availableBoats = (allBoats || [])
        .filter(boat => boat.status === 'disponible' || boat.status === 'available')
        .map(boat => {
          let boatImage = '';
          if (Array.isArray(boat.photos) && boat.photos.length > 0) boatImage = boat.photos[0];
          else if (Array.isArray(boat.images) && boat.images.length > 0) boatImage = boat.images[0];
          else if (boat.imageUrl) boatImage = boat.imageUrl;
          else boatImage = 'https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=2070&auto=format&fit=crop';

          return {
            id: boat._id || boat.id,
            name: boat.name || 'Bateau',
            type: boat.type || '',
            port: boat.port || boat.location || '',
            dailyPrice: Number(boat.dailyPrice) || 0,
            capacity: boat.capacity || 0,
            length: boat.length || 0,
            imageUrl: boatImage,
            owner: boat.owner?.name || '',
            features: boat.features || [],
            description: boat.description || ''
          };
        });
      setBoats(availableBoats);
    } catch (error) {
      console.error('Erreur lors du chargement des bateaux:', error);
      setBoats([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBoats = () => {
    let filtered = boats;

    if (searchTerm) {
      filtered = filtered.filter((boat) =>
        boat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        boat.port.toLowerCase().includes(searchTerm.toLowerCase()) ||
        boat.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (portFilter !== 'all') {
      filtered = filtered.filter((boat) => boat.port === portFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((boat) => boat.type === typeFilter);
    }

    setFilteredBoats(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  };

  const daysBetween = (a, b) => {
    const A = new Date(a), B = new Date(b);
    A.setHours(0,0,0,0); B.setHours(0,0,0,0);
    return Math.max(1, Math.floor((B - A) / (1000*60*60*24)));
  };

  const computedTotal = useMemo(() => {
    if (!startDate || !endDate || !selectedBoat) return 0;
    const days = daysBetween(startDate, endDate);
    const daily = Number(selectedBoat.dailyPrice) || 0;
    return daily * days;
  }, [startDate, endDate, selectedBoat]);

  const handleReserveBoat = async (boat) => {
    if (!startDate || !endDate) {
      setError('Veuillez sélectionner des dates avant de réserver.');
      return;
    }
    
    setError(''); setSuccess('');
    try {
      setSubmitting(true);
      const res = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
        },
        body: JSON.stringify({
          boatId: boat.id,
          startDate,
          endDate,
          price: computedTotal,
          guestName: guestName || undefined,
          guestEmail: guestEmail || undefined
        })
      });
      if (!res.ok) {
        const data = await res.json().catch(()=>({message:'Erreur'}));
        throw new Error(data.message || 'Erreur lors de la création');
      }
      setSuccess('Réservation propriétaire créée avec succès.');
      setSelectedBoat(null);
      setStartDate(''); 
      setEndDate('');
      setGuestName('');
      setGuestEmail('');
    } catch (err) {
      setError(err.message || 'Erreur inconnue');
    } finally { 
      setSubmitting(false); 
    }
  };

  if (loading) {
    return (
      <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>
        <p>Chargement des bateaux disponibles...</p>
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
                    <div className="dropdown-item" onClick={() => setShowBoatSubmenu(!showBoatSubmenu)}>
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
                    <div className="dropdown-item" onClick={() => setShowDestinationsSubmenu(!showDestinationsSubmenu)}>
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
                    <div className="dropdown-item" onClick={() => setShowModelsSubmenu(!showModelsSubmenu)}>
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
                    <div className="dropdown-item" onClick={() => setShowAboutSubmenu(!showAboutSubmenu)}>
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
                    if (e.target.parentNode) e.target.parentNode.textContent = 'Pr';
                  }}
                />
              </div>
              <span>{currentUser?.email || 'Propriétaire'}</span>
              <FontAwesomeIcon icon={faChevronDown} />
            </div>

            {showUserMenu && (
              <div className="dropdown-menu user-menu">
                <Link to="/owner/dashboard" className="dropdown-item"><span>Tableau de bord</span></Link>
                <Link to="/owner/dashboard/reserver" className="dropdown-item active"><span>Réservation propriétaire</span></Link>
                <Link to="/owner/dashboard/calendrier" className="dropdown-item"><span>Calendrier</span></Link>
                <Link to="/owner/dashboard/reservations" className="dropdown-item"><span>Réservations</span></Link>
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
          <Link to="/owner/dashboard" className="nav-link">Tableau de bord</Link>
          <Link to="/owner/dashboard/reserver" className="nav-link active">Réservation propriétaire</Link>
          <Link to="/owner/dashboard/calendrier" className="nav-link">Calendrier</Link>
          <Link to="/owner/dashboard/reservations" className="nav-link">Réservations</Link>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="dashboard-container" style={{ backgroundColor: 'white', minHeight: '100vh' }}>
        <div className="locations-page">
          <div className="page-header">
            <h1>Réservation propriétaire</h1>
            <p>Réservez n'importe quel bateau disponible pour vos clients</p>
          </div>

          {/* Formulaire de réservation */}
          {selectedBoat && (
            <div className="reservation-form-modal" style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ 
                backgroundColor: 'white', 
                padding: '2rem', 
                borderRadius: '8px', 
                maxWidth: '500px', 
                width: '90%',
                maxHeight: '80vh',
                overflowY: 'auto'
              }}>
                <h3 style={{ marginBottom: '1rem' }}>Réserver {selectedBoat.name}</h3>
                
                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Du</label>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={e => setStartDate(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Au</label>
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={e => setEndDate(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nom du client (optionnel)</label>
                  <input 
                    type="text" 
                    value={guestName} 
                    onChange={e => setGuestName(e.target.value)}
                    placeholder="Ex: Jean Dupont"
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email du client (optionnel)</label>
                  <input 
                    type="email" 
                    value={guestEmail} 
                    onChange={e => setGuestEmail(e.target.value)}
                    placeholder="Ex: jean@example.com"
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>

                {startDate && endDate && (
                  <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <strong>Total: {computedTotal.toLocaleString()}€</strong>
                    <br />
                    <small>Durée: {daysBetween(startDate, endDate)} jours</small>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={() => handleReserveBoat(selectedBoat)}
                    disabled={submitting || !startDate || !endDate}
                    style={{ 
                      flex: 1, 
                      padding: '0.75rem', 
                      backgroundColor: '#007bff', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: submitting || !startDate || !endDate ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {submitting ? 'Création...' : 'Réserver'}
                  </button>
                  <button 
                    onClick={() => setSelectedBoat(null)}
                    style={{ 
                      flex: 1, 
                      padding: '0.75rem', 
                      backgroundColor: '#6c757d', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}

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

            <button className="filters-toggle" onClick={() => setShowFilters(!showFilters)}>
              <FontAwesomeIcon icon={faFilter} />
              Filtres
            </button>
          </div>

          {/* Panneau filtres */}
          {showFilters && (
            <div className="filters-panel">
              <div className="filter-group">
                <label>Port</label>
                <select value={portFilter} onChange={(e) => setPortFilter(e.target.value)}>
                  <option value="all">Tous les ports</option>
                  {[...new Set(boats.map(b => b.port))].filter(Boolean).map(port => (
                    <option key={port} value={port}>{port}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Type</label>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <option value="all">Tous les types</option>
                  {[...new Set(boats.map(b => b.type))].filter(Boolean).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="stats-cards">
            <div className="stat-card">
              <h3>{filteredBoats.length}</h3>
              <p>Bateaux disponibles</p>
            </div>
            <div className="stat-card">
              <h3>{[...new Set(filteredBoats.map(b => b.port))].length}</h3>
              <p>Ports</p>
            </div>
            <div className="stat-card">
              <h3>{[...new Set(filteredBoats.map(b => b.type))].length}</h3>
              <p>Types de bateaux</p>
            </div>
            <div className="stat-card">
              <h3>
                {Math.min(...filteredBoats.map(b => b.dailyPrice).filter(p => p > 0)) || 0}€
              </h3>
              <p>Prix min/jour</p>
            </div>
          </div>

          {/* Liste des bateaux */}
          <div className="locations-list">
            {filteredBoats.length === 0 ? (
              <div className="empty-state">
                <FontAwesomeIcon icon={faExclamationTriangle} size="3x" />
                <h3>Aucun bateau trouvé</h3>
                <p>Aucun bateau ne correspond à vos critères de recherche.</p>
              </div>
            ) : (
              filteredBoats.map((boat) => (
                <div key={boat.id} className="location-card">
                  <div className="location-image">
                    <img
                      src={boat.imageUrl}
                      alt={boat.name}
                    />
                    <div className="status-badge">
                      <FontAwesomeIcon icon={faCheckCircle} className="status-icon confirmed" />
                      <span>Disponible</span>
                    </div>
                  </div>

                  <div className="location-details">
                    <div className="location-header">
                      <h3>{boat.name}</h3>
                      <span className="boat-type">{boat.type}</span>
                    </div>

                    <div className="location-info">
                      <div className="info-row">
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                        <span>{boat.port || 'Port inconnu'}</span>
                      </div>
                      <div className="info-row">
                        <FontAwesomeIcon icon={faEuroSign} />
                        <span>{boat.dailyPrice.toLocaleString()}€/jour</span>
                      </div>
                      <div className="info-row">
                        <span>Capacité: {boat.capacity} pers. • {boat.length}m</span>
                      </div>
                    </div>
                  </div>

                  <div className="location-actions">
                    <Link
                      to={`/boats/${boat.id}`}
                      className="action-btn primary"
                    >
                      <FontAwesomeIcon icon={faEye} />
                      Voir détails
                    </Link>

                    <button
                      className="action-btn secondary"
                      onClick={() => setSelectedBoat(boat)}
                    >
                      <FontAwesomeIcon icon={faCalendarAlt} />
                      Réserver
                    </button>
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
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
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
          <div className="mt-8 pt-8 border-t border-blue-700 text-center">
            <p>&copy; 2025 SailingLoc. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OwnerReserve;
