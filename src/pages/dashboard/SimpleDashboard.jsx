import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../assets/css/SimpleDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronDown, faEnvelope, faMobileAlt, faIdCard, faFileAlt, faQuestionCircle, faChevronRight, faSignOutAlt, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import logoBlc from '../../assets/images/logo-blc.png';
import profileImage from '../../assets/images/profil.jpg';

const SimpleDashboard = () => {
  const { currentUser, logout, userRole, switchRole } = useAuth();
  const today = new Date();
  const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()} ${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;
  
  // États pour gérer l'affichage des menus déroulants
  const [showDiscoverMenu, setShowDiscoverMenu] = useState(false);
  const [showBoatSubmenu, setShowBoatSubmenu] = useState(false);
  const [showDestinationsSubmenu, setShowDestinationsSubmenu] = useState(false);
  const [showModelsSubmenu, setShowModelsSubmenu] = useState(false);
  const [showAboutSubmenu, setShowAboutSubmenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    try {
      await logout();
      // La redirection sera gérée par le contexte d'authentification
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };
  
  return (
    <div>
      {/* Header */}
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
          <div className="dropdown">
            <div className="dropdown-toggle" onClick={() => setShowDiscoverMenu(!showDiscoverMenu)}>
              <span>Découvrir</span>
              <FontAwesomeIcon icon={faChevronDown} />
            </div>
            {showDiscoverMenu && (
              <div className="dropdown-menu discover-menu">
                <div className="dropdown-list">
                  <div className="dropdown-list-item has-submenu">
                    <div 
                      className="dropdown-item" 
                      onClick={() => setShowBoatSubmenu(!showBoatSubmenu)}
                    >
                      Modèle location de bateau <FontAwesomeIcon icon={faChevronRight} className="submenu-arrow" />
                    </div>
                    {showBoatSubmenu && (
                      <div className="submenu-container">
                        <Link to="/boats/motor" className="submenu-link">Bateaux à moteur</Link>
                        <Link to="/boats/sailing" className="submenu-link">Voiliers</Link>
                      </div>
                    )}
                  </div>
                  <div className="dropdown-list-item has-submenu">
                    <div 
                      className="dropdown-item" 
                      onClick={() => setShowDestinationsSubmenu(!showDestinationsSubmenu)}
                    >
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
                    <div 
                      className="dropdown-item" 
                      onClick={() => setShowModelsSubmenu(!showModelsSubmenu)}
                    >
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
                    <div 
                      className="dropdown-item" 
                      onClick={() => setShowAboutSubmenu(!showAboutSubmenu)}
                    >
                      A propos <FontAwesomeIcon icon={faChevronRight} className="submenu-arrow" />
                    </div>
                    {showAboutSubmenu && (
                      <div className="submenu-container">
                        <Link to="/about" className="submenu-link">À propos</Link>
                        <Link to="/about/reviews" className="submenu-link">Avis</Link>
                        <Link to="/help" className="submenu-link">Aide</Link>
                        <Link to="/contact" className="submenu-link">Contact</Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
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
              <span>{currentUser ? (currentUser.name || `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim()) : 'Utilisateur'}</span>
              <FontAwesomeIcon icon={faChevronDown} />
            </div>
            {showUserMenu && (
              <div className="dropdown-menu user-menu">
                <Link to="/dashboard" className="dropdown-item active">
                  <span>Tableau de bord</span>
                </Link>
                <Link to="/locations" className="dropdown-item">
                  <span>Mes locations</span>
                </Link>
                <Link to="/boats" className="dropdown-item">
                  <span>Mes bateaux</span>
                </Link>
                <Link to="/account" className="dropdown-item">
                  <span>Mon compte</span>
                </Link>
                <Link to="/reviews" className="dropdown-item">
                  <span>Mes avis</span>
                </Link>
                <Link to="/favorites" className="dropdown-item">
                  <span>Mes favoris</span>
                </Link>
                {/* Bouton de changement de rôle (uniquement pour le développement) */}
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

      {/* Menu de navigation secondaire */}
      <div className="secondary-nav">
        <div className="secondary-nav-container">
          <Link to="/dashboard" className="nav-link">Tableau de bord</Link>
          <Link to="/locations" className="nav-link">Mes locations</Link>
          <Link to="/bateaux" className="nav-link">Mes bateaux</Link>
          <Link to="/compte" className="nav-link active">Mon compte</Link>
          <Link to="/avis" className="nav-link">Mes avis</Link>
          <Link to="/favoris" className="nav-link">Mes favoris</Link>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-container">
        {/* User Profile Section */}
        <div className="user-profile">
          <div className="profile-avatar">
            <img src={profileImage} alt="Photo de profil" onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentNode.textContent = 'Ce';
            }} />
          </div>
          <a href="#" className="add-photo">+ Ajouter une photo</a>
          
          <h2 className="profile-name">{currentUser ? (currentUser.name || `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim()) : 'Utilisateur'}</h2>
          <p className="member-since">Membre depuis 2025</p>
          
          <div className="profile-completion">
            <div className="completion-text">
              <span>Profil complété à</span>
              <span>14%</span>
            </div>
            <div className="completion-bar">
              <div className="completion-progress"></div>
            </div>
          </div>
          
          <div className="profile-buttons">
            <a href="#" className="btn btn-primary">Compléter mon profil</a>
            <a href="#" className="btn btn-outline">Voir mon profil</a>
          </div>
          
          <div className="verification-list">
            <div className="verification-item">
              <FontAwesomeIcon icon={faEnvelope} /> {/* Icône */}
              <span>Adresse email</span>
              <a href="#">valider</a>
            </div>
            <div className="verification-item">
              <FontAwesomeIcon icon={faMobileAlt} /> {/* Icône */}
              <span>Numéro de téléphone</span>
              <a href="#">vérifier</a>
            </div>
            <div className="verification-item">
              <FontAwesomeIcon icon={faIdCard} /> {/* Icône */}
              <span>Carte d'identité</span>
              <a href="#">vérifier</a>
            </div>
            <div className="verification-item">
              <FontAwesomeIcon icon={faFileAlt} /> {/* Icône */}
              <span>CV Nautique</span>
              <a href="#">compléter</a>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="content-section">
          {/* Notifications Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Notifications</h3>
              <a href="#" className="card-action">Tout marquer comme lu</a>
            </div>
            <div className="card-body">
              <div className="notification-item">
                <div className="notification-icon">!</div>
                <div className="notification-content">
                  <p className="notification-text">Confirmez votre email et votre numéro de téléphone pour compléter votre profil</p>
                  <p className="notification-date">{formattedDate}</p>
                </div>
              </div>
              <div className="notification-item">
                <div className="notification-icon">!</div>
                <div className="notification-content">
                  <p className="notification-text">Renseignez votre date d'anniversaire pour recevoir un coupon de réduction !</p>
                  <p className="notification-date">{formattedDate}</p>
                </div>
              </div>
              <div className="notification-item">
                <div className="notification-icon">!</div>
                <div className="notification-content">
                  <p className="notification-text">Bienvenue sur Sailing Loc</p>
                  <p className="notification-date">{formattedDate}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Messages Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Mes derniers messages</h3>
            </div>
            <div className="card-body">
              <p className="message-empty">Vous n'avez pas de messages pour le moment</p>
            </div>
          </div>
          
          {/* Locations Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Locations à venir</h3>
            </div>
            <div className="card-body">
              <p className="location-empty">Aucune location à venir pour le moment</p>
            </div>
          </div>
          
          {/* Announcements Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Annonces</h3>
            </div>
            <div className="card-body">
              <div className="add-announcement">
                + Ajouter une annonce.
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Help Button */}
      <div className="help-button">
        <FontAwesomeIcon icon={faQuestionCircle} />
      </div>
    </div>
  );
};

export default SimpleDashboard;
