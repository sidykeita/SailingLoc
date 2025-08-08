import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Composant pour protéger les routes qui nécessitent une authentification
 * Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
 * Vérifie également le rôle de l'utilisateur si spécifié
 */
const ProtectedRoute = ({ children, userRole }) => {
  const { currentUser, userRole: currentUserRole } = useAuth();

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Vérification robuste du rôle propriétaire
  const ownerRoles = ['owner', 'propriétaire', 'proprietaire'];
  const isOwnerRole = ownerRoles.includes(currentUserRole);
  const isRequiredOwner = ownerRoles.includes(userRole);

  if (userRole && (
      (isRequiredOwner && !isOwnerRole) ||
      (!isRequiredOwner && currentUserRole !== userRole)
    )) {
    // Rediriger vers le dashboard approprié selon le rôle de l'utilisateur
    return <Navigate to={isOwnerRole ? '/owner/dashboard' : '/dashboard'} />;
  }

  // Si l'utilisateur est authentifié et a le bon rôle, afficher le contenu protégé
  return children;
};

export default ProtectedRoute;
