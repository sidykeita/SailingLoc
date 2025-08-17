import React, { useState, useEffect } from 'react';

/**
 * Modale d'édition de réservation pour l'admin.
 * Props :
 *   - reservation: objet réservation à éditer
 *   - open: bool
 *   - onClose: fonction fermeture
 *   - onSave: fonction de sauvegarde (async)
 */
export default function ReservationEditModal({ reservation, open, onClose, onSave }) {
  const [form, setForm] = useState({
    startDate: reservation?.startDate || '',
    endDate: reservation?.endDate || '',
    status: reservation?.status || '',
    price: reservation?.price || '',
  });

  useEffect(() => {
    if (reservation) {
      setForm({
        startDate: reservation.startDate || '',
        endDate: reservation.endDate || '',
        status: reservation.status || '',
        price: reservation.price || '',
      });
    }
  }, [reservation, open]);

  if (!open || !reservation) return null;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.18)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div className="modal-card" style={{background:'#fff',borderRadius:'12px',padding:'32px 24px',boxShadow:'0 4px 32px rgba(0,0,0,0.18)',width:'400px',position:'relative'}}>
        <button onClick={onClose} style={{position:'absolute',top:16,right:16,fontSize:'1.3rem',background:'none',border:'none',cursor:'pointer',color:'#888'}}>✖️</button>
        <h2 style={{fontWeight:600,fontSize:'1.35rem',marginBottom:'18px'}}>Modifier la réservation</h2>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:16}}>
            <label>Date de début :</label>
            <input type="date" name="startDate" value={form.startDate?.slice(0,10)} onChange={handleChange} required style={{width:'100%',padding:8,marginTop:4}} />
          </div>
          <div style={{marginBottom:16}}>
            <label>Date de fin :</label>
            <input type="date" name="endDate" value={form.endDate?.slice(0,10)} onChange={handleChange} required style={{width:'100%',padding:8,marginTop:4}} />
          </div>
          <div style={{marginBottom:16}}>
            <label>Statut :</label>
            <select name="status" value={form.status} onChange={handleChange} style={{width:'100%',padding:8,marginTop:4}}>
              <option value="confirmée">Confirmée</option>
              <option value="en_attente">En attente</option>
              <option value="annulée">Annulée</option>
              <option value="terminée">Terminée</option>
            </select>
          </div>
          <div style={{marginBottom:16}}>
            <label>Montant (€) :</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} style={{width:'100%',padding:8,marginTop:4}} />
          </div>
          <div style={{display:'flex',justifyContent:'space-between',gap:16}}>
            <button type="button" onClick={onClose} style={{flex:1,padding:'10px',border:'1px solid #e0e0e0',borderRadius:'8px',background:'#fff',color:'#3a3a3a',fontWeight:500,fontSize:'1rem',marginRight:8}}>Annuler</button>
            <button type="submit" style={{flex:1,padding:'10px',border:'none',borderRadius:'8px',background:'linear-gradient(90deg,#5a84f7,#8e5bf7)',color:'#fff',fontWeight:600,fontSize:'1rem'}}>Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
}
