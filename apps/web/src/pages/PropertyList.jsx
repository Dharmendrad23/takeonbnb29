import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import PropertyCard from '@/components/PropertyCard.jsx';
import PropertyCardSkeleton from '@/components/PropertyCardSkeleton.jsx';
import { Button } from '@/components/ui/button';
import { listProperties } from '@/lib/dataApi.js';
import { getEntityId, isLiveProperty } from '@/lib/propertyMappers.js';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProperties = async (pageNum = 1, append = false) => {
    try {
      setIsLoading(true);
      const records = (await listProperties()).filter((property) => isLiveProperty(property));
      const startIndex = (pageNum - 1) * 24;
      const pageItems = records.slice(startIndex, startIndex + 24);
      
      if (append) {
        setProperties(prev => [...prev, ...pageItems]);
      } else {
        setProperties(pageItems);
      }
      
      setHasMore(startIndex + 24 < records.length);
    } catch (err) {
      console.error("Failed to fetch properties", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(1, false);
    const interval = setInterval(() => fetchProperties(1, false), 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProperties(nextPage, true);
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-24">
      <Helmet><title>All Properties | Take On BnB</title></Helmet>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">All Properties</h1>
        </div>

        {isLoading && properties.length === 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
           {[...Array(12)].map((_, i) => (
             <PropertyCardSkeleton key={i} />
           ))}
         </div>
        ) : properties.length === 0 ? (
          <div className="py-24 text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">No properties found</h3>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-10">
              {properties.map((property, index) => (
                <PropertyCard key={getEntityId(property)} property={property} index={index} />
              ))}
            </div>
            
            {hasMore && (
              <div className="mt-12 flex justify-center">
                <Button 
                  onClick={loadMore} 
                  disabled={isLoading}
                  variant="outline"
                  className="rounded-xl px-8 py-6 text-lg"
                >
                  {isLoading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyList;