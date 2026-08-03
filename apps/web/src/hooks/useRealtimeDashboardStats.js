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
        const [props, bookings, users] = await Promise.all([
          pb.collection('properties').getList(1, 1, { $autoCancel: false }),
          pb.collection('bookings').getFullList({ $autoCancel: false }),
          pb.collection('users').getList(1, 1, { $autoCancel: false })
        ]);

        const revenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
        const active = bookings.filter(b => b.status === 'confirmed' || b.status === 'checked-in').length;
        const pending = bookings.filter(b => b.status === 'pending').length;

        setStats({
          totalProperties: props.totalItems,
          totalBookings: bookings.length,
          totalUsers: users.totalItems,
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

    pb.collection('properties').subscribe('*', fetchStats);
    pb.collection('bookings').subscribe('*', fetchStats);
    pb.collection('users').subscribe('*', fetchStats);

    return () => {
      pb.collection('properties').unsubscribe('*');
      pb.collection('bookings').unsubscribe('*');
      pb.collection('users').unsubscribe('*');
    };
  }, []);

  return { stats, isLoading };
};