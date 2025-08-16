import React, { useState } from 'react';

const EditUserModal = ({ user, open, onClose, onSave }) => {
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  if (!open) return null;

  return (
    <div className="modal-overlay" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.18)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div className="modal-card" style={{background:'#fff',borderRadius:'12px',padding:'32px 24px',boxShadow:'0 4px 32px rgba(0,0,0,0.18)',width:'350px',position:'relative'}}>
        <button onClick={onClose} style={{position:'absolute',top:16,right:16,fontSize:'1.3rem',background:'none',border:'none',cursor:'pointer',color:'#888'}}>✖️</button>
        <h2 style={{fontWeight:600,fontSize:'1.35rem',marginBottom:'18px'}}>Modifier mon profil</h2>
        <div style={{marginBottom:'18px'}}>
          <label style={{display:'block',fontWeight:500,color:'#888',marginBottom:4}}>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:'10px',borderRadius:'7px',border:'1px solid #ddd',marginBottom:8,fontSize:'1rem'}} />
        </div>
        <div style={{marginBottom:'24px'}}>
          <label style={{display:'block',fontWeight:500,color:'#888',marginBottom:4}}>Téléphone</label>
          <input type="text" value={phone} onChange={e=>setPhone(e.target.value)} style={{width:'100%',padding:'10px',borderRadius:'7px',border:'1px solid #ddd',fontSize:'1rem'}} />
        </div>
        <div style={{display:'flex',justifyContent:'space-between',gap:16}}>
          <button onClick={onClose} style={{flex:1,padding:'10px',border:'1px solid #e0e0e0',borderRadius:'8px',background:'#fff',color:'#3a3a3a',fontWeight:500,fontSize:'1rem',marginRight:8}}>Annuler</button>
          <button onClick={()=>onSave({email,phone})} style={{flex:1,padding:'10px',border:'none',borderRadius:'8px',background:'linear-gradient(90deg,#5a84f7,#8e5bf7)',color:'#fff',fontWeight:600,fontSize:'1rem'}}>Enregistrer</button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
