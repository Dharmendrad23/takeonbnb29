
import React, { useState, useEffect } from 'react';
import PropertyGrid from './PropertyGrid.jsx';
import pb from '@/lib/pocketbaseClient.js';

export default function LuxuryVillas() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const records = await pb.collection('properties').getList(1, 8, {
          filter: 'propertyType="Villas" && status="Live"',
          sort: '-created',
          $autoCancel: false
        });
        setProperties(records.items || []);
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
