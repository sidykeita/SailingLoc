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
  faChevronRight 
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
        <nav className="main-nav">
          <ul>
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
                      onClick={() => setShowDestinationsSubmenu(!showDestinationsSubmenu)}
                    >
                      Destinations <FontAwesomeIcon icon={faAngleDown} />
                    </h3>
                    {showDestinationsSubmenu && (
                      <ul className="submenu-list">
                        <li style={{display: 'block', margin: '10px 0'}}><Link to="/destinations/marseille">Marseille</Link></li>
                        <li style={{display: 'block', margin: '10px 0'}}><Link to="/destinations/porto-cristo">Porto Cristo</Link></li>
                        <li style={{display: 'block', margin: '10px 0'}}><Link to="/destinations/bastia">Bastia</Link></li>
                      </ul>
                    )}
                  </div>
                  
                  <div className="submenu-section">
                    <h3 
                      className="submenu-title"
                      onClick={() => setShowModelsSubmenu(!showModelsSubmenu)}
                    >
                      Modèles <FontAwesomeIcon icon={faAngleDown} />
                    </h3>
                    {showModelsSubmenu && (
                      <ul className="submenu-list">
                        <li style={{display: 'block', margin: '10px 0'}}><Link to="/models/bayliner">Bayliner</Link></li>
                        <li style={{display: 'block', margin: '10px 0'}}><Link to="/models/jeanneau">Jeanneau</Link></li>
                        <li style={{display: 'block', margin: '10px 0'}}><Link to="/models/beneteau">Beneteau</Link></li>
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
                        <li style={{display: 'block', margin: '10px 0'}}><Link to="/about/company">Notre entreprise</Link></li>
                        <li style={{display: 'block', margin: '10px 0'}}><Link to="/about/team">Notre équipe</Link></li>
                        <li style={{display: 'block', margin: '10px 0'}}><Link to="/about/values">Nos valeurs</Link></li>
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/help">Aide</Link></li>
          </ul>
        </nav>
        <div className="user-actions">
          <Link to="/login" className="login-button">
            <FontAwesomeIcon icon={faUser} /> Mon compte
          </Link>
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
              <a href="#" className="social-icon">
                <img src={facebookIcon} alt="Facebook" />
              </a>
              <a href="#" className="social-icon">
                <img src={instaIcon} alt="Instagram" />
              </a>
              <a href="#" className="social-icon">
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
            <p>© SailingLoc 2025</p>
            <div className="footer-links">
              <Link to="/legal-notices">Mentions légales</Link>
              <Link to="/cgu-cgv">CGU / CGV</Link>
              <Link to="#">Partenaires</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
