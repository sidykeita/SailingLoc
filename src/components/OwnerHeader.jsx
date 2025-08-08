import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoBlc from '../assets/images/logo-blc.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const OwnerHeader = () => {
  const [showDiscoverMenu, setShowDiscoverMenu] = useState(false);
  const [showBoatSubmenu, setShowBoatSubmenu] = useState(false);
  const [showDestinationsSubmenu, setShowDestinationsSubmenu] = useState(false);
  const [showModelsSubmenu, setShowModelsSubmenu] = useState(false);
  const navigate = useNavigate();

  return (
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
              </div>
            </div>
          )}
        </div>
        {/* ... autres actions header si besoin ... */}
      </div>
    </header>
  );
};

export default OwnerHeader;
