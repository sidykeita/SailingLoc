import React from 'react';
import HeaderDashboard from '../../components/HeaderDashboard';

const OwnerFavorites = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeaderDashboard />
      <main className="container mx-auto px-4 py-8">
        <h1 className="font-pacifico text-primary text-3xl mb-6">Favoris (Propriétaire)</h1>
        <div className="card p-6">
          <p className="text-gray-600">Cette page affichera vos annonces/bateaux favoris. (À implémenter)</p>
        </div>
      </main>
    </div>
  );
};

export default OwnerFavorites;
