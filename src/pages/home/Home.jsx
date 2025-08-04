import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faMapMarkerAlt, faCalendarAlt, faChevronDown, faUser, faStar, faChevronUp, faAngleDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import adminBackground from '../../assets/images/admin.jpeg';
import './Home.css';

// Import des images
import backgroundImage from '../../assets/images/accueil.jpeg';
import logo from '../../assets/images/logo-blc.png';
import logoColor from '../../assets/images/logo-SailingLOC-couleur.png';
import voilierImg from '../../assets/images/voilier.jpg';
import moteurImg from '../../assets/images/moteur.jpg';
import moteur1Img from '../../assets/images/moteur1.jpeg';
import moteur2Img from '../../assets/images/moteur2.jpeg';
import moteur3Img from '../../assets/images/moteur3.jpeg';
import marseilleImage from '../../assets/images/marseille.jpeg';
import portoCristoImage from '../../assets/images/porto-cristo.jpeg';
import bastiaImage from '../../assets/images/bastia.jpeg';

// Images de profil
import profileImg1 from '../../assets/images/profil.jpg';
import profileImg2 from '../../assets/images/profil.jpg';
import profileImg3 from '../../assets/images/profil.jpg';

// Images pour le footer
import facebookIcon from '../../assets/images/picto-facebook.png';
import instaIcon from '../../assets/images/picto-insta.png';
import tiktokIcon from '../../assets/images/picto-tiktok.png';
import mastercardIcon from '../../assets/images/mastercard.png';
import visaIcon from '../../assets/images/visa.png';
// Note: paypal.png n'existe pas, utilisation d'Apple Pay à la place
import applepayIcon from '../../assets/images/applepay.png';

