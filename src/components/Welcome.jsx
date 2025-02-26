import { useTranslation } from 'react-i18next';
import logo from '../assets/logo.png'; // Use your NoFrills-like logo or placeholder

function Welcome({ setCurrentStep }) {
  const { t } = useTranslation();

  return (
    <div className="welcome-container">
      <img src={logo} alt="Logo" className="welcome-logo" />
      <h1 className="welcome-title">{t('welcome_to_self_checkout', 'Welcome to Self Checkout Cart')}</h1>
      <button className="welcome-start-btn" onClick={() => setCurrentStep('home')}>
        {t('start', 'START')}
      </button>
    </div>
  );
}

export default Welcome;