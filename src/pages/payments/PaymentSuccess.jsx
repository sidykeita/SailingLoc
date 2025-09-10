import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../lib/api';

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const sessionId = params.get('session_id');
  const [statusMsg, setStatusMsg] = useState('');
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    let timer;
    let interval;
    async function confirmAndRedirect() {
      if (!sessionId) return;
      try {
        // Confirme le paiement côté backend (met à jour réservation + crée Payment)
        const res = await fetch(`${API_URL}/stripe/confirm?session_id=${sessionId}`, {
          method: 'POST',
        });
        if (!res.ok) {
          let errText = '';
          try {
            const data = await res.json();
            errText = data?.message || JSON.stringify(data);
          } catch (_) {
            errText = await res.text();
          }
          setStatusMsg(`La confirmation du paiement a échoué: ${errText}`);
        } else {
          setStatusMsg('Paiement confirmé. Redirection vers vos réservations...');
        }
      } catch (e) {
        setStatusMsg(`Erreur réseau lors de la confirmation: ${e?.message || e}`);
      }

      // Démarre un compte à rebours, puis redirige vers la page des réservations
      interval = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
      timer = setTimeout(() => {
        navigate('/locations');
      }, 5000);
    }
    confirmAndRedirect();

    return () => {
      if (timer) clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [sessionId]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Paiement réussi</h1>
      <p style={styles.text}>Merci pour votre paiement.</p>
      <p style={styles.session}><strong>Votre session est:</strong> {sessionId}</p>
      {statusMsg && <p style={styles.status}>{statusMsg}</p>}
      <p style={styles.hint}>Vous allez être redirigé dans {seconds}s vers <Link to="/locations" style={styles.link}>vos réservations</Link>.</p>
      <div style={{ marginTop: 16 }}>
        <Link to="/" style={styles.link}>Retour à l'accueil</Link>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '40px', maxWidth: 800, margin: '0 auto', textAlign: 'center' },
  title: { fontSize: '28px', marginBottom: '12px' },
  text: { color: '#374151', marginBottom: '4px' },
  session: { color: '#111827', marginBottom: '12px', wordBreak: 'break-all' },
  status: { color: '#065f46', marginBottom: '12px' },
  hint: { color: '#6b7280', marginBottom: '8px' },
  link: { color: '#2563eb' },
};
