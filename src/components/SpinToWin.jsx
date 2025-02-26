import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';

function SpinToWin({ closeGame }) {
  const { t } = useTranslation();
  const [rotation, setRotation] = useState(0);
  const { addToCart } = useCart();

  const prizes = [
    { name: '10% Off', action: 'discount' },
    { name: 'Free Coffee', action: () => addToCart({ id: 1, name: 'Coffee', price: 0 }) },
  ];

  const spin = () => {
    const randomAngle = Math.floor(Math.random() * 360) + 720;
    setRotation(randomAngle);
    setTimeout(() => {
      const prizeIndex = Math.floor(((randomAngle % 360) / 360) * prizes.length);
      const prize = prizes[prizeIndex];
      alert(`You won: ${prize.name}`);
      if (typeof prize.action === 'function') prize.action();
    }, 3000);
  };

  return (
    <div className="spin-to-win">
      <div className="wheel" style={{ transform: `rotate(${rotation}deg)` }}></div>
      <button onClick={spin}>{t('spin_to_win')}</button>
      <button onClick={closeGame}>{t('close')}</button>
    </div>
  );
}

export default SpinToWin;