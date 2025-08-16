import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/DestinationDetail.css';

// Importation des images depuis le dossier destinations
import alicanteHero from '../../assets/images/destinations/alicante.jpg';

const Alicante = () => {
  return (
    <div className="destination-detail-page">
      <div className="hero-section" style={{ backgroundImage: `url(${alicanteHero})` }}>
        <div className="hero-overlay">
          <h1>Alicante</h1>
          <p>95 bateaux disponibles</p>
        </div>
      </div>

      <div className="destination-content">
        <div className="container">
          <div className="destination-description">
            <h2>Découvrez Alicante</h2>
            <p>
              Alicante, joyau de la Costa Blanca en Espagne, est une destination idéale pour les 
              amateurs de navigation. Avec son climat méditerranéen ensoleillé presque toute l'année, 
              ses eaux cristallines et sa magnifique marina, elle offre des conditions parfaites pour 
              explorer la côte espagnole. Naviguez vers les îles de Tabarca ou longez la côte pour 
              découvrir des criques isolées et des plages de sable doré.
            </p>
            
            <div className="destination-info-grid">
              <div className="info-card">
                <h3>Points d'intérêt</h3>
                <ul>
                  <li>Château de Santa Barbara</li>
                  <li>Île de Tabarca</li>
                  <li>Plage de San Juan</li>
                  <li>Promenade Explanada de España</li>
                  <li>Marina d'Alicante</li>
                </ul>
              </div>
              
              <div className="info-card">
                <h3>Informations nautiques</h3>
                <p><strong>Meilleure saison:</strong> Avril à Octobre</p>
                <p><strong>Température moyenne:</strong> 18°C - 30°C</p>
                <p><strong>Conditions de vent:</strong> Brises thermiques régulières, idéales pour la navigation à voile</p>
              </div>
            </div>
          </div>
          
          <div className="available-boats">
            <h2>Bateaux disponibles à Alicante</h2>
            <div className="cta-buttons">
              <Link to="/boats?location=alicante" className="primary-button">Voir tous les bateaux</Link>
              <Link to="/contact" className="secondary-button">Demander des informations</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alicante;
