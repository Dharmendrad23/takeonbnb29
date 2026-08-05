import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import api from '@/lib/api.js';
import PropertyCard from '@/components/PropertyCard.jsx';
import PropertyCardSkeleton from '@/components/PropertyCardSkeleton.jsx';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);

        const { data } = await api.get("/properties", { params: { status: 'Live' } });

        setProperties(data);
      } catch (err) {
        console.error("Failed to fetch properties", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-28 pb-24">
      <Helmet>
        <title>All Properties | Take On BnB</title>
      </Helmet>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">
          All Properties
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <h2>No Properties Found</h2>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {properties.map((property, index) => (
              <PropertyCard
                key={property._id || property.id}
                property={property}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyList;