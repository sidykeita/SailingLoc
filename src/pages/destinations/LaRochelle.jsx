import React from 'react';
import { Link } from 'react-router-dom';
import { useBoatCount } from '../../hooks/useBoatCount';
import '../../assets/css/DestinationDetail.css';

// Importation des images depuis le dossier destinations
import laRochelleHero from '../../assets/images/la-rochelle.jpeg';

const LaRochelle = () => {
  const { boatCount, isLoading, error } = useBoatCount('La Rochelle');
  return (
    <div className="destination-detail-page">
      <div className="hero-section" style={{ backgroundImage: `url(${laRochelleHero})` }}>
        <div className="hero-overlay">
          <h1>La Rochelle</h1>
          <p>{isLoading ? 'Chargement...' : error ? 'Erreur de chargement' : `${boatCount} bateaux disponibles`}</p>
        </div>
      </div>

      <div className="destination-content">
        <div className="container">
          <div className="destination-description">
            <h2>Découvrez La Rochelle</h2>
            <p>
              La Rochelle, port historique de la côte atlantique française, est une destination prisée des navigateurs. 
              Avec ses tours médiévales gardant l'entrée du port et ses îles environnantes, elle offre un cadre 
              exceptionnel pour la navigation. Explorez l'île de Ré, l'île d'Oléron ou naviguez vers les côtes 
              vendéennes pour une expérience maritime authentique.
            </p>
            
            <div className="destination-info-grid">
              <div className="info-card">
                <h3>Points d'intérêt</h3>
                <ul>
                  <li>Vieux-Port</li>
                  <li>Tours de La Rochelle</li>
                  <li>Île de Ré</li>
                  <li>Île d'Oléron</li>
                  <li>Aquarium de La Rochelle</li>
                </ul>
              </div>
              
              <div className="info-card">
                <h3>Informations nautiques</h3>
                <p><strong>Meilleure saison:</strong> Avril à Octobre</p>
                <p><strong>Température moyenne:</strong> 12°C - 25°C</p>
                <p><strong>Conditions de vent:</strong> Vents d'ouest dominants, idéal pour la navigation hauturière</p>
              </div>
            </div>
          </div>
          
          <div className="available-boats">
            <h2>Bateaux disponibles à La Rochelle</h2>
            <div className="cta-buttons">
              <Link to="/boats?location=La Rochelle" className="primary-button">Voir tous les bateaux</Link>
              <Link to="/contact" className="secondary-button">Demander des informations</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaRochelle;
