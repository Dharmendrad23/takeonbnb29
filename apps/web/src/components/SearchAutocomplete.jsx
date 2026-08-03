import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Loader2 } from 'lucide-react';
import api from '@/lib/api.js';
import { formatCurrency } from '@/lib/bookingUtils.js';
import { Input } from '@/components/ui/input';

const SearchAutocomplete = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      setIsOpen(true);

      try {
       const { data } = await api.get("/properties");

const filtered = (data || [])
  .filter(
    (p) =>
      p.title?.toLowerCase().includes(query.toLowerCase()) ||
      p.location?.toLowerCase().includes(query.toLowerCase())
  )
  .slice(0, 5);

setResults(filtered);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSelect = (propertyId) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/property/${propertyId}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-sm">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search destinations or properties..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          className="pl-9 pr-4 py-2 rounded-full bg-muted/50 border-transparent focus-visible:ring-primary focus-visible:bg-background transition-smooth"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 w-4 h-4 text-muted-foreground animate-spin" />
        )}
      </div>

      {isOpen && (query.trim().length > 0) && (
        <div className="absolute top-full mt-2 w-full bg-card rounded-2xl shadow-hover border border-border overflow-hidden z-50">
          {results.length > 0 ? (
            <ul className="max-h-[400px] overflow-y-auto py-2">
              {results.map((property) => (
                <li key={property.id}>
                  <button
                    onClick={() => handleSelect(property.id)}
                    className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      {property.photos?.[0] ? (
                        <img
                          src={property.photos?.[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-foreground truncate">{property.title}</h4>
                      <p className="text-xs text-muted-foreground truncate">{property.location}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-sm font-bold text-foreground">{formatCurrency(property.pricePerNight)}</span>
                      <span className="text-xs text-muted-foreground block">/night</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : !isLoading ? (
            <div className="p-6 text-center text-muted-foreground text-sm">
              No properties found matching "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;