
import { useState, useEffect } from 'react';
import api from '@/lib/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

export const useHostDashboardData = () => {
  const { currentUser } = useAuth();
  const hostId = currentUser?._id || currentUser?.id;

  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const earnings = bookings
    .filter(b => b.status === 'completed' || b.status === 'checked-in')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const totalBookings = bookings.length;
  
  const occupancyRate = properties.length > 0 
    ? Math.min(100, Math.round((bookings.filter(b => b.status === 'confirmed' || b.status === 'checked-in').length / properties.length) * 100))
    : 0;

  useEffect(() => {
    if (!hostId) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/properties?hostId=${hostId}`);
        if (isMounted) {
          setProperties(data.properties || []);
          setBookings([]);
          setReviews([]);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
        console.error("Dashboard fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [hostId]);

  return {
    properties,
    bookings,
    reviews,
    metrics: {
      earnings,
      averageRating,
      totalBookings,
      occupancyRate
    },
    loading,
    error
  };
};
