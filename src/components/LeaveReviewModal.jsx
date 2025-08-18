import React, { useState } from 'react';

/**
 * Modal pour laisser un avis (review) sur une location/bateau
 * Props :
 *   - open: bool (affiche ou non la modale)
 *   - onClose: fonction de fermeture
 *   - boat: { name, type }
 *   - onSubmit: fonction de soumission (reviewData)
 */
// LeaveReviewModal.jsx
const LeaveReviewModal = ({ open, onClose, boat, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  if (!open) return null;

  const handlePhotoChange = (e) => setPhotos([...e.target.files]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim().length < 10) { setError('Votre avis doit contenir au moins 10 caractères.'); return; }
    setError('');
    onSubmit({ rating, comment, photos });
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position:'fixed', inset:0, background:'rgba(0,0,0,0.18)',
        zIndex: 2000, display:'grid', placeItems:'center'
      }}
    >
      <div
        className="modal-card"
        style={{
          background:'#fff', borderRadius:16, width:'480px', maxWidth:'96vw',
          maxHeight:'92vh', boxShadow:'0 4px 32px rgba(0,0,0,0.18)',
          position:'relative', display:'flex', flexDirection:'column', padding:'24px'
        }}
      >
        <button
          onClick={onClose}
          aria-label="Fermer la modale"
          style={{position:'absolute', top:12, right:12, fontSize:'1.3rem', background:'none', border:'none', cursor:'pointer', color:'#888'}}
        >✖️</button>

        <h2 className="font-semibold text-xl mb-2">Laisser un avis</h2>
        <div className="mb-2">
          <span className="font-medium">Bateau :</span> <span>{boat?.name || ''}</span><br/>
          <span className="text-xs text-gray-500">Type : {boat?.type || ''}</span>
        </div>

        {/* Form en colonne: le corps scrolle, le footer reste visible */}
        <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', minHeight:0}}>
          {/* Corps scrollable */}
          <div style={{flex:1, overflow:'auto', paddingRight:4}}>
            <div className="mb-4">
              <label className="font-medium">Note globale *</label>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                {[1,2,3,4,5].map(star => (
                  <span
                    key={star}
                    style={{fontSize:'2rem', color: star<=rating ? '#FFD600' : '#E0E0E0', cursor:'pointer'}}
                    onClick={()=>setRating(star)}
                    aria-label={`${star} étoiles`}
                  >★</span>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {['Médiocre','Passable','Bien','Très bien','Excellent'][rating-1]}
              </div>
            </div>

            <div className="mb-4">
              <label className="font-medium">Votre avis *</label>
              <textarea
                value={comment}
                onChange={e=>setComment(e.target.value)}
                placeholder="Partagez votre expérience... (minimum 10 caractères)"
                rows={4} maxLength={1000}
                className="w-full border rounded p-2 mt-1"
                style={{resize:'vertical'}}
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

          {/* Footer actions toujours visible */}
          <div style={{display:'flex', justifyContent:'flex-end', gap:12, marginTop:12, paddingTop:12, borderTop:'1px solid #eee', background:'#fff'}}>
            <button type="button" onClick={onClose}
              style={{padding:'10px 18px', border:'1px solid #e0e0e0', borderRadius:8, background:'#fff', color:'#3a3a3a', fontWeight:500}}
            >Annuler</button>
            <button
              type="submit"
              disabled={rating===0 || comment.trim().length<10}
              style={{padding:'10px 18px', border:'none', borderRadius:8, background:'linear-gradient(90deg,#5a84f7,#8e5bf7)', color:'#fff', fontWeight:600,
                      opacity: (rating===0 || comment.trim().length<10) ? .6 : 1 }}
            >Envoyer</button>
          </div>
        </form>
      </div>
    </div>
  );
};
