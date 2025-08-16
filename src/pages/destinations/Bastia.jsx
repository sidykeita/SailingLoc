import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/DestinationDetail.css';

// Importation des images depuis le dossier destinations
import bastiaHero from '../../assets/images/destinations/bastia.jpeg';
// Importez d'autres images si nécessaire

const Bastia = () => {
  return (
    <div className="destination-detail-page">
      <div className="hero-section" style={{ backgroundImage: `url(${bastiaHero})` }}>
        <div className="hero-overlay">
          <h1>Bastia</h1>
          <p>65 bateaux disponibles</p>
        </div>
      </div>

      <div className="destination-content">
        <div className="container">
          <div className="destination-description">
            <h2>Découvrez Bastia</h2>
            <p>
              Bastia, ville portuaire historique du nord de la Corse, est un point de départ idéal 
              pour explorer les côtes corses. Avec son vieux port pittoresque et ses plages magnifiques 
              à proximité, elle offre une expérience de navigation authentique en Méditerranée. 
              Naviguez vers le Cap Corse ou les plages sauvages de la côte est.
            </p>
            
            <div className="destination-info-grid">
              <div className="info-card">
                <h3>Points d'intérêt</h3>
                <ul>
                  <li>Vieux-Port</li>
                  <li>Citadelle de Bastia</li>
                  <li>Cap Corse</li>
                  <li>Plage de l'Arinella</li>
                  <li>Étang de Biguglia</li>
                </ul>
              </div>
              
              <div className="info-card">
                <h3>Informations nautiques</h3>
                <p><strong>Meilleure saison:</strong> Mai à Octobre</p>
                <p><strong>Température moyenne:</strong> 15°C - 29°C</p>
                <p><strong>Conditions de vent:</strong> Vents variables, généralement modérés avec quelques jours de Libeccio</p>
              </div>
            </div>
          </div>
          
          <div className="available-boats">
            <h2>Bateaux disponibles à Bastia</h2>
            <div className="cta-buttons">
              <Link to="/boats/bastia" className="primary-button">Voir tous les bateaux</Link>
              <Link to="/contact" className="secondary-button">Demander des informations</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bastia;
