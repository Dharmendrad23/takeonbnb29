import React, { useState, useEffect } from 'react';
import PropertyGrid from './PropertyGrid.jsx';
import api from '@/lib/api.js';

export default function LuxuryVillas() {
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
          const type = (p.propertyType || "").toLowerCase();
          return type === "villa" || type === "villas";
        });

        setProperties(filtered.slice(0, 8));
      } catch (err) {
        console.error("Error fetching luxury villas:", err);
        setError("Failed to load luxury villas.");
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