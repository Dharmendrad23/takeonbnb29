import React, { useState, useEffect } from 'react';
import api from '@/lib/api.js';
import SwappingPropertyCard from '@/components/SwappingPropertyCard.jsx';
import PropertyCardSkeleton from '@/components/PropertyCardSkeleton.jsx';
import { AlertCircle } from 'lucide-react';

const AllPropertiesGrid = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const records = await pb.collection('properties').getList(1, 100, {
          filter: 'status="Live"',
          sort: '-created',
          $autoCancel: false
        });
        setProperties(records.items);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">All Properties</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || properties.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-foreground mb-2">No properties available</h3>
          <p className="text-muted-foreground">We couldn't load any properties at this time. Please check back later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background border-y border-border/50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-[24px] md:text-[32px] font-bold text-foreground tracking-tight">
            Explore All Stays
          </h2>
          <p className="text-muted-foreground mt-2">Discover our complete collection of premium properties</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {properties.map((prop, idx) => (
            <div key={prop.id} className="w-full">
              <SwappingPropertyCard 
                property={prop} 
                interval={5000 + (idx % 4) * 1000} // Staggered intervals
                delay={idx * 800} // Staggered start times
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllPropertiesGrid;