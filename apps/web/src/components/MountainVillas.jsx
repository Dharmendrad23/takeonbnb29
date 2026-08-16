import { useEffect, useState } from "react";
import api from "../lib/api";
import PropertyCard from "./PropertyCard";

export default function MountainVillas() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await api.get("/properties", {
          params: { status: "approved" }
        });

        const data = response.data;

        const safeData = Array.isArray(data)
          ? data
          : Array.isArray(data?.properties)
          ? data.properties
          : Array.isArray(data?.data)
          ? data.data
          : [];

        const filtered = safeData.filter((p) => {
          const location = String(p.location || "").toLowerCase();
          const title = String(p.title || p.name || "").toLowerCase();

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
    };

    fetchProperties();
  }, []);

  if (!properties.length) return null;

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Mountain Villas</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property._id || property.id}
              property={property}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
