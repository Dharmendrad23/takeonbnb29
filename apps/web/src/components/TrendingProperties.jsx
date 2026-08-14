import React, { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard from "./PropertyCard";
import PropertyCardSkeleton from "./PropertyCardSkeleton";

const API_URL = "https://takeonbnb29.onrender.com/api/properties";

export default function TrendingProperties() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProperties() {
      try {
        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load properties: ${response.status}`);
        }

        const result = await response.json();

        // API array ya object dono handle karega
        const propertyList = Array.isArray(result)
          ? result
          : result.properties || result.data || [];

        setProperties(propertyList);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Property loading error:", error);
        }
      } finally {
        setLoading(false);
      }
    }

    loadProperties();

    return () => controller.abort();
  }, []);

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Trending Properties
            </h2>

            <p className="text-muted-foreground mt-2">
              Discover amazing stays and unique experiences
            </p>
          </div>

          {properties.length > 1 && (
            <div className="hidden md:flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => emblaApi?.scrollPrev()}
                aria-label="Previous properties"
              >
                <ChevronLeft />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => emblaApi?.scrollNext()}
                aria-label="Next properties"
              >
                <ChevronRight />
              </Button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <Home className="mx-auto mb-4 text-primary" size={50} />

            <h2 className="text-2xl font-bold mb-2">
              No Properties Found
            </h2>

            <p className="text-muted-foreground">
              New properties will appear here soon.
            </p>
          </div>
        ) : (
          <div className="embla overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex gap-6">
              {properties.map((property) => (
                <motion.div
                  key={property._id || property.id}
                  className="embla__slide flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_30%]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}