import { useState, useEffect } from 'react';
import api from '@/lib/api.js';

export const useRealtimeDashboardStats = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activeBookings: 0,
    pendingBookings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, propsRes, usersRes] = await Promise.all([
          api.get('/api/admin/dashboard/stats'),
          api.get('/api/properties'),
          api.get('/api/users'),
        ]);

        const s = statsRes.data;
        const totalProperties = Array.isArray(propsRes.data)
          ? propsRes.data.length
          : (propsRes.data?.totalItems ?? 0);
        const totalUsers = usersRes.data?.totalItems ?? 0;

        setStats({
          totalProperties,
          totalBookings: s.totalBookings ?? 0,
          totalUsers,
          totalRevenue: s.totalRevenue ?? 0,
          activeBookings: s.confirmedBookings ?? 0,
          pendingBookings: s.pendingBookings ?? 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();

    // Poll every 30 seconds to stay reasonably fresh without realtime subscriptions
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return { stats, isLoading };
};