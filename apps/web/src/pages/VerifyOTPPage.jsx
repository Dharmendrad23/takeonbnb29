import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, ArrowRight, RefreshCw } from 'lucide-react';

const VerifyOTPPage = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes standard OTP validity
  
  const { authWithOTP, requestOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { email, otpId, from } = location.state || {};

  useEffect(() => {
    if (!email || !otpId) {
      navigate('/login');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [email, otpId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }
    
    setLoading(true);
    try {
      const authData = await authWithOTP(otpId, code);
      toast.success('Email verified successfully!');
      
      const destination = from?.pathname || (authData.record.userType === 'host' ? '/host/dashboard' : '/guest/dashboard');
      navigate(destination, { replace: true });
    } catch (err) {
      toast.error('Invalid or expired OTP. Please check the code or request a new one.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;
    
    setResendLoading(true);
    try {
      await requestOTP(email);
      setTimeLeft(300); // Reset to 5 minutes
      setCode(''); // Clear the input
      toast.success('A new 6-digit code has been sent to your email.');
    } catch (err) {
      toast.error('Failed to resend code. Please try again later.');
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <Helmet><title>Verify Email | TakeOn BnB</title></Helmet>
      
      <Card className="w-full max-w-md shadow-xl border-border rounded-2xl overflow-hidden">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-extrabold tracking-tight text-foreground">Verify your email</CardTitle>
          <CardDescription className="text-base text-muted-foreground mt-2">
            We sent a 6-digit secure code to <span className="font-bold text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 text-center">
              <label className="text-sm font-bold text-foreground">Enter the 6-digit code</label>
              <Input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="h-16 text-center text-3xl tracking-[0.3em] font-extrabold bg-background border-border rounded-xl focus-visible:ring-primary"
                placeholder="••••••"
                required
                autoFocus
              />
              <p className="text-xs text-muted-foreground font-medium">Code expires in {formatTime(timeLeft)}</p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-brand transition-all hover:-translate-y-0.5"
              disabled={loading || code.length !== 6}
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Verifying...</>
              ) : (
                <>Verify & Continue <ArrowRight className="ml-2 w-5 h-5" /></>
              )}
            </Button>

            <div className="text-center pt-4 border-t border-border">
              {timeLeft > 0 ? (
                <p className="text-sm text-muted-foreground font-medium">
                  Didn't receive the code? Wait <span className="font-bold text-foreground">{formatTime(timeLeft)}</span> to resend
                </p>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="w-full h-12 rounded-xl font-bold border-border hover:bg-muted"
                >
                  {resendLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                  ) : (
                    <><RefreshCw className="w-4 h-4 mr-2" /> Resend Code</>
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOTPPage;