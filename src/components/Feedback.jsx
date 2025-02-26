import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function Feedback({ setCurrentStep }) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    alert('Feedback submitted! Thank you!');
    setCurrentStep('Home');
  };

  return (
    <div className="feedback-container">
      <div className="feedback-card">
        <h2 className="feedback-title">{t('feedback')}</h2>
        <div className="rating-section">
          <label className="rating-label">{t('rating')}</label>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${rating >= star ? 'filled' : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <label className="comment-label">{t('Comment')}</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t('Comment')}
          className="feedback-textarea"
        />
        <div className="feedback-actions">
          <button className="submit-btn" onClick={handleSubmit} disabled={rating === 0}>
            {t('submit')}
          </button>
          <button className="back-btn" onClick={() => setCurrentStep('home')}>
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

export default Feedback;