import React, { useState, useEffect } from 'react';
import PropertyGrid from './PropertyGrid.jsx';
import api from '@/lib/api.js';

export default function PoolVillas() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await api.get('/properties', { params: { status: 'Live' } });

        const filtered = data.filter((p) =>
          Array.isArray(p.amenities) &&
          p.amenities.some((a) =>
            String(a).toLowerCase().includes('pool')
          )
        );

        setProperties(filtered.slice(0, 8));
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