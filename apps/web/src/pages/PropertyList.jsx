import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import api from '@/lib/api.js';
import PropertyCard from '@/components/PropertyCard.jsx';
import PropertyCardSkeleton from '@/components/PropertyCardSkeleton.jsx';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProperties = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');

      console.log('[PropertyList] Fetching properties...');

      // IMPORTANT:
      // Do not send status=Live.
      // MongoDB currently contains status="approved".
      const response = await api.get('/properties');

      console.log(
        '[PropertyList] API response:',
        response?.data
      );

      const responseData = response?.data;

      // Support all common API response formats:
      //
      // 1. [...]
      // 2. { data: [...] }
      // 3. { items: [...] }
      let propertyList = [];

      if (Array.isArray(responseData)) {
        propertyList = responseData;
      } else if (Array.isArray(responseData?.data)) {
        propertyList = responseData.data;
      } else if (Array.isArray(responseData?.items)) {
        propertyList = responseData.items;
      }

      console.log(
        '[PropertyList] Properties received:',
        propertyList.length
      );

      // Only approved/live properties should be visible
      // to guests.
      const visibleProperties = propertyList.filter((property) => {
        const status = String(property?.status || '')
          .trim()
          .toLowerCase();

        return status === 'approved' || status === 'live';
      });

      console.log(
        '[PropertyList] Visible properties:',
        visibleProperties.length
      );

      if (visibleProperties.length > 0) {
        console.table(
          visibleProperties.map((property) => ({
            id: property?._id || property?.id,
            title: property?.title,
            location: property?.location,
            status: property?.status,
            price: property?.pricePerNight,
          }))
        );
      }

      setProperties(visibleProperties);
    } catch (err) {
      console.error(
        '[PropertyList] Failed to fetch properties:',
        err
      );

      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to load properties. Please try again.';

      setProperties([]);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return (
    <div className="min-h-screen bg-background pt-28 pb-24">
      <Helmet>
        <title>All Properties | Take On BnB</title>

        <meta
          name="description"
          content="Explore approved holiday homes, villas, apartments and stays on Take On BnB."
        />
      </Helmet>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            All Properties
          </h1>

          <p className="text-muted-foreground mt-2">
            Find your perfect stay with Take On BnB.
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="min-h-[350px] flex items-center justify-center">
            <div className="text-center max-w-md">

              <h2 className="text-xl font-semibold mb-2 text-foreground">
                Unable to load properties
              </h2>

              <p className="text-muted-foreground mb-6">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchProperties}
                className="
                  px-5
                  py-2.5
                  rounded-xl
                  bg-primary
                  text-primary-foreground
                  font-semibold
                  hover:bg-primary/90
                  transition
                "
              >
                Try Again
              </button>

            </div>
          </div>
        )}

        {/* Empty */}
        {!isLoading &&
          !error &&
          properties.length === 0 && (
            <div className="min-h-[350px] flex items-center justify-center">
              <div className="text-center">

                <h2 className="text-2xl font-semibold mb-2 text-foreground">
                  No Properties Found
                </h2>

                <p className="text-muted-foreground">
                  There are currently no approved properties available.
                </p>

                <button
                  type="button"
                  onClick={fetchProperties}
                  className="
                    mt-5
                    px-5
                    py-2.5
                    rounded-xl
                    border
                    border-border
                    bg-card
                    text-foreground
                    font-semibold
                    hover:bg-muted
                    transition
                  "
                >
                  Refresh
                </button>

              </div>
            </div>
          )}

        {/* Property Grid */}
        {!isLoading &&
          !error &&
          properties.length > 0 && (
            <>
              <div className="mb-5 text-sm text-muted-foreground">
                {properties.length}{' '}
                {properties.length === 1
                  ? 'property'
                  : 'properties'}{' '}
                available
              </div>

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  md:grid-cols-3
                  lg:grid-cols-4
                  gap-6
                "
              >
                {properties.map((property, index) => (
                  <PropertyCard
                    key={
                      property?._id ||
                      property?.id ||
                      `property-${index}`
                    }
                    property={property}
                    index={index}
                  />
                ))}
              </div>
            </>
          )}

      </div>
    </div>
  );
};

export default PropertyList;