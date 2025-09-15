import React from 'react';
import { Link } from 'react-router-dom';

const Sitemap = () => {
  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Plan du site</h1>
      <p style={{ marginBottom: '1.5rem', color: '#555' }}>
        Retrouvez ici les principales pages de SailingLoc. Certaines sections (tableaux de bord) nécessitent d'être connecté.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <section>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '.5rem' }}>Général</h2>
          <ul>
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/about">À propos</Link></li>
            <li><Link to="/about/reviews">Avis</Link></li>
            <li><Link to="/help">Aide</Link></li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '.5rem' }}>Bateaux</h2>
          <ul>
            <li><Link to="/boats">Tous les bateaux</Link></li>
            <li><Link to="/boats/motor">Bateaux à moteur</Link></li>
            <li><Link to="/boats/sailing">Voiliers</Link></li>
            <li><Link to="/boats/catamaran">Catamarans</Link></li>
            <li><Link to="/boats/yacht">Yachts</Link></li>
            <li><Link to="/boats/semi-rigide">Semi‑rigides</Link></li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '.5rem' }}>Destinations</h2>
          <ul>
            <li><Link to="/destinations">Toutes les destinations</Link></li>
            <li><Link to="/destinations/marseille">Marseille</Link></li>
            <li><Link to="/destinations/porto-cristo">Porto Cristo</Link></li>
            <li><Link to="/destinations/bastia">Bastia</Link></li>
            <li><Link to="/destinations/la-rochelle">La Rochelle</Link></li>
            <li><Link to="/destinations/la-ciotat">La Ciotat</Link></li>
            <li><Link to="/destinations/alicante">Alicante</Link></li>
            <li><Link to="/destinations/corfou">Corfou</Link></li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '.5rem' }}>Aide</h2>
          <ul>
            <li><Link to="/help/boat-rental">Location de bateau</Link></li>
            <li><Link to="/help/account">Compte</Link></li>
            <li><Link to="/help/emergency">Urgences</Link></li>
            <li><Link to="/help/faq">FAQ</Link></li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '.5rem' }}>Légal</h2>
          <ul>
            <li><Link to="/legal-notices">Mentions légales</Link></li>
            <li><Link to="/cgu-cgv">CGU / CGV</Link></li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '.5rem' }}>Tableaux de bord</h2>
          <ul>
            <li><Link to="/owner/dashboard">Espace propriétaire</Link></li>
            <li><Link to="/dashboard">Espace locataire</Link></li>
            <li><Link to="/reviews">Mes avis (locataire)</Link></li>
            <li><Link to="/favorites">Mes favoris (locataire)</Link></li>
            <li><Link to="/locations">Mes locations (locataire)</Link></li>
          </ul>
          <p style={{ fontSize: '.9rem', color: '#666', marginTop: '.5rem' }}>
            Accès restreint: connexion requise.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Sitemap;
