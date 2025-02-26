import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import enTranslation from './locales/en/translation.json';
import hiTranslation from './locales/hi/translation.json';
import mrTranslation from './locales/mr/translation.json';

i18n.init({
  interpolation: { escapeValue: false },
  lng: 'en',
  resources: {
    en: { translation: enTranslation },
    hi: { translation: hiTranslation },
    mr: { translation: mrTranslation },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);