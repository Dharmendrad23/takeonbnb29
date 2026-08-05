import { useState, useEffect } from 'react';
import api from '@/lib/api.js';
import { toast } from 'sonner';

const FAVORITES_STORAGE_KEY = 'takeonbnb-favorites';

const getStoredFavorites = () => {
  try {
    const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const persistFavorites = (favorites) => {
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
};

export const usePropertyDetail = (propertyId) => {
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(false);

  const currentUserId = (() => {
    try {
      const u = window.localStorage.getItem('authUser');
      return u ? JSON.parse(u).id || JSON.parse(u)._id : null;
    } catch { return null; }
  })();

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!propertyId) {
        setLoading(false);
        setError('No property ID provided');
        setNotFound(true);
        return;
      }
      
      setLoading(true);
      setError(null);
      setNotFound(false);
      
      try {
        const propRes = await api.get(`/api/properties/${propertyId}`);
        const propRecord = propRes.data;
        setProperty(propRecord);

        // Fetch reviews
        try {
          const reviewRes = await api.get(`/api/reviews?propertyId=${propertyId}`);
          const reviewItems = Array.isArray(reviewRes.data) ? reviewRes.data : reviewRes.data?.items || [];
          setReviews(reviewItems);
        } catch {
          // reviews optional
        }

        // Fetch similar properties
        try {
          const allPropsRes = await api.get('/api/properties');
          const all = Array.isArray(allPropsRes.data) ? allPropsRes.data : allPropsRes.data?.items || [];
          const similar = all
            .filter(p => String(p._id) !== String(propertyId) && p.propertyType === propRecord.propertyType)
            .slice(0, 5);
          setSimilarProperties(similar);
        } catch {
          // similar optional
        }

        // Check wishlist from localStorage
        const favs = getStoredFavorites();
        setIsWishlisted(favs.some(f => f.propertyId === propertyId));
      } catch (err) {
        console.error('Error fetching property details:', err);
        if (err.response?.status === 404) {
          setNotFound(true);
          setError('Property not found. It may have been removed or the link is invalid.');
        } else {
          setError('An error occurred while loading the property details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [propertyId]);

  const toggleWishlist = async () => {
    if (!currentUserId) {
      toast.error('Please log in to save to wishlist');
      return;
    }

    try {
      const favs = getStoredFavorites();
      if (isWishlisted) {
        const updated = favs.filter(f => f.propertyId !== propertyId);
        persistFavorites(updated);
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        favs.push({ id: `fav-${Date.now()}`, propertyId, guestId: currentUserId, createdAt: new Date().toISOString() });
        persistFavorites(favs);
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch (err) {
      console.error('Wishlist error:', err);
      toast.error('Failed to update wishlist');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const submitBooking = async (bookingData) => {
    try {
      const response = await api.post('/api/bookings', {
        propertyId,
        guestId: currentUserId,
        checkInDate: bookingData.checkIn,
        checkOutDate: bookingData.checkOut,
        guestCount: bookingData.guests,
        totalPrice: bookingData.totalPrice,
        specialRequests: `Name: ${bookingData.name}, Phone: ${bookingData.phone}, Email: ${bookingData.email}.`,
        status: 'pending',
      });
      
      toast.success('Booking inquiry sent successfully! We will contact you shortly.');
      return response.data;
    } catch (err) {
      console.error('Booking error:', err);
      toast.error('Failed to send booking inquiry. Please try again.');
      throw err;
    }
  };

  return {
    property,
    reviews,
    similarProperties,
    loading,
    error,
    notFound,
    isWishlisted,
    toggleWishlist,
    handleShare,
    submitBooking,
    isGalleryOpen,
    setIsGalleryOpen,
    isAmenitiesOpen,
    setIsAmenitiesOpen
  };
};

export const usePropertyDetail = (propertyId) => {
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(false);

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!propertyId) {
        setLoading(false);
        setError('No property ID provided');
        setNotFound(true);
        return;
      }
      
      setLoading(true);
      setError(null);
      setNotFound(false);
      
      try {
        // Fetch property with relations
        const propRecord = await pb.collection('properties').getOne(propertyId, {
          expand: 'amenities,hostId',
          $autoCancel: false,
        });
        
        setProperty(propRecord);

        // Fetch reviews safely
        try {
          const reviewRecords = await pb.collection('reviews').getList(1, 10, {
            filter: `propertyId = "${propertyId}"`,
            expand: 'guestId',
            sort: '-created',
            $autoCancel: false,
          });
          setReviews(reviewRecords.items);
        } catch (rErr) {
          console.warn('Could not fetch reviews:', rErr);
        }

        // Fetch similar properties safely
        try {
          const similarRecords = await pb.collection('properties').getList(1, 5, {
            filter: `id != "${propertyId}" && propertyType = "${propRecord.propertyType}"`,
            sort: '-rating',
            $autoCancel: false,
          });
          setSimilarProperties(similarRecords.items);
        } catch (sErr) {
          console.warn('Could not fetch similar properties:', sErr);
        }

        // Check wishlist status if logged in
        if (pb.authStore.isValid) {
          try {
            const favs = await pb.collection('favorites').getList(1, 1, {
              filter: `propertyId = "${propertyId}" && guestId = "${pb.authStore.model.id}"`,
              $autoCancel: false,
            });
            setIsWishlisted(favs.items.length > 0);
          } catch (fErr) {
            console.warn('Could not fetch favorites:', fErr);
          }
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
        // Handle 404 gracefully without crashing
        if (error.status === 404) {
          setNotFound(true);
          setError('Property not found. It may have been removed or the link is invalid.');
        } else {
          setError('An error occurred while loading the property details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [propertyId]);

  const toggleWishlist = async () => {
    if (!pb.authStore.isValid) {
      toast.error('Please log in to save to wishlist');
      return;
    }

    try {
      if (isWishlisted) {
        const favs = await pb.collection('favorites').getList(1, 1, {
          filter: `propertyId = "${propertyId}" && guestId = "${pb.authStore.model.id}"`,
          $autoCancel: false,
        });
        if (favs.items.length > 0) {
          await pb.collection('favorites').delete(favs.items[0].id, { $autoCancel: false });
        }
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await pb.collection('favorites').create({
          propertyId: propertyId,
          guestId: pb.authStore.model.id,
        }, { $autoCancel: false });
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const submitBooking = async (bookingData) => {
    try {
      const record = await pb.collection('bookings').create({
        propertyId: propertyId,
        guestId: pb.authStore.model?.id || null, 
        checkInDate: bookingData.checkIn,
        checkOutDate: bookingData.checkOut,
        guestCount: bookingData.guests,
        totalPrice: bookingData.totalPrice,
        specialRequests: `Name: ${bookingData.name}, Phone: ${bookingData.phone}, Email: ${bookingData.email}. Inquiry sent to takeonbnb@gmail.com`,
        status: 'pending'
      }, { $autoCancel: false });
      
      toast.success('Booking inquiry sent successfully! We will contact you shortly.');
      return record;
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to send booking inquiry. Please try again.');
      throw error;
    }
  };

  return {
    property,
    reviews,
    similarProperties,
    loading,
    error,
    notFound,
    isWishlisted,
    toggleWishlist,
    handleShare,
    submitBooking,
    isGalleryOpen,
    setIsGalleryOpen,
    isAmenitiesOpen,
    setIsAmenitiesOpen
  };
};