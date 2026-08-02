import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropertyCard from './PropertyCard.jsx';

const HorizontalScroll = ({ title, properties = [] }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!properties || properties.length === 0) return null;

  return (
    <div className="w-full py-8">
      <div className="flex justify-between items-center mb-6 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{title}</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2 rounded-full border border-border bg-card hover:shadow-md transition-smooth active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 rounded-full border border-border bg-card hover:shadow-md transition-smooth active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 px-4 md:px-8 pb-8 pt-2 snap-x snap-mandatory no-scrollbar max-w-7xl mx-auto"
        >
          {properties.map((property) => (
            <div key={property.id} className="min-w-[280px] w-[85vw] sm:w-[320px] md:w-[300px] lg:w-[320px] snap-start shrink-0">
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalScroll;