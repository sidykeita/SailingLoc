import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import EditProfileModal from '../../components/EditProfileModal';
import { updateProfile } from '../../services/user.service';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleSaveProfile = async ({ email, phone }) => {
    try {
      const updatedUser = await updateProfile({ 
        ...user, 
        email, 
        phone 
      });
      updateUser(updatedUser);
      toast.success('Profil mis à jour avec succès');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Erreur lors de la mise à jour du profil');
      throw error;
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-24 font-medium text-gray-600">Nom</div>
            <div>{profile.firstName} {profile.lastName}</div>
          </div>
          
          <div className="flex items-center">
            <div className="w-24 font-medium text-gray-600">Email</div>
            <div>{profile.email}</div>
          </div>
          
          <div className="flex items-center">
            <div className="w-24 font-medium text-gray-600">Téléphone</div>
            <div>{profile.phone || 'Non renseigné'}</div>
          </div>
          
          <div className="pt-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Modifier mes informations
            </button>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentEmail={profile.email}
        currentPhone={profile.phone}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default ProfilePage;
