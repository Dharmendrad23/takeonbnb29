
import React, { useState, useEffect } from 'react';
import PropertyGrid from './PropertyGrid.jsx';
import api from '@/lib/api';

export default function MountainVillas() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
      const { data } = await api.get("/properties");

const filtered = data.filter(property =>
  property.location &&
  (
    property.location.includes("Manali") ||
    property.location.includes("Himachal") ||
    property.location.includes("Darjeeling")
  )
);
setProperties(filtered);
      } catch (err) {
        console.error('Error fetching mountain villas:', err);
        setError('Failed to load mountain escapes. Please try again.');
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
      title="Mountain Escapes" 
      subtitle="Breathe in the crisp air and enjoy panoramic scenic views." 
    />
  );
}
