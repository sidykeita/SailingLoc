import { Link } from 'react-router-dom';

export default function PaymentCancel() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Paiement annulé</h1>
      <p style={styles.text}>Votre paiement a été annulé. Vous pouvez réessayer à tout moment.</p>
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
