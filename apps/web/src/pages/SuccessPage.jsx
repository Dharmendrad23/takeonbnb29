import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Home, Receipt, Loader2, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import apiServerClient from '@/lib/apiServerClient.js';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();
  
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found.");
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await apiServerClient.fetch(`/stripe/session/${sessionId}`);
        if (!response.ok) throw new Error("Verification failed");
        
        const data = await response.json();
        setPaymentDetails(data);
      } catch (err) {
        console.error('Session verification error:', err);
        setError("Could not verify payment session. Please check your email for the receipt.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-muted/20 py-20 px-4">
      <Helmet>
        <title>Payment Successful | TakeOn BnB</title>
      </Helmet>
      
      <div className="max-w-md w-full bg-card rounded-3xl shadow-xl p-8 border border-border/50 text-center relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
        
        {loading ? (
          <div className="py-12 flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-foreground">Verifying payment...</h2>
            <p className="text-muted-foreground mt-2">Please don't close this page.</p>
          </div>
        ) : error ? (
          <div className="py-8">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Receipt className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Notice</h2>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Button onClick={() => navigate('/guest/bookings')} className="w-full h-12 rounded-xl">
              Go to My Bookings
            </Button>
          </div>
        ) : (
          <div className="py-4">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
              <CheckCircle2 className="w-10 h-10 relative z-10" />
            </div>
            
            <h1 className="text-3xl font-extrabold text-foreground mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground mb-8">
              Your booking is confirmed. We've sent a receipt to {paymentDetails?.customerEmail || 'your email'}.
            </p>
            
            <div className="bg-muted rounded-2xl p-5 mb-8 text-left space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-border/50">
                <span className="text-muted-foreground font-medium">Status</span>
                <span className="font-bold text-emerald-600 uppercase text-sm tracking-wide">
                  {paymentDetails?.status}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-muted-foreground font-medium">Amount Paid</span>
                <span className="font-extrabold text-foreground text-xl">
                  ${(paymentDetails?.amountTotal / 100).toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full bg-primary hover:bg-primary/90 h-12 rounded-xl text-base shadow-brand">
                <Link to="/guest/bookings">
                  View Booking Details <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-12 rounded-xl text-base border-border">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" /> Back to Home
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;