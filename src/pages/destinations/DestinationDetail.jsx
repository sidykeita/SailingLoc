import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../assets/css/DestinationDetail.css';
import boatService from '../../services/boat.service';

// Importation des images depuis le dossier destinations
import marseilleHero from '../../assets/images/destinations/marseille.jpeg';
import portoCristoHero from '../../assets/images/destinations/porto-cristo.jpeg';
import bastiaHero from '../../assets/images/destinations/bastia.jpeg';

const destinationsData = {
  marseille: {
    name: 'Marseille',
    heroImage: marseilleHero,
    description: 'Marseille, ville portuaire du sud de la France, est un lieu idéal pour la navigation. Avec sa riche histoire maritime et ses calanques spectaculaires, elle offre des expériences de navigation inoubliables. Explorez les îles du Frioul, la célèbre calanque de Sormiou ou naviguez jusqu\'à Cassis pour une journée parfaite en mer.',
    boatCount: 120,
    attractions: [
      'Les Calanques',
      'Vieux-Port',
      'Notre-Dame de la Garde',
      'Îles du Frioul',
      'Château d\'If'
    ],
    bestSeasons: 'Avril à Octobre',
    averageTemperature: '15°C - 30°C',
    windConditions: 'Mistral fréquent, idéal pour la voile sportive'
  },
  'porto-cristo': {
    name: 'Porto Cristo',
    heroImage: portoCristoHero,
    description: 'Porto Cristo, charmant village de pêcheurs situé sur la côte est de Majorque, est un paradis pour les plaisanciers. Avec ses eaux cristallines et ses criques isolées, c\'est l\'endroit parfait pour jeter l\'ancre et profiter de la Méditerranée. Ne manquez pas les célèbres grottes du Drach à proximité.',
    boatCount: 85,
    attractions: [
      'Grottes du Drach',
      'Plage de Porto Cristo',
      'Cala Anguila',
      'Cala Mendia',
      'Réserve marine de Llevant'
    ],
    bestSeasons: 'Mai à Septembre',
    averageTemperature: '18°C - 32°C',
    windConditions: 'Brises légères à modérées, parfait pour la navigation de plaisance'
  },
  bastia: {
    name: 'Bastia',
    heroImage: bastiaHero,
    description: 'Bastia, ville portuaire historique du nord de la Corse, est un point de départ idéal pour explorer les côtes corses. Avec son vieux port pittoresque et ses plages magnifiques à proximité, elle offre une expérience de navigation authentique en Méditerranée. Naviguez vers le Cap Corse ou les plages sauvages de la côte est.',
    boatCount: 65,
    attractions: [
      'Vieux-Port',
      'Citadelle de Bastia',
      'Cap Corse',
      'Plage de l\'Arinella',
      'Étang de Biguglia'
    ],
    bestSeasons: 'Mai à Octobre',
    averageTemperature: '15°C - 29°C',
    windConditions: 'Vents variables, généralement modérés avec quelques jours de Libeccio'
  }
};

const DestinationDetail = () => {
  const { destinationId } = useParams();
  const destination = destinationsData[destinationId];
  const [dynamicCount, setDynamicCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Normalise le nom à rechercher dans les champs des bateaux
  const searchToken = useMemo(() => (destination?.name || '').trim().toLowerCase(), [destination]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    setDynamicCount(null);

    if (!destination) {
      setLoading(false);
      return;
    }

    boatService
      .getAllBoats()
      .then((boats) => {
        if (!mounted) return;
        const count = Array.isArray(boats)
          ? boats.filter((boat) => {
              const fields = [boat?.location, boat?.city, boat?.port, boat?.destination]
                .filter(Boolean)
                .map((v) => String(v).toLowerCase());
              return fields.some((v) => v.includes(searchToken));
            }).length
          : 0;
        setDynamicCount(count);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Erreur lors du chargement des bateaux");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [searchToken, destination]);

  if (!destination) {
    return (
      <div className="destination-not-found">
        <h2>Destination non trouvée</h2>
        <p>La destination que vous recherchez n'existe pas.</p>
        <Link to="/" className="back-button">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className="destination-detail-page">
      <div className="hero-section" style={{ backgroundImage: `url(${destination.heroImage})` }}>
        <div className="hero-overlay">
          <h1>{destination.name}</h1>
          <p>
            {loading
              ? 'Chargement des bateaux…'
              : error
                ? destination.boatCount + ' bateaux disponibles'
                : `${dynamicCount} bateaux disponibles`}
          </p>
        </div>
      </div>

      <div className="destination-content">
        <div className="container">
          <div className="destination-description">
            <h2>Découvrez {destination.name}</h2>
            <p>{destination.description}</p>
            
            <div className="destination-info-grid">
              <div className="info-card">
                <h3>Points d'intérêt</h3>
                <ul>
                  {destination.attractions.map((attraction, index) => (
                    <li key={index}>{attraction}</li>
                  ))}
                </ul>
              </div>
              
              <div className="info-card">
                <h3>Informations nautiques</h3>
                <p><strong>Meilleure saison:</strong> {destination.bestSeasons}</p>
                <p><strong>Température moyenne:</strong> {destination.averageTemperature}</p>
                <p><strong>Conditions de vent:</strong> {destination.windConditions}</p>
              </div>
            </div>
          </div>
          
          <div className="available-boats">
            <h2>Bateaux disponibles à {destination.name}</h2>
            <div className="cta-buttons">
              <Link to={`/boats?location=${encodeURIComponent(destination.name)}`} className="primary-button">Voir tous les bateaux</Link>
              <Link to="/contact" className="secondary-button">Demander des informations</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
