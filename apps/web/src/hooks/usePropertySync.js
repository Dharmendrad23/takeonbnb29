import { useEffect } from 'react';
import api from '@/lib/api.js';

export const usePropertySync = (callback) => {
  useEffect(() => {
    let isSubscribed = true;

    const subscribe = async () => {
      try {
        await pb.collection('properties').subscribe('*', (e) => {
          if (isSubscribed && callback) {
            callback(e);
          }
        });
      } catch (error) {
        console.error('Failed to subscribe to properties:', error);
      }
    };

    subscribe();

    return () => {
      isSubscribed = false;
      pb.collection('properties').unsubscribe('*');
    };
  }, [callback]);
};