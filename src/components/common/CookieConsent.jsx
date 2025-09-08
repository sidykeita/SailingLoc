import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const choice = localStorage.getItem('cookieConsent');
      if (!choice) setVisible(true);
    } catch (e) {
      // If localStorage is unavailable, still show the banner
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try { localStorage.setItem('cookieConsent', 'accepted'); } catch {}
    setVisible(false);
    // Place to initialize non-essential services if added in future (e.g., analytics)
  };

  const reject = () => {
    try { localStorage.setItem('cookieConsent', 'rejected'); } catch {}
    setVisible(false);
    // Ensure non-essential services remain disabled if added in future
  };

  if (!visible) return null;

  return (
    <div style={styles.wrapper} role="dialog" aria-live="polite" aria-label="Bandeau de gestion des cookies">
      <div style={styles.container}>
        <div style={styles.text}>
          Nous utilisons des cookies pour améliorer votre expérience, assurer la sécurité et mesurer l'audience. 
          Vous pouvez accepter ou refuser les cookies non essentiels. Pour en savoir plus, consultez nos{' '}
          <Link to="/legal-notices" style={styles.link}>mentions légales</Link> et nos{' '}
          <Link to="/cgu-cgv" style={styles.link}>CGU/CGV</Link>.
        </div>
        <div style={styles.actions}>
          <button onClick={reject} style={{ ...styles.button, ...styles.secondary }}>Refuser</button>
          <button onClick={accept} style={{ ...styles.button, ...styles.primary }}>Accepter</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    padding: '12px',
  },
  container: {
    width: '100%',
    maxWidth: '900px',
    background: 'rgba(255,255,255,0.98)',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    display: 'flex',
    gap: '16px',
    padding: '14px 16px',
    alignItems: 'center',
  },
  text: {
    color: '#2d3748',
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    fontSize: '14px',
    lineHeight: 1.4,
    flex: 1,
  },
  link: {
    color: '#2563eb',
    textDecoration: 'underline',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  button: {
    padding: '8px 14px',
    borderRadius: '6px',
    border: '1px solid transparent',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
  },
  primary: {
    backgroundColor: '#2563eb',
    color: '#fff',
  },
  secondary: {
    backgroundColor: '#f3f4f6',
    color: '#111827',
    borderColor: '#e5e7eb',
  },
};

export default CookieConsent;
