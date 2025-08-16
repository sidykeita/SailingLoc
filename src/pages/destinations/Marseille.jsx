import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/DestinationDetail.css';

// Importation des images depuis le dossier destinations
import marseilleHero from '../../assets/images/destinations/marseille.jpeg';
// Importez d'autres images si nécessaire

const Marseille = () => {
  return (
    <div className="destination-detail-page">
      <div className="hero-section" style={{ backgroundImage: `url(${marseilleHero})` }}>
        <div className="hero-overlay">
          <h1>Marseille</h1>
          <p>120 bateaux disponibles</p>
        </div>
      </div>

      <div className="destination-content">
        <div className="container">
          <div className="destination-description">
            <h2>Découvrez Marseille</h2>
            <p>
              Marseille, ville portuaire du sud de la France, est un lieu idéal pour la navigation. 
              Avec sa riche histoire maritime et ses calanques spectaculaires, elle offre des expériences 
              de navigation inoubliables. Explorez les îles du Frioul, la célèbre calanque de Sormiou 
              ou naviguez jusqu'à Cassis pour une journée parfaite en mer.
            </p>
            
            <div className="destination-info-grid">
              <div className="info-card">
                <h3>Points d'intérêt</h3>
                <ul>
                  <li>Les Calanques</li>
                  <li>Vieux-Port</li>
                  <li>Notre-Dame de la Garde</li>
                  <li>Îles du Frioul</li>
                  <li>Château d'If</li>
                </ul>
              </div>
              
              <div className="info-card">
                <h3>Informations nautiques</h3>
                <p><strong>Meilleure saison:</strong> Avril à Octobre</p>
                <p><strong>Température moyenne:</strong> 15°C - 30°C</p>
                <p><strong>Conditions de vent:</strong> Mistral fréquent, idéal pour la voile sportive</p>
              </div>
            </div>
          </div>
          
          <div className="available-boats">
            <h2>Bateaux disponibles à Marseille</h2>
            <div className="cta-buttons">
              <Link to="/boats/marseille" className="primary-button">Voir tous les bateaux</Link>
              <Link to="/contact" className="secondary-button">Demander des informations</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marseille;
