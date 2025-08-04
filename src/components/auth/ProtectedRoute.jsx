import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Composant pour protéger les routes qui nécessitent une authentification
 * Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
 * Vérifie également le rôle de l'utilisateur si spécifié
 */
const ProtectedRoute = ({ children, userRole }) => {
  const { currentUser, userRole: currentUserRole, sessionExpired, logout } = useAuth();

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Redirection immédiate : si un propriétaire accède à /dashboard, renvoyer vers /owner/dashboard
  if (
    currentUser &&
    (currentUser.role === 'owner' || currentUser.role === 'propriétaire') &&
    window.location.pathname === '/dashboard'
  ) {
    return <Navigate to="/owner/dashboard" replace />;
  }

  // Si un rôle spécifique est requis et que l'utilisateur n'a pas ce rôle, rediriger
  if (userRole && currentUserRole !== userRole) {
    // Rediriger vers le dashboard approprié selon le rôle de l'utilisateur
    return <Navigate to={currentUserRole === 'owner' ? '/owner/dashboard' : '/dashboard'} />;
  }

  // Si l'utilisateur est authentifié et a le bon rôle, afficher le contenu protégé
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
