import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';

function CartSummary({ setCurrentStep }) {
  const { t } = useTranslation();
  const { cart, clearCart } = useCart();

  // Calculate the total price with a fallback for price values
  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="cart-summary">
      <h2>{t('Cart')}</h2>
      {cart.length > 0 ? (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id || item.name} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />
                <p>
                  {item.name} - ₹{item.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <p className="total">
            {t('Total')}: ₹{total.toFixed(2)}
          </p>
          <div className="navigation">
            <button
              className="back-btn"
              onClick={() => setCurrentStep('home')}
            >
              {t('Back')}
            </button>
            <button
              className="next-btn"
              onClick={() => setCurrentStep('checkout')}
            >
              {t('Checkout')}
            </button>
            <button className="clear-btn" onClick={clearCart}>
              {t('Clear cart')}
            </button>
          </div>
        </>
      ) : (
        <p>{t('Cart empty')}</p>
      )}
    </div>
  );
}

export default CartSummary;
