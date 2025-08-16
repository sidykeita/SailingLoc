import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShip, faAnchor, faCompass, faLifeRing } from '@fortawesome/free-solid-svg-icons';

const defaultItems = [
  {
    icon: faShip,
    title: 'Flotte moderne et entretenue',
    description: 'Tous nos bateaux sont régulièrement entretenus et répondent aux normes de sécurité les plus strictes.'
  },
  {
    icon: faLifeRing,
    title: 'Assistance 24/7',
    description: 'Notre équipe est disponible à tout moment pour vous accompagner pendant votre location.'
  },
  {
    icon: faCompass,
    title: 'Conseils personnalisés',
    description: 'Profitez de notre expertise locale pour choisir le bateau idéal et découvrir les plus beaux mouillages.'
  }
];

const PourquoiLouerSection = ({ title = 'Pourquoi louer avec SailingLoc ?', items = defaultItems }) => (
  <div className="info-section">
    <h2 className="text-2xl font-semibold text-[#274991] mb-6 text-center">{title}</h2>
    <div className="info-grid">
      {items.map((item, idx) => (
        <div className="info-card" key={idx}>
          <FontAwesomeIcon icon={item.icon} className="info-icon" />
          <h3 className="text-lg font-semibold text-[#274991] mb-2">{item.title}</h3>
          <p className="text-gray-600">{item.description}</p>
        </div>
      ))}
    </div>
  </div>
);

export default PourquoiLouerSection;
