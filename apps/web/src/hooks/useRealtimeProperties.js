import { useState, useEffect } from 'react';
import api from '@/lib/api.js';

export const useRealtimeProperties = (options = {}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const optionsString = JSON.stringify(options);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const parsedOptions = JSON.parse(optionsString);
        const params = new URLSearchParams();
        if (parsedOptions.limit) params.set('limit', parsedOptions.limit);
        if (parsedOptions.city) params.set('city', parsedOptions.city);
        if (parsedOptions.propertyType) params.set('propertyType', parsedOptions.propertyType);
        const { data } = await api.get(`/properties?${params.toString()}`);
        setProperties(data.properties || []);
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [optionsString]);

  return { properties, loading };
};