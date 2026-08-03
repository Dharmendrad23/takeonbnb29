import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

export function useFavorites() {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = async (propertyId) => {
    if (!currentUser) {
      toast.error('Please log in to save favorites');
      return false;
    }

    const isFav = favorites.includes(propertyId);
    if (isFav) {
      setFavorites(prev => prev.filter(id => id !== propertyId));
      toast.success('Removed from favorites');
    } else {
      setFavorites(prev => [...prev, propertyId]);
      toast.success('Saved to favorites');
    }
    return !isFav;
  };

  return { favorites, toggleFavorite };
}