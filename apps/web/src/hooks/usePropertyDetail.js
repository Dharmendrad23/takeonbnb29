import { useState, useEffect } from 'react';
import api from '@/lib/api.js';
import { toast } from 'sonner';

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
        const { data } = await api.get(`/properties/${propertyId}`);
        const propRecord = data.property || data;
        setProperty(propRecord);

        // Fetch similar properties
        try {
          const { data: simData } = await api.get(
            `/properties?propertyType=${propRecord.propertyType}&limit=5`
          );
          setSimilarProperties(
            (simData.properties || []).filter(
              p => (p._id || p.id) !== propertyId
            ).slice(0, 4)
          );
        } catch (sErr) {
          console.warn('Could not fetch similar properties:', sErr);
        }
      } catch (err) {
        console.error('Error fetching property details:', err);
        if (err?.response?.status === 404) {
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
    toast.info('Wishlist feature coming soon');
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
      const { data } = await api.post('/bookings', {
        propertyId: propertyId,
        checkInDate: bookingData.checkIn,
        checkOutDate: bookingData.checkOut,
        guestCount: bookingData.guests,
        totalPrice: bookingData.totalPrice,
        guestName: bookingData.name,
        guestPhone: bookingData.phone,
        guestEmail: bookingData.email,
        status: 'pending',
      });
      toast.success('Booking inquiry sent successfully! We will contact you shortly.');
      return data;
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