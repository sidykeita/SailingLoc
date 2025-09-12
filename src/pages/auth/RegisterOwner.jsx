import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUpload, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../../assets/css/Register.css';
import { RECAPTCHA_SITE_KEY, isRecaptchaEnabled } from '../../config/recaptcha';

const RegisterOwner = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [ownerStatus, setOwnerStatus] = useState('particulier'); // particulier ou professionnel
  const [siret, setSiret] = useState('');
  const [siren, setSiren] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [networkConnected, setNetworkConnected] = useState(true);
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const recaptchaRef = useRef({ widgetId: null, initialized: false });
  const recaptchaContainerRef = useRef(null);

  // Documents contractuels obligatoires
  const [documents, setDocuments] = useState({
    contratLocation: null,
    attestationAssurance: null,
    cvMarin: null,
    permisBateau: null
  });
  const [documentErrors, setDocumentErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  // Vérifier la connexion réseau au chargement
  useEffect(() => {
    setNetworkConnected(navigator.onLine);

    const handleOnline = () => setNetworkConnected(true);
    const handleOffline = () => setNetworkConnected(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize reCAPTCHA
  useEffect(() => {
    if (!isRecaptchaEnabled) return;

    let timer;

    const loadRecaptcha = () => {
      if (window.grecaptcha) {
        initializeRecaptcha();
      } else {
        timer = setTimeout(() => {
          if (window.grecaptcha) {
            initializeRecaptcha();
          } else {
            console.error('reCAPTCHA API failed to load');
            setRecaptchaError('Impossible de charger le CAPTCHA. Veuillez recharger la page.');
          }
        }, 2000);
      }
    };

    const initializeRecaptcha = () => {
      try {
        if (recaptchaRef.current.initialized) {
          setIsRecaptchaReady(true);
          return;
        }
        const container = recaptchaContainerRef.current;
        if (!container) {
          console.error('reCAPTCHA container not found');
          return;
        }

        if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
          const widgetId = window.grecaptcha.render(container, {
            sitekey: RECAPTCHA_SITE_KEY,
            callback: (token) => {
              setRecaptchaToken(token);
              setRecaptchaError('');
            },
            'expired-callback': () => {
              setRecaptchaToken('');
            },
            'error-callback': (error) => {
              setRecaptchaToken('');
              setRecaptchaError('Erreur lors de la vérification CAPTCHA. Veuillez réessayer.');
            }
          });
          recaptchaRef.current = { widgetId, initialized: true };
          setIsRecaptchaReady(true);
        }
      } catch (error) {
        console.error('Error initializing reCAPTCHA:', error);
        setRecaptchaError('Erreur lors du chargement du CAPTCHA. Veuillez recharger la page.');
      }
    };

    const handleRecaptchaReady = () => {
      loadRecaptcha();
    };

    document.addEventListener('recaptchaReady', handleRecaptchaReady);

    if (window.recaptchaLoaded) {
      loadRecaptcha();
    }

    // Cleanup function
    return () => {
      document.removeEventListener('recaptchaReady', handleRecaptchaReady);
      if (timer) clearTimeout(timer);

      if (recaptchaRef.current && window.grecaptcha && typeof window.grecaptcha.reset === 'function') {
        try {
          window.grecaptcha.reset(recaptchaRef.current.widgetId);
        } catch (e) {
          console.warn('Error resetting reCAPTCHA:', e);
        }
      }
      recaptchaRef.current = { widgetId: null, initialized: false };
    };
  }, [isRecaptchaEnabled]);

  // Gestion de l'upload de documents
  const handleDocumentUpload = (docType, file) => {
    if (!file) return;
    
    // Validation du type de fichier
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setDocumentErrors(prev => ({
        ...prev,
        [docType]: 'Format non supporté. Utilisez PDF, JPG ou PNG.'
      }));
      return;
    }

    // Validation de la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setDocumentErrors(prev => ({
        ...prev,
        [docType]: 'Fichier trop volumineux. Maximum 5MB.'
      }));
      return;
    }

    setDocuments(prev => ({
      ...prev,
      [docType]: file
    }));
    setDocumentErrors(prev => ({
      ...prev,
      [docType]: null
    }));
  };

  // Validation SIRET/SIREN
  const validateSiret = (value) => {
    const cleaned = value.replace(/\s/g, '');
    return cleaned.length === 14 && /^\d{14}$/.test(cleaned);
  };

  const validateSiren = (value) => {
    const cleaned = value.replace(/\s/g, '');
    return cleaned.length === 9 && /^\d{9}$/.test(cleaned);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!networkConnected) {
      setError('Vérifiez votre connexion internet et réessayez.');
      return;
    }

    if (!acceptTerms) {
      setError('Veuillez accepter les conditions d\'utilisation pour continuer.');
      return;
    }

    if (isRecaptchaEnabled && !recaptchaToken) {
      setRecaptchaError('Veuillez valider le CAPTCHA');
      return;
    }

    // Validation des champs de base
    if (!name || !email || !password || !confirmPassword || !phoneNumber) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validation spécifique au statut professionnel
    if (ownerStatus === 'professionnel') {
      if (!siret || !validateSiret(siret)) {
        setError('SIRET invalide. Il doit contenir exactement 14 chiffres sans espaces.');
        return;
      }
      if (!siren || !validateSiren(siren)) {
        setError('SIREN invalide. Il doit contenir exactement 9 chiffres sans espaces.');
        return;
      }
    }

    // Validation des documents obligatoires
    const missingDocs = Object.entries(documents)
      .filter(([key, file]) => !file)
      .map(([key]) => key);
    
    if (missingDocs.length > 0) {
      const docNames = {
        contratLocation: 'Contrat de location',
        attestationAssurance: 'Attestation d\'assurance',
        cvMarin: 'CV de marin',
        permisBateau: 'Permis bateau'
      };
      const missingNames = missingDocs.map(doc => docNames[doc]).join(', ');
      setError(`Documents manquants : ${missingNames}`);
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      setError('');
      setLoading(true);
      setNetworkConnected(true);

      // Préparation des données utilisateur pour l'inscription
      const userData = {
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' '),
        email,
        password,
        phoneNumber,
        ownerStatus,
        role: 'propriétaire'
      };

      // Ajout des données professionnelles si nécessaire
      if (ownerStatus === 'professionnel') {
        userData.siret = siret.replace(/\s/g, '');
        userData.siren = siren.replace(/\s/g, '');
      }

      userData.phone = userData.phoneNumber;
      delete userData.phoneNumber;

      // 1) Uploader d'abord les documents vers Firebase (pre-register)
      const contractualDocumentService = (await import('../../services/contractualDocument.service')).default;
      const docsMeta = [];
      for (const [docType, file] of Object.entries(documents)) {
        if (file) {
          const meta = await contractualDocumentService.uploadPreRegister(docType, file, email);
          docsMeta.push(meta);
        }
      }
      // Attacher les métadonnées à l'inscription pour une création atomique côté backend
      userData.documents = docsMeta;

      // 2) Créer le compte (le backend refusera si des documents manquent)
      const user = await register(userData, recaptchaToken);

      // 3) Redirection vers le dashboard propriétaire
      navigate('/owner/dashboard');
    } catch (err) {
      console.error('Erreur d\'inscription:', err);
      if (!networkConnected) {
        setNetworkConnected(true);
        setError('Vérifiez votre connexion internet et réessayez.');
      } else {
        setError(err.message || 'Erreur lors de l\'inscription. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <Link to="/" className="back-to-home">
        <FontAwesomeIcon icon={faHome} />
      </Link>
      <div className="register-box">
        <div className="register-form-container">
          <div className="register-title">Inscription Propriétaire</div>
          <div className="register-subtitle">Mettez votre bateau en location et générez des revenus</div>

          {error && (
            <div className="error-alert" role="alert">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Statut du propriétaire */}
            <div className="form-group">
              <label className="form-label">
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                Statut du propriétaire
              </label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="particulier"
                    name="ownerStatus"
                    value="particulier"
                    checked={ownerStatus === 'particulier'}
                    onChange={(e) => setOwnerStatus(e.target.value)}
                  />
                  <label htmlFor="particulier">Particulier</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="professionnel"
                    name="ownerStatus"
                    value="professionnel"
                    checked={ownerStatus === 'professionnel'}
                    onChange={(e) => setOwnerStatus(e.target.value)}
                  />
                  <label htmlFor="professionnel">Professionnel</label>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="name" className="form-label">Nom complet</label>
              <input
                type="text"
                id="name"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">Numéro de téléphone</label>
              <input
                type="tel"
                id="phoneNumber"
                className="form-input"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            {/* Informations professionnelles (si professionnel) */}
            {ownerStatus === 'professionnel' && (
              <>
                <div className="form-group">
                  <label className="form-label">Informations professionnelles</label>
                  <div className="professional-info">
                    <div className="form-group">
                      <label htmlFor="siret" className="form-label">SIRET *</label>
                      <input
                        type="text"
                        id="siret"
                        className="form-input"
                        value={siret}
                        onChange={(e) => setSiret(e.target.value)}
                        placeholder="12345678901234"
                        maxLength="14"
                        required={ownerStatus === 'professionnel'}
                      />
                      <div className="form-hint">14 chiffres sans espaces</div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="siren" className="form-label">SIREN *</label>
                      <input
                        type="text"
                        id="siren"
                        className="form-input"
                        value={siren}
                        onChange={(e) => setSiren(e.target.value)}
                        placeholder="123456789"
                        maxLength="9"
                        required={ownerStatus === 'professionnel'}
                      />
                      <div className="form-hint">9 chiffres sans espaces</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="password" className="form-label">Mot de passe</label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="form-hint">Au moins 6 caractères</div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Documents contractuels obligatoires */}
            <div className="form-group">
              <label className="form-label">Documents contractuels</label>
              <div className="documents-section">
                {[
                  { key: 'contratLocation', label: 'Contrat de location' },
                  { key: 'attestationAssurance', label: 'Attestation d\'assurance' },
                  { key: 'cvMarin', label: 'CV de marin' },
                  { key: 'permisBateau', label: 'Permis bateau' }
                ].map(({ key, label }) => (
                  <div key={key} className="document-upload">
                    <div className="document-header">
                      <label className="document-label">{label}</label>
                      {documents[key] && (
                        <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                      )}
                    </div>
                    <div className="upload-area">
                      <input
                        type="file"
                        id={key}
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleDocumentUpload(key, e.target.files[0])}
                        className="file-input"
                        required
                      />
                      <label htmlFor={key} className="upload-button">
                        <FontAwesomeIcon icon={faUpload} className="mr-2" />
                        {documents[key] ? documents[key].name : 'Téléverser'}
                      </label>
                    </div>
                    {documentErrors[key] && (
                      <div className="error-text">
                        <FontAwesomeIcon icon={faTimes} className="mr-1" />
                        {documentErrors[key]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                />
                <label htmlFor="acceptTerms">
                  J'accepte les <a href="/terms" target="_blank" rel="noopener noreferrer">conditions d'utilisation</a> et la <a href="/privacy" target="_blank" rel="noopener noreferrer">politique de confidentialité</a>
                </label>
              </div>
            </div>

            {isRecaptchaEnabled ? (
              <div className="mb-4">
                <div
                  ref={recaptchaContainerRef}
                  style={{
                    minHeight: '78px',
                    backgroundColor: '#f9f9f9',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
                {!isRecaptchaReady && (
                  <div style={{ color: '#666', paddingTop: '8px', textAlign: 'center' }}>
                    Chargement du CAPTCHA...
                  </div>
                )}
                {recaptchaError && (
                  <div className="text-red-500 text-sm mt-2">{recaptchaError}</div>
                )}
              </div>
            ) : (
              <div className="text-yellow-600 text-sm mb-4">
                reCAPTCHA non activé. Vérifiez votre configuration.
              </div>
            )}

            <button
              type="submit"
              className="submit-button owner-button"
              disabled={loading || (isRecaptchaEnabled && !recaptchaToken)}
            >
              {loading ? 'Inscription en cours...' : 'Créer mon compte propriétaire'}
            </button>

            <div className="login-link">
              <p>Déjà inscrit ? <Link to="/login">Se connecter</Link></p>
            </div>
          </form>
        </div>

        <div className="terms">
          <p>
            En vous inscrivant, vous acceptez nos{' '}
            <a href="#">Conditions d'utilisation</a>{' '}
            et notre{' '}
            <a href="#">Politique de confidentialité</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterOwner;
