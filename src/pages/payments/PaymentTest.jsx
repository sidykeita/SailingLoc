import { useState } from 'react';
import { redirectToCheckout } from '../../services/stripe.service';

export default function PaymentTest() {
  const [amount, setAmount] = useState(2500); // 25.00 €
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async () => {
    try {
      setLoading(true);
      setError('');
      await redirectToCheckout({
        amount: Number(amount),
        currency: 'eur',
        description: 'Test paiement',
        metadata: { source: 'test' },
      });
    } catch (e) {
      setError(e.message || 'Erreur de paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Test Paiement Stripe</h1>
      <div style={styles.row}>
        <label style={styles.label}>Montant (centimes) :</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={styles.input}
          min={50}
        />
      </div>
      <button style={styles.button} onClick={handlePay} disabled={loading}>
        {loading ? 'Redirection...' : 'Payer'}
      </button>
      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
}

const styles = {
  container: { padding: '40px', maxWidth: 640, margin: '0 auto' },
  title: { fontSize: '28px', marginBottom: '16px' },
  row: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' },
  label: { minWidth: 180 },
  input: { padding: '8px', border: '1px solid #ddd', borderRadius: 6, width: 200 },
  button: { background: '#2563eb', color: '#fff', padding: '10px 16px', border: 'none', borderRadius: 6, cursor: 'pointer' },
  error: { color: '#b91c1c', marginTop: 10 },
};
