import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logoColor from '../../assets/images/logo-SailingLOC-couleur.png';

const AddBoat = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  
  // État du formulaire
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    type: '',
    length: '',
    capacity: '',
    pricePerDay: '',
    status: 'available',
    image: null
  });
  
  // État des erreurs
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  
  // Gestionnaire de changement pour les inputs
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  // Gestionnaire pour l'upload d'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Créer un aperçu
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Effacer l'erreur
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    }
  };
  
  // Validation locale
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du bateau est obligatoire';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'La ville est obligatoire';
    }
    
    if (!formData.type) {
      newErrors.type = 'Le type de bateau est obligatoire';
    }
    
    if (!formData.length || formData.length <= 0) {
      newErrors.length = 'La longueur est obligatoire';
    }
    
    if (!formData.capacity || formData.capacity <= 0) {
      newErrors.capacity = 'La capacité est obligatoire';
    }
    
    if (!formData.pricePerDay || formData.pricePerDay <= 0) {
      newErrors.pricePerDay = 'Le prix par jour est obligatoire';
    }
    
    if (!formData.image) {
      newErrors.image = 'Une image est obligatoire';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Données du formulaire:', formData);
      alert('Bateau ajouté avec succès ! (Voir console pour les données)');
    }
  };

  const handleLogout = () => {
    logout();
    // La redirection sera gérée par le ProtectedRoute
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header - Same as OwnerDashboard */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-12">
              <img src={logoColor} alt="SailingLOC" className="h-full" />
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="text-dark mr-4">Bonjour, {currentUser?.name || 'Propriétaire'}</span>
            <button 
              onClick={handleLogout}
              className="bg-neutral hover:bg-gray-300 text-dark py-2 px-4 rounded-md transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content - Same background and title style as OwnerDashboard */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-pacifico text-primary text-3xl">Ajouter un bateau</h1>
          <button
            onClick={() => navigate('/owner/dashboard')}
            className="flex items-center space-x-2 px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Retour au tableau de bord</span>
          </button>
        </div>

        {/* Form container using card style from OwnerDashboard */}
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload d'image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo du bateau <span className="text-red-500">*</span>
              </label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                errors.image ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-primary'
              }`}>
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                        aria-describedby={errors.image ? 'image-error' : undefined}
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer text-primary hover:text-blue-700 font-medium"
                      >
                        Changer l'image
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                        aria-describedby={errors.image ? 'image-error' : undefined}
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer text-primary hover:text-blue-700 font-medium"
                      >
                        Cliquez pour sélectionner une image
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                  </div>
                )}
              </div>
              {errors.image && (
                <p id="image-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.image}
                </p>
              )}
            </div>
            
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du bateau <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Ex: Sea Explorer"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.name ? 'border-red-300 bg-red-50' : ''
                  }`}
                  aria-invalid={errors.name ? 'true' : 'false'}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  Ville <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  placeholder="Ex: Marseille"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.city ? 'border-red-300 bg-red-50' : ''
                  }`}
                  aria-invalid={errors.city ? 'true' : 'false'}
                  aria-describedby={errors.city ? 'city-error' : undefined}
                />
                {errors.city && (
                  <p id="city-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.city}
                  </p>
                )}
              </div>
            </div>
            
            {/* Type de bateau */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Type de bateau <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.type ? 'border-red-300 bg-red-50' : ''
                }`}
                aria-invalid={errors.type ? 'true' : 'false'}
                aria-describedby={errors.type ? 'type-error' : undefined}
              >
                <option value="">Sélectionnez le type de bateau</option>
                <option value="Voilier">Voilier</option>
                <option value="Moteur">Moteur</option>
                <option value="Catamaran">Catamaran</option>
              </select>
              {errors.type && (
                <p id="type-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.type}
                </p>
              )}
            </div>
            
            {/* Caractéristiques techniques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-2">
                  Longueur (pieds) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="length"
                  placeholder="36"
                  value={formData.length}
                  onChange={(e) => handleInputChange('length', e.target.value)}
                  min="1"
                  className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.length ? 'border-red-300 bg-red-50' : ''
                  }`}
                  aria-invalid={errors.length ? 'true' : 'false'}
                  aria-describedby={errors.length ? 'length-error' : undefined}
                />
                {errors.length && (
                  <p id="length-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.length}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                  Capacité (personnes) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="capacity"
                  placeholder="8"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  min="1"
                  className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.capacity ? 'border-red-300 bg-red-50' : ''
                  }`}
                  aria-invalid={errors.capacity ? 'true' : 'false'}
                  aria-describedby={errors.capacity ? 'capacity-error' : undefined}
                />
                {errors.capacity && (
                  <p id="capacity-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.capacity}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-700 mb-2">
                  Prix par jour (€) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="pricePerDay"
                  placeholder="450"
                  value={formData.pricePerDay}
                  onChange={(e) => handleInputChange('pricePerDay', e.target.value)}
                  min="1"
                  step="0.01"
                  className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.pricePerDay ? 'border-red-300 bg-red-50' : ''
                  }`}
                  aria-invalid={errors.pricePerDay ? 'true' : 'false'}
                  aria-describedby={errors.pricePerDay ? 'pricePerDay-error' : undefined}
                />
                {errors.pricePerDay && (
                  <p id="pricePerDay-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.pricePerDay}
                  </p>
                )}
              </div>
            </div>
            
            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut du bateau <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="available"
                    checked={formData.status === 'available'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    formData.status === 'available'
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-primary hover:bg-blue-50'
                  }`}>
                    Disponible
                  </div>
                </label>
                
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="rented"
                    checked={formData.status === 'rented'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    formData.status === 'rented'
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-primary hover:bg-blue-50'
                  }`}>
                    En location
                  </div>
                </label>
              </div>
            </div>
            
            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={() => navigate('/owner/dashboard')}
                className="btn-secondary py-3 px-6"
              >
                Annuler
              </button>
              
              <button
                type="submit"
                className="btn-primary py-3 px-6"
              >
                Enregistrer le bateau
              </button>
            </div>
          </form>
        </div>
      </main>
      
      {/* Footer - Exactly the same as OwnerDashboard */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v10a2 2 0 002 2z"></path>
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

export default AddBoat;
