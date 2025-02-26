import { useTranslation } from 'react-i18next';
import jsPDF from 'jspdf';
import { QRCodeSVG } from 'qrcode.react'; // Updated import
import logo from '../assets/logo.png';

function Receipt({ transactionData, setCurrentStep }) {
  const { t } = useTranslation();

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add logo and header
    doc.addImage(logo, 'PNG', 15, 10, 30, 30);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('QUICKCART', pageWidth / 2, 25, { align: 'center' });
    doc.setFontSize(12);
    doc.text(t('motto'), pageWidth / 2, 32, { align: 'center' });

    // Transaction details
    let yPos = 45;
    const addText = (text, x = 15) => {
      doc.text(text, x, yPos);
      yPos += 8;
    };

    addText(`${t('transaction_id')}: ${transactionData.id}`);
    addText(`${t('customer')}: ${transactionData.customerName}`);
    addText(`${t('date')}: ${transactionData.date}`);
    yPos += 5;

    // Items table
    doc.setFont('helvetica', 'bold');
    addText(t('items_purchased'));
    doc.setFont('helvetica', 'normal');
    
    transactionData.items.forEach(item => {
      doc.text(item.name, 15, yPos);
      doc.text(`₹${item.price}`, pageWidth - 20, yPos, { align: 'right' });
      yPos += 8;
    });

    // Total
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.text(`${t('total')}: ₹${transactionData.total}`, pageWidth - 20, yPos, { align: 'right' });
    yPos += 10;

    // Payment details
    addText(`${t('payment_method')}: ${transactionData.paymentMethod}`);
    addText(`${t('payment_details')}: ${transactionData.paymentDetails || 'N/A'}`);

    doc.save(`receipt_${transactionData.id}.pdf`);
  };

  const whatsappMessage = encodeURIComponent(
    `${t('receipt_summary')}:\n\n` +
    `${t('transaction_id')}: ${transactionData.id}\n` +
    `${t('total')}: ₹${transactionData.total}\n` +
    `${t('payment_method')}: ${transactionData.paymentMethod}`
  );

  return (
    <div className="receipt">
      <div className="receipt-header">
        <img src={logo} alt="Logo" className="receipt-logo" />
        <h2 className="receipt-motto">{t('motto')}</h2>
      </div>

      <div className="receipt-body">
        <div className="receipt-details">
          <div className="detail-row">
            <span className="detail-label">{t('transaction_id')}:</span>
            <span className="detail-value">{transactionData.id}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">{t('customer')}:</span>
            <span className="detail-value">{transactionData.customerName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">{t('date')}:</span>
            <span className="detail-value">{transactionData.date}</span>
          </div>

          <div className="items-section">
            <h3 className="section-title">{t('items_purchased')}</h3>
            <ul className="items-list">
              {transactionData.items.map((item, index) => (
                <li key={index} className="item">
                  <span>{item.name}</span>
                  <span>₹{item.price}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="total-section">
            <span className="total-label">{t('total')}:</span>
            <span className="total-amount">₹{transactionData.total}</span>
          </div>

          <div className="payment-details">
            <div className="detail-row">
              <span className="detail-label">{t('payment_method')}:</span>
              <span className="detail-value">{transactionData.paymentMethod}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">{t('payment_details')}:</span>
              <span className="detail-value">{transactionData.paymentDetails || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="qr-section">
          <QRCodeSVG
            value={JSON.stringify({
              id: transactionData.id,
              total: transactionData.total,
              timestamp: new Date().toISOString()
            })}
            size={180}
            level="H"
            bgColor="#FFFFFF"
            fgColor="#000000"
            includeMargin={false}
            className="receipt-qr"
          />
        </div>
      </div>

      <div className="receipt-actions">
        <button onClick={generatePDF} className="action-btn download-btn">
          {t('download_pdf')}
        </button>
        <button 
          onClick={() => alert(t('receipt_email_sent'))} 
          className="action-btn email-btn"
        >
          {t('email_receipt')}
        </button>
        <a
          href={`https://wa.me/?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="action-btn whatsapp-btn"
        >
          {t('share_whatsapp')}
        </a>
        <button 
          onClick={() => setCurrentStep('feedback')}
          className="action-btn feedback-btn"
        >
          {t('provide_feedback')} →
        </button>
      </div>
    </div>
  );
}

export default Receipt;