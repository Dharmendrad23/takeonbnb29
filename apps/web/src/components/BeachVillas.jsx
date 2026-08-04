
import React, { useState, useEffect } from 'react';
import PropertyGrid from './PropertyGrid.jsx';
import { listProperties } from '@/lib/dataApi.js';
import { isLiveProperty } from '@/lib/propertyMappers.js';

export default function BeachVillas() {
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
            .filter((property) => {
              const location = String(property.location || '').toLowerCase();
              return location.includes('goa') || location.includes('kerala');
            })
            .slice(0, 8)
        );
      } catch (err) {
        console.error('Error fetching beach villas:', err);
        setError('Failed to load beachfront villas. Please try again.');
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
      title="Beachfront Villas" 
      subtitle="Step out of your door and directly onto the warm sand." 
    />
  );
}
