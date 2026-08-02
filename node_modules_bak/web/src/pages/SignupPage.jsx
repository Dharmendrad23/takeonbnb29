import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Lock, User, Loader2, KeyRound, Mail } from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();
  const { requestOTP, signupWithOTP } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpId, setOtpId] = useState(null);
  const [otpCode, setOtpCode] = useState('');

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email is required');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const id = await requestOTP(email);
      setOtpId(id);
      setStep(2);
      setResendTimer(30);
      toast.success('OTP sent to your email');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await signupWithOTP(email, password, 'guest', name, otpId, otpCode);
      toast.success('Account created successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      const id = await requestOTP(email);
      setOtpId(id);
      setResendTimer(30);
      toast.success('OTP resent successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12 pt-28">
      <Helmet><title>Sign Up | TakeOn BnB</title></Helmet>

      <Card className="w-full max-w-md shadow-xl border-border rounded-2xl overflow-hidden">
        <CardHeader className="text-center pb-6 bg-primary-gradient text-white">
          <CardTitle className="text-3xl font-extrabold tracking-tight">Join TakeOn BnB</CardTitle>
          <CardDescription className="text-white/80 mt-2">
            Create an account to book your perfect stay
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-8">
          {step === 1 && (
            <form onSubmit={handleRequestOTP} className="space-y-5 animate-in fade-in">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12"
                    placeholder="Min 8 characters"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-12"
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-bold rounded-xl mt-4 bg-primary text-white hover:bg-primary/90"
                disabled={loading || !email || !password}
              >
                {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : 'Continue'}
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-5 animate-in slide-in-from-right-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">Verify Email</h3>
                <p className="text-muted-foreground text-sm mt-2">
                  Enter the 6-digit code sent to {email}
                </p>
              </div>

              <div className="space-y-2">
                <InputOTP
                  maxLength={6}
                  value={otpCode}
                  onChange={setOtpCode}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoFocus
                  className="h-14 text-center text-2xl font-bold tracking-[0.5em]"
                  containerClassName="justify-center"
                  render={({ slots }) => (
                    <InputOTPGroup className="justify-center gap-2">
                      {slots.map((slot, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="h-14 w-12 text-2xl font-bold"
                        />
                      ))}
                    </InputOTPGroup>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-bold rounded-xl mt-4"
                disabled={loading || otpCode.length !== 6}
              >
                {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : 'Verify & Create Account'}
              </Button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendTimer > 0 || loading}
                  className="text-sm font-semibold text-primary disabled:text-muted-foreground hover:underline"
                >
                  {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Code'}
                </button>
              </div>

              <div className="text-center mt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  Change Email
                </button>
              </div>
            </form>
          )}

          {step === 1 && (
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary hover:underline font-bold">
                Log in
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;