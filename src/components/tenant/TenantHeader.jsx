import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faSignOutAlt, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import logoBlc from '../../assets/images/logo-blc.png';
import profileImage from '../../assets/images/profil.jpg';
import '../../assets/css/SimpleDashboard.css';

/**
 * Header unifié pour toutes les pages tenant (locataire).
 * Affiche le logo, le menu utilisateur (profil, switch rôle, logout), et le menu secondaire.
 * Les liens actifs sont gérés par la page parente via "activeSection" (optionnel).
 */
const TenantHeader = ({ activeSection }) => {
  const { currentUser, logout, userRole, switchRole } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  return (
    <>
      {/* Header principal */}
      <header className="main-header">
        <div className="header-left">
          <div className="header-logo">
            <Link to="/">
              <img src={logoBlc} alt="Sailing Loc" />
            </Link>
          </div>
        </div>
        <div className="header-actions">
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
              <span>{currentUser?.displayName || currentUser?.name || currentUser?.email || 'Utilisateur'}</span>
              <FontAwesomeIcon icon={faChevronDown} />
            </div>
            {showUserMenu && (
              <div className="dropdown-menu user-menu">
                <Link to="/dashboard" className={`dropdown-item${activeSection === 'dashboard' ? ' active' : ''}`}>
                  <span>Tableau de bord</span>
                </Link>
                <Link to="/locations" className={`dropdown-item${activeSection === 'locations' ? ' active' : ''}`}>
                  <span>Mes locations</span>
                </Link>
                <Link to="/reviews" className={`dropdown-item${activeSection === 'reviews' ? ' active' : ''}`}>
                  <span>Mes avis</span>
                </Link>
                <Link to="/favorites" className={`dropdown-item${activeSection === 'favorites' ? ' active' : ''}`}>
                  <span>Mes favoris</span>
                </Link>
                <button className="dropdown-item role-switch" onClick={() => switchRole(userRole === 'owner' ? 'tenant' : 'owner')}>
                  <span>Passer en {userRole === 'owner' ? 'locataire' : 'propriétaire'}</span>
                  <FontAwesomeIcon icon={faExchangeAlt} />
                </button>
                <div className="dropdown-item logout-item" onClick={handleLogout}>
                  <span>Déconnexion</span>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* Navigation secondaire */}
      <div className="secondary-nav">
        <div className="secondary-nav-container">
          <Link to="/dashboard" className={`nav-link${activeSection === 'dashboard' ? ' active' : ''}`}>Tableau de bord</Link>
          <Link to="/locations" className={`nav-link${activeSection === 'locations' ? ' active' : ''}`}>Mes locations</Link>
          <Link to="/reviews" className={`nav-link${activeSection === 'reviews' ? ' active' : ''}`}>Mes avis</Link>
          <Link to="/favorites" className={`nav-link${activeSection === 'favorites' ? ' active' : ''}`}>Mes favoris</Link>
        </div>
      </div>
    </>
  );
};

export default TenantHeader;
