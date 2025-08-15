import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faAnchor, 
  faUsers, 
  faShieldAlt, 
  faHeart,
  faMapMarkerAlt,
  faPhone,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import '../../assets/css/About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Header */}
      <div className="about-header">
        <div className="container">
          <h1>À propos de SailingLoc</h1>
          <p className="about-subtitle">
            Votre plateforme de confiance pour la location de bateaux en Méditerranée
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="about-content">
        <div className="container">
          
          {/* Notre Mission */}
          <section className="about-section">
            <div className="section-icon">
              <FontAwesomeIcon icon={faAnchor} />
            </div>
            <h2>Notre Mission</h2>
            <p>
              SailingLoc démocratise l'accès à la navigation de plaisance en connectant 
              les propriétaires de bateaux avec les passionnés de mer. Notre mission est 
              de rendre la location de bateaux simple, sécurisée et accessible à tous.
            </p>
          </section>

          {/* Nos Valeurs */}
          <section className="about-section">
            <div className="section-icon">
              <FontAwesomeIcon icon={faHeart} />
            </div>
            <h2>Nos Valeurs</h2>
            <div className="values-grid">
              <div className="value-item">
                <FontAwesomeIcon icon={faShieldAlt} />
                <h3>Sécurité</h3>
                <p>Tous nos bateaux sont vérifiés et assurés pour votre tranquillité.</p>
              </div>
              <div className="value-item">
                <FontAwesomeIcon icon={faUsers} />
                <h3>Communauté</h3>
                <p>Nous créons des liens entre passionnés de navigation.</p>
              </div>
              <div className="value-item">
                <FontAwesomeIcon icon={faHeart} />
                <h3>Passion</h3>
                <p>L'amour de la mer guide chacune de nos actions.</p>
              </div>
            </div>
          </section>

          {/* Pourquoi Choisir SailingLoc */}
          <section className="about-section">
            <h2>Pourquoi Choisir SailingLoc ?</h2>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-number">1</span>
                <div>
                  <h3>Large Sélection</h3>
                  <p>Plus de 500 bateaux disponibles sur la côte méditerranéenne</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-number">2</span>
                <div>
                  <h3>Réservation Simplifiée</h3>
                  <p>Processus de réservation en ligne rapide et sécurisé</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-number">3</span>
                <div>
                  <h3>Support 24/7</h3>
                  <p>Notre équipe vous accompagne avant, pendant et après votre navigation</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-number">4</span>
                <div>
                  <h3>Prix Transparents</h3>
                  <p>Aucun frais caché, tarification claire et compétitive</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="about-section contact-section">
            <h2>Nous Contacter</h2>
            <div className="contact-info">
              <div className="contact-item">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <div>
                  <h3>Adresse</h3>
                  <p>123 Avenue de la Mer<br />13000 Marseille, France</p>
                </div>
              </div>
              <div className="contact-item">
                <FontAwesomeIcon icon={faPhone} />
                <div>
                  <h3>Téléphone</h3>
                  <p>+33 4 XX XX XX XX</p>
                </div>
              </div>
              <div className="contact-item">
                <FontAwesomeIcon icon={faEnvelope} />
                <div>
                  <h3>Email</h3>
                  <p>contact@sailingloc.com</p>
                </div>
              </div>
            </div>
            <div className="contact-cta">
              <Link to="/contact" className="btn-primary">
                Nous Contacter
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default About;
