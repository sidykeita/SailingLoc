import React, { useState } from 'react';

const BoatEditModal = ({ boat, open, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: boat?.name || '',
    type: boat?.type || '',
    dailyPrice: boat?.dailyPrice ?? boat?.price ?? '',
    port: boat?.port ?? boat?.location ?? '',
    status: boat?.status || '',
    features: Array.isArray(boat?.features) ? boat.features : [],
  });
  const [newFeature, setNewFeature] = useState('');

  // Liste d'équipements suggérés (pré-définie)
  const suggestedFeatures = [
    'GPS',
    'Radio',
    'Glacière',
    'Douche',
    'Plateforme de baignade',
    'Bain de soleil',
    'Cuisine équipée',
    'Toilettes marines',
    'Table pique-nique'
  ];

  React.useEffect(() => {
    if (boat) {
      setForm({
        name: boat.name ?? '',
        type: boat.type ?? '',
        dailyPrice: boat.dailyPrice ?? boat.price ?? '',
        port: boat.port ?? boat.location ?? '',
        status: boat.status ?? '',
        features: Array.isArray(boat.features) ? boat.features : [],
      });
    }
  }, [boat, open]);

  if (!open || !boat) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, features: form.features || [] });
  };

  const toggleFeature = (label) => {
    setForm((prev) => {
      const exists = (prev.features || []).includes(label);
      const features = exists
        ? prev.features.filter(f => f !== label)
        : [...(prev.features || []), label];
      return { ...prev, features };
    });
  };

  const addCustomFeature = () => {
    const value = (newFeature || '').trim();
    if (!value) return;
    setForm((prev) => {
      if ((prev.features || []).some(f => f.toLowerCase() === value.toLowerCase())) return prev;
      return { ...prev, features: [...(prev.features || []), value] };
    });
    setNewFeature('');
  };

  const removeFeature = (label) => {
    setForm(prev => ({ ...prev, features: (prev.features || []).filter(f => f !== label) }));
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

          {/* Equipements */}
          <div style={{marginBottom:'18px'}}>
            <label style={{display:'block',fontWeight:600,color:'#333',marginBottom:8}}>Équipements</label>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2, minmax(0,1fr))',gap:'10px 16px',marginBottom:10}}>
              {suggestedFeatures.map((feat) => (
                <label key={feat} style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',color:'#444'}}>
                  <input
                    type="checkbox"
                    checked={(form.features || []).includes(feat)}
                    onChange={() => toggleFeature(feat)}
                  />
                  {feat}
                </label>
              ))}
            </div>
            <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:10}}>
              <input
                placeholder="Ajouter un équipement (ex: Sondeur)"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomFeature(); } }}
                style={{flex:1,padding:'10px',borderRadius:'7px',border:'1px solid #ddd',fontSize:'1rem'}}
              />
              <button type="button" onClick={addCustomFeature} title="Ajouter" style={{padding:'10px 12px',border:'1px solid #e0e0e0',borderRadius:'8px',background:'#fff'}}>+
              </button>
            </div>
            {(form.features && form.features.length > 0) && (
              <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                {form.features.map((f) => (
                  <span key={f} style={{display:'inline-flex',alignItems:'center',gap:6,background:'#f5f7ff',color:'#3b4cca',border:'1px solid #e6ebff',borderRadius:'999px',padding:'6px 10px',fontSize:'.9rem'}}>
                    {f}
                    <button type="button" onClick={() => removeFeature(f)} style={{background:'none',border:'none',cursor:'pointer',color:'#8a8a8a'}}>×</button>
                  </span>
                ))}
              </div>
            )}
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
