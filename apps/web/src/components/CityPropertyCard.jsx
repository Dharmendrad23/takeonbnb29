import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api.js';
import pb from '@/lib/pocketbaseClient';

const CityPropertyCard = memo(({ property }) => {
  const imageUrl = property.coverImage 
    ? pb.files.getUrl(property, property.coverImage)
    : (property.photos && property.photos.length > 0) 
      ? pb.files.getUrl(property, property.photos[0]) 
      : null;

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const amenitiesCount = property.amenities?.length || 0;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      className="group flex flex-col h-full w-full bg-card rounded-2xl border border-border overflow-hidden hover-card-effect select-none"
    >
      <Link 
        to={`/property/${property.id}`} 
        className="flex flex-col h-full cursor-pointer outline-none"
        draggable={false}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={property.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
              <span className="text-sm font-medium">No image</span>
            </div>
          )}
          
          <div className="absolute bottom-3 left-3 z-10 flex gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold shadow-sm bg-background/90 backdrop-blur-md text-foreground">
              {property.propertyType || 'Property'}
            </span>
          </div>
        </div>

        <div className="flex flex-col p-4 flex-1">
          <div className="flex justify-between items-start mb-2 gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                {property.title}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 shrink-0"/> <span className="truncate">{property.location}</span>
              </p>
            </div>
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 px-2 py-1 rounded-md text-sm font-bold shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{property.rating ? property.rating.toFixed(1) : 'New'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{amenitiesCount} {amenitiesCount === 1 ? 'Amenity' : 'Amenities'}</span>
          </div>

          <div className="mt-auto pt-3 border-t border-border flex items-end justify-between">
            <div className="text-xl font-bold text-foreground truncate">
              {formatINR(property.pricePerNight)}
              <span className="text-sm text-muted-foreground font-normal ml-1">/ night</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

CityPropertyCard.displayName = 'CityPropertyCard';
export default CityPropertyCard;