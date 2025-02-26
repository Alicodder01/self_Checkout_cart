import { useState } from 'react';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { DarkModeProvider } from './contexts/DarkModeContext';
import IdleTimerWrapper from './components/IdleTimerWrapper';
import Header from './components/Header';
import Welcome from './components/Welcome';
import Home from './components/Home';
import CartSummary from './components/CartSummary';
import Checkout from './components/Checkout';
import Receipt from './components/Receipt';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import OrderHistory from './components/OrderHistory';
import Feedback from './components/Feedback';

function App() {
  const [currentStep, setCurrentStep] = useState('welcome'); // Start with welcome screen
  const [transactionData, setTransactionData] = useState(null);

  const steps = ['welcome', 'home', 'cart', 'checkout', 'receipt', 'feedback', 'profile', 'orderhistory'];
  const currentStepIndex = steps.indexOf(currentStep);

  const navigateBack = () => {
    const prevStepIndex = currentStepIndex - 1;
    if (prevStepIndex >= 0) {
      setCurrentStep(steps[prevStepIndex]);
    }
  };

  const navigateNext = () => {
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < steps.length) {
      setCurrentStep(steps[nextStepIndex]);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome': return <Welcome setCurrentStep={setCurrentStep} />;
      case 'home': return <Home setCurrentStep={setCurrentStep} navigateBack={navigateBack} navigateNext={navigateNext} />;
      case 'cart': return <CartSummary setCurrentStep={setCurrentStep} navigateBack={navigateBack} navigateNext={navigateNext} />;
      case 'checkout': return <Checkout setCurrentStep={setCurrentStep} navigateBack={navigateBack} navigateNext={navigateNext} setTransactionData={setTransactionData} />;
      case 'receipt': return <Receipt transactionData={transactionData} setCurrentStep={setCurrentStep} navigateBack={navigateBack} navigateNext={navigateNext} />;
      case 'signin': return <SignIn setCurrentStep={setCurrentStep} navigateBack={navigateBack} />;
      case 'signup': return <SignUp setCurrentStep={setCurrentStep} navigateBack={navigateBack} />;
      case 'profile': return <Profile setCurrentStep={setCurrentStep} navigateBack={navigateBack} />;
      case 'orderhistory': return <OrderHistory setCurrentStep={setCurrentStep} navigateBack={navigateBack} navigateNext={navigateNext} />;
      case 'feedback': return <Feedback setCurrentStep={setCurrentStep} navigateBack={navigateBack} navigateNext={navigateNext} />;
      default: return <Welcome setCurrentStep={setCurrentStep} />;
    }
  };

  return (
    <DarkModeProvider>
      <AuthProvider>
        <CartProvider>
          <IdleTimerWrapper setCurrentStep={setCurrentStep}>
            <div className="app">
              {currentStep !== 'welcome' && <Header setCurrentStep={setCurrentStep} />}
              {currentStepIndex >= 0 && currentStep !== 'welcome' && (
                <div className="progress-bar">
                  {steps.slice(1).map((step, index) => (
                    <div
                      key={step}
                      className={`progress-step ${index <= currentStepIndex - 1 ? 'active' : ''}`}
                    >
                      {step.charAt(0).toUpperCase() + step.slice(1)}
                    </div>
                  ))}
                </div>
              )}
              {renderStep()}
            </div>
          </IdleTimerWrapper>
        </CartProvider>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;