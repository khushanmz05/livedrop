'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart, CartItem } from '../../../lib/cartContext';
import { saveOrder } from '../../../lib/orders';


export default function PaymentPage() {
  const searchParams = useSearchParams();
  const { cart, clearCart } = useCart();
  const [productIds, setProductIds] = useState<string[]>([]);
  const [products, setProducts] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardType, setCardType] = useState<'Visa' | 'MasterCard' | 'AmEx' | 'Discover' | 'Unknown'>('Unknown')
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
  setCardNumber(raw);
  setCardType(getCardType(raw));
};

  const totalPrice = products.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const idsParam = searchParams.get('productIds');
    if (idsParam) setProductIds(idsParam.split(','));
  }, [searchParams]);

  useEffect(() => {
    setProducts(cart.filter((item) => productIds.includes(String(item.id))));
  }, [productIds, cart]);

  const isFormValid = () =>
    name.trim() &&
    /^\d{16}$/.test(cardNumber) &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    /^\d{3}$/.test(cvc);

  function getCardType(cardNumber: string): 'Visa' | 'MasterCard' | 'AmEx' | 'Discover' | 'Unknown' {
  const cleaned = cardNumber.replace(/\D/g, '')

  if (/^4/.test(cleaned)) return 'Visa'
  if (/^5[1-5]/.test(cleaned)) return 'MasterCard'
  if (/^3[47]/.test(cleaned)) return 'AmEx'
  if (/^6(?:011|5)/.test(cleaned)) return 'Discover'

  return 'Unknown'
}

  async function handleConfirmPurchase() {
    if (!isFormValid()) {
      setError('Please fill out all payment details correctly.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await new Promise((res) => setTimeout(res, 1500));
      const orderId = await saveOrder(products, totalPrice);
      setSuccessId(orderId);
      clearCart();
    } catch {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleExpiryChange(e: React.ChangeEvent<HTMLInputElement>) {
  let value = e.target.value;

  value = value.replace(/[^\d\/]/g, '');
  if (value.length === 2 && !value.includes('/')) {
    value = value + '/';
  }
  if (value.length > 5) {
    value = value.slice(0, 5);
  }
  const [month, year] = value.split('/');
  if (month) {
    const monthNum = parseInt(month, 10);
    if (monthNum < 1 || monthNum > 12) {
      return;
    }
  }
  setExpiry(value);
  }

  if (successId) {
    return (
      <div style={styles.container}>
        <h2 style={styles.header}>✅ Payment Successful</h2>
        <p>Your order ID:</p>
        <p style={styles.orderId}>{successId}</p>
        <p>Thank you for your purchase!</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.header}>No Products Found</h2>
        <p>Please return to the cart and try again.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🛒 Checkout</h1>

      <ul style={styles.list}>
        {products.map((item) => (
          <li key={item.id} style={styles.item}>
            <div>
              <strong>{item.title}</strong>
              <br />
              Quantity: {item.quantity}
            </div>
            <div>${(item.price * item.quantity).toFixed(2)}</div>
          </li>
        ))}
        <li style={styles.total}>
          <strong>Total:</strong>
          <span>${totalPrice.toFixed(2)}</span>
        </li>
      </ul>

      <h3 style={styles.subheading}>Payment Details</h3>
      <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Name on Card"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
        <div className="flex items-center space-x-5 mb-4">
            <input
              id="card"
              type="text"
              inputMode="numeric"
              value={cardNumber}
              onChange={handleCardInput}
              className="w-full border rounded px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition duration-300 ease-in-out hover:shadow-lg"
              placeholder="1234 5678 9012 3456"
              maxLength={16}
              required
            />
            {cardType !== 'Unknown' && (
              <img
                src={
                  cardType === 'Visa' ? 'https://img.icons8.com/color/48/visa.png' :
                  cardType === 'MasterCard' ? 'https://img.icons8.com/color/48/mastercard-logo.png' :
                  cardType === 'AmEx' ? 'https://img.icons8.com/color/48/amex.png' :
                  cardType === 'Discover' ? 'https://img.icons8.com/color/48/discover.png' :
                  ''
                }
                alt={cardType}
                className="h-6"
              />
            )}
          </div>

        <div style={styles.row}>
          <input
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={handleExpiryChange}
            maxLength={5}
            style={{ ...styles.input, marginRight: 10 }}
          />
          <input
            type="text"
            placeholder="CVC"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            maxLength={3}
            style={styles.input}
          />
        </div>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      <button
        onClick={handleConfirmPurchase}
        disabled={loading || !isFormValid()}
        style={{
          ...styles.button,
          backgroundColor: loading || !isFormValid() ? '#94a3b8' : '#2563EB',
          cursor: loading || !isFormValid() ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Processing...' : 'Confirm Purchase'}
      </button>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 600,
    margin: '2rem auto',
    padding: '1rem',
    fontFamily: 'Segoe UI, sans-serif',
  },
  header: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  subheading: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    margin: '1rem 0 0.5rem',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '1rem',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem 0',
    borderBottom: '1px solid #ddd',
  },
  total: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    paddingTop: '1rem',
  },
  form: {
    marginBottom: '1rem',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    width: '100%',
    marginBottom: '0.75rem',
    borderRadius: 5,
    border: '1px solid #ccc',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontWeight: 'bold',
    transition: 'background-color 0.2s ease-in-out',
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: '#2563EB',
    margin: '0.5rem 0',
  },
};
