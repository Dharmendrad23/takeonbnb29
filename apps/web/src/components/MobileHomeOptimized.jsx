import React, { useEffect, useState } from "react";
import { Search, Heart, UserCircle, X, Tag, ChevronRight } from "lucide-react";
import api from "@/lib/api.js";
import PropertyCard from "@/components/PropertyCard";

const categories = [
  { icon: "🌴", name: "All" },
  { icon: "🏠", name: "Homes" },
  { icon: "🎈", name: "Experiences" },
  { icon: "🏖️", name: "Serviced" },
];

const getProperties = (response) => {
  const result = response?.data;

  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.properties)) return result.properties;
  if (Array.isArray(result?.items)) return result.items;
  if (Array.isArray(result?.data)) return result.data;

  return [];
};

const MobilePropertyRow = ({ title, properties, onSeeAll }) => {
  if (!properties.length) return null;

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between px-5">
        <h2 className="text-[16px] font-bold leading-5 text-gray-900">
          {title}
        </h2>

        <button
          type="button"
          onClick={onSeeAll}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm"
          aria-label={`See all ${title}`}
        >
          <ChevronRight className="h-4 w-4 text-gray-700" />
        </button>
      </div>

      <div className="mobile-property-scroll flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none]">
        {properties.map((property, index) => (
          <div
            key={property?._id || property?.id || index}
            className="w-[260px] min-w-[260px] shrink-0 snap-start"
          >
            <PropertyCard property={property} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default function MobileHomeOptimized() {
  const [properties, setProperties] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAppBanner, setShowAppBanner] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProperties = async () => {
      try {
        const response = await api.get("/properties", {
          params: { status: "approved" },
        });

        const list = getProperties(response);

        const approved = list.filter(
          (property) =>
            String(property?.status || "approved").toLowerCase() ===
            "approved"
        );

        if (mounted) {
          setProperties(approved);
        }
      } catch (error) {
        console.error("Mobile properties loading error:", error);

        if (mounted) {
          setProperties([]);
        }
      }
    };

    loadProperties();

    return () => {
      mounted = false;
    };
  }, []);

  const popularProperties = properties.slice(0, 10);
  const weekendProperties = properties.slice(3, 13);
  const stayProperties = properties.slice(6, 16);

  const handleSeeAll = () => {
    window.location.href = "/properties";
  };

  return (
    <div className="block min-h-screen bg-white pb-20 md:hidden">

      {/* APP BANNER */}
      {showAppBanner && (
        <div className="border-b border-gray-200 bg-white px-3 py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAppBanner(false)}
              className="flex h-6 w-6 shrink-0 items-center justify-center text-gray-500"
              aria-label="Close app banner"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#ff385c] text-white">
              <span className="text-lg font-bold">T</span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold leading-4 text-gray-900">
                Get the Take On BnB app
              </p>

              <p className="truncate text-[10px] leading-4 text-gray-500">
                The fastest, easiest way to book stays
              </p>
            </div>

            <button
              type="button"
              className="rounded-full bg-[#ff6b22] px-3 py-1.5 text-[10px] font-bold text-white"
            >
              USE APP
            </button>
          </div>
        </div>
      )}

      {/* SEARCH */}
      <div className="sticky top-0 z-30 bg-white px-5 pb-3 pt-3">
        <button
          type="button"
          onClick={() => {
            window.location.href = "/search";
          }}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-white text-[13px] font-medium text-gray-900 shadow-[0_3px_14px_rgba(0,0,0,0.10)]"
        >
          <Search className="h-4 w-4" />
          <span>Start your search</span>
        </button>
      </div>

      {/* CATEGORIES */}
      <div className="mobile-category-scroll flex gap-2 overflow-x-auto px-5 pb-4 pt-1">
        {categories.map((category) => {
          const active = activeCategory === category.name;

          return (
            <button
              key={category.name}
              type="button"
              onClick={() => setActiveCategory(category.name)}
              className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[11px] font-medium shadow-sm transition ${
                active
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-800"
              }`}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          );
        })}
      </div>

      {/* PROPERTY SECTIONS */}
      <MobilePropertyRow
        title="Popular homes in Noida"
        properties={popularProperties}
        onSeeAll={handleSeeAll}
      />

      <MobilePropertyRow
        title="Available in Dehradun this weekend"
        properties={weekendProperties}
        onSeeAll={handleSeeAll}
      />

      <MobilePropertyRow
        title="Stay in Rishikesh"
        properties={stayProperties}
        onSeeAll={handleSeeAll}
      />

      {/* PRICE MESSAGE */}
      <div className="pointer-events-none fixed bottom-[66px] left-1/2 z-40 -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-[11px] font-semibold text-gray-800 shadow-[0_5px_20px_rgba(0,0,0,0.15)]">
          <Tag className="h-4 w-4 text-[#ff385c]" />
          Prices include all fees
        </div>
      </div>

      {/* BOTTOM NAV */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white">
        <div className="mx-auto flex h-[62px] max-w-md items-center justify-around">

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex flex-col items-center justify-center gap-1 text-[#ff385c]"
          >
            <Search className="h-5 w-5" />
            <span className="text-[9px] font-medium">Explore</span>
          </button>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/wishlist";
            }}
            className="flex flex-col items-center justify-center gap-1 text-gray-500"
          >
            <Heart className="h-5 w-5" />
            <span className="text-[9px] font-medium">Wishlists</span>
          </button>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/login";
            }}
            className="flex flex-col items-center justify-center gap-1 text-gray-500"
          >
            <UserCircle className="h-5 w-5" />
            <span className="text-[9px] font-medium">Log in</span>
          </button>

        </div>
      </nav>
    </div>
  );
}

