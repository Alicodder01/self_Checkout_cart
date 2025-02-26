import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

function OrderHistory({ setCurrentStep, navigateBack, navigateNext }) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const orders = JSON.parse(localStorage.getItem(`orders_${user?.email}`) || '[]');

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{t('order_history')}</h2>
        {orders.length === 0 ? (
          <p>{t('no_orders', 'No orders found.')}</p>
        ) : (
          <div className="order-history-list">
            {orders.map((order, index) => (
              <div key={index} className="order-item">
                <p>{t('transaction_id')}: {order.id}</p>
                <p>{t('date')}: {order.date}</p>
                <p>{t('total')}: ₹{order.total}</p>
                <p>{t('payment_method')}: {order.paymentMethod}</p>
                <p>{t('payment_details')}: {order.paymentDetails}</p>
              </div>
            ))}
          </div>
        )}
        <div className="navigation">
          <button className="back-btn" onClick={() => navigateBack()}>
            {t('back')}
          </button>
          <button className="next-btn" onClick={() => navigateNext()}>
            {t('go_to_feedback', 'Go to Feedback')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderHistory;