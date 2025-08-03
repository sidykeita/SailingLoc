import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faMapMarkerAlt, faCalendarAlt, faChevronRight, faHeart } from '@fortawesome/free-solid-svg-icons';
import Layout from '../../Layout';
import '../../assets/css/Home.css';

// Import des images
import backgroundImage from '../../assets/images/accueil.jpeg';
import voilierImg from '../../assets/images/voilier.jpg';
import moteurImg from '../../assets/images/moteur.jpg';
import moteur1Img from '../../assets/images/moteur1.jpeg';
import moteur2Img from '../../assets/images/moteur2.jpeg';
import moteur3Img from '../../assets/images/moteur3.jpeg';
import marseilleImage from '../../assets/images/destinations/marseille.jpeg';
import portoCristoImage from '../../assets/images/destinations/porto-cristo.jpeg';
import bastiaImage from '../../assets/images/destinations/bastia.jpeg';

// Images de profil
import profileImg1 from '../../assets/images/profil.jpg';
import profileImg2 from '../../assets/images/profil.jpg';
import profileImg3 from '../../assets/images/profil.jpg';

const Home = () => {
  const [selectedBoatType, setSelectedBoatType] = useState(null);
  
  const scrollToContent = () => {
    const contentSection = document.querySelector('.community-favorites');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Ajout d'un log pour vérifier si le composant est rendu
  console.log('Composant Home rendu');

  return (
    <Layout>
      <div className="home-page">
        <div className="hero-section" style={{ backgroundImage: `url(${backgroundImage})` }}>
          <div className="hero-content">
            <div className="search-container">
              <h1>Louez votre bateau en un clic !</h1>
              <p>Comparez les offres pour votre bateau en un clic et réservez en ligne des voiliers et bateaux à moteur</p>
              
              <div className="search-box">
                <div className="search-input-group location-group">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="search-icon" />
                  <input type="text" placeholder="Où souhaitez-vous louer un bateau ?" className="search-input" />
                </div>
                
                <div className="search-input-group date-group">
                  <FontAwesomeIcon icon={faCalendarAlt} className="search-icon" />
                  <input type="text" placeholder="Choisissez vos dates" className="search-input" />
                </div>
              </div>
              
              <div className="boat-type-selector">
                <Link 
                  to="/boats/sailing"
                  className={`boat-type-btn ${selectedBoatType === 'voilier' ? 'active' : ''}`}
                  onClick={() => setSelectedBoatType('voilier')}
                >
                  <img src={voilierImg} alt="Voilier" className="boat-type-icon" />
                  <span>Voilier</span>
                </Link>
                <Link 
                  to="/boats/motor"
                  className={`boat-type-btn ${selectedBoatType === 'moteur' ? 'active' : ''}`}
                  onClick={() => setSelectedBoatType('moteur')}
                >
                  <img src={moteurImg} alt="Bateau à moteur" className="boat-type-icon" />
                  <span>Bateau à moteur</span>
                </Link>
              </div>
              

            </div>
          </div>
        </div>
        
        <section className="community-favorites">
          <div className="section-container">
            <h2 className="section-title">Les coup de coeur de la communauté</h2>
            <div className="boat-cards">
              <div className="boat-card">
                <div className="boat-card-header">
                  <img src={moteur1Img} alt="Bateau à moteur" className="boat-image" />
                  <button className="favorite-btn"><FontAwesomeIcon icon={faHeart} /></button>
                </div>
                <div className="boat-info">
                  <div className="boat-header">
                    <h3>Marseille</h3>
                    <div className="boat-rating">★★★★★ (4.82)</div>
                  </div>
                  <p className="boat-description">JEANNEAU 795 • 7,95m • 8 pers • 75CV</p>
                  <p className="boat-owner">Proposé par <span>Yoann F.</span></p>
                  <div className="boat-price">
                    <span className="price-label">à partir de</span>
                    <div className="price-value">149 € / jour</div>
                  </div>
                </div>
              </div>
              
              <div className="boat-card">
                <div className="boat-card-header">
                  <img src={moteur2Img} alt="Bateau à moteur" className="boat-image" />
                  <button className="favorite-btn"><FontAwesomeIcon icon={faHeart} /></button>
                </div>
                <div className="boat-info">
                  <div className="boat-header">
                    <h3>La Rochelle</h3>
                    <div className="boat-rating">★★★★★ (4.89)</div>
                  </div>
                  <p className="boat-description">BAYLINER 742R • 7,42m • 8 pers • 300CV</p>
                  <p className="boat-owner">Proposé par <span>Philippe B.</span></p>
                  <div className="boat-price">
                    <span className="price-label">à partir de</span>
                    <div className="price-value">249 € / jour</div>
                  </div>
                </div>
              </div>
              
              <div className="boat-card">
                <div className="boat-card-header">
                  <img src={moteur1Img} alt="Bateau à moteur" className="boat-image" />
                  <button className="favorite-btn"><FontAwesomeIcon icon={faHeart} /></button>
                </div>
                <div className="boat-info">
                  <div className="boat-header">
                    <h3>Le Croisic</h3>
                    <div className="boat-rating">★★★★★ (4.95)</div>
                  </div>
                  <p className="boat-description">QUICKSILVER 675 • 6,75m • 8 pers • 175CV</p>
                  <p className="boat-owner">Proposé par <span>Marine L.</span></p>
                  <div className="boat-price">
                    <span className="price-label">à partir de</span>
                    <div className="price-value">199 € / jour</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="destinations">
          <div className="section-container">
            <h2 className="section-title">Choisissez votre destination<br />en France et en Europe</h2>
            <div className="destination-cards">
              <Link to="/destinations/marseille" className="destination-card-link">
                <div className="destination-card">
                  <img src={marseilleImage} alt="Marseille" className="destination-image" />
                  <div className="destination-name">Marseille</div>
                  <div className="destination-overlay">
                    <h3>Marseille</h3>
                    <p>120 bateaux disponibles</p>
                    <span className="destination-link">Explorer</span>
                  </div>
                </div>
              </Link>
              
              <Link to="/destinations/porto-cristo" className="destination-card-link">
                <div className="destination-card">
                  <img src={portoCristoImage} alt="Porto Cristo" className="destination-image" />
                  <div className="destination-name">Porto Cristo</div>
                  <div className="destination-overlay">
                    <h3>Porto Cristo</h3>
                    <p>85 bateaux disponibles</p>
                    <span className="destination-link">Explorer</span>
                  </div>
                </div>
              </Link>
              
              <Link to="/destinations/bastia" className="destination-card-link">
                <div className="destination-card">
                  <img src={bastiaImage} alt="Bastia" className="destination-image" />
                  <div className="destination-name">Bastia</div>
                  <div className="destination-overlay">
                    <h3>Bastia</h3>
                    <p>65 bateaux disponibles</p>
                    <span className="destination-link">Explorer</span>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="view-all-destinations">
              <Link to="/destinations" className="view-all-destinations-button">Découvrez nos autres destinations</Link>
            </div>
          </div>
        </section>
        
        <section className="testimonials">
          <div className="section-container">
            <h2 className="section-title">Nos utilisateurs vous partagent<br />leur expérience inoubliable</h2>
            <div className="testimonial-cards">
              <div className="testimonial-card">
                <div className="testimonial-header">
                  <img src={profileImg1} alt="Jean" className="profile-image" />
                  <div className="profile-info">
                    <h3>Jean</h3>
                    <p>Paris<br />Location voilier Beneteau Oceanis 45 à Marseille</p>
                  </div>
                </div>
                <div className="testimonial-content">
                  <p>Excellente expérience avec ce voilier ! Le propriétaire était très accueillant et nous a donné de bons conseils pour notre itinéraire. Le bateau était impeccable et très confortable. Je recommande vivement !</p>
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
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
