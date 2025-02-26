import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

function Checkout({ setCurrentStep, navigateBack, navigateNext, setTransactionData }) {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(''); // For UPI ID or Card Number
  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  // Calculate totals (no discounts, only 5% tax)
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.05; // Fixed 5% tax
  const total = subtotal + tax;

  const [paymentError, setPaymentError] = useState('');

  const handlePayment = () => {
    if (!paymentMethod || (paymentMethod !== 'cash' && !paymentDetails)) {
      setPaymentError('Please select a payment method and enter payment details if required.');
      return;
    }

    let maskedPaymentDetails = paymentDetails;
    if (paymentMethod === 'card') {
      maskedPaymentDetails = `**** **** **** ${paymentDetails.slice(-4)}`; // Mask card number, show last 4 digits
    } else if (paymentMethod === 'upi') {
      maskedPaymentDetails = paymentDetails; // UPI ID remains as entered
    } else if (paymentMethod === 'cash') {
      maskedPaymentDetails = 'Cash Payment'; // Default for cash
    }

    const transaction = {
      id: `TXN${Date.now()}`,
      items: cart,
      subtotal: subtotal,
      tax: tax,
      total: total,
      paymentMethod,
      paymentDetails: maskedPaymentDetails,
      customerName: user?.name || 'Guest',
      date: new Date().toLocaleString(), // Add timestamp
    };
    setTransactionData(transaction);
    if (user) {
      const orders = JSON.parse(localStorage.getItem(`orders_${user.email}`) || '[]');
      orders.push(transaction);
      localStorage.setItem(`orders_${user.email}`, JSON.stringify(orders));
    }
    clearCart();
    navigateNext();
    setPaymentError('');
  };

  return (
    <div className="checkout">
      <h2 className="checkout-title">{t('checkout')}</h2>
      <div className="checkout-summary">
        <p className="total">{t('subtotal')}: ₹{subtotal.toFixed(2)}</p>
        <p className="total">{t('tax', 'Tax')} (5%): ₹{tax.toFixed(2)}</p>
        <p className="total">{t('total')}: ₹{total.toFixed(2)}</p>
      </div>
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="payment-select"
      >
        <option value="">{t('select_payment_method', 'Select Payment Method')}</option>
        <option value="cash">{t('cash', 'Cash')}</option>
        <option value="upi">{t('upi', 'UPI')}</option>
        <option value="card">{t('card', 'Card')}</option>
      </select>
      {paymentMethod && paymentMethod !== 'cash' && (
        <input
          type={paymentMethod === 'upi' ? 'text' : 'text'}
          placeholder={
            paymentMethod === 'upi' 
              ? t('enter_upi_id', 'Enter UPI ID (e.g., user@upi)') 
              : t('enter_card_last_4', 'Enter last 4 digits of card')
          }
          value={paymentDetails}
          onChange={(e) => {
            setPaymentDetails(e.target.value);
            setPaymentError('');
          }}
          className="payment-details-input"
          maxLength={paymentMethod === 'upi' ? 50 : 4}
        />
      )}
      {paymentError && <p className="error-message">{paymentError}</p>}
      <div className="navigation">
        <button className="back-btn" onClick={navigateBack}>
          {t('back')}
        </button>
        <button 
          className="next-btn" 
          onClick={handlePayment} 
          disabled={!paymentMethod || (paymentMethod !== 'cash' && !paymentDetails)}
        >
          {t('pay_now')}
        </button>
      </div>
    </div>
  );
}

export default Checkout;