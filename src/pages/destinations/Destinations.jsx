import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/Destinations.css';
import boatService from '../../services/boat.service';

// Import des images de destinations
import marseilleImage from '../../assets/images/destinations/marseille.jpeg';
import portoCristoImage from '../../assets/images/destinations/porto-cristo.jpeg';
import bastiaImage from '../../assets/images/destinations/bastia.jpeg';
import laRochelleImage from '../../assets/images/la-rochelle.jpeg';
import laCiotatImage from '../../assets/images/destinations/la-ciotat.jpeg';
import alicanteImage from '../../assets/images/destinations/alicante.jpg';
import corfouImage from '../../assets/images/destinations/port-de-corfou-grece.jpg';

const Destinations = () => {
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Liste des destinations avec leurs informations et images (sans boatCount statique)
  const destinationsBase = [
    {
      id: 'marseille',
      name: 'Marseille',
      image: marseilleImage,
    },
    {
      id: 'porto-cristo',
      name: 'Porto Cristo',
      image: portoCristoImage,
    },
    {
      id: 'bastia',
      name: 'Bastia',
      image: bastiaImage,
    },
    {
      id: 'la-rochelle',
      name: 'La Rochelle',
      image: laRochelleImage,
    },
    {
      id: 'la-ciotat',
      name: 'La Ciotat',
      image: laCiotatImage,
    },
    {
      id: 'alicante',
      name: 'Alicante',
      image: alicanteImage,
    },
    {
      id: 'corfou',
      name: 'Corfou',
      image: corfouImage,
    }
  ];

  // Calcul dynamique des compteurs par destination
  const destinations = useMemo(() => {
    return destinationsBase.map((dest) => {
      const token = dest.name.toLowerCase();
      const count = boats.filter((boat) => {
        const fields = [boat?.location, boat?.city, boat?.port, boat?.destination]
          .filter(Boolean)
          .map((v) => String(v).toLowerCase());
        return fields.some((v) => v.includes(token));
      }).length;
      return { ...dest, boatCount: count };
    });
  }, [boats]);

  useEffect(() => {
    // Charger les bateaux depuis l'API ou le cache
    const loadBoats = async () => {
      try {
        // Essayer le cache d'abord
        const cached = localStorage.getItem('boatsCache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed?.boats)) {
            setBoats(parsed.boats);
          }
        }

        // Rafraîchir depuis l'API
        const data = await boatService.getAllBoats();
        if (Array.isArray(data)) {
          setBoats(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des bateaux:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBoats();
  }, []);

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
                  <p>
                    {loading 
                      ? 'Chargement...' 
                      : `${destination.boatCount} bateaux disponibles`}
                  </p>
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
