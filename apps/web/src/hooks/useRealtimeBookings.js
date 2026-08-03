import { useState, useEffect } from 'react';
import api from '@/lib/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

export const useRealtimeBookings = (options = {}) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const optionsString = JSON.stringify(options);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      setBookings([]);
      return;
    }

    const fetchBookings = async () => {
      try {
        const userId = currentUser._id || currentUser.id;
        const role = currentUser.role || currentUser.userType;
        let url = '/bookings';
        if (role === 'guest') url += `?guestId=${userId}`;
        else if (role === 'host') url += `?hostId=${userId}`;

        const { data } = await api.get(url);
        setBookings(data.bookings || data.items || []);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser, optionsString]);

  return { bookings, loading };
};