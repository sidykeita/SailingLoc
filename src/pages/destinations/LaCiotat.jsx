import React from 'react';
import { Link } from 'react-router-dom';
import { useBoatCount } from '../../hooks/useBoatCount';
import '../../assets/css/DestinationDetail.css';

// Importation des images depuis le dossier destinations
import laCiotatHero from '../../assets/images/destinations/la-ciotat.jpeg';

const LaCiotat = () => {
  const { boatCount, isLoading, error } = useBoatCount('La Ciotat');
  return (
    <div className="destination-detail-page">
      <div className="hero-section" style={{ backgroundImage: `url(${laCiotatHero})` }}>
        <div className="hero-overlay">
          <h1>La Ciotat</h1>
          <p>{isLoading ? 'Chargement...' : error ? 'Erreur de chargement' : `${boatCount} bateaux disponibles`}</p>
        </div>
      </div>

      <div className="destination-content">
        <div className="container">
          <div className="destination-description">
            <h2>Découvrez La Ciotat</h2>
            <p>
              La Ciotat, charmante ville portuaire des Bouches-du-Rhône, est réputée pour ses calanques 
              spectaculaires et son patrimoine maritime. Entre Marseille et Toulon, elle offre un accès 
              privilégié aux plus belles criques de la Méditerranée. Découvrez les calanques de Figuerolles 
              et du Mugel, ou naviguez vers l'Île Verte pour une journée parfaite en mer.
            </p>
            
            <div className="destination-info-grid">
              <div className="info-card">
                <h3>Points d'intérêt</h3>
                <ul>
                  <li>Calanques de Figuerolles</li>
                  <li>Parc du Mugel</li>
                  <li>Vieux-Port</li>
                  <li>Île Verte</li>
                  <li>Eden Théâtre</li>
                </ul>
              </div>
              
              <div className="info-card">
                <h3>Informations nautiques</h3>
                <p><strong>Meilleure saison:</strong> Mai à Septembre</p>
                <p><strong>Température moyenne:</strong> 16°C - 28°C</p>
                <p><strong>Conditions de vent:</strong> Mistral modéré, conditions idéales pour la navigation côtière</p>
              </div>
            </div>
          </div>
          
          <div className="available-boats">
            <h2>Bateaux disponibles à La Ciotat</h2>
            <div className="cta-buttons">
              <Link to="/boats?location=La Ciotat" className="primary-button">Voir tous les bateaux</Link>
              <Link to="/contact" className="secondary-button">Demander des informations</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaCiotat;
