import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  MapPin,
  CalendarDays,
  Users,
  Search,
  ChevronDown,
  Loader2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api.js';

const HeroBanner = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  const locationRef = useRef(null);

  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');

  const [cities, setCities] = useState([]);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Today's date in YYYY-MM-DD format
  const today = useMemo(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }, []);

  /*
   * Load locations only once.
   * We only need location names here, not the complete property UI.
   */
  useEffect(() => {
    let mounted = true;

    const fetchCities = async () => {
      try {
        setIsLoadingCities(true);
        setLocationError('');

        const response = await api.get('/properties');

        const data = Array.isArray(response?.data)
          ? response.data
          : [];

        const popularCities = [
          'Dehradun',
          'Mussoorie',
          'Rishikesh',
          'Haridwar',
          'Nainital',
          'Shimla',
          'Manali',
          'Jaipur',
          'Goa',
        ];

        const uniqueCities = [
          ...new Set([
            ...popularCities,
            ...data
              .map((property) => property?.location?.trim())
              .filter(Boolean),
          ]),
        ].sort((a, b) => a.localeCompare(b));

        if (mounted) {
          setCities(uniqueCities);
        }
      } catch (error) {
        console.error('Failed to load city suggestions:', error);

        if (mounted) {
          setLocationError('');
          setCities([
            'Dehradun',
            'Mussoorie',
            'Rishikesh',
            'Haridwar',
            'Nainital',
            'Shimla',
            'Manali',
            'Jaipur',
            'Goa',
          ]);
        }
      } finally {
        if (mounted) {
          setIsLoadingCities(false);
        }
      }
    };

    fetchCities();

    return () => {
      mounted = false;
    };
  }, []);

  // Close location dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target)
      ) {
        setIsLocationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      );
    };
  }, []);

  const filteredCities = useMemo(() => {
    const query = location.trim().toLowerCase();

    if (!query) {
      return cities.slice(0, 8);
    }

    return cities
      .filter((city) =>
        city.toLowerCase().includes(query)
      )
      .slice(0, 8);
  }, [cities, location]);

  const handleCheckInChange = (event) => {
    const value = event.target.value;

    setCheckIn(value);

    // Reset checkout if it becomes invalid
    if (checkOut && value && checkOut <= value) {
      setCheckOut('');
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (location.trim()) {
      params.set('location', location.trim());
    }

    if (checkIn) {
      params.set('checkIn', checkIn);
    }

    if (checkOut) {
      params.set('checkOut', checkOut);
    }

    if (guests) {
      params.set('guests', guests);
    }

    setIsLocationOpen(false);

    navigate({
      pathname: '/search',
      search: `?${params.toString()}`,
    });
  };

  const clearLocation = () => {
    setLocation('');
    setIsLocationOpen(true);
  };

  return (
    <section className="relative min-h-[680px] md:h-[88vh] md:min-h-[650px] flex items-center justify-center overflow-visible">
      {/* Background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 z-0 scale-[1.02] pointer-events-none overflow-hidden"
      >
        <img
          src="https://images.unsplash.com/photo-1663601982929-51e28aab0444"
          alt="Luxury modern villa with infinity pool"
          className="w-full h-full object-cover"
          loading="eager"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/75" />
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 md:pt-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          <p className="text-primary font-bold text-sm md:text-base uppercase tracking-[0.2em] mb-4">
            Stay. Explore. Experience.
          </p>

          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
            Discover Your Perfect{' '}
            <span className="text-primary italic">
              Getaway
            </span>
          </h1>

          <p className="text-white/85 text-base sm:text-lg md:text-xl mt-5 max-w-2xl mx-auto">
            Find handpicked villas, homestays and unique stays
            for your next unforgettable trip.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative z-[200] max-w-6xl mx-auto mt-8 md:mt-10"
        >
          <form
            onSubmit={handleSearch}
            className="
              bg-background/95 backdrop-blur-xl
              rounded-3xl md:rounded-[2rem]
              shadow-2xl
              border border-white/20
              p-2 md:p-3
            "
          >
            <div className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr_1fr_0.85fr_auto] gap-1 md:gap-0 items-stretch">
              {/* Location */}
              <div
                ref={locationRef}
                className="
                  relative
                  rounded-2xl
                  hover:bg-muted/60
                  transition-colors
                  text-left
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setIsLocationOpen((open) => !open)
                  }
                  className="w-full h-full px-4 py-3 md:px-5 md:py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <span className="block text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">
                        Where
                      </span>

                      <span
                        className={`block truncate text-sm md:text-base font-semibold ${
                          location
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {location || 'Search destinations'}
                      </span>
                    </div>

                    {location ? (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(event) => {
                          event.stopPropagation();
                          clearLocation();
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.stopPropagation();
                            clearLocation();
                          }
                        }}
                        className="p-1 rounded-full hover:bg-muted"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </span>
                    ) : (
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground transition-transform ${
                          isLocationOpen
                            ? 'rotate-180'
                            : ''
                        }`}
                      />
                    )}
                  </div>
                </button>

                {isLocationOpen && (
                  <div className="absolute left-0 right-0 md:left-2 md:right-auto md:w-[420px] top-[calc(100%+10px)] bg-background rounded-2xl border border-border shadow-2xl overflow-hidden z-[9999]">
                    <div className="p-3 border-b border-border">
                      <button
                        type="button"
                        onClick={() => {
                          if (!navigator.geolocation) {
                            setLocationError('Location is not supported by your browser');
                            return;
                          }

                          setIsLoadingCities(true);
                          setLocationError('');

                          navigator.geolocation.getCurrentPosition(
                            ({ coords }) => {
                              const params = new URLSearchParams();
                              params.set('lat', String(coords.latitude));
                              params.set('lng', String(coords.longitude));

                              if (checkIn) params.set('checkIn', checkIn);
                              if (checkOut) params.set('checkOut', checkOut);
                              if (guests) params.set('guests', guests);

                              setIsLoadingCities(false);
                              setIsLocationOpen(false);

                              navigate({
                                pathname: '/search',
                                search: `?${params.toString()}`,
                              });
                            },
                            (error) => {
                              console.error('Geolocation error:', error);
                              setIsLoadingCities(false);
                              setLocationError(
                                error.code === 1
                                  ? 'Please allow location access to use Near Me.'
                                  : 'Unable to detect your location.'
                              );
                            },
                            {
                              enableHighAccuracy: true,
                              timeout: 10000,
                              maximumAge: 300000,
                            }
                          );
                        }}
                        className="w-full flex items-center gap-3 px-3 py-3 mb-3 rounded-xl bg-primary/10 hover:bg-primary/15 transition-colors text-left"
                      >
                        <div className="w-9 h-9 rounded-lg bg-background flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <span className="block font-bold text-sm text-foreground">
                            Near Me
                          </span>
                          <span className="block text-xs text-muted-foreground mt-0.5">
                            Find stays close to your current location
                          </span>
                        </div>
                      </button>

                      <input
                        type="text"
                        autoFocus
                        value={location}
                        onChange={(event) => {
                          setLocation(event.target.value);
                        }}
                        placeholder="Search city..."
                        className="
                          w-full h-11 px-4
                          rounded-xl
                          bg-muted/60
                          border border-border
                          outline-none
                          text-sm font-medium
                          focus:border-primary
                          focus:ring-2 focus:ring-primary/20
                        "
                      />
                    </div>

                    <div className="max-h-72 overflow-y-auto p-2">
                      {isLoadingCities ? (
                        <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground text-sm">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading destinations...
                        </div>
                      ) : locationError ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                          {locationError}
                        </div>
                      ) : filteredCities.length > 0 ? (
                        <>
                          <p className="px-3 py-2 text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase">
                            {location.trim()
                              ? 'Matching destinations'
                              : 'Popular destinations'}
                          </p>

                          {filteredCities.map((city) => (
                            <button
                              key={city}
                              type="button"
                              onClick={() => {
                                setLocation(city);
                                setIsLocationOpen(false);
                              }}
                              className="
                                w-full flex items-center gap-3
                                px-3 py-3
                                rounded-xl
                                text-left
                                hover:bg-muted
                                transition-colors
                              "
                            >
                              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <MapPin className="w-4 h-4 text-primary" />
                              </div>

                              <span className="font-semibold text-sm text-foreground">
                                {city}
                              </span>
                            </button>
                          ))}
                        </>
                      ) : (
                        <div className="py-8 text-center">
                          <MapPin className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm font-semibold">
                            No destination found
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Try another city
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Check In */}
              <div className="rounded-2xl hover:bg-muted/60 transition-colors text-left">
                <label className="flex items-center gap-3 h-full px-4 py-3 md:px-5 md:py-4 cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <CalendarDays className="w-5 h-5 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">
                      Check in
                    </span>

                    <input
                      type="date"
                      value={checkIn}
                      min={today}
                      onChange={handleCheckInChange}
                      className="
                        w-full
                        bg-transparent
                        border-none
                        outline-none
                        p-0
                        text-sm md:text-base
                        font-semibold
                        text-foreground
                        cursor-pointer
                      "
                    />
                  </div>
                </label>
              </div>

              {/* Check Out */}
              <div className="rounded-2xl hover:bg-muted/60 transition-colors text-left">
                <label className="flex items-center gap-3 h-full px-4 py-3 md:px-5 md:py-4 cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <CalendarDays className="w-5 h-5 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">
                      Check out
                    </span>

                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn || today}
                      disabled={!checkIn}
                      onChange={(event) =>
                        setCheckOut(event.target.value)
                      }
                      className="
                        w-full
                        bg-transparent
                        border-none
                        outline-none
                        p-0
                        text-sm md:text-base
                        font-semibold
                        text-foreground
                        cursor-pointer
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                      "
                    />
                  </div>
                </label>
              </div>

              {/* Guests */}
              <div className="rounded-2xl hover:bg-muted/60 transition-colors text-left">
                <label className="flex items-center gap-3 h-full px-4 py-3 md:px-5 md:py-4 cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">
                      Guests
                    </span>

                    <select
                      value={guests}
                      onChange={(event) =>
                        setGuests(event.target.value)
                      }
                      className="
                        w-full
                        bg-transparent
                        border-none
                        outline-none
                        p-0
                        text-sm md:text-base
                        font-semibold
                        text-foreground
                        cursor-pointer
                      "
                    >
                      {Array.from(
                        { length: 8 },
                        (_, index) => index + 1
                      ).map((count) => (
                        <option
                          key={count}
                          value={count}
                        >
                          {count}{' '}
                          {count === 1
                            ? 'Guest'
                            : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>
              </div>

              {/* Search */}
              <div className="p-1 md:p-2 flex items-center">
                <Button
                  type="submit"
                  className="
                    w-full
                    md:w-auto
                    min-w-[120px]
                    h-12 md:h-14
                    rounded-2xl
                    bg-primary
                    hover:bg-primary/90
                    text-primary-foreground
                    font-bold
                    shadow-lg
                    hover:shadow-xl
                    transition-all
                    active:scale-[0.98]
                  "
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-5 text-white/80 text-xs md:text-sm font-medium">
            <span>✓ Verified stays</span>
            <span>✓ Secure booking</span>
            <span>✓ Best available stays</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroBanner;