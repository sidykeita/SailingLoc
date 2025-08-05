import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/Destinations.css';

// Import des images de destinations
import marseilleImage from '../../assets/images/destinations/marseille.jpeg';
import portoCristoImage from '../../assets/images/destinations/porto-cristo.jpeg';
import bastiaImage from '../../assets/images/destinations/bastia.jpeg';
import laRochelleImage from '../../assets/images/la-rochelle.jpeg';
import laCiotatImage from '../../assets/images/destinations/la-ciotat.jpeg';
import alicanteImage from '../../assets/images/destinations/alicante.jpg';
import corfouImage from '../../assets/images/destinations/port-de-corfou-grece.jpg';

const Destinations = () => {
  // Liste des destinations avec leurs informations et images placeholder
  const destinations = [
    {
      id: 'marseille',
      name: 'Marseille',
      image: marseilleImage,
      boatCount: 120,
    },
    {
      id: 'porto-cristo',
      name: 'Porto Cristo',
      image: portoCristoImage,
      boatCount: 85,
    },
    {
      id: 'bastia',
      name: 'Bastia',
      image: bastiaImage,
      boatCount: 65,
    },
    {
      id: 'la-rochelle',
      name: 'La Rochelle',
      image: laRochelleImage,
      boatCount: 95,
    },
    {
      id: 'la-ciotat',
      name: 'La Ciotat',
      image: laCiotatImage,
      boatCount: 70,
    },
    {
      id: 'alicante',
      name: 'Alicante',
      image: alicanteImage,
      boatCount: 110,
    },
    {
      id: 'corfou',
      name: 'Corfou',
      image: corfouImage,
      boatCount: 80,
    }
  ];

  return (
    <div className="destinations-page">
      <div className="destinations-hero">
        <div className="destinations-hero-content">
          <h1>Nos destinations</h1>
          <p>Découvrez toutes nos destinations pour votre prochaine aventure en mer</p>
        </div>
      </div>

      <div className="destinations-container">
        <div className="destinations-grid">
          {destinations.map((destination) => (
            <Link 
              to={`/destinations/${destination.id}`} 
              className="destination-card-link" 
              key={destination.id}
            >
              <div className="destination-card">
                <img 
                  src={destination.image} 
                  alt={destination.name} 
                  className="destination-image" 
                />
                <div className="destination-name">{destination.name}</div>
                <div className="destination-overlay">
                  <h3>{destination.name}</h3>
                  <p>{destination.boatCount} bateaux disponibles</p>
                  <span className="destination-link">Explorer</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Destinations;
