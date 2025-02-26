import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

function SignUp({ setCurrentStep }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp } = useAuth();

  const handleSignUp = () => {
    const userData = { name, email, password };
    signUp(userData);
    setCurrentStep('home');
  };

  const handleSocialLogin = (provider) => {
    // Simulate social login (replace with actual OAuth logic)
    alert(`Signing up with ${provider}... (Simulated)`);
    // In production, use OAuth libraries to handle authentication
    // Example: signUp({ name: 'Social User', email: `${provider}@example.com` });
    setCurrentStep('home');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{t('sign_up')}</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="auth-input"
        />
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
        <button className="auth-btn" onClick={handleSignUp}>
          {t('Sign Up')}
        </button>
        <div className="social-login">
          <button className="social-btn google-btn" onClick={() => handleSocialLogin('Google')}>
            <span className="social-icon">G</span> Sign up with Google
          </button>
          <button className="social-btn facebook-btn" onClick={() => handleSocialLogin('Facebook')}>
            <span className="social-icon">f</span> Sign up with Facebook
          </button>
        </div>
        <p className="auth-switch">
          {t('Already have account')} <span onClick={() => setCurrentStep('signin')}>{t('sign_in')}</span>
        </p>
        <button className="back-btn" onClick={() => setCurrentStep('home')}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default SignUp;