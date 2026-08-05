import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
};

// Determine API host - try multiple strategies to ensure we get the correct URL
function getApiHost() {
  // Strategy 1: Check environment variable (set at build time by Vite)
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  if (VITE_API_URL && VITE_API_URL !== 'undefined') {
    console.log('[AdminAuth] Using VITE_API_URL from environment:', VITE_API_URL);
    return VITE_API_URL;
  }

  // Strategy 2: For production on Netlify, use relative path (Netlify will proxy to Render)
  if (typeof window !== 'undefined' && window.location.hostname === 'takeonbnb.com') {
    console.log('[AdminAuth] Detected production domain takeonbnb.com, using Netlify proxy');
    return ''; // Empty string = use relative paths like /api/auth/login
  }

  // Strategy 3: For development/local, use absolute URL
  console.log('[AdminAuth] Using direct Render backend URL');
  return 'https://takeonbnb29.onrender.com';
}

const API_HOST = getApiHost();
console.log('[AdminAuth] Final API_HOST:', API_HOST);

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const saved = localStorage.getItem('adminUser');
    if (token && saved) {
      try {
        const user = JSON.parse(saved);
        if (user.role === 'admin') {
          setAdminUser(user);
        } else {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
        }
      } catch {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // For relative paths, construct full URL; for absolute URLs, use as-is
      const baseUrl = API_HOST ? API_HOST : window.location.origin;
      const loginUrl = `${baseUrl}/api/auth/login`;
      
      console.log('[AdminAuth] Starting login request...');
      console.log('[AdminAuth] URL:', loginUrl);
      console.log('[AdminAuth] Email:', email);
      console.log('[AdminAuth] Password length:', password?.length || 0);

      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies for auth
      });

      console.log('[AdminAuth] Response status:', response.status);
      console.log('[AdminAuth] Response headers:', {
        contentType: response.headers.get('content-type'),
      });

      const data = await response.json();
      console.log('[AdminAuth] Response JSON:', { success: data.success, message: data.message, hasToken: !!data.token, hasUser: !!data.user });

      if (!response.ok) {
        console.error('[AdminAuth] Login failed:', data.message);
        throw new Error(data.message || 'Invalid credentials');
      }

      const { token, user } = data;

      if (user.role !== 'admin') {
        console.error('[AdminAuth] User role is not admin:', user.role);
        throw new Error('Access denied. Admin account required.');
      }

      console.log('[AdminAuth] Login successful, saving tokens...');
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(user));
      setAdminUser(user);
      toast.success(`Welcome back, ${user.name || 'Admin'}`);
      console.log('[AdminAuth] Login completed successfully');
      return { token, user };
    } catch (err) {
      console.error('[AdminAuth] Login error:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
      });
      throw err;
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdminUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AdminAuthContext.Provider value={{
      adminUser,
      loading,
      login,
      logoutAdmin,
      isAuthenticated: !!adminUser,
      isAdmin: adminUser?.role === 'admin',
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
