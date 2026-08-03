import React, { useState, useEffect, useCallback, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import PropertyCard from '@/components/PropertyCard.jsx';
import PropertyCardSkeleton from '@/components/PropertyCardSkeleton.jsx';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils.js';

// Helper to chunk arrays for multi-row carousel
const chunkArray = (arr, size) => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
};

const LocationCarouselSection = ({ location, title, subtitle }) => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'start',
    skipSnaps: false,
    dragFree: true
  });
  
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [rows, setRows] = useState(3);

  // Responsive row calculation
  useEffect(() => {
    const updateRows = () => {
      setRows(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    };
    updateRows();
    window.addEventListener('resize', updateRows);
    return () => window.removeEventListener('resize', updateRows);
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const records = await pb.collection('properties').getList(1, 50, {
          filter: `location ~ "${location}" && status="Live"`,
          sort: '-created',
          $autoCancel: false
        });
        setProperties(records.items);
      } catch (err) {
        console.error(`Failed to fetch properties for ${location}`, err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [location]);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => activeFilter === 'All' || p.propertyType === activeFilter);
  }, [properties, activeFilter]);

  const propertyChunks = useMemo(() => {
    return chunkArray(filteredProperties, rows);
  }, [filteredProperties, rows]);

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
    
    emblaApi.on('pointerDown', () => setIsPlaying(false));
    emblaApi.on('pointerUp', () => setIsPlaying(true));
  }, [emblaApi, onInit, onSelect, propertyChunks]);

  useEffect(() => {
    if (!emblaApi) return;
    let intervalId;
    
    if (isPlaying && propertyChunks.length > 1) {
      intervalId = setInterval(() => {
        emblaApi.scrollNext();
      }, 6000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [emblaApi, isPlaying, propertyChunks.length]);

  // Re-init embla when chunks change
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
    }
  }, [propertyChunks, emblaApi]);

  if (!isLoading && properties.length === 0) {
    return null; 
  }

  const FILTERS = ['All', 'Villas', 'Hotels', 'Apartments'];

  return (
    <section 
      className="py-16 bg-[#F3F4F6] dark:bg-muted/20 border-y border-border/50 transition-colors"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">{title}</h2>
            {subtitle && <p className="text-lg text-muted-foreground mt-2">{subtitle}</p>}
            
            <div className="flex flex-wrap items-center gap-2 mt-6">
              {FILTERS.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
                    activeFilter === filter 
                      ? "bg-primary text-white shadow-md" 
                      : "bg-background border border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          
          {propertyChunks.length > 1 && (
            <div className="hidden lg:flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-12 h-12 bg-background border-border hover:bg-primary/10 hover:text-primary transition-all duration-300 shadow-sm"
                onClick={scrollPrev}
                disabled={!prevBtnEnabled && !emblaApi?.internalEngine().options.loop}
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-12 h-12 bg-background border-border hover:bg-primary/10 hover:text-primary transition-all duration-300 shadow-sm"
                onClick={scrollNext}
                disabled={!nextBtnEnabled && !emblaApi?.internalEngine().options.loop}
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          )}
        </div>

        <div className="relative group w-full">
          <div className="overflow-hidden carousel-grab-cursor rounded-2xl" ref={emblaRef}>
            <div className="flex touch-pan-y -ml-4 sm:-ml-6 py-2">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="pl-4 sm:pl-6 min-w-0 flex-[0_0_85%] sm:flex-[0_0_45%] md:flex-[0_0_40%] lg:flex-[0_0_30%] xl:flex-[0_0_25%] 2xl:flex-[0_0_20%] flex flex-col gap-6">
                    <PropertyCardSkeleton />
                    <PropertyCardSkeleton />
                    <PropertyCardSkeleton />
                  </div>
                ))
              ) : propertyChunks.length === 0 ? (
                <div className="w-full text-center py-12 text-muted-foreground bg-white dark:bg-card rounded-2xl border border-border ml-4 sm:ml-6">
                  No {activeFilter !== 'All' ? activeFilter.toLowerCase() : 'properties'} found for this location.
                </div>
              ) : (
                propertyChunks.map((chunk, index) => (
                  <div 
                    key={index} 
                    className="pl-4 sm:pl-6 min-w-0 flex-[0_0_85%] sm:flex-[0_0_45%] md:flex-[0_0_40%] lg:flex-[0_0_30%] xl:flex-[0_0_25%] 2xl:flex-[0_0_20%] flex flex-col gap-6"
                  >
                    {chunk.map((property) => (
                      <PropertyCard property={property} key={property.id} />
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>

          {!isLoading && scrollSnaps.length > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "h-2 rounded-full transition-all duration-500", 
                    index === selectedIndex ? "bg-primary w-8" : "bg-border w-2 hover:bg-muted-foreground/50"
                  )}
                  onClick={() => scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LocationCarouselSection;