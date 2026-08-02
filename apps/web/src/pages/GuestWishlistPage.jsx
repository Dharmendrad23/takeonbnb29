import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import GuestDashboardLayout from '@/components/GuestDashboardLayout.jsx';
import { Heart, MapPin, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrencyINR } from '@/lib/bookingUtils.js';
import { toast } from 'sonner';

const GuestWishlistPage = () => {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const records = await pb.collection('favorites').getFullList({
        filter: `guestId="${currentUser.id}"`,
        expand: 'propertyId',
        sort: '-created',
        $autoCancel: false
      });
      setFavorites(records);
    } catch (e) {
      console.error("Error fetching favorites:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [currentUser]);

  const handleRemove = async (id) => {
    try {
      await pb.collection('favorites').delete(id, { $autoCancel: false });
      setFavorites(prev => prev.filter(f => f.id !== id));
      toast.success('Removed from wishlist');
    } catch (e) {
      toast.error('Failed to remove from wishlist');
    }
  };

  return (
    <GuestDashboardLayout>
      <Helmet><title>Wishlist | TakeOn BnB</title></Helmet>
      
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2">Your Wishlist</h1>
          <p className="text-muted-foreground text-lg">Places you've saved for future trips.</p>
        </div>
        <div className="bg-primary/10 text-primary font-bold px-4 py-2 rounded-xl">
          {favorites.length} Saved
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-4">
              <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="dashboard-card py-20 text-center flex flex-col items-center justify-center bg-muted/20">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Your wishlist is empty</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            As you search, tap the heart icon to save your favorite places and experiences to a wishlist.
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-12 px-8 shadow-md">
            <Link to="/search">Start Exploring</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(fav => {
            const property = fav.expand?.propertyId;
            if (!property) return null;
            
            return (
              <div key={fav.id} className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  {property.coverImage && (
                    <img 
                      src={pb.files.getUrl(property, property.coverImage)} 
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <button 
                    onClick={() => handleRemove(fav.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-destructive hover:bg-destructive hover:text-white transition-colors shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-foreground text-lg line-clamp-1 group-hover:text-primary transition-colors">{property.title}</h3>
                    <div className="flex items-center gap-1 text-sm font-bold shrink-0 ml-2">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span>{property.rating || 'New'}</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm flex items-center mb-4 font-medium">
                    <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
                    <span className="truncate">{property.location}</span>
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-foreground text-lg">{formatCurrencyINR(property.pricePerNight)}</span>
                      <span className="text-muted-foreground text-sm font-medium"> / night</span>
                    </div>
                    <Button asChild size="sm" className="rounded-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Link to={`/property/${property.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GuestDashboardLayout>
  );
};

export default GuestWishlistPage;