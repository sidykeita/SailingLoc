import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/LegalNotices.css';

function LegalNotices() {
  return (
    <div className="legal-notices-page">
      <div className="legal-container">
        <div className="legal-content">
          <div className="legal-header">
            <h1>Mentions légales</h1>
            <p>Plateforme SailingLoc - Location de bateaux en ligne</p>
            <div className="back-link">
              <Link to="/">&larr; Retour à l'accueil</Link>
            </div>
          </div>
          
          <div className="legal-section">
            <h2>1. IDENTIFICATION DE L'ÉDITEUR</h2>
            <div className="contact-info">
              <p><strong>Raison sociale :</strong> SailingLoc SAS</p>
              <p><strong>Forme juridique :</strong> Société par Actions Simplifiée</p>
              <p><strong>Capital social :</strong> 50 000 €</p>
              <p><strong>Numéro SIRET :</strong> 123 456 789 00010</p>
              <p><strong>Code APE :</strong> 7712Z (Location et location-bail d'autres biens personnels et domestiques)</p>
              <p><strong>Numéro TVA intracommunautaire :</strong> FR12345678901</p>
              <p><strong>Adresse du siège social :</strong> Port de Plaisance, Quai des Minimes, 17000 La Rochelle, France</p>
              <p><strong>Téléphone :</strong> 05 46 12 34 56</p>
              <p><strong>Email :</strong> contact@sailingloc.fr</p>
              <p><strong>Directeur de la publication :</strong> Jean Dupont</p>
            </div>
          </div>
          
          <div className="legal-section">
            <h2>2. HÉBERGEMENT DU SITE</h2>
            <p><strong>Hébergeur :</strong> OVH SAS</p>
            <p><strong>Adresse :</strong> 2 rue Kellermann, 59100 Roubaix, France</p>
            <p><strong>Téléphone :</strong> 09 72 10 10 10</p>
          </div>
          
          <div className="legal-section">
            <h2>3. OBJET DU SITE</h2>
            <p>Le site SailingLoc est une plateforme numérique de mise en relation entre propriétaires de bateaux (voiliers et bateaux à moteur) et locataires particuliers ou professionnels.</p>
            
            <h3>3.1 Services proposés</h3>
            <ul>
              <li>Mise en ligne d'annonces de location de bateaux</li>
              <li>Système de recherche et de filtrage des embarcations</li>
              <li>Gestion des réservations en ligne</li>
              <li>Système de paiement sécurisé</li>
              <li>Service client et assistance technique</li>
              <li>Système d'évaluation et de commentaires</li>
            </ul>
          </div>
          
          <div className="legal-section">
            <h2>4. CONDITIONS D'UTILISATION</h2>
            
            <h3>4.1 Accès au service</h3>
            <p>L'accès au site SailingLoc est gratuit pour la consultation. L'inscription est nécessaire pour effectuer une réservation ou proposer un bateau à la location.</p>
            
            <h3>4.2 Responsabilités</h3>
            <p>SailingLoc agit en qualité d'intermédiaire entre les propriétaires et les locataires. La société ne peut être tenue responsable :</p>
            <ul>
              <li>De l'état des embarcations proposées à la location</li>
              <li>Des incidents survenus pendant la location</li>
              <li>De la véracité des informations fournies par les utilisateurs</li>
              <li>Des conditions météorologiques</li>
            </ul>
            
            <div className="important-notice">
              <p><strong>Important :</strong> Chaque utilisateur doit s'assurer de disposer des assurances nécessaires et des qualifications requises pour la navigation.</p>
            </div>
          </div>
          
          <div className="legal-section">
            <h2>5. PROTECTION DES DONNÉES PERSONNELLES (RGPD)</h2>
            
            <h3>5.1 Responsable de traitement</h3>
            <p>SailingLoc SAS est responsable du traitement des données personnelles collectées sur la plateforme.</p>
            
            <h3>5.2 Données collectées</h3>
            <ul>
              <li>Données d'identification (nom, prénom, email, téléphone)</li>
              <li>Données de navigation et d'utilisation du site</li>
              <li>Données de paiement (via prestataires sécurisés)</li>
              <li>Données de géolocalisation (avec consentement)</li>
              <li>Photos et documents justificatifs</li>
            </ul>
            
            <h3>5.3 Finalités du traitement</h3>
            <ul>
              <li>Gestion des comptes utilisateurs</li>
              <li>Traitement des réservations</li>
              <li>Service client et support technique</li>
              <li>Amélioration des services</li>
              <li>Respect des obligations légales</li>
            </ul>
            
            <h3>5.4 Droits des utilisateurs</h3>
            <p>Conformément au RGPD, les utilisateurs disposent des droits suivants :</p>
            <ul>
              <li>Droit d'accès aux données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit à la portabilité</li>
              <li>Droit d'opposition</li>
              <li>Droit de limitation du traitement</li>
            </ul>
            
            <p>Pour exercer ces droits : <strong>dpo@sailingloc.fr</strong></p>
          </div>
          
          <div className="legal-section">
            <h2>6. PROPRIÉTÉ INTELLECTUELLE</h2>
            
            <h3>6.1 Droits de SailingLoc</h3>
            <p>Tous les éléments du site (textes, images, logos, design, code source) sont protégés par le droit d'auteur et appartiennent à SailingLoc ou à ses partenaires.</p>
            
            <h3>6.2 Contenus utilisateurs</h3>
            <p>Les utilisateurs conservent leurs droits sur les contenus qu'ils publient (photos, descriptions) mais accordent à SailingLoc une licence d'utilisation dans le cadre du service.</p>
          </div>
          
          <div className="legal-section">
            <h2>7. COOKIES ET TECHNOLOGIES SIMILAIRES</h2>
            
            <h3>7.1 Types de cookies utilisés</h3>
            <ul>
              <li><strong>Cookies techniques :</strong> Nécessaires au fonctionnement du site</li>
              <li><strong>Cookies analytiques :</strong> Mesure d'audience (Google Analytics)</li>
              <li><strong>Cookies de personnalisation :</strong> Préférences utilisateur</li>
              <li><strong>Cookies publicitaires :</strong> Publicités ciblées (avec consentement)</li>
            </ul>
            
            <h3>7.2 Gestion des cookies</h3>
            <p>L'utilisateur peut configurer ses préférences cookies via le bandeau de consentement ou les paramètres de son navigateur.</p>
          </div>
          
          <div className="legal-section">
            <h2>8. ASSURANCES ET RESPONSABILITÉS</h2>
            
            <div className="important-notice">
              <p><strong>Obligation d'assurance :</strong> Tous les bateaux proposés à la location doivent être couverts par une assurance responsabilité civile et coque valide.</p>
            </div>
            
            <h3>8.1 Assurance plateforme</h3>
            <p>SailingLoc dispose d'une assurance responsabilité civile professionnelle couvrant son activité d'intermédiaire.</p>
            
            <h3>8.2 Vérifications</h3>
            <p>SailingLoc s'engage à vérifier la validité des documents d'assurance fournis par les propriétaires.</p>
          </div>
          
          <div className="legal-section">
            <h2>9. DROIT APPLICABLE ET JURIDICTIONS</h2>
            
            <h3>9.1 Droit applicable</h3>
            <p>Les présentes mentions légales sont soumises au droit français.</p>
            
            <h3>9.2 Règlement des litiges</h3>
            <p>En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux français seront compétents.</p>
            
            <h3>9.3 Médiation</h3>
            <p>Conformément à la réglementation, SailingLoc adhère à un service de médiation de la consommation.</p>
          </div>
          
          <div className="legal-section">
            <h2>10. CONTACT ET RÉCLAMATIONS</h2>
            
            <div className="contact-info">
              <p><strong>Service client :</strong> support@sailingloc.fr</p>
              <p><strong>Réclamations :</strong> reclamations@sailingloc.fr</p>
              <p><strong>Protection des données :</strong> dpo@sailingloc.fr</p>
              <p><strong>Téléphone :</strong> 05 46 12 34 56</p>
              <p><strong>Horaires :</strong> Du lundi au vendredi, 9h-18h</p>
            </div>
          </div>
          
          <div className="legal-footer">
            <p><strong>Document créé le :</strong> 09/08/2025</p>
            <p><strong>Dernière mise à jour :</strong> 09/08/2025</p>
            <p><em>Ces mentions légales sont susceptibles d'être modifiées. La version en vigueur est celle publiée sur le site.</em></p>
          </div>
        </div>
        
        <div className="navigation-footer">
          <p>&copy; 2025 SailingLoc. Tous droits réservés.</p>
          <div className="nav-links">
            <Link to="/">Accueil</Link>
            <Link to="/legal-notices" className="active">Mentions légales</Link>
            <Link to="/boats/sailing">Voiliers</Link>
            <Link to="/boats/motor">Bateaux à moteur</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LegalNotices;
