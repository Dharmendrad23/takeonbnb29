import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api.js';
import { toast } from 'sonner';

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (pb.authStore.isValid && pb.authStore.model?.collectionName === 'admin_users') {
        try {
          const authData = await pb.collection('admin_users').authRefresh({ $autoCancel: false });
          setAdminUser(authData.record);
        } catch (error) {
          console.error("Admin session expired:", error);
          pb.authStore.clear();
          setAdminUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await pb.collection('admin_users').authWithPassword(email, password, { $autoCancel: false });
      setAdminUser(authData.record);
      toast.success(`Welcome back, ${authData.record.name || 'Admin'}`);
      return authData;
    } catch (error) {
      console.error("Admin login failed:", error);
      throw error;
    }
  };

  const logoutAdmin = () => {
    pb.authStore.clear();
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