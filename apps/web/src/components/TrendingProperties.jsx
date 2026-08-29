import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";

import PropertyCard from "./PropertyCard";
import PropertyCardSkeleton from "./PropertyCardSkeleton";
import api from "@/lib/api.js";

export default function TrendingProperties() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps",
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProperties = async () => {
      try {
        setLoading(true);

        const response = await api.get("/properties", {
          params: {
            status: "approved",
          },
        });

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

        const approvedProperties = propertyList.filter(
          (property) =>
            String(property?.status || "approved").toLowerCase() ===
            "approved"
        );

        if (mounted) {
          setProperties(approvedProperties);
        }
      } catch (error) {
        console.error("Property loading error:", error);

        if (mounted) {
          setProperties([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProperties();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* SECTION HEADER */}
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Trending Properties
            </h2>

            <p className="mt-1.5 text-sm text-gray-500 sm:text-base">
              Discover amazing stays and unique experiences
            </p>
          </div>

          {/* DESKTOP ARROWS */}
          {!loading && properties.length > 1 && (
            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow-md"
                aria-label="Previous properties"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow-md"
                aria-label="Next properties"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && properties.length === 0 && (
          <div className="py-16 text-center">
            <Home
              className="mx-auto mb-4 text-gray-400"
              size={48}
            />

            <h3 className="text-xl font-bold text-gray-900">
              No Properties Found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Approved properties will appear here.
            </p>
          </div>
        )}

        {/* PROPERTY CAROUSEL */}
        {!loading && properties.length > 0 && (
          <div
            ref={emblaRef}
            className="overflow-hidden"
          >
            <div className="flex gap-4 sm:gap-5">

              {properties.map((property, index) => (
                <div
                  key={property?._id || property?.id || index}
                  className="
                    min-w-0
                    flex-[0_0_86%]
                    sm:flex-[0_0_47%]
                    lg:flex-[0_0_23.5%]
                  "
                >
                  <PropertyCard property={property} />
                </div>
              ))}

            </div>
          </div>
        )}

        {/* MOBILE ARROWS */}
        {!loading && properties.length > 1 && (
          <div className="mt-5 flex justify-center gap-2 sm:hidden">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm"
              aria-label="Previous properties"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm"
              aria-label="Next properties"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
