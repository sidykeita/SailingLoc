import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages d'authentification
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RegisterHome from './pages/auth/RegisterHome';
import RegisterTenant from './pages/auth/RegisterTenant';
import RegisterOwner from './pages/auth/RegisterOwner';

// Pages du tableau de bord
import SimpleDashboard from './pages/dashboard/SimpleDashboard';
import TenantDashboard from './pages/dashboard/TenantDashboard';
import OwnerDashboard from './pages/dashboard/OwnerDashboard';
import AddBoat from './pages/dashboard/AddBoat';

// Pages des bateaux
import MotorBoats from './pages/boats/MotorBoats';
import BoatDetail from './pages/boats/BoatDetail';
import SailingBoats from './pages/boats/SailingBoats';
import SailingBoatDetail from './pages/boats/SailingBoatDetail';

// Page d'accueil
import Home from './pages/home/Home';

// Pages légales
import LegalNotices from './pages/legal/LegalNotices';
import CGUCGV from './pages/legal/CGUCGV';

// Pages d'aide
import Help from './pages/help/Help';
import BoatRental from './pages/help/BoatRental';
import Payments from './pages/help/Payments';
import Account from './pages/help/Account';
import Emergency from './pages/help/Emergency';
import FAQ from './pages/help/FAQ';

// Page de contact
import Contact from './pages/contact/Contact';
import { useLocation } from 'react-router-dom';

function App() {
  const { currentUser, userRole, loading, error } = useAuth();
  const location = useLocation();

  if (loading) {
    console.log('App.jsx loading:', loading);
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (error && location.pathname !== '/login') {
    console.log('App.jsx error:', error);
    return (
      <div className="error-container">
        <h2>Erreur</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  console.log('App.jsx rendu principal:', { currentUser, userRole, loading, error });

  return (
    <div className="app-container">
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!currentUser ? <Login /> : <Navigate to={userRole === 'owner' ? '/owner/dashboard' : '/dashboard'} />} />
        
        {/* Routes des bateaux */}
        <Route path="/boats/motor" element={<MotorBoats />} />
        <Route path="/boats/sailing" element={<SailingBoats />} />
        <Route path="/boats/sailing/:id" element={<SailingBoatDetail />} />
        <Route path="/boats/:id" element={<BoatDetail />} />
        
        {/* Pages légales */}
        <Route path="/legal-notices" element={<LegalNotices />} />
        <Route path="/cgu-cgv" element={<CGUCGV />} />
        
        {/* Pages d'aide */}
        <Route path="/help" element={<Help />} />
        <Route path="/help/boat-rental" element={<BoatRental />} />
        <Route path="/help/payments" element={<Payments />} />
        <Route path="/help/account" element={<Account />} />
        <Route path="/help/emergency" element={<Emergency />} />
        <Route path="/help/faq" element={<FAQ />} />
        
        {/* Page de contact */}
        <Route path="/contact" element={<Contact />} />
        
        {/* Routes d'inscription */}
        <Route path="/register" element={!currentUser ? <RegisterHome /> : <Navigate to={userRole === 'owner' ? '/owner/dashboard' : '/dashboard'} />} />
        <Route path="/register/tenant" element={!currentUser ? <RegisterTenant /> : <Navigate to='/dashboard' />} />
        <Route path="/register/owner" element={!currentUser ? <RegisterOwner /> : <Navigate to='/owner/dashboard' />} />
        
        {/* Routes protégées */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={
            loading || !currentUser
              ? (
                <div style={{ minHeight: '100vh', background: '#274991', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                  Chargement...
                </div>
              )
              : (currentUser.role === 'owner' || currentUser.role === 'propriétaire')
                ? <Navigate to="/owner/dashboard" replace />
                : <SimpleDashboard />
          } />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/dashboard/add-boat" element={<AddBoat />} />
          <Route path="/tenant/dashboard" element={<TenantDashboard />} />
        </Route>

        {/* Route par défaut */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
