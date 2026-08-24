import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api.js";

export const useRealtimeDashboardStats = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalHosts: 0,
    totalGuests: 0,
    totalAdmins: 0,
    pendingProperties: 0,
    approvedProperties: 0,
    rejectedProperties: 0,
    totalRevenue: 0,
    activeBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    occupancyRate: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get("/admin/dashboard/stats");

      const data = response.data || {};

      setStats({
        totalProperties:
          data.properties?.total ??
          data.totalProperties ??
          0,

        totalBookings:
          data.bookings?.total ??
          data.totalBookings ??
          0,

        totalUsers:
          data.users?.total ??
          data.totalUsers ??
          0,

        totalHosts:
          data.users?.hosts ??
          0,

        totalGuests:
          data.users?.guests ??
          0,

        totalAdmins:
          data.users?.admins ??
          0,

        pendingProperties:
          data.properties?.pending ??
          0,

        approvedProperties:
          data.properties?.approved ??
          0,

        rejectedProperties:
          data.properties?.rejected ??
          0,

        totalRevenue:
          data.revenue?.total ??
          data.totalRevenue ??
          0,

        activeBookings:
          data.confirmedBookings ??
          data.bookings?.confirmed ??
          0,

        pendingBookings:
          data.pendingBookings ??
          data.bookings?.pending ??
          0,

        confirmedBookings:
          data.confirmedBookings ??
          data.bookings?.confirmed ??
          0,

        occupancyRate:
          data.occupancyRate ??
          0,
      });

    } catch (error) {
      console.error(
        "[Admin Dashboard] Failed to load stats:",
        error?.response?.data || error.message
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    // Refresh every 10 seconds so admin data stays current.
    const interval = setInterval(fetchStats, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    refreshStats: fetchStats,
  };
};
