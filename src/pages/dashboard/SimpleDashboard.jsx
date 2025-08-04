import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SimpleDashboard = () => {
  const { currentUser, logout, loading, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('SimpleDashboard MONTÉ');
    console.log('currentUser dans SimpleDashboard:', currentUser);
    console.log('loading dans SimpleDashboard:', loading);
    console.log('error dans SimpleDashboard:', error);
  }, [currentUser, loading, error]);

  useEffect(() => {
    console.log('useEffect redirection', { loading, currentUser });
    if (
      !loading &&
      currentUser &&
      (currentUser.role === 'owner' || currentUser.role === 'propriétaire')
    ) {
      navigate('/owner/dashboard');
    }
  }, [loading, currentUser, navigate]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#274991', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 24 }}>Chargement…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#274991', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Erreur : {error}</h2>
        <button onClick={logout} style={{ marginTop: 24, padding: '12px 32px', fontSize: 18, background: 'white', color: '#274991', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Se reconnecter</button>
      </div>
    );
  }

  // Fallback visuel si tout est inattendu
  return (
    <div style={{ minHeight: '100vh', background: '#274991', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontSize: 36, marginBottom: 24 }}>Bienvenue sur SailingLoc !</h1>
      <h2 style={{ fontSize: 24, marginBottom: 32 }}>
        {typeof currentUser === 'object' && currentUser?.name
          ? `Bonjour, ${currentUser.name} !`
          : (typeof error === 'string' && error)
            ? `Erreur : ${error}`
            : (loading === true)
              ? 'Chargement du tableau de bord...'
              : 'Aucun utilisateur connecté.'}
      </h2>
      <button
        onClick={() => {
          try {
            logout();
          } catch (e) {}
          window.location.href = '/login';
        }}
        style={{ padding: '12px 32px', fontSize: 18, background: 'white', color: '#274991', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
      >
        Se reconnecter
      </button>
      <div style={{ marginTop: 16, fontSize: 14, opacity: 0.7 }}>
        {typeof currentUser === 'object' && currentUser?.name
          ? '(Connecté)'
          : (typeof error === 'string' && error)
            ? '(Erreur Auth)'
            : (loading === true)
              ? '(Chargement Auth)'
              : '(Aucun utilisateur détecté)'}<br />
        (État debug : loading={String(loading)}, error={String(error)}, user={currentUser ? JSON.stringify(currentUser) : 'null'})
      </div>
    </div>
  );
};

export default SimpleDashboard;
