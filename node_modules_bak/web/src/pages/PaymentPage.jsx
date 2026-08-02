import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Smartphone, Landmark, ShieldCheck, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/bookingUtils.js';

// Note: This is an isolated payment page if needed outside the modal flow.
// The primary payment flow is handled inside BookingFlowModal.jsx

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const { amount, bookingId } = location.state || { amount: 0, bookingId: null };

  useEffect(() => {
    if (!amount) {
      navigate('/');
    }
  }, [amount, navigate]);

  const handlePayment = async () => {
    setLoading(true);
    // Simulate API call to Razorpay/Backend
    setTimeout(() => {
      navigate(`/booking/confirmation/${bookingId}`);
    }, 2000);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 sm:p-8 bg-muted/20">
      <Helmet><title>Secure Payment | Take on BnB</title></Helmet>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Secure Checkout</h1>
          <p className="text-muted-foreground">Complete your payment to confirm the booking</p>
        </div>

        <Card className="shadow-luxury border-border rounded-2xl overflow-hidden">
          <div className="bg-primary/5 p-6 border-b border-border text-center">
            <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-1">Amount to pay</p>
            <p className="text-4xl font-bold text-foreground">{formatCurrency(amount)}</p>
          </div>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Select Payment Method</h3>
            <RadioGroup value={method} onValueChange={setMethod} className="space-y-3">
              <Label htmlFor="card" className="flex items-center gap-4 p-4 border border-border rounded-xl cursor-pointer hover:bg-muted/50 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 transition-all">
                <RadioGroupItem value="card" id="card" />
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Credit / Debit Card</span>
              </Label>
              <Label htmlFor="upi" className="flex items-center gap-4 p-4 border border-border rounded-xl cursor-pointer hover:bg-muted/50 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 transition-all">
                <RadioGroupItem value="upi" id="upi" />
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">UPI (GPay, PhonePe)</span>
              </Label>
              <Label htmlFor="netbanking" className="flex items-center gap-4 p-4 border border-border rounded-xl cursor-pointer hover:bg-muted/50 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5 transition-all">
                <RadioGroupItem value="netbanking" id="netbanking" />
                <Landmark className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Net Banking</span>
              </Label>
            </RadioGroup>

            <Button 
              onClick={handlePayment} 
              disabled={loading}
              className="w-full h-14 mt-8 bg-primary hover:bg-primary/90 text-lg font-bold rounded-xl"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Pay ${formatCurrency(amount)}`}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              By proceeding, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;