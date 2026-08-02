import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import PropertyCard from './PropertyCard.jsx';

const PropertyCarousel = ({ properties = [], loading = false }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' }, 
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );
  
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (loading) {
    return (
      <div className="w-full flex gap-6 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-none w-full md:w-1/2 lg:w-1/4">
            <Skeleton className="w-full aspect-[4/3] rounded-[1.5rem]" />
            <Skeleton className="w-2/3 h-6 mt-4" />
            <Skeleton className="w-1/2 h-4 mt-2" />
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
            <div key={property.id} className="embla__slide py-4">
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button 
        variant="outline" 
        size="icon" 
        onClick={scrollPrev} 
        disabled={!canScrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-background border-border shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-0 hidden md:flex z-10 hover:scale-105 hover:bg-background"
      >
        <ChevronLeft className="w-6 h-6 text-foreground" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={scrollNext} 
        disabled={!canScrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-background border-border shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-0 hidden md:flex z-10 hover:scale-105 hover:bg-background"
      >
        <ChevronRight className="w-6 h-6 text-foreground" />
      </Button>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === selectedIndex ? 'bg-primary w-8' : 'bg-primary/20 hover:bg-primary/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PropertyCarousel;