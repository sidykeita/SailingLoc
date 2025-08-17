import React, { useState } from 'react';

const BoatEditModal = ({ boat, open, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: boat?.name || '',
    type: boat?.type || '',
    dailyPrice: boat?.dailyPrice || '',
    port: boat?.port || '',
    status: boat?.status || '',
  });

  React.useEffect(() => {
    setForm({
      name: boat?.name || '',
      type: boat?.type || '',
      dailyPrice: boat?.dailyPrice || '',
      port: boat?.port || '',
      status: boat?.status || '',
    });
  }, [boat]);

  if (!open || !boat) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.18)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div className="modal-card" style={{background:'#fff',borderRadius:'12px',padding:'32px 24px',boxShadow:'0 4px 32px rgba(0,0,0,0.18)',width:'400px',position:'relative'}}>
        <button onClick={onClose} style={{position:'absolute',top:16,right:16,fontSize:'1.3rem',background:'none',border:'none',cursor:'pointer',color:'#888'}}>✖️</button>
        <h2 style={{fontWeight:600,fontSize:'1.35rem',marginBottom:'18px'}}>Modifier le bateau</h2>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontWeight:500,color:'#888',marginBottom:4}}>Nom</label>
            <input name="name" value={form.name} onChange={handleChange} style={{width:'100%',padding:'10px',borderRadius:'7px',border:'1px solid #ddd',marginBottom:8,fontSize:'1rem'}} />
          </div>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontWeight:500,color:'#888',marginBottom:4}}>Type</label>
            <input name="type" value={form.type} onChange={handleChange} style={{width:'100%',padding:'10px',borderRadius:'7px',border:'1px solid #ddd',marginBottom:8,fontSize:'1rem'}} />
          </div>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontWeight:500,color:'#888',marginBottom:4}}>Prix/jour (€)</label>
            <input name="dailyPrice" type="number" value={form.dailyPrice} onChange={handleChange} style={{width:'100%',padding:'10px',borderRadius:'7px',border:'1px solid #ddd',marginBottom:8,fontSize:'1rem'}} />
          </div>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontWeight:500,color:'#888',marginBottom:4}}>Localisation</label>
            <input name="port" value={form.port} onChange={handleChange} style={{width:'100%',padding:'10px',borderRadius:'7px',border:'1px solid #ddd',marginBottom:8,fontSize:'1rem'}} />
          </div>
          <div style={{marginBottom:'18px'}}>
            <label style={{display:'block',fontWeight:500,color:'#888',marginBottom:4}}>Statut</label>
            <input name="status" value={form.status} onChange={handleChange} style={{width:'100%',padding:'10px',borderRadius:'7px',border:'1px solid #ddd',marginBottom:8,fontSize:'1rem'}} />
          </div>
          <div style={{display:'flex',justifyContent:'space-between',gap:16}}>
            <button type="button" onClick={onClose} style={{flex:1,padding:'10px',border:'1px solid #e0e0e0',borderRadius:'8px',background:'#fff',color:'#3a3a3a',fontWeight:500,fontSize:'1rem',marginRight:8}}>Annuler</button>
            <button type="submit" style={{flex:1,padding:'10px',border:'none',borderRadius:'8px',background:'linear-gradient(90deg,#5a84f7,#8e5bf7)',color:'#fff',fontWeight:600,fontSize:'1rem'}}>Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoatEditModal;
