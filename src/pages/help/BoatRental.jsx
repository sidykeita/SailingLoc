import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShip, faAnchor, faWater, faLifeRing, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function BoatRental() {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#66C7C7', minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <Link to="/help" style={{ color: '#274991', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '10px' }} />
            Retour à l'aide
          </Link>
        </div>

        <h1 style={{ color: '#274991', marginBottom: '20px' }}>Location de bateaux</h1>
        
        <div style={{ marginBottom: '30px' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#444' }}>
            Bienvenue dans notre section d'aide dédiée à la location de bateaux. Vous trouverez ici toutes les informations nécessaires pour louer un bateau sur SailingLoc.
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px', borderBottom: '2px solid #66C7C7', paddingBottom: '10px' }}>
            <FontAwesomeIcon icon={faShip} style={{ marginRight: '10px' }} />
            Types de bateaux disponibles
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: '1 1 300px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '10px' }}>Bateaux à moteur</h3>
              <p>Parfaits pour les excursions à la journée et les activités nautiques. Idéal pour les débutants et les familles.</p>
              <Link to="/boats/motor" style={{ color: '#274991', textDecoration: 'none', fontWeight: 'bold' }}>
                Voir les bateaux à moteur
              </Link>
            </div>
            <div style={{ flex: '1 1 300px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '10px' }}>Voiliers</h3>
              <p>Pour les amateurs de navigation traditionnelle et les voyages plus longs. Expérience de navigation requise.</p>
              <Link to="/boats/sailing" style={{ color: '#274991', textDecoration: 'none', fontWeight: 'bold' }}>
                Voir les voiliers
              </Link>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px', borderBottom: '2px solid #66C7C7', paddingBottom: '10px' }}>
            <FontAwesomeIcon icon={faAnchor} style={{ marginRight: '10px' }} />
            Comment louer un bateau
          </h2>
          <ol style={{ lineHeight: '1.6', color: '#444', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '10px' }}>
              <strong>Recherchez un bateau</strong> - Utilisez notre moteur de recherche pour trouver un bateau qui correspond à vos critères (lieu, dates, type de bateau).
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Consultez les détails</strong> - Vérifiez les caractéristiques du bateau, les photos, les avis et les disponibilités.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Réservez vos dates</strong> - Sélectionnez vos dates de location et les options supplémentaires souhaitées.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Effectuez le paiement</strong> - Procédez au paiement sécurisé pour confirmer votre réservation.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Recevez votre confirmation</strong> - Un email de confirmation vous sera envoyé avec tous les détails de votre location.
            </li>
          </ol>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px', borderBottom: '2px solid #66C7C7', paddingBottom: '10px' }}>
            <FontAwesomeIcon icon={faWater} style={{ marginRight: '10px' }} />
            Conditions de location
          </h2>
          <ul style={{ lineHeight: '1.6', color: '#444', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '10px' }}>
              <strong>Âge minimum</strong> - Vous devez être âgé d'au moins 18 ans pour louer un bateau.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Permis bateau</strong> - Un permis bateau valide est requis pour les bateaux à moteur de plus de 6 CV.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Pièce d'identité</strong> - Une pièce d'identité valide sera demandée lors de la prise en charge du bateau.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Caution</strong> - Une caution sera demandée avant la prise en charge du bateau, remboursable à la fin de la location si aucun dommage n'est constaté.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Assurance</strong> - Tous nos bateaux sont assurés, mais des options d'assurance supplémentaires sont disponibles.
            </li>
          </ul>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px', borderBottom: '2px solid #66C7C7', paddingBottom: '10px' }}>
            <FontAwesomeIcon icon={faLifeRing} style={{ marginRight: '10px' }} />
            Questions fréquentes sur la location
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '5px', fontSize: '1.1rem' }}>Puis-je louer un bateau sans permis ?</h3>
              <p>Oui, certains bateaux à moteur de moins de 6 CV peuvent être loués sans permis. Ces bateaux sont clairement identifiés dans notre catalogue.</p>
            </div>
            <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '5px', fontSize: '1.1rem' }}>Quelle est la durée minimale de location ?</h3>
              <p>La durée minimale varie selon les propriétaires, mais elle est généralement d'une demi-journée pour les bateaux à moteur et d'une journée pour les voiliers.</p>
            </div>
            <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '5px', fontSize: '1.1rem' }}>Le carburant est-il inclus dans le prix ?</h3>
              <p>Le carburant n'est généralement pas inclus dans le prix de la location. Le bateau est fourni avec un réservoir plein et doit être rendu avec un réservoir plein.</p>
            </div>
            <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '5px', fontSize: '1.1rem' }}>Puis-je annuler ma réservation ?</h3>
              <p>Oui, vous pouvez annuler votre réservation selon les conditions d'annulation choisies par le propriétaire. Ces conditions sont clairement indiquées sur la page de chaque bateau.</p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/boats/motor" style={{ 
            backgroundColor: '#274991', 
            color: 'white', 
            padding: '12px 25px', 
            borderRadius: '4px', 
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'inline-block'
          }}>
            Explorer les bateaux disponibles
          </Link>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #ccc', paddingTop: '20px', textAlign: 'center', marginTop: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <p>&copy; 2025 SailingLoc. Tous droits réservés.</p>
        <div style={{ marginTop: '10px' }}>
          <Link to="/" style={{ color: '#274991', margin: '0 10px' }}>Accueil</Link>
          <Link to="/legal-notices" style={{ color: '#274991', margin: '0 10px' }}>Mentions légales</Link>
          <Link to="/cgu-cgv" style={{ color: '#274991', margin: '0 10px' }}>CGU / CGV</Link>
        </div>
      </div>
    </div>
  );
}

export default BoatRental;
