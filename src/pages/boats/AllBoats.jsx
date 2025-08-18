import React, { useEffect, useMemo, useState, useReducer, useCallback, useContext, useRef } from 'react';
import { API_URL } from '../../lib/api';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShip, faTachometerAlt, faUsers, faWater, faArrowRight, faFilter, faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import * as favoriteService from '../../services/favoriteService';
import '../../assets/css/YachtBoats.css';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const AllBoats = () => {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [hoveredBoatId, setHoveredBoatId] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await favoriteService.getFavorites();
      setFavoriteIds(Array.isArray(res.data) ? res.data.map(fav => fav.boat?._id || fav.boatId || fav.id) : []);
    } catch (e) {
      setFavoriteIds([]);
    }
  };

  const toggleFavorite = async (boatId) => {
    if (favoriteIds.includes(boatId)) {
      await favoriteService.removeFavorite(boatId);
      setFavoriteIds(favoriteIds.filter(id => id !== boatId));
    } else {
      await favoriteService.addFavorite(boatId);
      setFavoriteIds([...favoriteIds, boatId]);
    }
  };

  const query = useQuery();
  const locationParam = (query.get('location') || '').trim();
  const textQuery = (query.get('query') || '').trim();
  const dateParam = (query.get('date') || '').trim(); // compat: un seul jour
  const startParam = (query.get('start') || '').trim();
  const endParam = (query.get('end') || '').trim();

  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [capacityFilter, setCapacityFilter] = useState('all');

  useEffect(() => {
  setLoading(true);
  setError('');
  fetch(`${API_URL}/boats`, { credentials: 'include' })
    .then(res => {
      if (!res.ok) throw new Error('Bad response');
      return res.json();
    })
    .then(data => setBoats(Array.isArray(data) ? data : []))
    .catch(() => setError('Erreur lors du chargement des bateaux'))
    .finally(() => setLoading(false));
}, []);

  // Filtrage client en secours pour matcher ville/port
  const activeCityQuery = (locationParam || textQuery).toLowerCase();

  // Helpers dates
  const parseISO = (s) => {
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };
  const isSameOrBetween = (d, start, end) => {
    if (!d || !start || !end) return false;
    const t = d.getTime();
    return t >= start.getTime() && t <= end.getTime();
  };
  const isUnavailableAtDate = (boat, dateStr) => {
    if (!dateStr) return false;
    const target = parseISO(dateStr);
    if (!target) return false;
    // 1) unavailableDates: ["YYYY-MM-DD", ...]
    if (Array.isArray(boat?.unavailableDates)) {
      const found = boat.unavailableDates.some((s) => {
        const d = parseISO(s);
        return d && d.getTime() === target.getTime();
      });
      if (found) return true;
    }
    // 2) bookings: [{ startDate, endDate }]
    if (Array.isArray(boat?.bookings)) {
      const booked = boat.bookings.some((b) => {
        const start = parseISO(b?.startDate);
        const end = parseISO(b?.endDate);
        return isSameOrBetween(target, start, end);
      });
      if (booked) return true;
    }
    // 3) status explicite
    if (boat?.status && boat.status !== 'disponible') return true;
    return false;
  };

  const displayedBoats = useMemo(() => {
    let filtered = boats;
    // Filtre ville/port (query params)
    if (activeCityQuery && activeCityQuery.length > 0) {
      filtered = filtered.filter((boat) => {
        const candidates = [boat?.location, boat?.city, boat?.port, boat?.destination]
          .filter(Boolean)
          .map((v) => String(v).toLowerCase());
        return candidates.some((v) => v.includes(activeCityQuery));
      });
    }
    // Filtre recherche universelle (nom/description)
    if (searchTerm && searchTerm.length > 0) {
      filtered = filtered.filter(
        (boat) =>
          (boat.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (boat.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Filtre prix
    filtered = filtered.filter((boat) => {
      const normalizedPrice = Number(boat?.dailyPrice ?? boat?.pricePerDay ?? boat?.price ?? 0);
      if (priceFilter === 'low') return normalizedPrice < 300;
      if (priceFilter === 'medium') return normalizedPrice >= 300 && normalizedPrice <= 700;
      if (priceFilter === 'high') return normalizedPrice > 700;
      return true;
    });
    // Filtre capacité
    filtered = filtered.filter((boat) => {
      const cap = parseInt(boat?.capacity);
      if (capacityFilter === 'small') return cap <= 4;
      if (capacityFilter === 'medium') return cap > 4 && cap <= 8;
      if (capacityFilter === 'large') return cap > 8;
      return true;
    });
    // Filtre date/dispo
    if (startParam && endParam) return filtered;
    if (dateParam && dateParam.length > 0) return filtered.filter((boat) => !isUnavailableAtDate(boat, dateParam));
    return filtered;
  }, [boats, activeCityQuery, dateParam, startParam, endParam, searchTerm, priceFilter, capacityFilter]);

  return (
    <div className="yacht-boats-page yacht-boats-container">
      <div className="page-content container mx-auto px-4 py-8 content-container">
        <h1 className="text-3xl font-bold text-[#274991] mb-2">Bateaux disponibles</h1>
        <div className="filters-section mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
              <div className="filter-input">
                <FontAwesomeIcon icon={faSearch} className="filter-icon" />
                <input
                  id="search"
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nom ou description..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Prix par jour</label>
              <div className="filter-input">
                <FontAwesomeIcon icon={faFilter} className="filter-icon" />
                <select
                  id="price"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={priceFilter}
                  onChange={e => setPriceFilter(e.target.value)}
                >
                  <option value="all">Tous les prix</option>
                  <option value="low">Économique (moins de 300€)</option>
                  <option value="medium">Intermédiaire (300€ - 700€)</option>
                  <option value="high">Premium (plus de 700€)</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">Capacité</label>
              <div className="filter-input">
                <FontAwesomeIcon icon={faUsers} className="filter-icon" />
                <select
                  id="capacity"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={capacityFilter}
                  onChange={e => setCapacityFilter(e.target.value)}
                >
                  <option value="all">Toutes capacités</option>
                  <option value="small">Petit groupe (jusqu'à 4 pers.)</option>
                  <option value="medium">Groupe moyen (5-8 pers.)</option>
                  <option value="large">Grand groupe (plus de 8 pers.)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <p className="text-[#333333] mb-6">
          {locationParam || textQuery ? (
            <>
              Résultats pour <strong>{locationParam || textQuery}</strong>
              {startParam && endParam ? (
                <> — du <strong>{startParam}</strong> au <strong>{endParam}</strong></>
              ) : dateParam ? (
                <> — le <strong>{dateParam}</strong></>
              ) : null}
            </>
          ) : (
            <>
              Tous nos bateaux
              {startParam && endParam ? (
                <> — du <strong>{startParam}</strong> au <strong>{endParam}</strong></>
              ) : dateParam ? (
                <> — le <strong>{dateParam}</strong></>
              ) : null}
            </>
          )}
        </p>

        {loading && <p>Chargement...</p>}
        {error && !loading && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayedBoats.length > 0 ? (
              displayedBoats.map((boat, index) => (
                <div key={boat?._id || boat?.id || index} className={`boat-card ${(boat?.status === 'disponible' || boat?.available) ? 'available' : ''} animated-card delay-${index % 6 + 1}`}
                  onMouseEnter={() => setHoveredBoatId(boat?._id || boat?.id)}
                  onMouseLeave={() => setHoveredBoatId(null)}
                >
                  <div className="boat-image" style={{ position: 'relative' }}>
                    <img
                      src={Array.isArray(boat?.photos) && boat.photos.length > 0 ? boat.photos[0] : (typeof boat?.photos === 'string' && boat.photos ? boat.photos : 'https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=2070&auto=format&fit=crop')}
                      alt={boat?.name || 'Bateau'}
                      className="w-full h-full object-cover"
                    />
                    <button
                      className="favorite-btn"
                      title={favoriteIds.includes(boat?._id || boat?.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      onClick={e => { e.stopPropagation(); toggleFavorite(boat?._id || boat?.id); }}
                      style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        background: 'white',
                        borderRadius: '50%',
                        border: 'none',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        width: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s',
                        zIndex: 2
                      }}
                      onMouseEnter={() => setHoveredBoatId(boat?._id || boat?.id)}
                      onMouseLeave={() => setHoveredBoatId(null)}
                    >
                      <FontAwesomeIcon
                        icon={favoriteIds.includes(boat?._id || boat?.id) || hoveredBoatId === (boat?._id || boat?.id) ? faSolidHeart : faRegularHeart}
                        color={favoriteIds.includes(boat?._id || boat?.id) || hoveredBoatId === (boat?._id || boat?.id) ? 'red' : '#aaa'}
                        size="lg"
                      />
                    </button>
                  </div>
                  <div className="boat-details">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-bold text-[#274991]">{boat?.name || 'Bateau'}</h2>
                      <span className="boat-price">{Number(boat?.dailyPrice ?? boat?.pricePerDay ?? boat?.price ?? 0)}€/jour</span>
                    </div>
                    <p className="text-[#333333] mb-4">{boat?.description || '—'}</p>
                    <div className="boat-specs">
                      <div className="boat-spec">
                        <FontAwesomeIcon icon={faTachometerAlt} className="boat-spec-icon" />
                        <span className="boat-spec-label">Puissance</span>
                        <span className="boat-spec-value">{boat?.power ?? '-'}</span>
                      </div>
                      <div className="boat-spec">
                        <FontAwesomeIcon icon={faUsers} className="boat-spec-icon" />
                        <span className="boat-spec-label">Capacité</span>
                        <span className="boat-spec-value">{boat?.capacity ?? '-'}</span>
                      </div>
                      <div className="boat-spec">
                        <FontAwesomeIcon icon={faWater} className="boat-spec-icon" />
                        <span className="boat-spec-label">Longueur</span>
                        <span className="boat-spec-value">{boat?.length ?? '-'}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`badge ${boat?.status === 'disponible' ? 'badge-available' : 'badge-unavailable'}`}>
                        {boat?.status === 'disponible' ? 'Disponible' : 'Indisponible'}
                      </span>
                      <Link to={`/boats/${boat?._id || boat?.id}`} className="inline-flex items-center text-[#274991] hover:text-[#3C83C4]">
                        Voir détails
                        <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <FontAwesomeIcon icon={faShip} className="text-4xl text-gray-400 mb-2" />
                <p className="text-gray-600">Aucun bateau ne correspond à votre recherche.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBoats;
