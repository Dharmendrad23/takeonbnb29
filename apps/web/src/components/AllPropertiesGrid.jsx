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

        console.log("Fetching properties from MongoDB API...");

        const response = await api.get("/properties");

        console.log("Properties API response:", response.data);

        let propertyData = [];

        if (Array.isArray(response.data)) {
          propertyData = response.data;
        } else if (Array.isArray(response.data?.properties)) {
          propertyData = response.data.properties;
        } else if (Array.isArray(response.data?.items)) {
          propertyData = response.data.items;
        }

        // Sirf approved/live properties frontend par show hongi
        const liveProperties = propertyData.filter((property) => {
          const status = String(
            property.status || property.approvalStatus || ""
          ).toLowerCase();

          return (
            status === "approved" ||
            status === "live" ||
            status === "active"
          );
        });

        console.log("Live properties:", liveProperties);

        setProperties(liveProperties);
      } catch (err) {
        console.error("Failed to fetch properties:", err);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load properties"
        );
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
            All Properties
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
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />

          <h3 className="text-xl font-bold text-foreground mb-2">
            Unable to load properties
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
            No properties available
          </h3>

          <p className="text-muted-foreground">
            No approved properties are currently available.
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
            <div key={prop.id || prop._id || idx} className="w-full">
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