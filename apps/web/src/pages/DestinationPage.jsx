import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import api from "@/lib/api.js";
import PropertyGrid from "@/components/PropertyGrid.jsx";

const DestinationPage = () => {
  const { location } = useParams();

  const formattedLocation = location
    ? location.charAt(0).toUpperCase() + location.slice(1)
    : "Destination";

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchDestinationProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get("/properties", {
          params: {
            status: "approved",
          },
        });

        const data = response.data;

        const propertyList = Array.isArray(data)
          ? data
          : Array.isArray(data?.properties)
            ? data.properties
            : Array.isArray(data?.items)
              ? data.items
              : Array.isArray(data?.data)
                ? data.data
                : [];

        const destinationProperties = propertyList.filter((property) => {
          const propertyLocation = String(
            property?.location || ""
          ).toLowerCase();

          const propertyTitle = String(
            property?.title || property?.name || ""
          ).toLowerCase();

          const searchLocation =
            String(formattedLocation || "").toLowerCase();

          return (
            propertyLocation.includes(searchLocation) ||
            propertyTitle.includes(searchLocation)
          );
        });

        if (mounted) {
          setProperties(destinationProperties);
        }
      } catch (err) {
        console.error(
          "Error fetching destination properties:",
          err
        );

        if (mounted) {
          setProperties([]);
          setError(
            err?.response?.data?.message ||
            err?.message ||
            `Failed to load properties for ${formattedLocation}.`
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (location) {
      fetchDestinationProperties();
    } else {
      setLoading(false);
      setProperties([]);
    }

    return () => {
      mounted = false;
    };
  }, [location, formattedLocation]);

  return (
    <div className="min-h-screen bg-background pt-28 pb-12 animate-in fade-in">
      <Helmet>
        <title>
          {`Stays in ${formattedLocation} | TakeOn BnB`}
        </title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
          Discover {formattedLocation}
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl">
          Explore our exclusive collection of luxury stays
          and experiences in {formattedLocation}.
        </p>
      </div>

      <PropertyGrid
        properties={properties}
        isLoading={loading}
        error={error}
        title={`Properties in ${formattedLocation}`}
        subtitle={`Real approved properties available in ${formattedLocation}`}
      />
    </div>
  );
};

export default DestinationPage;
