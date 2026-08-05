import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const FAVORITES_STORAGE_KEY = 'takeonbnb-favorites';

const getStoredFavorites = () => {
  try {
    const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const persistFavorites = (favorites) => {
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
};

export function useFavorites() {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      setFavorites([]);
      return;
    }

    const stored = getStoredFavorites().filter(f => f.guestId === currentUser.id);
    setFavorites(stored.map(r => r.propertyId));
  }, [currentUser]);

  const toggleFavorite = async (propertyId) => {
    if (!currentUser) {
      toast.error('Please log in to save favorites');
      return false;
    }

    try {
      const isFav = favorites.includes(propertyId);
      const storedAll = getStoredFavorites();
      
      if (isFav) {
        const updated = storedAll.filter(f => !(f.guestId === currentUser.id && f.propertyId === propertyId));
        persistFavorites(updated);
        setFavorites(prev => prev.filter(id => id !== propertyId));
        toast.success('Removed from favorites');
      } else {
        storedAll.push({ id: `fav-${Date.now()}`, guestId: currentUser.id, propertyId, createdAt: new Date().toISOString() });
        persistFavorites(storedAll);
        setFavorites(prev => [...prev, propertyId]);
        toast.success('Saved to favorites');
      }
      return !isFav;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
      return favorites.includes(propertyId);
    }
  };

  return { favorites, toggleFavorite };
}