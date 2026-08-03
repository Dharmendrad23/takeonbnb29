
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Calendar, Users, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from "axios";

const HeroBanner = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');
  const [cities, setCities] = useState([]);

  useEffect(() => {
   const fetchCities = async () => {
  try {
    const { data } = await axios.get("/api/properties");

    const uniqueCities = Array.from(
      new Set(
        data
          .map((record) => record.location?.trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));

    setCities(uniqueCities);
  } catch (err) {
    console.error("Failed to load city suggestions:", err);
  }
};
    fetchCities();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set('location', location.trim());
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);

    navigate({ pathname: '/search', search: params.toString() });
  };

  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1663601982929-51e28aab0444" 
          alt="Luxury modern villa with infinity pool at dusk" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-white mb-6 text-balance">
            Discover Your Perfect <span className="text-primary italic">Getaway</span>
          </h1>
          <p className="text-xl text-gray-200 mb-12 font-medium">
            Luxury vacation rentals at your fingertips
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card max-w-5xl mx-auto p-3"
        >
          <form
            className="flex flex-col md:flex-row items-center gap-2 divide-y md:divide-y-0 md:divide-x divide-border/50"
            onSubmit={handleSearch}
          >
            
            {/* Location */}
            <div className="w-full md:w-1/3 p-3 flex items-center gap-3">
              <MapPin className="text-primary w-5 h-5 flex-shrink-0" />
              <div className="flex-1 text-left">
                <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1">Where</label>
                <input 
                  type="text" 
                  placeholder="Search destinations" 
                  className="w-full bg-transparent border-none p-0 text-foreground font-medium focus:ring-0 placeholder:text-muted-foreground placeholder:font-normal"
                  list="destinations"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <datalist id="destinations">
                  {cities.length > 0 ? cities.map((city) => (
                    <option key={city} value={city} />
                  )) : (
                    [
                      'Bali',
                      'Maldives',
                      'Swiss Alps',
                      'Tuscany',
                      'Santorini',
                      'Dubai'
                    ].map((city) => <option key={city} value={city} />)
                  )}
                </datalist>
              </div>
            </div>

            {/* Check in / Check out */}
            <div className="w-full md:w-1/3 p-3 flex items-center gap-3">
              <Calendar className="text-primary w-5 h-5 flex-shrink-0" />
              <div className="flex-1 flex text-left gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1">Check in</label>
                  <input
                    type="date"
                    className="w-full bg-transparent border-none p-0 text-foreground font-medium focus:ring-0 cursor-pointer"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1">Check out</label>
                  <input
                    type="date"
                    className="w-full bg-transparent border-none p-0 text-foreground font-medium focus:ring-0 cursor-pointer"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Guests */}
            <div className="w-full md:w-1/4 p-3 flex items-center gap-3">
              <Users className="text-primary w-5 h-5 flex-shrink-0" />
              <div className="flex-1 text-left">
                <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1">Guests</label>
                <select
                  className="w-full bg-transparent border-none p-0 text-foreground font-medium focus:ring-0 cursor-pointer"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5 Guests</option>
                  <option value="6">6 Guests</option>
                  <option value="7">7 Guests</option>
                  <option value="8">8+ Guests</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <div className="w-full md:w-auto p-2">
              <Button type="submit" size="lg" className="w-full h-14 md:w-14 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-brand">
                <Search className="w-5 h-5 md:mr-0 mr-2" />
                <span className="md:hidden font-semibold text-base">Search</span>
              </Button>
            </div>

          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroBanner;
