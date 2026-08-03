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
        const parsedOptions = JSON.parse(optionsString);
        
        let defaultFilter = '';
        if (currentUser.userType === 'guest') {
          defaultFilter = `guestId="${currentUser.id}"`;
        } else if (currentUser.userType === 'host') {
          defaultFilter = `propertyId.hostId="${currentUser.id}"`;
        }
        
        const finalFilter = parsedOptions.filter 
          ? `(${defaultFilter}) && (${parsedOptions.filter})` 
          : defaultFilter;

        const records = await pb.collection('bookings').getFullList({
          filter: finalFilter,
          sort: parsedOptions.sort || '-created',
          expand: parsedOptions.expand || 'propertyId,guestId',
          $autoCancel: false
        });
        
        setBookings(records);
      } catch (err) {
        console.error('Failed to fetch realtime bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

    // Subscribe to any changes in the bookings collection
    pb.collection('bookings').subscribe('*', (e) => {
      // Re-fetch to ensure sorting and filtering remains perfectly accurate
      // Performance is fine for typical user-scoped lists
      fetchBookings();
    });

    return () => pb.collection('bookings').unsubscribe('*');
  }, [currentUser, optionsString]);

  return { bookings, loading };
};