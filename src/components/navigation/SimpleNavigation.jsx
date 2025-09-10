import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faChevronDown, faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';

const SimpleNavigation = () => {
  const { currentUser, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="logo">
          <Link to="/">
            <img src="/logo-SailingLOC-couleur.png" alt="SAILING.LOC" className="h-10" />
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-6 items-center">
            <li><Link to="/" className="text-blue-800 hover:text-blue-600">Accueil</Link></li>
            <li><Link to="/boats/motor" className="text-blue-800 hover:text-blue-600">Bateaux à moteur</Link></li>
            <li><Link to="/boats/sailing" className="text-blue-800 hover:text-blue-600">Voiliers</Link></li>
            <li><Link to="/about" className="text-blue-800 hover:text-blue-600">À propos</Link></li>
            <li><Link to="/contact" className="text-blue-800 hover:text-blue-600">Contact</Link></li>
            
            {currentUser ? (
              <li className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center text-blue-800 hover:text-blue-600 focus:outline-none"
                >
                  <FontAwesomeIcon icon={faUserCircle} className="text-2xl mr-1" />
                  <FontAwesomeIcon icon={faChevronDown} className="text-xs ml-1" />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      Mon profil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </li>
            ) : (
              <li>
                <Link to="/login" className="text-blue-800 hover:text-blue-600">
                  <FontAwesomeIcon icon={faUser} />
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default SimpleNavigation;
