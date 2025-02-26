import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

function Profile({ setCurrentStep, navigateBack, navigateNext }) {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedUser = {
      name: formData.get('name'),
      email: user.email, // Email remains unchanged
      password: formData.get('password') || user.password,
    };
    updateUser(updatedUser);
    alert('Profile updated successfully!');
    navigateNext(); // Navigate to OrderHistory or Home after update
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{t('profile')}</h2>
        <form onSubmit={handleUpdate} className="profile-form">
          <input
            type="text"
            name="name"
            placeholder={t('name')}
            defaultValue={user?.name || ''}
            className="auth-input"
          />
          <input
            type="email"
            name="email"
            placeholder={t('email')}
            value={user?.email || ''}
            disabled
            className="auth-input"
          />
          <input
            type="password"
            name="password"
            placeholder={t('new_password', 'New Password (optional)')}
            className="auth-input"
          />
          <button type="submit" className="auth-btn">
            {t('update_profile')}
          </button>
        </form>
        <div className="navigation">
          <button className="back-btn" onClick={navigateBack}>
            {t('back')}
          </button>
          <button className="next-btn" onClick={() => navigateNext()}>
            {t('go_to_order_history', 'Go to Order History')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;