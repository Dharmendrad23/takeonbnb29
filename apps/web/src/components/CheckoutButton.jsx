import React, { useState } from 'react';
import { Loader2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';
import { formatCurrencyINR } from '@/lib/bookingUtils.js';

const CheckoutButton = ({
  amount,
  productName,
  bookingId,
  className = '',
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!amount) {
      toast.error('Invalid payment amount.');
      return;
    }

    if (!bookingId) {
      toast.error(
        'Booking ID is missing. Please create the booking again.'
      );
      return;
    }

    setIsProcessing(true);

    try {
      const successUrl =
        `${window.location.origin}/success` +
        `?session_id={CHECKOUT_SESSION_ID}`;

      const cancelUrl =
        `${window.location.origin}/cancel`;

      const response =
        await apiServerClient.fetch(
          '/stripe/create-checkout',
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify({
              amount: Number(amount),

              productName,

              currency: 'INR',

              bookingId,

              successUrl,

              cancelUrl,
            }),
          }
        );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            'Failed to initialize payment'
        );
      }

      if (!data?.url) {
        throw new Error(
          'Stripe checkout URL was not generated.'
        );
      }

      // Redirect to Stripe
      window.location.href = data.url;
    } catch (error) {
      console.error(
        'Checkout error:',
        error
      );

      toast.error(
        error?.message ||
          'Something went wrong. Please try again.'
      );

      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <Button
        onClick={handleCheckout}
        disabled={isProcessing || !amount || !bookingId}
        className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 text-lg rounded-xl transition-all shadow-md hover:shadow-brand active:scale-[0.98] ${className}`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing Secure Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            Pay {formatCurrencyINR(amount)}
          </>
        )}
      </Button>

      <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-muted-foreground pt-2">
        <span className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          UPI
        </span>

        <span className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          Credit/Debit Cards
        </span>

        <span className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          Net Banking
        </span>

        <span className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          Wallets
        </span>
      </div>
    </div>
  );
};

export default CheckoutButton;