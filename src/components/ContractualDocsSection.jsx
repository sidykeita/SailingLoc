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
        <h2 className="font-montserrat text-xl font-semibold text-dark mb-2">Documents contractuels</h2>
      <div className="w-10 h-1 mb-4 bg-blue-500 rounded"></div>
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

      {/* Upload style purple buttons */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['contratLocation', 'assurance', 'permisNavigation', 'certificatSecurite'].map(docType => (
            <div key={docType}>
              <h4 className="text-sm font-medium text-gray-700 mb-2">{getDocumentTypeLabel(docType)}</h4>
              <label className="cursor-pointer block">
                <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 hover:from-blue-700 hover:via-blue-600 hover:to-indigo-600 text-white font-medium py-3 px-6 rounded-lg text-center transition-all duration-200 shadow-md hover:shadow-lg">
                  <span className="text-sm">Téléverser</span>
                </div>
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
        {uploading && (
          <div className="flex items-center justify-center mt-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <p className="text-sm text-blue-600">Upload en cours...</p>
          </div>
        )}
      </div>

      {/* Liste élégante des documents existants */}
      {documents.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Documents uploadés ({documents.length})</h3>
          <div className="space-y-2">
            {documents.map(doc => (
              <div key={doc._id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{getDocumentTypeLabel(doc.documentType)}</p>
                      <p className="text-xs text-gray-500">{doc.originalName} • {new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a 
                      href={doc.firebaseUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                      Voir
                    </a>
                    <button 
                      onClick={() => handleDelete(doc._id)}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      Supprimer
                    </button>
                  </div>
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
