import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  CalendarDays,
  Users,
  Navigation,
  Clock3,
  X,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/api.js';

const POPULAR_DESTINATIONS = [
  { name: 'Dehradun', state: 'Uttarakhand' },
  { name: 'Mussoorie', state: 'Uttarakhand' },
  { name: 'Rishikesh', state: 'Uttarakhand' },
  { name: 'Haridwar', state: 'Uttarakhand' },
  { name: 'Nainital', state: 'Uttarakhand' },
  { name: 'Shimla', state: 'Himachal Pradesh' },
  { name: 'Manali', state: 'Himachal Pradesh' },
  { name: 'Delhi', state: 'Delhi' },
  { name: 'Jaipur', state: 'Rajasthan' },
  { name: 'Goa', state: 'Goa' },
];

const DEHRADUN_AREAS = [
  'Rajpur Road',
  'Mussoorie Road',
  'Sahastradhara Road',
  'Harrawala',
  'Dalanwala',
];

const STORAGE_KEY = 'takeonbnb_recent_searches';

const getRecentSearches = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveRecentSearch = (city) => {
  if (!city?.trim()) return;

  try {
    const existing = getRecentSearches();

    const updated = [
      city.trim(),
      ...existing.filter(
        (item) =>
          item.toLowerCase() !== city.trim().toLowerCase()
      ),
    ].slice(0, 5);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );
  } catch {
    // Ignore localStorage errors
  }
};

