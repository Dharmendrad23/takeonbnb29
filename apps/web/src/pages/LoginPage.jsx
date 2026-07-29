
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Mail, Lock, Phone, Loader2, KeyRound, Apple } from 'lucide-react';

const LoginPage = () => {
  const [method, setMethod] = useState('email'); // 'email' or 'phone'
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  
  // Form values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otpId, setOtpId] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSuccess = (user) => {
    toast.success('Logged in successfully');
    const destination =
  location.state?.from?.pathname ||
  (
    user.role === 'admin'
      ? '/admin'
      : user.role === 'host'
      ? '/host/dashboard'
      : '/guest/dashboard'
  );
    navigate(destination, { replace: true });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    try {
      const authData = await login(email, password);
      handleSuccess(authData.record);
    } catch (err) {
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneOTPRequest = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      toast.error('Enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const id = await requestOTP(phone);
      setOtpId(id);
      setOtpStep(true);
      toast.success('OTP sent to your mobile');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    try {
      const authData = await loginWithOAuth2('apple');
      handleSuccess(authData.record);
    } catch (error) {
      console.error('Apple login failed:', error);
      toast.error(error.message || 'Apple login failed. Check backend OAuth configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneOTPVerify = async (e) => {
    e.preventDefault();
    if (otpCode.length !== 6) return;

    setLoading(true);
    try {
      handleSuccess(user);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12 pt-28">
      <Helmet><title>Log in | TakeOn BnB</title></Helmet>
      
      <Card className="w-full max-w-md shadow-xl border-border rounded-2xl overflow-hidden">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-extrabold tracking-tight text-foreground">Welcome Back</CardTitle>
          <CardDescription className="text-base text-muted-foreground mt-2">
            Log in to manage your bookings and properties
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {!otpStep ? (
            <Tabs value={method} onValueChange={setMethod} className="w-full">
              <TabsList className="grid w-full grid-cols-2 p-1 bg-muted rounded-xl h-12 mb-6">
                <TabsTrigger value="email" className="rounded-lg font-bold text-sm">Email & Password</TabsTrigger>
          
              </TabsList>

              <TabsContent value="email" className="animate-in fade-in">
                <div className="space-y-4 mb-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 text-base font-bold rounded-xl border-border text-foreground hover:bg-muted"
                    onClick={handleAppleLogin}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <Apple className="w-5 h-5 mr-2" />
                    )}
                    Continue with Apple
                  </Button>
                </div>
                <form onSubmit={handleEmailLogin} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-foreground">Password</label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-12"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-bold rounded-xl mt-4"
                    disabled={loading || !email || !password}
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone" className="animate-in fade-in">
                <form onSubmit={handlePhoneOTPRequest} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="pl-10 h-12"
                        placeholder="10-digit mobile number"
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-bold rounded-xl mt-4"
                    disabled={loading || phone.length !== 10}
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send OTP'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          ) : (
           <form onSubmit={handleEmailLogin} className="space-y-5">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">Verify Mobile</h3>
                <p className="text-muted-foreground text-sm mt-2">
                  Enter the 6-digit code sent to +91 {phone}
                </p>
              </div>

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

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-bold rounded-xl mt-4"
                disabled={loading || otpCode.length !== 6}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Log In'}
              </Button>
              
              <div className="text-center mt-2">
                <button type="button" onClick={() => setOtpStep(false)} className="text-xs text-muted-foreground hover:text-foreground underline">
                  Back
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/signup" className="text-primary hover:underline font-bold">
              Sign up today
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
