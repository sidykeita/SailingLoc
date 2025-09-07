import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../assets/css/DestinationDetail.css';
import boatService from '../../services/boat.service';

// Importation des images depuis le dossier destinations
import marseilleHero from '../../assets/images/destinations/marseille.jpeg';
import portoCristoHero from '../../assets/images/destinations/porto-cristo.jpeg';
import bastiaHero from '../../assets/images/destinations/bastia.jpeg';
import laRochelleHero from '../../assets/images/destinations/la-rochelle.jpeg';
import laCiotatHero from '../../assets/images/destinations/la-ciotat.jpeg';
import alicanteHero from '../../assets/images/destinations/alicante.jpg';
import corfouHero from '../../assets/images/destinations/port-de-corfou-grece.jpg';

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
  },
  'la-rochelle': {
    name: 'La Rochelle',
    heroImage: laRochelleHero,
    description: 'La Rochelle, port historique de la côte atlantique française, est une destination prisée des navigateurs. Avec ses tours médiévales gardant l\'entrée du port et ses îles environnantes, elle offre un cadre exceptionnel pour la navigation. Explorez l\'île de Ré, l\'île d\'Oléron ou naviguez vers les côtes vendéennes.',
    boatCount: 95,
    attractions: [
      'Vieux-Port',
      'Tours de La Rochelle',
      'Île de Ré',
      'Île d\'Oléron',
      'Aquarium de La Rochelle'
    ],
    bestSeasons: 'Avril à Octobre',
    averageTemperature: '12°C - 25°C',
    windConditions: 'Vents d\'ouest dominants, idéal pour la navigation hauturière'
  },
  'la-ciotat': {
    name: 'La Ciotat',
    heroImage: laCiotatHero,
    description: 'La Ciotat, charmante ville portuaire des Bouches-du-Rhône, est réputée pour ses calanques spectaculaires et son patrimoine maritime. Entre Marseille et Toulon, elle offre un accès privilégié aux plus belles criques de la Méditerranée. Découvrez les calanques de Figuerolles et du Mugel.',
    boatCount: 70,
    attractions: [
      'Calanques de Figuerolles',
      'Parc du Mugel',
      'Vieux-Port',
      'Île Verte',
      'Eden Théâtre'
    ],
    bestSeasons: 'Mai à Septembre',
    averageTemperature: '16°C - 28°C',
    windConditions: 'Mistral modéré, conditions idéales pour la navigation côtière'
  },
  alicante: {
    name: 'Alicante',
    heroImage: alicanteHero,
    description: 'Alicante, joyau de la Costa Blanca en Espagne, est une destination idéale pour les amateurs de navigation. Avec son climat méditerranéen ensoleillé presque toute l\'année, ses plages de sable fin et ses eaux cristallines, elle offre des conditions parfaites pour la navigation de plaisance.',
    boatCount: 110,
    attractions: [
      'Château de Santa Bárbara',
      'Plage de San Juan',
      'Île de Tabarca',
      'Port d\'Alicante',
      'Explanada de España'
    ],
    bestSeasons: 'Mars à Novembre',
    averageTemperature: '18°C - 32°C',
    windConditions: 'Brises thermiques régulières, parfait pour tous niveaux'
  },
  corfou: {
    name: 'Corfou',
    heroImage: corfouHero,
    description: 'Corfou, perle des îles Ioniennes en Grèce, est un paradis pour les navigateurs. Avec ses eaux turquoise, ses baies protégées et son riche patrimoine vénitien, elle offre une expérience de navigation unique en Méditerranée orientale. Explorez les côtes albanaises ou naviguez vers les autres îles Ioniennes.',
    boatCount: 80,
    attractions: [
      'Vieille ville de Corfou',
      'Palais d\'Achilleion',
      'Canal d\'Amour',
      'Baie de Paleokastritsa',
      'Île de Paxos'
    ],
    bestSeasons: 'Avril à Octobre',
    averageTemperature: '16°C - 30°C',
    windConditions: 'Vents étésiens en été, conditions clémentes au printemps et automne'
  }
};

const DestinationDetail = () => {
  const { destinationId } = useParams();
  const destination = destinationsData[destinationId];
  const [dynamicCount, setDynamicCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Nom lisible de la destination
  const destinationName = useMemo(() => (destination?.name || '').trim(), [destination]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    if (!destination) {
      setLoading(false);
      return;
    }

    // 1) Essaye d'afficher immédiatement un compteur depuis le cache local
    try {
      const raw = localStorage.getItem('boatsCache');
      if (raw) {
        const parsed = JSON.parse(raw);
        const boats = Array.isArray(parsed?.boats) ? parsed.boats : [];
        const token = destinationName.toLowerCase();
        const cachedCount = boats.filter((boat) => {
          const fields = [boat?.location, boat?.city, boat?.port, boat?.destination]
            .filter(Boolean)
            .map((v) => String(v).toLowerCase());
          return fields.some((v) => v.includes(token));
        }).length;
        if (mounted) setDynamicCount(cachedCount);
      }
    } catch (_) { /* ignore parse errors */ }

    // 2) Rafraîchir depuis l'API pour avoir la valeur la plus à jour (filtré côté backend si possible)
    boatService
      .getAllBoats({ location: destinationName })
      .then((boats) => {
        if (!mounted) return;
        const count = Array.isArray(boats) ? boats.length : (Array.isArray(boats?.data) ? boats.data.length : 0);
        setDynamicCount(count);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Erreur lors du chargement des bateaux");
        // Si pas de cache précédent, on force un 0 plutôt qu'une valeur statique trompeuse
        setDynamicCount((prev) => (prev === null ? 0 : prev));
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [destinationName, destination]);

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
            {dynamicCount !== null ? `${dynamicCount} bateaux disponibles` : 'Chargement des bateaux…'}
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
