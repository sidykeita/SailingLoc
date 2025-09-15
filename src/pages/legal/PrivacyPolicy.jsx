import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="container" style={{ padding: '2rem 1rem', color: '#333' }}>
      <h1>Politique de confidentialité</h1>
      <p>
        Cette page décrit comment SailingLoc collecte, utilise et protège vos données personnelles.
      </p>
      <h2>Collecte des données</h2>
      <p>
        Nous collectons les informations que vous nous fournissez (ex: nom, email, numéro de téléphone) lors de la
        création de compte, des réservations et des demandes de support.
      </p>
      <h2>Utilisation</h2>
      <p>
        Vos données sont utilisées pour fournir le service (gestion de compte, réservations, paiements), améliorer
        l'expérience et communiquer avec vous.
      </p>
      <h2>Partage</h2>
      <p>
        Nous ne vendons pas vos données. Elles peuvent être partagées avec des prestataires (paiements, hébergement)
        strictement pour fournir le service.
      </p>
      <h2>Vos droits</h2>
      <p>
        Vous pouvez demander l'accès, la rectification, la suppression de vos données ou vous opposer à certains
        traitements conformément au RGPD.
      </p>
      <h2>Contact</h2>
      <p>
        Pour toute question relative à la confidentialité, contactez-nous via la page <a href="/contact">Contact</a>.
      </p>
    </div>
  );
}
