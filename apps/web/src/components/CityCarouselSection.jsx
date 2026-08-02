import React, { useMemo } from 'react';
import SwappingPropertyCard from '@/components/SwappingPropertyCard.jsx';

const CityCarouselSection = ({ cityName, properties }) => {
  // Distribute properties into 3 columns for independent swapping
  const columns = useMemo(() => {
    const cols = [[], [], []];
    properties.forEach((prop, index) => {
      cols[index % 3].push(prop);
    });
    return cols;
  }, [properties]);

  if (!properties || properties.length === 0) return null;

  return (
    <section className="py-12 bg-background border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Stays in {cityName}
          </h2>
          <p className="text-muted-foreground mt-2">Explore top-rated properties in {cityName}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {columns.map((colProps, index) => (
            colProps.length > 0 && (
              <div key={index} className="w-full">
                <SwappingPropertyCard 
                  properties={colProps} 
                  interval={7000} 
                  delay={index * 2333} // Stagger the swaps
                />
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
};

export default CityCarouselSection;