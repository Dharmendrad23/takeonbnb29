import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import pb from '@/lib/pocketbaseClient.js';
import PropertyCard from '@/components/PropertyCard.jsx';
import PropertyCardSkeleton from '@/components/PropertyCardSkeleton.jsx';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = searchParams.get('location') || '';
  const guests = searchParams.get('guests') || '1';
  const typeFilter = searchParams.get('type') || 'All';
  const sortFilter = searchParams.get('sort') || '-created';

  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const clauses = ['status = "Live"'];
        const params = {};

        if (location) {
          clauses.push('(location ~ {:location} || title ~ {:location})');
          params.location = location;
        }

        if (typeFilter !== 'All') {
          clauses.push('propertyType = {:propertyType}');
          params.propertyType = typeFilter;
        }

        const guestsNum = parseInt(guests, 10);
        if (!Number.isNaN(guestsNum) && guestsNum > 1) {
          clauses.push('guestCapacity >= {:guests}');
          params.guests = guestsNum;
        }

        const filterStr = pb.filter(clauses.join(' && '), params);

        const records = await pb.collection('properties').getList(1, 48, {
          filter: filterStr,
          sort: sortFilter,
          $autoCancel: false
        });

        setProperties(records.items);
      } catch (err) {
        console.error("Failed to fetch search results", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [location, guests, typeFilter, sortFilter]);

  const handleTypeChange = (val) => {
    if (val === 'All') {
      searchParams.delete('type');
    } else {
      searchParams.set('type', val);
    }
    setSearchParams(searchParams);
  };

  const handleSortChange = (val) => {
    searchParams.set('sort', val);
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-24 animate-fade-in">
      <Helmet>
        <title>Search Results | Take on BNB</title>
        <meta name="description" content="Discover premium vacation rentals and properties on Take on BNB. Book your perfect stay today." />
      </Helmet>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {properties.length} {properties.length === 1 ? 'stay' : 'stays'} {location ? `in ${location}` : ''}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Review COVID-19 travel restrictions before you book.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Select value={sortFilter} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[160px] rounded-xl border-border bg-card min-h-[48px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-created">Newest</SelectItem>
                <SelectItem value="pricePerNight">Price: Low to High</SelectItem>
                <SelectItem value="-pricePerNight">Price: High to Low</SelectItem>
                <SelectItem value="-rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-[160px] rounded-xl border-border bg-card min-h-[48px]">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Villas">Villas</SelectItem>
                <SelectItem value="Hotels">Hotels</SelectItem>
                <SelectItem value="Apartments">Apartments</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="rounded-xl flex items-center gap-2 bg-card min-h-[48px]">
              <SlidersHorizontal className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </div>

        {isLoading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {[...Array(8)].map((_, i) => (
             <PropertyCardSkeleton key={i} />
           ))}
         </div>
        ) : properties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-24 text-center bg-card rounded-3xl border border-border shadow-sm"
          >
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-foreground mb-2">No exact matches</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Try changing your property type filter, removing dates, or adjusting your search area.
            </p>
            <Button variant="secondary" onClick={() => handleTypeChange('All')} className="rounded-xl min-h-[48px]">
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {properties.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;