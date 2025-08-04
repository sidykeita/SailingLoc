import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import TenantDashboard from './pages/dashboard/TenantDashboard';
import OwnerDashboard from './pages/dashboard/OwnerDashboard';
import NotFound from './pages/NotFound';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';

// Composant pour rediriger selon le rôle de l'utilisateur
const RoleBasedRedirect = () => {
  const { currentUser, userRole, loading } = useAuth();
  
  // Si le chargement est en cours, afficher un indicateur de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Si l'utilisateur n'est pas connecté, afficher la page d'accueil
  if (!currentUser) {
    return <Home />;
  }
  
  // Rediriger selon le rôle
  if (userRole === 'owner') {
    return <Navigate to="/owner/dashboard" />;
  }
  
  return <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Route racine - affiche la page d'accueil ou redirige selon l'authentification */}
          <Route path="/" element={<RoleBasedRedirect />} />
          
          {/* Routes d'authentification */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Routes protégées pour les locataires */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute userRole="tenant">
                <TenantDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Routes protégées pour les propriétaires */}
          <Route 
            path="/owner/dashboard" 
            element={
              <ProtectedRoute userRole="owner">
                <OwnerDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Route 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
