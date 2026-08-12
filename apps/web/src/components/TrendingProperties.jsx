import React, { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import PropertyCard from "./PropertyCard";
import PropertyCardSkeleton from "./PropertyCardSkeleton";

export default function TrendingProperties() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get("/properties");
        setProperties(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex justify-between mb-10">
          <h2 className="text-3xl font-bold">
            Trending Properties
          </h2>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => emblaApi?.scrollPrev()}
            >
              <ChevronLeft />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => emblaApi?.scrollNext()}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <Home className="mx-auto mb-4" size={50} />
            <h2>No Properties Found</h2>
          </div>
        ) : (
          <div className="embla" ref={emblaRef}>
            <div className="embla__container">
              {properties.map((property) => (
                <motion.div
                  key={property.id || property._id}
                  className="embla__slide"
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

