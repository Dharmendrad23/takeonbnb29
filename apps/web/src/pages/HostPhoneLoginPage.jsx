import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Building2, Smartphone, ArrowRight, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HostPhoneLoginPage = () => {
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState('request'); // 'request' | 'verify'
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { requestPhoneOTP, verifyPhoneOTP, otpId, pendingPhone } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsSubmitting(true);
    try {
      const fullPhone = `${countryCode}${phone}`;
      await requestPhoneOTP(fullPhone);
      setStep('verify');
      toast.success('OTP sent successfully!');
    } catch (error) {
      toast.error('Failed to send OTP. Please verify the number and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    setIsSubmitting(true);
    try {
      const fullPhone = pendingPhone || `${countryCode}${phone}`;
      await requestPhoneOTP(fullPhone);
      toast.success('A new OTP has been sent.');
      setOtpCode('');
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otpCode.length !== 8) {
      toast.error('Please enter the full 8-digit code');
      return;
    }

    setIsSubmitting(true);
    try {
      const authData = await verifyPhoneOTP(otpId, otpCode);
      if (authData?.record?.userType !== 'host') {
        toast.error('Logged in successfully, but this account is not registered as a host.');
      } else {
        toast.success('Welcome back!');
        navigate('/host-dashboard');
      }
    } catch (error) {
      toast.error('Invalid or expired OTP code. Please try again.');
      setOtpCode(''); // clear code to easily re-type
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4 py-20 relative overflow-hidden">
      {/* Refined subtle background textures */}
      <div className="absolute inset-0 pointer-events-none z-0 mix-blend-multiply opacity-50 dark:opacity-20" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-card rounded-2xl shadow-xl p-8 border border-border/60 relative z-10"
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5 shadow-sm border border-primary/20">
            <Building2 className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Host Portal</h1>
          <p className="text-muted-foreground text-sm mt-2 font-medium">Log in securely to manage your properties</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'request' ? (
            <motion.form 
              key="request"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSendOTP} 
              className="space-y-6"
            >
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-foreground font-semibold">Phone Number</Label>
                <div className="flex gap-3">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-[110px] bg-background border-border text-foreground font-medium rounded-xl h-12 shadow-sm">
                      <SelectValue placeholder="Code" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+91">🇮🇳 +91</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                      <SelectItem value="+61">🇦🇺 +61</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative flex-1">
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="pl-11 text-foreground bg-background border-border rounded-xl h-12 font-medium text-lg tracking-wide shadow-sm"
                      required
                    />
                  </div>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 active:scale-[0.98] text-primary-foreground h-12 rounded-xl font-bold text-base transition-all duration-200 shadow-sm" 
                disabled={isSubmitting || phone.length < 10}
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending code to your phone...</>
                ) : (
                  <><ArrowRight className="w-5 h-5 mr-2" /> Send OTP</>
                )}
              </Button>
            </motion.form>
          ) : (
            <motion.form 
              key="verify"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleVerifyOTP} 
              className="space-y-6"
            >
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/30 flex items-start gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium leading-relaxed">
                  We've sent an 8-digit verification code to <span className="font-bold">{pendingPhone || `${countryCode}${phone}`}</span>
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="otpCode" className="text-foreground font-semibold flex justify-between items-center">
                  <span>Enter the 8-digit code sent to your phone</span>
                  <button type="button" onClick={() => setStep('request')} className="text-primary hover:underline text-xs font-bold transition-all">
                    Change Number
                  </button>
                </Label>
                <Input 
                  id="otpCode" 
                  type="text" 
                  maxLength={8}
                  placeholder="••••••••"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  required
                  className="text-foreground text-center tracking-[0.5em] text-2xl h-14 bg-background border-border rounded-xl font-bold shadow-sm placeholder:tracking-normal"
                />
              </div>
              
              <div className="space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 active:scale-[0.98] text-primary-foreground h-12 rounded-xl font-bold text-base transition-all duration-200 shadow-sm" 
                  disabled={isSubmitting || otpCode.length !== 8}
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Verifying code...</>
                  ) : (
                    'Verify & Login'
                  )}
                </Button>
                
                <div className="text-center pt-2">
                  <button 
                    type="button" 
                    onClick={handleResendOTP} 
                    disabled={isSubmitting} 
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-primary font-medium transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Didn't receive the code? Resend OTP
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default HostPhoneLoginPage;