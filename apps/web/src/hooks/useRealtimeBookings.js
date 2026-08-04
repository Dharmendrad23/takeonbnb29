import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { listBookings } from '@/lib/dataApi.js';

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
        const parsedOptions = JSON.parse(optionsString);
        const records = await listBookings();
        let filteredRecords = records;

        if (currentUser.userType === 'guest' || currentUser.role === 'guest') {
          filteredRecords = filteredRecords.filter(
            (booking) => String(booking.guestId || booking.guest?._id || booking.guest?.id || '') === currentUser.id
          );
        } else if (currentUser.userType === 'host' || currentUser.role === 'host') {
          filteredRecords = filteredRecords.filter((booking) => {
            const property = booking.property || booking.propertyId;
            return String(property?.hostId || property?.host?._id || property?.host?.id || '') === currentUser.id;
          });
        }

        if (parsedOptions.status) {
          filteredRecords = filteredRecords.filter((booking) => booking.status === parsedOptions.status);
        }

        setBookings(filteredRecords);
      } catch (err) {
        console.error('Failed to fetch realtime bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
    const intervalId = window.setInterval(fetchBookings, 15000);
    return () => window.clearInterval(intervalId);
  }, [currentUser, optionsString]);

  return { bookings, loading };
};