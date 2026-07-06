import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Building2 } from 'lucide-react';

const HostLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState('request'); // 'request' or 'verify'
  const [isLoading, setIsLoading] = useState(false);
  
  const { loginWithEmail, loginWithOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await loginWithEmail(email, password);
      if (user.userType !== 'host') {
        toast.error('This account is not registered as a host.');
        // Optionally log them out or redirect
      } else {
        navigate('/host/dashboard');
      }
    } catch (error) {
      toast.error(' email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await loginWithOTP(otpEmail);
      setStep('verify');
    } catch (error) {
      toast.error('Failed to send OTP. Ensure email is registered.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await verifyOTP(otpCode);
      if (user.userType !== 'host') {
        toast.error('This account is not registered as a host.');
      } else {
        navigate('/host/dashboard');
      }
    } catch (error) {
      toast.error('Invalid OTP code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-lg p-8 border border-border">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Host Portal Login</h1>
          <p className="text-muted-foreground text-sm mt-2">Manage your properties and bookings</p>
        </div>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="otp">OTP Login</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="host@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-foreground"
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login to Dashboard'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="otp">
            {step === 'request' ? (
              <form onSubmit={handleOTPRequest} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otpEmail">Registered Email</Label>
                  <Input 
                    id="otpEmail" 
                    type="email" 
                    placeholder="Enter your email for OTP"
                    value={otpEmail}
                    onChange={(e) => setOtpEmail(e.target.value)}
                    required
                    className="text-foreground"
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOTPVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otpCode">Enter 8-digit OTP</Label>
                  <Input 
                    id="otpCode" 
                    type="text" 
                    maxLength={8}
                    placeholder="12345678"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                    className="text-foreground text-center tracking-widest text-lg"
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? 'Verifying...' : 'Verify & Login'}
                </Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => setStep('request')}>
                  Back
                </Button>
              </form>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Not a host yet? <Link to="/signup" className="text-primary hover:underline font-medium">Become a Host</Link>
        </div>
      </div>
    </div>
  );
};

export default HostLoginPage;