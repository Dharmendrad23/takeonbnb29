import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { buildApiUrl } from "@/lib/api.js";

const AdminAuthContext = createContext(null);

const normalizeAdminUser = (user) => {
  if (!user) return null;

  return {
    ...user,
    id: user.id || user._id,
  };
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error(
      "useAdminAuth must be used within AdminAuthProvider"
    );
  }

  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore admin session
  useEffect(() => {
    try {
      const token = localStorage.getItem("adminToken");
      const savedUser = localStorage.getItem("adminUser");

      if (token && savedUser) {
        const user = normalizeAdminUser(JSON.parse(savedUser));

        if (user?.role === "admin") {
          setAdminUser(user);
        } else {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
        }
      }
    } catch (error) {
      console.error("Admin session restore error:", error);

      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const loginUrl = buildApiUrl("/api/auth/login");

    console.log("ADMIN LOGIN URL:", loginUrl);

    try {
      const response = await fetch(loginUrl, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const contentType = response.headers.get("content-type");

      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        console.error("NON JSON RESPONSE:", text);

        throw new Error(
          "Server returned an invalid response. Check API URL."
        );
      }

      console.log("ADMIN LOGIN RESPONSE:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
          data.error ||
          "Invalid email or password"
        );
      }

      const token = data.token;
      const user = normalizeAdminUser(data.user);

      if (!token) {
        throw new Error("Login token not received from server");
      }

      if (!user) {
        throw new Error("User information not received from server");
      }

      if (user.role !== "admin") {
        throw new Error(
          `Access denied. Your role is "${user.role}", admin role required.`
        );
      }

      // Save session
      localStorage.setItem("adminToken", token);
      localStorage.setItem(
        "adminUser",
        JSON.stringify(user)
      );

      setAdminUser(user);

      toast.success(
        `Welcome back, ${user.name || "Admin"}`
      );

      return {
        token,
        user,
      };

    } catch (error) {
      console.error("ADMIN LOGIN ERROR:", error);

      throw new Error(
        error.message || "Unable to login"
      );
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    setAdminUser(null);

    toast.success("Logged out successfully");
  };

  const value = {
    adminUser,
    loading,
    login,
    logoutAdmin,

    isAuthenticated: !!adminUser,

    isAdmin:
      adminUser?.role === "admin",
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};