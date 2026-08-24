import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import api from '@/lib/api.js';

const SearchBar = ({ className = '' }) => {
  const navigate = useNavigate();

  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);

  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showLocation, setShowLocation] = useState(false);

  const locationRef = useRef(null);

  /* GET LOCATIONS */
  useEffect(() => {
    const getCities = async () => {
      try {
        const { data } = await api.get('/properties');

        const counts = {};

        (data || []).forEach((property) => {
          const city = property.location?.trim();

          if (city) {
            counts[city] = (counts[city] || 0) + 1;
          }
        });

        const result = Object.entries(counts)
          .map(([name, count]) => ({
            name,
            count,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCities(result);
        setFilteredCities(result);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }
    };

    getCities();
  }, []);

  /* FILTER LOCATIONS */
  useEffect(() => {
    if (!location.trim()) {
      setFilteredCities(cities);
      return;
    }

    const search = location.toLowerCase();

    setFilteredCities(
      cities.filter((city) =>
        city.name.toLowerCase().includes(search)
      )
    );
  }, [location, cities]);

  /* CLOSE LOCATION DROPDOWN */
  useEffect(() => {
    const handleClick = (event) => {
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target)
      ) {
        setShowLocation(false);
      }
    };

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  /* SAME SEARCH PATH */
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (location) {
      params.append('location', location);
    }

    if (checkIn) {
      params.append('checkIn', checkIn.toISOString());
    }

    if (checkOut) {
      params.append('checkOut', checkOut.toISOString());
    }

    if (guests > 1) {
      params.append('guests', guests.toString());
    }

    navigate(`/search?${params.toString()}`);
  };

  return (




  














    <div className={`w-full ${className}`}>

      {/* ==============================
          AIRBNB STYLE SEARCH BAR
      =============================== */}




        



  









      <div
        className="
          w-full
          max-w-[850px]
          h-[66px]
          mx-auto
          bg-white
          border
          border-gray-300
          rounded-full
          shadow-[0_3px_12px_rgba(0,0,0,0.12)]
          flex
          items-center
          p-1
        "
      >

        {/* ==========================
            WHERE
        =========================== */}

        <div
          ref={locationRef}
          className="relative flex-1 h-full min-w-0"
        >
          <div
            onClick={() => setShowLocation(true)}
            className="
              h-full
              px-6
              rounded-full
              flex
              flex-col
              justify-center
              cursor-text
              hover:bg-gray-100
              transition
            "
          >
            <span className="text-[11px] font-bold text-gray-900">
              Where
            </span>

            <input
              type="text"
              value={location}
              placeholder="Search destinations"
              onChange={(e) => {
                setLocation(e.target.value);
                setShowLocation(true);
              }}
              onFocus={() => setShowLocation(true)}
              className="
                w-full
                mt-0.5
                p-0
                bg-transparent
                border-0
                outline-none
                focus:ring-0
                text-sm
                text-gray-700
                placeholder:text-gray-500
              "
            />
          </div>

          {/* LOCATION LIST */}

          {showLocation && (
            <div
              className="
                absolute
                left-0
                top-[72px]
                z-[9999]
                w-[380px]
                max-w-[90vw]
                bg-white
                rounded-2xl
                border
                border-gray-200
                shadow-[0_10px_35px_rgba(0,0,0,0.18)]
                overflow-hidden
              "
            >
              <div className="max-h-[330px] overflow-y-auto py-2">

                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <button
                      key={city.name}
                      type="button"
                      onClick={() => {
                        setLocation(city.name);
                        setShowLocation(false);
                      }}
                      className="
                        w-full
                        px-5
                        py-3
                        flex
                        items-center
                        gap-4
                        text-left
                        hover:bg-gray-100
                      "
                    >
                      <div
                        className="
                          w-10
                          h-10
                          rounded-xl
                          bg-gray-100
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <MapPin className="w-5 h-5 text-gray-700" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {city.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {city.count} properties
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-6 text-center text-sm text-gray-500">
                    No locations found
                  </div>
                )}

              </div>
            </div>
          )}
        </div>

        {/* DIVIDER */}

        <div className="w-px h-8 bg-gray-300" />

        {/* ==========================
            WHEN
        =========================== */}

        <div className="flex-1 h-full min-w-0">

          <Popover>

            <PopoverTrigger asChild>

              <button
                type="button"
                className="
                  w-full
                  h-full
                  px-6
                  rounded-full
                  flex
                  flex-col
                  justify-center
                  text-left
                  hover:bg-gray-100
                  transition
                "
              >
                <span className="text-[11px] font-bold text-gray-900">
                  When
                </span>

                <span className="text-sm text-gray-500 mt-0.5 truncate">
                  {checkIn && checkOut
                    ? `${format(checkIn, 'MMM d')} – ${format(checkOut, 'MMM d')}`
                    : checkIn
                    ? format(checkIn, 'MMM d')
                    : 'Add dates'}
                </span>
              </button>

            </PopoverTrigger>

            <PopoverContent
              className="w-auto p-4 rounded-2xl"
              align="center"
            >

              <div className="flex gap-6">

                <div>
                  <p className="text-sm font-semibold mb-2">
                    Check in
                  </p>

                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={setCheckIn}
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold mb-2">
                    Check out
                  </p>

                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    disabled={(date) =>
                      checkIn ? date < checkIn : false
                    }
                  />
                </div>

              </div>

            </PopoverContent>

          </Popover>

        </div>

        {/* DIVIDER */}

        <div className="w-px h-8 bg-gray-300" />

        {/* ==========================
            WHO
        =========================== */}

        <div
          className="
            flex-1
            h-full
            min-w-0
            px-6
            rounded-full
            flex
            flex-col
            justify-center
            hover:bg-gray-100
          "
        >
          <span className="text-[11px] font-bold text-gray-900">
            Who
          </span>

          <input
            type="number"
            min="1"
            value={guests}
            onChange={(e) =>
              setGuests(parseInt(e.target.value, 10) || 1)
            }
            className="
              w-full
              mt-0.5
              p-0
              bg-transparent
              border-0
              outline-none
              focus:ring-0
              text-sm
              text-gray-700
            "
            placeholder="Add guests"
          />
        </div>

        {/* ==========================
            SEARCH BUTTON
        =========================== */}

        <button
          type="button"
          onClick={handleSearch}
          className="
            w-[54px]
            h-[54px]
            min-w-[54px]
            rounded-full
            bg-[#FF385C]
            hover:bg-[#E31C5F]
            text-white
            flex
            items-center
            justify-center
            ml-1
            transition
            duration-200
            hover:scale-105
            active:scale-95
          "
        >
          <Search className="w-5 h-5 stroke-[2.5]" />
        </button>

      </div>
    </div>
  );
};

export default SearchBar;