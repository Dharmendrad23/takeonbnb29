
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  const isHost = currentUser?.userType === 'host';
  const isAuthenticated = !!currentUser;

  useEffect(() => {
    if (pb.authStore.isValid) {
      setCurrentUser(pb.authStore.model);
    }
    setInitialLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      setCurrentUser(authData.record);
      return authData;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid email or password');
    }
  };

  const signup = async (email, password, name, userType = 'guest') => {
    try {
      if (email) {
        const existing = await pb.collection('users').getList(1, 1, { filter: `email="${email}"`, $autoCancel: false });
        if (existing.totalItems > 0) throw new Error('Email already registered');
      }

      await pb.collection('users').create({
        email: email || undefined,
        name,
        userType,
        password,
        passwordConfirm: password,
      }, { $autoCancel: false });
      
      return await login(email, password);
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Failed to create account.');
    }
  };

  // --- OTP Flow ---
  const [pendingOtpId, setPendingOtpId] = useState(null);
  const [pendingOTPIdentifier, setPendingOTPIdentifier] = useState(null);
  const [pendingPhone, setPendingPhone] = useState(null);

  const sendOtpSms = async (phone, otpCode) => {
    const trimmedPhone = phone.trim();
    const digitsOnlyPhone = trimmedPhone.replace(/\D/g, '');
    const recipientPhone = trimmedPhone.startsWith('+') ? trimmedPhone : `+91${digitsOnlyPhone}`;
    const messageBody = `Your TakeOnBnB verification code is ${otpCode}. It expires in 5 minutes. Do not share this code with anyone.`;
    const apiHost = `${window.location.protocol}//${window.location.hostname}:3001`;

    const response = await fetch(`${apiHost}/notifications/send-sms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipientPhone, messageBody }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(`Unable to send OTP SMS: ${errorText || response.statusText}`);
    }

    return response.json();
  };

  const requestOTPCode = async (identifier) => {
    try {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60000).toISOString();
      const record = await pb.collection('otp_sessions').create({
        phone: identifier,
        otpCode,
        expiresAt,
        attempts: 0,
        isVerified: false
      }, { $autoCancel: false });

      await sendOtpSms(identifier, otpCode);
      return record.id;
    } catch (error) {
      console.error('OTP request error:', error);
      throw new Error(error.message || 'Failed to request OTP. Please try again.');
    }
  };

  const verifyOTPCode = async (otpId, code) => {
    try {
      const record = await pb.collection('otp_sessions').getOne(otpId, { $autoCancel: false });
      if (new Date() > new Date(record.expiresAt)) {
        throw new Error('OTP has expired. Please request a new one.');
      }
      if (record.otpCode !== code) {
        await pb.collection('otp_sessions').update(otpId, { attempts: record.attempts + 1 }, { $autoCancel: false });
        throw new Error('Invalid OTP code.');
      }
      await pb.collection('otp_sessions').update(otpId, { isVerified: true }, { $autoCancel: false });
      return record;
    } catch (error) {
      console.error('OTP verify error:', error);
      throw error;
    }
  };

  const requestOTP = async (identifier) => {
    return await requestOTPCode(identifier);
  };

  const requestPhoneOTP = async (phone) => {
    const otpId = await requestOTPCode(phone);
    setPendingOtpId(otpId);
    setPendingOTPIdentifier(phone);
    setPendingPhone(phone);
    return otpId;
  };

  const loginWithEmail = async (email, password) => {
    return await login(email, password);
  };

  const loginWithOTP = async (...args) => {
    if (args.length === 1) {
      const [identifier] = args;
      const otpId = await requestOTPCode(identifier);
      setPendingOtpId(otpId);
      setPendingOTPIdentifier(identifier);
      if (!identifier.includes('@')) setPendingPhone(identifier);
      return { otpId };
    }

    if (args.length === 3) {
      const [identifier, otpId, code] = args;
      await verifyOTPCode(otpId, code);
      const filter = identifier.includes('@') ? `email="${identifier}"` : `phone="${identifier}"`;
      const users = await pb.collection('users').getList(1, 1, { filter, $autoCancel: false });
      if (users.totalItems === 0) {
        throw new Error('No account found with this identifier.');
      }
      const user = users.items[0];
      pb.authStore.save('phone_auth_token_' + Date.now(), user);
      setCurrentUser(user);
      return user;
    }

    throw new Error('Invalid loginWithOTP call');
  };

  const loginWithOAuth2 = async (provider, options = {}) => {
    try {
      const authData = await pb.collection('users').authWithOAuth2({
        provider,
        scopes: options.scopes || ['email', 'name'],
        createData: options.createData || {},
      });
      setCurrentUser(authData.record);
      return authData;
    } catch (error) {
      console.error('OAuth login error:', error);
      throw new Error(error.message || 'OAuth login failed');
    }
  };

  const verifyOTP = async (otpIdOrCode, code) => {
    if (code === undefined) {
      if (!pendingOtpId || !pendingOTPIdentifier) {
        throw new Error('OTP session missing. Please request a new OTP.');
      }
      const record = await verifyOTPCode(pendingOtpId, otpIdOrCode);
      const filter = pendingOTPIdentifier.includes('@') ? `email="${pendingOTPIdentifier}"` : `phone="${pendingOTPIdentifier}"`;
      const users = await pb.collection('users').getList(1, 1, { filter, $autoCancel: false });
      if (users.totalItems === 0) {
        throw new Error('No account found with this identifier.');
      }
      const user = users.items[0];
      pb.authStore.save('phone_auth_token_' + Date.now(), user);
      setCurrentUser(user);
      return user;
    }
    return await verifyOTPCode(otpIdOrCode, code);
  };

  const authWithOTP = async (otpId, code) => {
    const record = await verifyOTPCode(otpId, code);
    const identifier = pendingOTPIdentifier || record.phone;
    const filter = identifier.includes('@') ? `email="${identifier}"` : `phone="${identifier}"`;
    const users = await pb.collection('users').getList(1, 1, { filter, $autoCancel: false });
    if (users.totalItems === 0) {
      throw new Error('No account found with this identifier.');
    }
    const user = users.items[0];
    pb.authStore.save('phone_auth_token_' + Date.now(), user);
    setCurrentUser(user);
    return { record: user };
  };

  const verifyPhoneOTP = async (otpId, code) => {
    const user = await loginWithOTP(pendingPhone || '', otpId, code);
    return { record: user };
  };

  const signupWithOTP = async (phone, password, userType, name = '', email = '', otpId, otpCode) => {
    try {
      if (!otpId || !otpCode) {
        throw new Error('OTP verification is required. Please request a new code.');
      }

      await verifyOTPCode(otpId, otpCode);

      const existing = await pb.collection('users').getList(1, 1, { filter: `phone="${phone}"`, $autoCancel: false });
      if (existing.totalItems > 0) throw new Error('Phone number already registered');

      const userData = {
        phone,
        password,
        passwordConfirm: password,
        userType,
        name
      };
      if (email) userData.email = email;

      const user = await pb.collection('users').create(userData, { $autoCancel: false });
      
      // Auto login after signup
      const authData = await pb.collection('users').authWithPassword(user.email || phone, password, { $autoCancel: false }).catch(async () => {
         // Fallback if authWithPassword requires email strictly
         pb.authStore.save('otp_temp_token', user);
         setCurrentUser(user);
         return { record: user };
      });
      
      if(authData?.record) setCurrentUser(authData.record);
      return user;
    } catch (error) {
      console.error('OTP signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isHost,
      isAuthenticated,
      login,
      signup,
      loginWithEmail,
      loginWithOAuth2,
      requestOTP,
      requestPhoneOTP,
      verifyOTP,
      authWithOTP,
      verifyPhoneOTP,
      signupWithOTP,
      loginWithOTP,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
