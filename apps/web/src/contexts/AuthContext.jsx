import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { buildApiUrl } from '@/lib/api.js';

const AuthContext = createContext();

const normalizeUser = (user) => {
  if (!user) return null;

  const role = user.role ||
    (user.userType === 'host' ? 'host' : user.userType === 'admin' ? 'admin' : user.userType === 'guest' ? 'guest' : 'guest');

  return {
    ...user,
    role,
  };
};

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

  const isHost = currentUser?.role === 'host';
  const isAuthenticated = !!currentUser;

  // App load hote hi localStorage se session restore karo
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('authUser');
    if (token && savedUser) {
      try {
        setCurrentUser(normalizeUser(JSON.parse(savedUser)));
      } catch {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
    setInitialLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const normalizedEmail = String(email || '').trim().toLowerCase();
      const response = await fetch(buildApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }

      const { token, user } = data;
      const normalizedUser = normalizeUser(user);

      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(normalizedUser));
      setCurrentUser(normalizedUser);

      return { record: normalizedUser, token };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Invalid email or password');
    }
  };

  const signup = async (email, password, name, role = 'guest') => {
    try {
      const normalizedEmail = String(email || '').trim().toLowerCase();
      const response = await fetch(buildApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password, name, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create account.');
      }

      // Register ke baad login call karke token/session set karte hain
      return await login(normalizedEmail, password);
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Failed to create account.');
    }
  };

  const loginWithEmail = async (email, password) => {
    return await login(email, password);
  };

  // --- OTP Flow (Email only) ---
  const [pendingOtpId, setPendingOtpId] = useState(null);
  const [pendingOtpEmail, setPendingOtpEmail] = useState(null);

  const requestOTP = async (email) => {
    try {
      const normalizedEmail = String(email || '').trim().toLowerCase();
      const response = await fetch(buildApiUrl('/api/otp/request-login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send OTP');

      setPendingOtpId(data.otpId);
      setPendingOtpEmail(normalizedEmail);
      return data.otpId;
    } catch (error) {
      console.error('OTP request error:', error);
      throw new Error(error.message || 'Failed to request OTP. Please try again.');
    }
  };

  const verifyOTP = async (code, otpIdOverride) => {
    try {
      const otpId = otpIdOverride || pendingOtpId;
      if (!otpId) throw new Error('OTP session missing. Please request a new OTP.');

      const response = await fetch(buildApiUrl('/api/otp/verify-login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otpId, code }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Invalid OTP code');

      const normalizedUser = normalizeUser(data.user);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authUser', JSON.stringify(normalizedUser));
      setCurrentUser(normalizedUser);
      setPendingOtpId(null);
      setPendingOtpEmail(null);

      return { record: normalizedUser, token: data.token };
    } catch (error) {
      console.error('OTP verify error:', error);
      throw error;
    }
  };

  const loginWithOTP = requestOTP;
  const authWithOTP = async (otpId, code) => verifyOTP(code, otpId);

  const requestSignupOTP = async (email) => {
    try {
      const normalizedEmail = String(email || '').trim().toLowerCase();
      const response = await fetch(buildApiUrl('/api/otp/request-signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send OTP');

      setPendingOtpId(data.otpId);
      setPendingOtpEmail(normalizedEmail);
      return data.otpId;
    } catch (error) {
      console.error('Signup OTP request error:', error);
      throw new Error(error.message || 'Failed to request OTP. Please try again.');
    }
  };

  const signupWithOTP = async (email, password, role, name, otpId, otpCode) => {
    try {
      const response = await fetch(buildApiUrl('/api/otp/verify-signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otpId: otpId || pendingOtpId,
          code: otpCode,
          name,
          password,
          role,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to verify OTP');

      const normalizedUser = normalizeUser(data.user);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authUser', JSON.stringify(normalizedUser));
      setCurrentUser(normalizedUser);
      setPendingOtpId(null);
      setPendingOtpEmail(null);

      return normalizedUser;
    } catch (error) {
      console.error('OTP signup error:', error);
      throw error;
    }
  };

  const notImplemented = (featureName) => async () => {
    throw new Error(`${featureName} abhi available nahi hai.`);
  };
  const requestPhoneOTP = notImplemented('Phone OTP');
  const verifyPhoneOTP = notImplemented('Phone OTP verification');
  const loginWithOAuth2 = notImplemented('Social login (Google/Facebook)');

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
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
      requestSignupOTP,
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