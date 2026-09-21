import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import api from "@/lib/api.js";
import PropertyCard from "@/components/PropertyCard.jsx";
import PropertyCardSkeleton from "@/components/PropertyCardSkeleton.jsx";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const location = searchParams.get("location") || "";
  const guests = searchParams.get("guests") || "1";
  const typeFilter = searchParams.get("type") || "All";
  const sortFilter = searchParams.get("sort") || "-created";

  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchResults = async () => {
      try {
        setIsLoading(true);
        setError("");

        console.log("Loading properties from MongoDB API...");

        const response = await api.get("/properties");

        console.log("Properties API response:", response.data);

        const result = response.data;

        let propertyList = [];

        if (Array.isArray(result)) {
          propertyList = result;
        } else if (Array.isArray(result?.properties)) {
          propertyList = result.properties;
        } else if (Array.isArray(result?.items)) {
          propertyList = result.items;
        } else if (Array.isArray(result?.data)) {
          propertyList = result.data;
        }

        console.log("Parsed property list:", propertyList);

        // Only approved properties
        let filtered = propertyList.filter((property) => {
          const status = String(property?.status || "").toLowerCase();

          return (
            status === "approved" ||
            status === "live" ||
            status === "" ||
            !property?.status
          );
        });

        // Location search
        if (location.trim()) {
          const searchLocation = location.toLowerCase().trim();

          filtered = filtered.filter((property) => {
            const title = String(property?.title || "").toLowerCase();

            const city = String(
              property?.city ||
                property?.location?.city ||
                ""
            ).toLowerCase();

            const address = String(
              property?.address ||
                property?.location?.address ||
                property?.location?.name ||
                ""
            ).toLowerCase();

            return (
              title.includes(searchLocation) ||
              city.includes(searchLocation) ||
              address.includes(searchLocation)
            );
          });
        }

        // Property type filter
        if (typeFilter !== "All") {
          const wantedType = typeFilter.toLowerCase();

          filtered = filtered.filter((property) => {
            const propertyType = String(
              property?.propertyType ||
                property?.type ||
                ""
            ).toLowerCase();

            return (
              propertyType.includes(wantedType) ||
              wantedType.includes(propertyType)
            );
          });
        }

        // Guest filter
        const guestsNum = parseInt(guests, 10);

        if (!Number.isNaN(guestsNum) && guestsNum > 1) {
          filtered = filtered.filter((property) => {
            const capacity = Number(
              property?.guestCapacity ||
                property?.maxGuests ||
                property?.guests ||
                property?.maxGuest ||
                0
            );

            // If capacity is unavailable, keep property visible
            if (!capacity) return true;

            return capacity >= guestsNum;
          });
        }

        // Sorting
        filtered.sort((a, b) => {
          if (sortFilter === "pricePerNight") {
            return (
              Number(a?.pricePerNight || 0) -
              Number(b?.pricePerNight || 0)
            );
          }

          if (sortFilter === "-pricePerNight") {
            return (
              Number(b?.pricePerNight || 0) -
              Number(a?.pricePerNight || 0)
            );
          }

          if (sortFilter === "-rating") {
            return (
              Number(b?.rating || 0) -
              Number(a?.rating || 0)
            );
          }

          // Newest first
          const dateA = new Date(
            a?.createdAt || a?.created || 0
          ).getTime();

          const dateB = new Date(
            b?.createdAt || b?.created || 0
          ).getTime();

          return dateB - dateA;
        });

        if (mounted) {
          setProperties(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch properties:", err);

        if (mounted) {
          setProperties([]);
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load properties"
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      mounted = false;
    };
  }, [location, guests, typeFilter, sortFilter]);

  const handleTypeChange = (value) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value === "All") {
      nextParams.delete("type");
    } else {
      nextParams.set("type", value);
    }

    setSearchParams(nextParams);
  };

  const handleSortChange = (value) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("sort", value);
    setSearchParams(nextParams);
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-24 animate-fade-in">
      <Helmet>
        <title>Search Results | Take on BNB</title>

        <meta
          name="description"
          content="Discover premium vacation rentals and properties on Take on BNB. Book your perfect stay today."
        />
      </Helmet>

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {properties.length}{" "}
              {properties.length === 1 ? "stay" : "stays"}

              {location ? ` in ${location}` : ""}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Discover your perfect stay with Take on BNB.
            </p>
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap items-center gap-3">

            <Select
              value={sortFilter}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="min-h-[48px] w-[180px] rounded-xl border-border bg-card">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="-created">
                  Newest
                </SelectItem>

                <SelectItem value="pricePerNight">
                  Price: Low to High
                </SelectItem>

                <SelectItem value="-pricePerNight">
                  Price: High to Low
                </SelectItem>

                <SelectItem value="-rating">
                  Highest Rated
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={typeFilter}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger className="min-h-[48px] w-[160px] rounded-xl border-border bg-card">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="All">
                  All Types
                </SelectItem>

                <SelectItem value="Villas">
                  Villas
                </SelectItem>

                <SelectItem value="Hotels">
                  Hotels
                </SelectItem>

                <SelectItem value="Apartments">
                  Apartments
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="min-h-[48px] rounded-xl bg-card"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
            <p className="font-semibold text-red-700">
              Unable to load properties
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>

            <Button
              className="mt-4 rounded-xl"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* LOADING */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))}
          </div>
        ) : properties.length === 0 ? (
          /* EMPTY */
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="rounded-3xl border border-border bg-card py-24 text-center shadow-sm"
          >
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />

            <h3 className="mb-2 text-xl font-bold text-foreground">
              No Properties Found
            </h3>

            <p className="mx-auto mb-6 max-w-md text-muted-foreground">
              Try changing your search or property type filter.
            </p>

            <Button
              variant="secondary"
              onClick={() => handleTypeChange("All")}
              className="min-h-[48px] rounded-xl"
            >
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          /* PROPERTY GRID */
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {properties.map((property, index) => (
              <PropertyCard
                key={
                  property?._id ||
                  property?.id ||
                  `property-${index}`
                }
                property={property}
                index={index}
              />
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;