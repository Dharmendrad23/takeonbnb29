import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api.js";
import { toast } from "sonner";

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const user = localStorage.getItem("adminUser");

    if (token && user) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setAdminUser(JSON.parse(user));
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      if (data.user.role !== "admin") {
        throw new Error("Access denied");
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));

      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      setAdminUser(data.user);

      toast.success(`Welcome back, ${data.user.fullName}`);

      return data;
    } catch (error) {
      console.error("Admin login failed:", error);

      throw new Error(
        error?.response?.data?.message || "Invalid email or password"
      );
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    delete api.defaults.headers.common["Authorization"];

    setAdminUser(null);

    toast.success("Successfully logged out");
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        loading,
        login,
        logoutAdmin,
        isAuthenticated: !!adminUser,
        isAdmin: adminUser?.role === "admin",
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};