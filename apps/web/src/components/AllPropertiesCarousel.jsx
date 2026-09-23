import React, { useState, useEffect, useMemo } from "react";
import { Home } from "lucide-react";
import pb from "@/lib/pocketbaseClient";
import SwappingPropertyCard from "@/components/SwappingPropertyCard.jsx";
import PropertyCardSkeleton from "@/components/PropertyCardSkeleton.jsx";

const AllPropertiesCarousel = ({ category = "All" }) => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchProperties = async () => {
      try {
        const records = await pb.collection("properties").getList(1, 500, {
          filter: 'status="Live"',
          sort: "-created",
          $autoCancel: false,
        });

        if (mounted) {
          setProperties(records.items || []);
        }
      } catch (err) {
        console.error("Failed to fetch properties", err);
        if (mounted) {
          setProperties([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProperties();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredProperties = useMemo(() => {
    if (category === "All") return properties;

    return properties.filter(
      (property) =>
        String(property?.propertyType || "").toLowerCase() ===
        String(category).toLowerCase()
    );
  }, [properties, category]);

  if (isLoading) {
    return (
      <section className="py-16 bg-[#F3F4F6] border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-64 bg-muted rounded-xl animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PropertyCardSkeleton />
            <PropertyCardSkeleton />
            <PropertyCardSkeleton />
          </div>
        </div>
      </section>
    );
  }

  if (filteredProperties.length === 0) {
    return (
      <section className="py-16 bg-[#F3F4F6] border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Home className="w-8 h-8 text-muted-foreground" />
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">
            No swap properties found
          </h2>

          <p className="text-muted-foreground">
            No live properties are currently available for Property Swap.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-[#F3F4F6] border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-10">
          <span className="text-xs font-bold tracking-[0.2em] text-[#F97316] uppercase">
            Property Swap
          </span>

          <h2 className="mt-2 text-[28px] md:text-[34px] font-bold text-foreground tracking-tight">
            Swap & Stay
          </h2>

          <p className="text-muted-foreground mt-2">
            Discover properties available for your next stay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property, index) => (
            <SwappingPropertyCard
              key={property?.id || index}
              property={property}
              interval={6000}
              delay={index * 500}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default AllPropertiesCarousel;
