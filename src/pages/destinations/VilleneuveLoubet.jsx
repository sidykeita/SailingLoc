import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/DestinationDetail.css';

// Importation des images depuis le dossier destinations
import villeneuveLoubetHero from '../../assets/images/destinations/villeneuveloubet-france.jpg';

const VilleneuveLoubet = () => {
  return (
    <div className="destination-detail-page">
      <div className="hero-section" style={{ backgroundImage: `url(${villeneuveLoubetHero})` }}>
        <div className="hero-overlay">
          <h1>Villeneuve-Loubet</h1>
          <p>60 bateaux disponibles</p>
        </div>
      </div>

      <div className="destination-content">
        <div className="container">
          <div className="destination-description">
            <h2>Découvrez Villeneuve-Loubet</h2>
            <p>
              Villeneuve-Loubet, située sur la Côte d'Azur française entre Nice et Cannes, 
              est une destination idéale pour les amateurs de nautisme. Son port de Marina Baie des Anges, 
              avec son architecture distinctive en forme de vagues, offre un point de départ parfait pour 
              explorer la magnifique côte méditerranéenne. Naviguez vers les îles de Lérins ou le long de 
              la côte pour découvrir les célèbres villes de la Riviera française.
            </p>
            
            <div className="destination-info-grid">
              <div className="info-card">
                <h3>Points d'intérêt</h3>
                <ul>
                  <li>Marina Baie des Anges</li>
                  <li>Plage de Villeneuve-Loubet</li>
                  <li>Îles de Lérins</li>
                  <li>Cap d'Antibes</li>
                  <li>Parc naturel de Vaugrenier</li>
                </ul>
              </div>
              
              <div className="info-card">
                <h3>Informations nautiques</h3>
                <p><strong>Meilleure saison:</strong> Mai à Septembre</p>
                <p><strong>Température moyenne:</strong> 17°C - 28°C</p>
                <p><strong>Conditions de vent:</strong> Brises côtières modérées, idéales pour la navigation de plaisance</p>
              </div>
            </div>
          </div>
          
          <div className="available-boats">
            <h2>Bateaux disponibles à Villeneuve-Loubet</h2>
            <div className="cta-buttons">
              <Link to="/boats?location=villeneuve-loubet" className="primary-button">Voir tous les bateaux</Link>
              <Link to="/contact" className="secondary-button">Demander des informations</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VilleneuveLoubet;
