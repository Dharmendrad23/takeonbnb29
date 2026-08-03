import React, { useState, useEffect } from 'react';
import api from '@/lib/api.js';
import CityCarouselSection from '@/components/CityCarouselSection.jsx';
import PropertyCardSkeleton from '@/components/PropertyCardSkeleton.jsx';

const CityWiseCarouselContainer = () => {
  const [groupedProperties, setGroupedProperties] = useState({});
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndGroupProperties = async () => {
      try {
        // Fetch up to 500 live properties
        const records = await pb.collection('properties').getList(1, 500, {
          filter: 'status="Live"',
          sort: '-created',
          $autoCancel: false
        });

        const properties = records.items;
        
        // Group by city
        const grouped = properties.reduce((acc, property) => {
          const city = property.location?.trim();
          if (city) {
            if (!acc[city]) {
              acc[city] = [];
            }
            acc[city].push(property);
          }
          return acc;
        }, {});

        // Sort cities alphabetically
        const sortedCities = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

        setGroupedProperties(grouped);
        setCities(sortedCities);
      } catch (err) {
        console.error("Failed to fetch properties for city carousels", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndGroupProperties();
  }, []);

  if (isLoading) {
    return (
      <div className="py-16 bg-[hsl(var(--carousel-bg))] border-y border-border/50">
        <div className="max-w-[1920px] mx-auto carousel-container-padding">
          <div className="h-10 w-64 bg-muted rounded-xl animate-pulse mb-8"></div>
          <div className="flex gap-6 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="min-w-[280px] flex-1 flex flex-col gap-6">
                <PropertyCardSkeleton />
                <PropertyCardSkeleton />
                <PropertyCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (cities.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col">
      {cities.map((city) => (
        <CityCarouselSection 
          key={city} 
          cityName={city} 
          properties={groupedProperties[city]} 
        />
      ))}
    </div>
  );
};

export default CityWiseCarouselContainer;