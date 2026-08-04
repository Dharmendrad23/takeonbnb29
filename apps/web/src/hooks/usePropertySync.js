import { useEffect } from 'react';

export const usePropertySync = (callback) => {
  useEffect(() => {
    if (!callback) {
      return undefined;
    }

    callback({ action: 'refresh' });
    const intervalId = window.setInterval(() => {
      callback({ action: 'refresh' });
    }, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [callback]);
};