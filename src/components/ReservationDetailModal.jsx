import React from 'react';

/**
 * Modale de détail réservation factorisée pour tout le dashboard propriétaire.
 * Props attendues :
 *   - reservation: objet réservation à afficher
 *   - onClose: fonction de fermeture
 */
export default function ReservationDetailModal({ reservation, onClose }) {
  if (!reservation) return null;

  // Sécurité d'accès aux champs (compatibilité différents appels)
  const title = reservation.title?.replace('Réservation ', '') || reservation.boat?.name || '';
  const client = reservation.client || ((reservation.user?.firstName || '') + ' ' + (reservation.user?.lastName || '')).trim() || '';
  // Gestion robuste de la période
const start = reservation.period?.start || reservation.startDate || reservation.start || null;
const end = reservation.period?.end || reservation.endDate || reservation.end || null;
  
  // Gestion robuste du port
const location = reservation.port || reservation.location || reservation.boat?.port || reservation.boat?.location || '';
  const status = reservation.status || 'Confirmée';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-primary"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-semibold text-marine mb-4">Détail de la réservation</h2>
        <div className="mb-2">
          <span className="font-medium">Bateau :</span> {title}
        </div>
        <div className="mb-2">
          <span className="font-medium">Client :</span> {client}
        </div>
        <div className="mb-2">
          <span className="font-medium">Période :</span><br/>
          {start ? new Date(start).toLocaleDateString('fr-FR') : '?'} au {end ? new Date(end).toLocaleDateString('fr-FR') : '?'}
        </div>
        <div className="mb-2">
          <span className="font-medium">Statut :</span> <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">{status}</span>
        </div>
        <div>
          <span className="font-medium">Port :</span> {location}
        </div>
      </div>
    </div>
  );
}
