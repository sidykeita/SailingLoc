import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/auth.service';

// Création du contexte d'authentification
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }) => {
  // Persistance immédiate de la session après refresh
  const [currentUser, setCurrentUser] = useState(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  });
  const [userRole, setUserRole] = useState(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr).role : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) { // Vérification présence token
          try {
            const userData = await authService.getCurrentUser();
            setCurrentUser(userData);
            setUserRole(userData.role);
          } catch (err) {
            console.error('Erreur lors de getCurrentUser:', err);
            // Si erreur d'authentification, déconnecte et redirige automatiquement
            await logout();
            window.location.href = '/login?expired=1';
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const user = await authService.login(email, password);
      setCurrentUser(user);
      setUserRole(user.role);
      setError('');
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const user = await authService.register(userData);
      setCurrentUser(user);
      setUserRole(user.role);
      setError('');
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      setUserRole(null);
      setError('');
      setSessionExpired(false);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userRole,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: authService.isAuthenticated,
        sessionExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
