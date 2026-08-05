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
        const response = await api.get('/api/bookings');
        let records = Array.isArray(response.data) ? response.data : response.data?.items || [];

        // Filter client-side by user role
        const role = currentUser.role || currentUser.userType;
        if (role === 'guest') {
          records = records.filter(b => {
            const guestId = b.guestId?._id || b.guestId;
            return String(guestId) === String(currentUser.id);
          });
        } else if (role === 'host') {
          records = records.filter(b => {
            const hostId = b.propertyId?.hostId;
            return String(hostId) === String(currentUser.id);
          });
        }

        setBookings(records);
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