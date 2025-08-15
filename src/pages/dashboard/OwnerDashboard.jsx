import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logoColor from '../../assets/images/logo-SailingLOC-couleur.png';
import boatService from '../../services/boat.service';
import reservationService from '../../services/reservation.service';
import { Link, useNavigate } from 'react-router-dom';
import ReservationDetailModal from '../../components/ReservationDetailModal';
import EditProfileModal from '../../components/EditProfileModal';
import OwnerDocsSection from '../../components/OwnerDocsSection';
import userService from '../../services/user.service';

const OwnerDashboard = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [selectedReservation, setSelectedReservation] = useState(null);
  // ...
  const handleDeleteBoat = async (boatId) => {
  try {
    await boatService.deleteBoat(boatId);
    setBoats(boats.filter((boat) => (boat._id || boat.id) !== boatId));
    setDeleteDone(true);
    setDeleteConfirmId(null);
    setTimeout(() => setDeleteDone(false), 3000);
  } catch (error) {
    setError(error?.message || "Erreur lors de la suppression du bateau.");
    setDeleteConfirmId(null);
  }
}
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [boats, setBoats] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
const [deleteConfirmId, setDeleteConfirmId] = useState(null);
const [deleteDone, setDeleteDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Chargement réel des bateaux et réservations du propriétaire depuis la BDD
    const fetchOwnerData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Appel au service pour récupérer les bateaux du propriétaire connecté
        const boatsData = await boatService.getMyBoats();
        setBoats(Array.isArray(boatsData) ? boatsData : []);
        // Appel réel pour les réservations
        const reservationsData = await reservationService.getMyBoatsReservations();
        setReservations(Array.isArray(reservationsData) ? reservationsData : []);
      } catch (error) {
        setError('Erreur lors du chargement des données bateaux ou réservations.');
        setBoats([]);
        setReservations([]);
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerData();
  }, [currentUser]);

  useEffect(() => {
    // Affiche le message de succès si on vient d’ajouter un bateau
    if (location.state && location.state.added) {
      setSuccessMessage("Bateau ajouté avec succès !");
      setTimeout(() => setSuccessMessage(""), 4000);
      // Nettoie le state pour éviter de réafficher après navigation
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleLogout = () => {
    logout();
    // La redirection sera gérée par le ProtectedRoute
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Chargement du tableau de bord propriétaire...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-red-600">Erreur : utilisateur non connecté ou session expirée.<br/>Veuillez vous reconnecter.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/">
              <div className="h-12">
                <img src={logoColor} alt="SailingLOC" className="h-full" />
              </div>
            </Link>
          </div>
          
          <div className="flex items-center">
            <span className="text-dark mr-4">Bonjour, {currentUser?.name || ((currentUser?.firstName || '') + ' ' + (currentUser?.lastName || '')).trim() || 'Propriétaire'}</span>
            <button 
              onClick={handleLogout}
              className="bg-neutral hover:bg-gray-300 text-dark py-2 px-4 rounded-md transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="font-pacifico text-primary text-3xl mb-8">Tableau de bord propriétaire</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profil propriétaire */}
          <div className="card p-6 md:col-span-1">
            <h2 className="font-montserrat text-xl font-semibold text-dark mb-4">Mon profil</h2>
            <div className="flex flex-col space-y-4">
              <div>
                <p className="text-gray-500 text-sm">Nom</p>
                <p className="font-medium">{currentUser?.name || ((currentUser?.firstName || '') + ' ' + (currentUser?.lastName || '')).trim() || 'Non défini'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="font-medium">{currentUser?.email || 'Non défini'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">téléphone</p>
                <p className="font-medium">{currentUser?.phone || 'Non défini'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Rôle</p>
                <p className="font-medium">Propriétaire</p>
              </div>
              <button className="btn-secondary mt-4" onClick={() => setEditModalOpen(true)}>Modifier mon profil</button>
<EditProfileModal
  isOpen={editModalOpen}
  onClose={() => setEditModalOpen(false)}
  currentEmail={currentUser?.email}
  currentPhone={currentUser?.phone}
  onSave={async ({ email, phone }) => {
    await userService.updateProfile(currentUser._id, { email, phone });
    // Met à jour currentUser côté front (contexte Auth)
    if (currentUser) {
      currentUser.email = email;
      currentUser.phone = phone;
    }
    setSuccessMessage('Profil mis à jour !');
  }}
/>
            </div>
            
            {/* Résumé */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-montserrat text-lg font-semibold text-dark mb-4">Résumé</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Bateaux</p>
                  <p className="font-semibold text-xl">{boats.length}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Réservations</p>
                  <p className="font-semibold text-xl">{reservations.length}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">En attente</p>
                  <p className="font-semibold text-xl">
                    {reservations.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">Confirmées</p>
                  <p className="font-semibold text-xl">
                    {reservations.filter(r => r.status === 'confirmed').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mes bateaux */}
          <div className="card p-6 md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-montserrat text-xl font-semibold text-dark">Mes bateaux</h2>
            </div>
            
            {deleteDone && (
  <div className="mb-4 text-red-700 bg-red-100 border border-red-400 rounded p-2 text-center animate-fade-in">
    Le bateau a bien été supprimé.
  </div>
)}
{successMessage && (
  <div className="mb-4 text-green-700 bg-green-100 border border-green-300 rounded p-2 text-center animate-fade-in">
    {successMessage}
  </div>
)}
            
            {loading ? (
              <p className="text-center py-4">Chargement des bateaux...</p>
            ) : boats.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Vous n'avez pas encore de bateau enregistré</p>
              </div>
            ) : (
              <div className="space-y-4">
                {boats.map((boat) => (
                  <div key={boat._id || boat.id} className="border rounded-lg p-4 flex flex-col md:flex-row">
                    <div className="w-full md:w-1/4 bg-neutral rounded-lg h-32 flex items-center justify-center mb-4 md:mb-0 md:mr-4">
                      {boat.photos && boat.photos.length > 0 ? (
                        <img src={boat.photos[0]} alt={boat.name} className="h-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-gray-500">Image du bateau</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-montserrat font-semibold text-lg">{boat.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          boat.status === 'available' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {boat.status}
                        </span>
                      </div>
                      <p className="text-gray-600">{boat.location}</p>
                      <div className="flex flex-wrap gap-4 mt-2 items-center">
                        <div>
                          <p className="text-gray-500 text-sm">Type</p>
                          <p>{boat.type}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Longueur</p>
                          <p>{boat.length} pieds</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Capacité</p>
                          <p>{boat.capacity} personnes</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Prix/jour</p>
                          <p>{boat.dailyPrice} €</p>
                          <div className="mt-4 flex gap-2 flex-wrap">
                            <button
  className="btn-secondary py-2 px-4"
  onClick={() => navigate(`/boats/${boat._id || boat.id}/edit`)}
>
  Modifier
</button>
                            {deleteConfirmId === (boat._id || boat.id) ? (
  <div className="bg-white border border-red-400 rounded p-3 flex flex-col md:flex-row items-center gap-2 shadow-md">
    <span className="text-red-600 font-semibold mr-2">Confirmer la suppression de ce bateau ?</span>
    <div className="flex gap-2 mt-2 md:mt-0">
      <button
        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
        onClick={() => handleDeleteBoat(boat._id || boat.id)}
      >
        Oui, supprimer
      </button>
      <button
        className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
        onClick={() => setDeleteConfirmId(null)}
      >
        Annuler
      </button>
    </div>
  </div>
) : (
  <button
    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors"
    onClick={() => setDeleteConfirmId(boat._id || boat.id)}
  >
    Supprimer
  </button>
) }
                            <button
                              className="btn-primary py-2 px-4 text-sm font-semibold rounded shadow hover:bg-primary-dark transition"
                              onClick={() => navigate(`/boats/${boat._id || boat.id}`)}
                            >
                              Voir l'annonce
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Bouton Ajouter un bateau en bas */}
            <div className="flex justify-center mt-6">
              <Link to="/add-boat" className="btn-primary">Ajouter un bateau</Link>
            </div>
          </div>
        </div>

        {/* Section documents contractuels */}
        <div className="md:col-span-2">
          <OwnerDocsSection ownerId={currentUser?._id} token={localStorage.getItem('token')} />
        </div>

        {/* Demandes de réservation */}
        <div className="card p-6 mt-8">
          <h2 className="font-montserrat text-xl font-semibold text-dark mb-4">Demandes de réservation</h2>
          
          {loading ? (
            <p className="text-center py-4">Chargement des réservations...</p>
          ) : reservations.length === 0 ? (
            <p className="text-center py-4 text-gray-500">Aucune demande de réservation pour le moment</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bateau
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Locataire
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reservations.filter(r => r && r.boat && r.user && r.status !== 'cancelled').map((reservation) => (
                    <tr key={reservation._id || reservation.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{reservation.boat?.name || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{reservation.user?.firstName} {reservation.user?.lastName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(reservation.startDate).toLocaleDateString('fr-FR')} - {new Date(reservation.endDate).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.totalPrice || reservation.price || (reservation.boat?.dailyPrice && reservation.startDate && reservation.endDate ?
                            ((Math.ceil((new Date(reservation.endDate) - new Date(reservation.startDate)) / (1000*60*60*24))) * reservation.boat.dailyPrice) : '-')
                          } €
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          reservation.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reservation.status === 'confirmed' ? 'Confirmée' : 'En attente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
  className="text-blue-600 hover:text-blue-800 mr-2"
  onClick={() => setSelectedReservation(reservation)}
>
  Détails
</button>
                          {reservation.status === 'pending' && (
                            <>
                              <button
                                className="text-green-600 hover:text-green-800"
                                onClick={async () => {
                                  try {
                                    await reservationService.updateReservationStatus(reservation._id || reservation.id, { status: 'confirmed' });
                                    setReservations(prev => prev.map(r => (r._id || r.id) === (reservation._id || reservation.id) ? { ...r, status: 'confirmed' } : r));
                                  } catch (e) {
                                    alert('Erreur lors de l\'acceptation de la réservation');
                                  }
                                }}
                              >
                                Accepter
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800"
                                onClick={async () => {
                                  try {
                                    await reservationService.updateReservationStatus(reservation._id || reservation.id, { status: 'cancelled' });
                                    setReservations(prev => prev.filter(r => (r._id || r.id) !== (reservation._id || reservation.id)));
                                  } catch (e) {
                                    alert('Erreur lors du refus de la réservation');
                                  }
                                }}
                              >
                                Refuser
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Actions rapides */}
        <div className="mt-8">
          <h2 className="font-montserrat text-xl font-semibold text-dark mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/add-boat" className="card p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow">
              <svg className="w-12 h-12 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span className="font-medium">Ajouter un bateau</span>
            </Link>
            
            <Link to="/owner/dashboard/calendrier" className="card p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow">
  <svg className="w-12 h-12 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
  </svg>
  <span className="font-medium">Calendrier</span>
</Link>
            
            
            <Link to="/owner/dashboard/reservations" className="card p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow">
  <svg className="w-12 h-12 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
  <span className="font-medium">Réservations</span>
</Link>
            
            <Link to="/owner/dashboard/revenus" className="card p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow">
  <svg className="w-12 h-12 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span className="font-medium">Revenus</span>
</Link>
          </div>
        </div>
      </main>
      <ReservationDetailModal reservation={selectedReservation} onClose={() => setSelectedReservation(null)} />
      
      {/* Footer */}
      <footer className="bg-primary text-white mt-12 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-montserrat font-bold text-lg mb-4">À PROPOS</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">À propos</a></li>
                <li><a href="#" className="hover:underline">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:underline">CGU</a></li>
                <li><a href="#" className="hover:underline">Mentions légales</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-montserrat font-bold text-lg mb-4">NOUS FAIRE CONFIANCE</h3>
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-coral" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              <p>Note : 4.8 / 5 calculée à partir de 5 000 avis</p>
              <a href="#" className="text-coral hover:underline mt-2 inline-block">Avis de notre communauté</a>
            </div>
            
            <div>
              <h3 className="font-montserrat font-bold text-lg mb-4">CONTACT</h3>
              <p className="mb-2">Besoin de conseils ?</p>
              <p className="mb-2">Nous sommes joignables :</p>
              <p className="mb-1">Du lundi au vendredi : 8h00 à 20h00</p>
              <p className="mb-2">Samedi et Dimanche : 10h00 à 18h00</p>
              <a href="mailto:contact@sailingloc.com" className="flex items-center text-coral hover:underline">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                contact@sailingloc.com
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-blue-700 text-center">
            <p>&copy; 2025 SailingLoc. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OwnerDashboard;
