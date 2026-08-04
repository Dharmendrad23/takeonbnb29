import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PropertyCard from '@/components/PropertyCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, Home } from 'lucide-react';
import { listProperties } from '@/lib/dataApi.js';
import { getEntityId, isLiveProperty } from '@/lib/propertyMappers.js';

const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState(searchParams.get('location') || '');
  const [propertyType, setPropertyType] = useState('all');
  const [sortBy, setSortBy] = useState('-created');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    loadProperties();
  }, [sortBy]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      let result = await listProperties();
      result = result.filter((property) => isLiveProperty(property));

      if (searchLocation) {
        const query = searchLocation.toLowerCase();
        result = result.filter((property) =>
          String(property.location || '').toLowerCase().includes(query)
        );
      }

      if (propertyType !== 'all') {
        result = result.filter(
          (property) => String(property.propertyType || '').toLowerCase() === propertyType.toLowerCase()
        );
      }

      if (minPrice) {
        result = result.filter((property) => Number(property.pricePerNight || 0) >= Number(minPrice));
      }

      if (maxPrice) {
        result = result.filter((property) => Number(property.pricePerNight || 0) <= Number(maxPrice));
      }

      if (sortBy === 'pricePerNight') {
        result = [...result].sort((a, b) => Number(a.pricePerNight || 0) - Number(b.pricePerNight || 0));
      } else if (sortBy === '-pricePerNight') {
        result = [...result].sort((a, b) => Number(b.pricePerNight || 0) - Number(a.pricePerNight || 0));
      }

      setProperties(result.slice(0, 50));
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadProperties();
  };

  return (
    <>
      <Helmet>
        <title>Explore Properties - Take on BNB</title>
        <meta name="description" content="Browse and discover unique vacation rentals for your next trip" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>
              Explore properties
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Find your perfect vacation rental
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 shadow-lg sticky top-24">
                <div className="flex items-center space-x-2 mb-6">
                  <SlidersHorizontal className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">Filters</h2>
                </div>

                <form onSubmit={handleSearch} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <Input
                      type="text"
                      placeholder="Search location..."
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Property Type</label>
                    <Select value={propertyType} onValueChange={setPropertyType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="room">Room</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Price Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="text-foreground"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="text-foreground"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    <Search className="w-4 h-4 mr-2" />
                    Apply Filters
                  </Button>
                </form>
              </div>
            </aside>

            <main className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
                </p>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-created">Newest First</SelectItem>
                    <SelectItem value="pricePerNight">Price: Low to High</SelectItem>
                    <SelectItem value="-pricePerNight">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <LoadingSpinner count={6} />
              ) : properties.length === 0 ? (
                <EmptyState
                  icon={Home}
                  title="No properties found"
                  description="Try adjusting your filters to see more results"
                  actionLabel="Clear Filters"
                  actionPath="/explore"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <PropertyCard key={getEntityId(property)} property={property} />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExplorePage;