import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ChevronDown, Minus, Plus } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import api from "@/lib/api.js";

const SearchBar = ({ className = "" }) => {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);

  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showLocation, setShowLocation] = useState(false);
  const [showGuests, setShowGuests] = useState(false);

  const locationRef = useRef(null);
  const guestsRef = useRef(null);

  /* =========================
     GET LOCATIONS
  ========================= */

  useEffect(() => {
    const getCities = async () => {
      try {
        const { data } = await api.get("/properties");

        const counts = {};

        const properties = Array.isArray(data)
          ? data
          : Array.isArray(data?.properties)
            ? data.properties
            : Array.isArray(data?.items)
              ? data.items
              : Array.isArray(data?.data)
                ? data.data
                : [];

        properties.forEach((property) => {
          const city =
            typeof property?.location === "string"
              ? property.location.trim()
              : property?.location?.city?.trim?.() || "";

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
        console.error("Failed to fetch locations:", error);
      }
    };

    getCities();
  }, []);

  /* =========================
     FILTER LOCATIONS
  ========================= */

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

  /* =========================
     CLOSE DROPDOWNS
  ========================= */

  useEffect(() => {
    const handleClick = (event) => {
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target)
      ) {
        setShowLocation(false);
      }

      if (
        guestsRef.current &&
        !guestsRef.current.contains(event.target)
      ) {
        setShowGuests(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  /* =========================
     TOTAL GUESTS
  ========================= */

  const totalGuests =
    adults + children + infants + pets;

  /* =========================
     SEARCH
  ========================= */

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (location.trim()) {
      params.append("location", location.trim());
    }

    if (checkIn) {
      params.append("checkIn", checkIn.toISOString());
    }

    if (checkOut) {
      params.append("checkOut", checkOut.toISOString());
    }

    if (totalGuests > 0) {
      params.append("guests", totalGuests.toString());
    }

    navigate(`/search?${params.toString()}`);
  };

  /* =========================
     GUEST ROW
  ========================= */

  const GuestRow = ({
    title,
    subtitle,
    value,
    setValue,
    showDivider = true,
    pet = false,
  }) => (
    <div
      className={`py-5 ${
        showDivider ? "border-b border-gray-200" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-6">
        <div className="min-w-0">
          <p className="text-[16px] font-semibold text-gray-900">
            {title}
          </p>

          {pet ? (
            <button
              type="button"
              className="text-sm text-gray-400 underline font-medium hover:text-gray-600 transition"
            >
              Bringing a service animal?
            </button>
          ) : (
            <p className="text-sm text-gray-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            disabled={value === 0}
            onClick={() =>
              setValue((current) => Math.max(0, current - 1))
            }
            className="
              w-8
              h-8
              rounded-full
              border
              border-gray-200
              bg-gray-100
              flex
              items-center
              justify-center
              text-gray-500
              disabled:opacity-40
              disabled:cursor-not-allowed
              hover:border-gray-400
              hover:bg-gray-200
              transition
            "
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="w-4 text-center text-[16px] text-gray-900">
            {value}
          </span>

          <button
            type="button"
            onClick={() =>
              setValue((current) => current + 1)
            }
            className="
              w-8
              h-8
              rounded-full
              border
              border-gray-200
              bg-gray-100
              flex
              items-center
              justify-center
              text-gray-900
              hover:border-gray-400
              hover:bg-gray-200
              transition
            "
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`w-full ${className}`}>
      <div
        className="
          relative
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

        {/* =========================
            WHERE
        ========================= */}

        <div
          ref={locationRef}
          className="relative flex-1 h-full min-w-0"
        >
          <div
            onClick={() => {
              setShowLocation(true);
              setShowGuests(false);
            }}
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
                setShowGuests(false);
              }}
              onFocus={() => {
                setShowLocation(true);
                setShowGuests(false);
              }}
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

          {/* LOCATION DROPDOWN */}

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
              <div className="px-5 pt-5 pb-2">
                <p className="text-sm font-medium text-gray-700">
                  Suggested destinations
                </p>
              </div>

              <div className="max-h-[380px] overflow-y-auto py-2">
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
                        transition
                      "
                    >
                      <div
                        className="
                          w-11
                          h-11
                          rounded-xl
                          bg-gray-100
                          flex
                          items-center
                          justify-center
                          shrink-0
                        "
                      >
                        <MapPin className="w-5 h-5 text-primary" />
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

        <div className="w-px h-8 bg-gray-200 shrink-0" />

        {/* =========================
            WHEN
        ========================= */}

        <div className="flex-1 h-full min-w-0">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                onClick={() => {
                  setShowLocation(false);
                  setShowGuests(false);
                }}
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
                    ? `${format(checkIn, "MMM d")} – ${format(
                        checkOut,
                        "MMM d"
                      )}`
                    : checkIn
                      ? format(checkIn, "MMM d")
                      : "Add dates"}
                </span>
              </button>
            </PopoverTrigger>

            <PopoverContent
              className="w-auto p-5 rounded-3xl"
              align="center"
            >
              <p className="text-sm font-semibold mb-3">
                Select your stay
              </p>

              <Calendar
                mode="range"
                selected={{
                  from: checkIn || undefined,
                  to: checkOut || undefined,
                }}
                onSelect={(range) => {
                  setCheckIn(range?.from || null);
                  setCheckOut(range?.to || null);
                }}
                numberOfMonths={2}
                disabled={(date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date < today) {
    return true;
  }

  if (checkIn && !checkOut && date < checkIn) {
    return true;
  }

  return false;
}}
                className="rounded-xl"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* DIVIDER */}

        <div className="w-px h-8 bg-gray-200 shrink-0" />

        {/* =========================
            WHO
        ========================= */}

        <div
          ref={guestsRef}
          className="relative flex-1 h-full min-w-0"
        >
          <button
            type="button"
            onClick={() => {
              setShowGuests((current) => !current);
              setShowLocation(false);
            }}
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
              Who
            </span>

            <span className="text-sm text-gray-500 mt-0.5 truncate">
              {totalGuests > 0
                ? `${totalGuests} ${
                    totalGuests === 1 ? "guest" : "guests"
                  }`
                : "Add guests"}
            </span>
          </button>

          {/* =========================
              GUEST POPUP
          ========================= */}

          {showGuests && (
            <div
              className="
                absolute
                right-0
                top-[72px]
                z-[9999]
                w-[420px]
                max-w-[calc(100vw-24px)]
                bg-white
                rounded-3xl
                border
                border-gray-100
                shadow-[0_8px_30px_rgba(0,0,0,0.16)]
                px-7
                py-2
              "
            >
              <GuestRow
                title="Adults"
                subtitle="Ages 13 or above"
                value={adults}
                setValue={setAdults}
              />

              <GuestRow
                title="Children"
                subtitle="Ages 2–12"
                value={children}
                setValue={setChildren}
              />

              <GuestRow
                title="Infants"
                subtitle="Under 2"
                value={infants}
                setValue={setInfants}
              />

              <GuestRow
                title="Pets"
                subtitle=""
                value={pets}
                setValue={setPets}
                pet
                showDivider={false}
              />
            </div>
          )}
        </div>

        {/* =========================
            SEARCH
        ========================= */}

        <button
          type="button"
          onClick={handleSearch}
          className="
            w-[54px]
            h-[54px]
            min-w-[54px]
            rounded-full
            bg-primary
            hover:bg-primary/90
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

