import React, { useState, useEffect } from 'react';

const LeaveReviewModal = ({ open, onClose, boat, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');

  // reset propre à chaque ouverture
  useEffect(() => {
    if (open) {
      setRating(5);
      setComment('');
      setPhotos([]);
      setError('');
    }
  }, [open]);

  if (!open) return null;

  const handlePhotoChange = (e) => setPhotos([...e.target.files]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isInvalid = rating === 0 || comment.trim().length < 10;
    if (isInvalid) {
      setError('Votre avis doit contenir au moins 10 caractères.');
      return;
    }
    setError('');
    // Envoi direct en BDD
    try {
      if (!boat?.boatId || !boat?.locationId) {
        setError('Impossible de trouver l\'identifiant du bateau ou de la réservation.');
        return;
      }
      const result = await import('../services/review.service.js').then(m => m.default.createReview({
        boat: boat.boatId,
        reservation: boat.locationId,
        rating,
        comment
      }));
      alert('Avis envoyé avec succès !');
      if (typeof onClose === 'function') onClose();
    } catch (error) {
      setError('Erreur lors de l\'envoi de l\'avis : ' + (error?.message || 'Erreur inconnue'));
      console.error('[DEBUG] Erreur envoi avis direct', error);
    }
  };

  const isInvalid = rating === 0 || comment.trim().length < 10;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.18)',
        zIndex: 2000,
        display: 'grid',
        placeItems: 'center'
      }}
    >
      <div
        className="modal-card"
        style={{
          background: '#fff',
          borderRadius: 16,
          width: '520px',
          maxWidth: '96vw',
          maxHeight: '92vh',
          boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Fermer */}
        <button
          onClick={onClose}
          aria-label="Fermer la modale"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            fontSize: '1.3rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#888'
          }}
        >
          ✖️
        </button>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #eee' }}>
          <h2 className="font-semibold text-xl" style={{ margin: 0 }}>Laisser un avis</h2>
          <div style={{ marginTop: 8 }}>
            <span className="font-medium">Bateau :</span> <span>{boat?.name || ''}</span><br />
            <span className="text-xs text-gray-500">Type : {boat?.type || ''}</span>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
          {/* Corps scrollable */}
          <div
            className="modal-body"
            style={{
              padding: '16px 24px',
              overflow: 'auto',
              flex: 1,
              minHeight: 0
            }}
          >
            <div className="mb-4">
              <label className="font-medium">Note globale *</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{ fontSize: '2rem', color: star <= rating ? '#FFD600' : '#E0E0E0', cursor: 'pointer' }}
                    onClick={() => setRating(star)}
                    aria-label={`${star} étoiles`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {['Médiocre', 'Passable', 'Bien', 'Très bien', 'Excellent'][rating - 1]}
              </div>
            </div>

            <div className="mb-4">
              <label className="font-medium">Votre avis *</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Partagez votre expérience avec ce bateau... (minimum 10 caractères)"
                rows={4}
                maxLength={1000}
                className="w-full border rounded p-2 mt-1"
                style={{ resize: 'vertical', width: '100%' }}
                required
              />
              <div className="text-xs text-gray-400">{comment.length}/1000 caractères</div>
            </div>

            <div className="mb-4">
              <label className="font-medium">Ajouter des photos (optionnel)</label>
              <input type="file" accept="image/*" multiple onChange={handlePhotoChange} className="block mt-1" />
            </div>

            {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          </div>

          {/* Footer sticky (toujours visible) */}
          <div
            className="modal-footer"
            style={{
              position: 'sticky',
              bottom: 0,
              background: '#fff',
              borderTop: '1px solid #eee',
              padding: '12px 24px',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 12
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                background: '#fff',
                color: '#3a3a3a',
                fontWeight: 500
              }}
            >
              Annuler
            </button>
            {/* PAS de disabled pour éviter les CSS globaux qui masquent les boutons désactivés */}
            <button
              type="submit"
              aria-disabled={isInvalid}
              onClick={(e) => {
                console.log('[DEBUG] Bouton Envoyer cliqué');
                if (isInvalid) {
                  e.preventDefault();
                  setError('Votre avis doit contenir au moins 10 caractères.');
                }
              }}
              style={{
                padding: '10px 18px',
                border: 'none',
                borderRadius: 8,
                background: 'linear-gradient(90deg,#5a84f7,#8e5bf7)',
                fontWeight: 600,
                display: 'inline-flex',
                opacity: isInvalid ? 0.6 : 1,
                cursor: isInvalid ? 'not-allowed' : 'pointer'
              }}
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveReviewModal;
