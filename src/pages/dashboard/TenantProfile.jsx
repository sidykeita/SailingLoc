import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faChevronDown, 
  faChevronRight, 
  faSignOutAlt, 
  faExchangeAlt,
  faUser,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faCalendar,
  faEdit,
  faSave,
  faCamera,
  faGlobe,
  faCheckCircle,
  faExclamationTriangle,
  faIdCard
} from '@fortawesome/free-solid-svg-icons';
import logoBlc from '../../assets/images/logo-blc.png';
import profileImage from '../../assets/images/profil.jpg';
import '../../assets/css/SimpleDashboard.css';
import '../../assets/css/TenantLocations.css';
import '../../assets/css/TenantProfile.css';

const TenantProfile = () => {
  const { currentUser, logout, userRole, switchRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showDiscoverMenu, setShowDiscoverMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // User profile data
  const [userProfile, setUserProfile] = useState({
    firstName: 'Timothy',
    lastName: 'Miafouna',
    email: 'timothy@email.com',
    phone: '+33 6 12 34 56 78',
    address: '123 Rue de la Mer, 13000 Marseille',
    birthDate: '1985-06-15',
    memberSince: '2025',
    languages: ['Français'],
    bio: '',
    profilePicture: profileImage
  });

  const [accountSettings, setAccountSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    language: 'fr',
    currency: 'EUR',
    twoFactorAuth: false
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleSaveProfile = () => {
    // Simulate API call
    setEditMode(false);
    console.log('Profile saved:', userProfile);
  };

  const handleSettingChange = (setting, value) => {
    setAccountSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserProfile(prev => ({
          ...prev,
          profilePicture: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Chargement de votre profil...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header className="main-header">
        <div className="header-left">
          <div className="header-logo">
            <img src={logoBlc} alt="Sailing Loc" />
          </div>
        </div>
        
        <div className="header-center">
          <nav className="main-nav">
            <div className="nav-item dropdown">
              <button 
                className="nav-button"
                onClick={() => setShowDiscoverMenu(!showDiscoverMenu)}
              >
                <span>Découvrir</span>
                <FontAwesomeIcon icon={showDiscoverMenu ? faChevronDown : faChevronRight} />
              </button>
              {showDiscoverMenu && (
                <div className="dropdown-menu">
                  <Link to="/boats">Tous les bateaux</Link>
                  <Link to="/destinations">Destinations</Link>
                  <Link to="/experiences">Expériences</Link>
                </div>
              )}
            </div>
            <Link to="/help" className="nav-button">Aide</Link>
          </nav>
        </div>

        <div className="header-right">
          <div className="search-container">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input type="text" placeholder="Rechercher..." />
          </div>
          
          <div className="user-menu dropdown">
            <button 
              className="user-button"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <img src={userProfile.profilePicture} alt="Profile" className="user-avatar" />
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
            {showUserMenu && (
              <div className="dropdown-menu user-dropdown">
                <div className="user-info">
                  <img src={userProfile.profilePicture} alt="Profile" />
                  <div>
                    <p className="user-name">{userProfile.firstName} {userProfile.lastName}</p>
                    <p className="user-role">{userRole === 'owner' ? 'Propriétaire' : 'Locataire'}</p>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <Link to="/profile" className="dropdown-item">
                  <FontAwesomeIcon icon={faUser} />
                  <span>Mon profil</span>
                </Link>
                <button 
                  className="dropdown-item role-switch"
                  onClick={() => switchRole(userRole === 'owner' ? 'tenant' : 'owner')}
                >
                  <FontAwesomeIcon icon={faExchangeAlt} />
                  <span>Passer en {userRole === 'owner' ? 'locataire' : 'propriétaire'}</span>
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout" onClick={logout}>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Se déconnecter</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Secondary Navigation */}
      <div className="secondary-nav">
        <div className="secondary-nav-container">
          <Link to="/dashboard" className="nav-link">Tableau de bord</Link>
          <Link to="/locations" className="nav-link">Mes locations</Link>
          <Link to="/account" className="nav-link">Mon compte</Link>
          <Link to="/reviews" className="nav-link">Mes avis</Link>
          <Link to="/favorites" className="nav-link">Mes favoris</Link>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="dashboard-container">
        <div className="profile-page">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link to="/dashboard">Accueil</Link>
            <FontAwesomeIcon icon={faChevronRight} />
            <span>Timothy</span>
          </div>

          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar-section">
              <div className="avatar-container">
                <img src={userProfile.profilePicture} alt="Profile" className="profile-avatar" />
                <div className="avatar-overlay">
                  <label htmlFor="profile-picture-input" className="camera-button">
                    <FontAwesomeIcon icon={faCamera} />
                  </label>
                  <input
                    id="profile-picture-input"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
              <button className="change-photo-btn">Changer de photo de profil</button>
              <p className="photo-help-text">
                Une photo de vous permet de rendre les échanges plus humains !
                Les logos d'entreprise ne sont pas autorisés.
              </p>
            </div>

            <div className="profile-info-section">
              <div className="profile-title">
                <h1>Bonjour, je m'appelle {userProfile.firstName}</h1>
                <p className="member-since">Membre depuis {userProfile.memberSince}</p>
              </div>

              <div className="profile-languages">
                <p><strong>Langues parlées :</strong> {userProfile.languages.join(', ')}</p>
              </div>

              <div className="profile-bio">
                <p>{userProfile.bio || `${userProfile.firstName} n'a pas encore reçu de commentaire`}</p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="profile-form-section">
            <div className="section-header">
              <h2>Modifier mes informations</h2>
              <button 
                className="edit-btn"
                onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
              >
                <FontAwesomeIcon icon={editMode ? faSave : faEdit} />
                {editMode ? 'Enregistrer' : 'Modifier'}
              </button>
            </div>

            <div className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom*</label>
                  <input
                    type="text"
                    value={userProfile.firstName}
                    onChange={(e) => setUserProfile({...userProfile, firstName: e.target.value})}
                    disabled={!editMode}
                  />
                </div>
                <div className="form-group">
                  <label>Nom*</label>
                  <input
                    type="text"
                    value={userProfile.lastName}
                    onChange={(e) => setUserProfile({...userProfile, lastName: e.target.value})}
                    disabled={!editMode}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Date de naissance*</label>
                <div className="date-inputs">
                  <select disabled={!editMode}>
                    <option>Jour</option>
                    {[...Array(31)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                  <select disabled={!editMode}>
                    <option>Mois</option>
                    <option value="1">Janvier</option>
                    <option value="2">Février</option>
                    <option value="3">Mars</option>
                    <option value="4">Avril</option>
                    <option value="5">Mai</option>
                    <option value="6">Juin</option>
                    <option value="7">Juillet</option>
                    <option value="8">Août</option>
                    <option value="9">Septembre</option>
                    <option value="10">Octobre</option>
                    <option value="11">Novembre</option>
                    <option value="12">Décembre</option>
                  </select>
                  <select disabled={!editMode}>
                    <option>Année</option>
                    {[...Array(80)].map((_, i) => {
                      const year = new Date().getFullYear() - 18 - i;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Sexe</label>
                <select disabled={!editMode}>
                  <option>Homme</option>
                  <option>Femme</option>
                  <option>Autre</option>
                </select>
              </div>

              <div className="form-group">
                <label>Nationalité*</label>
                <select disabled={!editMode}>
                  <option>Nationalité</option>
                  <option>Française</option>
                  <option>Belge</option>
                  <option>Suisse</option>
                  <option>Canadienne</option>
                  <option>Autre</option>
                </select>
              </div>

              <div className="form-section-title">
                <h3>Adresse</h3>
              </div>

              <div className="form-group">
                <label>Adresse*</label>
                <input
                  type="text"
                  value={userProfile.address}
                  onChange={(e) => setUserProfile({...userProfile, address: e.target.value})}
                  disabled={!editMode}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Code Postal*</label>
                  <input
                    type="text"
                    disabled={!editMode}
                  />
                </div>
                <div className="form-group">
                  <label>Ville*</label>
                  <input
                    type="text"
                    disabled={!editMode}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Pays*</label>
                <select disabled={!editMode}>
                  <option>France</option>
                  <option>Belgique</option>
                  <option>Suisse</option>
                  <option>Canada</option>
                  <option>Autre</option>
                </select>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="verification-section">
            <h3>Vérifications</h3>
            <div className="verification-items">
              <div className="verification-item">
                <div className="verification-info">
                  <FontAwesomeIcon icon={faEnvelope} className="verification-icon" />
                  <span>Adresse email à valider</span>
                </div>
                <div className="verification-status pending">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                </div>
              </div>

              <div className="verification-item">
                <div className="verification-info">
                  <FontAwesomeIcon icon={faPhone} className="verification-icon" />
                  <span>Numéro de téléphone à vérifier</span>
                </div>
                <div className="verification-status pending">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                </div>
              </div>

              <div className="verification-item">
                <div className="verification-info">
                  <FontAwesomeIcon icon={faIdCard} className="verification-icon" />
                  <span>Carte d'identité à vérifier</span>
                </div>
                <div className="verification-status pending">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                </div>
              </div>

              <div className="verification-item">
                <div className="verification-info">
                  <FontAwesomeIcon icon={faUser} className="verification-icon" />
                  <span>CV Nautique à compléter</span>
                </div>
                <div className="verification-status pending">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                </div>
              </div>

              <div className="verification-item">
                <div className="verification-info">
                  <FontAwesomeIcon icon={faUser} className="verification-icon" />
                  <span>Permis bateau à envoyer</span>
                </div>
                <div className="verification-status pending">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-primary text-white mt-12 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-montserrat font-bold text-lg mb-4">À PROPOS</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">À propos</a></li>
                <li><a href="#" className="hover:underline">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:underline">CGU</a></li>
                <li><a href="#" className="hover:underline">Mentions légales</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-montserrat font-bold text-lg mb-4">NOUS FAIRE CONFIANCE</h3>
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1">4.8/5 - 2,847 avis</span>
              </div>
              <p className="text-sm">Plus de 10,000 clients satisfaits</p>
            </div>
            
            <div>
              <h3 className="font-montserrat font-bold text-lg mb-4">CONTACT</h3>
              <div className="space-y-2">
                <p>📞 +33 4 91 00 00 00</p>
                <p>✉️ contact@sailingloc.com</p>
                <p>📍 Marseille, France</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-600 mt-8 pt-8 text-center">
            <p>&copy; 2025 SailingLoc. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TenantProfile;
