import { useState, useEffect } from 'react';
import { listBookings, listProperties, listUsers } from '@/lib/dataApi.js';

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
        const [props, bookings, users] = await Promise.all([
          listProperties(),
          listBookings(),
          listUsers()
        ]);

        const revenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
        const active = bookings.filter(b => b.status === 'confirmed' || b.status === 'checked-in').length;
        const pending = bookings.filter(b => b.status === 'pending').length;

        setStats({
          totalProperties: props.length,
          totalBookings: bookings.length,
          totalUsers: users.length,
          totalRevenue: revenue,
          activeBookings: active,
          pendingBookings: pending
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    const intervalId = window.setInterval(fetchStats, 30000);
    return () => window.clearInterval(intervalId);
  }, []);

  return { stats, isLoading };
};