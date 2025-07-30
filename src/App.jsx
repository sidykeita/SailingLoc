import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import BackgroundImage from './components/BackgroundImage';

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

// La page d'accueil est maintenant importée depuis son propre fichier

// Les composants de tableau de bord sont maintenant importés depuis leurs fichiers respectifs

function App() {
  const { currentUser, userRole, loading } = useAuth();

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      position: 'relative',
      backgroundImage: 'url("/admin.jpeg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* Overlay semi-transparent */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        zIndex: 0
      }}></div>
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
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
          
          {/* Conserver l'ancienne route pour la compatibilité */}
          <Route path="/register/old" element={!currentUser ? <Register /> : <Navigate to={userRole === 'owner' ? '/owner/dashboard' : '/dashboard'} />} />
          
          {/* Routes protégées pour les locataires */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <SimpleDashboard />
            </ProtectedRoute>
          } />
          
          {/* Routes protégées pour les propriétaires */}
          <Route path="/owner/dashboard" element={
            <ProtectedRoute userRole="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          } />
          
          {/* Redirection pour les routes inconnues */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
