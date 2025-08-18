import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import boatService from '../../services/boat.service';
import { useAuth } from '../../contexts/AuthContext';
import logoColor from '../../assets/images/logo-SailingLOC-couleur.png';

const AddBoat = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const fileInputRef = useRef(null);

  const handleLogout = () => {
    logout();
    // La redirection sera gérée par le ProtectedRoute
  };

  const [form, setForm] = useState({
    name: '',
    model: '',
    type: '',
    length: '',
    capacity: '',
    dailyPrice: '',
    port: '',
    status: 'available', // 'available' | 'rented'
    description: '',
    cabins: '',
    skipper: false,
  });
  // Liste d'équipements courants (à personnaliser si besoin)
  const ALL_FEATURES = [
    "GPS", "Radio", "Glacière", "Douche", "Plateforme de baignade", "Bain de soleil", "Cuisine équipée", "Toilettes marines", "Table pique-nique"
  ];
  const [features, setFeatures] = useState([]);
  // Caractéristiques techniques dynamiques
  const [technicalSpecs, setTechnicalSpecs] = useState({
    year: '',
    engine: '',
    fuelCapacity: '',
    maxSpeed: '',
    weight: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!imageFile) newErrors.photo = "La photo est obligatoire.";
    if (!form.name.trim()) newErrors.name = "Le nom du bateau est obligatoire.";
    if (!form.model.trim()) newErrors.model = "Le modèle est obligatoire.";
    if (!form.type.trim()) newErrors.type = "Le type de bateau est obligatoire.";
    if (!form.port.trim()) newErrors.port = "Le port d'attache est obligatoire.";
    if (!form.description.trim()) newErrors.description = "La description est obligatoire.";
    if (!form.length || Number(form.length) <= 0) newErrors.length = "La longueur est obligatoire.";
    if (!form.capacity || Number(form.capacity) <= 0) newErrors.capacity = "La capacité est obligatoire.";
    if (!form.cabins || Number(form.cabins) < 0) newErrors.cabins = "Le nombre de cabines est obligatoire (0 si aucune).";
    if (!form.dailyPrice || Number(form.dailyPrice) <= 0) newErrors.dailyPrice = "Le prix par jour est obligatoire.";
    if (!form.status) newErrors.status = "Le statut est obligatoire.";
    if (typeof form.skipper !== 'boolean') newErrors.skipper = "Merci d'indiquer si le skipper est obligatoire.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value };
      setErrors(validate(updated));
      return updated;
    });
  };

  const handleSelectType = (e) => {
    setForm((prev) => ({ ...prev, type: e.target.value }));
  };

  const handleStatus = (status) => {
    setForm((prev) => ({ ...prev, status }));
  };

  const handleDropzoneClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors(validate({ ...form, photo: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setSubmitting(false);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        model: form.model.trim(),
        type: form.type.trim(),
        length: Number(form.length) || 0,
        capacity: Number(form.capacity) || 0,
        dailyPrice: Number(form.dailyPrice) || 0,
        port: form.port.trim(),
        status: form.status,
        description: form.description.trim(),
        cabins: Number(form.cabins) || 0,
        skipper: !!form.skipper,
        features: features.filter(f => f.trim() !== ''),
        technicalSpecs,
      };
      // Upload image sur Firebase si présente
      let photoUrls = [];
      if (imageFile) {
        console.log('Upload image sur Firebase...');
        const storageRef = ref(storage, `boats/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        console.log('Image uploadée, récupération URL...');
        const url = await getDownloadURL(storageRef);
        console.log('URL récupérée:', url);
        photoUrls = [url];
      }
      const finalPayload = {
        ...payload,
        photos: photoUrls,
        status: form.status === 'available' ? 'disponible' : (form.status === 'rented' ? 'en location' : form.status),
        skipper: !!form.skipper,
      };
      console.log('Payload final:', finalPayload);

      // Ajoute un timeout de debug
      const timeout = setTimeout(() => {
        setError('Le serveur ne répond pas, vérifiez la connexion ou la structure des données.');
        setSubmitting(false);
      }, 10000);

      const res = await boatService.createBoat(finalPayload);
      clearTimeout(timeout);

      console.log('Réponse backend:', res);
      if (res && res.success === false) {
        setError(res.message || 'Erreur lors de la création du bateau');
        setSubmitting(false);
        return;
      }
      navigate('/owner/dashboard', { state: { added: true } });
    } catch (err) {
      setError(err?.message || 'Erreur lors de la création du bateau');
      console.error('Erreur submit:', err);
    } finally {
      setSubmitting(false);
      console.log('Fin submit');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header identique OwnerDashboard */}
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
      <main className="container mx-auto px-4 py-8">
        <div className="card p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="font-montserrat text-2xl font-semibold text-dark">Ajouter un bateau</div>
            <button onClick={() => navigate('/owner/dashboard')} className="btn-secondary">← Retour au tableau de bord</button>
          </div>
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Zone d'upload image (visuelle uniquement) */}
            <div>
              <label className="block text-sm text-gray-700 mb-2 font-semibold">Photo du bateau <span className="text-orange-500">*</span></label>
              <div
                onClick={handleDropzoneClick}
                className={`w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex ${!imagePreview ? 'flex-col justify-center items-center' : 'items-center justify-center'} text-gray-500 cursor-pointer hover:border-primary/60 overflow-hidden relative ${errors.photo ? 'border-red-500' : ''}`}
              >
                {!imagePreview && (
                  <>
                    <div className="text-3xl font-bold">+</div>
                    <div className="mt-2 font-medium">Cliquez pour sélectionner une image</div>
                    <div className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG, jusqu'à 10MB</div>
                  </>
                )}
                {imagePreview && (
                  <div className="flex items-center justify-center w-full h-full">
                    <img src={imagePreview} alt="Aperçu" className="max-w-[96%] max-h-[96%] object-contain rounded-lg shadow z-10" />
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>
              {errors.photo && <div className="text-red-600 text-xs mt-1">{errors.photo}</div>}
            </div>
            {/* Nom + Modèle + Port */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1 font-semibold">Nom du bateau <span className="text-orange-500">*</span></label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full input border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-gray-50 shadow-sm placeholder-gray-400 text-base py-2 px-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`}
                  placeholder="Ex: Sea Explorer"
                />
                {errors.name && <div className="text-red-600 text-xs mt-1">{errors.name}</div>}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1 font-semibold">Modèle <span className="text-orange-500">*</span></label>
                <input
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  className={`w-full input border ${errors.model ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-gray-50 shadow-sm placeholder-gray-400 text-base py-2 px-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`}
                  placeholder="Ex: Lagoon 42"
                />
                {errors.model && <div className="text-red-600 text-xs mt-1">{errors.model}</div>}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1 font-semibold">Port <span className="text-orange-500">*</span></label>
                <input
                  name="port"
                  value={form.port}
                  onChange={handleChange}
                  className={`w-full input border ${errors.port ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-gray-50 shadow-sm placeholder-gray-400 text-base py-2 px-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`}
                  placeholder="Ex: Marseille"
                />
                {errors.port && <div className="text-red-600 text-xs mt-1">{errors.port}</div>}
              </div>
            </div>
            {/* Description */}
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-semibold">Description <span className="text-orange-500">*</span></label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className={`w-full input border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-gray-50 shadow-sm placeholder-gray-400 text-base py-2 px-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[80px]`}
                placeholder="Décrivez votre bateau, ses atouts, équipements..."
              />
              {errors.description && <div className="text-red-600 text-xs mt-1">{errors.description}</div>}
            </div>
            {/* Type (select) */}
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-semibold">Type de bateau <span className='text-orange-500'>*</span></label>
              <select
                value={form.type}
                onChange={handleSelectType}
                className={`w-full input border ${errors.type ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-gray-50 shadow-sm placeholder-gray-400 text-base py-2 px-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`}
              >
                <option value="" disabled>Sélectionnez le type de bateau</option>
                <option value="voilier">Voilier</option>
                <option value="catamaran">Catamaran</option>
                <option value="bateau-moteur">bateau-moteur</option>
                <option value="yacht">Yacht</option>
                <option value="semi-rigide">Semi-rigide</option>
              </select>
              {errors.type && <div className="text-red-600 text-xs mt-1">{errors.type}</div>}
            </div>
            {/* Caractéristiques techniques dynamiques */}
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-semibold">Caractéristiques techniques</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Année"
                  value={technicalSpecs.year}
                  onChange={e => setTechnicalSpecs({ ...technicalSpecs, year: e.target.value })}
                  className="input border border-gray-300 rounded-lg bg-gray-50 shadow-sm placeholder-gray-400 text-base py-2 px-3"
                />
                <input
                  type="text"
                  placeholder="Moteur"
                  value={technicalSpecs.engine}
                  onChange={e => setTechnicalSpecs({ ...technicalSpecs, engine: e.target.value })}
                  className="input border border-gray-300 rounded-lg bg-gray-50 shadow-sm placeholder-gray-400 text-base py-2 px-3"
                />
                <input
                  type="text"
                  placeholder="Capacité carburant"
                  value={technicalSpecs.fuelCapacity}
                  onChange={e => setTechnicalSpecs({ ...technicalSpecs, fuelCapacity: e.target.value })}
                  className="input border border-gray-300 rounded-lg bg-gray-50 shadow-sm placeholder-gray-400 text-base py-2 px-3"
                />
                <input
                  type="text"
                  placeholder="Vitesse max"
                  value={technicalSpecs.maxSpeed}
                  onChange={e => setTechnicalSpecs({ ...technicalSpecs, maxSpeed: e.target.value })}
                  className="input border border-gray-300 rounded-lg bg-gray-50 shadow-sm placeholder-gray-400 text-base py-2 px-3"
                />
                <input
                  type="text"
                  placeholder="Poids"
                  value={technicalSpecs.weight}
                  onChange={e => setTechnicalSpecs({ ...technicalSpecs, weight: e.target.value })}
                  className="input border border-gray-300 rounded-lg bg-gray-50 shadow-sm placeholder-gray-400 text-base py-2 px-3"
                />
              </div>
            </div>
            {/* Équipements (cases à cocher) */}
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-semibold">Équipements</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {ALL_FEATURES.map((feat) => (
                  <label key={feat} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={features.includes(feat)}
                      onChange={e => {
                        if (e.target.checked) setFeatures([...features, feat]);
                        else setFeatures(features.filter(f => f !== feat));
                      }}
                    />
                    {feat}
                  </label>
                ))}
              </div>
            </div>
            {/* Longueur / Capacité / Cabines / Prix */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1 font-semibold">Longueur (pieds) <span className="text-orange-500">*</span></label>
                <input
                  name="length"
                  type="number"
                  value={form.length}
                  onChange={handleChange}
                  className={`w-full input border ${errors.length ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-gray-50 shadow-sm placeholder-gray-400 text-base py-2 px-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`}
                />
                {errors.length && <div className="text-red-600 text-xs mt-1">{errors.length}</div>}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1 font-semibold">Capacité <span className="text-orange-500">*</span></label>
                <input
                  name="capacity"
                  type="number"
                  value={form.capacity}
                  onChange={handleChange}
                  className={`w-full input border ${errors.capacity ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-gray-50 shadow-sm placeholder-gray-400 text-base py-2 px-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`}
                />
                {errors.capacity && <div className="text-red-600 text-xs mt-1">{errors.capacity}</div>}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1 font-semibold">Cabines <span className="text-orange-500">*</span></label>
                <input
                  name="cabins"
                  type="number"
                  value={form.cabins}
                  onChange={handleChange}
                  className={`w-full input border ${errors.cabins ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-gray-50 shadow-sm placeholder-gray-400 text-base py-2 px-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`}
                  placeholder="Ex: 2"
                />
                {errors.cabins && <div className="text-red-600 text-xs mt-1">{errors.cabins}</div>}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1 font-semibold">Prix par jour (€) <span className='text-orange-500'>*</span></label>
                <input
                  name="dailyPrice"
                  type="number"
                  value={form.dailyPrice}
                  onChange={handleChange}
                  className={`w-full input border ${errors.dailyPrice ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-gray-50 shadow-sm placeholder-gray-400 text-base py-2 px-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all`}
                />
                {errors.dailyPrice && <div className="text-red-600 text-xs mt-1">{errors.dailyPrice}</div>}
              </div>
            </div>
            {/* Statut */}
            <div>
              <label className="block text-sm text-gray-700 mb-2 font-semibold">Statut du bateau <span className='text-orange-500'>*</span></label>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => handleStatus('available')}
                  className={`px-3 py-2 rounded-md text-sm border ${form.status === 'available' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300'}`}
                >
                  Disponible
                </button>
                <button
                  type="button"
                  onClick={() => handleStatus('rented')}
                  className={`px-3 py-2 rounded-md text-sm border ${form.status === 'rented' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300'}`}
                >
                  En location
                </button>
              </div>
              {errors.status && <div className="text-red-600 text-xs mt-1">{errors.status}</div>}
              {/* Skipper obligatoire */}
              <div className="flex items-center gap-4 mt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="skipper"
                    checked={!!form.skipper}
                    onChange={() => setForm((prev) => ({ ...prev, skipper: true }))}
                    className="accent-primary w-4 h-4 rounded border-gray-300 focus:ring-primary/40"
                  />
                  <span className="text-sm text-gray-700">Skipper obligatoire <span className="text-orange-500">*</span></span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="skipper"
                    checked={!form.skipper}
                    onChange={() => setForm((prev) => ({ ...prev, skipper: false }))}
                    className="accent-primary w-4 h-4 rounded border-gray-300 focus:ring-primary/40"
                  />
                  <span className="text-sm text-gray-700">Sans skipper <span className="text-orange-500">*</span></span>
                </label>
              </div>
              {errors.skipper && <div className="text-red-600 text-xs mt-1">{errors.skipper}</div>}
            </div>
            <div className="flex justify-center gap-4 pt-6">
              <button
                type="button"
                className="btn-secondary px-6 py-3"
                onClick={() => navigate('/owner/dashboard')}
                disabled={submitting}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-primary px-6 py-3 flex items-center justify-center"
                disabled={submitting || Object.keys(errors).length > 0}
              >
                {submitting && (
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                )}
                {submitting ? 'Ajout en cours...' : 'Ajouter le bateau'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddBoat;
