import React, { useState } from 'react';
import LoaderDots from '../../components/LoaderDots.jsx';
import boatService from '../../services/boat.service';
import { Link, useNavigate } from 'react-router-dom';
import OwnerHeader from '../../components/OwnerHeader.jsx';
import logoBlc from '../../assets/images/logo-blc.png';
import { useAuth } from '../../contexts/AuthContext';
import profileImage from '../../assets/images/profil.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronDown, faChevronRight, faSignOutAlt, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

console.log('AddBoat rendu');
const AddBoat = () => {
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
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const { currentUser, userRole, switchRole, logout } = useAuth();
  // États pour les menus du header propriétaire
  const [showDiscoverMenu, setShowDiscoverMenu] = useState(false);
  const [showBoatSubmenu, setShowBoatSubmenu] = useState(false);
  const [showDestinationsSubmenu, setShowDestinationsSubmenu] = useState(false);
  const [showModelsSubmenu, setShowModelsSubmenu] = useState(false);
  const [showAboutSubmenu, setShowAboutSubmenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
      if (files && files[0]) {
        setImagePreview(URL.createObjectURL(files[0]));
      } else {
        setImagePreview(null);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Validation stricte des champs obligatoires
  const validateForm = () => {
    console.log('DEBUG validateForm form:', form);
    if (!form.name.trim() || !form.type.trim() || !form.port.trim() || !form.length.trim() || !form.capacity.trim() || !form.cabins.trim() || form.licenseRequired === '' || !form.price.trim() || !form.image || typeof form.image !== 'object') {
      setError('Tous les champs marqués * sont obligatoires, y compris la photo.');
      return false;
    }
    if (isNaN(parseFloat(form.price))) {
      setError('Le prix doit être un nombre.');
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
      // 1. Upload image sur Firebase Storage
      try {
        console.log('Uploading to Firebase:', form.image);
        let imageUrl = '';
        if (form.image) {
          const imageRef = ref(storage, `boats/${Date.now()}_${form.image.name}`);
          await uploadBytes(imageRef, form.image);
          console.log('Firebase upload OK, getting URL...');
          imageUrl = await getDownloadURL(imageRef);
          console.log('Firebase URL:', imageUrl);
        }

        // 2. Construire l'objet à envoyer au backend (avec l'URL, pas le fichier)
        const boatData = {
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
          photos: imageUrl ? [imageUrl] : [] // <-- tableau d'URL(s) Firebase
        };
        console.log('Sending boatData to backend:', boatData);

        // 3. Appel API classique (JSON, PAS FormData)
        await boatService.createBoat(boatData);
        navigate('/owner/dashboard', { state: { success: 'Bateau ajouté avec succès !', tab: 'boats' } });
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Erreur lors de l'ajout du bateau.");
        console.error('Erreur ajout bateau:', err);
      } finally {
        setLoading(false);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Erreur lors de l'ajout du bateau.");
      console.error('Erreur ajout bateau:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight: '100vh', background: '#f7f8fa'}}>
      {/* Header propriétaire identique à OwnerDashboard */}
      <header className="main-header">
        <div className="header-left">
          <div className="header-logo">
            <img src={logoBlc} alt="Sailing Loc" />
          </div>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Où souhaitez-vous louer ?" />
          <button>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        <div className="header-actions">
          {/* Menu Découvrir */}
          <div className="dropdown">
            <div className="dropdown-toggle" onClick={() => setShowDiscoverMenu(!showDiscoverMenu)}>
              <span>Découvrir</span>
              <FontAwesomeIcon icon={faChevronDown} />
            </div>
            {showDiscoverMenu && (
              <div className="dropdown-menu discover-menu">
                <div className="dropdown-list">
                  <div className="dropdown-list-item has-submenu">
                    <div className="dropdown-item" onClick={() => setShowBoatSubmenu(!showBoatSubmenu)}>
                      Location de bateau <FontAwesomeIcon icon={faChevronRight} className="submenu-arrow" />
                    </div>
                    {showBoatSubmenu && (
                      <div className="submenu-container">
                        <Link to="/boats/motor" className="submenu-link">Bateaux à moteur</Link>
                        <Link to="/boats/sailing" className="submenu-link">Voiliers</Link>
                      </div>
                    )}
                  </div>
                  <div className="dropdown-list-item has-submenu">
                    <div className="dropdown-item" onClick={() => setShowDestinationsSubmenu(!showDestinationsSubmenu)}>
                      Meilleures destinations <FontAwesomeIcon icon={faChevronRight} className="submenu-arrow" />
                    </div>
                    {showDestinationsSubmenu && (
                      <div className="submenu-container">
                        <Link to="/destinations/la-rochelle" className="submenu-link">La Rochelle</Link>
                        <Link to="/destinations/bastia" className="submenu-link">Bastia</Link>
                        <Link to="/destinations/porto-cristo" className="submenu-link">Porto Cristo</Link>
                      </div>
                    )}
                  </div>
                  <div className="dropdown-list-item has-submenu">
                    <div className="dropdown-item" onClick={() => setShowModelsSubmenu(!showModelsSubmenu)}>
                      Modèles Populaires <FontAwesomeIcon icon={faChevronRight} className="submenu-arrow" />
                    </div>
                    {showModelsSubmenu && (
                      <div className="submenu-container">
                        <Link to="/models/beneteau" className="submenu-link">Beneteau</Link>
                        <Link to="/models/jeanneau" className="submenu-link">Jeanneau</Link>
                        <Link to="/models/lagoon" className="submenu-link">Lagoon</Link>
                      </div>
                    )}
                  </div>
                  <div className="dropdown-list-item">
                    <Link to="/add-boat" className="dropdown-item">Ajouter mon bateau</Link>
                  </div>
                  <div className="dropdown-list-item">
                    <Link to="/help" className="dropdown-item">Aide</Link>
                  </div>
                  <div className="dropdown-list-item has-submenu">
                    <div className="dropdown-item" onClick={() => setShowAboutSubmenu(!showAboutSubmenu)}>
                      A propos <FontAwesomeIcon icon={faChevronRight} className="submenu-arrow" />
                    </div>
                    {showAboutSubmenu && (
                      <div className="submenu-container">
                        <Link to="/about/company" className="submenu-link">Notre entreprise</Link>
                        <Link to="/about/team" className="submenu-link">L'équipe</Link>
                        <Link to="/about/contact" className="submenu-link">Nous contacter</Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Menu utilisateur */}
          <div className="dropdown">
            <div className="user-dropdown" onClick={() => setShowUserMenu(!showUserMenu)}>
              <div className="flag-icon">
                <img src="/france-flag.svg" alt="Drapeau français" />
              </div>
              <div className="user-avatar">
                <img src={profileImage} alt="Photo de profil" onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentNode.textContent = 'Ce';
                }} />
              </div>
              <span>{currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Utilisateur'}</span>
              <FontAwesomeIcon icon={faChevronDown} />
            </div>
            {showUserMenu && (
              <div className="dropdown-menu user-menu">
                <Link to="/owner/dashboard" className="dropdown-item active">
                  <span>Tableau de bord</span>
                </Link>
                <Link to="/boats" className="dropdown-item">
                  <span>Mes bateaux</span>
                </Link>
                <Link to="/reservations" className="dropdown-item">
                  <span>Réservations</span>
                </Link>
                <Link to="/revenus" className="dropdown-item">
                  <span>Revenus</span>
                </Link>
                <Link to="/compte" className="dropdown-item">
                  <span>Mon compte</span>
                </Link>
                {/* Bouton de changement de rôle (optionnel dev) */}
                <div className="dropdown-item dev-mode-item" onClick={switchRole}>
                  <span>Changer de rôle ({userRole === 'owner' ? 'Propriétaire → Locataire' : 'Locataire → Propriétaire'})</span>
                  <FontAwesomeIcon icon={faExchangeAlt} />
                </div>
                <div className="dropdown-item logout-item" onClick={handleLogout}>
                  <span>Déconnexion</span>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="secondary-nav">
        <div className="secondary-nav-container">
          <Link to="/owner/dashboard" className="nav-link">Tableau de bord</Link>
          <Link to="/boats" className="nav-link">Mes bateaux</Link>
          <Link to="/reservations" className="nav-link">Réservations</Link>
          <Link to="/revenus" className="nav-link">Revenus</Link>
          <Link to="/compte" className="nav-link">Mon compte</Link>
        </div>
      </div>
      {/* Formulaire centré */}
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: 'calc(100vh - 70px)', padding: '36px 0'}}>
        <div style={{background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px #0001', width: 480, maxWidth: '95vw', padding: '32px 36px', marginTop: 18}}>
          {loading ? (
  <LoaderDots text="Ajout du bateau en cours..." />
) : (
<form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Bloc image centré */}
            <div style={{marginBottom: 26, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <label style={{fontWeight: 700, color: '#4257b2', fontSize: 16, marginBottom: 8, alignSelf: 'flex-start'}}>Photo du bateau *</label>
              {!imagePreview ? (
                <div style={{border: '2px dashed #c5cae9', borderRadius: 8, width: 340, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f8fa', cursor: 'pointer', position: 'relative'}}>
                  <span style={{color: '#bbb', fontSize: 28}}>+</span>
                  <span style={{marginLeft: 16, color: '#7d8da6', fontSize: 15}}>Cliquez pour sélectionner une image<br/><span style={{fontSize: 12}}>PNG, JPG, JPEG, jusqu'à 10MB</span></span>
                  <input type="file" name="image" accept="image/*" onChange={handleChange} style={{position: 'absolute', opacity: 0, width: '100%', height: '100%', left: 0, top: 0, cursor: 'pointer'}} />
                </div>
              ) : (
                <>
                  <img src={imagePreview} alt="Prévisualisation" style={{maxWidth: 240, maxHeight: 130, borderRadius: 8, boxShadow: '0 1px 8px #bfc8e6'}} />
                  <button type="button" style={{marginTop: 8, background: 'none', border: 'none', color: '#4257b2', fontWeight: 600, cursor: 'pointer'}} onClick={() => { setForm({ ...form, image: null }); setImagePreview(null); }}>
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
                <input type="text" name="model" value={form.model} onChange={handleChange} placeholder="Ex: Oceanis 38.1" style={{width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #c5cae9', marginTop: 6, fontSize: 15}} />
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
            {/* Port d'attache */}
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
                placeholder="Décrivez votre bateau, ses atouts, équipements, etc."
              />
            </div>
            {/* Permis nécessaire */}
            <div style={{marginBottom: 18}}>
              <label style={{fontWeight: 500, color: '#222', fontSize: 15}}>Permis nécessaire *</label>
              <div style={{display: 'flex', gap: 16, alignItems: 'center', marginTop: 6}}>
                <label style={{display: 'flex', alignItems: 'center', gap: 6}}>
                  <input
                    type="radio"
                    name="licenseRequired"
                    checked={form.licenseRequired === true}
                    onChange={() => setForm({ ...form, licenseRequired: true })}
                  />
                  Oui
                </label>
                <label style={{display: 'flex', alignItems: 'center', gap: 6}}>
                  <input
                    type="radio"
                    name="licenseRequired"
                    checked={form.licenseRequired === false}
                    onChange={() => setForm({ ...form, licenseRequired: false })}
                  />
                  Non
                </label>
              </div>
            </div>

            {/* Trois champs sur la même ligne */}
            <div style={{display: 'flex', gap: 14, marginBottom: 18}}>
              <div style={{flex: 1}}>
                <label style={{fontWeight: 500, color: '#222', fontSize: 15}}>Longueur (pieds) *</label>
                <input type="number" name="length" value={form.length} onChange={handleChange} required style={{width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #c5cae9', marginTop: 6, fontSize: 15}} />
              </div>
              <div style={{flex: 1}}>
                <label style={{fontWeight: 500, color: '#222', fontSize: 15}}>Capacité (personnes) *</label>
                <input type="number" name="capacity" value={form.capacity} onChange={handleChange} required style={{width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #c5cae9', marginTop: 6, fontSize: 15}} />
              </div>
              <div style={{flex: 1}}>
                <label style={{fontWeight: 500, color: '#222', fontSize: 15}}>Cabines *</label>
                <input type="number" name="cabins" value={form.cabins} onChange={handleChange} required style={{width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #c5cae9', marginTop: 6, fontSize: 15}} />
              </div>
              <div style={{flex: 1}}>
                <label style={{fontWeight: 500, color: '#222', fontSize: 15}}>Prix par jour (€) *</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} required style={{width: '100%', padding: '10px', borderRadius: 6, border: '1px solid #c5cae9', marginTop: 6, fontSize: 15}} />
              </div>
            </div>
            {/* Boutons statut côte à côte */}
            <div style={{marginBottom: 18}}>
              <label style={{fontWeight: 500, color: '#222', fontSize: 15}}>Statut du bateau *</label>
              <div style={{display: 'flex', gap: 12, marginTop: 6}}>
                <button
  type="button"
  style={{
    flex: 1,
    background: form.status === 'disponible' ? '#4257b2' : '#fff',
    color: form.status === 'disponible' ? '#fff' : '#4257b2',
    border: '1px solid #4257b2',
    borderRadius: 6,
    padding: '10px 0',
    fontWeight: 600,
    fontSize: 15,
    cursor: 'pointer'
  }}
  onClick={() => setForm({ ...form, status: 'disponible' })}
>
  Disponible
</button>
<button
  type="button"
  style={{
    flex: 1,
    background: form.status === 'en location' ? '#4257b2' : '#fff',
    color: form.status === 'en location' ? '#fff' : '#4257b2',
    border: '1px solid #4257b2',
    borderRadius: 6,
    padding: '10px 0',
    fontWeight: 600,
    fontSize: 15,
    cursor: 'pointer'
  }}
  onClick={() => setForm({ ...form, status: 'en location' })}
>
  En location
</button>
              </div>
            </div>
            {/* Bouton principal large */}
            <button type="submit" style={{width: '100%', background: '#4257b2', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 8, padding: '12px 0', marginTop: 16, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1}} disabled={loading}>
              {loading ? 'Ajout en cours...' : 'Ajouter le bateau'}
            </button>
          </form>
)}
        </div>
      </div>
    </div>
  );
};

export default AddBoat;
