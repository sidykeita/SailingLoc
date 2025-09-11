import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/images/logo-SailingLOC-couleur.png';
import '../assets/css/Layout.css';
import '../assets/css/HeaderDashboard.css';

const HeaderDashboard = () => {
  const { currentUser, logout } = useAuth();
  const displayName = (() => {
    const full = [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ').trim();
    if (full) return full;
    if (currentUser?.name) return currentUser.name;
    if (currentUser?.email) return currentUser.email;
    return 'Utilisateur';
  })();
  return (
    <header className="site-header dashboard-header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="SailingLOC Logo" />
        </Link>
      </div>
      <div className="dashboard-header-right">
        { (currentUser?.role === 'propriétaire' || currentUser?.role === 'owner') && (
          <nav className="dashboard-nav" style={{ marginRight: 12 }}>
            <Link to="/owner/dashboard/reserver" className="dashboard-nav-link">Réservation propriétaire</Link>
            <Link to="/owner/dashboard/revenus" className="dashboard-nav-link">Revenus</Link>
          </nav>
        )}
        <span className="dashboard-greeting">Bonjour, {displayName}</span>
        <button className="login-button dashboard-logout-btn" onClick={logout}>
          Déconnexion
        </button>
      </div>
    </header>
  );
};

export default HeaderDashboard;
