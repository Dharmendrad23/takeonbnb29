
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Wifi, Star, Home, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import PropertyCardSkeleton from './PropertyCardSkeleton.jsx';

const PropertyGrid = ({ properties = [], title, subtitle, isLoading = false, error = null }) => {
  const getSafeImage = (property) => {
  if (property?.coverImage) return property.coverImage;

  if (property?.image) return property.image;

  if (Array.isArray(property?.photos) && property.photos.length > 0) {
    return property.photos[0];
  }

  return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800";
};

  const renderContent = () => {
    if (error) {
      return (
        <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-destructive/5 rounded-2xl border border-destructive/10">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">Failed to load properties</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      );
    }

    if (isLoading) {
      return Array.from({ length: 8 }).map((_, idx) => (
        <PropertyCardSkeleton key={`skeleton-${idx}`} />
      ));
    }

    if (!properties || properties.length === 0) {
      return (
        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-card rounded-3xl border border-border shadow-sm">
          <Home className="w-16 h-16 text-muted-foreground opacity-50 mb-6" />
          <h3 className="text-2xl font-bold text-foreground mb-3">No properties found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            We couldn't find any properties matching this criteria. Try checking back later or exploring other destinations.
          </p>
        </div>
      );
    }

    return properties.map((property, idx) => {
      const name = property?.title || property?.name || 'Unnamed Property';
      const location = property?.location || 'Location not specified';
      const price = property?.pricePerNight || property?.price || 0;
      const rating = property?.rating || 0;
      const reviews = property?.totalBookings || property?.reviews || 0;
      const guests = property?.guestCapacity || property?.guests || 0;
      const imageUrl = getSafeImage(property);
      const isSample = property?.isSample === true;

      return (
        <motion.div
          key={property?.id || `fallback-${idx}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.05, duration: 0.4 }}
          className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative"
        >
          {isSample && (
            <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-md text-white px-3 py-1 text-xs font-bold rounded-full tracking-wide">
              SAMPLE PROPERTY
            </div>
          )}

          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {rating > 0 && (
              <div className="absolute top-3 right-3 bg-background/95 backdrop-blur px-2 py-1 rounded-lg text-sm font-semibold flex items-center gap-1 shadow-sm">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                {rating}
                {reviews > 0 && <span className="text-muted-foreground text-xs font-normal ml-1">({reviews})</span>}
              </div>
            )}
            
            {isSample && (
              <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                <Button asChild variant="secondary" className="font-bold">
                  <Link to="/host/register">Add Your Property</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="p-5 flex flex-col flex-grow">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="font-heading text-xl font-semibold line-clamp-1">{name}</h3>
            </div>
            
            <div className="flex items-center text-muted-foreground text-sm mb-4">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{location}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
              {guests > 0 && (
                <div className="flex items-center gap-1"><Users className="w-4 h-4" /> {guests} Guests</div>
              )}
              {guests > 0 && <div className="w-1 h-1 rounded-full bg-border"></div>}
              <div className="flex items-center gap-1"><Wifi className="w-4 h-4" /> WiFi</div>
            </div>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
              <div className="font-semibold text-lg">
                ₹{price.toLocaleString('en-IN')} <span className="text-sm font-normal text-muted-foreground">/ night</span>
              </div>
              {!isSample && (
                <Button asChild variant="outline" size="sm" className="rounded-full hover:bg-primary hover:text-white hover:border-primary transition-colors">
                  <Link to={`/property/${property?._id || property?.id}`}>View Details</Link>
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      );
    });
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="mb-12">
            {title && (
              <h2 className="relative inline-block pb-2 text-3xl md:text-4xl font-bold tracking-tight">
                {title}
                <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-primary rounded-full"></span>
              </h2>
            )}
            {subtitle && <p className="text-muted-foreground mt-4 text-lg">{subtitle}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {renderContent()}
        </div>
      </div>
    </section>
  );
};

export default PropertyGrid;
