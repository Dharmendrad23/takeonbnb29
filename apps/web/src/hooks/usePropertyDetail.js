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