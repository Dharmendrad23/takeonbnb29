import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import EmptyState from '@/components/EmptyState';
import { Heart } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const WishlistPage = () => {
  const { currentUser } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const favorites = await pb.collection('favorites').getFullList({
        filter: `guestId="${currentUser.id}"`,
        expand: 'propertyId',
        $autoCancel: false
      });

      const propertyIds = favorites.map(f => f.propertyId);
      
      if (propertyIds.length > 0) {
        const propertiesData = await pb.collection('properties').getFullList({
          filter: propertyIds.map(id => `id="${id}"`).join(' || '),
          $autoCancel: false
        });
        setProperties(propertiesData);
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading wishlist...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Wishlist - Take on BNB</title>
        <meta name="description" content="Your saved properties" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ letterSpacing: '-0.02em' }}>
              My Wishlist
            </h1>
            <p className="text-xl text-muted-foreground">Your saved properties</p>
          </div>

          {properties.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="Your wishlist is empty"
              description="Start saving properties you love to plan your future trips"
              actionLabel="Explore Properties"
              actionPath="/explore"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default WishlistPage;