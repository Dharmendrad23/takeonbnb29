import React, { useEffect, useState } from "react";
import { Search, SlidersHorizontal, Home, RefreshCw, X, Check } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import PropertyCardSkeleton from "@/components/PropertyCardSkeleton";
import api from "@/lib/api";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // FILTERS
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState("all");
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [minGuests, setMinGuests] = useState(0);
  const [amenities, setAmenities] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("recommended");

  // Load properties directly from database API
  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Loading properties from API...");

      const response = await api.get("/properties");

      console.log("Properties API response:", response.data);

      // Support multiple backend response formats
      const propertyData = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.properties)
          ? response.data.properties
          : Array.isArray(response.data?.items)
            ? response.data.items
            : Array.isArray(response.data?.data)
              ? response.data.data
              : [];

      // Show all properties except explicitly rejected/pending ones
      const visibleProperties = propertyData.filter((property) => {
        return (
          property?.status !== "pending" &&
          property?.status !== "rejected"
        );
      });

      console.log("Visible properties:", visibleProperties);

      setProperties(visibleProperties);
      setFilteredProperties(visibleProperties);
    } catch (error) {
      console.error("Failed to load properties:", error);

      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load properties."
      );

      setProperties([]);
      setFilteredProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  // Search + Filters + Sorting
  useEffect(() => {
    const query = search.toLowerCase().trim();

    let filtered = properties.filter((property) => {
      const title = String(property?.title || "").toLowerCase();

      const location =
        typeof property?.location === "string"
          ? property.location
          : property?.location?.city ||
            property?.location?.address ||
            property?.location?.name ||
            property?.city ||
            "";

      const propertyType = String(
        property?.propertyType || property?.type || ""
      ).toLowerCase();

      // Search
      const matchesSearch =
        !query ||
        title.includes(query) ||
        String(location).toLowerCase().includes(query) ||
        propertyType.includes(query);

      // Price
      const price = Number(
        property?.pricePerNight ||
        property?.price ||
        property?.nightlyPrice ||
        0
      );

      let matchesPrice = true;

      if (priceRange === "under2000") {
        matchesPrice = price < 2000;
      } else if (priceRange === "2000to5000") {
        matchesPrice = price >= 2000 && price <= 5000;
      } else if (priceRange === "5000to10000") {
        matchesPrice = price > 5000 && price <= 10000;
      } else if (priceRange === "over10000") {
        matchesPrice = price > 10000;
      }

      // Property type
      const matchesType =
        propertyTypes.length === 0 ||
        propertyTypes.some(
          (type) => propertyType === type.toLowerCase()
        );

      // Guests
      const guests = Number(
        property?.maxGuests ||
        property?.guests ||
        property?.capacity ||
        0
      );

      const matchesGuests =
        minGuests === 0 || guests >= minGuests;

      // Amenities
      const propertyAmenities = Array.isArray(property?.amenities)
        ? property.amenities
            .map((item) =>
              typeof item === "string"
                ? item.toLowerCase()
                : String(
                    item?.name ||
                    item?.title ||
                    item?.label ||
                    ""
                  ).toLowerCase()
            )
        : [];

      const matchesAmenities =
        amenities.length === 0 ||
        amenities.every((requiredAmenity) => {
          const name = requiredAmenity.toLowerCase();

          return (
            propertyAmenities.some((a) => a.includes(name)) ||
            (name === "pool" && (property?.pool || property?.hasPool)) ||
            (name === "parking" &&
              (property?.parking ||
                property?.freeParking ||
                property?.hasParking)) ||
            (name === "bonfire" &&
              (property?.bonfire || property?.hasBonfire)) ||
            (name === "garden" &&
              (property?.garden || property?.hasGarden)) ||
            (name === "wifi" &&
              (property?.wifi || property?.hasWifi)) ||
            (name === "ac" &&
              (property?.ac || property?.hasAC))
          );
        });

      // Rating
      const rating = Number(property?.rating || 0);

      const matchesRating =
        !minRating || rating >= minRating;

      return (
        matchesSearch &&
        matchesPrice &&
        matchesType &&
        matchesGuests &&
        matchesAmenities &&
        matchesRating
      );
    });

    // Sorting
    if (sortBy === "priceLow") {
      filtered.sort(
        (a, b) =>
          Number(a?.pricePerNight || a?.price || 0) -
          Number(b?.pricePerNight || b?.price || 0)
      );
    }

    if (sortBy === "priceHigh") {
      filtered.sort(
        (a, b) =>
          Number(b?.pricePerNight || b?.price || 0) -
          Number(a?.pricePerNight || a?.price || 0)
      );
    }

    if (sortBy === "rating") {
      filtered.sort(
        (a, b) =>
          Number(b?.rating || 0) -
          Number(a?.rating || 0)
      );
    }

    setFilteredProperties(filtered);
  }, [
    search,
    properties,
    priceRange,
    propertyTypes,
    minGuests,
    amenities,
    minRating,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-background">

      {/* HEADER */}
      <section className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 py-12">

          <h1 className="text-3xl md:text-5xl font-bold">
            Explore Properties
          </h1>

          <p className="text-muted-foreground mt-3 text-lg">
            Discover amazing stays and book your perfect getaway.
          </p>

          {/* SEARCH BAR */}
          <div className="mt-8 flex flex-col md:flex-row gap-3">

            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by property name, location..."
                className="w-full h-14 pl-12 pr-4 rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
  type="button"
  onClick={() => setShowFilters(true)}
  className="h-14 px-6 rounded-xl border border-border bg-background flex items-center justify-center gap-2 font-semibold hover:bg-muted transition-colors"
>
  <SlidersHorizontal className="w-5 h-5" />
  Filters
  {(priceRange !== "all" ||
    propertyTypes.length > 0 ||
    minGuests > 0 ||
    amenities.length > 0 ||
    minRating > 0) && (
    <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
      {[
        priceRange !== "all",
        propertyTypes.length > 0,
        minGuests > 0,
        amenities.length > 0,
        minRating > 0,
      ].filter(Boolean).length}
    </span>
  )}
</button>

          </div>

        </div>
      </section>

      {/* FILTER DRAWER */}
      {showFilters && (
        <div className="fixed inset-0 z-[100]">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setShowFilters(false)}
          />

          {/* DRAWER */}
          <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl">
            {/* HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Filters
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Find your perfect stay
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-7 px-6 py-6">

              {/* PRICE */}
              <div>
                <h3 className="mb-3 font-semibold text-gray-900">
                  Price per night
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["under2000", "Under ₹2,000"],
                    ["2000to5000", "₹2,000 – ₹5,000"],
                    ["5000to10000", "₹5,000 – ₹10,000"],
                    ["over10000", "₹10,000+"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setPriceRange(
                          priceRange === value ? "all" : value
                        )
                      }
                      className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                        priceRange === value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* PROPERTY TYPE */}
              <div>
                <h3 className="mb-3 font-semibold text-gray-900">
                  Property type
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Villa",
                    "Apartment",
                    "House",
                    "Cottage",
                    "Farmhouse",
                    "Resort",
                  ].map((type) => {
                    const selected = propertyTypes.includes(type);

                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setPropertyTypes((current) =>
                            selected
                              ? current.filter((item) => item !== type)
                              : [...current, type]
                          )
                        }
                        className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-sm font-medium transition ${
                          selected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded border ${
                            selected
                              ? "border-primary bg-primary text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {selected && (
                            <Check className="h-3.5 w-3.5" />
                          )}
                        </span>
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* GUESTS */}
              <div>
                <h3 className="mb-3 font-semibold text-gray-900">
                  Guests
                </h3>

                <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold">
                      Minimum guests
                    </p>
                    <p className="text-xs text-gray-500">
                      Property can accommodate
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setMinGuests((value) => Math.max(0, value - 1))
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-lg hover:bg-gray-100"
                    >
                      −
                    </button>

                    <span className="w-6 text-center font-bold">
                      {minGuests || "Any"}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setMinGuests((value) => Math.min(20, value + 1))
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-lg hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* AMENITIES */}
              <div>
                <h3 className="mb-3 font-semibold text-gray-900">
                  Amenities
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Pool",
                    "Parking",
                    "WiFi",
                    "Bonfire",
                    "Garden",
                    "AC",
                  ].map((amenity) => {
                    const selected = amenities.includes(amenity);

                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() =>
                          setAmenities((current) =>
                            selected
                              ? current.filter((item) => item !== amenity)
                              : [...current, amenity]
                          )
                        }
                        className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-sm font-medium transition ${
                          selected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded border ${
                            selected
                              ? "border-primary bg-primary text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {selected && (
                            <Check className="h-3.5 w-3.5" />
                          )}
                        </span>
                        {amenity}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RATING */}
              <div>
                <h3 className="mb-3 font-semibold text-gray-900">
                  Guest rating
                </h3>

                <div className="grid grid-cols-3 gap-2">
                  {[4.5, 4, 3].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() =>
                        setMinRating(
                          minRating === rating ? 0 : rating
                        )
                      }
                      className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                        minRating === rating
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      ★ {rating}+
                    </button>
                  ))}
                </div>
              </div>

              {/* SORT */}
              <div>
                <h3 className="mb-3 font-semibold text-gray-900">
                  Sort by
                </h3>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium outline-none focus:border-primary"
                >
                  <option value="recommended">
                    Recommended
                  </option>
                  <option value="priceLow">
                    Price: Low to High
                  </option>
                  <option value="priceHigh">
                    Price: High to Low
                  </option>
                  <option value="rating">
                    Rating: High to Low
                  </option>
                </select>
              </div>

            </div>

            {/* FOOTER */}
            <div className="sticky bottom-0 border-t bg-white px-6 py-4">
              <div className="flex items-center justify-between gap-3">

                <button
                  type="button"
                  onClick={() => {
                    setPriceRange("all");
                    setPropertyTypes([]);
                    setMinGuests(0);
                    setAmenities([]);
                    setMinRating(0);
                    setSortBy("recommended");
                  }}
                  className="px-3 py-3 text-sm font-semibold text-gray-600 underline hover:text-gray-900"
                >
                  Clear all
                </button>

                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="flex-1 rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
                >
                  Show {filteredProperties.length} properties
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
      {/* PROPERTIES */}
      <section className="max-w-7xl mx-auto px-4 py-12">

        {!loading && !error && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold">
              Available Properties
            </h2>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="py-24 text-center">
            <Home
              className="mx-auto mb-5 text-destructive"
              size={60}
            />

            <h2 className="text-2xl font-bold">
              Properties Load Nahi Ho Rahi
            </h2>

            <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
              {error}
            </p>

            <button
              type="button"
              onClick={loadProperties}
              className="mt-6 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

        {/* NO PROPERTY */}
        {!loading && !error && filteredProperties.length === 0 && (
          <div className="py-24 text-center">

            <Home
              className="mx-auto mb-5 text-muted-foreground"
              size={60}
            />

            <h2 className="text-2xl font-bold">
              {search
                ? "No Matching Properties Found"
                : "No Properties Found"}
            </h2>

            <p className="text-muted-foreground mt-2">
              {search
                ? "Try searching with another property name or location."
                : "No properties are available at the moment."}
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-6 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                Clear Search
              </button>
            )}

          </div>
        )}

        {/* PROPERTY GRID */}
        {!loading && !error && filteredProperties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {filteredProperties.map((property, index) => (
              <PropertyCard
                key={property?._id || property?.id || index}
                property={property}
              />
            ))}

          </div>
        )}

      </section>
    </div>
  );
};

export default PropertyList;





