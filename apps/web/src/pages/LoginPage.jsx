import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import { toast } from 'sonner';

import {
  Mail,
  Lock,
  Loader2,
  UserPlus,
  ArrowRight,
  Home,
} from 'lucide-react';

const LoginPage = () => {
  const { login, isAuthenticated, isHost } = useAuth();

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // --------------------------------------------------
  // Redirect authenticated users
  // --------------------------------------------------

  useEffect(() => {
    if (isAuthenticated) {
      navigate(
        isHost ? '/host/dashboard' : '/guest/dashboard',
        { replace: true }
      );
    }
  }, [isAuthenticated, isHost, navigate]);

  // --------------------------------------------------
  // Login success
  // --------------------------------------------------

  const handleSuccess = (user) => {
    toast.success('Logged in successfully');

    const destination =
      location.state?.from?.pathname ||
      (user?.role === 'host'
        ? '/host/dashboard'
        : '/guest/dashboard');

    navigate(destination, {
      replace: true,
    });
  };

  // --------------------------------------------------
  // Email Login
  // --------------------------------------------------

  const handleEmailLogin = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address.');
      return;
    }

    if (!password) {
      toast.error('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const authData = await login(
        email.trim().toLowerCase(),
        password
      );

      handleSuccess(authData?.record);
    } catch (error) {
      console.error('Login error:', error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'Invalid email or password.'
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12 pt-28">

      <Helmet>
        <title>Guest Login | Take On BnB</title>

        <meta
          name="description"
          content="Login to your Take On BnB guest account to manage bookings, trips and saved properties."
        />
      </Helmet>

      <Card className="w-full max-w-md shadow-xl border-border rounded-3xl overflow-hidden">

        {/* Header */}
        <CardHeader className="text-center pb-6 pt-8">

          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Home className="w-7 h-7 text-primary" />
          </div>

          <CardTitle className="text-3xl font-extrabold tracking-tight text-foreground">
            Welcome Back
          </CardTitle>

          <CardDescription className="text-base text-muted-foreground mt-2">
            Login to manage your bookings and trips
          </CardDescription>

        </CardHeader>

        <CardContent className="pb-8">

          {/* Login Form */}
          <form
            onSubmit={handleEmailLogin}
            className="space-y-5"
          >

            {/* Email */}
            <div className="space-y-2">

              <label
                htmlFor="email"
                className="text-sm font-bold text-foreground"
              >
                Email Address
              </label>

              <div className="relative">

                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground pointer-events-none" />

                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  className="pl-10 h-12 rounded-xl"
                  placeholder="Enter your email"
                  required
                />

              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">

              <label
                htmlFor="password"
                className="text-sm font-bold text-foreground"
              >
                Password
              </label>

              <div className="relative">

                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground pointer-events-none" />

                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  className="pl-10 h-12 rounded-xl"
                  placeholder="Enter your password"
                  required
                />

              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-bold rounded-xl mt-4"
              disabled={
                loading ||
                !email.trim() ||
                !password
              }
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Log In
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

          </form>

          {/* Divider */}
          <div className="relative my-7">

            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>

            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">
                NEW TO TAKE ON BNB?
              </span>
            </div>

          </div>

          {/* Guest Registration */}
          <Link
            to="/signup"
            className="group block"
          >
            <div className="w-full border border-border rounded-2xl p-4 hover:border-primary hover:bg-primary/5 transition-all duration-200">

              <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                  <UserPlus className="w-5 h-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">

                  <p className="font-bold text-foreground">
                    Create Guest Account
                  </p>

                  <p className="text-sm text-muted-foreground mt-0.5">
                    Register to book stays and manage your trips
                  </p>

                </div>

                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />

              </div>

            </div>
          </Link>

          {/* Host Registration */}
          <div className="mt-7 text-center text-sm">

            <span className="text-muted-foreground">
              Want to list your property?{' '}
            </span>

            <Link
              to="/host/login"
              className="text-primary hover:underline font-bold"
            >
              Become a Host
            </Link>

          </div>

        </CardContent>

      </Card>
    </div>
  );
};

export default LoginPage;