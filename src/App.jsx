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

  const handlePayment = (data) => {
    setTransactionData(data);
    alert('Payment Successful!');
    setCurrentStep('receipt');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome': return <Welcome setCurrentStep={setCurrentStep} />;
      case 'home': return <Home setCurrentStep={setCurrentStep} />;
      case 'cart': return <CartSummary setCurrentStep={setCurrentStep} />;
      case 'checkout': return <Checkout setCurrentStep={setCurrentStep} setTransactionData={setTransactionData} handlePayment={handlePayment} />;
      case 'receipt': 
        return transactionData ? (
          <Receipt transactionData={transactionData} setCurrentStep={setCurrentStep} />
        ) : (
          <p>Error: No transaction data available. Please complete the checkout first.</p>
        );
      case 'signin': return <SignIn setCurrentStep={setCurrentStep} />;
      case 'signup': return <SignUp setCurrentStep={setCurrentStep} />;
      case 'profile': return <Profile setCurrentStep={setCurrentStep} />;
      case 'orderhistory': return <OrderHistory setCurrentStep={setCurrentStep} />;
      case 'feedback': return <Feedback setCurrentStep={setCurrentStep} />;
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
              <div className="nav-buttons">
                {['home', 'cart', 'checkout', 'receipt', 'feedback', 'profile', 'orderhistory'].map((step) => (
                  <button
                    key={step}
                    onClick={() => setCurrentStep(step)}
                    className={currentStep === step ? 'active' : ''}
                  >
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </button>
                ))}
              </div>
              {renderStep()}
            </div>
          </IdleTimerWrapper>
        </CartProvider>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;


