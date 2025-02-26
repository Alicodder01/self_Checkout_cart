import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

function SignIn({ setCurrentStep }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  const handleSignIn = () => {
    const credentials = { email, password };
    if (signIn(credentials)) {
      setCurrentStep('home');
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  const handleSocialLogin = (provider) => {
    // Simulate social login (replace with actual OAuth logic)
    alert(`Logging in with ${provider}... (Simulated)`);
    // In production, use OAuth libraries (e.g., react-google-login, react-facebook-login) to handle authentication
    // Example: setUser({ name: 'Social User', email: `${provider}@example.com` });
    setCurrentStep('home');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{t('sign_in')}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />
        <button className="auth-btn" onClick={handleSignIn}>
          {t('sign_in')}
        </button>
        <div className="social-login">
          <button className="social-btn google-btn" onClick={() => handleSocialLogin('Google')}>
            <span className="social-icon">G</span> Sign in with Google
          </button>
          <button className="social-btn facebook-btn" onClick={() => handleSocialLogin('Facebook')}>
            <span className="social-icon">f</span> Sign in with Facebook
          </button>
        </div>
        <p className="auth-switch">
          {t('Not have account')} <span onClick={() => setCurrentStep('signup')}>{t('sign_up')}</span>
        </p>
        <button className="back-btn" onClick={() => setCurrentStep('home')}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default SignIn;