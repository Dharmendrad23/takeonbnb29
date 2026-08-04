
import React, { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { listProperties } from '@/lib/dataApi.js';
import { getEntityId, isLiveProperty } from '@/lib/propertyMappers.js';
import PropertyCard from './PropertyCard.jsx';
import PropertyCardSkeleton from './PropertyCardSkeleton.jsx';

const TrendingProperties = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const records = await listProperties();
        setProperties(records.filter((property) => isLiveProperty(property)).slice(0, 50));
      } catch (err) {
        console.error('Error fetching trending properties:', err);
        setError('Failed to load trending properties.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
    const intervalId = window.setInterval(fetchProperties, 30000);
    return () => window.clearInterval(intervalId);
  }, []);

  const getSafeProperty = (prop) => {
    if (!prop) return null;
    return {
      ...prop,
      title: prop.title || prop.name || 'Unnamed Property',
      location: prop.location || 'Location not specified',
      pricePerNight: prop.pricePerNight || prop.price || 0,
      rating: prop.rating || 0,
      totalBookings: prop.totalBookings || prop.reviews || 0,
      guestCapacity: prop.guestCapacity || prop.guests || 0,
      photos: prop.photos || [],
      image: prop.image || ''
    };
  };

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="relative inline-block pb-2 text-3xl md:text-4xl font-bold tracking-tight">
              Trending Properties
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-primary rounded-full"></span>
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">Highly rated stays across the globe.</p>
          </motion.div>
          
          <div className="hidden md:flex gap-3">
            <Button variant="outline" size="icon" className="rounded-full border-border hover:bg-muted" onClick={() => emblaApi?.scrollPrev()}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full border-border hover:bg-muted" onClick={() => emblaApi?.scrollNext()}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {error ? (
          <div className="text-center text-destructive py-8">{error}</div>
        ) : loading ? (
          <div className="embla" ref={emblaRef}>
            <div className="embla__container">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={`skeleton-${idx}`} className="embla__slide">
                  <PropertyCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        ) : properties.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center bg-card rounded-3xl border border-border shadow-sm">
            <Home className="w-16 h-16 text-muted-foreground opacity-50 mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-3">No trending properties</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We don't have any trending properties to show right now. Check back soon for popular destinations.
            </p>
          </div>
        ) : (
          <div className="embla" ref={emblaRef}>
            <div className="embla__container">
              {properties.map((prop, idx) => {
                const safeProp = getSafeProperty(prop);
                if (!safeProp) return null;
                return (
                  <motion.div 
                    key={getEntityId(safeProp) || `prop-${idx}`} 
                    className="embla__slide"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <PropertyCard property={safeProp} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingProperties;
