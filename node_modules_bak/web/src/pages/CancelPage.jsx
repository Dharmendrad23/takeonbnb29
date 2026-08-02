import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCcw } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';

const CancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-muted/20 py-20 px-4">
      <Helmet>
        <title>Payment Cancelled | TakeOn BnB</title>
      </Helmet>
      
      <div className="max-w-md w-full bg-card rounded-3xl shadow-lg p-8 border border-border/50 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10" />
        </div>
        
        <h1 className="text-2xl font-extrabold text-foreground mb-3">Payment Cancelled</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          You cancelled the checkout process. No charges were made to your account. Your selected dates are not reserved yet.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => navigate(-1)} 
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-xl font-semibold"
          >
            <RefreshCcw className="w-4 h-4 mr-2" /> Try Again
          </Button>
          <Button 
            asChild 
            variant="outline" 
            className="flex-1 h-12 rounded-xl border-border font-semibold"
          >
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;