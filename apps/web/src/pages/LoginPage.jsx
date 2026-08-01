
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
import { Mail, Lock, Loader2, KeyRound } from 'lucide-react';

const LoginPage = () => {
  const { login, requestOTP, verifyOTP } = useAuth();
  const [method, setMethod] = useState('password');
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
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

  const handleEmailOTPRequest = async (e) => {
    e.preventDefault();
    if (!otpEmail) {
      toast.error('Enter your registered email address');
      return;
    }

    setLoading(true);
    try {
      const id = await requestOTP(otpEmail);
      setOtpId(id);
      setOtpStep(true);
      toast.success('OTP sent to your email');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailOTPVerify = async (e) => {
    e.preventDefault();
    if (otpCode.length !== 6) return;

    setLoading(true);
    try {
      const authData = await verifyOTP(otpId, otpCode);
      handleSuccess(authData.record);
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
            <Tabs
              value={method}
              onValueChange={(value) => {
                setMethod(value);
                setOtpEmail('');
                setOtpCode('');
                setOtpId(null);
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 p-1 bg-muted rounded-xl h-12 mb-6">
                <TabsTrigger value="password" className="rounded-lg font-bold text-sm">Email & Password</TabsTrigger>
                <TabsTrigger value="otp" className="rounded-lg font-bold text-sm">Email OTP</TabsTrigger>
              </TabsList>

              <TabsContent value="password" className="animate-in fade-in">
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

             <TabsContent value="otp" className="animate-in fade-in">
               <form onSubmit={handleEmailOTPRequest} className="space-y-5">
                  <div className="space-y-2">
                   <label className="text-sm font-bold text-foreground">Registered Email Address</label>
                    <div className="relative">
                     <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                      <Input
                       type="email"
                       value={otpEmail}
                       onChange={(e) => setOtpEmail(e.target.value)}
                        className="pl-10 h-12"
                       placeholder="Enter your registered email"
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-bold rounded-xl mt-4"
                   disabled={loading || !otpEmail}
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send OTP'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          ) : (
           <form onSubmit={handleEmailOTPVerify} className="space-y-5">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-8 h-8" />
                </div>
               <h3 className="text-xl font-bold">Verify Email</h3>
                <p className="text-muted-foreground text-sm mt-2">
                 Enter the 6-digit code sent to {otpEmail || otpId}
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
                <button
                  type="button"
                  onClick={() => {
                    setOtpStep(false);
                    setOtpCode('');
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
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
