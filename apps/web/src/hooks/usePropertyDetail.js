import { useState, useEffect } from 'react';
import { createBooking, createFavorite, deleteFavorite, getProperty, listFavorites, listProperties, listReviews } from '@/lib/dataApi.js';
import { getEntityId } from '@/lib/propertyMappers.js';
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
        const propRecord = await getProperty(propertyId);
        
        setProperty(propRecord);

        try {
          const reviewRecords = await listReviews({ propertyId });
          setReviews(reviewRecords.slice(0, 10));
        } catch (rErr) {
          console.warn('Could not fetch reviews:', rErr);
        }

        try {
          const similarRecords = await listProperties();
          setSimilarProperties(
            similarRecords
              .filter((candidate) => getEntityId(candidate) !== propertyId)
              .filter((candidate) => candidate.propertyType === propRecord.propertyType)
              .slice(0, 5)
          );
        } catch (sErr) {
          console.warn('Could not fetch similar properties:', sErr);
        }

        const savedUser = window.localStorage.getItem('authUser');
        if (savedUser) {
          try {
            const currentUser = JSON.parse(savedUser);
            const favorites = await listFavorites({ propertyId, guestId: currentUser.id });
            setIsWishlisted(favorites.length > 0);
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
    const savedUser = window.localStorage.getItem('authUser');
    if (!savedUser) {
      toast.error('Please log in to save to wishlist');
      return;
    }

    try {
      const currentUser = JSON.parse(savedUser);
      if (isWishlisted) {
        const favorites = await listFavorites({ propertyId, guestId: currentUser.id });
        if (favorites.length > 0) {
          await deleteFavorite(getEntityId(favorites[0]));
        }
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await createFavorite({
          propertyId: propertyId,
          guestId: currentUser.id,
        });
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
      const currentUser = window.localStorage.getItem('authUser');
      const user = currentUser ? JSON.parse(currentUser) : null;
      const record = await createBooking({
        propertyId: propertyId,
        guestId: user?.id || null, 
        checkInDate: bookingData.checkIn,
        checkOutDate: bookingData.checkOut,
        guestCount: bookingData.guests,
        totalPrice: bookingData.totalPrice,
        specialRequests: `Name: ${bookingData.name}, Phone: ${bookingData.phone}, Email: ${bookingData.email}. Inquiry sent to takeonbnb@gmail.com`,
        status: 'pending'
      });
      
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