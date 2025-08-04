import { createContext, useState, useEffect, useContext } from 'react';
// Import du vrai service d'authentification
import authService from '../services/auth.service';

// Création du contexte d'authentification
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  return useContext(AuthContext);
};

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Récupérer les informations de l'utilisateur depuis l'API
          const userData = await authService.getCurrentUser();
          setCurrentUser(userData);
          setUserRole(userData.role || 'tenant'); // Par défaut 'tenant' si aucun rôle n'est spécifié
        }
      } catch (err) {
        console.error('Erreur lors de la vérification de l\'authentification:', err);
        authService.logout(); // Déconnexion en cas d'erreur
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fonction pour décoder un token JWT
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Erreur lors du décodage du token:', e);
      return {};
    }
  };

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      setError('');
      const data = await authService.login(email, password);
      
      // Mise à jour de l'état utilisateur
      setCurrentUser(data.user);
      setUserRole(data.user.role);
      
      return data.user;
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError(err.message || 'Erreur lors de la connexion');
      throw err;
    }
  };

  // Fonction d'inscription
  const register = async (userData) => {
    try {
      setError('');
      const data = await authService.register(userData);
      
      // Mise à jour de l'état utilisateur
      setCurrentUser(data.user);
      setUserRole(data.user.role);
      
      return data.user;
    } catch (err) {
      console.error('Erreur d\'inscription:', err);
      setError(err.message || 'Erreur lors de l\'inscription');
      throw err;
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setUserRole(null);
  };
  
  // Fonction de mise à jour du profil
  const updateProfile = async (userData) => {
    try {
      setError('');
      const updatedUser = await authService.updateProfile(userData);
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil:', err);
      setError(err.message || 'Erreur lors de la mise à jour du profil');
      throw err;
    }
  };
  
  // Fonction de changement de mot de passe
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError('');
      return await authService.changePassword(currentPassword, newPassword);
    } catch (err) {
      console.error('Erreur lors du changement de mot de passe:', err);
      setError(err.message || 'Erreur lors du changement de mot de passe');
      throw err;
    }
  };

    // Fonction pour basculer entre les rôles (uniquement pour le développement)
  const switchRole = () => {
    if (!currentUser) return;
    
    const newRole = userRole === 'owner' ? 'tenant' : 'owner';
    setUserRole(newRole);
    
    // Mettre à jour l'utilisateur dans le localStorage
    const updatedUser = { ...currentUser, role: newRole };
    setCurrentUser(updatedUser);
    localStorage.setItem('mockUser', JSON.stringify(updatedUser));
    
    // Rediriger vers le tableau de bord approprié
    window.location.href = newRole === 'owner' ? '/owner/dashboard' : '/dashboard';
  };

  // Valeurs à fournir dans le contexte
  const value = {
    currentUser,
    userRole,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    parseJwt,
    error,
    loading,
    switchRole // Ajouter la fonction de changement de rôle
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
