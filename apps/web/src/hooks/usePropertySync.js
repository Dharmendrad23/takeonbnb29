import { useEffect } from 'react';

export const usePropertySync = (callback) => {
  // Realtime sync via PocketBase has been removed.
  // The parent component should call its own fetch on mount.
  useEffect(() => {
    // no-op: polling or websocket can be added here if needed
  }, [callback]);
};