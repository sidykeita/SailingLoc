import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faMapMarkerAlt, 
  faCalendarAlt, 
  faChevronDown, 
  faUser, 
  faStar, 
  faChevronUp, 
  faAngleDown, 
  faChevronRight,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

// Import des images
import logo from './assets/images/logo-blc.png';
import logoColor from './assets/images/logo-SailingLOC-couleur.png';
import facebookIcon from './assets/images/picto-facebook.png';
import instaIcon from './assets/images/picto-insta.png';
import tiktokIcon from './assets/images/picto-tiktok.png';
import mastercardIcon from './assets/images/mastercard.png';
import visaIcon from './assets/images/visa.png';
import applepayIcon from './assets/images/applepay.png';

// Import du CSS pour le layout
import './assets/css/Layout.css';

const Layout = ({ children }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBoatSubmenu, setShowBoatSubmenu] = useState(false);
  const [showDestinationsSubmenu, setShowDestinationsSubmenu] = useState(false);
  const [showModelsSubmenu, setShowModelsSubmenu] = useState(false);
  const [showAboutSubmenu, setShowAboutSubmenu] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    console.log("Menu mobile toggled: ", !mobileMenuOpen);
  };
  
  // Style inline pour le bouton hamburger
  const hamburgerStyle = {
    display: 'none',
    backgroundColor: '#274991',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 12px',
    fontSize: '16px',
    cursor: 'pointer',
    marginLeft: 'auto',
    '@media (max-width: 768px)': {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  };
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
      
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
  
  // Gestion du redimensionnement de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="layout-container">
      {/* Header */}
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="logo">
          <Link to="/">
            <img src={scrolled ? logoColor : logo} alt="SAILING.LOC" />
          </Link>
        </div>
        <button 
          onClick={toggleMobileMenu}
          style={{
            display: windowWidth <= 768 ? 'flex' : 'none',
            backgroundColor: '#274991',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 12px',
            fontSize: '16px',
            cursor: 'pointer',
            marginLeft: 'auto',
            alignItems: 'center',
            gap: '8px',
            position: 'fixed',
            right: '20px',
            top: '20px',
            zIndex: 9999
          }}
        >
          <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} /> 
          {mobileMenuOpen ? 'Fermer' : 'Menu'}
        </button>
        
        {/* Déplacé la navigation à droite et le bouton Mon compte à côté */}
        <div className="header-right">
          <nav className={`main-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <ul>
              <li className="mobile-account">
                <Link to="/login" className="login-button-mobile">
                  <FontAwesomeIcon icon={faUser} /> Mon compte
                </Link>
              </li>
              <li className="dropdown">
                <a 
                  href="#" 
                  className="dropdown-toggle" 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowDropdown(!showDropdown);
                  }}
                >
                  Découvrir <FontAwesomeIcon icon={faAngleDown} className="dropdown-arrow" />
                </a>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <div className="submenu-section">
                      <h3 
                        className="submenu-title"
                        onClick={() => setShowModelsSubmenu(!showModelsSubmenu)}
                      >
                        Location de bateau <FontAwesomeIcon icon={faAngleDown} />
                      </h3>
                      {showModelsSubmenu && (
                        <ul className="submenu-list">
                          <li className="submenu-item"><Link to="/boats">Tous les bateaux</Link></li>
                          <li className="submenu-item"><Link to="/boats/motor">Bateaux à moteur</Link></li>
                          <li className="submenu-item"><Link to="/boats/sailing">Voiliers</Link></li>
                          <li className="submenu-item"><Link to="/boats/yacht">Yachts</Link></li>
                          <li className="submenu-item"><Link to="/boats/catamaran">Catamarans</Link></li>
                          <li className="submenu-item"><Link to="/boats/semi-rigide">Semi-rigides</Link></li>
                        </ul>
                      )}
                    </div>
                    
                    <div className="submenu-section">
                      <h3 
                        className="submenu-title"
                        onClick={() => setShowDestinationsSubmenu(!showDestinationsSubmenu)}
                      >
                        Meilleures destinations <FontAwesomeIcon icon={faAngleDown} />
                      </h3>
                      {showDestinationsSubmenu && (
                        <ul className="submenu-list">
                          <li className="submenu-item"><Link to="/destinations/marseille">Marseille</Link></li>
                          <li className="submenu-item"><Link to="/destinations/porto-cristo">Porto Cristo</Link></li>
                          <li className="submenu-item"><Link to="/destinations/bastia">Bastia</Link></li>
                        </ul>
                      )}
                    </div>
                    
                    <div className="submenu-section">
                      <h3 
                        className="submenu-title"
                        onClick={() => setShowAboutSubmenu(!showAboutSubmenu)}
                      >
                        À propos <FontAwesomeIcon icon={faAngleDown} />
                      </h3>
                      {showAboutSubmenu && (
                        <ul className="submenu-list">
                          <li className="submenu-item"><Link to="/about">À propos</Link></li>
                          <li className="submenu-item"><Link to="/about/reviews">Avis</Link></li>
                          <li className="submenu-item"><Link to="/contact">Contact</Link></li>
                          <li className="submenu-item"><Link to="/help">Aide</Link></li>
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </li>
            </ul>
          </nav>
          <div className="user-actions desktop-only">
            <Link to="/login" className="login-button">
              <FontAwesomeIcon icon={faUser} /> Mon compte
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button className="scroll-top-btn" onClick={scrollToTop}>
          <FontAwesomeIcon icon={faChevronUp} />
        </button>
      )}
      
      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>Nous faire confiance</h3>
            <div className="rating-info">
              <p><strong>Note : 4.8 / 5</strong> calculée à partir de <br/>5 000 avis</p>
              <p>Une communauté passionnée</p>
            </div>
          </div>

          <div className="footer-section">
            <h3>Besoin de conseils ?</h3>
            <p>Nous sommes joignables :</p>
            <p>Du lundi au vendredi : 9h00 à 20h00</p>
            <p>Samedi et Dimanche : 10h00 à 18h00</p>
          </div>

          <div className="footer-section">
            <h3>Réseaux sociaux</h3>
            <div className="social-icons">
              <a href="https://www.facebook.com/profile.php?id=61579044514425" className="social-icon" target="_blank" rel="noopener noreferrer">
                <img src={facebookIcon} alt="Facebook" />
              </a>
              <a href="https://www.instagram.com/sailingloc2025/" className="social-icon" target="_blank" rel="noopener noreferrer">
                <img src={instaIcon} alt="Instagram" />
              </a>
              <a href="#" className="social-icon" target="_blank" rel="noopener noreferrer">
                <img src={tiktokIcon} alt="TikTok" />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Paiement vérifié par</h3>
            <div className="payment-icons">
              <img src={mastercardIcon} alt="Mastercard" className="payment-icon" />
              <img src={visaIcon} alt="Visa" className="payment-icon" />
              <img src={applepayIcon} alt="Apple Pay" className="payment-icon" />
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-container">
            <p> SailingLoc 2025</p>
            <div className="footer-links">
              <Link to="/legal-notices">Mentions légales</Link>
              <Link to="/cgu-cgv">CGU / CGV</Link>

              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
