import React, { useState, useEffect } from 'react';
import PropertyGrid from './PropertyGrid.jsx';
import api from '@/lib/api.js';

export default function BeachVillas() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await api.get("/properties", { params: { status: 'Live' } });

        const filtered = data.filter((p) => {
          const location = (p.location || "").toLowerCase();

          return (
            location.includes("goa") ||
            location.includes("kerala")
          );
        });

        setProperties(filtered.slice(0, 8));
      } catch (err) {
        console.error("Error fetching beach villas:", err);
        setError("Failed to load beachfront villas.");
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