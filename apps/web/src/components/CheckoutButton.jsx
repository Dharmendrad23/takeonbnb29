import React, { useState } from 'react';
import { Loader2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';
import { formatCurrencyINR } from '@/lib/bookingUtils.js';

const CheckoutButton = ({ amount, productName, className = '' }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const response = await apiServerClient.fetch('/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          productName,
          currency: 'INR',
          successUrl: `https://takeonbnb.com/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `https://takeonbnb.com/cancel`
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to initialize payment');
      }

      const data = await response.json();
      
      // Use window.open for iframe compatibility 
      window.open(data.url, '_blank');
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <Button 
        onClick={handleCheckout} 
        disabled={isProcessing || !amount}
        className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 text-lg rounded-xl transition-all shadow-md hover:shadow-brand active:scale-[0.98] ${className}`}
      >
        {isProcessing ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing Secure Payment...</>
        ) : (
          <><CreditCard className="w-5 h-5 mr-2" /> Pay {formatCurrencyINR(amount)}</>
        )}
      </Button>
      
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-muted-foreground pt-2">
        <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> UPI</span>
        <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Credit/Debit Cards</span>
        <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Net Banking</span>
        <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Wallets</span>
      </div>
    </div>
  );
};

export default CheckoutButton;