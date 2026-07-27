import React from 'react';
import { Copy, ExternalLink, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const UPIPaymentSection = ({ amount }) => {
  const upiId = 'dharmendrashah1439-1@okhdfcbank';
  const merchantName = 'Take on BNB';
  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&cu=INR&am=${amount}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    toast.success('UPI ID copied to clipboard');
  };

  const handleOpenApp = () => {
    window.open(upiString, '_blank');
  };

  return (
    <div className="flex flex-col items-center w-full space-y-6 bg-card border border-border p-6 rounded-2xl shadow-soft transition-all duration-300 hover:shadow-hover">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-border/50">
        <QRCodeSVG value={upiString} size={200} level="H" />
      </div>
      
      <div className="w-full space-y-4 bg-muted/30 p-5 rounded-2xl border border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Merchant</p>
            <p className="font-semibold text-foreground">{merchantName}</p>
          </div>
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
        </div>
        
        <div className="pt-3 border-t border-border flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="w-full sm:w-auto">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">UPI ID</p>
            <p className="font-mono text-sm sm:text-base font-semibold text-foreground truncate max-w-[200px] sm:max-w-none">{upiId}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleCopy} className="w-full sm:w-auto rounded-xl shadow-sm hover:border-primary hover:text-primary transition-colors">
            <Copy className="w-4 h-4 mr-2" /> Copy ID
          </Button>
        </div>
      </div>

      <Button 
        onClick={handleOpenApp} 
        className="w-full h-14 text-lg font-bold rounded-xl shadow-lg bg-gradient-to-r from-primary to-orange-500 text-white hover:opacity-90 hover:-translate-y-1 transition-all duration-300"
      >
        <ExternalLink className="w-5 h-5 mr-2" /> Open UPI App
      </Button>
    </div>
  );
};

export default UPIPaymentSection;