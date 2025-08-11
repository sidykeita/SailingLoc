import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faUsers, faChevronUp, faShip, faTachometerAlt, faWater, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import boatService from '../../services/boat.service';
import '../../assets/css/YachtBoats.css';

const SemiRigideBoats = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [capacityFilter, setCapacityFilter] = useState('all');
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    setLoading(true);
    boatService
      .getAllBoats({ type: 'semi-rigide' })
      .then((data) => setBoats(data))
      .catch(() => setError('Erreur lors du chargement des bateaux'))
      .finally(() => setLoading(false));
  }, []);

  const filteredBoats = boats.filter((boat) => {
    const matchesSearch = (boat?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (boat?.description || '').toLowerCase().includes(searchTerm.toLowerCase());

    const normalizedPrice = Number(boat?.dailyPrice ?? boat?.pricePerDay ?? boat?.price ?? 0);
    const matchesPrice =
      priceFilter === 'all' ||
      (priceFilter === 'low' && normalizedPrice < 300) ||
      (priceFilter === 'medium' && normalizedPrice >= 300 && normalizedPrice <= 500) ||
      (priceFilter === 'high' && normalizedPrice > 500);

    const cap = parseInt(boat?.capacity ?? 0);
    const matchesCapacity =
      capacityFilter === 'all' ||
      (capacityFilter === 'small' && cap <= 4) ||
      (capacityFilter === 'medium' && cap > 4 && cap <= 8) ||
      (capacityFilter === 'large' && cap > 8);

    return matchesSearch && matchesPrice && matchesCapacity;
  });

  return (
    <>
      <div className="yacht-boats-page yacht-boats-container">
        <div className="page-content container mx-auto px-4 py-8 content-container">
          <h1 className="text-3xl font-bold text-[#274991] mb-2">Location de semi-rigides</h1>
          <p className="text-[#333333] mb-8">Découvrez nos semi-rigides disponibles à la location</p>

          <div className="filters-section">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
                <div className="filter-input">
                  <FontAwesomeIcon icon={faSearch} className="filter-icon" />
                  <input
                    type="text"
                    id="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nom ou description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                    onChange={(e) => setPriceFilter(e.target.value)}
                  >
                    <option value="all">Tous les prix</option>
                    <option value="low">Économique (moins de 300€)</option>
                    <option value="medium">Intermédiaire (300€ - 500€)</option>
                    <option value="high">Premium (plus de 500€)</option>
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
                    onChange={(e) => setCapacityFilter(e.target.value)}
                  >
                    <option value="all">Toutes capacités</option>
                    <option value="small">petit groupe (jusqu'à 4 pers.)</option>
                    <option value="medium">groupe moyen (5 à 8 pers.)</option>
                    <option value="large">grand groupe (plus de 8 personnes)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {loading && <p>Chargement...</p>}
          {error && !loading && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredBoats.length > 0 ? (
                filteredBoats.map((boat, index) => (
                  <div key={boat?._id || boat?.id || index} className={`boat-card ${(boat?.status === 'disponible' || boat?.available) ? 'available' : ''} animated-card delay-${index % 6 + 1}`}>
                    <div className="boat-image">
                      <img src={(Array.isArray(boat?.photos) ? boat.photos[0] : boat?.photos) || 'https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=2070&auto=format&fit=crop'} alt={boat?.name || 'Semi-rigide'} className="w-full h-full object-cover" />
                    </div>
                    <div className="boat-details">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-xl font-bold text-[#274991]">{boat?.name || 'Semi-rigide'}</h2>
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
                  <p className="text-gray-600">Aucun semi-rigide ne correspond à vos critères de recherche.</p>
                  <button 
                    onClick={() => { setSearchTerm(''); setPriceFilter('all'); setCapacityFilter('all'); }}
                    className="mt-4 bg-[#274991] text-white px-4 py-2 rounded-md hover:bg-[#1e3a73] transition-colors"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </div>
          )}

          {showScrollTop && (
            <button className="scroll-top-btn" onClick={scrollToTop}>
              <FontAwesomeIcon icon={faChevronUp} />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default SemiRigideBoats;
