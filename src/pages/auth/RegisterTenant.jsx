import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import './Register.css';

const RegisterTenant = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [networkError, setNetworkError] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
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

  const getRoleFromUrl = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes('proprietaire') || path.includes('owner')) return 'propriétaire';
    return 'locataire';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!navigator.onLine) {
      setNetworkError(true);
      setError('Vérifiez votre connexion internet et réessayez.');
      return;
    }
    
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    // Validation du numéro de téléphone (que des chiffres)
    if (!/^[0-9]+$/.test(phone)) {
      setError('Le numéro de téléphone ne doit contenir que des chiffres.');
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

    // Découper le nom complet en prénom et nom
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    if (!firstName || !lastName) {
      setError('Veuillez saisir votre prénom et nom dans le champ Nom complet');
      return;
    }

    try {
      setError('');
      setLoading(true);
      setNetworkError(false);
      
      // Préparation des données utilisateur pour l'inscription
      const userData = {
        firstName,
        lastName,
        email,
        phone,
        password,
        role: getRoleFromUrl()
      };
      
      // Appel de la fonction register du contexte d'authentification
      const user = await register(userData);
      
      // Redirection vers le dashboard locataire
      navigate('/dashboard');
    } catch (err) {
      console.error('Erreur d\'inscription:', err);
      if (!navigator.onLine) {
        setNetworkError(true);
        setError('Vérifiez votre connexion internet et réessayez.');
      } else if (err.message && (err.message.includes('email') || err.message.includes('Email'))) {
        setError('Cet email est déjà utilisé. Veuillez en choisir un autre.');
      } else if (err.message && (err.message.includes('phone') || err.message.includes('Phone') || err.message.includes('téléphone'))) {
        setError('Ce numéro de téléphone est déjà utilisé. Veuillez en choisir un autre.');
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
          <div className="register-title">Inscription Locataire</div>
          <div className="register-subtitle">Louez un bateau pour vos aventures nautiques</div>
          
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
              <label htmlFor="phone" className="form-label">Téléphone</label>
              <input
                type="tel"
                id="phone"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
            
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
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
            <a href="#">Conditions d\'utilisation</a>{' '}
            et notre{' '}
            <a href="#">Politique de confidentialité</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterTenant;
