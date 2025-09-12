import React, { useEffect, useState, useRef } from 'react';
import contractualDocumentService from '../services/contractualDocument.service';

const docLabels = {
  contratLocation: 'Contrat de location',
  attestationAssurance: 'Attestation d’assurance',
  cvMarin: 'CV de marin',
  permisBateau: 'Permis bateau',
};

const OwnerDocsSection = ({ ownerId, token }) => {
  const [docs, setDocs] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputs = useRef({});

  const fetchDocs = async () => {
    setLoading(true);
    setError(null);
    try {
      const documents = await contractualDocumentService.getUserDocuments();
      // Convertir le tableau en objet avec les types comme clés
      const docsMap = {};
      documents.forEach(doc => {
        docsMap[doc.documentType] = doc.firebaseUrl;
      });
      setDocs(docsMap);
    } catch (err) {
      setError("Erreur lors du chargement des documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUpload = async (type, file) => {
    setLoading(true);
    setError(null);
    try {
      await contractualDocumentService.uploadDocument(type, file);
      fetchDocs();
    } catch (err) {
      setError("Erreur lors de l'upload du fichier.");
      setLoading(false);
    }
  };

  const handleDelete = async (type) => {
    setLoading(true);
    setError(null);
    try {
      // Trouver le document à supprimer
      const documents = await contractualDocumentService.getUserDocuments();
      const docToDelete = documents.find(doc => doc.documentType === type);
      if (docToDelete) {
        await contractualDocumentService.deleteDocument(docToDelete._id);
        fetchDocs();
      }
    } catch (err) {
      setError("Erreur lors de la suppression du fichier.");
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 card p-6">
      <h2 className="font-montserrat text-xl font-semibold text-dark mb-4">Documents contractuels</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(docLabels).map(([type, label]) => (
          <div key={type} className="flex flex-col space-y-2">
            <span className="font-medium">{label}</span>
            {docs[type] ? (
              <div className="flex items-center space-x-3">
                <a
                  href={docs[type]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Voir / Télécharger
                </a>
                <button
                  className="btn-danger text-xs px-2 py-1"
                  onClick={() => handleDelete(type)}
                  disabled={loading}
                >
                  Supprimer
                </button>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  style={{ display: 'none' }}
                  ref={el => (fileInputs.current[type] = el)}
                  onChange={e => {
                    if (e.target.files && e.target.files.length > 0) handleUpload(type, e.target.files[0]);
                  }}
                  disabled={loading}
                />
                <button
                  className="btn-primary text-xs px-2 py-1"
                  onClick={() => fileInputs.current[type].click()}
                  disabled={loading}
                >
                  Téléverser
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerDocsSection;
