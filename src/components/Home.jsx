import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import ItemCard from './ItemCard';
import Sidebar from './Sidebar';
import coffee from '../assets/coffee.png';
import tea from '../assets/tea.png';
import sandwich from '../assets/sandwich.jpg';
import juice from '../assets/juice.png';
import cookie from '../assets/cookies.png';

const items = [
  { id: 1, name: 'Coffee', description: 'Hot brewed coffee', price: 50, image: coffee },
  { id: 2, name: 'Tea', description: 'Fresh tea', price: 40, image: tea },
  { id: 3, name: 'Sandwich', description: 'Veg sandwich', price: 60, image: sandwich },
  { id: 4, name: 'Juice', description: 'Fresh orange juice', price: 30, image: juice },
  { id: 5, name: 'Cookie', description: 'Chocolate chip cookie', price: 20, image: cookie },
];

function Home({ setCurrentStep }) {
  const { t } = useTranslation();
  const { cart } = useCart();

  return (
    <div className="home">
      <div className="item-list">
        <h2>{t('items')}</h2>
        <div className="items-grid">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
      <Sidebar />
      {cart.length > 0 && (
        <button className="checkout-btn" onClick={() => setCurrentStep('cart')}>
          {t('checkout')} ({cart.length})
        </button>
      )}
    </div>
  );
}

export default Home;