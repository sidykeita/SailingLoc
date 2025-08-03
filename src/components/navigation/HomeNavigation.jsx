import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronDown, 
  faChevronRight, 
  faUser 
} from '@fortawesome/free-solid-svg-icons';
import '../../assets/css/Home.css';

// Import des images
import logo from '../../assets/images/logo-blc.png';
import logoColor from '../../assets/images/logo-SailingLOC-couleur.png';

const HomeNavigation = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBoatSubmenu, setShowBoatSubmenu] = useState(false);
  const [showDestinationsSubmenu, setShowDestinationsSubmenu] = useState(false);
  const [showModelsSubmenu, setShowModelsSubmenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fermer les menus lorsqu'on clique ailleurs sur la page
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown')) {
        setShowDropdown(false);
        setShowBoatSubmenu(false);
        setShowDestinationsSubmenu(false);
        setShowModelsSubmenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <header className={`home-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="logo">
        <img src={scrolled ? logoColor : logo} alt="SAILING.LOC" />
      </div>
      <nav className="main-nav">
        <ul>
          <li className="dropdown">
            <div 
              className="dropdown-toggle" 
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Découvrir <FontAwesomeIcon icon={faChevronDown} className="dropdown-arrow" />
            </div>
            {showDropdown && (
              <div className="dropdown-menu">
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
                    <Link to="/add-boat" className="dropdown-item">Ajouter mon bateau</Link>
                  </div>
                </div>
              </div>
            )}
          </li>
          <li><Link to="/">Accueil</Link></li>
          <li><Link to="/about">À propos</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/login" className="user-icon"><FontAwesomeIcon icon={faUser} /></Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default HomeNavigation;
