import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, MapPin, BedDouble, Bath, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavorites } from '@/hooks/useFavorites.js';
import { Button } from '@/components/ui/button';

const PropertyCard = memo(({ property, isHostView = false }) => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();
  const propertyId = property._id || property.id;

  const isFavorite = favorites.includes(propertyId);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(propertyId);
  };

  const handleCardClick = () => {
    navigate(
  isHostView
    ? `/host/edit-property/${propertyId}`
    : `/property/${propertyId}`
);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

const imageUrl =
  property.coverImage ||
  property.image ||
  (Array.isArray(property.photos) && property.photos.length
    ? property.photos[0]
    : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80");
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      className="group flex flex-col h-full w-full bg-card rounded-[1.5rem] border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick}
    >
      {(() => {
        const handleBookNow = (e) => {
          e.preventDefault();
          e.stopPropagation();
          navigate(`/property/${propertyId}?book=true`);
        };
        return null;
      })()}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img 
          src={imageUrl} 
          alt={property.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Wishlist Button */}
        {!isHostView && (
          <button 
            className="absolute top-4 right-4 p-2.5 rounded-full bg-background/80 backdrop-blur-md text-foreground z-10 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-sm"
            aria-label="Save to wishlist"
            onClick={handleFavoriteClick}
          >
            <Heart 
              className={`w-5 h-5 transition-colors duration-300 ${
                isFavorite ? 'fill-primary text-primary' : 'fill-transparent text-foreground hover:text-primary'
              }`} 
            />
          </button>
        )}

        {/* Rating Badge */}
        {!isHostView && property.rating && (
          <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm z-10">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="font-bold text-sm text-foreground">{property.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col p-5 flex-1">
        <div className="mb-2">
          <h3 className="text-lg font-bold text-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1.5 truncate">
            <MapPin className="w-4 h-4 shrink-0 text-primary" /> 
            <span className="truncate font-medium">{property.location}</span>
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-3 mb-5">
          <span className="flex items-center gap-1.5 font-medium"><BedDouble className="w-4 h-4"/> {property.bedrooms} Beds</span>
          <span className="flex items-center gap-1.5 font-medium"><Bath className="w-4 h-4"/> {property.bathrooms} Baths</span>
          <span className="flex items-center gap-1.5 font-medium"><Users className="w-4 h-4"/> {property.guestCapacity} Guests</span>
        </div>

        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-foreground tracking-tight">
                {formatPrice(property.pricePerNight)}
              </span>
              <span className="text-sm text-muted-foreground font-medium">/ night</span>
            </div>
          </div>

          {!isHostView && (
            <Button 
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