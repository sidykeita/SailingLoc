import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import profileImage from '../../assets/images/profil.jpg';
import boatService from '../../services/boat.service';
import reservationService from '../../services/reservation.service';
import { Link, useNavigate } from 'react-router-dom';
import ReservationDetailModal from '../../components/ReservationDetailModal';
import EditProfileModal from '../../components/EditProfileModal';
import ViewProfileModal from '../../components/ViewProfileModal';
import ContractualDocsSection from '../../components/ContractualDocsSection';
import userService from '../../services/user.service';
import { uploadProfilePhoto } from '../../services/profilePhotoUpload';
import Layout from '../../Layout';

const OwnerDashboard = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const uid = user?._id || user?.id;
      return (uid ? localStorage.getItem(`profilePhotoUrl:${uid}`) : null) || null;
    } catch(_) { return null; }
  });
  // Suppression de compte (propriétaire)
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

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

  // Initialise/maj l'avatar depuis currentUser ou localStorage pour persister après refresh
  useEffect(() => {
    try {
      const uid = currentUser?._id || currentUser?.id;
      const persisted = uid ? localStorage.getItem(`profilePhotoUrl:${uid}`) : null;
      const initial = currentUser?.profilePhotoUrl || persisted || null;
      setPhotoUrl(initial);
    } catch(_) {}
  }, [currentUser?._id, currentUser?.profilePhotoUrl]);

  useEffect(() => {
    // Affiche le message de succès si on vient d’ajouter un bateau
    if (location.state && location.state.added) {
      setSuccessMessage("Bateau ajouté avec succès !");
      setTimeout(() => setSuccessMessage(""), 4000);
      // Nettoie le state pour éviter de réafficher après navigation
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Upload photo de profil (Firebase)
  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setPhotoUploading(true);
    try {
      const uploadResult = await uploadProfilePhoto(file, currentUser._id);
      await userService.updateProfile(currentUser._id, { profilePhotoUrl: uploadResult.url });
      const uid = currentUser?._id || currentUser?.id;
      if (uid) localStorage.setItem(`profilePhotoUrl:${uid}`, uploadResult.url);
      setPhotoUrl(uploadResult.url);
    } catch (e) {
      alert("Erreur lors de l'upload: " + (e?.message || 'inconnue'));
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleteError('');
      setDeleteLoading(true);
      await userService.deleteMe(deletePassword);
      logout();
      navigate('/');
    } catch (e) {
      const serverMsg = e?.response?.data?.message || e?.response?.data?.error;
      setDeleteError(serverMsg || e?.message || 'Erreur lors de la suppression du compte');
    } finally {
      setDeleteLoading(false);
    }
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
    <Layout>
      {/* Owner content */}
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-pacifico text-primary text-3xl mb-8">Tableau de bord propriétaire</h1>
          
          {/* Actions rapides */}
          <div className="mb-8">
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


              {/* Réservation propriétaire */}
              <Link to="/owner/dashboard/reserver" className="card p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow">
                <svg className="w-12 h-12 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h8M8 11h8m-7 4h6M5 7h.01M5 11h.01M5 15h.01M19 7h.01M19 11h.01M19 15h.01M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
                </svg>
                <span className="font-medium">Mes locations</span>
              </Link>
              
              <Link to="/owner/dashboard/revenus" className="card p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow">
                <svg className="w-12 h-12 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Revenus</span>
              </Link>

              {/* Avis */}
              <Link to="/owner/dashboard/avis" className="card p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow">
                <svg className="w-12 h-12 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.977 2.889a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.977-2.889a1 1 0 00-1.175 0l-3.977 2.889c-.784.57-1.838-.197-1.54-1.118l1.518-4.674a1 1 0 00-.364-1.118L3.978 10.1c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.518-4.674z" />
                </svg>
                <span className="font-medium">Avis</span>
              </Link>

              {/* Favoris */}
              <Link to="/owner/dashboard/favoris" className="card p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow">
                <svg className="w-12 h-12 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                </svg>
                <span className="font-medium">Favoris</span>
              </Link>

            
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profil propriétaire */}
            <div className="card p-6 md:col-span-1">
              <h2 className="font-montserrat text-xl font-semibold text-dark mb-4">Mon profil</h2>
              {/* Avatar centré et circulaire (vierge si pas de photo) */}
              <div className="w-full flex justify-center mb-4">
                <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  { (photoUrl || currentUser?.profilePhotoUrl) ? (
                    <img
                      src={photoUrl || currentUser?.profilePhotoUrl}
                      alt="Profil"
                      className="w-full h-full object-cover"
                      onError={(e)=>{ e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <span className="text-gray-500 text-xl font-semibold">
                      {`${(currentUser?.firstName || '').charAt(0)}${(currentUser?.lastName || '').charAt(0)}`.trim() || ''}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full text-center mb-6">
                <label className="text-primary cursor-pointer">
                  {photoUploading ? 'Upload en cours...' : (photoUrl || currentUser?.profilePhotoUrl ? 'Changer la photo' : '+ Ajouter une photo')}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} disabled={photoUploading} />
                </label>
              </div>
              <div className="flex flex-col space-y-4">
                <div>
                  <p className="text-gray-500 text-sm">Nom</p>
                  <p className="font-medium">{currentUser?.name || ((currentUser?.firstName || '') + ' ' + (currentUser?.lastName || '')).trim() || 'Non défini'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <div className="flex items-center">
                    <p className="font-medium">{currentUser?.email || 'Non défini'}</p>
                    <span className="ml-2"></span>
                    <a href="#" className="text-primary ml-2" onClick={(e)=>{e.preventDefault(); setEditModalOpen(true);}}>modifier</a>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">téléphone</p>
                  <div className="flex items-center">
                    <p className="font-medium">{currentUser?.phone || 'Non défini'}</p>
                    <span className="ml-2"></span>
                    <a href="#" className="text-primary ml-2" onClick={(e)=>{e.preventDefault(); setEditModalOpen(true);}}>modifier</a>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Rôle</p>
                  <p className="font-medium">Propriétaire</p>
                </div>
                <button className="btn-secondary mt-4" onClick={() => setViewModalOpen(true)}>Voir mon profil</button>
                <button className="btn-secondary mt-2" onClick={() => setEditModalOpen(true)}>Modifier mon profil</button>
                <button className="btn-outline mt-2" style={{ borderColor: '#dc2626', color: '#dc2626' }} onClick={() => setDeleteOpen(true)}>Supprimer mon compte</button>
                <EditProfileModal
                  isOpen={editModalOpen}
                  onClose={() => setEditModalOpen(false)}
                  currentEmail={currentUser?.email}
                  currentPhone={currentUser?.phone}
                  currentSiret={currentUser?.siret}
                  currentSiren={currentUser?.siren}
                  ownerStatus={currentUser?.ownerStatus}
                  onSave={async ({ email, phone, idCardUrl, siret, siren }) => {
                    await userService.updateProfile(currentUser._id, { email, phone, idCardUrl, siret, siren });
                    // Met à jour currentUser côté front (contexte Auth)
                    if (currentUser) {
                      currentUser.email = email;
                      currentUser.phone = phone;
                      if (idCardUrl) currentUser.idCardUrl = idCardUrl;
                      if (siret !== undefined) currentUser.siret = siret;
                      if (siren !== undefined) currentUser.siren = siren;
                    }
                    setSuccessMessage('Profil mis à jour !');
                  }}
                />
                <ViewProfileModal
                  isOpen={viewModalOpen}
                  onClose={() => setViewModalOpen(false)}
                  user={currentUser}
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
        <div className="mt-8">
          <ContractualDocsSection userId={currentUser?._id || currentUser?.id} />
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
          
          <ReservationDetailModal reservation={selectedReservation} onClose={() => setSelectedReservation(null)} />
        </div>
        {/* Modal suppression de compte */}
        {deleteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-semibold mb-2">Supprimer mon compte</h3>
              <p className="text-sm text-gray-600 mb-4">Cette action est irréversible. Vos bateaux seront automatiquement rendus indisponibles. Entrez votre mot de passe pour confirmer.</p>
              <input
                type="password"
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Mot de passe actuel"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />
              {deleteError && <p className="text-red-600 text-sm mb-2">{deleteError}</p>}
              <div className="flex justify-end gap-2 mt-2">
                <button className="px-4 py-2 rounded border" onClick={() => setDeleteOpen(false)} disabled={deleteLoading}>Annuler</button>
                <button
                  className="px-4 py-2 rounded text-white"
                  style={{ backgroundColor: '#dc2626' }}
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading || !deletePassword}
                >{deleteLoading ? 'Suppression...' : 'Confirmer la suppression'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OwnerDashboard;




