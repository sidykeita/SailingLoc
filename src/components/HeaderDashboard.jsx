import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/images/logo-SailingLOC-couleur.png';
import '../assets/css/Layout.css';
import '../assets/css/HeaderDashboard.css';

const HeaderDashboard = () => {
  const { currentUser, logout } = useAuth();
  return (
    <header className="site-header dashboard-header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="SailingLOC Logo" />
        </Link>
      </div>
      <div className="dashboard-header-right">
        <span className="dashboard-greeting">
          Bonjour, {currentUser?.name || currentUser?.email || 'Utilisateur'}
        </span>
        <button className="login-button dashboard-logout-btn" onClick={logout}>
          Déconnexion
        </button>
      </div>
    </header>
  );
};

export default HeaderDashboard;
