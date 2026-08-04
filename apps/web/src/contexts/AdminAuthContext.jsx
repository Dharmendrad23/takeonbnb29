import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { loginUser } from '@/lib/dataApi.js';

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = window.localStorage.getItem('authUser');

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser?.role === 'admin' || parsedUser?.role === 'manager') {
          setAdminUser(parsedUser);
        }
      } catch (error) {
        console.error('Failed to restore admin session:', error);
        window.localStorage.removeItem('authToken');
        window.localStorage.removeItem('authUser');
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await loginUser({ email, password });
      if (authData?.user?.role !== 'admin' && authData?.user?.role !== 'manager') {
        throw new Error('Admin access required');
      }

      window.localStorage.setItem('authToken', authData.token);
      window.localStorage.setItem('authUser', JSON.stringify(authData.user));
      setAdminUser(authData.user);
      toast.success(`Welcome back, ${authData.user.name || 'Admin'}`);
      return { record: authData.user, token: authData.token };
    } catch (error) {
      console.error("Admin login failed:", error);
      throw error;
    }
  };

  const logoutAdmin = () => {
    window.localStorage.removeItem('authToken');
    window.localStorage.removeItem('authUser');
    setAdminUser(null);
    toast.success("Successfully logged out");
  };

  return (
    <AdminAuthContext.Provider value={{
      adminUser,
      loading,
      login,
      logoutAdmin,
      isAuthenticated: !!adminUser,
      isAdmin: adminUser?.role === 'admin' || adminUser?.role === 'manager'
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};