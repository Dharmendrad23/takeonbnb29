import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { buildApiUrl } from '@/lib/api.js';

const AuthContext = createContext();

const normalizeUser = (user) => {
  if (!user) return null;

  const role =
    user.role ||
    (
      user.userType === 'host'
        ? 'host'
        : user.userType === 'admin'
          ? 'admin'
          : 'guest'
    );

  return {
    ...user,

    id: user.id || user._id,

    role,

    userType: user.userType || role,
  };
};

const toFormBody = (data) => {
  const params = new URLSearchParams();

  Object.entries(data).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null
    ) {
      params.append(
        key,
        String(value)
      );
    }
  });

  return params.toString();
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return context;
};

export const AuthProvider = ({
  children,
}) => {
  const [
    currentUser,
    setCurrentUser,
  ] = useState(null);

  const [
    initialLoading,
    setInitialLoading,
  ] = useState(true);

  const [
    pendingOtpId,
    setPendingOtpId,
  ] = useState(null);

  const [
    pendingOtpEmail,
    setPendingOtpEmail,
  ] = useState(null);

  const navigate = useNavigate();

  const isHost =
    currentUser?.role === 'host';

  const isAuthenticated =
    !!currentUser;

  /* =========================================
     RESTORE SESSION
  ========================================= */

  useEffect(() => {
    const token =
      localStorage.getItem(
        'authToken'
      );

    const savedUser =
      localStorage.getItem(
        'authUser'
      );

    if (
      token &&
      savedUser
    ) {
      try {
        const user =
          JSON.parse(savedUser);

        setCurrentUser(
          normalizeUser(user)
        );

      } catch (error) {
        console.error(
          'Session restore error:',
          error
        );

        localStorage.removeItem(
          'authToken'
        );

        localStorage.removeItem(
          'authUser'
        );
      }
    }

    setInitialLoading(false);

  }, []);

  /* =========================================
     SAVE AUTH SESSION
  ========================================= */

  const saveAuthSession = (
    token,
    user
  ) => {
    if (
      !token ||
      !user
    ) {
      throw new Error(
        'Authentication response is incomplete.'
      );
    }

    const normalizedUser =
      normalizeUser(user);

    localStorage.setItem(
      'authToken',
      token
    );

    localStorage.setItem(
      'authUser',
      JSON.stringify(
        normalizedUser
      )
    );

    setCurrentUser(
      normalizedUser
    );

    return normalizedUser;
  };

  /* =========================================
     UPDATE CURRENT USER
     REAL TIME PROFILE UPDATE
  ========================================= */

  const updateCurrentUser = (
    updatedData
  ) => {
    setCurrentUser(
      (previousUser) => {
        const updatedUser =
          normalizeUser({
            ...previousUser,
            ...updatedData,

            id:
              updatedData?.id ||
              updatedData?._id ||
              previousUser?.id,
          });

        localStorage.setItem(
          'authUser',
          JSON.stringify(
            updatedUser
          )
        );

        return updatedUser;
      }
    );
  };

  /* =========================================
     LOGIN
  ========================================= */

  const login = async (
    email,
    password
  ) => {
    try {
      const normalizedEmail =
        String(email || '')
          .trim()
          .toLowerCase();

      const response =
        await fetch(
          buildApiUrl(
            '/api/auth/login'
          ),
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({
              email:
                normalizedEmail,

              password,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          data.error ||
          'Invalid email or password'
        );
      }

      const normalizedUser =
        saveAuthSession(
          data.token,
          data.user
        );

      return {
        record:
          normalizedUser,

        token:
          data.token,
      };

    } catch (error) {
      console.error(
        'Login error:',
        error
      );

      throw new Error(
        error.message ||
        'Invalid email or password'
      );
    }
  };

  /* =========================================
     SIGNUP
     DIRECT ACCOUNT + AUTO LOGIN
  ========================================= */

  const signup = async (
    emailOrData,
    passwordArg,
    nameArg,
    roleArg = "guest"
  ) => {
    try {
      const isObjectPayload =
        emailOrData &&
        typeof emailOrData === "object";

      const payload = isObjectPayload
        ? emailOrData
        : {
            email: emailOrData,
            password: passwordArg,
            name: nameArg,
            role: roleArg,
          };

      const normalizedEmail = String(
        payload.email || ""
      )
        .trim()
        .toLowerCase();

      const normalizedName = String(
        payload.name || ""
      ).trim();

      const normalizedPhone = String(
        payload.phone || ""
      ).trim();

      const password = String(
        payload.password || ""
      );

      const role = payload.role || "guest";

      if (!normalizedName) {
        throw new Error("Full name is required");
      }

      if (!normalizedEmail) {
        throw new Error("Email is required");
      }

      if (!password) {
        throw new Error("Password is required");
      }

      const response = await fetch(
        buildApiUrl("/api/auth/register"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
            phone: normalizedPhone,
            password,
            name: normalizedName,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          data.error ||
          "Failed to create account."
        );
      }

      if (!data.token || !data.user) {
        throw new Error(
          "Account created but authentication response is incomplete."
        );
      }

      const normalizedUser =
        saveAuthSession(
          data.token,
          data.user
        );

      return {
        record: normalizedUser,
        token: data.token,
      };
    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

      throw new Error(
        error.message ||
        "Failed to create account."
      );
    }
  };
  /* =========================================
     LOGIN WITH EMAIL
  ========================================= */

  const loginWithEmail =
    async (
      email,
      password
    ) => {
      return await login(
        email,
        password
      );
    };

  /* =========================================
     LOGIN OTP
     OLD FLOW
  ========================================= */

  const requestOTP = async (
    email
  ) => {
    try {
      const normalizedEmail =
        String(email || '')
          .trim()
          .toLowerCase();

      const response =
        await fetch(
          buildApiUrl(
            '/api/otp/request-login'
          ),
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/x-www-form-urlencoded',
            },

            body:
              toFormBody({
                email:
                  normalizedEmail,
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          'Failed to send OTP'
        );
      }

      setPendingOtpId(
        data.otpId
      );

      setPendingOtpEmail(
        normalizedEmail
      );

      return data.otpId;

    } catch (error) {
      console.error(
        'OTP request error:',
        error
      );

      throw new Error(
        error.message ||
        'Failed to request OTP.'
      );
    }
  };

  const verifyOTP = async (
    code,
    otpIdOverride
  ) => {
    try {
      const otpId =
        otpIdOverride ||
        pendingOtpId;

      if (!otpId) {
        throw new Error(
          'OTP session missing.'
        );
      }

      const response =
        await fetch(
          buildApiUrl(
            '/api/otp/verify-login'
          ),
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/x-www-form-urlencoded',
            },

            body:
              toFormBody({
                otpId,
                code,
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          'Invalid OTP code'
        );
      }

      const normalizedUser =
        saveAuthSession(
          data.token,
          data.user
        );

      setPendingOtpId(null);

      setPendingOtpEmail(null);

      return {
        record:
          normalizedUser,

        token:
          data.token,
      };

    } catch (error) {
      console.error(
        'OTP verify error:',
        error
      );

      throw error;
    }
  };

  const loginWithOTP =
    requestOTP;

  const authWithOTP =
    async (
      otpId,
      code
    ) => {
      return await verifyOTP(
        code,
        otpId
      );
    };

  /* =========================================
     OLD SIGNUP OTP
     KEPT FOR COMPATIBILITY
  ========================================= */

  const requestSignupOTP =
    async (
      email
    ) => {
      try {
        const normalizedEmail =
          String(email || '')
            .trim()
            .toLowerCase();

        const response =
          await fetch(
            buildApiUrl(
              '/api/otp/request-signup'
            ),
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/x-www-form-urlencoded',
              },

              body:
                toFormBody({
                  email:
                    normalizedEmail,
                }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            'Failed to send OTP'
          );
        }

        setPendingOtpId(
          data.otpId
        );

        setPendingOtpEmail(
          normalizedEmail
        );

        return data.otpId;

      } catch (error) {
        throw new Error(
          error.message ||
          'Failed to request OTP.'
        );
      }
    };

  const signupWithOTP =
    async (
      email,
      password,
      role,
      name,
      otpId,
      otpCode
    ) => {
      try {
        const response =
          await fetch(
            buildApiUrl(
              '/api/otp/verify-signup'
            ),
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/x-www-form-urlencoded',
              },

              body:
                toFormBody({
                  otpId:
                    otpId ||
                    pendingOtpId,

                  code:
                    otpCode,

                  name,

                  password,

                  role:
                    role ||
                    'guest',
                }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            'Failed to verify OTP'
          );
        }

        const normalizedUser =
          saveAuthSession(
            data.token,
            data.user
          );

        setPendingOtpId(null);

        setPendingOtpEmail(null);

        return normalizedUser;

      } catch (error) {
        console.error(
          'OTP signup error:',
          error
        );

        throw error;
      }
    };

  /* =========================================
     NOT IMPLEMENTED
  ========================================= */

  const notImplemented =
    (featureName) =>
    async () => {
      throw new Error(
        `${featureName} abhi available nahi hai.`
      );
    };

  const requestPhoneOTP = async (phone) => {
  const normalizedPhone = String(phone || "").trim();

  if (!normalizedPhone) {
    throw new Error("Phone number is required");
  }

  const response = await fetch(buildApiUrl("/api/otp/request-login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone: normalizedPhone,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to send OTP");
  }

  return data;
};

