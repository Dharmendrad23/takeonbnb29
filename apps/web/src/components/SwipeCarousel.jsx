import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils.js';
import { Button } from '@/components/ui/button';

const SwipeCarousel = ({ items, renderItem, className }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false, 
    align: 'start',
    skipSnaps: false,
    dragFree: true
  });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onInit = useCallback((emblaApi) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  if (!items || items.length === 0) return null;

  return (
    <div className={cn("relative group w-full", className)}>
      <div className="overflow-hidden carousel-grab-cursor" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-4 sm:-ml-6 py-4">
          {items.map((item, index) => (
            <div 
              key={index} 
              className="pl-4 sm:pl-6 min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%]"
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Arrows */}
      <Button
        variant="secondary"
        size="icon"
        className={cn(
          "absolute left-0 -ml-5 top-1/2 -translate-y-1/2 rounded-full w-12 h-12 shadow-lg bg-background/95 backdrop-blur border border-border text-foreground hover:bg-background z-10 carousel-nav-btn opacity-0 group-hover:opacity-100 disabled:opacity-0 hidden md:flex",
          !prevBtnEnabled && "hidden"
        )}
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      
      <Button
        variant="secondary"
        size="icon"
        className={cn(
          "absolute right-0 -mr-5 top-1/2 -translate-y-1/2 rounded-full w-12 h-12 shadow-lg bg-background/95 backdrop-blur border border-border text-foreground hover:bg-background z-10 carousel-nav-btn opacity-0 group-hover:opacity-100 disabled:opacity-0 hidden md:flex",
          !nextBtnEnabled && "hidden"
        )}
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Pagination Dots */}
      {scrollSnaps.length > 1 && (
        <div className="flex justify-center gap-2 mt-2 pb-4">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 rounded-full transition-all duration-300", 
                index === selectedIndex ? "bg-primary w-6" : "bg-border w-2 hover:bg-muted-foreground/50"
              )}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SwipeCarousel;