import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

export function useFavorites() {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      setFavorites([]);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const records = await pb.collection('favorites').getFullList({
          filter: `guestId = "${currentUser.id}"`,
          $autoCancel: false
        });
        setFavorites(records.map(r => r.propertyId));
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [currentUser]);

  const toggleFavorite = async (propertyId) => {
    if (!currentUser) {
      toast.error('Please log in to save favorites');
      return false;
    }

    try {
      const isFav = favorites.includes(propertyId);
      
      if (isFav) {
        // Find and delete
        const record = await pb.collection('favorites').getFirstListItem(`guestId="${currentUser.id}" && propertyId="${propertyId}"`, { $autoCancel: false });
        await pb.collection('favorites').delete(record.id, { $autoCancel: false });
        setFavorites(prev => prev.filter(id => id !== propertyId));
        toast.success('Removed from favorites');
      } else {
        // Create
        await pb.collection('favorites').create({
          guestId: currentUser.id,
          propertyId: propertyId
        }, { $autoCancel: false });
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