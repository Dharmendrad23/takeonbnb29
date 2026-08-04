import pb from '@/lib/pocketbaseClient.js';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api.js';
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

  const isHost = currentUser?.role === "host" || currentUser?.role === "admin";
  const isAuthenticated = !!currentUser;

 useEffect(() => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token && user) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setCurrentUser(JSON.parse(user));
  }

  setInitialLoading(false);
}, []);

  const login = async (email, password) => {
  try {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    api.defaults.headers.common["Authorization"] =
      `Bearer ${data.token}`;

    setCurrentUser(data.user);

    return {
      record: data.user,
    };
  } catch (error) {
    console.error("Login error:", error);

    throw new Error(
      error?.response?.data?.message ||
      "Invalid email or password"
    );
  }
};

const signup = async (email, password, name, userType = "guest") => {
  try {
    const { data } = await api.post("/auth/register", {
      fullName: name,
      email,
      password,
      role: userType,
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    api.defaults.headers.common["Authorization"] =
      `Bearer ${data.token}`;

    setCurrentUser(data.user);

    return {
      record: data.user,
    };

  } catch (error) {
    console.error("Signup error:", error);

    throw new Error(
      error?.response?.data?.message ||
      "Failed to create account"
    );
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

    const response = await api.post('/notifications/send-sms', { recipientPhone, messageBody });

    return response.data;
  };

 const requestOTPCode = async (identifier) => {
  try {
    const { data } = await api.post("/auth/request-otp", {
      phone: identifier,
    });

    return data.otpId;

  } catch (error) {
    console.error("OTP request error:", error);

    throw new Error(
      error?.response?.data?.message ||
      "Failed to request OTP"
    );
  }
};

  const verifyOTPCode = async (otpId, code) => {
  try {
    const { data } = await api.post("/auth/verify-otp", {
      otpId,
      otpCode: code,
    });
console.log("OTP Response:", data);

return data;
  } catch (error) {
    console.error("OTP verify error:", error);

    throw new Error(
      error?.response?.data?.message ||
      "Invalid OTP"
    );
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

const signupWithOTP = async (
  phone,
  password,
  userType,
  name = '',
  email = '',
  otpId,
  otpCode
) => {
  try {

    if (!otpId || !otpCode) {
      throw new Error("OTP verification is required");
    }

    // Verify OTP from MongoDB API
    await verifyOTPCode(otpId, otpCode);

    // Create user in MongoDB
    const { data } = await api.post("/auth/register", {
      fullName: name,
      email,
      phone,
      password,
      role: userType,
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    api.defaults.headers.common["Authorization"] =
      `Bearer ${data.token}`;

    setCurrentUser(data.user);

    return data.user;

  } catch (error) {
    console.error("OTP signup error:", error);

    throw new Error(
      error?.response?.data?.message ||
      error.message ||
      "Signup failed"
    );
  }
}; const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  delete api.defaults.headers.common["Authorization"];

  setCurrentUser(null);

  toast.success("Logged out successfully");

  navigate("/");
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
