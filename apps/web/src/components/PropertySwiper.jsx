import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, MapPin, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrencyINR } from '@/lib/bookingUtils.js';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { getEntityId, getPropertyImage } from '@/lib/propertyMappers.js';

const PropertySwiper = ({ properties = [], loading = false }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' }, 
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );
  
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (loading) {
    return (
      <div className="w-full flex gap-6 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-none w-full md:w-1/2 lg:w-1/3">
            <Skeleton className="w-full aspect-[4/3] rounded-[2rem]" />
          </div>
        ))}
      </div>
    );
  }

  if (!properties || properties.length === 0) return null;

  return (
    <div className="relative group">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {properties.map((property) => (
            <div key={getEntityId(property)} className="embla__slide">
              <motion.div 
                whileHover={{ y: -5 }}
                className="relative bg-card rounded-[2rem] overflow-hidden border border-border shadow-sm hover:shadow-xl transition-shadow h-full flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-muted w-full shrink-0">
                  {getPropertyImage(property) ? (
                    <img 
                     src={getPropertyImage(property)} 
                      alt={property.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
                  )}
                  
                  {/* Overlay Badges */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center text-foreground hover:text-primary hover:bg-background transition-colors shadow-sm">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  {property.rating && (
                    <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="font-bold text-sm text-foreground">{property.rating}</span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-xl text-foreground line-clamp-1 mb-2">
                      {property.title}
                    </h3>
                    <p className="text-muted-foreground flex items-center font-medium mb-4">
                      <MapPin className="w-4 h-4 mr-1.5 shrink-0 text-primary" />
                      <span className="truncate">{property.location}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Price</span>
                      <p className="font-extrabold text-xl text-foreground">
                        {formatCurrencyINR(property.pricePerNight)}<span className="text-sm font-medium text-muted-foreground">/nt</span>
                      </p>
                    </div>
                    <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl px-6 h-12 shadow-sm hover:shadow-brand transition-all">
                      <Link to={`/property/${getEntityId(property)}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button 
        variant="outline" 
        size="icon" 
        onClick={scrollPrev} 
        disabled={!canScrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/90 backdrop-blur border-border shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden md:flex"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={scrollNext} 
        disabled={!canScrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/90 backdrop-blur border-border shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden md:flex"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default PropertySwiper;