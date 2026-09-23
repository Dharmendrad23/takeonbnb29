import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import api from "@/lib/api.js";
import PropertyGrid from "@/components/PropertyGrid.jsx";

const destinationInfo = {
  manali: {
    region: "Himachal Pradesh",
    season: "Oct – Feb",
    views: "Mountains & Valleys",
    perfectFor: "Families, Couples, Groups",
    image: "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787857310/MAnali.jpg",
  },
  mussoorie: {
    region: "Uttarakhand",
    season: "Mar – Jun",
    views: "Hills & Valleys",
    perfectFor: "Families, Couples, Groups",
    image: "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787857117/musoore.jpg",
  },
  dehradun: {
    region: "Uttarakhand",
    season: "Oct – Jun",
    views: "Hills & Greenery",
    perfectFor: "Families, Couples, Groups",
    image: "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787856917/Dehradun.jpg",
  },
  rishikesh: {
    region: "Uttarakhand",
    season: "Oct – Jun",
    views: "Ganga & Mountains",
    perfectFor: "Couples, Families, Groups",
    image: "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787857116/Riishkesh.jpg",
  },
  nainital: {
    region: "Uttarakhand",
    season: "Mar – Jun",
    views: "Lake & Mountains",
    perfectFor: "Families, Couples",
    image: "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787857115/Nanital.jpg",
  },
  goa: {
    region: "Goa",
    season: "Nov – Feb",
    views: "Beaches & Sea",
    perfectFor: "Couples, Families, Groups",
    image: "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787857116/Goa.jpg",
  },
  jaipur: {
    region: "Rajasthan",
    season: "Oct – Mar",
    views: "Heritage & Culture",
    perfectFor: "Families, Couples, Groups",
    image: "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787857116/Jaipur.jpg",
  },
};

