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

      {/* Upload compact */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Ajouter des documents</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {['contratLocation', 'assurance', 'permisNavigation', 'certificatSecurite'].map(docType => (
            <div key={docType} className="text-center">
              <label className="cursor-pointer block p-2 border rounded hover:bg-gray-50">
                <div className="text-xs font-medium mb-1">{getDocumentTypeLabel(docType)}</div>
                <div className="text-xs text-primary">+ Fichier</div>
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, docType)}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          ))}
        </div>
        {uploading && <p className="text-xs text-center mt-2 text-primary">Upload...</p>}
      </div>

      {/* Liste compacte des documents existants */}
      {documents.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Documents ({documents.length})</h3>
          <div className="space-y-1">
            {documents.map(doc => (
              <div key={doc._id} className="flex items-center justify-between p-2 text-sm border rounded">
                <div className="flex-1">
                  <span className="font-medium">{getDocumentTypeLabel(doc.documentType)}</span>
                  <span className="text-gray-500 ml-2">{doc.originalName}</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <a href={doc.firebaseUrl} target="_blank" rel="noopener noreferrer" className="text-primary">Voir</a>
                  <button onClick={() => handleDelete(doc._id)} className="text-red-600">×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractualDocsSection;
