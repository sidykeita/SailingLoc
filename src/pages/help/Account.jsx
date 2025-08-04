import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faLock, faUserEdit, faIdCard, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function Account() {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#66C7C7', minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <Link to="/help" style={{ color: '#274991', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '10px' }} />
            Retour à l'aide
          </Link>
        </div>

        <h1 style={{ color: '#274991', marginBottom: '20px' }}>Compte et sécurité</h1>
        
        <div style={{ marginBottom: '30px' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#444' }}>
            Cette section vous aide à gérer votre compte SailingLoc et à comprendre nos mesures de sécurité pour protéger vos données personnelles.
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px', borderBottom: '2px solid #66C7C7', paddingBottom: '10px' }}>
            <FontAwesomeIcon icon={faUserEdit} style={{ marginRight: '10px' }} />
            Gestion de votre compte
          </h2>
          <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ color: '#274991', marginBottom: '10px' }}>Création de compte</h3>
            <p style={{ marginBottom: '15px' }}>Pour créer un compte sur SailingLoc, vous devez :</p>
            <ol style={{ lineHeight: '1.6', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '5px' }}>Cliquer sur "S'inscrire" en haut à droite de la page d'accueil</li>
              <li style={{ marginBottom: '5px' }}>Remplir le formulaire avec vos informations personnelles</li>
              <li style={{ marginBottom: '5px' }}>Vérifier votre adresse e-mail en cliquant sur le lien envoyé</li>
              <li style={{ marginBottom: '5px' }}>Compléter votre profil avec les informations supplémentaires requises</li>
            </ol>
          </div>
          <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ color: '#274991', marginBottom: '10px' }}>Modification de votre profil</h3>
            <p style={{ marginBottom: '15px' }}>Vous pouvez modifier vos informations personnelles à tout moment :</p>
            <ol style={{ lineHeight: '1.6', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '5px' }}>Connectez-vous à votre compte</li>
              <li style={{ marginBottom: '5px' }}>Cliquez sur votre nom d'utilisateur en haut à droite</li>
              <li style={{ marginBottom: '5px' }}>Sélectionnez "Mon profil" dans le menu déroulant</li>
              <li style={{ marginBottom: '5px' }}>Cliquez sur "Modifier" pour mettre à jour vos informations</li>
            </ol>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px', borderBottom: '2px solid #66C7C7', paddingBottom: '10px' }}>
            <FontAwesomeIcon icon={faLock} style={{ marginRight: '10px' }} />
            Sécurité de votre compte
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: '1 1 300px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '10px' }}>Mot de passe sécurisé</h3>
              <p>Votre mot de passe doit contenir au moins 8 caractères, incluant des lettres majuscules et minuscules, des chiffres et des caractères spéciaux. Nous vous recommandons de changer votre mot de passe régulièrement.</p>
            </div>
            <div style={{ flex: '1 1 300px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '10px' }}>Authentification à deux facteurs</h3>
              <p>Pour une sécurité renforcée, activez l'authentification à deux facteurs dans les paramètres de votre compte. Vous recevrez un code de vérification par SMS ou e-mail à chaque connexion.</p>
            </div>
          </div>
          <div style={{ marginTop: '20px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ color: '#274991', marginBottom: '10px' }}>Mot de passe oublié</h3>
            <p>Si vous avez oublié votre mot de passe, suivez ces étapes :</p>
            <ol style={{ lineHeight: '1.6', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '5px' }}>Cliquez sur "Se connecter" en haut à droite de la page d'accueil</li>
              <li style={{ marginBottom: '5px' }}>Cliquez sur "Mot de passe oublié"</li>
              <li style={{ marginBottom: '5px' }}>Entrez l'adresse e-mail associée à votre compte</li>
              <li style={{ marginBottom: '5px' }}>Suivez les instructions envoyées par e-mail pour réinitialiser votre mot de passe</li>
            </ol>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px', borderBottom: '2px solid #66C7C7', paddingBottom: '10px' }}>
            <FontAwesomeIcon icon={faIdCard} style={{ marginRight: '10px' }} />
            Vérification d'identité
          </h2>
          <p style={{ marginBottom: '20px' }}>Pour garantir la sécurité de notre communauté, nous vérifions l'identité de tous nos utilisateurs :</p>
          <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ color: '#274991', marginBottom: '10px' }}>Pourquoi vérifier votre identité ?</h3>
            <ul style={{ lineHeight: '1.6', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '5px' }}>Assurer la sécurité des transactions</li>
              <li style={{ marginBottom: '5px' }}>Prévenir la fraude et les usurpations d'identité</li>
              <li style={{ marginBottom: '5px' }}>Établir la confiance entre les propriétaires et les locataires</li>
              <li style={{ marginBottom: '5px' }}>Respecter les obligations légales</li>
            </ul>
          </div>
          <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ color: '#274991', marginBottom: '10px' }}>Comment vérifier votre identité</h3>
            <p>Pour vérifier votre identité, vous devrez fournir :</p>
            <ul style={{ lineHeight: '1.6', paddingLeft: '20px' }}>
              <li style={{ marginBottom: '5px' }}>Une copie de votre pièce d'identité (carte d'identité, passeport)</li>
              <li style={{ marginBottom: '5px' }}>Une photo de vous tenant votre pièce d'identité</li>
              <li style={{ marginBottom: '5px' }}>Un justificatif de domicile de moins de 3 mois</li>
            </ul>
            <p style={{ marginTop: '15px' }}>Ces documents sont traités de manière sécurisée et confidentielle, conformément à notre politique de confidentialité.</p>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px', borderBottom: '2px solid #66C7C7', paddingBottom: '10px' }}>
            <FontAwesomeIcon icon={faUserShield} style={{ marginRight: '10px' }} />
            Protection des données personnelles
          </h2>
          <p style={{ marginBottom: '20px' }}>Chez SailingLoc, nous prenons la protection de vos données personnelles très au sérieux :</p>
          <ul style={{ lineHeight: '1.6', color: '#444', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '10px' }}>
              <strong>Confidentialité</strong> - Vos données personnelles ne sont jamais partagées avec des tiers sans votre consentement explicite.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Sécurité</strong> - Toutes vos données sont stockées sur des serveurs sécurisés avec un cryptage de bout en bout.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Conformité RGPD</strong> - Notre traitement des données est conforme au Règlement Général sur la Protection des Données.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>Droit à l'oubli</strong> - Vous pouvez demander la suppression de vos données à tout moment.
            </li>
          </ul>
          <p style={{ marginTop: '15px' }}>
            Pour plus d'informations, consultez notre <Link to="/legal-notices" style={{ color: '#274991', textDecoration: 'underline' }}>politique de confidentialité</Link>.
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px', borderBottom: '2px solid #66C7C7', paddingBottom: '10px' }}>
            Questions fréquentes sur les comptes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '5px', fontSize: '1.1rem' }}>Comment supprimer mon compte ?</h3>
              <p>Pour supprimer votre compte, connectez-vous, accédez à vos paramètres de compte, puis cliquez sur "Supprimer mon compte". Notez que cette action est irréversible et que toutes vos données seront définitivement supprimées.</p>
            </div>
            <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '5px', fontSize: '1.1rem' }}>Puis-je avoir plusieurs comptes ?</h3>
              <p>Non, chaque utilisateur ne peut avoir qu'un seul compte sur SailingLoc. Cela nous permet de garantir l'intégrité de notre système de vérification d'identité.</p>
            </div>
            <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
              <h3 style={{ color: '#274991', marginBottom: '5px', fontSize: '1.1rem' }}>Que faire si je détecte une activité suspecte sur mon compte ?</h3>
              <p>Si vous remarquez une activité suspecte, changez immédiatement votre mot de passe et contactez notre service client à l'adresse support@sailingloc.com. Nous prendrons les mesures nécessaires pour sécuriser votre compte.</p>
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

export default Account;
