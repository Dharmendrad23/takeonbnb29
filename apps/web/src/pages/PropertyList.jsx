import React, { useEffect, useState } from "react";
import { Search, SlidersHorizontal, Loader2, Home } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import PropertyCardSkeleton from "@/components/PropertyCardSkeleton";
import api from "@/lib/api";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Load all properties
  useEffect(() => {
    async function loadProperties() {
      try {
        setLoading(true);

        // SAME API AS HOME PAGE
        const { data } = await api.get("/properties");

        console.log("Properties:", data);

        const propertyData = Array.isArray(data)
          ? data
          : data?.properties || data?.data || [];

        setProperties(propertyData);
        setFilteredProperties(propertyData);
      } catch (error) {
        console.error("Failed to load properties:", error);
        setProperties([]);
        setFilteredProperties([]);
      } finally {
        setLoading(false);
      }
    }

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
      const title = property?.title || "";

      const location =
        typeof property?.location === "string"
          ? property.location
          : property?.location?.city ||
            property?.location?.address ||
            property?.city ||
            "";

      return (
        title.toLowerCase().includes(query) ||
        location.toLowerCase().includes(query)
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
                placeholder="Search by property name or location..."
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

        {!loading && (
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

        {/* NO PROPERTY */}
        {!loading && filteredProperties.length === 0 && (
          <div className="py-24 text-center">

            <Home
              className="mx-auto mb-5 text-muted-foreground"
              size={60}
            />

            <h2 className="text-2xl font-bold">
              No Properties Found
            </h2>

            <p className="text-muted-foreground mt-2">
              No properties are available at the moment.
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
        {!loading && filteredProperties.length > 0 && (
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