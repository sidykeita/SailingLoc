import React, { useEffect, useState } from 'react';
import HeaderDashboard from '../../components/HeaderDashboard';
import reviewService from '../../services/review.service';

const OwnerReviews = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [responding, setResponding] = useState({}); // { [reviewId]: text }
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        // Tentative: charger les avis liés à mes bateaux (backend peut ignorer owner=me)
        const data = await reviewService.getAllReviews({ owner: 'me', limit: 50 }).catch(() => []);
        const arr = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
        if (!mounted) return;
        setReviews(arr);
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

  const onChangeResponse = (id, text) => setResponding((m) => ({ ...m, [id]: text }));

  const submitResponse = async (id) => {
    const text = (responding[id] || '').trim();
    if (!text) return;
    try {
      setSaving(true);
      await reviewService.addOwnerResponse(id, text);
      // Mise à jour locale simplifiée
      setReviews((prev) => prev.map(r => (r._id === id || r.id === id) ? ({ ...r, ownerResponse: { text, createdAt: new Date().toISOString() } }) : r));
      setResponding((m) => ({ ...m, [id]: '' }));
    } catch (_) {
      alert("Erreur lors de l'envoi de la réponse.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderDashboard />
      <main className="container mx-auto px-4 py-8">
        <h1 className="font-pacifico text-primary text-3xl mb-6">Avis (Propriétaire)</h1>

        {loading ? (
          <div className="card p-6">Chargement des avis…</div>
        ) : error ? (
          <div className="card p-6 text-red-600">{error}</div>
        ) : reviews.length === 0 ? (
          <div className="card p-6">Aucun avis reçu pour l’instant.</div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => {
              const id = rev._id || rev.id;
              const rating = Number(rev.rating || 0);
              const boatName = rev?.boat?.name || rev?.reservation?.boat?.name || 'Bateau';
              const reviewer = rev.user || rev.author || rev.reviewer || {};
              return (
                <div key={id} className="card p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{boatName}</h3>
                      <p className="text-gray-600">Note: {rating}/5</p>
                      <p className="mt-2">{rev.comment || rev.text || rev.content || ''}</p>
                      <p className="text-sm text-gray-500 mt-2">Par {reviewer.firstName ? `${reviewer.firstName} ${reviewer.lastName || ''}`.trim() : (reviewer.name || 'Utilisateur')}</p>
                    </div>
                  </div>

                  {rev.ownerResponse ? (
                    <div className="mt-4 p-3 bg-gray-50 rounded border">
                      <div className="text-sm text-gray-500">Votre réponse</div>
                      <div>{rev.ownerResponse.text}</div>
                    </div>
                  ) : (
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
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default OwnerReviews;
