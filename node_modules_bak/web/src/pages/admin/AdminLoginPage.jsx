import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowRight, ShieldCheck, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

const AdminLoginPage = () => {
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/admin';
    navigate(from, { replace: true });
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please enter email and password");
    
    setIsLoading(true);
    try {
      await login(email, password);
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err) {
      toast.error("Invalid credentials or unauthorized access.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <Helmet>
        <title>Admin Login | Take On BnB</title>
      </Helmet>
      
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-3xl mix-blend-multiply pointer-events-none" />

      <div className="w-full max-w-md bg-card border border-border shadow-xl rounded-3xl p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Admin Portal</h1>
          <p className="text-muted-foreground text-sm">Secure access for administrators</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="admin@takeonbnb.com"
                className="pl-10 bg-input border-border text-foreground focus-visible:ring-primary h-12 rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10 bg-input border-border text-foreground focus-visible:ring-primary h-12 rounded-xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-12 text-base font-medium shadow-md transition-all duration-200 mt-4"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
              <>Sign In <ArrowRight className="w-4 h-4 ml-2" /></>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;