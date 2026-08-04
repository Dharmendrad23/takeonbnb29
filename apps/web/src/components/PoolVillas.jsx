
import React, { useState, useEffect } from 'react';
import PropertyGrid from './PropertyGrid.jsx';
import { listProperties } from '@/lib/dataApi.js';
import { isLiveProperty } from '@/lib/propertyMappers.js';

export default function PoolVillas() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const records = await listProperties();
        setProperties(
          records
            .filter((property) => isLiveProperty(property))
            .filter((property) =>
              Array.isArray(property.amenities) &&
              property.amenities.some((amenity) =>
                String(typeof amenity === 'string' ? amenity : amenity?.name || '')
                  .toLowerCase()
                  .includes('pool')
              )
            )
            .slice(0, 8)
        );
      } catch (err) {
        console.error('Error fetching pool villas:', err);
        setError('Failed to load villas with private pools.');
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <PropertyGrid 
      properties={properties} 
      isLoading={loading}
      error={error}
      title="Villas with Private Pools" 
      subtitle="Dive into relaxation with your own exclusive oasis." 
    />
  );
}
