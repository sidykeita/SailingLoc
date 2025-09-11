import React, { useEffect, useMemo, useState } from 'react';
import HeaderDashboard from '../../components/HeaderDashboard';
import { getFavorites, removeFavorite as removeFavoriteApi } from '../../services/favoriteService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faMapMarkerAlt, faEye, faTrash, faUsers, faAnchor } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const OwnerFavorites = () => {
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getFavorites()
      .then((res) => {
        if (!mounted) return;
        setFavorites(Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));
      })
      .catch(() => { if (mounted) setFavorites([]); })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const removeFavorite = async (boatId) => {
    try {
      await removeFavoriteApi(boatId);
      setFavorites((prev) => prev.filter((f) => (f._id || f.id) !== boatId));
    } catch (_) {}
  };

  const getTypeIcon = (type) => faAnchor;
  const getTypeLabel = (type) => type ? (type.charAt(0).toUpperCase() + type.slice(1)) : '—';

  const filtered = useMemo(() => {
    let list = [...favorites];
    if (filterType !== 'all') list = list.filter((f) => (f.type || '').toLowerCase() === filterType);
    if (filterLocation !== 'all') {
      list = list.filter((f) => {
        const loc = (f.location || f.port || f.city || f?.boat?.location || f?.boat?.port || '').toString().toLowerCase();
        return loc.includes(filterLocation.toLowerCase());
      });
    }
    switch (sortBy) {
      case 'price-low': list.sort((a,b)=>(a.dailyPrice||a.price||0)-(b.dailyPrice||b.price||0)); break;
      case 'price-high': list.sort((a,b)=>(b.dailyPrice||b.price||0)-(a.dailyPrice||a.price||0)); break;
      case 'rating': list.sort((a,b)=>(b.rating||0)-(a.rating||0)); break;
      case 'oldest': list.sort((a,b)=> new Date(a.dateAdded||a.createdAt||0)-new Date(b.dateAdded||b.createdAt||0)); break;
      default: list.sort((a,b)=> new Date(b.dateAdded||b.createdAt||0)-new Date(a.dateAdded||a.createdAt||0));
    }
    return list;
  }, [favorites, filterType, filterLocation, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <HeaderDashboard />
      <main className="container mx-auto px-4 py-8">
        <h1 className="font-pacifico text-primary text-3xl mb-6">Mes favoris</h1>

        {/* Filtres & tri */}
        <div className="card p-4 mb-6 flex flex-col md:flex-row gap-4 md:items-center">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faFilter} />
            <select value={filterType} onChange={(e)=>setFilterType(e.target.value)} className="border rounded px-2 py-1">
              <option value="all">Tous les types</option>
              <option value="voilier">Voiliers</option>
              <option value="catamaran">Catamarans</option>
              <option value="yacht">Yachts</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            <input value={filterLocation} onChange={(e)=>setFilterLocation(e.target.value)} placeholder="Destination (ex: Marseille)" className="border rounded px-2 py-1" />
          </div>
          <div className="ml-auto">
            <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)} className="border rounded px-2 py-1">
              <option value="recent">Plus récents</option>
              <option value="oldest">Plus anciens</option>
              <option value="price-low">Prix croissant</option>
              <option value="price-high">Prix décroissant</option>
              <option value="rating">Mieux notés</option>
            </select>
          </div>
        </div>

        {/* Grille favoris */}
        {loading ? (
          <div className="card p-6">Chargement…</div>
        ) : filtered.length === 0 ? (
          <div className="card p-6 text-center">
            <p className="mb-2">Aucun favori pour le moment.</p>
            <Link to="/boats" className="btn-primary inline-block mt-2">Découvrir des bateaux</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((favorite)=> (
              <div key={favorite._id || favorite.id} className="card overflow-hidden">
                <div className="relative h-40 bg-neutral">
                  <img
                    src={Array.isArray(favorite.photos) && favorite.photos[0] ? favorite.photos[0] : (Array.isArray(favorite.images) && favorite.images[0] ? favorite.images[0] : 'https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=1200&auto=format&fit=crop')}
                    alt={favorite.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    title="Retirer des favoris"
                    className="absolute top-2 right-2 bg-white/90 border rounded px-2 py-1 text-red-600 hover:bg-white"
                    onClick={()=>removeFavorite(favorite._id || favorite.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <FontAwesomeIcon icon={getTypeIcon(favorite.type)} />
                      <span>{getTypeLabel(favorite.type)}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg">{favorite.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span>{favorite.location || favorite.port || favorite.city || favorite?.boat?.location || favorite?.boat?.port || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <FontAwesomeIcon icon={faUsers} />
                    <span>Jusqu'à {favorite.capacity || favorite?.boat?.capacity || '-'} personnes</span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="font-semibold text-lg">{favorite.dailyPrice || favorite.price || 0}€</span>
                      <span className="text-sm text-gray-500"> / jour</span>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/boats/${favorite._id || favorite.id}`} className="btn-primary"><FontAwesomeIcon icon={faEye} /> Voir</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <div className="flex justify-center mt-10">
        <a href="/owner/dashboard" className="px-6 py-3 rounded bg-gray-500 hover:bg-gray-600 text-white">Retour au tableau de bord</a>
      </div>
    </div>
  );
};

export default OwnerFavorites;
