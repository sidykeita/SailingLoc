import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import boatService from '../../services/boat.service';
import logoColor from '../../assets/images/logo-SailingLOC-couleur.png';

const initialState = {
  name: '',
  city: '',
  type: '',
  length: '',
  capacity: '',
  pricePerDay: '',
  status: 'available',
  image: null,
};

const AddBoat = () => {
  const { logout } = useAuth();
  const [form, setForm] = useState(initialState);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleStatusChange = (status) => {
    setForm((prev) => ({ ...prev, status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Validation basique
      if (!form.name || !form.city || !form.type || !form.length || !form.capacity || !form.pricePerDay) {
        setError('Merci de remplir tous les champs obligatoires.');
        setLoading(false);
        return;
      }
      // Préparer les données pour FormData (upload image)
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null) formData.append(key, value);
      });
      await boatService.createBoat(formData);
      setLoading(false);
      navigate('/dashboard/owner');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'ajout du bateau.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col">

      <header className="bg-white shadow-md px-8 py-4 mb-6 flex items-center justify-between">
        <img src={logoColor} alt="Sailing.LOC" className="h-10 w-auto" />
        <button
          onClick={logout}
          className="bg-gray-400 hover:bg-gray-500 text-dark py-2 px-4 rounded-md transition-colors font-semibold"
        >
          Déconnexion
        </button>
      </header>
      <div className="flex items-center justify-between w-full px-8 mb-8" style={{minHeight: '48px'}}>
        <span className="font-pacifico text-primary text-3xl underline">Ajouter un bateau</span>
        <button
          onClick={() => navigate('/owner/dashboard')}
          type="button"
          className="border border-[#274991] text-[#274991] px-4 py-2 rounded-md hover:bg-[#274991] hover:text-white transition"
        >
          ← Retour au tableau de bord
        </button>
      </div>
      <main className="flex flex-col items-center justify-center flex-1">
        <form className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mt-0" onSubmit={handleSubmit}>


          {/* Upload image */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">Photo du bateau <span className="text-orange-500">*</span></label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center cursor-pointer bg-gray-50">
              <input type="file" accept="image/*" className="hidden" id="boat-image" onChange={handleImageChange} />
              <label htmlFor="boat-image" className="flex flex-col items-center cursor-pointer">
                {imagePreview ? (
                  <img src={imagePreview} alt="Aperçu" className="h-32 object-contain mb-2" />
                ) : (
                  <>
                    <span className="text-3xl mb-2">+</span>
                    <span className="text-gray-500">Cliquez pour sélectionner une image</span>
                    <span className="text-xs text-gray-400">PNG, JPG, JPEG, jusqu'à 10MB</span>
                  </>
                )}
              </label>
            </div>
          </div>
          {/* Nom et ville */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block font-semibold mb-2">Nom du bateau <span className="text-orange-500">*</span></label>
              <input type="text" name="name" value={form.name} onChange={handleInputChange} placeholder="Ex: Sea Explorer" className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-2">Ville <span className="text-orange-500">*</span></label>
              <input type="text" name="city" value={form.city} onChange={handleInputChange} placeholder="Ex: Marseille" className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
          </div>
          {/* Type de bateau */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">Type de bateau <span className="text-orange-500">*</span></label>
            <select name="type" value={form.type} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="">Sélectionnez le type de bateau</option>
              <option value="Voilier">Voilier</option>
              <option value="Moteur">Moteur</option>
              <option value="Catamaran">Catamaran</option>
              <option value="Yacht">Yacht</option>
            </select>
          </div>
          {/* Longueur, capacité, prix */}
          <div className="flex gap-8 mb-6 flex-wrap md:flex-nowrap items-end">
            <div className="flex-1 max-w-[180px]">
              <label className="block font-semibold mb-2">Longueur (pieds)  <span className="text-orange-500">*</span></label>
              <input type="number" name="length" value={form.length} onChange={handleInputChange} min="1" className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div className="flex-1 max-w-[180px]">
              <label className="block font-semibold mb-2">Capacité <span className="text-orange-500">*</span></label>
              <input type="number" name="capacity" value={form.capacity} onChange={handleInputChange} min="1" className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div className="flex-1 max-w-[180px]">
              <label className="block font-semibold mb-2">Prix par jour (€) <span className="text-orange-500">*</span></label>
              <input type="number" name="pricePerDay" value={form.pricePerDay} onChange={handleInputChange} min="0" className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
          </div>
          {/* Statut */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">Statut du bateau <span className="text-orange-500">*</span></label>
            <div className="flex gap-4">
              <button type="button" className={`px-4 py-2 rounded-md border ${form.status === 'available' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600'}`} onClick={() => handleStatusChange('available')}>Disponible</button>
              <button type="button" className={`px-4 py-2 rounded-md border ${form.status === 'rented' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600'}`} onClick={() => handleStatusChange('rented')}>En location</button>
            </div>
          </div>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          <button type="submit" className="w-full bg-[#274991] text-white font-semibold py-3 rounded-md hover:bg-[#153061] transition" disabled={loading}>{loading ? 'Ajout en cours...' : 'Ajouter le bateau'}</button>
          
        </form>
      </main>
    </div>
  );
};

export default AddBoat;
