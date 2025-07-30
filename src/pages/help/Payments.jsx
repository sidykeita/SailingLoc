import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faMoneyBillWave, faExchangeAlt, faShieldAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function Payments() {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#66C7C7', minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <Link to="/help" style={{ color: '#274991', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '10px' }} />
            Retour à l'aide
          </Link>
        </div>

        <h1 style={{ color: '#274991', marginBottom: '20px' }}>Paiements et remboursements</h1>
        
        <div style={{ marginBottom: '30px' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#444' }}>
            Cette section vous aide à comprendre comment fonctionnent les paiements et les remboursements sur SailingLoc.
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px', borderBottom: '2px solid #66C7C7', paddingBottom: '10px' }}>
            <FontAwesomeIcon icon={faCreditCard} style={{ marginRight: '10px' }} />
            Méthodes de paiement acceptées
          </h2>
          <p style={{ marginBottom: '20px' }}>Sur SailingLoc, nous acceptons plusieurs méthodes de paiement pour vous offrir flexibilité et sécurité :</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: '1 1 200px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '10px' }}>Cartes bancaires</h3>
              <p>Visa, Mastercard, American Express, Carte Bleue</p>
            </div>
            <div style={{ flex: '1 1 200px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '10px' }}>Portefeuilles électroniques</h3>
              <p>PayPal, Apple Pay, Google Pay</p>
            </div>
            <div style={{ flex: '1 1 200px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '10px' }}>Virements bancaires</h3>
              <p>Pour les réservations à long terme uniquement</p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px', borderBottom: '2px solid #66C7C7', paddingBottom: '10px' }}>
            <FontAwesomeIcon icon={faMoneyBillWave} style={{ marginRight: '10px' }} />
            Processus de paiement
          </h2>
          <ol style={{ lineHeight: '1.6', color: '#444', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '10px' }}>
              <strong>Réservation</strong> - Lorsque vous réservez un bateau, un acompte de 30% du montant total est demandé pour confirmer votre réservation.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Paiement du solde</strong> - Le solde (70% restants) doit être payé au plus tard 30 jours avant la date de début de la location.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Réservation de dernière minute</strong> - Pour les réservations effectuées moins de 30 jours avant la date de début, le paiement intégral est requis immédiatement.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Caution</strong> - Une caution sera demandée avant la prise en charge du bateau, généralement par pré-autorisation sur votre carte bancaire.
            </li>
          </ol>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px', borderBottom: '2px solid #66C7C7', paddingBottom: '10px' }}>
            <FontAwesomeIcon icon={faExchangeAlt} style={{ marginRight: '10px' }} />
            Politique de remboursement
          </h2>
          <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ color: '#274991', marginBottom: '10px' }}>Annulation par le locataire</h3>
            <ul style={{ lineHeight: '1.6', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '5px' }}>Plus de 60 jours avant le départ : remboursement de 100% de l'acompte</li>
              <li style={{ marginBottom: '5px' }}>Entre 60 et 30 jours avant le départ : remboursement de 50% de l'acompte</li>
              <li style={{ marginBottom: '5px' }}>Moins de 30 jours avant le départ : aucun remboursement de l'acompte</li>
              <li style={{ marginBottom: '5px' }}>Moins de 7 jours avant le départ : aucun remboursement du montant total</li>
            </ul>
          </div>
          <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ color: '#274991', marginBottom: '10px' }}>Annulation par le propriétaire</h3>
            <p>En cas d'annulation par le propriétaire du bateau, vous serez intégralement remboursé, quelle que soit la date d'annulation. SailingLoc vous proposera également des alternatives similaires si disponibles.</p>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px', borderBottom: '2px solid #66C7C7', paddingBottom: '10px' }}>
            <FontAwesomeIcon icon={faShieldAlt} style={{ marginRight: '10px' }} />
            Sécurité des paiements
          </h2>
          <p style={{ marginBottom: '20px' }}>Chez SailingLoc, nous prenons la sécurité de vos paiements très au sérieux :</p>
          <ul style={{ lineHeight: '1.6', color: '#444', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '10px' }}>
              <strong>Cryptage SSL</strong> - Toutes les transactions sont protégées par un cryptage SSL 256 bits.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Conformité PCI DSS</strong> - Notre plateforme est conforme aux normes de sécurité PCI DSS.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Protection contre la fraude</strong> - Nous utilisons des systèmes avancés de détection de fraude.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Paiement sécurisé</strong> - Les fonds ne sont versés au propriétaire qu'après le début de votre location.
            </li>
          </ul>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px', borderBottom: '2px solid #66C7C7', paddingBottom: '10px' }}>
            Questions fréquentes sur les paiements
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '5px', fontSize: '1.1rem' }}>Quand ma caution sera-t-elle remboursée ?</h3>
              <p>La caution est généralement remboursée dans les 7 jours suivant la fin de la location, après vérification de l'état du bateau.</p>
            </div>
            <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '5px', fontSize: '1.1rem' }}>Puis-je payer en plusieurs fois ?</h3>
              <p>Oui, pour les réservations effectuées plus de 60 jours avant le départ, vous pouvez payer en deux fois : 30% à la réservation et le solde 30 jours avant le départ.</p>
            </div>
            <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '5px', fontSize: '1.1rem' }}>Que se passe-t-il en cas de dommages au bateau ?</h3>
              <p>En cas de dommages, le coût des réparations sera déduit de votre caution. Si les dommages dépassent le montant de la caution, vous serez facturé pour la différence.</p>
            </div>
            <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '5px', fontSize: '1.1rem' }}>Les frais de nettoyage sont-ils inclus ?</h3>
              <p>Les frais de nettoyage standard sont généralement inclus dans le prix de la location. Cependant, un nettoyage supplémentaire peut être facturé si le bateau est rendu dans un état excessivement sale.</p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/help" style={{ 
            backgroundColor: '#274991', 
            color: 'white', 
            padding: '12px 25px', 
            borderRadius: '4px', 
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'inline-block'
          }}>
            Retour à la page d'aide
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

export default Payments;
