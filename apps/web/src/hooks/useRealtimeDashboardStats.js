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
        const { data } = await api.get('/properties');
        setStats(prev => ({
          ...prev,
          totalProperties: data.total || (data.properties || []).length,
        }));
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading };
};