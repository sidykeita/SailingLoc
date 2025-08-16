import React from 'react';
import Layout from '../../Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnchor, faShip, faUsers, faHandshake } from '@fortawesome/free-solid-svg-icons';
import '../../assets/css/About.css';

// Import des images
import voisinImg from '../../assets/images/voisin.jpg';
import marcImg from '../../assets/images/marc.jpg';
import claireImg from '../../assets/images/claire.jpg';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>À propos de SailingLoc</h1>
          <p>Votre partenaire de confiance pour la location de bateaux depuis 2023</p>
        </div>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Notre histoire</h2>
          <div className="about-section-content">
            <div className="about-text">
              <p>
                SailingLoc est né d'une passion pour la mer et la navigation. Fondée en 2023, notre entreprise s'est donnée pour mission de rendre la location de bateaux accessible à tous, que vous soyez un marin expérimenté ou un novice souhaitant découvrir les joies de la navigation.
              </p>
              <p>
                Notre équipe est composée de passionnés de la mer, d'experts en navigation et de professionnels du tourisme nautique. Ensemble, nous travaillons pour vous offrir une expérience de location de bateau sans souci, sécurisée et inoubliable.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section values-section">
          <h2>Nos valeurs</h2>
          <div className="values-grid">
            <div className="value-card">
              <FontAwesomeIcon icon={faAnchor} className="value-icon" />
              <h3>Passion</h3>
              <p>La mer est notre passion. Nous partageons notre amour de la navigation avec nos clients et partenaires.</p>
            </div>
            <div className="value-card">
              <FontAwesomeIcon icon={faShip} className="value-icon" />
              <h3>Qualité</h3>
              <p>Nous sélectionnons rigoureusement les bateaux disponibles sur notre plateforme pour garantir votre sécurité et votre confort.</p>
            </div>
            <div className="value-card">
              <FontAwesomeIcon icon={faUsers} className="value-icon" />
              <h3>Accessibilité</h3>
              <p>Nous croyons que la mer devrait être accessible à tous. Notre plateforme est conçue pour faciliter la location de bateaux.</p>
            </div>
            <div className="value-card">
              <FontAwesomeIcon icon={faHandshake} className="value-icon" />
              <h3>Confiance</h3>
              <p>La transparence et l'honnêteté sont au cœur de notre relation avec nos clients et partenaires.</p>
            </div>
          </div>
        </section>

        <section className="about-section team-section">
          <h2>Notre équipe</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="team-member-photo">
                <img src={voisinImg} alt="Alfred Voisin" />
              </div>
              <h3>Alfred Voisin</h3>
              <p className="team-member-role">Fondateur & CEO</p>
              <p>Passionné de voile depuis son plus jeune âge, Alfred a créé SailingLoc pour partager sa passion avec le plus grand nombre.</p>
            </div>
            <div className="team-member">
              <div className="team-member-photo">
                <img src={marcImg} alt="Marc Martin" />
              </div>
              <h3>Marc Martin</h3>
              <p className="team-member-role">Directeur Technique</p>
              <p>Expert en navigation et en sécurité maritime, Marc veille à ce que tous les bateaux proposés répondent aux normes les plus strictes.</p>
            </div>
            <div className="team-member">
              <div className="team-member-photo">
                <img src={claireImg} alt="Claire Legrand" />
              </div>
              <h3>Claire Legrand</h3>
              <p className="team-member-role">Responsable Relations Clients</p>
              <p>Claire s'assure que chaque client vive une expérience exceptionnelle, de la réservation jusqu'au retour de navigation.</p>
            </div>
          </div>
        </section>

        <section className="about-section cta-section">
          <h2>Rejoignez l'aventure SailingLoc</h2>
          <p>Prêt à prendre le large ? Découvrez notre sélection de bateaux et réservez dès maintenant votre prochaine aventure maritime.</p>
          <div className="cta-buttons">
            <a href="/boats/motor" className="cta-button primary">Bateaux à moteur</a>
            <a href="/boats/sailing" className="cta-button secondary">Voiliers</a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
