import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const getWishlistStorageKey = (userId) => `wishlist:${userId}`;

const readFavorites = (userId) => {
  if (!userId) {
    return [];
  }

  try {
    const storedValue = localStorage.getItem(getWishlistStorageKey(userId));
    const parsedValue = JSON.parse(storedValue || '[]');
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    console.error('Error reading favorites from storage:', error);
    return [];
  }
};

export function useFavorites() {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      setFavorites([]);
      return;
    }

    setFavorites(readFavorites(currentUser.id));
  }, [currentUser]);

  const toggleFavorite = async (propertyId) => {
    if (!currentUser) {
      toast.error('Please log in to save favorites');
      return false;
    }

    try {
      const isFav = favorites.includes(propertyId);
      const nextFavorites = isFav
        ? favorites.filter((id) => id !== propertyId)
        : [...favorites, propertyId];

      localStorage.setItem(
        getWishlistStorageKey(currentUser.id),
        JSON.stringify(nextFavorites)
      );

      setFavorites(nextFavorites);
      toast.success(isFav ? 'Removed from favorites' : 'Saved to favorites');

      return !isFav;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
      return favorites.includes(propertyId);
    }
  };

  return { favorites, toggleFavorite };
}