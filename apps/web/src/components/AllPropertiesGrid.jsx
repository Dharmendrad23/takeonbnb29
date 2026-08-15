import React, { useState, useEffect } from "react";
import api from "@/lib/api.js";
import SwappingPropertyCard from "@/components/SwappingPropertyCard.jsx";
import PropertyCardSkeleton from "@/components/PropertyCardSkeleton.jsx";
import { AlertCircle } from "lucide-react";

const AllPropertiesGrid = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Loading homepage properties from MongoDB API...");

        const response = await api.get("/properties");

        console.log("Homepage API response:", response.data);

        // API different formats handle karega
        const propertyData = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.properties)
            ? response.data.properties
            : Array.isArray(response.data?.items)
              ? response.data.items
              : Array.isArray(response.data?.data)
                ? response.data.data
                : [];

        console.log("Total properties received:", propertyData.length);

        // Sirf approved properties website par show hongi
        const approvedProperties = propertyData.filter((property) => {
          const status = String(property?.status || "")
            .trim()
            .toLowerCase();

          return status === "approved";
        });

        console.log(
          "Approved properties:",
          approvedProperties.length
        );

        setProperties(approvedProperties);
      } catch (err) {
        console.error(
          "Failed to fetch homepage properties:",
          err
        );

        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load properties"
        );

        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Explore All Stays
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />

          <h3 className="text-xl font-bold text-foreground mb-2">
            Properties could not be loaded
          </h3>

          <p className="text-muted-foreground">
            {error}
          </p>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />

          <h3 className="text-xl font-bold text-foreground mb-2">
            No Properties Found
          </h3>

          <p className="text-muted-foreground">
            Approved properties will appear here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background border-y border-border/50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-10">
          <h2 className="text-[24px] md:text-[32px] font-bold text-foreground tracking-tight">
            Explore All Stays
          </h2>

          <p className="text-muted-foreground mt-2">
            Discover our complete collection of premium properties
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {properties.map((prop, idx) => (
            <div
              key={prop?._id || prop?.id || idx}
              className="w-full"
            >
              <SwappingPropertyCard
                property={prop}
                interval={5000 + (idx % 4) * 1000}
                delay={idx * 800}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AllPropertiesGrid;