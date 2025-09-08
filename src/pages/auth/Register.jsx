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
  const recaptchaRef = useRef(null);
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
    
    let widgetId = null;
    let timer;

    const loadRecaptcha = () => {
      if (window.grecaptcha) {
        console.log('reCAPTCHA API loaded, initializing...');
        initializeRecaptcha();
      } else {
        console.log('reCAPTCHA API not loaded yet, waiting...');
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
        console.log('Initializing reCAPTCHA...');
        const container = recaptchaContainerRef.current;
        
        if (!container) {
          console.error('reCAPTCHA container not found');
          return;
        }

        // Clear any existing reCAPTCHA widgets
        if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
          // Create a new container for reCAPTCHA
          container.innerHTML = '';
          const newContainer = document.createElement('div');
          container.appendChild(newContainer);
          
          widgetId = window.grecaptcha.render(newContainer, {
            sitekey: RECAPTCHA_SITE_KEY,
            callback: (token) => {
              console.log('reCAPTCHA token generated:', token);
              setRecaptchaToken(token);
              setRecaptchaError('');
            },
            'expired-callback': () => {
              console.log('reCAPTCHA expired');
              setRecaptchaToken('');
            },
            'error-callback': (error) => {
              console.error('reCAPTCHA error:', error);
              setRecaptchaToken('');
              setRecaptchaError('Erreur lors de la vérification CAPTCHA. Veuillez réessayer.');
            }
          });
          
          console.log('reCAPTCHA initialized successfully with widgetId:', widgetId);
          recaptchaRef.current = { widgetId, container: newContainer };
          setIsRecaptchaReady(true);
        }
      } catch (error) {
        console.error('Error initializing reCAPTCHA:', error);
        setRecaptchaError('Erreur lors du chargement du CAPTCHA. Veuillez recharger la page.');
      }
    };

    const handleRecaptchaReady = () => {
      console.log('recaptchaReady event received');
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
      
      // Cleanup reCAPTCHA widget if it exists
      if (recaptchaRef.current && window.grecaptcha) {
        try {
          const { widgetId: currentWidgetId, container } = recaptchaRef.current;
          if (typeof window.grecaptcha.reset === 'function') {
            window.grecaptcha.reset(currentWidgetId);
          }
          if (container && container.parentNode) {
            container.parentNode.removeChild(container);
          }
        } catch (e) {
          console.warn('Error cleaning up reCAPTCHA:', e);
        }
        recaptchaRef.current = null;
      }
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
                <div 
                  ref={recaptchaContainerRef}
                  style={{
                    minHeight: '78px',
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundColor: '#f9f9f9',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                >
                  {!isRecaptchaReady && (
                    <div style={{ color: '#666', padding: '10px' }}>
                      Chargement du CAPTCHA...
                    </div>
                  )}
                </div>
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