const Home = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBoatSubmenu, setShowBoatSubmenu] = useState(false);
  const [showDestinationsSubmenu, setShowDestinationsSubmenu] = useState(false);
  const [showModelsSubmenu, setShowModelsSubmenu] = useState(false);
  const [showAboutSubmenu, setShowAboutSubmenu] = useState(false);
  const [selectedBoatType, setSelectedBoatType] = useState(null);
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
  
  const scrollToContent = () => {
    const contentSection = document.querySelector('.community-favorites');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-page" style={{ 
      backgroundImage: `url(${adminBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="hero-section" style={{ backgroundImage: `url(${backgroundImage})` }}>
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
              </li>
              <li><Link to="/dashboard" className="nav-link">Mon compte</Link></li>
              <li><Link to="/help" className="nav-link">Aide</Link></li>
              <li>
                <div className="language-selector">
                  <img src="/france-flag.svg" alt="FR" className="flag-icon" />
                </div>
              </li>
            </ul>
          </nav>
        </header>

        <div className="search-container">
          <div className="search-content">
            <h1>Louez votre bateau en un clic !</h1>
            <p className="subtitle">
              Comparez et réservez votre bateau en un clic parmi un grand choix de voiliers et bateaux à moteur.
            </p>

            <div className="search-fields">
              <div className="search-field">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="field-icon" />
                <input type="text" placeholder="Où souhaitez-vous louer un bateau ?" />
              </div>
              
              <div className="search-field">
                <FontAwesomeIcon icon={faCalendarAlt} className="field-icon" />
                <input type="text" placeholder="Choisissez vos dates" />
              </div>

              <div className="boat-type-selector">
                <div className={`boat-card ${selectedBoatType === 'sailing' ? 'selected' : ''}`} onClick={() => setSelectedBoatType('sailing')}>
                  <Link to="/boats/sailing">
                    <div className="boat-card-inner">
                      <img src={voilierImg} alt="Voilier" className="boat-image" />
                    </div>
                  </Link>
                </div>
                <div className={`boat-card ${selectedBoatType === 'motor' ? 'selected' : ''}`} onClick={() => setSelectedBoatType('motor')}>
                  <Link to="/boats/motor">
                    <div className="boat-card-inner">
                      <img src={moteurImg} alt="Bateau à moteur" className="boat-image" />
                    </div>
                  </Link>
                </div>
              </div>

              <button className="search-button">
                <FontAwesomeIcon icon={faSearch} /> Recherche
              </button>
            </div>
          </div>
        </div>
        
        <button className="scroll-down-btn" onClick={scrollToContent}>
          <FontAwesomeIcon icon={faAngleDown} />
        </button>
      </div>

      <section className="community-favorites">
        <h2 className="section-title">Les coup de coeur de la communauté</h2>
        
        <div className="boat-cards">
          <div className="boat-card">
            <div className="boat-image">
              <img src={moteur1Img} alt="Bateau à Marseille" />
              <button className="favorite-button">♡</button>
              <div className="image-pagination">
                <span className="active-dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
            <div className="boat-details">
              <div className="location-rating">
                <h3>Marseille</h3>
                <div className="rating">
                  <span className="star">★</span> 4.2 (52)
                </div>
              </div>
              <p className="boat-name">Jeanneau Prestige 36 (2020)</p>
              <div className="boat-specs">
                <span>7 Pers.</span> • <span>2 Cabines</span> • <span>3 Couchages</span> • <span>241 CV</span> • <span>13.55 M</span>
              </div>
              <div className="boat-footer">
                <div className="skipper-option">
                  <span>Skipper Disponible</span>
                </div>
                <div className="price">
                  <p>À partir de <span className="amount">450 €</span> / jour</p>
                </div>
              </div>
            </div>
          </div>

          <div className="boat-card">
            <div className="boat-image">
              <img src={moteur2Img} alt="Bateau à La Rochelle" />
              <button className="favorite-button">♡</button>
              <div className="image-pagination">
                <span className="active-dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
            <div className="boat-details">
              <div className="location-rating">
                <h3>La Rochelle</h3>
                <div className="rating">
                  <span className="star">★</span> 4.9 (87)
                </div>
              </div>
              <p className="boat-name">Catana 42 S (2020)</p>
              <div className="boat-specs">
                <span>10 Pers.</span> • <span>3 Cabines</span> • <span>225 CV</span> • <span>18 M</span>
              </div>
              <div className="boat-footer">
                <div className="skipper-option">
                  <span>Skipper Disponible</span>
                </div>
                <div className="price">
                  <p>À partir de <span className="amount">1390 €</span> / jour</p>
                </div>
              </div>
            </div>
          </div>

          <div className="boat-card">
            <div className="boat-image">
              <img src={moteur3Img} alt="Bateau à La Ciotat" />
              <button className="favorite-button">♡</button>
              <div className="image-pagination">
                <span className="active-dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
            <div className="boat-details">
              <div className="location-rating">
                <h3>La Ciotat</h3>
                <div className="rating">
                  <span className="star">★</span> 4.8 (95)
                </div>
              </div>
              <p className="boat-name">Quicksilver Activ 755 (2021)</p>
              <div className="boat-specs">
                <span>6 Pers.</span> • <span>4 Couchages</span> • <span>225 CV</span> • <span>7.5 M</span>
              </div>
              <div className="boat-footer">
                <div className="skipper-option">
                  <span>Skipper Disponible</span>
                </div>
                <div className="price">
                  <p>À partir de <span className="amount">400 €</span> / jour</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Destinations */}
      <section className="destinations-section">
        <h2 className="section-title cursive-title">Choisissez votre destination<br />en France et en Europe</h2>
        
        <div className="destinations-container">
          <div className="destination-card">
            <img src={marseilleImage} alt="Marseille" className="destination-image" />
            <div className="destination-name">Marseille</div>
          </div>
          
          <div className="destination-card">
            <img src={portoCristoImage} alt="Porto Cristo" className="destination-image" />
            <div className="destination-name">Porto Cristo</div>
          </div>
          
          <div className="destination-card">
            <img src={bastiaImage} alt="Bastia" className="destination-image" />
            <div className="destination-name">Bastia</div>
          </div>
        </div>

        <button className="discover-more-btn">Découvrez nos autres destinations</button>
      </section>

      {/* Section Témoignages */}
      <section className="testimonials-section">
        <h2 className="section-title cursive-title">Nos utilisateurs vous partagent<br />leur expérience inoubliable</h2>
        
        <div className="testimonials-container">
          <div className="testimonial-card">
            <div className="testimonial-header">
              <img src={profileImg1} alt="Jules" className="profile-image" />
              <div className="profile-info">
                <h3>Jules</h3>
                <p>Paris<br />Location Voilier Yachting France 33 et YBS à Leucate</p>
              </div>
            </div>
            <div className="testimonial-content">
              <p>Malgré une météo capricieuse avec de belles rafales de vent, notre séjour a été de super équipé. Nous avons emprunté plusieurs routes et avons de justesse échappé un jour régatif!!! Je les recommande vivement d'autant qu'Adrien a vraiment le sens de la navigation et le sérieux nécessaire.</p>
              <a href="#" className="read-more">Lire la suite</a>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-header">
              <img src={profileImg2} alt="Fanny" className="profile-image" />
              <div className="profile-info">
                <h3>Fanny</h3>
                <p>Marseille<br />Location bateau Bayliner E42 Cuddy à Cavalaire-sur-Mer</p>
              </div>
            </div>
            <div className="testimonial-content">
              <p>Nous avons loués le bateau tout une journée avec 5 de mes amis et c'était super ! Très bon accueil, pas eu besoin de nous occuper du moteur, tout était top ! Merci encore nous reviendrons !</p>
              <a href="#" className="read-more">Lire la suite</a>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-header">
              <img src={profileImg3} alt="Mathieu" className="profile-image" />
              <div className="profile-info">
                <h3>Mathieu</h3>
                <p>Lille<br />Location voilier Jeanneau Dufay à La Seyne-sur-Mer</p>
              </div>
            </div>
            <div className="testimonial-content">
              <p>Je ne peut que recommander ! Il a pris soin du bateau et est très à l'écoute des informations données par le propriétaire. Le point de vue d'un propriétaire, très rassurant. Je lui laisser mon voilier quand il veut !</p>
              <a href="#" className="read-more">Lire la suite</a>
            </div>
          </div>
        </div>
      </section>

      {showScrollTop && (
        <button className="scroll-top-btn" onClick={scrollToTop}>
          <FontAwesomeIcon icon={faChevronUp} />
        </button>
      )}
      
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
            <p> SailingLoc 2025</p>
            <div className="footer-links">
              <a href="javascript:void(0)" onClick={() => window.location.href = '/legal-notices'}>Mentions légales</a>
              <a href="javascript:void(0)" onClick={() => window.location.href = '/cgu-cgv'}>CGU / CGV</a>
              <a href="#">Partenaires</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
