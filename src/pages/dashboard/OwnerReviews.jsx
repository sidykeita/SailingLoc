import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderDashboard from '../../components/HeaderDashboard';
import reviewService from '../../services/review.service';
import userService from '../../services/user.service';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSort, faCalendar, faStar as faStarFull } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';

const OwnerReviews = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [received, setReceived] = useState([]);
  const [given, setGiven] = useState([]);
  const [responding, setResponding] = useState({}); // { [reviewId]: text }
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('received'); // 'received' | 'given'
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        // Définir l'id utilisateur en amont
        const uid = currentUser?._id || currentUser?.id;

        // Avis reçus (mes bateaux)
        const receivedResp = await reviewService.getAllReviews({ owner: 'me', limit: 100 }).catch(() => []);
        const receivedArr = Array.isArray(receivedResp) ? receivedResp : (Array.isArray(receivedResp?.data) ? receivedResp.data : []);

        // Avis donnés (en tant qu'utilisateur connecté) — filtrer par ID utilisateur
        let givenArr = [];
        try {
          const allReviewsResp = await reviewService.getAllReviews({ limit: 1000 }).catch(() => []);
          const allReviews = Array.isArray(allReviewsResp) ? allReviewsResp : (Array.isArray(allReviewsResp?.data) ? allReviewsResp.data : []);
          givenArr = allReviews.filter(r => {
            const reviewUserId = r.user?._id || r.user || r.author?._id || r.author || r.reviewer?._id || r.reviewer;
            return uid && reviewUserId && String(reviewUserId) === String(uid);
          });
        } catch (e) {
          givenArr = [];
        }
        if (!mounted) return;
        // Filtrage strict côté front au cas où l'API ne filtre pas correctement: ne garder que les avis sur mes bateaux
        const receivedStrict = receivedArr.filter(r => {
          const boatOwner = r?.boat?.owner || r?.reservation?.boat?.owner || {};
          const ownerId = boatOwner?._id || boatOwner?.id || boatOwner;
          return uid && ownerId && String(ownerId) === String(uid);
        });

        // Enrichir les pseudos/auteurs pour éviter 'Utilisateur'
        const candidateIds = Array.from(new Set(
          receivedStrict
            .flatMap(r => [
              r.user?._id || r.user,
              r.author?._id || r.author,
              r.reviewer?._id || r.reviewer,
              r?.reservation?.user?._id || r?.reservation?.user,
              r?.reservation?.tenant?._id || r?.reservation?.tenant,
              r?.renter?._id || r?.renter,
            ])
            .filter(Boolean)
            .map(String)
        ));
        let usersMap = {};
        if (candidateIds.length > 0) {
          const fetched = await Promise.all(
            candidateIds.map(id => userService.getUserById(id).catch(() => null))
          );
          usersMap = fetched.filter(Boolean).reduce((acc,u)=>{ const id=u._id||u.id; if(id) acc[id]=u; return acc; },{});
        }
        const receivedEnriched = receivedStrict.map(r => {
          // essayer par ID -> usersMap
          const uid = r.user?._id || r.user || r.author?._id || r.author || r.reviewer?._id || r.reviewer || r?.reservation?.user?._id || r?.reservation?.user || r?.reservation?.tenant?._id || r?.reservation?.tenant || r?.renter?._id || r?.renter;
          const u = uid ? usersMap[String(uid)] : null;
          // sinon, tenter de lire depuis l'objet reservation.user/tenant directement
          const direct = r?.reservation?.user || r?.reservation?.tenant || r?.renter || null;
          const source = u || direct;
          
          // Si on n'a pas de source, créer un nom générique avec l'ID
          let name, since;
          if (source) {
            name = [source.firstName, source.lastName].filter(Boolean).join(' ').trim() || source.name || source.username || source.pseudo || source.displayName || (source.email ? String(source.email).split('@')[0] : '') || 'Utilisateur';
            since = source.createdAt;
          } else {
            // Fallback avec l'ID pour identifier le locataire
            const shortId = uid ? String(uid).slice(-4) : 'xxxx';
            name = `Locataire #${shortId}`;
            since = null;
          }
          
          const reviewer = r.user || r.author || r.reviewer || {};
          return { ...r, reviewerName: name, reviewerSince: since, user: { ...reviewer, name, firstName: source?.firstName, lastName: source?.lastName, createdAt: since } };
        });

        setReceived(receivedEnriched);
        // Enrichir les avis donnés avec un profil fiable (currentUser ou fetch API)
        let displayUser = currentUser;
        if (!((displayUser?.firstName) || (displayUser?.lastName) || (displayUser?.name))) {
          try {
            const fetchedMe = await userService.getUserById(uid).catch(() => null);
            if (fetchedMe) displayUser = fetchedMe;
          } catch (_) {}
        }
        const givenEnriched = givenArr.map(r => {
          const reviewer = r.user || r.author || r.reviewer || {};
          const fallbackName =
            [displayUser?.firstName, displayUser?.lastName].filter(Boolean).join(' ').trim() ||
            displayUser?.name ||
            displayUser?.username ||
            displayUser?.pseudo ||
            displayUser?.displayName ||
            (displayUser?.email ? String(displayUser.email).split('@')[0] : '') ||
            'Utilisateur';
          return { ...r, reviewerName: fallbackName, reviewerSince: displayUser?.createdAt, user: { ...reviewer, name: fallbackName, firstName: displayUser?.firstName, lastName: displayUser?.lastName, createdAt: displayUser?.createdAt } };
        });
        setGiven(givenEnriched);
      } catch (e) {
        if (!mounted) return;
        setError("Impossible de charger les avis pour l'instant.");
        setReviews([]);
      } finally {
        mounted && setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Recharger les avis donnés à la réception de l'évènement global
  useEffect(() => {
    const reloadGiven = async () => {
      const uid = currentUser?._id || currentUser?.id;
      let givenArr = [];
      try {
        // Récupérer tous les avis et filtrer côté front par l'ID utilisateur
        const allReviewsResp = await reviewService.getAllReviews({ limit: 1000 }).catch(() => []);
        const allReviews = Array.isArray(allReviewsResp) ? allReviewsResp : (Array.isArray(allReviewsResp?.data) ? allReviewsResp.data : []);
        
        // Filtrer pour ne garder que les avis créés par cet utilisateur
        givenArr = allReviews.filter(r => {
          const reviewUserId = r.user?._id || r.user || r.author?._id || r.author || r.reviewer?._id || r.reviewer;
          return uid && reviewUserId && String(reviewUserId) === String(uid);
        });
        // Enrichir avec le pseudo du currentUser
        const givenEnriched = givenArr.map(r => {
          const reviewer = r.user || r.author || r.reviewer || {};
          const name = [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ').trim() || currentUser?.name || 'Utilisateur';
          return { ...r, reviewerName: name, user: { ...reviewer, name, firstName: currentUser?.firstName, lastName: currentUser?.lastName } };
        });
        setGiven(givenEnriched);
      } catch (_) {}
    };
    const handler = () => reloadGiven();
    window.addEventListener('review:updated', handler);
    return () => window.removeEventListener('review:updated', handler);
  }, [currentUser]);

  // Optionnel: quand on passe sur l'onglet "Avis donnés", on peut rafraîchir
  useEffect(() => {
    if (activeTab === 'given') {
      (async () => {
        const uid = currentUser?._id || currentUser?.id;
        let givenArr = [];
        try {
          // Récupérer tous les avis et filtrer côté front par l'ID utilisateur
          const allReviewsResp = await reviewService.getAllReviews({ limit: 1000 }).catch(() => []);
          const allReviews = Array.isArray(allReviewsResp) ? allReviewsResp : (Array.isArray(allReviewsResp?.data) ? allReviewsResp.data : []);
          
          // Filtrer pour ne garder que les avis créés par cet utilisateur
          givenArr = allReviews.filter(r => {
            const reviewUserId = r.user?._id || r.user || r.author?._id || r.author || r.reviewer?._id || r.reviewer;
            return uid && reviewUserId && String(reviewUserId) === String(uid);
          });
          // Enrichir avec le pseudo du currentUser
          const givenEnriched = givenArr.map(r => {
            const reviewer = r.user || r.author || r.reviewer || {};
            const name = [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ').trim() || currentUser?.name || 'Utilisateur';
            return { ...r, reviewerName: name, user: { ...reviewer, name, firstName: currentUser?.firstName, lastName: currentUser?.lastName } };
          });
          setGiven(givenEnriched);
        } catch (_) {}
      })();
    }
  }, [activeTab, currentUser]);

  const onChangeResponse = (id, text) => setResponding((m) => ({ ...m, [id]: text }));

  const submitResponse = async (id) => {
    const text = (responding[id] || '').trim();
    if (!text) return;
    try {
      setSaving(true);
      await reviewService.addOwnerResponse(id, text);
      // Mise à jour locale simplifiée
      setReceived((prev) => prev.map(r => (r._id === id || r.id === id) ? ({ ...r, ownerResponse: { text, createdAt: new Date().toISOString() } }) : r));
      setResponding((m) => ({ ...m, [id]: '' }));
    } catch (_) {
      alert("Erreur lors de l'envoi de la réponse.");
    } finally {
      setSaving(false);
    }
  };

  // Stats & distribution (basées sur les avis reçus)
  const stats = useMemo(() => {
    const list = received;
    const total = list.length;
    const sum = list.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    const averageRating = total ? +(sum / total).toFixed(1) : 0;
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    list.forEach(r => { const k = Math.round(Number(r.rating || 0)); if (distribution[k] !== undefined) distribution[k] += 1; });
    return { total, averageRating, distribution };
  }, [received]);

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    const stars = [];
    for (let i = 0; i < full; i++) stars.push(<FontAwesomeIcon key={`f-${i}`} icon={faStarFull} className="text-yellow-500" />);
    if (half) stars.push(<FontAwesomeIcon key="half" icon={faStarFull} className="text-yellow-300" />);
    const empties = 5 - Math.ceil(rating);
    for (let i = 0; i < empties; i++) stars.push(<FontAwesomeIcon key={`e-${i}`} icon={faStarEmpty} className="text-gray-300" />);
    return <div className="flex gap-1 items-center">{stars}</div>;
  };

  const applyFilters = (list) => {
    let arr = [...list];
    if (filterRating !== 'all') {
      const val = parseInt(filterRating);
      arr = arr.filter(r => Math.round(Number(r.rating || 0)) === val);
    }
    if (sortBy === 'recent') arr.sort((a,b) => new Date(b.createdAt||b.date) - new Date(a.createdAt||a.date));
    else if (sortBy === 'oldest') arr.sort((a,b) => new Date(a.createdAt||a.date) - new Date(b.createdAt||b.date));
    else if (sortBy === 'rating-high') arr.sort((a,b) => Number(b.rating||0) - Number(a.rating||0));
    else if (sortBy === 'rating-low') arr.sort((a,b) => Number(a.rating||0) - Number(b.rating||0));
    return arr;
  };

  const listToRender = activeTab === 'received' ? applyFilters(received) : applyFilters(given);

  return (
    <div className="min-h-screen bg-background">
      <HeaderDashboard />
      <main className="container mx-auto px-4 py-8">
        <h1 className="font-pacifico text-primary text-3xl mb-6">Mes avis</h1>

        {/* Stats rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="card p-4 text-center">
            <div className="text-3xl font-semibold">{stats.averageRating}</div>
            <div className="flex justify-center mt-1">{renderStars(stats.averageRating)}</div>
            <div className="text-gray-600 mt-1">Note moyenne</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-3xl font-semibold">{stats.total}</div>
            <div className="text-gray-600 mt-1">Avis reçus</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-3xl font-semibold">{given.length}</div>
            <div className="text-gray-600 mt-1">Avis donnés</div>
          </div>
        </div>

        {/* Répartition des notes */}
        <div className="card p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4">Répartition des notes</h3>
          {[5,4,3,2,1].map((k) => {
            const count = stats.distribution[k] || 0;
            const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
            return (
              <div key={k} className="flex items-center gap-3 mb-2">
                <div className="w-24 text-sm text-gray-700">{k} étoiles</div>
                <div className="flex-1 h-2 bg-gray-200 rounded">
                  <div className="h-2 bg-yellow-400 rounded" style={{ width: `${pct}%` }}></div>
                </div>
                <div className="w-6 text-right text-sm text-gray-700">{count}</div>
              </div>
            );
          })}
        </div>

        {/* Onglets */}
        <div className="flex mb-4 gap-2">
          <button className={`px-4 py-2 rounded ${activeTab==='received' ? 'bg-primary text-white' : 'bg-white border'}`} onClick={()=>setActiveTab('received')}>Avis reçus ({received.length})</button>
          <button className={`px-4 py-2 rounded ${activeTab==='given' ? 'bg-primary text-white' : 'bg-white border'}`} onClick={()=>setActiveTab('given')}>Avis donnés ({given.length})</button>
        </div>

        {/* Filtres & tri */}
        <div className="card p-4 mb-6 flex flex-col md:flex-row gap-4 md:items-center">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faFilter} />
            <select value={filterRating} onChange={(e)=>setFilterRating(e.target.value)} className="border rounded px-2 py-1">
              <option value="all">Toutes les notes</option>
              <option value="5">5 étoiles</option>
              <option value="4">4 étoiles</option>
              <option value="3">3 étoiles</option>
              <option value="2">2 étoiles</option>
              <option value="1">1 étoile</option>
            </select>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <FontAwesomeIcon icon={faSort} />
            <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)} className="border rounded px-2 py-1">
              <option value="recent">Plus récents</option>
              <option value="oldest">Plus anciens</option>
              <option value="rating-high">Note décroissante</option>
              <option value="rating-low">Note croissante</option>
            </select>
          </div>
        </div>

        {/* Liste des avis */}
        {loading ? (
          <div className="card p-6">Chargement des avis…</div>
        ) : error ? (
          <div className="card p-6 text-red-600">{error}</div>
        ) : listToRender.length === 0 ? (
          <div className="card p-6">Aucun avis à afficher.</div>
        ) : (
          <div className="space-y-4">
            {listToRender.map((rev) => {
              const id = rev._id || rev.id;
              const rating = Number(rev.rating || 0);
              const boat = rev.boat || rev?.reservation?.boat || {};
              const boatName = boat?.name || 'Bateau';
              const port = boat?.port || rev?.reservation?.port || rev?.reservation?.location || '';
              const reviewerRaw = rev.user || rev.author || rev.reviewer || {};
              const createdAt = rev.createdAt || rev.date;
              const isGivenTab = activeTab === 'given';
              // Construire un nom d'affichage robuste (même logique pour reçus et donnés)
              const currentName = [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ').trim() || currentUser?.name || currentUser?.username || currentUser?.pseudo || currentUser?.displayName || (currentUser?.email ? String(currentUser.email).split('@')[0] : '');
              const reviewerNameFromObj = (typeof reviewerRaw === 'object' && reviewerRaw) ? ([reviewerRaw.firstName, reviewerRaw.lastName].filter(Boolean).join(' ').trim() || reviewerRaw.name || reviewerRaw.username || reviewerRaw.pseudo || reviewerRaw.displayName || (reviewerRaw.email ? String(reviewerRaw.email).split('@')[0] : '')) : '';
              const displayName = rev.reviewerName || (isGivenTab ? (currentName || reviewerNameFromObj || 'Moi') : (reviewerNameFromObj || 'Utilisateur'));
              const initials = (displayName || 'U').split(' ').map(s => s.charAt(0)).slice(0,2).join('').toUpperCase();
              // Dates de réservation si présentes
              const start = rev?.reservation?.startDate ? new Date(rev.reservation.startDate) : null;
              const end = rev?.reservation?.endDate ? new Date(rev.reservation.endDate) : null;
              const datesStr = (start && end) ? `${start.toLocaleDateString('fr-FR')} - ${end.toLocaleDateString('fr-FR')}` : '';
              const boatId = boat?._id || boat?.id || rev?.reservation?.boat?._id || rev?.reservation?.boat?.id || null;
              return (
                <div key={id} className="card p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 grid place-items-center text-gray-500 font-semibold">
                          {initials}
                        </div>
                        <div>
                          <div className="font-semibold">{displayName}</div>
                          <div className="text-xs text-gray-400">Membre depuis {rev.reviewerSince ? new Date(rev.reviewerSince).toLocaleDateString('fr-FR') : '—'}</div>
                          <div className="text-sm text-gray-500">{port || '—'}</div>
                        </div>
                      </div>
                      <div className="mt-3 inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded">
                        <span className="font-semibold">{boatName}</span>
                        {port && <span>{' '}</span>}
                        {port && <span>• {port}</span>}
                        {datesStr && <span>{' '}</span>}
                        {datesStr && <span>• {datesStr}</span>}
                      </div>
                      <p className="mt-3">{rev.comment || rev.text || rev.content || ''}</p>
                      {boatId && (
                        <div className="mt-3">
                          <Link className="text-primary hover:underline" to={`/boats/${boatId}`}>Voir l'annonce</Link>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex justify-end">{renderStars(rating)}</div>
                      <div className="text-sm text-gray-500 mt-1 flex items-center gap-2 justify-end">
                        <FontAwesomeIcon icon={faCalendar} />
                        {createdAt ? new Date(createdAt).toLocaleDateString('fr-FR') : ''}
                      </div>
                    </div>
                  </div>

                  {activeTab==='received' && !rev.ownerResponse && (
                    <div className="mt-4">
                      <label className="block text-sm text-gray-700 mb-1">Répondre à cet avis</label>
                      <textarea
                        className="w-full border rounded p-2"
                        rows={3}
                        value={responding[id] || ''}
                        onChange={(e) => onChangeResponse(id, e.target.value)}
                        placeholder="Merci pour votre avis !"
                      />
                      <button
                        className="btn-primary mt-2"
                        onClick={() => submitResponse(id)}
                        disabled={saving || !(responding[id] || '').trim()}
                      >{saving ? 'Envoi…' : 'Publier la réponse'}</button>
                    </div>
                  )}

                  {activeTab==='received' && rev.ownerResponse && (
                    <div className="mt-4 p-3 bg-gray-50 rounded border">
                      <div className="text-sm text-gray-500">Votre réponse</div>
                      <div>{rev.ownerResponse.text}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Retour tableau de bord */}
        <div className="flex justify-center mt-10">
          <a href="/owner/dashboard" className="px-6 py-3 rounded bg-gray-500 hover:bg-gray-600 text-white">Retour au tableau de bord</a>
        </div>
      </main>
    </div>
  );
};

export default OwnerReviews;
