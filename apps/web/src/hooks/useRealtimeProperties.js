import { useState, useEffect } from 'react';
import { listProperties } from '@/lib/dataApi.js';
import { isLiveProperty } from '@/lib/propertyMappers.js';

export const useRealtimeProperties = (options = {}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stringify options to securely use in dependency array without triggering infinite loops
  const optionsString = JSON.stringify(options);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const parsedOptions = JSON.parse(optionsString);
        let records = await listProperties();

        if (parsedOptions.onlyLive !== false) {
          records = records.filter((property) => isLiveProperty(property));
        }

        if (parsedOptions.limit) {
          records = records.slice(0, parsedOptions.limit);
        }

        setProperties(records);
      } catch (err) {
        console.error('Failed to fetch realtime properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
    const intervalId = window.setInterval(fetchProperties, 30000);
    return () => window.clearInterval(intervalId);
  }, [optionsString]);

  return { properties, loading };
};