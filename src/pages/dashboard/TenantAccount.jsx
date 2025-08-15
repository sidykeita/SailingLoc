import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  faEye,
  faEyeSlash,
  faCreditCard,
  faShield,
  faBell,
  faGlobe,
  faCertificate,
  faAnchor,
  faLock,
  faWallet,
  faCheckCircle,
  faExclamationTriangle,
  faIdCard
} from '@fortawesome/free-solid-svg-icons';
import logoBlc from '../../assets/images/logo-blc.png';
import profileImage from '../../assets/images/profil.jpg';
import '../../assets/css/SimpleDashboard.css';
import '../../assets/css/TenantLocations.css';
import '../../assets/css/TenantAccount.css';

const TenantAccount = () => {
  const { currentUser, logout, userRole, switchRole } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDiscoverMenu, setShowDiscoverMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('modifier-informations');

  // User profile data
  const [userProfile, setUserProfile] = useState({
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    address: '123 Rue de la Mer, 13000 Marseille',
    birthDate: '1985-06-15',
    memberSince: '2023-03-15',
    totalRentals: 12,
    favoriteDestinations: ['Marseille', 'Cannes', 'Nice']
  });

  // Account settings
  const [accountSettings, setAccountSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    language: 'fr',
    currency: 'EUR',
    twoFactorAuth: false
  });

  useEffect(() => {
    // Check URL parameters for section
    const urlParams = new URLSearchParams(location.search);
    const sectionParam = urlParams.get('section');
    if (sectionParam) {
      setActiveSection(sectionParam);
    }
    
    // Simulate loading user data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [location.search]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

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

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'modifier-informations':
        return renderModifierInformations();
      case 'certifications':
        return renderCertifications();
      case 'cv-nautique':
        return renderCVNautique();
      case 'notifications':
        return renderNotifications();
      case 'informations-bancaires':
        return renderInformationsBancaires();
      case 'securite':
        return renderSecurite();
      case 'paiements':
        return renderPaiements();
      default:
        return renderModifierInformations();
    }
  };

  const renderModifierInformations = () => (
    <div className="account-section">
      {/* Profile Header Section */}
      <div className="profile-header">
        <div className="profile-avatar-container">
          <div className="profile-avatar">
            <div className="avatar-initials">C</div>
            <div className="avatar-overlay">
              <FontAwesomeIcon icon={faEdit} />
            </div>
          </div>
          <button className="change-photo-btn">
            + Ajouter une photo
          </button>
        </div>
        
        <div className="profile-info">
          <div className="profile-title-section">
            <h2 className="profile-name">Celine</h2>
            <p className="profile-member-since">Membre depuis 2025</p>
          </div>
          <div className="profile-description-section">
            <p className="profile-description">Une photo de vous permet de rendre les échanges plus humains :)</p>
          </div>
        </div>
      </div>
      
      <div className="profile-form">
        <div className="form-row">
          <div className="form-group">
            <label>Prénom</label>
            <input
              type="text"
              value={userProfile.firstName}
              onChange={(e) => setUserProfile({...userProfile, firstName: e.target.value})}
              disabled={!editMode}
            />
          </div>
          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              value={userProfile.lastName}
              onChange={(e) => setUserProfile({...userProfile, lastName: e.target.value})}
              disabled={!editMode}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={userProfile.email}
              onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
              disabled={!editMode}
            />
          </div>
          <div className="form-group">
            <label>Téléphone</label>
            <input
              type="tel"
              value={userProfile.phone}
              onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
              disabled={!editMode}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Adresse</label>
          <input
            type="text"
            value={userProfile.address}
            onChange={(e) => setUserProfile({...userProfile, address: e.target.value})}
            disabled={!editMode}
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Date de naissance</label>
            <input
              type="date"
              value={userProfile.birthDate}
              onChange={(e) => setUserProfile({...userProfile, birthDate: e.target.value})}
              disabled={!editMode}
            />
          </div>
          <div className="form-group">
            <label>Membre depuis</label>
            <input
              type="text"
              value={new Date(userProfile.memberSince).toLocaleDateString('fr-FR')}
              disabled
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            className="edit-btn"
            onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
          >
            <FontAwesomeIcon icon={editMode ? faSave : faEdit} />
            {editMode ? 'Enregistrer' : 'Modifier'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderCertifications = () => (
    <div className="account-section">
      <h2>Certifications</h2>
      <div className="certifications-list">
        <div className="certification-item">
          <div className="certification-info">
            <FontAwesomeIcon icon={faEnvelope} className="certification-icon" />
            <div>
              <h3>Adresse email</h3>
              <p>{userProfile.email}</p>
            </div>
          </div>
          <div className="certification-status verified">
            <FontAwesomeIcon icon={faCheckCircle} />
            <span>Vérifiée</span>
          </div>
          <button className="btn-secondary">Valider</button>
        </div>

        <div className="certification-item">
          <div className="certification-info">
            <FontAwesomeIcon icon={faPhone} className="certification-icon" />
            <div>
              <h3>Numéro de téléphone</h3>
              <p>{userProfile.phone}</p>
            </div>
          </div>
          <div className="certification-status pending">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <span>En attente</span>
          </div>
          <button className="btn-primary">Vérifier</button>
        </div>

        <div className="certification-item">
          <div className="certification-info">
            <FontAwesomeIcon icon={faIdCard} className="certification-icon" />
            <div>
              <h3>Carte d'identité</h3>
              <p>Document d'identité officiel</p>
            </div>
          </div>
          <div className="certification-status pending">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <span>Non vérifiée</span>
          </div>
          <button className="btn-primary">Vérifier</button>
        </div>
      </div>
    </div>
  );

  const renderCVNautique = () => (
    <div className="account-section">
      <h2>CV Nautique</h2>
      <div className="cv-nautique-form">
        <div className="form-row">
          <div className="form-group">
            <label>Expérience sur bateau à moteur *</label>
            <div className="radio-group">
              <label className="radio-option">
                <input type="radio" name="motorBoatExp" value="debutant" />
                <span>Débutant</span>
              </label>
              <label className="radio-option">
                <input type="radio" name="motorBoatExp" value="intermediaire" />
                <span>Intermédiaire</span>
              </label>
              <label className="radio-option">
                <input type="radio" name="motorBoatExp" value="experimente" />
                <span>Expérimenté</span>
              </label>
              <label className="radio-option">
                <input type="radio" name="motorBoatExp" value="skipper-pro" />
                <span>Skipper Pro</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Expérience sur un voilier *</label>
            <div className="radio-group">
              <label className="radio-option">
                <input type="radio" name="sailBoatExp" value="debutant" />
                <span>Débutant</span>
              </label>
              <label className="radio-option">
                <input type="radio" name="sailBoatExp" value="intermediaire" />
                <span>Intermédiaire</span>
              </label>
              <label className="radio-option">
                <input type="radio" name="sailBoatExp" value="experimente" />
                <span>Expérimenté</span>
              </label>
              <label className="radio-option">
                <input type="radio" name="sailBoatExp" value="skipper-pro" />
                <span>Skipper Pro</span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Permis Bateau *</label>
          <div className="checkbox-group">
            <label className="checkbox-option">
              <input type="checkbox" />
              <span>Côtier</span>
            </label>
            <label className="checkbox-option">
              <input type="checkbox" />
              <span>Fluvial / Eaux intérieures</span>
            </label>
            <label className="checkbox-option">
              <input type="checkbox" />
              <span>Hauturier</span>
            </label>
            <label className="checkbox-option">
              <input type="checkbox" />
              <span>CRR (certificat restreint de radiotéléphoniste)</span>
            </label>
            <label className="checkbox-option">
              <input type="checkbox" />
              <span>Skipper professionnel</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Autres *</label>
          <div className="checkbox-group">
            <label className="checkbox-option">
              <input type="checkbox" />
              <span>J'ai déjà loué auprès d'un professionnel</span>
            </label>
            <label className="checkbox-option">
              <input type="checkbox" />
              <span>J'ai déjà loué auprès d'un particulier</span>
            </label>
            <label className="checkbox-option">
              <input type="checkbox" />
              <span>Je suis propriétaire</span>
            </label>
            <label className="checkbox-option">
              <input type="checkbox" />
              <span>J'ai été propriétaire</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Quelles sont vos expériences de navigation ? *</label>
          <textarea 
            placeholder="Années d'expériences, types de bateaux utilisés, postes occupés, zones de navigations pratiquées..."
            rows="4"
          ></textarea>
        </div>

        <button className="btn-primary">Sauvegarder mes modifications</button>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="account-section">
      <h2>Notifications</h2>
      <div className="notification-settings">
        <div className="notification-item">
          <div className="notification-info">
            <h3>Notifications par email</h3>
            <p>Recevez des mises à jour sur vos réservations</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={accountSettings.emailNotifications}
              onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="notification-item">
          <div className="notification-info">
            <h3>Notifications SMS</h3>
            <p>Recevez des alertes importantes par SMS</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={accountSettings.smsNotifications}
              onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        
        <div className="notification-item">
          <div className="notification-info">
            <h3>Emails marketing</h3>
            <p>Recevez nos offres et nouveautés</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={accountSettings.marketingEmails}
              onChange={(e) => handleSettingChange('marketingEmails', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderInformationsBancaires = () => (
    <div className="account-section">
      <h2>Mes informations bancaires</h2>
      <div className="banking-info">
        <div className="info-card">
          <FontAwesomeIcon icon={faCreditCard} className="card-icon" />
          <div>
            <h3>Carte de crédit</h3>
            <p>Aucune carte enregistrée</p>
          </div>
          <button className="btn-primary">Ajouter une carte</button>
        </div>
        
        <div className="info-card">
          <FontAwesomeIcon icon={faWallet} className="card-icon" />
          <div>
            <h3>Compte bancaire</h3>
            <p>Aucun compte enregistré</p>
          </div>
          <button className="btn-primary">Ajouter un compte</button>
        </div>
      </div>
    </div>
  );

  const renderSecurite = () => (
    <div className="account-section">
      <h2>Sécurité</h2>
      <div className="security-options">
        <div className="security-item">
          <div className="security-info">
            <h3>Mot de passe</h3>
            <p>Dernière modification il y a 3 mois</p>
          </div>
          <button className="btn-secondary">Modifier</button>
        </div>
        
        <div className="security-item">
          <div className="security-info">
            <h3>Email de connexion</h3>
            <p>{userProfile.email}</p>
          </div>
          <button className="btn-secondary">Modifier</button>
        </div>
        
        <div className="security-item">
          <div className="security-info">
            <h3>Authentification à deux facteurs</h3>
            <p>Sécurisez votre compte avec un code de vérification</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={accountSettings.twoFactorAuth}
              onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderPaiements = () => (
    <div className="account-section">
      <h2>Mes paiements</h2>
      <div className="payments-history">
        <div className="payments-header">
          <h3>Historique des paiements</h3>
          <select className="filter-select">
            <option>Tous les paiements</option>
            <option>30 derniers jours</option>
            <option>3 derniers mois</option>
            <option>Cette année</option>
          </select>
        </div>
        
        <div className="payments-list">
          <div className="payment-item">
            <div className="payment-info">
              <h4>Location - Voilier Oceanis 40</h4>
              <p>15 mars 2024</p>
            </div>
            <div className="payment-amount">
              <span className="amount">450,00 €</span>
              <span className="status completed">Payé</span>
            </div>
          </div>
          
          <div className="payment-item">
            <div className="payment-info">
              <h4>Location - Catamaran Lagoon 42</h4>
              <p>8 février 2024</p>
            </div>
            <div className="payment-amount">
              <span className="amount">780,00 €</span>
              <span className="status completed">Payé</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Chargement de votre compte...</p>
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
                Découvrir
                <FontAwesomeIcon 
                  icon={showDiscoverMenu ? faChevronDown : faChevronRight} 
                  className="nav-icon" 
                />
              </button>
              {showDiscoverMenu && (
                <div className="dropdown-menu">
                  <Link to="/boats/motor" className="dropdown-item">Bateaux à moteur</Link>
                  <Link to="/boats/sailing" className="dropdown-item">Voiliers</Link>
                  <Link to="/destinations" className="dropdown-item">Destinations</Link>
                </div>
              )}
            </div>
            
            <Link to="/contact" className="nav-button">Contact</Link>
            <Link to="/help" className="nav-button">Aide</Link>
          </nav>
        </div>
        
        <div className="header-right">
          <div className="user-menu dropdown">
            <button 
              className="user-button"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <img src={profileImage} alt="Profil" className="user-avatar" />
              <span className="user-name">{currentUser?.firstName || 'Utilisateur'}</span>
              <FontAwesomeIcon 
                icon={showUserMenu ? faChevronDown : faChevronRight} 
                className="nav-icon" 
              />
            </button>
            
            {showUserMenu && (
              <div className="dropdown-menu user-dropdown">
                <Link to="/dashboard" className="dropdown-item">
                  <span>Tableau de bord</span>
                </Link>
                <Link to="/locations" className="dropdown-item">
                  <span>Mes locations</span>
                </Link>

                <Link to="/account" className="dropdown-item active">
                  <span>Mon compte</span>
                </Link>
                <Link to="/favorites" className="dropdown-item">
                  <span>Mes favoris</span>
                </Link>
                <div className="dropdown-divider"></div>
                {userRole === 'tenant' && (
                  <button onClick={() => switchRole('owner')} className="dropdown-item switch-role">
                    <FontAwesomeIcon icon={faExchangeAlt} />
                    <span>Passer en propriétaire</span>
                  </button>
                )}
                <button onClick={handleLogout} className="dropdown-item logout">
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  <span>Se déconnecter</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation secondaire */}
      <div className="secondary-nav">
        <div className="secondary-nav-container">
          <Link to="/dashboard" className="nav-link">Tableau de bord</Link>
          <Link to="/locations" className="nav-link">Mes locations</Link>

          <Link to="/account" className="nav-link active">Mon compte</Link>
          <Link to="/reviews" className="nav-link">Mes avis</Link>
          <Link to="/favorites" className="nav-link">Mes favoris</Link>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="dashboard-container">
        <div className="locations-page">
          <div className="page-header">
            <h1>Mon compte</h1>
          </div>
          <div className="account-layout">
            {/* Left Sidebar Navigation */}
            <div className="account-sidebar">
              <div className="sidebar-nav">
                <button 
                  className={`nav-item ${activeSection === 'modifier-informations' ? 'active' : ''}`}
                  onClick={() => setActiveSection('modifier-informations')}
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span>Modifier mes informations</span>
                </button>
                
                <button 
                  className={`nav-item ${activeSection === 'certifications' ? 'active' : ''}`}
                  onClick={() => setActiveSection('certifications')}
                >
                  <FontAwesomeIcon icon={faCertificate} />
                  <span>Certifications</span>
                </button>
                
                <button 
                  className={`nav-item ${activeSection === 'cv-nautique' ? 'active' : ''}`}
                  onClick={() => setActiveSection('cv-nautique')}
                >
                  <FontAwesomeIcon icon={faAnchor} />
                  <span>CV Nautique</span>
                </button>
                
                <button 
                  className={`nav-item ${activeSection === 'notifications' ? 'active' : ''}`}
                  onClick={() => setActiveSection('notifications')}
                >
                  <FontAwesomeIcon icon={faBell} />
                  <span>Mes notifications</span>
                </button>
                
                <button 
                  className={`nav-item ${activeSection === 'informations-bancaires' ? 'active' : ''}`}
                  onClick={() => setActiveSection('informations-bancaires')}
                >
                  <FontAwesomeIcon icon={faCreditCard} />
                  <span>Mes informations bancaires</span>
                </button>
                
                <button 
                  className={`nav-item ${activeSection === 'securite' ? 'active' : ''}`}
                  onClick={() => setActiveSection('securite')}
                >
                  <FontAwesomeIcon icon={faShield} />
                  <span>Sécurité</span>
                </button>
                
                <button 
                  className={`nav-item ${activeSection === 'paiements' ? 'active' : ''}`}
                  onClick={() => setActiveSection('paiements')}
                >
                  <FontAwesomeIcon icon={faWallet} />
                  <span>Mes paiements</span>
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="account-main-content">
              {renderActiveSection()}
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

export default TenantAccount;
