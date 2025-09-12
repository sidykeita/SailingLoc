import React from 'react';

export default function ViewProfileModal({ isOpen, onClose, user }) {
  if (!isOpen) return null;
  const name = (user?.firstName || '') + (user?.lastName ? ' ' + user.lastName : '') || user?.name || 'Utilisateur';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        <h2 className="text-xl font-semibold mb-4">Mon profil</h2>
        <div className="space-y-3">
          <div>
            <p className="text-gray-600 text-sm">Nom</p>
            <p className="font-medium">{name}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Email</p>
            <p className="font-medium">{user?.email || 'Non renseigné'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Téléphone</p>
            <p className="font-medium">{user?.phone || 'Non renseigné'}</p>
          </div>
          {user?.role === 'propriétaire' && user?.ownerStatus === 'professionnel' && (
            <>
              {user?.siret && (
                <div>
                  <p className="text-gray-600 text-sm">SIRET</p>
                  <p className="font-medium">{user.siret}</p>
                </div>
              )}
              {user?.siren && (
                <div>
                  <p className="text-gray-600 text-sm">SIREN</p>
                  <p className="font-medium">{user.siren}</p>
                </div>
              )}
            </>
          )}
          {user?.idCardUrl && (
            <div>
              <p className="text-gray-600 text-sm">Carte d'identité</p>
              <div className="mt-2">
                <img 
                  src={user.idCardUrl} 
                  alt="Carte d'identité" 
                  className="max-w-full h-auto max-h-48 border rounded"
                  style={{maxWidth: '200px'}}
                />
                <p className="text-xs text-green-600 mt-1">✓ Acceptée</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="btn-secondary">Fermer</button>
        </div>
      </div>
    </div>
  );
}
