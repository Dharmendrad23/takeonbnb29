import { useEffect } from 'react';

// usePropertySync is a no-op on the MongoDB backend since realtime subscriptions
// are not supported. Components that need fresh data should re-fetch via polling.
export const usePropertySync = (_callback) => {
  useEffect(() => {
    // no-op
  }, []);
};