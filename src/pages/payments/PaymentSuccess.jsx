import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function PaymentSuccess() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sessionId = params.get('session_id');

  useEffect(() => {
    // TODO: Optionally verify sessionId with backend and update reservation/payment status
    // fetch(`/api/payments/confirm?session_id=${sessionId}`)
  }, [sessionId]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Paiement réussi</h1>
      <p style={styles.text}>Merci pour votre paiement. Votre session est: {sessionId}</p>
      <Link to="/" style={styles.link}>Retour à l'accueil</Link>
    </div>
  );
}

const styles = {
  container: { padding: '40px', maxWidth: 800, margin: '0 auto', textAlign: 'center' },
  title: { fontSize: '28px', marginBottom: '12px' },
  text: { color: '#374151', marginBottom: '16px' },
  link: { color: '#2563eb' },
};
