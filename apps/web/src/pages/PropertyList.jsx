import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Star,
  MapPin,
  BedDouble,
  Bath,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavorites } from '@/hooks/useFavorites.js';
import { Button } from '@/components/ui/button';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80';

const PropertyCard = memo(({ property, isHostView = false }) => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();

  // MongoDB uses _id, while some old frontend code uses id.
  const propertyId = property?._id || property?.id;

  const isFavorite = propertyId
    ? favorites.includes(propertyId)
    : false;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!propertyId) {
      console.error('[PROPERTY CARD] Missing property ID:', property);
      return;
    }

    toggleFavorite(propertyId);
  };

  const handleCardClick = () => {
    if (!propertyId) {
      console.error(
        '[PROPERTY CARD] Cannot open property: missing ID',
        property
      );
      return;
    }

    if (isHostView) {
      navigate(`/host/edit-property/${propertyId}`);
    } else {
      navigate(`/property/${propertyId}`);
    }
  };

  const handleBookNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!propertyId) {
      console.error(
        '[PROPERTY CARD] Cannot book property: missing ID',
        property
      );
      return;
    }

    navigate(`/property/${propertyId}?book=true`);
  };

  const formatPrice = (price) => {
    const numericPrice = Number(price || 0);

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(numericPrice);
  };

  /*
   * MongoDB properties can contain:
   *
   * photos: [
   *   "https://example.com/image.jpg"
   * ]
   *
   * or relative paths.
   *
   * We DO NOT use PocketBase here.
   */
  const getImageUrl = () => {
    if (property?.coverImage) {
      return property.coverImage;
    }

    if (
      Array.isArray(property?.photos) &&
      property.photos.length > 0
    ) {
      const firstPhoto = property.photos[0];

      if (typeof firstPhoto === 'string') {
        return firstPhoto;
      }

      if (
        firstPhoto &&
        typeof firstPhoto === 'object'
      ) {
        return (
          firstPhoto.url ||
          firstPhoto.src ||
          firstPhoto.image ||
          FALLBACK_IMAGE
        );
      }
    }

    return FALLBACK_IMAGE;
  };

  const imageUrl = getImageUrl();

  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: 20,
        },
        show: {
          opacity: 1,
          y: 0,
        },
      }}
      className="group flex flex-col h-full w-full bg-card rounded-[1.5rem] border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* IMAGE */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={property?.title || 'Property'}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            if (e.currentTarget.src !== FALLBACK_IMAGE) {
              e.currentTarget.src = FALLBACK_IMAGE;
            }
          }}
        />

        {/* Wishlist */}
        {!isHostView && (
          <button
            type="button"
            className="absolute top-4 right-4 p-2.5 rounded-full bg-background/80 backdrop-blur-md text-foreground z-10 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-sm"
            aria-label="Save to wishlist"
            onClick={handleFavoriteClick}
          >
            <Heart
              className={`w-5 h-5 transition-colors duration-300 ${
                isFavorite
                  ? 'fill-primary text-primary'
                  : 'fill-transparent text-foreground hover:text-primary'
              }`}
            />
          </button>
        )}

        {/* Rating */}
        {!isHostView &&
          property?.rating !== undefined &&
          property?.rating !== null && (
            <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm z-10">
              <Star className="w-4 h-4 fill-primary text-primary" />

              <span className="font-bold text-sm text-foreground">
                {Number(property.rating).toFixed(1)}
              </span>
            </div>
          )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-col p-5 flex-1">
        <div className="mb-2">
          <h3 className="text-lg font-bold text-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {property?.title || 'Untitled Property'}
          </h3>

          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1.5 truncate">
            <MapPin className="w-4 h-4 shrink-0 text-primary" />

            <span className="truncate font-medium">
              {property?.location || 'Location unavailable'}
            </span>
          </p>
        </div>

        {/* PROPERTY DETAILS */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-3 mb-5">
          <span className="flex items-center gap-1.5 font-medium">
            <BedDouble className="w-4 h-4" />
            {property?.bedrooms || 0} Beds
          </span>

          <span className="flex items-center gap-1.5 font-medium">
            <Bath className="w-4 h-4" />
            {property?.bathrooms || 0} Baths
          </span>

          <span className="flex items-center gap-1.5 font-medium">
            <Users className="w-4 h-4" />
            {property?.guestCapacity || 0} Guests
          </span>
        </div>

        {/* PRICE + BOOK */}
        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
              Price
            </span>

            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-foreground tracking-tight">
                {formatPrice(property?.pricePerNight)}
              </span>

              <span className="text-sm text-muted-foreground font-medium">
                / night
              </span>
            </div>
          </div>

          {!isHostView && (
            <Button
              type="button"
              className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-brand transition-all hover:-translate-y-0.5"
              onClick={handleBookNow}
            >
              Book Now
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
});

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;