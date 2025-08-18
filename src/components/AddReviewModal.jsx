import React, { useState } from 'react';

/**
 * Modale pour ajouter un avis, copie le style et l'UX de EditUserModal
 * Props :
 *   - open: bool
 *   - onClose: fonction fermeture
 *   - boat: { name, type }
 *   - onSubmit: fonction de soumission (reviewData)
 */
const AddReviewModal = ({ open, onClose, boat, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim().length < 10) {
      setError('Votre avis doit contenir au moins 10 caractères.');
      return;
    }
    setError('');
    onSubmit({ rating, comment });
  };

  return (
    <div className="modal-overlay" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.18)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div className="modal-card" style={{background:'#fff',borderRadius:'12px',padding:'32px 24px',boxShadow:'0 4px 32px rgba(0,0,0,0.18)',width:'350px',position:'relative'}}>
        <button onClick={onClose} style={{position:'absolute',top:16,right:16,fontSize:'1.3rem',background:'none',border:'none',cursor:'pointer',color:'#888'}}>✖️</button>
        <h2 style={{fontWeight:600,fontSize:'1.35rem',marginBottom:'18px'}}>Laisser un avis</h2>
        <div style={{marginBottom:'18px'}}>
          <span style={{fontWeight:500}}>Bateau :</span> <span>{boat?.name || ''}</span><br/>
          <span style={{fontSize:'0.85rem',color:'#888'}}>Type : {boat?.type || ''}</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'18px'}}>
            <label style={{display:'block',fontWeight:500,color:'#888',marginBottom:4}}>Note globale *</label>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              {[1,2,3,4,5].map(star => (
                <span
                  key={star}
                  style={{fontSize:'2rem',color:star<=rating?'#FFD600':'#E0E0E0',cursor:'pointer'}}
                  onClick={()=>setRating(star)}
                  aria-label={star+' étoiles'}
                >★</span>
              ))}
            </div>
            <div style={{fontSize:'0.8rem',color:'#aaa',marginTop:4}}>{['Médiocre','Passable','Bien','Très bien','Excellent'][rating-1]}</div>
          </div>
          <div style={{marginBottom:'24px'}}>
            <label style={{display:'block',fontWeight:500,color:'#888',marginBottom:4}}>Votre avis *</label>
            <textarea
              value={comment}
              onChange={e=>setComment(e.target.value)}
              placeholder="Partagez votre expérience... (minimum 10 caractères)"
              rows={4}
              maxLength={1000}
              style={{width:'100%',padding:'10px',borderRadius:'7px',border:'1px solid #ddd',fontSize:'1rem',resize:'vertical'}}
              required
            />
            <div style={{fontSize:'0.8rem',color:'#aaa'}}>{comment.length}/1000 caractères</div>
          </div>
          {error && <div style={{color:'#e53e3e',fontSize:'0.95rem',marginBottom:8}}>{error}</div>}
          <div style={{display:'flex',justifyContent:'space-between',gap:16}}>
            <button type="button" onClick={onClose} style={{flex:1,padding:'10px',border:'1px solid #e0e0e0',borderRadius:'8px',background:'#fff',color:'#3a3a3a',fontWeight:500,fontSize:'1rem',marginRight:8}}>Annuler</button>
            <button type="submit" style={{flex:1,padding:'10px',border:'none',borderRadius:'8px',background:'linear-gradient(90deg,#5a84f7,#8e5bf7)',color:'#fff',fontWeight:600,fontSize:'1rem'}}>Envoyer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal;
