import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import { toast } from 'sonner';

import {
  Lock,
  User,
  Loader2,
  KeyRound,
  Mail,
  ArrowLeft,
} from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();

  /*
   * IMPORTANT:
   * Guest registration uses requestSignupOTP().
   *
   * Do NOT use requestOTP() here because that is
   * the login OTP endpoint.
   */
  const {
    requestSignupOTP,
    signupWithOTP,
    isAuthenticated,
    currentUser,
  } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [otpId, setOtpId] = useState(null);
  const [otpCode, setOtpCode] = useState('');

  /*
   * If user is already logged in, don't show
   * the registration page again.
   */
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.role === 'host') {
        navigate('/host/dashboard', { replace: true });
      } else {
        navigate('/guest/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, currentUser, navigate]);

  /*
   * OTP resend countdown
   */
  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setTimeout(() => {
      setResendTimer((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendTimer]);

  /*
   * Request Guest Registration OTP
   */
  const handleRequestOTP = async (e) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      toast.error('Please enter your full name');
      return;
    }

    if (cleanName.length < 2) {
      toast.error('Please enter a valid name');
      return;
    }

    if (!cleanEmail) {
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
      /*
       * IMPORTANT:
       * This calls:
       *
       * POST /api/otp/request-signup
       *
       * instead of:
       *
       * POST /api/otp/request-login
       */
      const id = await requestSignupOTP(cleanEmail);

      setEmail(cleanEmail);
      setOtpId(id);
      setOtpCode('');
      setStep(2);
      setResendTimer(30);

      toast.success('Verification code sent to your email');
    } catch (error) {
      console.error('Guest signup OTP error:', error);

      toast.error(
        error?.message ||
          'Unable to send verification code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Verify OTP and create Guest account
   */
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otpId) {
      toast.error('OTP session expired. Please request a new code.');
      setStep(1);
      return;
    }

    if (otpCode.length !== 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      /*
       * Explicitly create a GUEST account.
       */
      await signupWithOTP(
        email,
        password,
        'guest',
        name.trim(),
        otpId,
        otpCode
      );

      toast.success('Guest account created successfully!');

      /*
       * signupWithOTP() already:
       *
       * 1. verifies OTP
       * 2. creates user
       * 3. receives JWT token
       * 4. saves authToken
       * 5. saves authUser
       * 6. updates currentUser
       *
       * So don't send the user to /login.
       * Send directly to Guest Dashboard.
       */
      navigate('/guest/dashboard', {
        replace: true,
      });
    } catch (error) {
      console.error('Guest signup verification error:', error);

      toast.error(
        error?.message ||
          'Verification failed. Please check the OTP and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Resend Guest Registration OTP
   */
  const handleResend = async () => {
    if (resendTimer > 0 || loading) return;

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error('Email is required');
      setStep(1);
      return;
    }

    setLoading(true);

    try {
      /*
       * Again use signup OTP endpoint.
       */
      const id = await requestSignupOTP(cleanEmail);

      setOtpId(id);
      setOtpCode('');
      setResendTimer(30);

      toast.success('New verification code sent');
    } catch (error) {
      console.error('Resend signup OTP error:', error);

      toast.error(
        error?.message ||
          'Unable to resend OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Go back to registration details
   */
  const handleChangeDetails = () => {
    setStep(1);
    setOtpCode('');
    setOtpId(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12 pt-28">

      <Helmet>
        <title>Guest Sign Up | TakeOn BnB</title>

        <meta
          name="description"
          content="Create your TakeOn BnB guest account and start booking your perfect stay."
        />
      </Helmet>

      <Card className="w-full max-w-md shadow-xl border-border rounded-2xl overflow-hidden">

        {/* Header */}
        <CardHeader className="text-center pb-6 bg-primary-gradient text-white">

          <CardTitle className="text-3xl font-extrabold tracking-tight">
            Join TakeOn BnB
          </CardTitle>

          <CardDescription className="text-white/80 mt-2">
            Create your guest account and start booking amazing stays
          </CardDescription>

        </CardHeader>

        <CardContent className="pt-8">

          {/* =========================
              STEP 1 — ACCOUNT DETAILS
          ========================== */}
          {step === 1 && (
            <form
              onSubmit={handleRequestOTP}
              className="space-y-5 animate-in fade-in"
            >

              {/* Name */}
              <div className="space-y-2">

                <label className="text-sm font-bold text-foreground">
                  Full Name
                </label>

                <div className="relative">

                  <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />

                  <Input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12"
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />

                </div>

              </div>

              {/* Email */}
              <div className="space-y-2">

                <label className="text-sm font-bold text-foreground">
                  Email
                </label>

                <div className="relative">

                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />

                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    placeholder="your@email.com"
                    autoComplete="email"
                  />

                </div>

              </div>

              {/* Password */}
              <div className="space-y-2">

                <label className="text-sm font-bold text-foreground">
                  Password
                </label>

                <div className="relative">

                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />

                  <Input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12"
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                  />

                </div>

              </div>

              {/* Confirm Password */}
              <div className="space-y-2">

                <label className="text-sm font-bold text-foreground">
                  Confirm Password
                </label>

                <div className="relative">

                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />

                  <Input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    className="pl-10 h-12"
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                  />

                </div>

              </div>

              {/* Continue */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-bold rounded-xl mt-4 bg-primary text-white hover:bg-primary/90"
                disabled={
                  loading ||
                  !name.trim() ||
                  !email.trim() ||
                  !password ||
                  !confirmPassword
                }
              >

                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  'Continue'
                )}

              </Button>

            </form>
          )}

          {/* =========================
              STEP 2 — OTP VERIFICATION
          ========================== */}
          {step === 2 && (
            <form
              onSubmit={handleVerifyOTP}
              className="space-y-5 animate-in slide-in-from-right-4"
            >

              <div className="text-center mb-6">

                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-8 h-8" />
                </div>

                <h3 className="text-xl font-bold text-foreground">
                  Verify Your Email
                </h3>

                <p className="text-muted-foreground text-sm mt-2">
                  Enter the 6-digit verification code sent to
                </p>

                <p className="font-semibold text-foreground text-sm mt-1 break-all">
                  {email}
                </p>

              </div>

              {/* OTP */}
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

              {/* Verify */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-bold rounded-xl mt-4"
                disabled={
                  loading ||
                  otpCode.length !== 6 ||
                  !otpId
                }
              >

                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Verify & Create Guest Account'
                )}

              </Button>

              {/* Resend */}
              <div className="text-center mt-4">

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={
                    resendTimer > 0 ||
                    loading
                  }
                  className="text-sm font-semibold text-primary disabled:text-muted-foreground hover:underline"
                >

                  {resendTimer > 0
                    ? `Resend code in ${resendTimer}s`
                    : 'Resend Code'}

                </button>

              </div>

              {/* Change Details */}
              <div className="text-center mt-3">

                <button
                  type="button"
                  onClick={handleChangeDetails}
                  disabled={loading}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Change Email
                </button>

              </div>

            </form>
          )}

          {/* Login */}
          {step === 1 && (
            <div className="mt-6 text-center text-sm">

              <span className="text-muted-foreground">
                Already have a guest account?{' '}
              </span>

              <Link
                to="/login"
                className="text-primary hover:underline font-bold"
              >
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