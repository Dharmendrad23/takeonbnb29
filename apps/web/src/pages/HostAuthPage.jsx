import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Building2, Mail, Lock, User, Loader2 } from 'lucide-react';

const HostAuthPage = () => {
  const { isAuthenticated, isHost, login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated as host, go directly to host dashboard
  useEffect(() => {
    if (isAuthenticated && isHost) {
      navigate('/host/dashboard', { replace: true });
    }
  }, [isAuthenticated, isHost, navigate]);

  // Login tab state
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);

  // Register tab state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const { record } = await login(loginData.email, loginData.password);
      if (record.role !== 'host') {
        toast.error('This account is not a host account. Please use the regular login.');
        return;
      }
      toast.success('Welcome back!');
      navigate('/host/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    if (registerData.password !== registerData.passwordConfirm) {
      setRegisterError('Passwords do not match');
      return;
    }
    setRegisterLoading(true);
    try {
      await signup(registerData.email, registerData.password, registerData.name, 'host');
      toast.success('Host account created! Welcome aboard.');
      navigate('/host/dashboard', { replace: true });
    } catch (err) {
      setRegisterError(err.message || 'Failed to create account.');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12 pt-28">
      <Helmet><title>Host Portal | Take On BnB</title></Helmet>

      <div className="w-full max-w-md bg-card rounded-3xl shadow-xl border border-border p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <Building2 className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Host Portal</h1>
          <p className="text-muted-foreground text-sm mt-1 text-center">
            Login or register to manage your properties
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Become a Host</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="host@example.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-bold rounded-xl mt-2"
                disabled={loginLoading || !loginData.email || !loginData.password}
              >
                {loginLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login to Dashboard'}
              </Button>
            </form>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            {registerError && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4">
                {registerError}
              </div>
            )}
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="reg-name"
                    type="text"
                    placeholder="Your full name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    required
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="host@example.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                    minLength={8}
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-confirm">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="reg-confirm"
                    type="password"
                    placeholder="Re-enter your password"
                    value={registerData.passwordConfirm}
                    onChange={(e) => setRegisterData({ ...registerData, passwordConfirm: e.target.value })}
                    required
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-bold rounded-xl mt-2"
                disabled={registerLoading}
              >
                {registerLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register as Host'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          Looking for a stay?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Guest Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default HostAuthPage;
