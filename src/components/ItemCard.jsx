import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';

function ItemCard({ item }) {
  const { t } = useTranslation();
  const { addToCart } = useCart();

  return (
    <div className="item-card">
      <img src={item.image} alt={item.name} className="item-image" />
      <div className="item-details">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <p className="price">₹{item.price}</p>
        <button className="add-btn" onClick={() => addToCart(item)}>
          {t('add_to_cart')}
        </button>
      </div>
    </div>
  );
}

export default ItemCard;