// src/components/common/footerLinks.js

export const footerLinksPublic = [
  {
    title: 'Accueil',
    links: [{ label: 'Accueil', to: '/' }],
  },
  {
    title: 'Bateaux',
    links: [
      { label: 'Tous les bateaux', to: '/boats' },
      { label: 'Voiliers', to: '/boats/sailing' },
      { label: 'Catamarans', to: '/boats/catamaran' },
      { label: 'Yachts', to: '/boats/yacht' },
      { label: 'Bateaux à moteur', to: '/boats/motor' },
      { label: 'Semi‑rigides', to: '/boats/semi-rigide' },
    ],
  },
  {
    title: 'Destinations',
    links: [
      { label: 'Toutes les destinations', to: '/destinations' },
      { label: 'Marseille', to: '/destinations/marseille' },
      { label: 'Porto Cristo', to: '/destinations/porto-cristo' },
      { label: 'Bastia', to: '/destinations/bastia' },
      { label: 'La Rochelle', to: '/destinations/la-rochelle' },
      { label: 'La Ciotat', to: '/destinations/la-ciotat' },
      { label: 'Alicante', to: '/destinations/alicante' },
      { label: 'Corfou', to: '/destinations/corfou' },
    ],
  },
  {
    title: 'Aide',
    links: [
      { label: 'Centre d’aide', to: '/help' },
      { label: 'Location de bateaux', to: '/help/boat-rental' },
      { label: 'Paiements', to: '/help/payments' },
      { label: 'Mon compte', to: '/help/account' },
      { label: 'Urgences', to: '/help/emergency' },
      { label: 'FAQ', to: '/help/faq' },
    ],
  },
  {
    title: 'À propos',
    links: [
      { label: 'À propos', to: '/about' },
      { label: 'Avis', to: '/about/reviews' },
    ],
  },
  {
    title: 'Légal',
    links: [
      { label: 'Mentions légales', to: '/legal-notices' },
      { label: 'CGU/CGV', to: '/cgu-cgv' },
    ],
  },
  {
    title: 'Contact',
    links: [{ label: 'Nous contacter', to: '/contact' }],
  },
  {
    title: 'Compte',
    links: [
      { label: 'Connexion', to: '/login' },
      { label: 'Inscription', to: '/register' },
      { label: 'Inscription locataire', to: '/register/tenant' },
      { label: 'Inscription propriétaire', to: '/register/owner' },
    ],
  },
];

export const footerLinksTenant = [
  {
    title: 'Espace locataire',
    links: [
      { label: 'Tableau de bord', to: '/dashboard' },
      { label: 'Mes locations', to: '/locations' },
      { label: 'Mes avis', to: '/reviews' },
      { label: 'Mes favoris', to: '/favorites' },
    ],
  },
];

export const footerLinksOwner = [
  {
    title: 'Espace propriétaire',
    links: [
      { label: 'Tableau de bord', to: '/owner/dashboard' },
      { label: 'Ajouter un bateau', to: '/add-boat' },
      { label: 'Calendrier', to: '/owner/dashboard/calendrier' },
      { label: 'Réservations', to: '/owner/dashboard/reservations' },
      { label: 'Revenus', to: '/owner/dashboard/revenus' },
      { label: 'Avis', to: '/owner/dashboard/avis' },
      { label: 'Favoris', to: '/owner/dashboard/favoris' },
      { label: 'Réserver', to: '/owner/dashboard/reserver' },
    ],
  },
];

export const footerLinksAdmin = [
  {
    title: 'Administration',
    links: [{ label: 'Dashboard admin', to: '/admin/dashboard' }],
  },
];
