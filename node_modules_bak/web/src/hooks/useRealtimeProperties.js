import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

export const useRealtimeProperties = (options = {}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stringify options to securely use in dependency array without triggering infinite loops
  const optionsString = JSON.stringify(options);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const parsedOptions = JSON.parse(optionsString);
        const records = await pb.collection('properties').getList(1, parsedOptions.limit || 50, {
          filter: parsedOptions.filter || "status='Live'",
          sort: parsedOptions.sort || '-created',
          expand: parsedOptions.expand || '',
          $autoCancel: false
        });
        setProperties(records.items);
      } catch (err) {
        console.error('Failed to fetch realtime properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();

    // Subscribe to any changes in the properties collection
    pb.collection('properties').subscribe('*', () => {
      fetchProperties();
    });

    return () => pb.collection('properties').unsubscribe('*');
  }, [optionsString]);

  return { properties, loading };
};