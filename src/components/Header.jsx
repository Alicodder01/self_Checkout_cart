import { useTranslation } from 'react-i18next';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

function Header({ setCurrentStep }) {
  const { t, i18n } = useTranslation();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { user, signOut } = useAuth();

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="Logo" className="logo" />
        <span className="motto">{t('motto', 'Fast & Easy Checkout')}</span>
      </div>
      <div className="header-right">
        <select 
          onChange={(e) => changeLanguage(e.target.value)} 
          value={i18n.language} 
          className="lang-select"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="mr">Marathi</option>
        </select>
        <button 
          className="theme-toggle" 
          onClick={toggleDarkMode}
          aria-label={darkMode ? t('switch_to_light', 'Switch to Light Mode') : t('switch_to_dark', 'Switch to Dark Mode')}
        >
          <span className="toggle-label">{darkMode ? t('light_mode') : t('dark_mode')}</span>
          <span className={`toggle-switch ${darkMode ? 'dark-active' : ''}`}>
            <span className="toggle-slider"></span>
          </span>
        </button>
        {user ? (
          <>
            <button className="profile-btn" onClick={() => setCurrentStep('profile')}>
              {user.name}
            </button>
            <button className="order-history-btn" onClick={() => setCurrentStep('orderhistory')}>
              {t('order_history')}
            </button>
            <button className="signout-btn" onClick={signOut}>Sign Out</button>
          </>
        ) : (
          <button className="signin-btn" onClick={() => setCurrentStep('signin')}>
            {t('sign_in')}
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;