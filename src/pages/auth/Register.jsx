import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import '../../assets/css/Register.css';
import { RECAPTCHA_SITE_KEY, isRecaptchaEnabled } from '../../config/recaptcha';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('locataire');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [networkConnected, setNetworkConnected] = useState(true);
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const recaptchaRef = useRef({ widgetId: null, initialized: false });
  const recaptchaContainerRef = useRef(null);
  
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
          // IMPORTANT: Do not modify container innerHTML nor append/remove children.
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

      // Only reset widget; do not remove DOM nodes. React owns the container.
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!networkConnected) {
      setError('Vérifiez votre connexion internet et réessayez.');
      return;
    }
    
    // Validation des champs
    if (!name || !email || !password || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
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
      setRecaptchaError('');
      if (isRecaptchaEnabled && !recaptchaToken) {
        setRecaptchaError('Veuillez valider le CAPTCHA');
        return;
      }
      
      // Préparation des données utilisateur pour l'inscription
      // Adapter la valeur du rôle pour respecter l'énum backend
      let roleToSend = role;
      if (role === 'tenant') roleToSend = 'locataire';
      if (role === 'owner') roleToSend = 'propriétaire';
      const userData = {
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' '),
        email,
        password,
        role: roleToSend
      };
      
      // Appel de la fonction register du contexte d'authentification
      const user = await register(userData, recaptchaToken);
      
      // Redirection vers le dashboard approprié selon le rôle de l'utilisateur
      if (user.role === 'owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Erreur d\'inscription:', err);
      setError(err.message || 'Erreur lors de l\'inscription. Veuillez réessayer.');
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
          <div className="register-title">Inscription</div>
          
          {!networkConnected && (
            <div className="error-alert" role="alert">
              <span>Network Error</span>
            </div>
          )}
          
          {error && networkConnected && (
            <div className="error-alert" role="alert">
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
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
            
            <div className="form-group">
              <label className="form-label">Je suis</label>
              <div className="role-selection">
                <div className="role-option">
                  <input
                    type="radio"
                    id="tenant"
                    name="role"
                    value="tenant"
                    checked={role === 'tenant'}
                    onChange={() => setRole('tenant')}
                  />
                  <label htmlFor="tenant">Locataire</label>
                </div>
                <div className="role-option">
                  <input
                    type="radio"
                    id="owner"
                    name="role"
                    value="owner"
                    checked={role === 'owner'}
                    onChange={() => setRole('owner')}
                  />
                  <label htmlFor="owner">Propriétaire</label>
                </div>
              </div>
            </div>
            
            {isRecaptchaEnabled ? (
              <div className="mb-4">
                {/* Empty container owned by reCAPTCHA only */}
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
                {/* Loader as a sibling, not a child of the reCAPTCHA container */}
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
              className="submit-button"
              disabled={loading || (isRecaptchaEnabled && !recaptchaToken)}
            >
              {loading ? 'Inscription en cours...' : 'S\'inscrire'}
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

export default Register;
