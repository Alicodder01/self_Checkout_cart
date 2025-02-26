import { useIdleTimer } from 'react-idle-timer';

function IdleTimerWrapper({ children, setCurrentStep }) {
  const onIdle = () => {
    setCurrentStep('welcome'); // Reset to Welcome page
  };

  useIdleTimer({
    timeout: 50 * 1000, // 60 seconds
    onIdle,
    debounce: 500,
  });

  return <>{children}</>;
}

export default IdleTimerWrapper;