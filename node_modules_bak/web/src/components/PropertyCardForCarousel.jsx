import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, AlertCircle } from 'lucide-react';
import PropertyImageCarousel from '@/components/property/PropertyImageCarousel.jsx';
import { Button } from '@/components/ui/button';

const PropertyCardForCarousel = ({ property }) => {
  const navigate = useNavigate();

  // Graceful handling of missing or invalid property data
  if (!property || !property.id) {
    console.error('PropertyCardForCarousel: Invalid property data received', property);
    return (
      <div className="flex flex-col bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm h-full min-h-[420px] items-center justify-center p-6 text-center">
        <AlertCircle className="w-8 h-8 text-destructive/50 mb-2" />
        <span className="text-sm text-muted-foreground">Property details unavailable</span>
      </div>
    );
  }

  const handleBookNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/property/${property.id}`);
  };

  return (
    <div className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <PropertyImageCarousel property={property} />
        
        {typeof property.rating === 'number' && (
          <div className="absolute top-3 right-3 z-10 bg-background/90 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-primary text-primary" />
            <span className="text-xs font-semibold">{property.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {property.title || 'Untitled Property'}
          </h3>
        </div>

        <div className="flex items-center text-muted-foreground text-sm mb-3">
          <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{property.location || 'Location unavailable'}</span>
        </div>

        <div className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
          {property.description || 'No description available.'}
        </div>

        <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Price</span>
            <div className="flex items-baseline gap-1">
              {property.pricePerNight ? (
                <>
                  <span className="text-lg font-bold text-foreground">₹{property.pricePerNight.toLocaleString('en-IN')}</span>
                  <span className="text-sm text-muted-foreground">/night</span>
                </>
              ) : (
                <span className="text-sm font-medium text-muted-foreground">Price unavailable</span>
              )}
            </div>
          </div>
          
          <Button 
            onClick={handleBookNow}
            disabled={!property.pricePerNight}
            className="bg-[#FF6B35] hover:bg-[#E55A24] text-white font-semibold rounded-full px-5 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm disabled:opacity-50 disabled:pointer-events-none"
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCardForCarousel;