// src/components/common/footerLinks.js

export const footerLinksPublic = [
  {
    title: 'Pages principales',
    links: [
      { label: 'Accueil', to: '/' },
      { label: 'Catalogue des bateaux', to: '/boats' },
      { label: 'À propos de SailingLoc', to: '/about' },
      { label: 'Contact et support', to: '/contact' },
    ],
  },
  {
    title: 'Espace utilisateur',
    links: [
      { label: 'Connexion', to: '/login' },
      { label: 'Inscription', to: '/register' },
      { label: 'Mon profil', to: '/dashboard' },
      { label: 'Mes réservations', to: '/locations' },
      { label: 'Mes favoris', to: '/favorites' },
    ],
  },
  {
    title: 'Gestion des bateaux',
    links: [
      { label: 'Gérer mes bateaux', to: '/owner/dashboard' },
      { label: 'Gérer mes réservations', to: '/owner/dashboard/reservations' },
      { label: 'Ajouter un bateau', to: '/add-boat' },
    ],
  },
  {
    title: 'Légal',
    links: [
      { label: 'Mentions légales', to: '/legal-notices' },
      { label: 'Politique de confidentialité', to: '/legal-notices' },
      { label: 'CGU / CGV', to: '/cgu-cgv' },
    ],
  },
];
