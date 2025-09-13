import React, { useEffect, useState } from 'react';
import TenantHeader from '../../components/tenant/TenantHeader';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../assets/css/SimpleDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronDown, faEnvelope, faMobileAlt, faIdCard, faFileAlt, faQuestionCircle, faChevronRight, faSignOutAlt, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import logoBlc from '../../assets/images/logo-blc.png';
import userService from '../../services/user.service';
import EditProfileModal from '../../components/EditProfileModal';
import ViewProfileModal from '../../components/ViewProfileModal';
import { uploadProfilePhoto } from '../../services/profilePhotoUpload';
import reservationService from '../../backup/reservationService.js';
import reviewService from '../../services/review.service.js';

const SimpleDashboard = () => {
  const { currentUser, logout, userRole, switchRole } = useAuth();
  const navigate = useNavigate();
  const today = new Date();
  const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()} ${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;
  
  // Style pour le bouton orange
  const orangeButtonStyle = {
    backgroundColor: '#ff6600',
    color: 'white',
    border: 'none',
    backgroundImage: 'none',
    background: '#ff6600'
  };
  
  // États pour gérer l'affichage des menus déroulants
  const [showDiscoverMenu, setShowDiscoverMenu] = useState(false);
  const [showBoatSubmenu, setShowBoatSubmenu] = useState(false);
  const [showDestinationsSubmenu, setShowDestinationsSubmenu] = useState(false);
  const [showModelsSubmenu, setShowModelsSubmenu] = useState(false);
  const [showAboutSubmenu, setShowAboutSubmenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const uid = user?._id || user?.id;
      return (uid ? localStorage.getItem(`profilePhotoUrl:${uid}`) : null) || null;
    } catch (_) {
      return null;
    }
  });
  // Suppression de compte
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  
  // Dashboard data
  const [upcomingReservations, setUpcomingReservations] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Initialiser l'URL de photo depuis l'utilisateur ou le localStorage pour persister après refresh
  useEffect(() => {
    const uid = currentUser?._id || currentUser?.id;
    const stored = uid ? localStorage.getItem(`profilePhotoUrl:${uid}`) : null;
    const initial = currentUser?.profilePhotoUrl || stored || null;
    setPhotoUrl(initial);
  }, [currentUser?._id, currentUser?.profilePhotoUrl]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        // Fetch upcoming reservations
        const reservations = await reservationService.getMyReservations();
        const upcoming = reservations
          .filter(res => {
            const startDate = new Date(res.startDate);
            const now = new Date();
            return startDate > now && res.status === 'confirmed';
          })
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
          .slice(0, 2);
        
        setUpcomingReservations(upcoming);
        
        // For now, keep messages empty as per previous implementation
        setRecentMessages([]);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    try {
      await logout();
      // La redirection sera gérée par le contexte d'authentification
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  // Fonction pour gérer l'upload de photo de profil
  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setPhotoUploading(true);
    try {
      const uploadResult = await uploadProfilePhoto(file, currentUser._id);
      // Sauvegarder côté backend
      await userService.updateProfile(currentUser._id, { profilePhotoUrl: uploadResult.url });
      // Persister localement sur une clé spécifique à l'utilisateur
      const uid = currentUser?._id || currentUser?.id;
      if (uid) localStorage.setItem(`profilePhotoUrl:${uid}`, uploadResult.url);
      
      // Mettre à jour localement (état réactif)
      setPhotoUrl(uploadResult.url);
    } catch (error) {
      alert('Erreur lors de l\'upload: ' + error.message);
    } finally {
      setPhotoUploading(false);
    }
  };

  // Fonction pour gérer la suppression de compte
  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      setDeleteError('Veuillez entrer votre mot de passe');
      return;
    }

    setDeleteLoading(true);
    setDeleteError('');

    try {
      await userService.deleteAccount(currentUser._id, deletePassword);
      await logout();
      navigate('/');
    } catch (error) {
      setDeleteError(error.message || 'Erreur lors de la suppression du compte');
    } finally {
      setDeleteLoading(false);
    }
  };
  
  return (
    <div>
      {/* Header */}
      <TenantHeader activeSection="dashboard" />

      {/* Dashboard Content */}
      <div className="dashboard-container">
        {/* User Profile Section */}
        <div className="user-profile">
          <div className="profile-avatar" style={{ width: 112, height: 112, borderRadius: '9999px', overflow: 'hidden', background: '#e5e7eb', display: 'grid', placeItems: 'center' }}>
            { (photoUrl || currentUser?.profilePhotoUrl) ? (
              <img src={photoUrl || currentUser?.profilePhotoUrl} alt="Profil" onError={(e) => { e.currentTarget.style.display='none'; }} />
            ) : (
              <span style={{ color: '#6b7280', fontWeight: 700, fontSize: 28 }}>
                {`${(currentUser?.firstName || '').charAt(0)}${(currentUser?.lastName || '').charAt(0)}`.trim() || ''}
              </span>
            )}
          </div>
          <label className="add-photo" style={{cursor: 'pointer'}}>
            {photoUploading ? 'Upload en cours...' : (photoUrl || currentUser?.profilePhotoUrl ? 'Changer la photo' : '+ Ajouter une photo')}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoUpload}
              style={{display: 'none'}}
              disabled={photoUploading}
            />
          </label>
          
          <h2 className="profile-name">{currentUser?.displayName || currentUser?.name || currentUser?.email || 'Utilisateur'}</h2>
          <p className="member-since">Membre depuis 2025</p>
          
          
          <div className="profile-buttons">
            <button onClick={() => setEditModalOpen(true)} className="btn btn-primary" style={orangeButtonStyle}>Compléter mon profil</button>
            <button onClick={() => setViewModalOpen(true)} className="btn btn-outline">Voir mon profil</button>
            <button className="btn btn-outline" style={{ borderColor: '#dc2626', color: '#dc2626' }} onClick={() => setDeleteOpen(true)}>Supprimer mon compte</button>
          </div>
          
          <div className="verification-list">
            <div className="verification-item">
              <FontAwesomeIcon icon={faEnvelope} /> {/* Icône */}
              <span>{currentUser?.email || 'Email non renseigné'}</span>
              <span style={{marginLeft: '10px'}}></span>
              <a href="#" onClick={(e)=>{e.preventDefault(); setEditModalOpen(true);}}>modifier</a>
            </div>
            <div className="verification-item">
              <FontAwesomeIcon icon={faMobileAlt} /> {/* Icône */}
              <span>{currentUser?.phone || 'Téléphone non renseigné'}</span>
              <span style={{marginLeft: '10px'}}></span>
              <a href="#" onClick={(e)=>{e.preventDefault(); setEditModalOpen(true);}}>modifier</a>
            </div>
          </div>
          
          {/* Liens utiles Section */}
          <div className="useful-links-section">
            <h4 className="useful-links-title">Liens utiles</h4>
            <div className="useful-links-list">
              <Link to="/help" className="useful-link-item">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>Aide générale</span>
              </Link>
              <Link to="/contact" className="useful-link-item">
                <FontAwesomeIcon icon={faEnvelope} />
                <span>Contact</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="content-section">
          
          {/* Messages Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Mes derniers messages</h3>
            </div>
            <div className="card-body">
              <p className="message-empty">Aucune réponse de propriétaire pour le moment</p>
            </div>
          </div>
          
          {/* Locations Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Locations à venir</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <p className="location-empty">Chargement...</p>
              ) : upcomingReservations.length > 0 ? (
                <div className="reservations-list">
                  {upcomingReservations.map((reservation, index) => (
                    <div key={reservation._id || index} className="reservation-item">
                      <div className="reservation-info">
                        <h4>{reservation.boat?.name || 'Bateau'}</h4>
                        <p>{new Date(reservation.startDate).toLocaleDateString('fr-FR')} - {new Date(reservation.endDate).toLocaleDateString('fr-FR')}</p>
                        <p className="price">{reservation.price || reservation.totalPrice}€</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="location-empty">Vos 2 prochaines réservations apparaîtront ici</p>
              )}
            </div>
          </div>
          

        </div>
      </div>
      
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
      
      {/* Modal modification profil (email/téléphone) */}
      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        currentEmail={currentUser?.email}
        currentPhone={currentUser?.phone}
        currentSiret={currentUser?.siret}
        currentSiren={currentUser?.siren}
        onSave={async ({ email, phone, idCardUrl, siret, siren }) => {
          await userService.updateProfile(currentUser._id, { email, phone, idCardUrl, siret, siren });
          // Option: mettre à jour l'affichage localement
          if (currentUser) {
            currentUser.email = email;
            currentUser.phone = phone;
            if (idCardUrl) currentUser.idCardUrl = idCardUrl;
            if (typeof siret !== 'undefined') currentUser.siret = siret;
            if (typeof siren !== 'undefined') currentUser.siren = siren;
          }
        }}
      />

      {/* Modal lecture seule du profil */}
      <ViewProfileModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        user={currentUser}
      />

      {/* Modal suppression de compte */}
      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-2">Supprimer mon compte</h3>
            <p className="text-sm text-gray-600 mb-4">Cette action est irréversible. Entrez votre mot de passe pour confirmer.</p>
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
      
      {/* Help Button */}
      <div className="help-button">
        <FontAwesomeIcon icon={faQuestionCircle} />
      </div>
    </div>
  );
};

export default SimpleDashboard;