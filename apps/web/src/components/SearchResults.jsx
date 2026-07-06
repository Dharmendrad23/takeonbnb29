import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { MapPin, Star, BedDouble, Bath, Users, SearchX } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const SearchResults = ({ criteria }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const guests = parseInt(criteria.guests, 10) || 1;
        const location = criteria.where ? criteria.where.toLowerCase() : '';
        
        let filterStr = `status = 'Live' && guestCapacity >= ${guests}`;
        
        // Fetch base properties first
        const records = await pb.collection('properties').getFullList({
          filter: filterStr,
          sort: '-created',
          $autoCancel: false
        });

        // Soft filter by location (case-insensitive include)
        let filteredRecords = records;
        if (location) {
          filteredRecords = records.filter(r => 
            (r.location || '').toLowerCase().includes(location) ||
            (r.title || '').toLowerCase().includes(location)
          );
        }

        // Filter out booked properties if dates are provided
        if (criteria.checkIn && criteria.checkOut) {
          const inDate = new Date(criteria.checkIn);
          const outDate = new Date(criteria.checkOut);
          
          if (inDate < outDate) {
            const inStr = inDate.toISOString().split('T')[0];
            const outStr = outDate.toISOString().split('T')[0];
            
            // Check overlapping bookings:
            // A booking overlaps if it starts before requested out AND ends after requested in
            const bookings = await pb.collection('bookings').getFullList({
              filter: `status != 'cancelled' && checkInDate < "${outStr} 23:59:59" && checkOutDate > "${inStr} 00:00:00"`,
              $autoCancel: false
            });
            
            const bookedPropertyIds = new Set(bookings.map(b => b.propertyId));
            filteredRecords = filteredRecords.filter(r => !bookedPropertyIds.has(r.id));
          }
        }

        setProperties(filteredRecords);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (criteria) {
      fetchResults();
    }
  }, [criteria]);

  if (!criteria) return null;

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="space-y-4">
            <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
            <Skeleton className="h-6 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
            <Skeleton className="h-4 w-1/4 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive font-medium mb-4">{error}</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-24 px-4 bg-muted/20 rounded-3xl mt-10 border border-border">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <SearchX className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-3">No places found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          We couldn't find any properties matching your exact criteria. Try adjusting your dates, removing filters, or searching a different location.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-foreground mb-6">
        {properties.length} {properties.length === 1 ? 'place' : 'places'} found
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {properties.map((property, i) => (
          <motion.div 
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Link to={`/property/${property.id}`} className="group block">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-muted">
                <img 
                  src={property.coverImage ? pb.files.getUrl(property, property.coverImage) : (property.photos?.[0] ? pb.files.getUrl(property, property.photos[0]) : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop')} 
                  alt={property.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-background/90 backdrop-blur text-foreground px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">
                  {property.propertyCategory || 'Premium Stay'}
                </div>
              </div>
              
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-foreground text-lg truncate pr-4 group-hover:text-primary transition-colors">
                  {property.title}
                </h3>
                <div className="flex items-center gap-1 text-sm font-semibold shrink-0 mt-1">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span>{property.rating || '4.9'}</span>
                </div>
              </div>
              
              <div className="text-muted-foreground text-sm mb-3 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1" />
                <span className="truncate">{property.location}</span>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 font-medium">
                <span className="flex items-center"><Users className="w-3.5 h-3.5 mr-1" /> {property.guestCapacity}</span>
                <span className="flex items-center"><BedDouble className="w-3.5 h-3.5 mr-1" /> {property.bedrooms}</span>
                <span className="flex items-center"><Bath className="w-3.5 h-3.5 mr-1" /> {property.bathrooms}</span>
              </div>
              
              <div className="pt-3 border-t border-border mt-auto">
                <span className="font-extrabold text-foreground text-lg">${property.pricePerNight}</span>
                <span className="text-muted-foreground text-sm font-medium"> / night</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;