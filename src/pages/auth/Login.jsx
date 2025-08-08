import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
// L'image de fond est maintenant gérée directement par le CSS
import '../../assets/css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('c.line2110@hotmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [networkError, setNetworkError] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!navigator.onLine) {
      setNetworkError(true);
      setError('Vérifiez votre connexion internet et réessayez.');
      return;
    }
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      setNetworkError(false);
      
      // Appel de la fonction login du contexte d'authentification
      const user = await login(email, password);
console.log('Utilisateur connecté:', user);

      // Redirection vers le dashboard approprié selon le rôle de l'utilisateur
      if (user.role === 'owner' || user.role === 'propriétaire' || user.role === 'proprietaire') {
        navigate('/owner/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      if (!navigator.onLine) {
        setNetworkError(true);
        setError('Vérifiez votre connexion internet et réessayez.');
      } else {
        setError(err.message || 'Identifiants incorrects. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Link to="/" className="back-to-home">
        <FontAwesomeIcon icon={faHome} />
      </Link>
      <div className="login-box">
        <div className="login-form-container">
          <div className="app-logo">Connexion</div>
          
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
            </div>
            
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
            
            <div className="register-link">
              <p>Pas encore de compte ? <Link to="/register">S'inscrire</Link></p>
            </div>
          </form>
        </div>
        
        <div className="terms">
          <p>
            En vous connectant, vous acceptez nos{' '}
            <a href="#">Conditions d'utilisation</a>{' '}
            et notre{' '}
            <a href="#">Politique de confidentialité</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
