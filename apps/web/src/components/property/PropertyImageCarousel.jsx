import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { cn } from '@/lib/utils.js';

// Helper to shuffle array
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const PropertyImageCarousel = ({ property, alt, className }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, watchDrag: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [shuffledImages, setShuffledImages] = useState([]);

  useEffect(() => {
    if (property?.photos && property.photos.length > 0) {
      const urls = property.photos.map(photo => pb.files.getUrl(property, photo));
      setShuffledImages(shuffleArray(urls));
    } else if (property?.coverImage) {
      setShuffledImages([pb.files.getUrl(property, property.coverImage)]);
    } else {
      setShuffledImages([]);
    }
  }, [property]);

  const scrollPrev = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (shuffledImages.length === 0) {
    return (
      <div className={cn("w-full h-full flex flex-col items-center justify-center bg-muted text-muted-foreground/50", className)}>
        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
        <span className="text-sm font-medium">No images</span>
      </div>
    );
  }

  if (shuffledImages.length === 1) {
    return (
      <div className={cn("w-full h-full overflow-hidden", className)}>
        <img 
          src={shuffledImages[0]} 
          alt={alt || property?.title || 'Property image'} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div 
      className={cn("relative w-full h-full overflow-hidden group/carousel", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full h-full" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
          {shuffledImages.map((src, index) => (
            <div className="relative flex-[0_0_100%] h-full min-w-0" key={index}>
              <img 
                src={src} 
                alt={`${alt || property?.title || 'Property'} - Image ${index + 1}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading={index === 0 ? "eager" : "lazy"}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <div 
        className={cn(
          "absolute inset-0 flex items-center justify-between p-2 pointer-events-none transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      >
        <button
          onClick={scrollPrev}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-black shadow-sm backdrop-blur-sm pointer-events-auto transition-transform hover:scale-110 active:scale-95"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={scrollNext}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-black shadow-sm backdrop-blur-sm pointer-events-auto transition-transform hover:scale-110 active:scale-95"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
        {shuffledImages.map((_, index) => (
          <button
            key={index}
            onClick={(e) => scrollTo(index, e)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300 pointer-events-auto shadow-sm",
              index === selectedIndex 
                ? "w-4 bg-white" 
                : "w-1.5 bg-white/60 hover:bg-white/80"
            )}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PropertyImageCarousel;