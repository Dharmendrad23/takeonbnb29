
import React, { useState, useEffect } from 'react';
import PropertyGrid from './PropertyGrid.jsx';
import pb from '@/lib/pocketbaseClient.js';

export default function MountainVillas() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const records = await pb.collection('properties').getList(1, 8, {
          filter: '(location ~ "Manali" || location ~ "Himachal" || location ~ "Darjeeling") && status="Live"',
          sort: '-created',
          $autoCancel: false
        });
        setProperties(records.items || []);
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
