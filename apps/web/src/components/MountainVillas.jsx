import React, { useState, useEffect } from 'react';
import PropertyGrid from './PropertyGrid.jsx';
import api from '@/lib/api.js';

export default function MountainVillas() {
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
            location.includes("manali") ||
            location.includes("himachal") ||
            location.includes("darjeeling") ||
            location.includes("mussoorie") ||
            location.includes("nainital")
          );
        });

        setProperties(filtered.slice(0, 8));
      } catch (err) {
        console.error("Error fetching mountain villas:", err);
        setError("Failed to load mountain escapes.");
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