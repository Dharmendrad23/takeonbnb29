import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import api from '@/lib/api.js';
import { MapPin, Star, Filter, Search } from 'lucide-react';
import { formatCurrency } from '@/lib/bookingUtils.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CategoryFilter = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || '';
  
  const pathCategoryMap = {
    '/villas': 'Villa',
    '/hotels': 'Hotel',
    '/bnb': 'BnB'
  };
  const currentCategory = pathCategoryMap[location.pathname] || '';

  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      let filterParts = [`approvalStatus = "approved"`];
      
      if (currentCategory) {
        filterParts.push(`propertyCategory = "${currentCategory}"`);
      }
      
      if (searchTerm) {
        filterParts.push(`(title ~ "${searchTerm}" || location ~ "${searchTerm}")`);
      }
      
      if (searchLocation) {
        filterParts.push(`location ~ "${searchLocation}"`);
      }
      
      if (minPrice) {
        filterParts.push(`pricePerNight >= ${minPrice}`);
      }
      
      if (maxPrice) {
        filterParts.push(`pricePerNight <= ${maxPrice}`);
      }

      const filterStr = filterParts.join(' && ');

      const records = await pb.collection('properties').getList(currentPage, 20, {
        filter: filterStr,
        expand: 'amenities',
        sort: '-created',
        $autoCancel: false
      });
      
      setProperties(records.items);
      setTotalPages(records.totalPages);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [currentCategory, currentPage]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProperties();
  };

  const pageTitle = currentCategory ? `${currentCategory}s` : 'Properties';

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <Helmet><title>{pageTitle} | Take On BnB</title></Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filters */}
        <div className="flex flex-col gap-6 mb-10 border-b border-border pb-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">{pageTitle}</h1>
            <p className="text-muted-foreground text-lg">
              Explore our collection of premium {pageTitle.toLowerCase()}.
            </p>
          </div>
          
          <form onSubmit={handleFilterSubmit} className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Search</label>
              <Input 
                placeholder="Name or keyword..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Location</label>
              <Input 
                placeholder="City or region..." 
                value={searchLocation} 
                onChange={e => setSearchLocation(e.target.value)} 
              />
            </div>
            <div className="w-24">
              <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Min ₹</label>
              <Input 
                type="number" 
                placeholder="0" 
                value={minPrice} 
                onChange={e => setMinPrice(e.target.value)} 
              />
            </div>
            <div className="w-24">
              <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Max ₹</label>
              <Input 
                type="number" 
                placeholder="Any" 
                value={maxPrice} 
                onChange={e => setMaxPrice(e.target.value)} 
              />
            </div>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <Search className="w-4 h-4 mr-2" /> Apply
            </Button>
          </form>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-72 bg-muted animate-pulse rounded-2xl"></div>)}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-24 bg-muted/30 rounded-3xl border border-border border-dashed">
            <h3 className="text-xl font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground mb-6">We couldn't find any {currentCategory.toLowerCase()}s matching your criteria.</p>
            <Button onClick={() => {
              setSearchTerm('');
              setSearchLocation('');
              setMinPrice('');
              setMaxPrice('');
              setCurrentPage(1);
              setTimeout(fetchProperties, 0);
            }}>Clear Filters</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {properties.map(property => (
                <Link key={property.id} to={`/property/${property.id}`} className="group flex flex-col">
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-muted">
                    {property.photos?.length > 0 ? (
                      <img 
                        src={pb.files.getUrl(property, property.photos[0])} 
                        alt={property.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
                    )}
                    <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-medium shadow-sm">
                      <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                      {property.rating || 'New'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">{property.title}</h3>
                    <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" /> {property.location}
                    </p>
                  </div>
                  <div className="mt-2 text-foreground font-medium">
                    {formatCurrency(property.pricePerNight)} <span className="text-muted-foreground font-normal text-sm">/ night</span>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <Button 
                  variant="outline" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
                <Button 
                  variant="outline" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default CategoryFilter;