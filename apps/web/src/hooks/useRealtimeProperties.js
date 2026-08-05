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
        const response = await api.get('/api/properties');
        let records = Array.isArray(response.data) ? response.data : response.data?.items || [];

        // Client-side status filter (default: Live only)
        const statusFilter = parsedOptions.statusFilter || 'Live';
        if (statusFilter) {
          records = records.filter(p => (p.status || 'Live').toLowerCase() === statusFilter.toLowerCase());
        }

        if (parsedOptions.limit) {
          records = records.slice(0, parsedOptions.limit);
        }

        setProperties(records);
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