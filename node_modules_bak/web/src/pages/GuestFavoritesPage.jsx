import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import GuestDashboardLayout from '@/components/GuestDashboardLayout.jsx';
import PropertyCard from '@/components/PropertyCard.jsx';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart } from 'lucide-react';

const GuestFavoritesPage = () => {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const records = await pb.collection('favorites').getFullList({
          filter: `guestId="${currentUser.id}"`,
          expand: 'propertyId',
          $autoCancel: false
        });
        setFavorites(records.map(r => r.expand?.propertyId).filter(Boolean));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [currentUser]);

  return (
    <GuestDashboardLayout>
      <Helmet><title>Favorites | Take On BnB</title></Helmet>
      <h1 className="text-3xl font-bold text-foreground mb-2">Saved Properties</h1>
      <p className="text-muted-foreground mb-8">Properties you have liked and saved for later.</p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-video w-full rounded-2xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-sm">
          <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No favorites yet</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">Click the heart icon on any property to save it to your favorites list.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {favorites.map((property, idx) => (
            <PropertyCard key={property.id} property={property} index={idx} />
          ))}
        </div>
      )}
    </GuestDashboardLayout>
  );
};

export default GuestFavoritesPage;