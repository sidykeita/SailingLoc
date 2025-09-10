import { useState } from 'react';
import { uploadIdCard } from '../services/idCardUpload';

export default function EditProfileModal({ isOpen, onClose, currentEmail, currentPhone, onSave }) {
  const [email, setEmail] = useState(currentEmail || '');
  const [phone, setPhone] = useState(currentPhone || '');
  const [idCard, setIdCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let idCardUrl = null;
      
      // Upload de la carte d'identité si un fichier est sélectionné
      if (idCard) {
        const uploadResult = await uploadIdCard(idCard, 'user_' + Date.now());
        idCardUrl = uploadResult.url;
      }
      
      await onSave({ email, phone, idCardUrl });
      onClose();
    } catch (err) {
      setError(err?.message || 'Erreur lors de la modification.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        <h2 className="text-xl font-semibold mb-4">Modifier mon profil</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Téléphone</label>
            <input
              type="tel"
              className="w-full border rounded px-3 py-2"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Carte d'identité</label>
            <input
              type="file"
              className="w-full border rounded px-3 py-2"
              accept="image/*,.pdf"
              onChange={e => setIdCard(e.target.files[0])}
            />
            <p className="text-xs text-gray-500 mt-1">Formats acceptés: JPG, PNG, PDF</p>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={onClose} className="btn-secondary">Annuler</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
