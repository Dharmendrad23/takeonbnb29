import React, { useState, useEffect, useMemo } from 'react';
import { Home } from 'lucide-react';
import api from '@/lib/api.js';
import SwappingPropertyCard from '@/components/SwappingPropertyCard.jsx';
import PropertyCardSkeleton from '@/components/PropertyCardSkeleton.jsx';

const AllPropertiesCarousel = ({ category = 'All' }) => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const records = await pb.collection('properties').getList(1, 500, {
          filter: 'status="Live"',
          sort: '-created',
          $autoCancel: false
        });
        setProperties(records.items);
      } catch (err) {
        console.error("Failed to fetch properties", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    if (category === 'All') return properties;
    return properties.filter(p => p.propertyType === category);
  }, [properties, category]);

  // Distribute properties into 3 columns for independent swapping
  const columns = useMemo(() => {
    const cols = [[], [], []];
    filteredProperties.forEach((prop, index) => {
      cols[index % 3].push(prop);
    });
    return cols;
  }, [filteredProperties]);

  if (isLoading) {
    return (
      <section className="py-16 bg-[#F3F4F6] dark:bg-[hsl(var(--carousel-bg))] border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-64 bg-muted rounded-xl animate-pulse mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PropertyCardSkeleton />
            <PropertyCardSkeleton />
            <PropertyCardSkeleton />
          </div>
        </div>
      </section>
    );
  }

  if (filteredProperties.length === 0) {
    return (
      <section className="py-16 bg-[#F3F4F6] dark:bg-[hsl(var(--carousel-bg))] border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Home className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No properties found</h2>
          <p className="text-muted-foreground">Try selecting a different category.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-[#F3F4F6] dark:bg-[hsl(var(--carousel-bg))] border-y border-border/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-[24px] md:text-[28px] font-bold text-foreground tracking-tight">
            {category === 'All' ? 'All Stays' : `${category} Stays`}
          </h2>
          <p className="text-muted-foreground mt-2">Discover our complete collection of premium properties</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {columns.map((colProps, index) => (
            colProps.length > 0 && (
              <div key={index} className="w-full">
                <SwappingPropertyCard 
                  properties={colProps} 
                  interval={6000} 
                  delay={index * 2000} // Stagger the swaps so they don't all change at once
                />
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllPropertiesCarousel;