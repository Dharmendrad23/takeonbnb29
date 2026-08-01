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
    api.defaults.headers.common["Authorization"] = "Bearer " + token;
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

    api.defaults.headers.common["Authorization"] = "Bearer " + data.token;

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

    api.defaults.headers.common["Authorization"] = "Bearer " + data.token;

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
  const storeAuthSession = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    api.defaults.headers.common["Authorization"] = "Bearer " + token;
    setCurrentUser(user);
  };

  const requestOTPCode = async (identifier) => {
    if (!identifier?.includes("@")) {
      throw new Error("Phone OTP login is not currently available.");
    }

    try {
      const normalizedEmail = identifier.trim().toLowerCase();
      await api.post("/auth/request-email-otp", {
        email: normalizedEmail,
      });

      setPendingOtpId(normalizedEmail);
      setPendingOTPIdentifier(normalizedEmail);
      return normalizedEmail;
    } catch (error) {
      console.error("OTP request error:", error);

      throw new Error(
        error?.response?.data?.message ||
        "Failed to request OTP"
      );
    }
  };

  const verifyOTPCode = async (otpId, code) => {
    if (!otpId?.includes("@")) {
      throw new Error("Phone OTP login is not currently available.");
    }

    try {
      const { data } = await api.post("/auth/verify-email-otp", {
        email: otpId,
        otpCode: code,
      });

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

  const loginWithEmail = async (email, password) => {
    return await login(email, password);
  };

  const loginWithOTP = async (...args) => {
    if (args.length === 1) {
      const [identifier] = args;
      const otpId = await requestOTPCode(identifier);
      return { otpId };
    }

    if (args.length === 3) {
      const [identifier, otpId, code] = args;
      const data = await verifyOTPCode(otpId || identifier, code);
      storeAuthSession(data.token, data.user);
      return data.user;
    }

    throw new Error('Invalid loginWithOTP call');
  };

  const verifyOTP = async (otpIdOrCode, code) => {
    if (code === undefined) {
      if (!pendingOtpId || !pendingOTPIdentifier) {
        throw new Error('OTP session missing. Please request a new OTP.');
      }
      const data = await verifyOTPCode(pendingOtpId, otpIdOrCode);
      storeAuthSession(data.token, data.user);
      return data.user;
    }
    const data = await verifyOTPCode(otpIdOrCode, code);
    if (data?.token && data?.user) {
      storeAuthSession(data.token, data.user);
      return { record: data.user };
    }
    return data;
  };

  const authWithOTP = async (otpId, code) => {
    const data = await verifyOTPCode(otpId, code);
    storeAuthSession(data.token, data.user);
    return { record: data.user };
  };
const logout = () => {
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
      requestOTP,
      verifyOTP,
      authWithOTP,
      loginWithOTP,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
