# SailingLoc — Réservations Propriétaire, Avis et Favoris

Ce document explique le fonctionnement métier et fournit des exemples de code (front) pour intégrer la réservation propriétaire, la gestion des avis et des favoris.

---

## 1) Réservations (côté propriétaire et locataire)

### Règles métier de disponibilité
- Seules les réservations au statut `confirmed` bloquent la disponibilité d’un bateau.
- Les réservations `pending` n’empêchent pas la réservation (validation manuelle par le propriétaire).
- Les dates d’indisponibilité `unavailableDates` bloquent la réservation. Formats supportés:
  - Tableau de dates: `["2025-09-11", "2025-09-12"]`
  - Plages d’indisponibilité: `[{ startDate: "2025-09-11", endDate: "2025-09-15" }]`
  - Objets avec date unique: `[{ date: "2025-09-11" }]`

### Routes API pertinentes
- `POST /api/reservations` — créer une réservation (global)
- `GET /api/reservations` — lister toutes les réservations (vue admin/global)
- `GET /api/reservations/owner` — réservations des bateaux du propriétaire connecté
- `GET /api/reservations/boat/:boatId` — réservations d’un bateau (utilisé pour le filtrage côté front)

### Exemple: vérification de disponibilité côté front
```js
// Utilitaire de chevauchement (overlap)
const hasOverlap = (startA, endA, startB, endB) => startA < endB && endA > startB;

// Vérifier unavailableDates (supports: string, {date}, {startDate,endDate})
const isInUnavailable = (boat, startDate, endDate) => {
  if (!boat?.unavailableDates) return false;
  const s = new Date(startDate);
  const e = new Date(endDate);
  return boat.unavailableDates.some((u) => {
    const uStart = new Date(u.startDate || u.date || u);
    const uEnd = new Date(u.endDate || u.date || u);
    return hasOverlap(s, e, uStart, uEnd);
  });
};

// Vérifier conflits avec réservations confirmées
const hasConfirmedConflict = (boat, startDate, endDate) => {
  if (!boat?.bookings?.length) return false;
  const s = new Date(startDate);
  const e = new Date(endDate);
  return boat.bookings.some((b) => {
    if (b.status !== 'confirmed') return false; // pending ne bloque pas
    const bs = new Date(b.startDate);
    const be = new Date(b.endDate);
    return hasOverlap(s, e, bs, be);
  });
};

export const isBoatAvailable = (boat, startDate, endDate) => {
  if (isInUnavailable(boat, startDate, endDate)) return false;
  if (hasConfirmedConflict(boat, startDate, endDate)) return false;
  return true;
};
```

### Exemple: création d’une réservation
```js
// Créer une réservation (locataire) — status initial souvent 'pending'
export async function createReservation({ authToken, boatId, startDate, endDate, note }) {
  const res = await fetch('/api/reservations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ boat: boatId, startDate, endDate, status: 'pending', note }),
  });
  if (!res.ok) throw new Error('Reservation creation failed');
  return res.json();
}
```

---

## 2) Avis (reviews)

### Principes
- Un utilisateur peut laisser un avis sur un bateau.
- Sur le dashboard propriétaire:
  - Onglet "Avis reçus": uniquement les avis sur les bateaux du propriétaire connecté.
  - Onglet "Avis donnés": les avis écrits par l’utilisateur connecté, quel que soit le bateau.

### Routes API types
- `POST /api/reviews` — créer un avis
- `GET /api/boats/:boatId/reviews` — avis d’un bateau
- (Existant côté front) `GET /api/reviews?owner=me` — souvent utilisé pour récupérer les avis reçus

### Exemple: ajout d’un avis
```js
export async function addReview({ authToken, boatId, rating, comment }) {
  const res = await fetch('/api/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ boat: boatId, rating, comment }),
  });
  if (!res.ok) throw new Error('Review creation failed');
  return res.json();
}
```

### Exemple: filtrage des avis donnés côté front
```js
// A partir d'une liste d'avis (allReviews), garder ceux écrits par l'utilisateur courant
const currentUserId = currentUser?._id || currentUser?.id;
const givenReviews = (allReviews || []).filter((r) => {
  const reviewUserId = r.user?._id || r.user || r.author?._id || r.author || r.reviewer?._id || r.reviewer;
  return currentUserId && reviewUserId && String(reviewUserId) === String(currentUserId);
});
```

---

## 3) Favoris

### Principes
- Un utilisateur peut ajouter/retirer un bateau de ses favoris.
- Affichage rapide côté UI: vérifier si un bateau est dans la liste courante des favoris.

### Routes API types
- `GET /api/favorites` — lister les favoris de l’utilisateur connecté
- `POST /api/favorites` — toggle/add/remove selon l’implémentation serveur

### Exemples
```js
export async function toggleFavorite({ authToken, boatId }) {
  const res = await fetch('/api/favorites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ boatId }),
  });
  if (!res.ok) throw new Error('Toggle favorite failed');
  return res.json();
}

export const isFavorite = (favorites, boatId) =>
  (favorites || []).some((f) => f.boat === boatId || f.boat?._id === boatId);
```

---

## 4) Intégration dans une page de détail bateau (extrait)
```js
import { isBoatAvailable, createReservation } from './services/reservations';
import { addReview } from './services/reviews';
import { toggleFavorite, isFavorite } from './services/favorites';

function handleReservation(boat, dates, authToken) {
  const { startDate, endDate } = dates;
  if (!isBoatAvailable(boat, startDate, endDate)) {
    // UX: toast/alert
    return { ok: false, message: "Bateau indisponible aux dates choisies." };
  }
  return createReservation({ authToken, boatId: boat._id, startDate, endDate });
}

async function handleAddReview(boatId, rating, comment, authToken) {
  return addReview({ authToken, boatId, rating, comment });
}

async function handleToggleFavorite(boatId, authToken) {
  return toggleFavorite({ authToken, boatId });
}
```

---

## 5) Bonnes pratiques
- Valider les dates côté client et serveur.
- Toujours appliquer les règles métier: seules les `confirmed` bloquent; `pending` non.
- Gérer les erreurs réseau (loading, retry, messages utilisateur).
- Côté propriétaire, préférer la route `/api/reservations/owner` pour n’obtenir que ses réservations.
- Utiliser `/api/reservations/boat/:boatId` pour enrichir les bateaux avec leurs réservations lors du filtrage (liste et détail).

---

Dernière mise à jour: 11/09/2025
