
import React, { useState, useEffect } from 'react';
import PropertyGrid from './PropertyGrid.jsx';
import { listProperties } from '@/lib/dataApi.js';
import { isLiveProperty } from '@/lib/propertyMappers.js';

export default function LuxuryVillas() {
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
            .filter((property) => String(property.propertyType || '').toLowerCase() === 'villas')
            .slice(0, 8)
        );
      } catch (err) {
        console.error('Error fetching luxury villas:', err);
        setError('Failed to load luxury villas. Please try again later.');
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
      title="Luxury Villas" 
      subtitle="Experience unparalleled opulence and world-class amenities." 
    />
  );
}
