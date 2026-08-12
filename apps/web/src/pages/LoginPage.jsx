import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Mail,
  Lock,
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
  UserPlus,
} from 'lucide-react';

const LoginPage = () => {
  const { login, isAuthenticated, isHost } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  // Login steps
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  // Redirect already authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      navigate(
        isHost ? '/host/dashboard' : '/guest/dashboard',
        { replace: true }
      );
    }
  }, [isAuthenticated, isHost, navigate]);

  const handleContinue = (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error('Please enter your email address');
      return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setEmail(cleanEmail);
    setStep(2);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter your password');
      return;
    }

    setLoading(true);

    try {
      const authData = await login(email, password);

      const user = authData.record;

      toast.success('Logged in successfully');

      const destination =
        location.state?.from?.pathname ||
        (user.role === 'host'
          ? '/host/dashboard'
          : '/guest/dashboard');

      navigate(destination, { replace: true });
    } catch (err) {
      console.error('Login error:', err);

      toast.error(
        err?.message || 'Invalid email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.info('Google login is coming soon.');
  };

  const handleAppleLogin = () => {
    toast.info('Apple login is coming soon.');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">

      <Helmet>
        <title>Log in or Sign up | Take On BnB</title>
        <meta
          name="description"
          content="Log in or create your Take On BnB account to book your next stay."
        />
      </Helmet>

      <div className="w-full max-w-[520px]">

        {/* Main Login Card */}
        <div className="bg-card border border-border rounded-[28px] shadow-xl overflow-hidden">

          {/* Header */}
          <div className="px-6 sm:px-10 pt-10 pb-7 text-center">

            {/* Logo */}
            <div className="flex justify-center mb-7">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white text-2xl font-extrabold">
                    T
                  </span>
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Log in or sign up
            </h1>

            <p className="text-muted-foreground mt-3">
              Welcome to Take On BnB
            </p>

          </div>

          {/* Content */}
          <div className="px-6 sm:px-10 pb-10">

            {/* STEP 1 - EMAIL */}
            {step === 1 && (
              <form
                onSubmit={handleContinue}
                className="space-y-5"
              >

                <div className="space-y-2">

                  <label className="text-sm font-semibold text-foreground">
                    Email address
                  </label>

                  <div className="relative">

                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

                    <Input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="Enter your email"
                      autoComplete="email"
                      className="
                        h-14
                        pl-12
                        pr-4
                        rounded-xl
                        text-base
                        border-border
                        focus-visible:ring-primary
                      "
                      autoFocus
                      required
                    />

                  </div>

                </div>

                <Button
                  type="submit"
                  className="
                    w-full
                    h-14
                    rounded-xl
                    text-base
                    font-bold
                    bg-primary
                    hover:bg-primary/90
                  "
                  disabled={!email.trim()}
                >
                  Continue
                </Button>

              </form>
            )}

            {/* STEP 2 - PASSWORD */}
            {step === 2 && (
              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >

                {/* Email Preview */}
                <div className="rounded-xl bg-muted/50 border border-border p-4">

                  <div className="flex items-center justify-between gap-3">

                    <div className="min-w-0">

                      <p className="text-xs text-muted-foreground mb-1">
                        Email
                      </p>

                      <p className="font-semibold text-foreground truncate">
                        {email}
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setPassword('');
                        setStep(1);
                      }}
                      className="text-sm font-semibold text-primary hover:underline shrink-0"
                    >
                      Change
                    </button>

                  </div>

                </div>

                {/* Password */}
                <div className="space-y-2">

                  <label className="text-sm font-semibold text-foreground">
                    Password
                  </label>

                  <div className="relative">

                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="
                        h-14
                        pl-12
                        pr-12
                        rounded-xl
                        text-base
                        border-border
                        focus-visible:ring-primary
                      "
                      autoFocus
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-muted-foreground
                        hover:text-foreground
                      "
                      aria-label={
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>

                  </div>

                </div>

                <Button
                  type="submit"
                  className="
                    w-full
                    h-14
                    rounded-xl
                    text-base
                    font-bold
                    bg-primary
                    hover:bg-primary/90
                  "
                  disabled={loading || !password}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Log In'
                  )}
                </Button>

              </form>
            )}

            {/* Divider */}
            <div className="flex items-center gap-4 my-7">

              <div className="h-px bg-border flex-1" />

              <span className="text-sm text-muted-foreground">
                or
              </span>

              <div className="h-px bg-border flex-1" />

            </div>

            {/* Social Login UI */}
            <div className="grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="
                  h-14
                  rounded-xl
                  border
                  border-border
                  bg-background
                  hover:bg-muted
                  transition
                  flex
                  items-center
                  justify-center
                  gap-3
                  font-semibold
                "
              >
                <span className="text-xl font-bold">
                  G
                </span>

                <span className="hidden sm:inline">
                  Google
                </span>
              </button>

              <button
                type="button"
                onClick={handleAppleLogin}
                className="
                  h-14
                  rounded-xl
                  border
                  border-border
                  bg-background
                  hover:bg-muted
                  transition
                  flex
                  items-center
                  justify-center
                  gap-3
                  font-semibold
                "
              >
                <span className="text-xl">
                  
                </span>

                <span className="hidden sm:inline">
                  Apple
                </span>
              </button>

            </div>

            {/* Guest Registration */}
            <div className="mt-8 text-center">

              <p className="text-sm text-muted-foreground">
                Don't have an account?
              </p>

              <Link
                to="/signup"
                className="
                  mt-2
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  text-primary
                  font-bold
                  hover:underline
                "
              >
                <UserPlus className="w-4 h-4" />
                Sign up as Guest
              </Link>

            </div>

            {/* Host Login */}
            <div className="mt-6 pt-6 border-t border-border text-center">

              <p className="text-sm text-muted-foreground">
                Want to list your property?
              </p>

              <Link
                to="/host/login"
                className="inline-block mt-1 text-sm text-primary hover:underline font-bold"
              >
                Become a Host
              </Link>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default LoginPage;