import React from 'react';

const BoatViewModal = ({ boat, open, onClose }) => {
  if (!open || !boat) return null;
  return (
    <div className="modal-overlay" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.18)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div className="modal-card" style={{background:'#fff',borderRadius:'12px',padding:'32px 24px',boxShadow:'0 4px 32px rgba(0,0,0,0.18)',width:'400px',position:'relative'}}>
        <button onClick={onClose} style={{position:'absolute',top:16,right:16,fontSize:'1.3rem',background:'none',border:'none',cursor:'pointer',color:'#888'}}>✖️</button>
        <h2 style={{fontWeight:600,fontSize:'1.35rem',marginBottom:'18px'}}>Détail du bateau</h2>
        <div><strong>Nom :</strong> {boat.name}</div>
        <div><strong>Propriétaire :</strong> {boat.owner}</div>
        <div><strong>Type :</strong> {boat.type}</div>
        <div><strong>Prix/jour :</strong> {boat.price}€</div>
        <div><strong>Localisation :</strong> {boat.location}</div>
        <div><strong>Statut :</strong> {boat.status}</div>
        {/* Ajoute d'autres infos si besoin */}
      </div>
    </div>
  );
};

export default BoatViewModal;
