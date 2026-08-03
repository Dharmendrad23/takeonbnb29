
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import api from '@/lib/api.js';

const SearchBar = ({ className }) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);

  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setIsLoadingLocations(true);
        setLocationError(null);
        const { data } = await api.get("/properties");

const cityCounts = (data || []).reduce((acc, record) => {
  const city = record.location?.trim();
  if (city) {
    acc[city] = (acc[city] || 0) + 1;
  }
  return acc;
}, {});

const cityArray = Object.entries(cityCounts)
  .map(([name, count]) => ({ name, count }))
  .sort((a, b) => a.name.localeCompare(b.name));

setCities(cityArray);
        setFilteredCities(cityArray);
      } catch (error) {
        console.error('Failed to fetch cities:', error);
        setLocationError('Unable to load locations');
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    if (!location.trim()) {
      setFilteredCities(cities);
    } else {
      const lowerQuery = location.toLowerCase();
      const filtered = cities.filter(city =>
        city.name.toLowerCase().includes(lowerQuery)
      );
      setFilteredCities(filtered);
    }
  }, [location, cities]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setIsAutocompleteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    setIsAutocompleteOpen(false);
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (checkIn) params.append('checkIn', checkIn.toISOString());
    if (checkOut) params.append('checkOut', checkOut.toISOString());
    if (guests > 1) params.append('guests', guests.toString());

    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto bg-card rounded-[2rem] md:rounded-full shadow-xl border border-border/80 divide-y md:divide-y-0 md:divide-x divide-border p-2.5 transition-all duration-300 focus-within:shadow-2xl relative ${className}`}>
      <div className="flex flex-col md:flex-row items-center w-full relative z-20">

        {/* Location */}
        <div ref={autocompleteRef} className="flex-1 w-full md:w-auto px-6 py-4 md:py-2 hover:bg-muted/60 rounded-[1.5rem] md:rounded-full transition-colors duration-200 cursor-text group relative">
          <label className="block text-xs font-bold text-foreground mb-1 uppercase tracking-wider">Where</label>
          <input
            type="text"
            placeholder="Search destinations"
            className="w-full bg-transparent border-none outline-none text-base text-foreground font-medium placeholder:text-muted-foreground focus:ring-0 p-0"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setIsAutocompleteOpen(true);
            }}
            onFocus={() => setIsAutocompleteOpen(true)}
          />

          {isAutocompleteOpen && (
            <div className="absolute top-[120%] left-0 w-full md:w-[400px] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden z-[100]">
              <div className="max-h-[350px] overflow-y-auto py-2">
                {isLoadingLocations ? (
                  <div className="flex items-center justify-center p-6 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Loading destinations...
                  </div>
                ) : locationError ? (
                  <div className="flex flex-col items-center justify-center p-6 text-destructive text-center">
                    <AlertCircle className="w-6 h-6 mb-2" />
                    <p className="text-sm font-medium">{locationError}</p>
                  </div>
                ) : filteredCities.length > 0 ? (
                  <ul>
                    {filteredCities.map((city) => (
                      <li key={city.name}>
                        <button
                          type="button"
                          onClick={() => {
                            setLocation(city.name);
                            setIsAutocompleteOpen(false);
                          }}
                          className="w-full text-left px-5 py-3.5 flex items-center gap-4 hover:bg-muted/60 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-bold text-foreground truncate">{city.name}</h4>
                            <p className="text-sm font-medium text-muted-foreground mt-0.5">{city.count} properties</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    <p className="font-medium text-foreground">No locations found</p>
                    <p className="text-sm mt-1">Try a different search term</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Check In */}
        <div className="flex-1 w-full md:w-auto px-6 py-4 md:py-2 hover:bg-muted/60 rounded-[1.5rem] md:rounded-full transition-colors duration-200 cursor-pointer group">
          <Popover>
            <PopoverTrigger asChild>
              <div className="w-full text-left outline-none">
                <label className="block text-xs font-bold text-foreground cursor-pointer mb-1 uppercase tracking-wider">Check in</label>
                <div className="text-base font-medium text-muted-foreground truncate">
                  {checkIn ? format(checkIn, 'MMM dd, yyyy') : 'Add dates'}
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
              <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        {/* Check Out */}
        <div className="flex-1 w-full md:w-auto px-6 py-4 md:py-2 hover:bg-muted/60 rounded-[1.5rem] md:rounded-full transition-colors duration-200 cursor-pointer group">
          <Popover>
            <PopoverTrigger asChild>
              <div className="w-full text-left outline-none">
                <label className="block text-xs font-bold text-foreground cursor-pointer mb-1 uppercase tracking-wider">Check out</label>
                <div className="text-base font-medium text-muted-foreground truncate">
                  {checkOut ? format(checkOut, 'MMM dd, yyyy') : 'Add dates'}
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
              <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests & Search Button */}
        <div className="flex-1 w-full md:w-auto pl-6 pr-2 py-3 md:py-2 hover:bg-muted/60 rounded-[1.5rem] md:rounded-full transition-colors duration-200 flex items-center justify-between group">
          <div className="flex-1 pr-4">
            <label className="block text-xs font-bold text-foreground mb-1 uppercase tracking-wider">Who</label>
            <input
              type="number"
              min="1"
              placeholder="Add guests"
              className="w-full bg-transparent border-none outline-none text-base font-medium text-foreground placeholder:text-muted-foreground focus:ring-0 p-0"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
            />
          </div>
          <Button
            onClick={handleSearch}
            className="bg-primary hover:bg-primary/90 text-primary-foreground p-4 md:px-8 md:py-7 rounded-full flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 shadow-brand"
          >
            <Search className="w-5 h-5 stroke-[2.5]" />
            <span className="hidden md:inline font-bold text-lg">Search</span>
          </Button>
        </div>

      </div>
    </div>
  );
};

export default SearchBar;
