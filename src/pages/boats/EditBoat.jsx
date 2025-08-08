import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import boatService from '../../services/boat.service';
import LoaderDots from '../../components/LoaderDots.jsx';
import OwnerHeader from '../../components/OwnerHeader.jsx';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronDown, faChevronRight, faSignOutAlt, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

const EditBoat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole, switchRole, logout } = useAuth();
  const [form, setForm] = useState({
    name: '',
    model: '',
    type: '',
    port: '',
    length: '',
    capacity: '',
    cabins: '',
    licenseRequired: false,
    status: 'disponible',
    description: '',
    price: '',
    image: null,
    imageUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [showDiscoverMenu, setShowDiscoverMenu] = useState(false);
  const [showBoatSubmenu, setShowBoatSubmenu] = useState(false);
  const [showDestinationsSubmenu, setShowDestinationsSubmenu] = useState(false);
  const [showModelsSubmenu, setShowModelsSubmenu] = useState(false);
  const [showAboutSubmenu, setShowAboutSubmenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const fetchBoat = async () => {
      setLoading(true);
      try {
        const data = await boatService.getBoatById(id);
        setForm({
          name: data.name || '',
          model: data.model || '',
          type: data.type || '',
          port: data.port || '',
          length: data.length || '',
          capacity: data.capacity || '',
          cabins: data.cabins || '',
          licenseRequired: data.licenseRequired || false,
          status: data.status || 'disponible',
          description: data.description || '',
          price: data.dailyPrice ? String(data.dailyPrice) : (data.price ? String(data.price) : ''),
          image: null,
          imageUrl: data.imageUrl || (data.photos && data.photos[0]) || '',
        });
        setImagePreview(data.imageUrl || (data.photos && data.photos[0]) || null);
      } catch (err) {
        setError("Erreur lors du chargement du bateau.");
      } finally {
        setLoading(false);
      }
    };
    fetchBoat();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
      if (files && files[0]) {
        setImagePreview(URL.createObjectURL(files[0]));
      } else {
        setImagePreview(form.imageUrl || null);
      }
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const validateForm = () => {
    if (!String(form.name).trim() || !String(form.model).trim() || !String(form.type).trim()) {
      setError('Tous les champs marqués * sont obligatoires.');
      return false;
    }
    if (form.length === '' || isNaN(Number(form.length)) || Number(form.length) <= 0) {
      setError('La longueur doit être un nombre positif.');
      return false;
    }
    if (form.capacity === '' || isNaN(Number(form.capacity)) || Number(form.capacity) <= 0) {
      setError('La capacité doit être un nombre positif.');
      return false;
    }
    if (form.cabins === '' || isNaN(Number(form.cabins)) || Number(form.cabins) < 0) {
      setError('Le nombre de cabines doit être 0 ou positif.');
      return false;
    }
    if (form.price === '' || isNaN(Number(form.price)) || Number(form.price) <= 0) {
      setError('Le prix doit être un nombre positif.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateForm()) return;
    setLoading(true);
    try {
      let imageUrl = form.imageUrl;
      if (form.image) {
        // Upload nouvelle image sur Firebase
        const imageRef = ref(storage, `boats/${Date.now()}_${form.image.name}`);
        await uploadBytes(imageRef, form.image);
        imageUrl = await getDownloadURL(imageRef);
      }
      const updateData = {
        name: form.name,
        model: form.model,
        port: form.port,
        type: form.type,
        length: Number(form.length),
        capacity: Number(form.capacity),
        cabins: Number(form.cabins),
        licenseRequired: Boolean(form.licenseRequired),
        status: form.status,
        description: form.description,
        dailyPrice: Number(form.price),
        photos: imageUrl ? [imageUrl] : [],
      };
      await boatService.updateBoat(id, updateData);
      setSuccess('Bateau modifié avec succès !');
      setTimeout(() => navigate('/owner/dashboard'), 1200);
    } catch (err) {
      setError("Erreur lors de la modification du bateau.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{marginTop: 40}}><LoaderDots text="Chargement du bateau..." /> </div>;

  return (
    <div style={{minHeight: '100vh', background: '#f7f8fa'}}>
      <OwnerHeader />
      <div className="secondary-nav">
        <div className="secondary-nav-container">
          <Link to="/owner/dashboard" className="nav-link">Tableau de bord</Link>
          <Link to="/boats" className="nav-link">Mes bateaux</Link>
          <Link to="/reservations" className="nav-link">Réservations</Link>
          <Link to="/revenus" className="nav-link">Revenus</Link>
          <Link to="/compte" className="nav-link">Mon compte</Link>
        </div>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: 'calc(100vh - 70px)', padding: '36px 0'}}>
        <div style={{background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px #0001', width: 480, maxWidth: '95vw', padding: '32px 36px', marginTop: 18}}>
          <h2 style={{textAlign: 'center', marginBottom: 26, color: '#4257b2'}}>Modifier mon bateau</h2>
          {/* Bloc image centré */}
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div style={{marginBottom: 26, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <label style={{fontWeight: 700, color: '#4257b2', fontSize: 16, marginBottom: 8, alignSelf: 'flex-start'}}>Photo du bateau</label>
              {!imagePreview ? (
                <div style={{border: '2px dashed #c5cae9', borderRadius: 8, width: 340, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f8fa', cursor: 'pointer', position: 'relative'}}>
                  <span style={{color: '#bbb', fontSize: 28}}>+</span>
                  <span style={{marginLeft: 16, color: '#7d8da6', fontSize: 15}}>Cliquez pour sélectionner une image<br/><span style={{fontSize: 12}}>PNG, JPG, JPEG, jusqu'à 10MB</span></span>
                  <input type="file" name="image" accept="image/*" onChange={handleChange} style={{position: 'absolute', opacity: 0, width: '100%', height: '100%', left: 0, top: 0, cursor: 'pointer'}} />
                </div>
              ) : (
                <>
                  <img src={imagePreview} alt="Prévisualisation" style={{maxWidth: 240, maxHeight: 130, borderRadius: 8, boxShadow: '0 1px 8px #bfc8e6'}} />
                  <button type="button" style={{marginTop: 8, background: 'none', border: 'none', color: '#4257b2', fontWeight: 600, cursor: 'pointer'}} onClick={() => { setForm({ ...form, image: null }); setImagePreview(form.imageUrl || null); }}>
                    Changer d'image
                  </button>
                </>
              )}
            </div>
            {/* Feedback erreur/succès */}
            {error && <div style={{color: '#d32f2f', fontWeight: 600, marginBottom: 16}}>{error}</div>}
            {success && <div style={{color: '#388e3c', fontWeight: 600, marginBottom: 16}}>{success}</div>}
            {/* Deux champs alignés */}
            <div style={{display: 'flex', gap: 14, marginBottom: 18}}>
              <div style={{flex: 1}}>
                <label style={{fontWeight: 500, color: '#222', fontSize: 15}}>Nom du bateau *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required style={{width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #c5cae9', marginTop: 6, fontSize: 15}} />
              </div>
              <div style={{flex: 1}}>
                <label style={{fontWeight: 500, color: '#222', fontSize: 15}}>Modèle *</label>
                <input type="text" name="model" value={form.model} onChange={handleChange} required placeholder="Ex: Oceanis 38.1" style={{width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #c5cae9', marginTop: 6, fontSize: 15}} />
              </div>
            </div>
            {/* Select type */}
            <div style={{marginBottom: 18}}>
              <label style={{fontWeight: 500, color: '#222', fontSize: 15}}>Type de bateau *</label>
              <select name="type" value={form.type} onChange={handleChange} required style={{width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #c5cae9', marginTop: 6, fontSize: 15}}>
                <option value="">Sélectionnez le type de bateau</option>
                <option value="voilier">Voilier</option>
                <option value="moteur">Moteur</option>
                <option value="catamaran">Catamaran</option>
              </select>
            </div>
            <div style={{marginBottom: 18}}>
              <label style={{fontWeight: 500, color: '#222', fontSize: 15}}>Port d’attache *</label>
              <input type="text" name="port" value={form.port} onChange={handleChange} required style={{width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #c5cae9', marginTop: 6, fontSize: 15}} />
            </div>
            {/* Description */}
            <div style={{marginBottom: 18}}>
              <label style={{fontWeight: 500, color: '#222', fontSize: 15}}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                style={{width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #c5cae9', marginTop: 6, fontSize: 15}}
              />
            </div>
            {/* Trois champs alignés */}
            <div style={{display: 'flex', gap: 14, marginBottom: 18}}>
              <div style={{flex: 1}}>
                <label style={{fontWeight: 500, color: '#222', fontSize: 15}}>Longueur (m) *</label>
                <input type="number" name="length" value={form.length} onChange={handleChange} required style={{width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #c5cae9', marginTop: 6, fontSize: 15}} />
              </div>
              <div style={{flex: 1}}>
                <label style={{fontWeight: 500, color: '#222', fontSize: 15}}>Capacité *</label>
                <input type="number" name="capacity" value={form.capacity} onChange={handleChange} required style={{width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #c5cae9', marginTop: 6, fontSize: 15}} />
              </div>
              <div style={{flex: 1}}>
                <label style={{fontWeight: 500, color: '#222', fontSize: 15}}>Cabines *</label>
                <input type="number" name="cabins" value={form.cabins} onChange={handleChange} required style={{width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #c5cae9', marginTop: 6, fontSize: 15}} />
              </div>
            </div>
            {/* Permis + statut */}
            <div style={{display: 'flex', gap: 14, marginBottom: 18}}>
              <div style={{flex: 1}}>
                <label style={{fontWeight: 500, color: '#222', fontSize: 15}}>Permis requis</label>
                <input type="checkbox" name="licenseRequired" checked={form.licenseRequired} onChange={handleChange} style={{marginLeft: 8}} />
              </div>
              <div style={{flex: 1}}>
                <label style={{fontWeight: 500, color: '#222', fontSize: 15}}>Statut</label>
                <select name="status" value={form.status} onChange={handleChange} style={{width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #c5cae9', marginTop: 6, fontSize: 15}}>
                  <option value="disponible">Disponible</option>
                  <option value="en location">En location</option>
                </select>
              </div>
            </div>
            {/* Prix */}
            <div style={{marginBottom: 18}}>
              <label style={{fontWeight: 500, color: '#222', fontSize: 15}}>Prix (€ / jour) *</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} required style={{width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #c5cae9', marginTop: 6, fontSize: 15}} />
            </div>
            <button type="submit" className="primary-button" style={{ marginTop: 16, width: '100%', fontSize: 17, padding: '12px 0', borderRadius: 8 }} disabled={loading}>
              {loading ? 'Modification...' : 'Enregistrer les modifications'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBoat;
