import { useEffect, useState } from "react";
import api from "../lib/api";
import PropertyCard from "./PropertyCard";

export default function MountainVillas() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await api.get("/properties", {
          params: { status: "approved" },
        });

        const result = response.data;

        const safeData = Array.isArray(result)
          ? result
          : Array.isArray(result?.properties)
          ? result.properties
          : Array.isArray(result?.items)
          ? result.items
          : Array.isArray(result?.data)
          ? result.data
          : [];

        const filtered = safeData.filter((p) => {
          const location = String(p?.location || "").toLowerCase();
          const title = String(p?.title || p?.name || "").toLowerCase();

          return (
            location.includes("mountain") ||
            title.includes("mountain") ||
            location.includes("mussoorie") ||
            location.includes("manali") ||
            location.includes("shimla")
          );
        });

        setProperties(filtered);
      } catch (error) {
        console.error("Error fetching mountain villas:", error);
        setProperties([]);
      }
    }

    fetchProperties();
  }, []);

  if (!Array.isArray(properties) || properties.length === 0) {
    return null;
  }

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">
          Mountain Villas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property?._id || property?.id}
              property={property}
            />
          ))}
        </div>
      </div>
    </section>
  );
}