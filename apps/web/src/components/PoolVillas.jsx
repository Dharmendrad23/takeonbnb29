
import React, { useState, useEffect } from 'react';
import PropertyGrid from './PropertyGrid.jsx';
import pb from '@/lib/pocketbaseClient.js';

export default function PoolVillas() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const records = await pb.collection('properties').getList(1, 8, {
          filter: 'amenities.name ?~ "pool" && status="Live"',
          sort: '-created',
          $autoCancel: false
        });
        setProperties(records.items || []);
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
