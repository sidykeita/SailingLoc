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
  const [networkError, setNetworkError] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [recaptchaError, setRecaptchaError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);
  
  // Vérifier la connexion réseau au chargement
  useEffect(() => {
    const checkNetwork = () => {
      if (!navigator.onLine) {
        setNetworkError(true);
      } else {
        setNetworkError(false);
      }
    };
    
    checkNetwork();
    window.addEventListener('online', checkNetwork);
    window.addEventListener('offline', checkNetwork);
    
    return () => {
      window.removeEventListener('online', checkNetwork);
      window.removeEventListener('offline', checkNetwork);
    };
  }, []);

  console.log('Register - isRecaptchaEnabled:', isRecaptchaEnabled);
  console.log('Register - RECAPTCHA_SITE_KEY:', RECAPTCHA_SITE_KEY);

  useEffect(() => {
    if (isRecaptchaEnabled && recaptchaRef.current) {
      console.log('Initialisation du reCAPTCHA...');
      // Force le rendu du widget
      const interval = setInterval(() => {
        if (window.grecaptcha) {
          console.log('grecaptcha trouvé, rendu du widget...');
          window.grecaptcha.render('recaptcha-container', {
            sitekey: RECAPTCHA_SITE_KEY,
            callback: (token) => {
              console.log('reCAPTCHA token généré:', token);
              setRecaptchaToken(token);
              setRecaptchaError('');
            },
            'expired-callback': () => {
              console.log('reCAPTCHA expiré');
              setRecaptchaToken('');
            },
            'error-callback': () => {
              console.error('Erreur reCAPTCHA');
              setRecaptchaToken('');
            }
          });
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isRecaptchaEnabled]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!navigator.onLine) {
      setNetworkError(true);
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
      setNetworkError(false);
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
      if (!navigator.onLine) {
        setNetworkError(true);
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
          <div className="register-title">Inscription</div>
          
          {networkError && (
            <div className="error-alert" role="alert">
              <span>Network Error</span>
            </div>
          )}
          
          {error && !networkError && (
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
              <div className="mb-4" style={{ minHeight: '78px' }}>
                <div style={{ 
                  border: '1px solid #ccc', 
                  padding: '10px',
                  borderRadius: '4px',
                  backgroundColor: '#f9f9f9'
                }}>
                  <div id="recaptcha-container" ref={recaptchaRef}></div>
                  {!recaptchaToken && (
                    <div style={{ color: '#666', fontSize: '0.9em', marginTop: '5px' }}>
                      Veuillez valider le CAPTCHA pour continuer
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ color: 'red', border: '1px solid red', padding: '10px' }}>
                reCAPTCHA non activé. Vérifiez votre configuration.
              </div>
            )}
            {recaptchaError && (
              <div className="error-alert" role="alert">
                <span>{recaptchaError}</span>
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
