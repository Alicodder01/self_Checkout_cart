import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { jsPDF } from "jspdf";

function Checkout({ setCurrentStep, navigateBack, navigateNext, setTransactionData }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchCartData = async () => {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from("jason-files")
        .download("scanned_data.json");

      if (error) {
        console.error("Error fetching JSON:", error.message);
      } else {
        const jsonData = await data.text();
        const parsedData = JSON.parse(jsonData);
        setCartData(parsedData);
      }
      setLoading(false);
    };

    fetchCartData();
  }, []);

  if (loading) return <p>Loading checkout...</p>;
  if (!cartData || !cartData.total_price) return <p>No items available for checkout.</p>;

  const handlePayment = async () => {
    if (!paymentMethod || (paymentMethod !== 'cash' && !paymentDetails)) {
      setPaymentError('Please select a payment method and enter payment details if required.');
      return;
    }

    let maskedPaymentDetails = paymentDetails;
    if (paymentMethod === 'card') {
      maskedPaymentDetails = `**** **** **** ${paymentDetails.slice(-4)}`;
    } else if (paymentMethod === 'upi') {
      maskedPaymentDetails = paymentDetails;
    } else if (paymentMethod === 'cash') {
      maskedPaymentDetails = 'Cash Payment';
    }

    const transaction = {
      id: `TXN${Date.now()}`,
      items: cartData.scanned_products,
      total: cartData.total_price,
      paymentMethod,
      paymentDetails: maskedPaymentDetails,
      customerName: user?.name || 'Guest',
      date: new Date().toLocaleString(),
    };

    setTransactionData(transaction);
    setPaymentError('');

    if (paymentMethod !== 'cash') {
      window.open("https://rzp.io/rzp/Dz75UnB", "_blank"); // Replace with your Razorpay link
    }

    // Simulate payment success delay
    setTimeout(() => {
      setShowSuccess(true); // Show success message
      generateReceipt(transaction);
      resetCart();

      setTimeout(() => {
        setCurrentStep('welcome'); // Redirect to welcome page
      }, 5000); // Redirect after 5 seconds
    }, 3000);
  };

  const generateReceipt = (transaction) => {
    const doc = new jsPDF();
    doc.text("Payment Receipt", 20, 20);
    doc.text(`Transaction ID: ${transaction.id}`, 20, 30);
    doc.text(`Customer: ${transaction.customerName}`, 20, 40);
    doc.text(`Date: ${transaction.date}`, 20, 50);
    doc.text(`Total: ₹${transaction.total.toFixed(2)}`, 20, 60);
    doc.text(`Payment Method: ${transaction.paymentMethod}`, 20, 70);
    doc.text(`Payment Details: ${transaction.paymentDetails}`, 20, 80);
    
    let yPos = 90;
    doc.text("Items Purchased:", 20, yPos);
    transaction.items.forEach((item, index) => {
      yPos += 10;
      doc.text(`${index + 1}. ${item.name} - ₹${item.price}`, 20, yPos);
    });

    const pdfFile = `Receipt_${transaction.id}.pdf`;
    doc.save(pdfFile);

    // Open the generated PDF
    const pdfBlob = doc.output("blob");
    const pdfURL = URL.createObjectURL(pdfBlob);
    window.open(pdfURL, "_blank");
  };

  const resetCart = async () => {
    const emptyData = { scanned_products: [], total_price: 0 };
    const { error } = await supabase.storage
      .from("jason-files")
      .update("scanned_data.json", JSON.stringify(emptyData), { contentType: "application/json" });

    if (error) {
      console.error("Error resetting cart:", error.message);
    }
  };

  return (
    <div className="checkout">
      <h2 className="checkout-title">{t('checkout')}</h2>
      {showSuccess ? (
        <div className="success-message">
          <h3>Payment Successful! 🎉</h3>
          <p>Your receipt has been downloaded and opened. Redirecting to the welcome page...</p>
        </div>
      ) : (
        <>
          <div className="checkout-summary">
            <p className="total">{t('total')}: ₹{cartData.total_price.toFixed(2)}</p>
          </div>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="payment-select"
          >
            <option value="">{t('select_payment_method', 'Select Payment Method')}</option>
            <option value="cash">{t('cash', 'Cash')}</option>
            <option value="upi">{t('upi', 'UPI')}</option>
            <option value="card">{t('card', 'Card')}</option>
          </select>
          {paymentMethod && paymentMethod !== 'cash' && (
            <input
              type="text"
              placeholder={
                paymentMethod === 'upi' 
                  ? t('enter_upi_id', 'Enter UPI ID (e.g., user@upi)') 
                  : t('enter_card_last_4', 'Enter last 4 digits of card')
              }
              value={paymentDetails}
              onChange={(e) => {
                setPaymentDetails(e.target.value);
                setPaymentError('');
              }}
              className="payment-details-input"
              maxLength={paymentMethod === 'upi' ? 50 : 4}
            />
          )}
          {paymentError && <p className="error-message">{paymentError}</p>}
          <div className="navigation">
            <button className="back-btn" onClick={navigateBack}>
              {t('back')}
            </button>
            <button 
              className="next-btn" 
              onClick={handlePayment} 
              disabled={!paymentMethod || (paymentMethod !== 'cash' && !paymentDetails)}
            >
              {t('pay_now')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Checkout;
 