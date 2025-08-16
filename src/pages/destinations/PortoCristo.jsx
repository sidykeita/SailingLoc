import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/DestinationDetail.css';

// Importation des images depuis le dossier destinations
import portoCristoHero from '../../assets/images/destinations/porto-cristo.jpeg';
// Importez d'autres images si nécessaire

const PortoCristo = () => {
  return (
    <div className="destination-detail-page">
      <div className="hero-section" style={{ backgroundImage: `url(${portoCristoHero})` }}>
        <div className="hero-overlay">
          <h1>Porto Cristo</h1>
          <p>85 bateaux disponibles</p>
        </div>
      </div>

      <div className="destination-content">
        <div className="container">
          <div className="destination-description">
            <h2>Découvrez Porto Cristo</h2>
            <p>
              Porto Cristo, charmant village de pêcheurs situé sur la côte est de Majorque, 
              est un paradis pour les plaisanciers. Avec ses eaux cristallines et ses criques isolées, 
              c'est l'endroit parfait pour jeter l'ancre et profiter de la Méditerranée. 
              Ne manquez pas les célèbres grottes du Drach à proximité.
            </p>
            
            <div className="destination-info-grid">
              <div className="info-card">
                <h3>Points d'intérêt</h3>
                <ul>
                  <li>Grottes du Drach</li>
                  <li>Plage de Porto Cristo</li>
                  <li>Cala Anguila</li>
                  <li>Cala Mendia</li>
                  <li>Réserve marine de Llevant</li>
                </ul>
              </div>
              
              <div className="info-card">
                <h3>Informations nautiques</h3>
                <p><strong>Meilleure saison:</strong> Mai à Septembre</p>
                <p><strong>Température moyenne:</strong> 18°C - 32°C</p>
                <p><strong>Conditions de vent:</strong> Brises légères à modérées, parfait pour la navigation de plaisance</p>
              </div>
            </div>
          </div>
          
          <div className="available-boats">
            <h2>Bateaux disponibles à Porto Cristo</h2>
            <div className="cta-buttons">
              <Link to="/boats/porto-cristo" className="primary-button">Voir tous les bateaux</Link>
              <Link to="/contact" className="secondary-button">Demander des informations</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortoCristo;
