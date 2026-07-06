
import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';

export const useHostDashboardData = () => {
  const { currentUser } = useAuth();
  const hostId = currentUser?.id;

  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Derived metrics
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

        const [propsRes, booksRes, revsRes] = await Promise.all([
          pb.collection('properties').getFullList({ filter: `hostId="${hostId}"`, $autoCancel: false }),
          pb.collection('bookings').getFullList({ expand: 'propertyId,guestId', filter: `propertyId.hostId="${hostId}"`, sort: '-created', $autoCancel: false }),
          pb.collection('reviews').getFullList({ expand: 'guestId,propertyId', filter: `propertyId.hostId="${hostId}"`, sort: '-created', $autoCancel: false })
        ]);

        if (isMounted) {
          setProperties(propsRes);
          setBookings(booksRes);
          setReviews(revsRes);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
        console.error("Dashboard fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    // Subscriptions
    pb.collection('bookings').subscribe('*', async (e) => {
      if (e.action === 'create') {
        const expandedRecord = await pb.collection('bookings').getOne(e.record.id, { expand: 'propertyId,guestId', $autoCancel: false });
        if (expandedRecord.expand?.propertyId?.hostId === hostId) {
          setBookings(prev => [expandedRecord, ...prev]);
          toast.success(`New booking from ${expandedRecord.guestFullName || 'a guest'}!`, {
            action: { label: 'View', onClick: () => console.log('View booking', e.record.id) }
          });
        }
      } else if (e.action === 'update') {
        const expandedRecord = await pb.collection('bookings').getOne(e.record.id, { expand: 'propertyId,guestId', $autoCancel: false });
        if (expandedRecord.expand?.propertyId?.hostId === hostId) {
          setBookings(prev => prev.map(b => b.id === e.record.id ? expandedRecord : b));
        }
      }
    }, { $autoCancel: false }).catch(console.error);

    pb.collection('reviews').subscribe('*', async (e) => {
      if (e.action === 'create') {
        const expandedRecord = await pb.collection('reviews').getOne(e.record.id, { expand: 'guestId,propertyId', $autoCancel: false });
        if (expandedRecord.expand?.propertyId?.hostId === hostId) {
          setReviews(prev => [expandedRecord, ...prev]);
          toast.success(`New ${expandedRecord.rating}-star review received!`);
        }
      }
    }, { $autoCancel: false }).catch(console.error);

    return () => {
      isMounted = false;
      pb.collection('bookings').unsubscribe('*');
      pb.collection('reviews').unsubscribe('*');
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
