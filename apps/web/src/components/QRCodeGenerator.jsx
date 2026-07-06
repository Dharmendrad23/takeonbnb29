import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodeGenerator = ({ amount, upiId, merchantName }) => {
  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&cu=INR&am=${amount}`;
  
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-border transition-transform duration-300 hover:scale-[1.02]">
      <div className="bg-white p-3 rounded-xl border border-border shadow-sm">
        <QRCodeSVG 
          value={upiString} 
          size={220} 
          level="H" 
          includeMargin={false} 
          fgColor="#1a1a1a"
        />
      </div>
      <p className="mt-4 text-sm font-medium text-muted-foreground">Scan with any UPI App</p>
    </div>
  );
};

export default QRCodeGenerator;