const DestinationPage = () => {
  const { location } = useParams();
  const navigate = useNavigate();

  const formattedLocation = location
    ? location.charAt(0).toUpperCase() + location.slice(1)
    : "Destination";

  const info =
    destinationInfo[String(location || "").toLowerCase()] || {
      region: "India",
      season: "All year",
      views: "Beautiful surroundings",
      perfectFor: "Families, Couples, Groups",
      image:
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85",
    };

  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("All");
  const [guestFilter, setGuestFilter] = useState("Any");
  const [swapOnly, setSwapOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filteredProperties = properties
    .filter((property) => {
      const query = searchQuery.trim().toLowerCase();

      const name = String(
        property?.title || property?.name || ""
      ).toLowerCase();

      const locationText = String(
        property?.location || ""
      ).toLowerCase();

      const type = String(
        property?.propertyType ||
        property?.type ||
        property?.category ||
        ""
      ).toLowerCase();

      const guests = Number(
        property?.guestCapacity ||
        property?.guests ||
        0
      );

      const price = Number(
        property?.pricePerNight ||
        property?.price ||
        0
      );

      const matchesSearch =
        !query ||
        name.includes(query) ||
        locationText.includes(query);

      const matchesType =
        propertyType === "All" ||
        type.includes(propertyType.toLowerCase().replace(/s$/, ""));

      const matchesGuests =
        guestFilter === "Any" ||
        (guestFilter === "1-2" && guests >= 1 && guests <= 2) ||
        (guestFilter === "3-4" && guests >= 3 && guests <= 4) ||
        (guestFilter === "5+" && guests >= 5);

      const matchesMin =
        !minPrice || price >= Number(minPrice);

      const matchesMax =
        !maxPrice || price <= Number(maxPrice);

      const swapValue =
        property?.swapAvailable ??
        property?.propertySwap ??
        property?.isSwapAvailable ??
        property?.swap;

      const matchesSwap =
        !swapOnly ||
        swapValue === true ||
        String(swapValue).toLowerCase() === "true";

      return (
        matchesSearch &&
        matchesType &&
        matchesGuests &&
        matchesMin &&
        matchesMax &&
        matchesSwap
      );
    })
    .sort((a, b) => {
      const priceA = Number(a?.pricePerNight || a?.price || 0);
      const priceB = Number(b?.pricePerNight || b?.price || 0);

      const ratingA = Number(a?.rating || 0);
      const ratingB = Number(b?.rating || 0);

      if (sortBy === "price-low") return priceA - priceB;
      if (sortBy === "price-high") return priceB - priceA;
      if (sortBy === "rating") return ratingB - ratingA;

      return 0;
    });

  const clearFilters = () => {
    setSearchQuery("");
    setPropertyType("All");
    setGuestFilter("Any");
    setSwapOnly(false);
    setMinPrice("");
    setMaxPrice("");
    setSortBy("featured");
  };

  useEffect(() => {
    let mounted = true;

    const fetchProperties = async () => {
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

        const searchLocation = String(
          formattedLocation
        ).toLowerCase();

        const filtered = propertyList.filter((property) => {
          const propertyLocation = String(
            property?.location || ""
          ).toLowerCase();

          const propertyTitle = String(
            property?.title || property?.name || ""
          ).toLowerCase();

          return (
            propertyLocation.includes(searchLocation) ||
            propertyTitle.includes(searchLocation)
          );
        });

        if (mounted) {
          setProperties(filtered);
        }
      } catch (err) {
        console.error("Error fetching properties:", err);

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
      fetchProperties();
    } else {
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [location, formattedLocation]);

  return (
    <div className="min-h-screen bg-white text-[#171717]">

      <Helmet>
        <title>
          Properties in {formattedLocation} | TakeOnBNB
        </title>

        <meta
          name="description"
          content={`Real approved properties available in ${formattedLocation} with TakeOnBNB.`}
        />
      </Helmet>

      {/* HERO */}
      <section className="pt-24 sm:pt-28 bg-[#FFFCF9]">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-7">
            <button
              onClick={() => navigate("/")}
              className="hover:text-[#F97316]"
            >
              Home
            </button>

            <span>›</span>

            <button
              onClick={() => navigate("/destinations")}
              className="hover:text-[#F97316]"
            >
              Destinations
            </button>

            <span>›</span>

            <span className="text-[#F97316]">
              {formattedLocation}
            </span>
          </div>

          <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-center pb-10">

            {/* LEFT */}
            <div>

              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-[2px] bg-[#F97316]" />

                <span className="text-xs font-bold tracking-[0.22em] text-[#F97316]">
                  TAKE ON BNB
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight">
                Properties in{" "}
                <span className="text-[#F97316]">
                  {formattedLocation}
                </span>
              </h1>

              <p className="mt-5 text-lg text-[#657083] max-w-2xl">
                Real approved properties available in{" "}
                {formattedLocation}
              </p>

              {/* INFO */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10">

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FFF0E5] flex items-center justify-center text-[#F97316] text-xl">
                    ⛰
                  </div>

                  <div>
                    <p className="font-semibold text-sm">
                      Scenic Views
                    </p>
                    <p className="text-sm text-gray-500">
                      {info.views}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FFF0E5] flex items-center justify-center text-[#F97316] text-xl">
                    ❄
                  </div>

                  <div>
                    <p className="font-semibold text-sm">
                      Best Season
                    </p>
                    <p className="text-sm text-gray-500">
                      {info.season}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FFF0E5] flex items-center justify-center text-[#F97316] text-xl">
                    ♡
                  </div>

                  <div>
                    <p className="font-semibold text-sm">
                      Perfect For
                    </p>
                    <p className="text-sm text-gray-500">
                      {info.perfectFor}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* IMAGE */}
            <div className="relative h-[300px] sm:h-[350px]">

              <div className="absolute right-0 top-0 w-[82%] h-[92%] rounded-[32px] overflow-hidden shadow-xl">
                <img
                  src={info.image}
                  alt={formattedLocation}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              <div className="absolute left-0 bottom-0 w-36 h-36 sm:w-44 sm:h-44 rounded-[25px] overflow-hidden border-[5px] border-[#FFFCF9] shadow-xl">
                <img
                  src={info.image}
                  alt={`${formattedLocation} stay`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bubble */}
              <div className="absolute left-[30%] top-2 bg-[#FFF0E5] w-24 h-24 rounded-[40%] rotate-[-6deg] flex items-center justify-center">
                <div className="text-center text-sm font-semibold leading-5">
                  Explore
                  <br />
                  Stay
                  <br />
                  Repeat
                </div>
              </div>

              {/* Location */}
              <div className="absolute right-0 bottom-4 bg-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFF0E5] flex items-center justify-center">
                  📍
                </div>

                <div>
                  <p className="font-semibold text-sm">
                    {formattedLocation}
                  </p>

                  <p className="text-xs text-gray-500">
                    {info.region}
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="bg-white border border-gray-200 rounded-[25px] shadow-lg p-2">

          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_auto]">

            <div className="flex items-center gap-3 px-5 py-4 md:border-r">
              <span className="text-[#F97316] text-xl">
                ⌕
              </span>

              <div>
                <p className="text-xs font-semibold">
                  Search
                </p>

                <p className="text-sm text-gray-400">
                  <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search properties in ${formattedLocation}`}
                  className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
/>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-4 md:border-r">
              <span>⌂</span>

              <div>
                <p className="text-xs font-semibold">
                  Property Type
                </p>

                <p className="text-sm text-gray-500">
                  All Types
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-4 md:border-r">
              <span>♙</span>

              <div>
                <p className="text-xs font-semibold">
                  Guests
                </p>

                <p className="text-sm text-gray-500">
                  Any
                </p>
              </div>
            </div>

            <button
              type="button"
              className="m-1 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-[18px] px-7 py-3 font-semibold transition"
            >
              ☷ Filters
            </button>

          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7">

        <div className="flex gap-3 overflow-x-auto pb-2">

          {[
            "All",
            "Villas",
            "Cottages",
            "Homestays",
            "Resorts",
            "Treehouses",
            "Apartments",
          ].map((item, index) => (
            <button
              key={item}
              type="button"
              className={`shrink-0 px-5 py-2.5 rounded-full border text-sm font-medium ${
                index === 0
                  ? "bg-[#F97316] border-[#F97316] text-white"
                  : "bg-white border-gray-200 hover:border-[#F97316] hover:text-[#F97316]"
              }`}
            >
              {item}
            </button>
          ))}

          <button
            type="button"
            className="shrink-0 px-5 py-2.5 rounded-full border border-gray-200 hover:border-[#F97316] hover:text-[#F97316]"
          >
            ↔ Property Swap
          </button>

        </div>
      </section>

      {/* PROPERTIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold">
              Properties in {formattedLocation}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Real approved properties available in{" "}
              {formattedLocation}
            </p>
          </div>

          <button
            type="button"
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium"
          >
            ↕ Sort by: Featured
          </button>

        </div>

        <PropertyGrid
          properties={filteredProperties}
          isLoading={loading}
          error={error}
          title=""
          subtitle=""
        />

      </section>

    </div>
  );
};

export default DestinationPage;