const SearchBar = ({ className = '' }) => {
  const navigate = useNavigate();

  const wrapperRef = useRef(null);

  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);

  const [cities, setCities] = useState([]);
  const [recentSearches, setRecentSearches] = useState(
    getRecentSearches
  );

  const [locationOpen, setLocationOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Load cities from API
  useEffect(() => {
    let mounted = true;

    const loadCities = async () => {
      try {
        const response = await api.get('/properties');

        const apiCities = Array.isArray(response.data)
          ? response.data
              .map((property) =>
                property?.location?.trim()
              )
              .filter(Boolean)
          : [];

        const allCities = [
          ...POPULAR_DESTINATIONS.map(
            (item) => item.name
          ),
          ...apiCities,
        ];

        const uniqueCities = [
          ...new Set(allCities),
        ].sort((a, b) =>
          a.localeCompare(b)
        );

        if (mounted) {
          setCities(uniqueCities);
        }
      } catch (error) {
        console.error(
          'Failed to load destinations:',
          error
        );

        if (mounted) {
          setCities(
            POPULAR_DESTINATIONS.map(
              (item) => item.name
            )
          );
        }
      }
    };

    loadCities();

    return () => {
      mounted = false;
    };
  }, []);

  // Close location dropdown only when clicking OUTSIDE the whole search component
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setLocationOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleOutsideClick
    );

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
      return cities.slice(0, 10);
    }

    return cities
      .filter((city) =>
        city.toLowerCase().includes(query)
      )
      .slice(0, 10);
  }, [cities, location]);

  const handleLocationSelect = (city) => {
    setLocation(city);
    setLocationOpen(false);
    setLocationError('');
  };

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      setLocationError(
        'Location is not supported by your browser.'
      );
      return;
    }

    setIsLocating(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const params = new URLSearchParams();

        params.set(
          'lat',
          String(coords.latitude)
        );

        params.set(
          'lng',
          String(coords.longitude)
        );

        if (checkIn) {
          params.set(
            'checkIn',
            checkIn.toISOString()
          );
        }

        if (checkOut) {
          params.set(
            'checkOut',
            checkOut.toISOString()
          );
        }

        params.set(
          'guests',
          String(guests)
        );

        setIsLocating(false);
        setLocationOpen(false);

        navigate(
          `/search?${params.toString()}`
        );
      },
      (error) => {
        console.error(
          'Geolocation error:',
          error
        );

        setIsLocating(false);

        if (error.code === 1) {
          setLocationError(
            'Please allow location access to use Near Me.'
          );
        } else {
          setLocationError(
            'Unable to detect your location.'
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (location.trim()) {
      params.set(
        'location',
        location.trim()
      );

      saveRecentSearch(location);

      setRecentSearches(
        getRecentSearches()
      );
    }

    if (checkIn) {
      params.set(
        'checkIn',
        checkIn.toISOString()
      );
    }

    if (checkOut) {
      params.set(
        'checkOut',
        checkOut.toISOString()
      );
    }

    params.set(
      'guests',
      String(guests)
    );

    setLocationOpen(false);

    navigate(
      `/search?${params.toString()}`
    );
  };

  const removeRecentSearch = (city) => {
    const updated =
      recentSearches.filter(
        (item) => item !== city
      );

    setRecentSearches(updated);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updated)
      );
    } catch {
      // Ignore localStorage errors
    }
  };

  const today = new Date()
    .toISOString()
    .split('T')[0];

  return (
    <div
      ref={wrapperRef}
      className={`relative z-[50] w-full max-w-[1180px] mx-auto ${className}`}
    >
      {/* Main Search Bar */}
      <div
        className="
          relative z-[60]
          bg-white
          rounded-[28px]
          shadow-[0_12px_40px_rgba(0,0,0,0.16)]
          border border-white/80
          p-2
          flex flex-col
          lg:flex-row
          items-stretch
          lg:items-center
        "
      >
        {/* LOCATION */}
        <div
          className="
            relative
            flex-1
            min-w-0
            px-5
            py-3
            lg:py-4
            rounded-2xl
            hover:bg-gray-50
            transition-colors
          "
        >
          <button
            type="button"
            onClick={() =>
              setLocationOpen(
                (previous) => !previous
              )
            }
            className="w-full text-left"
          >
            <div className="flex items-center gap-4">
              <div
                className="
                  w-12 h-12
                  rounded-2xl
                  bg-orange-50
                  flex items-center
                  justify-center
                  shrink-0
                "
              >
                <MapPin
                  className="w-6 h-6 text-primary"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="
                    text-[12px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-gray-500
                  "
                >
                  Where
                </p>

                <p
                  className={`
                    mt-1
                    text-base
                    font-semibold
                    truncate
                    ${
                      location
                        ? 'text-gray-900'
                        : 'text-gray-400'
                    }
                  `}
                >
                  {location ||
                    'Search city, area or property'}
                </p>
              </div>

              <ChevronDown
                className={`
                  w-5 h-5
                  text-gray-500
                  transition-transform
                  ${
                    locationOpen
                      ? 'rotate-180'
                      : ''
                  }
                `}
              />
            </div>
          </button>

          {/* LOCATION DROPDOWN */}
          {locationOpen && (
            <div
              className="
                absolute
                left-0
                top-[calc(100%+12px)]
                w-full
                lg:w-[760px]
                bg-white
                rounded-3xl
                border border-gray-200
                shadow-[0_20px_60px_rgba(0,0,0,0.18)]
                overflow-hidden
                z-[9999]
              "
              onMouseDown={(event) =>
                event.stopPropagation()
              }
            >
              {/* Search */}
              <div className="p-4 border-b border-gray-100">
                <div
                  className="
                    flex items-center gap-3
                    border-2
                    border-primary/70
                    rounded-2xl
                    px-4
                    py-3
                    bg-white
                  "
                >
                  <Search className="w-5 h-5 text-gray-400" />

                  <input
                    autoFocus
                    type="text"
                    value={location}
                    onChange={(event) =>
                      setLocation(
                        event.target.value
                      )
                    }
                    placeholder="Search city, area or property"
                    className="
                      flex-1
                      outline-none
                      border-none
                      bg-transparent
                      text-gray-900
                      placeholder:text-gray-400
                    "
                  />
                </div>
              </div>

              <div className="grid lg:grid-cols-2">
                {/* LEFT */}
                <div className="p-5 border-b lg:border-b-0 lg:border-r border-gray-100">
                  {/* Near Me */}
                  <button
                    type="button"
                    onClick={handleNearMe}
                    disabled={isLocating}
                    className="
                      w-full
                      flex items-center gap-4
                      p-4
                      rounded-2xl
                      bg-orange-50
                      hover:bg-orange-100
                      transition-colors
                      text-left
                    "
                  >
                    <div
                      className="
                        w-11 h-11
                        rounded-full
                        bg-white
                        flex items-center
                        justify-center
                        shrink-0
                      "
                    >
                      {isLocating ? (
                        <Loader2
                          className="w-5 h-5 text-primary animate-spin"
                        />
                      ) : (
                        <Navigation
                          className="w-5 h-5 text-primary"
                        />
                      )}
                    </div>

                    <div>
                      <p className="font-bold text-gray-900">
                        Use my current location
                      </p>

                      <p className="text-sm text-gray-500 mt-0.5">
                        Find stays around you
                      </p>
                    </div>
                  </button>

                  {locationError && (
                    <p className="text-xs text-red-500 mt-2 px-2">
                      {locationError}
                    </p>
                  )}

                  {/* Popular */}
                  <div className="mt-6">
                    <p
                      className="
                        text-xs
                        font-bold
                        tracking-wider
                        uppercase
                        text-gray-500
                        mb-3
                      "
                    >
                      Popular Destinations
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      {POPULAR_DESTINATIONS.map(
                        (destination) => (
                          <button
                            key={destination.name}
                            type="button"
                            onClick={() =>
                              handleLocationSelect(
                                destination.name
                              )
                            }
                            className="
                              flex items-center
                              gap-3
                              p-3
                              rounded-xl
                              border border-gray-100
                              hover:border-primary/30
                              hover:bg-orange-50
                              transition-all
                              text-left
                            "
                          >
                            <div
                              className="
                                w-9 h-9
                                rounded-lg
                                bg-orange-50
                                flex items-center
                                justify-center
                                shrink-0
                              "
                            >
                              <MapPin
                                className="w-4 h-4 text-primary"
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-gray-900 truncate">
                                {destination.name}
                              </p>

                              <p className="text-[11px] text-gray-500 truncate">
                                {destination.state}
                              </p>
                            </div>
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Matching API cities */}
                  {location.trim() && (
                    <div className="mt-6">
                      <p
                        className="
                          text-xs
                          font-bold
                          uppercase
                          tracking-wider
                          text-gray-500
                          mb-2
                        "
                      >
                        Search Results
                      </p>

                      {filteredCities.length > 0 ? (
                        <div className="space-y-1">
                          {filteredCities.map(
                            (city) => (
                              <button
                                key={city}
                                type="button"
                                onClick={() =>
                                  handleLocationSelect(
                                    city
                                  )
                                }
                                className="
                                  w-full
                                  flex items-center
                                  gap-3
                                  px-3 py-2.5
                                  rounded-xl
                                  hover:bg-gray-50
                                  text-left
                                "
                              >
                                <MapPin
                                  className="w-4 h-4 text-primary"
                                />

                                <span className="text-sm font-medium text-gray-800">
                                  {city}
                                </span>
                              </button>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No destination found.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* RIGHT */}
                <div className="p-5">
                  {/* Recent */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p
                        className="
                          text-xs
                          font-bold
                          uppercase
                          tracking-wider
                          text-gray-500
                        "
                      >
                        Recent Searches
                      </p>
                    </div>

                    {recentSearches.length > 0 ? (
                      <div className="space-y-1">
                        {recentSearches.map(
                          (city) => (
                            <div
                              key={city}
                              className="
                                flex items-center
                                gap-3
                                px-3 py-2.5
                                rounded-xl
                                hover:bg-gray-50
                                group
                              "
                            >
                              <Clock3 className="w-4 h-4 text-gray-400" />

                              <button
                                type="button"
                                onClick={() =>
                                  handleLocationSelect(
                                    city
                                  )
                                }
                                className="flex-1 text-left text-sm font-medium text-gray-800"
                              >
                                {city}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  removeRecentSearch(
                                    city
                                  )
                                }
                                className="
                                  opacity-0
                                  group-hover:opacity-100
                                  p-1
                                  hover:bg-gray-100
                                  rounded-full
                                "
                              >
                                <X className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">
                        Your recent searches will appear here.
                      </p>
                    )}
                  </div>

                  {/* Dehradun Areas */}
                  <div className="mt-7 pt-6 border-t border-gray-100">
                    <p
                      className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-wider
                        text-gray-500
                        mb-3
                      "
                    >
                      Top Areas in Dehradun
                    </p>

                    <div className="space-y-1">
                      {DEHRADUN_AREAS.map(
                        (area) => (
                          <button
                            key={area}
                            type="button"
                            onClick={() =>
                              handleLocationSelect(
                                area
                              )
                            }
                            className="
                              w-full
                              flex items-center
                              justify-between
                              px-3 py-2.5
                              rounded-xl
                              hover:bg-gray-50
                              text-left
                            "
                          >
                            <span className="flex items-center gap-3">
                              <MapPin className="w-4 h-4 text-gray-400" />

                              <span className="text-sm font-medium text-gray-800">
                                {area}
                              </span>
                            </span>

                            <span className="text-gray-400">
                              →
                            </span>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CHECK IN */}
        <div className="flex-1 px-5 py-3 lg:py-4 rounded-2xl hover:bg-gray-50">
          <div className="flex items-center gap-4">
            <div
              className="
                w-12 h-12
                rounded-2xl
                bg-orange-50
                flex items-center
                justify-center
                shrink-0
              "
            >
              <CalendarDays className="w-6 h-6 text-primary" />
            </div>

            <div className="flex-1">
              <label className="block text-[12px] font-bold uppercase tracking-wider text-gray-500">
                Check In
              </label>

              <input
                type="date"
                min={today}
                value={
                  checkIn
                    ? format(
                        checkIn,
                        'yyyy-MM-dd'
                      )
                    : ''
                }
                onChange={(event) => {
                  const date =
                    event.target.value
                      ? new Date(
                          `${event.target.value}T00:00:00`
                        )
                      : null;

                  setCheckIn(date);

                  if (
                    date &&
                    checkOut &&
                    checkOut <= date
                  ) {
                    setCheckOut(null);
                  }
                }}
                className="
                  mt-1
                  w-full
                  bg-transparent
                  border-none
                  outline-none
                  text-base
                  font-semibold
                  text-gray-900
                  p-0
                "
              />
            </div>
          </div>
        </div>

        {/* CHECK OUT */}
        <div className="flex-1 px-5 py-3 lg:py-4 rounded-2xl hover:bg-gray-50">
          <div className="flex items-center gap-4">
            <div
              className="
                w-12 h-12
                rounded-2xl
                bg-orange-50
                flex items-center
                justify-center
                shrink-0
              "
            >
              <CalendarDays className="w-6 h-6 text-primary" />
            </div>

            <div className="flex-1">
              <label className="block text-[12px] font-bold uppercase tracking-wider text-gray-500">
                Check Out
              </label>

              <input
                type="date"
                min={
                  checkIn
                    ? format(
                        new Date(
                          checkIn.getTime() +
                            86400000
                        ),
                        'yyyy-MM-dd'
                      )
                    : today
                }
                value={
                  checkOut
                    ? format(
                        checkOut,
                        'yyyy-MM-dd'
                      )
                    : ''
                }
                onChange={(event) => {
                  const date =
                    event.target.value
                      ? new Date(
                          `${event.target.value}T00:00:00`
                        )
                      : null;

                  setCheckOut(date);
                }}
                className="
                  mt-1
                  w-full
                  bg-transparent
                  border-none
                  outline-none
                  text-base
                  font-semibold
                  text-gray-900
                  p-0
                "
              />
            </div>
          </div>
        </div>

        {/* GUESTS */}
        <div className="flex-1 px-5 py-3 lg:py-4 rounded-2xl hover:bg-gray-50">
          <div className="flex items-center gap-4">
            <div
              className="
                w-12 h-12
                rounded-2xl
                bg-orange-50
                flex items-center
                justify-center
                shrink-0
              "
            >
              <Users className="w-6 h-6 text-primary" />
            </div>

            <div className="flex-1">
              <label className="block text-[12px] font-bold uppercase tracking-wider text-gray-500">
                Guests
              </label>

              <select
                value={guests}
                onChange={(event) =>
                  setGuests(
                    Number(event.target.value)
                  )
                }
                className="
                  mt-1
                  w-full
                  bg-transparent
                  border-none
                  outline-none
                  text-base
                  font-semibold
                  text-gray-900
                  p-0
                  cursor-pointer
                "
              >
                {Array.from(
                  { length: 10 },
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
          </div>
        </div>

        {/* SEARCH BUTTON */}
        <div className="p-2">
          <button
            type="button"
            onClick={handleSearch}
            className="
              w-full
              lg:w-auto
              h-14
              lg:h-[64px]
              px-7
              rounded-2xl
              bg-primary
              hover:bg-primary/90
              text-white
              font-bold
              flex items-center
              justify-center
              gap-3
              shadow-lg
              transition-all
              duration-200
              hover:scale-[1.02]
              active:scale-[0.98]
            "
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;