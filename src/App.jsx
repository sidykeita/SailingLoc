import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import BackgroundImage from './components/BackgroundImage';
import Layout from './Layout';

// Pages d'authentification
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RegisterHome from './pages/auth/RegisterHome';
import RegisterTenant from './pages/auth/RegisterTenant';
import RegisterOwner from './pages/auth/RegisterOwner';

// Pages du tableau de bord
import SimpleDashboard from './pages/dashboard/SimpleDashboard';
import TenantDashboard from './pages/dashboard/TenantDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import OwnerDashboard from './pages/dashboard/OwnerDashboard';

// Pages des bateaux
import MotorBoats from './pages/boats/MotorBoats';
import YachtBoats from './pages/boats/YachtBoats';
import CatamaranBoats from './pages/boats/CatamaranBoats';
import SemiRigideBoats from './pages/boats/SemiRigideBoats';
import BoatDetail from './pages/boats/BoatDetail';
import SailingBoats from './pages/boats/SailingBoats';
import AddBoat from './pages/boats/AddBoat';
import EditBoat from './pages/boats/EditBoat';
import AllBoats from './pages/boats/AllBoats';

// Pages des destinations
import Marseille from './pages/destinations/Marseille';
import PortoCristo from './pages/destinations/PortoCristo';
import Bastia from './pages/destinations/Bastia';
import Alicante from './pages/destinations/Alicante';
import Corfou from './pages/destinations/Corfou';
import Destinations from './pages/destinations/Destinations';
import VilleneuveLoubet from './pages/destinations/VilleneuveLoubet';
import DestinationDetail from './pages/destinations/DestinationDetail';

// Page d'accueil
import Home from './pages/home/Home';

// Pages légales
import LegalNotices from './pages/legal/LegalNotices';
import CGUCGV from './pages/legal/CGUCGV';

// Pages à propos
import About from './pages/about/About';
import Reviews from './pages/about/Reviews';

// Pages d'aide
import Help from './pages/help/Help';
import BoatRental from './pages/help/BoatRental';
import Payments from './pages/help/Payments';
import Account from './pages/help/Account';
import Emergency from './pages/help/Emergency';
import FAQ from './pages/help/FAQ';

// Page de contact
import Contact from './pages/contact/Contact';

import Calendrier from './pages/dashboard/Calendrier';
import Reservations from './pages/dashboard/Reservations';
import Revenus from './pages/dashboard/Revenus';

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
    <div className="app-container">
      <BackgroundImage />
      <main>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />  {/* Home contient déjà Layout */}
          <Route path="/login" element={!currentUser ? <Login /> : <Navigate to={userRole === 'admin' ? '/admin/dashboard' : userRole === 'propriétaire' ? '/owner/dashboard' : '/dashboard'} />} />
          
          {/* Routes des bateaux - avec Layout */}
          <Route path="/boats" element={<Layout><AllBoats /></Layout>} />
          <Route path="/boats/motor" element={<Layout><MotorBoats /></Layout>} />
          <Route path="/boats/yacht" element={<Layout><YachtBoats /></Layout>} />
          <Route path="/boats/catamaran" element={<Layout><CatamaranBoats /></Layout>} />
          <Route path="/boats/semi-rigide" element={<Layout><SemiRigideBoats /></Layout>} />
          <Route path="/boats/sailing" element={<Layout><SailingBoats /></Layout>} />
          <Route path="/boats/:id" element={<Layout><BoatDetail /></Layout>} />
          
          {/* Pages légales - avec Layout */}
          <Route path="/legal-notices" element={<Layout><LegalNotices /></Layout>} />
          <Route path="/cgu-cgv" element={<Layout><CGUCGV /></Layout>} />
          
          {/* Pages d'aide - avec Layout */}
          <Route path="/help" element={<Layout><Help /></Layout>} />
          <Route path="/help/boat-rental" element={<Layout><BoatRental /></Layout>} />
          <Route path="/help/payments" element={<Layout><Payments /></Layout>} />
          <Route path="/help/account" element={<Layout><Account /></Layout>} />
          <Route path="/help/emergency" element={<Layout><Emergency /></Layout>} />
          <Route path="/help/faq" element={<Layout><FAQ /></Layout>} />
          
          {/* Page de contact - avec Layout */}
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          
          {/* Pages à propos - avec Layout */}
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/about/reviews" element={<Layout><Reviews /></Layout>} />
          
          {/* Routes des destinations - avec Layout */}
          <Route path="/destinations" element={<Layout><Destinations /></Layout>} />
          <Route path="/destinations/marseille" element={<Layout><Marseille /></Layout>} />
          <Route path="/destinations/porto-cristo" element={<Layout><PortoCristo /></Layout>} />
          <Route path="/destinations/bastia" element={<Layout><Bastia /></Layout>} />
          <Route path="/destinations/alicante" element={<Layout><Alicante /></Layout>} />
          <Route path="/destinations/corfou" element={<Layout><Corfou /></Layout>} />
          <Route path="/destinations/villeneuve-loubet" element={<Layout><VilleneuveLoubet /></Layout>} />
          <Route path="/destinations/:destinationId" element={<Layout><DestinationDetail /></Layout>} />
          
          {/* Routes d'inscription */}
          <Route path="/register" element={!currentUser ? <RegisterHome /> : <Navigate to={userRole === 'propriétaire' ? '/owner/dashboard' : '/dashboard'} />} />
          <Route path="/register/tenant" element={!currentUser ? <RegisterTenant /> : <Navigate to='/dashboard' />} />
          <Route path="/register/owner" element={!currentUser ? <RegisterOwner /> : <Navigate to='/owner/dashboard' />} />
          
          {/* Conserver l'ancienne route pour la compatibilité */}
          <Route path="/register/old" element={!currentUser ? <Register /> : <Navigate to={userRole === 'propriétaire' ? '/owner/dashboard' : '/dashboard'} />} />
          
          {/* Routes protégées pour les locataires */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <SimpleDashboard />
            </ProtectedRoute>
          } />
          
          {/* Routes protégées pour les admins */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute userRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Routes protégées pour les propriétaires */}
          <Route path="/owner/dashboard" element={
            <ProtectedRoute userRole="propriétaire">
              <OwnerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/add-boat" element={
            <ProtectedRoute userRole="propriétaire">
              <AddBoat />
            </ProtectedRoute>
          } />
          <Route path="/boats/:id/edit" element={
            <ProtectedRoute userRole="propriétaire">
              <EditBoat />
            </ProtectedRoute>
          } />
          
          <Route path="/owner/dashboard/calendrier" element={
            <ProtectedRoute userRole="propriétaire">
              <Calendrier />
            </ProtectedRoute>
          } />
          <Route path="/owner/dashboard/reservations" element={
            <ProtectedRoute userRole="propriétaire">
              <Reservations />
            </ProtectedRoute>
          } />
          <Route path="/owner/dashboard/revenus" element={
            <ProtectedRoute userRole="propriétaire">
              <Revenus />
            </ProtectedRoute>
          } />
          {/* Redirections anciennes URLs vers les nouvelles préfixées par /owner */}
          <Route path="/dashboard/calendrier" element={<Navigate to="/owner/dashboard/calendrier" replace />} />
          <Route path="/dashboard/reservations" element={<Navigate to="/owner/dashboard/reservations" replace />} />
          <Route path="/dashboard/revenus" element={<Navigate to="/owner/dashboard/revenus" replace />} />
          {/* Redirection pour les routes inconnues */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
