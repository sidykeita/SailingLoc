import React from 'react';
import { Link } from 'react-router-dom';

function CGUCGV() {
  return (
    <div style={{ padding: '20px', paddingTop: '100px', width: '100%', backgroundColor: '#66C7C7', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h1 style={{ 
          color: '#274991', 
          marginBottom: '20px', 
          textAlign: 'center',
          position: 'relative',
          paddingBottom: '15px'
        }}>
          Conditions Générales d'Utilisation et de Vente
          <span style={{
            content: '""',
            position: 'absolute',
            bottom: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '3px',
            backgroundColor: '#66C7C7',
            display: 'block'
          }}></span>
        </h1>
        
        <div style={{ marginBottom: '20px' }}>
          <Link to="/" style={{ color: '#274991', textDecoration: 'none' }}>
            &larr; Retour à l'accueil
          </Link>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px' }}>1. Dispositions générales</h2>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            Les présentes Conditions Générales d'Utilisation et de Vente (ci-après dénommées "CGU/CGV") régissent l'utilisation du site internet SailingLoc 
            (ci-après dénommé "le Site") et les relations contractuelles entre SailingLoc SAS (ci-après dénommée "SailingLoc") et les utilisateurs du Site 
            (ci-après dénommés "l'Utilisateur" ou "les Utilisateurs").
          </p>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            L'utilisation du Site implique l'acceptation pleine et entière des présentes CGU/CGV. SailingLoc se réserve le droit de modifier 
            à tout moment les CGU/CGV en publiant une nouvelle version sur le Site. Les CGU/CGV applicables sont celles en vigueur à la date 
            d'utilisation du Site.
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px' }}>2. Services proposés</h2>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            SailingLoc est une plateforme de mise en relation entre particuliers pour la location de bateaux. SailingLoc agit en qualité 
            d'intermédiaire et permet aux propriétaires de bateaux (ci-après dénommés "les Propriétaires") de proposer leurs bateaux à la 
            location à des locataires (ci-après dénommés "les Locataires").
          </p>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            SailingLoc n'est pas partie au contrat de location conclu entre le Propriétaire et le Locataire. SailingLoc ne peut être tenue 
            responsable de l'exécution ou de l'inexécution du contrat de location.
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px' }}>3. Inscription et compte utilisateur</h2>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            Pour pouvoir utiliser certains services du Site, l'Utilisateur doit créer un compte utilisateur. L'Utilisateur s'engage à fournir 
            des informations exactes, complètes et à jour. L'Utilisateur est seul responsable de la confidentialité de ses identifiants de connexion 
            et de toutes les activités effectuées depuis son compte.
          </p>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            SailingLoc se réserve le droit de suspendre ou de supprimer un compte utilisateur en cas de violation des présentes CGU/CGV ou en cas 
            d'activités frauduleuses ou illégales.
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px' }}>4. Conditions de location</h2>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            <strong>4.1 Pour les Propriétaires</strong><br />
            Le Propriétaire s'engage à fournir des informations exactes et complètes sur son bateau. Le Propriétaire garantit qu'il est légalement 
            autorisé à proposer son bateau à la location et que celui-ci est conforme aux normes de sécurité en vigueur.
          </p>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            <strong>4.2 Pour les Locataires</strong><br />
            Le Locataire s'engage à utiliser le bateau loué conformément à sa destination et dans le respect des règles de navigation. Le Locataire 
            doit posséder les permis et qualifications nécessaires pour la conduite du bateau loué.
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px' }}>5. Tarifs et paiements</h2>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            Les prix des locations sont indiqués en euros, toutes taxes comprises. SailingLoc perçoit une commission sur chaque transaction réalisée 
            via le Site. Cette commission est incluse dans le prix affiché sur le Site.
          </p>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            Le paiement s'effectue en ligne par carte bancaire ou par tout autre moyen de paiement proposé sur le Site. Le paiement est sécurisé 
            et les données bancaires de l'Utilisateur ne sont pas conservées par SailingLoc.
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px' }}>6. Annulation et remboursement</h2>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            Les conditions d'annulation et de remboursement dépendent de la politique choisie par le Propriétaire. Ces conditions sont indiquées 
            sur la page de chaque bateau avant la validation de la réservation.
          </p>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            En cas d'annulation par le Propriétaire, le Locataire est intégralement remboursé. En cas d'annulation par le Locataire, les conditions 
            de remboursement dépendent de la date d'annulation par rapport à la date de début de la location.
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px' }}>7. Responsabilité et assurance</h2>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            SailingLoc propose une assurance pour couvrir les dommages éventuels causés au bateau pendant la période de location. Les conditions 
            de cette assurance sont détaillées lors de la réservation.
          </p>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            SailingLoc ne peut être tenue responsable des dommages directs ou indirects résultant de l'utilisation du Site ou des services proposés.
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px' }}>8. Droit applicable et juridiction compétente</h2>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            Les présentes CGU/CGV sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#274991', marginBottom: '15px' }}>9. Contact</h2>
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            Pour toute question relative aux présentes CGU/CGV, vous pouvez contacter SailingLoc à l'adresse suivante :<br />
            SailingLoc SAS<br />
            Port de Plaisance, Quai des Minimes<br />
            17000 La Rochelle, France<br />
            Email : contact@sailingloc.com
          </p>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #ccc', paddingTop: '20px', textAlign: 'center', marginTop: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <p>&copy; 2025 SailingLoc. Tous droits réservés.</p>
        <div style={{ marginTop: '10px' }}>
          <Link to="/" style={{ color: '#274991', margin: '0 10px' }}>Accueil</Link>
          <Link to="/legal-notices" style={{ color: '#274991', margin: '0 10px' }}>Mentions légales</Link>
          <Link to="/cgu-cgv" style={{ color: '#274991', margin: '0 10px', fontWeight: 'bold' }}>CGU / CGV</Link>
        </div>
      </div>
      </div>
    </div>
  );
}

export default CGUCGV;
