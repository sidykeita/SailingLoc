// Ce composant est obsolète : la liste des bateaux du propriétaire est désormais intégrée dans OwnerDashboard.jsx
// (Fichier conservé uniquement pour référence ou suppression future)

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext"; // Chemin relatif à votre fichier AuthContext
import boatService from "../../services/boat.service"; // Chemin relatif à votre fichier boatService
import LoaderDots from "../../components/LoaderDots"; // Chemin relatif à votre composant LoaderDots

function MesBateaux() {
  const location = useLocation();
  const success = location.state?.success;
  const { currentUser } = useAuth();
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBoats = async () => {
      setLoading(true);
      setError('');
      try {
        // Appel API pour récupérer les bateaux du propriétaire connecté
        const res = await boatService.getMyBoats();
        setBoats(res || []);
      } catch (err) {
        setError("Erreur lors du chargement de vos bateaux.");
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?._id) fetchBoats();
  }, [currentUser]);

  return (
    <div style={{minHeight: '100vh', background: '#f7f8fa', padding: '36px 0'}}>
      <div style={{background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px #0001', width: 900, maxWidth: '98vw', margin: '0 auto', padding: '32px 36px'}}>
        <h2 style={{fontWeight: 700, color: '#4257b2', fontSize: 24, marginBottom: 24}}>Mes bateaux</h2>
        {success && (
          <div style={{color: '#388e3c', fontWeight: 600, marginBottom: 16}}>{success}</div>
        )}
        {loading ? (
          <LoaderDots text="Chargement de vos bateaux..." />
        ) : error ? (
          <div style={{ color: '#d32f2f', fontWeight: 600 }}>{error}</div>
        ) : boats.length === 0 ? (
          <div style={{ color: '#888', fontWeight: 500 }}>Aucun bateau trouvé.</div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            {boats.map(boat => (
              <div key={boat._id} style={{ background: '#f7f8fa', borderRadius: 10, boxShadow: '0 1px 6px #0001', width: 260, padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={boat.photos?.[0] || '/default-boat.jpg'} alt={boat.name} style={{ width: 200, height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }} />
                <div style={{ fontWeight: 700, color: '#4257b2', fontSize: 18 }}>{boat.name}</div>
                <div style={{ color: '#666', fontSize: 14, marginBottom: 6 }}>{boat.type} • {boat.model}</div>
                <div style={{ color: boat.status === 'disponible' ? '#388e3c' : '#d32f2f', fontWeight: 600, fontSize: 15, marginBottom: 6 }}>
                  {boat.status === 'disponible' ? 'Disponible' : 'En location'}
                </div>
                <div style={{ color: '#222', fontSize: 15 }}>Prix : <b>{boat.dailyPrice} €</b> / jour</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MesBateaux;
