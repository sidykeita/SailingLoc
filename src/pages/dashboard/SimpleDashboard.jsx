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
  
  // Style pour le bouton orange
  const orangeButtonStyle = {
    backgroundColor: '#ff6600',
    color: 'white',
    border: 'none',
    backgroundImage: 'none',
    background: '#ff6600'
  };
  
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
              <span>celine</span>
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

                <Link to="/reviews" className="dropdown-item">
                  <span>Mes avis</span>
                </Link>
                <Link to="/favorites" className="dropdown-item">
                  <span>Mes favoris</span>
                </Link>

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
          <Link to="/dashboard" className="nav-link active">Tableau de bord</Link>
          <Link to="/locations" className="nav-link">Mes locations</Link>
          <Link to="/reviews" className="nav-link">Mes avis</Link>
          <Link to="/favorites" className="nav-link">Mes favoris</Link>
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
          
          <h2 className="profile-name">celine</h2>
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
            <Link to="/account?section=modifier-informations" className="btn btn-primary" style={orangeButtonStyle}>Compléter mon profil</Link>
            <Link to="/account?section=modifier-informations" className="btn btn-outline">Voir mon profil</Link>
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
          
          {/* Liens utiles Section */}
          <div className="useful-links-section">
            <h4 className="useful-links-title">Liens utiles</h4>
            <div className="useful-links-list">
              <Link to="/help" className="useful-link-item">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>Aide générale</span>
              </Link>
              <Link to="/contact" className="useful-link-item">
                <FontAwesomeIcon icon={faEnvelope} />
                <span>Contact</span>
              </Link>
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
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              <p>Note : 4.8 / 5 calculée à partir de 5 000 avis</p>
              <a href="#" className="text-coral hover:underline mt-2 inline-block">Avis de notre communauté</a>
            </div>
            
            <div>
              <h3 className="font-montserrat font-bold text-lg mb-4">CONTACT</h3>
              <p className="mb-2">Besoin de conseils ?</p>
              <p className="mb-2">Nous sommes joignables :</p>
              <p className="mb-1">Du lundi au vendredi : 8h00 à 20h00</p>
              <p className="mb-2">Samedi et Dimanche : 10h00 à 18h00</p>
              <a href="mailto:contact@sailingloc.com" className="flex items-center text-coral hover:underline">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                contact@sailingloc.com
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-blue-700 text-center">
            <p>&copy; 2025 SailingLoc. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
      
      {/* Help Button */}
      <div className="help-button">
        <FontAwesomeIcon icon={faQuestionCircle} />
      </div>
    </div>
  );
};

export default SimpleDashboard;