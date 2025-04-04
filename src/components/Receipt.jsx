import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import jsPDF from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';
import logo from '../assets/logo.png';

function Receipt({ transactionData, setCurrentStep }) {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);

  // Use items from transactionData if available (using keys from your JSON: "Product", etc.)
  useEffect(() => {
    if (transactionData && transactionData.items) {
      setItems(transactionData.items);
    }
  }, [transactionData]);

  const generatePDF = () => {
    if (!transactionData || !transactionData.id) {
      alert('Error: Transaction data is missing.');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    const logoImg = new Image();
    logoImg.src = logo;

    logoImg.onload = function () {
      try {
        doc.addImage(logoImg, 'PNG', 15, 10, 30, 30);
      } catch (error) {
        console.warn('Logo not added, proceeding without it.');
      }

      // Header Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('QUICKCART', pageWidth / 2, 25, { align: 'center' });
      doc.setLineWidth(0.5);
      doc.line(10, 45, pageWidth - 10, 45);

      // Transaction Details
      let yPos = 55;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(`Transaction ID: ${transactionData.id}`, 15, yPos);
      yPos += 7;
      doc.text(`Customer: ${transactionData.customerName}`, 15, yPos);
      yPos += 7;
      doc.text(`Date: ${transactionData.date}`, 15, yPos);
      yPos += 10;

      // Items Section using keys from your JSON: "Product" and "Discounted Price"
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Items Purchased:', 15, yPos);
      yPos += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);

      if (Array.isArray(items) && items.length > 0) {
        items.forEach(item => {
          const itemName = item.Product || 'Unknown Item';
          const itemPrice = item["Discounted Price"] ? `₹${item["Discounted Price"]}` : '₹0.00';
          const fullText = `${itemName} ........ ${itemPrice}`;
          doc.text(fullText, 15, yPos);
          yPos += 7;
        });
      } else {
        doc.text('No items available', 15, yPos);
        yPos += 7;
      }
      yPos += 5;

      // Total Section
      doc.line(15, yPos, pageWidth - 15, yPos);
      yPos += 10;
      doc.setFont('helvetica', 'bold');
      doc.text(`Total: ₹${transactionData.total}`, 15, yPos);
      yPos += 15;

      // Footer Message
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text("Thank you for shopping with QUICKCART!", pageWidth / 2, yPos, { align: 'center' });

      const pdfName = `receipt_${transactionData.id}.pdf`;
      doc.save(pdfName);
      window.open(doc.output('bloburl'), '_blank');
    };

    logoImg.onerror = function () {
      console.warn('Failed to load logo. Proceeding without it.');
      doc.save(`receipt_${transactionData.id}.pdf`);
      window.open(doc.output('bloburl'), '_blank');
    };
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
              {Array.isArray(items) && items.length > 0 ? (
                items.map((item, index) => (
                  <li
                    key={index}
                    className={item.Product ? item.Product.replace(/\s+/g, '-').toLowerCase() : 'item'}
                  >
                    <span>{item.Product}</span>
                    <span>₹{item["Discounted Price"]}</span>
                  </li>
                ))
              ) : (
                <li className="item">No items available</li>
              )}
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
