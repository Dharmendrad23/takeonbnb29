import React, { useEffect, useState } from "react";
import { Search, SlidersHorizontal, Home, RefreshCw } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import PropertyCardSkeleton from "@/components/PropertyCardSkeleton";
import api from "@/lib/api";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

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

  // Search properties
  useEffect(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      setFilteredProperties(properties);
      return;
    }

    const filtered = properties.filter((property) => {
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

      return (
        title.includes(query) ||
        String(location).toLowerCase().includes(query) ||
        propertyType.includes(query)
      );
    });

    setFilteredProperties(filtered);
  }, [search, properties]);

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
              className="h-14 px-6 rounded-xl border border-border bg-background flex items-center justify-center gap-2 font-semibold hover:bg-muted transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>

          </div>

        </div>
      </section>

      {/* PROPERTIES */}
      <section className="max-w-7xl mx-auto px-4 py-12">

        {!loading && !error && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold">
              Available Properties
            </h2>

            <p className="text-muted-foreground mt-1">
              {filteredProperties.length} properties found
            </p>
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