const verifyPhoneOTP = async (phone, code) => {
  const normalizedPhone = String(phone || "").trim();
  const normalizedCode = String(code || "").trim();

  if (!normalizedPhone || !normalizedCode) {
    throw new Error("Phone number and OTP are required");
  }

  const response = await fetch(buildApiUrl("/api/otp/verify-login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone: normalizedPhone,
      code: normalizedCode,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "OTP verification failed");
  }

  if (data.token && data.user) {
    saveAuthSession(data.token, data.user);
  }

  return data;
};

  const loginWithOAuth2 =
    notImplemented(
      'Social login (Google/Facebook)'
    );

  /* =========================================
     LOGOUT
  ========================================= */

  const logout = () => {
    localStorage.removeItem(
      'authToken'
    );

    localStorage.removeItem(
      'authUser'
    );

    setCurrentUser(null);

    toast.success(
      'Logged out successfully'
    );

    navigate('/');
  };

  /* =========================================
     INITIAL LOADING
  ========================================= */

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* =========================================
     AUTH PROVIDER
  ========================================= */

  return (
  <AuthContext.Provider
  value={{
    currentUser,
    isHost,
    isAuthenticated,

    login,
    signup,
    loginWithEmail,

    loginWithOAuth2,

    requestOTP,
    verifyOTP,

    requestSignupOTP,
    signupWithOTP,

    requestPhoneOTP,
    verifyPhoneOTP,

    loginWithOTP,
    authWithOTP,

    updateCurrentUser,

    logout,
  }}
>
  {children}
</AuthContext.Provider>
  );
};
