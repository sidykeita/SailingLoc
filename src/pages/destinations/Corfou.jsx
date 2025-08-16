import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/DestinationDetail.css';

// Importation des images depuis le dossier destinations
import corfouHero from '../../assets/images/destinations/port-de-corfou-grece.jpg';

const Corfou = () => {
  return (
    <div className="destination-detail-page">
      <div className="hero-section" style={{ backgroundImage: `url(${corfouHero})` }}>
        <div className="hero-overlay">
          <h1>Corfou</h1>
          <p>75 bateaux disponibles</p>
        </div>
      </div>

      <div className="destination-content">
        <div className="container">
          <div className="destination-description">
            <h2>Découvrez Corfou</h2>
            <p>
              Corfou, perle de la mer Ionienne en Grèce, est un paradis pour les navigateurs. 
              Avec ses eaux d'un bleu profond, ses criques secrètes et ses villages pittoresques, 
              l'île offre une expérience de navigation inoubliable. Explorez la côte est avec ses 
              plages de galets, ou naviguez vers les îlots voisins de Paxos et Antipaxos pour 
              découvrir des grottes marines spectaculaires et des eaux turquoise.
            </p>
            
            <div className="destination-info-grid">
              <div className="info-card">
                <h3>Points d'intérêt</h3>
                <ul>
                  <li>Vieille ville de Corfou (UNESCO)</li>
                  <li>Baie de Paleokastritsa</li>
                  <li>Canal d'amour à Sidari</li>
                  <li>Îles de Paxos et Antipaxos</li>
                  <li>Plage de Porto Timoni</li>
                </ul>
              </div>
              
              <div className="info-card">
                <h3>Informations nautiques</h3>
                <p><strong>Meilleure saison:</strong> Mai à Septembre</p>
                <p><strong>Température moyenne:</strong> 20°C - 32°C</p>
                <p><strong>Conditions de vent:</strong> Vents du nord-ouest modérés en été, parfaits pour la navigation</p>
              </div>
            </div>
          </div>
          
          <div className="available-boats">
            <h2>Bateaux disponibles à Corfou</h2>
            <div className="cta-buttons">
              <Link to="/boats?location=corfou" className="primary-button">Voir tous les bateaux</Link>
              <Link to="/contact" className="secondary-button">Demander des informations</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Corfou;
