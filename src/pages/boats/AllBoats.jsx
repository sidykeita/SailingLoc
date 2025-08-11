import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShip, faTachometerAlt, faUsers, faWater, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import boatService from '../../services/boat.service';
import '../../assets/css/YachtBoats.css';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const AllBoats = () => {
  const query = useQuery();
  const locationParam = (query.get('location') || '').trim();
  const textQuery = (query.get('query') || '').trim();

  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        // On tente un filtre côté API si possible
        const serverFilters = {};
        if (locationParam) serverFilters.location = locationParam;
        if (!locationParam && textQuery) serverFilters.q = textQuery; // si le backend supporte une recherche full-text
        const data = await boatService.getAllBoats(serverFilters);
        if (cancelled) return;
        setBoats(Array.isArray(data) ? data : []);
      } catch (e) {
        if (cancelled) return;
        setError('Erreur lors du chargement des bateaux');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [locationParam, textQuery]);

  // Filtrage client en secours pour matcher ville/port
  const activeCityQuery = (locationParam || textQuery).toLowerCase();
  const displayedBoats = useMemo(() => {
    if (!activeCityQuery) return boats;
    return boats.filter((boat) => {
      const candidates = [boat?.location, boat?.city, boat?.port, boat?.destination]
        .filter(Boolean)
        .map((v) => String(v).toLowerCase());
      return candidates.some((v) => v.includes(activeCityQuery));
    });
  }, [boats, activeCityQuery]);

  return (
    <div className="yacht-boats-page yacht-boats-container">
      <div className="page-content container mx-auto px-4 py-8 content-container">
        <h1 className="text-3xl font-bold text-[#274991] mb-2">Bateaux disponibles</h1>
        <p className="text-[#333333] mb-6">
          {locationParam || textQuery ? (
            <>Résultats pour <strong>{locationParam || textQuery}</strong></>
          ) : (
            <>Tous nos bateaux</>
          )}
        </p>

        {loading && <p>Chargement...</p>}
        {error && !loading && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayedBoats.length > 0 ? (
              displayedBoats.map((boat, index) => (
                <div key={boat?._id || boat?.id || index} className={`boat-card ${(boat?.status === 'disponible' || boat?.available) ? 'available' : ''} animated-card delay-${index % 6 + 1}`}>
                  <div className="boat-image">
                    <img
                      src={(Array.isArray(boat?.photos) ? boat.photos[0] : boat?.photos) || 'https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=2070&auto=format&fit=crop'}
                      alt={boat?.name || 'Bateau'}
                      className="w-full h-full object-cover"
                    />
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
