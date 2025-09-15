import { useState, useEffect } from 'react';
import contractualDocumentService from '../services/contractualDocument.service';

const ContractualDocsSection = ({ userId }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await contractualDocumentService.getUserDocuments();
      setDocuments(Array.isArray(docs) ? docs : []);
    } catch (err) {
      setError('Erreur lors du chargement des documents');
      console.error('Erreur chargement documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event, documentType) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setError('');
      await contractualDocumentService.uploadViaFirebase(documentType, file, userId);
      await loadDocuments(); // Recharger la liste
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;

    try {
      await contractualDocumentService.deleteDocument(docId);
      await loadDocuments(); // Recharger la liste
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
    }
  };

  const getDocumentTypeLabel = (type) => {
    const labels = {
      'contratLocation': 'Contrat de location',
      'assurance': 'Assurance',
      'permisNavigation': 'Permis de navigation',
      'certificatSecurite': 'Certificat de sécurité'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="card p-6">
        <h2 className="font-montserrat text-xl font-semibold text-dark mb-4">Documents contractuels</h2>
        <p className="text-center py-4">Chargement des documents...</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h2 className="font-montserrat text-xl font-semibold text-dark mb-4">Documents contractuels</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Upload de nouveaux documents */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Ajouter des documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['contratLocation', 'assurance', 'permisNavigation', 'certificatSecurite'].map(docType => (
            <div key={docType} className="border rounded-lg p-4">
              <label className="block text-sm font-medium mb-2">
                {getDocumentTypeLabel(docType)}
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload(e, docType)}
                disabled={uploading}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
              />
            </div>
          ))}
        </div>
        {uploading && (
          <p className="text-center mt-4 text-primary">Upload en cours...</p>
        )}
      </div>

      {/* Liste des documents existants */}
      <div>
        <h3 className="font-semibold mb-3">Documents existants</h3>
        {documents.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Aucun document uploadé</p>
        ) : (
          <div className="space-y-3">
            {documents.map(doc => (
              <div key={doc._id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{getDocumentTypeLabel(doc.documentType)}</p>
                  <p className="text-sm text-gray-500">
                    {doc.originalName} • {new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={doc.firebaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-dark text-sm"
                  >
                    Voir
                  </a>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractualDocsSection;
