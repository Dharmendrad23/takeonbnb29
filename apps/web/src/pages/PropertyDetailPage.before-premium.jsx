import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import api from "@/lib/api.js";

import { PropertyImageGallery } from "@/components/property/PropertyImageGallery.jsx";
import { BookingWidget } from "@/components/property/BookingWidget.jsx";
import { AmenitiesGrid } from "@/components/property/PropertyComponents.jsx";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  ChevronLeft,
  ChevronRight,
  Share,
  Heart,
  Star,
  X,
  Wifi,
  Utensils,
  Car,
  Tv,
  Snowflake,
  Bath,
  BedDouble,
  WashingMachine,
  Waves,
  ShieldCheck,
  Coffee,
  Dumbbell,
  MapPin,
  Users,
  Bed,
  CheckCircle2,
  Sparkles,
  Clock,
  UserRound,
  MessageCircle,
  Navigation,
  Home,
  KeyRound,
  CalendarCheck,
  Shield,
  Flame,
  Cross,
  CigaretteOff,
  PartyPopper,
  Dog,
  Award,
} from "lucide-react";

/* =====================================================
   CUSTOM MAP MARKER
===================================================== */

const propertyMarker = new L.DivIcon({
  className: "custom-property-marker",
  html: `
    <div style="
      width:48px;
      height:48px;
      display:flex;
      align-items:center;
      justify-content:center;
    ">
      <div style="
        width:42px;
        height:42px;
        border-radius:50% 50% 50% 0;
        background:#f97316;
        transform:rotate(-45deg);
        border:4px solid white;
        box-shadow:0 8px 20px rgba(249,115,22,.35);
      "></div>
    </div>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 42],
  popupAnchor: [0, -42],
});

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isLiked, setIsLiked] = useState(false);
  const [showAmenities, setShowAmenities] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const [nearbyProperties, setNearbyProperties] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);

  const nearbyScrollRef = useRef(null);

  /* =====================================================
     FETCH PROPERTY
  ===================================================== */

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/properties/${id}`);

        const propertyData =
          response.data?.property || response.data;

        if (!propertyData) {
          throw new Error("Property not found");
        }

        const status = String(
          propertyData.status || ""
        ).toLowerCase();

        const isAdminPreview =
          typeof window !== "undefined" &&
          Boolean(
            window.localStorage.getItem("adminToken")
          );

        const isRestricted =
          status === "pending" ||
          status === "rejected";

        if (isRestricted && !isAdminPreview) {
          setError("Property not found or unavailable.");
          setProperty(null);
        } else {
          setProperty({
            ...propertyData,
            id:
              propertyData.id ||
              propertyData._id ||
              id,
          });
        }
      } catch (err) {
        console.error("Error fetching property:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Property not found or unavailable."
        );

        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    } else {
      setError("Property ID is missing.");
      setLoading(false);
    }
  }, [id]);

  /* =====================================================
     FETCH MORE PROPERTIES
  ===================================================== */

  useEffect(() => {
    if (!property?.id && !property?._id) return;

    const fetchNearbyProperties = async () => {
      try {
        setNearbyLoading(true);

        const response = await api.get(
          "/properties?status=approved"
        );

        const responseData = response.data;

        const allProperties = Array.isArray(responseData)
          ? responseData
          : responseData?.properties ||
            responseData?.data ||
            [];

        const propertiesList = Array.isArray(allProperties)
          ? allProperties
          : [];

        const currentId = String(
          property.id || property._id || id
        );

        const liveProperties =
          propertiesList.filter((item) => {
            const itemId = String(
              item.id || item._id || ""
            );

            return itemId !== currentId;
          });

        setNearbyProperties(
          liveProperties.slice(0, 12)
        );
      } catch (err) {
        console.error(
          "Error fetching nearby properties:",
          err
        );

        setNearbyProperties([]);
      } finally {
        setNearbyLoading(false);
      }
    };

    fetchNearbyProperties();
  }, [property?.id, property?._id, id]);

  /* =====================================================
     AMENITIES MODAL
  ===================================================== */

  useEffect(() => {
    if (!showAmenities) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowAmenities(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = "";
    };
  }, [showAmenities]);

  /* =====================================================
     HELPERS
  ===================================================== */

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: property?.title || "Take On BnB",
          text: "Check out this amazing property!",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          window.location.href
        );

        alert("Property link copied!");
      }
    } catch (error) {
      console.log("Share cancelled");
    }
  };

  const scrollNearbyProperties = (direction) => {
    if (!nearbyScrollRef.current) return;

    nearbyScrollRef.current.scrollBy({
      left:
        direction === "left"
          ? -400
          : 400,
      behavior: "smooth",
    });
  };

  const getAmenityIcon = (amenity = "") => {
    const name = String(amenity).toLowerCase();

    if (
      name.includes("wifi") ||
      name.includes("internet")
    ) {
      return <Wifi className="w-5 h-5" />;
    }

    if (
      name.includes("kitchen") ||
      name.includes("cook")
    ) {
      return <Utensils className="w-5 h-5" />;
    }

    if (
      name.includes("parking") ||
      name.includes("garage")
    ) {
      return <Car className="w-5 h-5" />;
    }

    if (
      name.includes("tv") ||
      name.includes("television")
    ) {
      return <Tv className="w-5 h-5" />;
    }

    if (
      name.includes("air") ||
      name.includes("ac")
    ) {
      return <Snowflake className="w-5 h-5" />;
    }

    if (name.includes("bath")) {
      return <Bath className="w-5 h-5" />;
    }

    if (name.includes("bed")) {
      return <BedDouble className="w-5 h-5" />;
    }

    if (
      name.includes("wash") ||
      name.includes("laundry")
    ) {
      return <WashingMachine className="w-5 h-5" />;
    }

    if (name.includes("pool")) {
      return <Waves className="w-5 h-5" />;
    }

    if (name.includes("security")) {
      return <ShieldCheck className="w-5 h-5" />;
    }

    if (name.includes("coffee")) {
      return <Coffee className="w-5 h-5" />;
    }

    if (
      name.includes("gym") ||
      name.includes("fitness")
    ) {
      return <Dumbbell className="w-5 h-5" />;
    }

    return <CheckCircle2 className="w-5 h-5" />;
  };

  const getAmenitiesList = () => {
    if (!property?.amenities) return [];

    if (Array.isArray(property.amenities)) {
      return property.amenities
        .map((item) =>
          typeof item === "string"
            ? item
            : item?.name || item?.title
        )
        .filter(Boolean);
    }

    if (typeof property.amenities === "object") {
      return Object.entries(property.amenities)
        .filter(
          ([, value]) =>
            value === true ||
            value === "true"
        )
        .map(([key]) => key);
    }

    return [];
  };

  const formatAmenity = (amenity) =>
    String(amenity)
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .trim();

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
          <Skeleton className="h-8 w-40 mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            <div>
              <Skeleton className="h-[500px] rounded-3xl" />
              <Skeleton className="h-10 w-2/3 mt-8" />
              <Skeleton className="h-24 w-full mt-6" />
            </div>

            <Skeleton className="h-[650px] rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error || !property) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4 bg-white">
        <Home className="w-16 h-16 text-orange-500 mb-6" />

        <h2 className="text-2xl font-bold mb-3">
          {error || "Property not found"}
        </h2>

        <p className="text-gray-500 mb-6">
          This property may no longer be available.
        </p>

        <Button
          onClick={() => navigate("/properties")}
          className="bg-orange-500 hover:bg-orange-600 rounded-xl px-7"
        >
          Explore Properties
        </Button>
      </div>
    );
  }

  /* =====================================================
     PROPERTY DATA
  ===================================================== */

  const photos = Array.isArray(property.photos)
    ? property.photos
    : [];

  const amenities = getAmenitiesList();

  const previewAmenities =
    amenities.slice(0, 8);

  const rawLocation =
    property.location ||
    property.address ||
    property.city ||
    "Dehradun, Uttarakhand, India";

  const locationText =
    typeof rawLocation === "object"
      ? rawLocation.address ||
        rawLocation.city ||
        "Dehradun, Uttarakhand, India"
      : rawLocation;

  const latitude =
    Number(
      property.latitude ||
        property.lat ||
        property.location?.latitude ||
        property.location?.lat
    ) || 30.3165;

  const longitude =
    Number(
      property.longitude ||
        property.lng ||
        property.location?.longitude ||
        property.location?.lng
    ) || 78.0322;

  const mapPosition = [
    latitude,
    longitude,
  ];

  const guests =
    property.maxGuests ||
    property.guestCapacity ||
    property.guests ||
    property.capacity ||
    0;

  const bedrooms =
    property.bedrooms ||
    property.numberOfBedrooms ||
    0;

  const beds =
    property.beds ||
    property.numberOfBeds ||
    0;

  const bathrooms =
    property.bathrooms ||
    property.numberOfBathrooms ||
    0;

  const rating =
    property.rating ||
    property.averageRating ||
    0;

  const price =
    property.pricePerNight ||
    property.price ||
    0;

  const description =
    property.description ||
    "Experience a comfortable and memorable stay with everything you need for your perfect getaway.";

  const shouldTruncate =
    description.length > 420;

  const displayedDescription =
    !shouldTruncate || showFullDescription
      ? description
      : `${description.slice(0, 420)}...`;

  const host =
    property.host ||
    property.hostDetails ||
    {};

  const hostName =
    host.name ||
    property.hostName ||
    "Take On BnB Host";

  const hostImage =
    host.avatar ||
    host.photo ||
    property.hostImage ||
    "";

  const reviews = Array.isArray(property.reviews)
    ? property.reviews
    : [];

  const propertyType =
    property.propertyType ||
    property.type ||
    "Villa";

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <>
      <Helmet>
        <title>
          {property.title || "Property"} | Take On BnB
        </title>

        <meta
          name="description"
          content={description.substring(0, 155)}
        />
      </Helmet>

      <div className="min-h-screen bg-white pb-24 lg:pb-0">

        {/* TOP HEADER */}

        <div className="border-b border-gray-100 bg-white sticky top-0 z-50">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">

            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-semibold hover:text-orange-600 transition"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to listings
            </button>

            <div className="flex items-center gap-2">

              <Button
                variant="ghost"
                onClick={handleShare}
                className="rounded-xl gap-2"
              >
                <Share className="w-4 h-4" />
                <span className="hidden sm:inline">
                  Share
                </span>
              </Button>

              <Button
                variant="ghost"
                onClick={() =>
                  setIsLiked(!isLiked)
                }
                className="rounded-xl gap-2"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isLiked
                      ? "fill-red-500 text-red-500"
                      : ""
                  }`}
                />

                <span className="hidden sm:inline">
                  Save
                </span>
              </Button>

            </div>
          </div>
        </div>

        <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 md:py-8">

          {/* MAIN GRID */}

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_390px] gap-8 xl:gap-10">

            {/* LEFT SIDE */}

            <div className="min-w-0">

              {/* IMAGE GALLERY */}

              <div className="overflow-hidden rounded-[28px]">
                <PropertyImageGallery
                  photos={photos}
                />
              </div>

              {/* TITLE */}

              <section className="pt-7 pb-7 border-b border-gray-100">

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">

                  <div>

                    <div className="flex flex-wrap items-center gap-2 mb-3">

                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold">
                        <Home className="w-3.5 h-3.5" />
                        {propertyType}
                      </span>

                      {property.featured && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold">
                          <Sparkles className="w-3.5 h-3.5" />
                          Guest favourite
                        </span>
                      )}

                    </div>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                      {property.title ||
                        "Villa hosted by Take On BnB Host"}
                    </h1>

                    <div className="flex flex-wrap items-center gap-2 mt-4 text-sm text-gray-500">

                      <MapPin className="w-4 h-4 text-orange-500" />

                      <span>
                        {locationText}
                      </span>

                      <span className="text-gray-300">
                        â€¢
                      </span>

                      <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2.5 py-1 rounded-full text-xs font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Great location
                      </span>

                    </div>

                  </div>

                  <div className="flex items-center gap-2 shrink-0">

                    <Star className="w-5 h-5 fill-orange-500 text-orange-500" />

                    <div>

                      <div className="font-bold text-lg">
                        {rating
                          ? Number(rating).toFixed(1)
                          : "New"}
                      </div>

                      <div className="text-xs text-gray-500">
                        ({reviews.length || 0} reviews)
                      </div>

                    </div>

                  </div>

                </div>

              </section>

              {/* PROPERTY STATS */}

              <section className="py-7">

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">

                  <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">

                    <Users className="w-6 h-6 mx-auto text-orange-500 mb-3" />

                    <div className="font-bold text-xl">
                      {guests || "-"}
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      Guests
                    </div>

                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">

                    <Bed className="w-6 h-6 mx-auto text-orange-500 mb-3" />

                    <div className="font-bold text-xl">
                      {bedrooms || "-"}
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      Bedrooms
                    </div>

                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">

                    <BedDouble className="w-6 h-6 mx-auto text-orange-500 mb-3" />

                    <div className="font-bold text-xl">
                      {beds || "-"}
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      Beds
                    </div>

                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">

                    <Bath className="w-6 h-6 mx-auto text-orange-500 mb-3" />

                    <div className="font-bold text-xl">
                      {bathrooms || "-"}
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      Bathrooms
                    </div>

                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">

                    <Home className="w-6 h-6 mx-auto text-orange-500 mb-3" />

                    <div className="font-bold text-base capitalize">
                      {propertyType}
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      Property type
                    </div>

                  </div>

                </div>

              </section>

              {/* QUICK FEATURES */}

              <section className="pb-8 border-b border-gray-100">

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

                  <div className="p-4 rounded-2xl bg-orange-50/50 flex items-center gap-3">

                    <Home className="w-5 h-5 text-orange-500" />

                    <div>
                      <p className="text-xs font-bold">
                        Entire place
                      </p>

                      <p className="text-[11px] text-gray-500">
                        Complete privacy
                      </p>
                    </div>

                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 flex items-center gap-3">

                    <KeyRound className="w-5 h-5 text-gray-700" />

                    <div>
                      <p className="text-xs font-bold">
                        Self check-in
                      </p>

                      <p className="text-[11px] text-gray-500">
                        Easy arrival
                      </p>
                    </div>

                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 flex items-center gap-3">

                    <Award className="w-5 h-5 text-gray-700" />

                    <div>
                      <p className="text-xs font-bold">
                        Experienced host
                      </p>

                      <p className="text-[11px] text-gray-500">
                        Highly rated
                      </p>
                    </div>

                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 flex items-center gap-3">

                    <CalendarCheck className="w-5 h-5 text-gray-700" />

                    <div>
                      <p className="text-xs font-bold">
                        Free cancellation
                      </p>

                      <p className="text-[11px] text-gray-500">
                        Subject to policy
                      </p>
                    </div>

                  </div>

                </div>

              </section>

              {/* ABOUT */}

              <section className="py-9 border-b border-gray-100">

                <h2 className="text-2xl font-bold mb-5">
                  About this place
                </h2>

                <p className="text-gray-600 leading-7 whitespace-pre-wrap">
                  {displayedDescription}
                </p>

                {shouldTruncate && (
                  <button
                    onClick={() =>
                      setShowFullDescription(
                        !showFullDescription
                      )
                    }
                    className="mt-4 text-sm font-bold text-orange-600 hover:underline"
                  >
                    {showFullDescription
                      ? "Read less"
                      : "Read more â†’"}
                  </button>
                )}

              </section>

              {/* AMENITIES */}

              <section className="py-9 border-b border-gray-100">

                <div className="flex items-center justify-between gap-4 mb-6">

                  <h2 className="text-2xl font-bold">
                    Top amenities
                  </h2>

                  {amenities.length > 0 && (
                    <button
                      onClick={() =>
                        setShowAmenities(true)
                      }
                      className="text-sm font-bold text-orange-600 hover:underline"
                    >
                      View all ({amenities.length})
                    </button>
                  )}

                </div>

                {amenities.length > 0 ? (

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">

                    {previewAmenities.map(
                      (amenity, index) => (

                        <div
                          key={`${amenity}-${index}`}
                          className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-4 hover:border-orange-300 transition"
                        >

                          <div className="text-orange-500">
                            {getAmenityIcon(amenity)}
                          </div>

                          <span className="text-sm font-medium truncate">
                            {formatAmenity(amenity)}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <AmenitiesGrid
                    amenities={property.amenities || []}
                  />

                )}

              </section>

              {/* HOST */}

              <section className="py-9 border-b border-gray-100">

                <h2 className="text-2xl font-bold mb-6">
                  Hosted by
                </h2>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-3xl border border-gray-200 p-5 md:p-6">

                  <div className="flex items-center gap-4">

                    {hostImage ? (

                      <img
                        src={hostImage}
                        alt={hostName}
                        className="w-16 h-16 rounded-full object-cover"
                      />

                    ) : (

                      <div className="w-16 h-16 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold">
                        {hostName
                          .split(" ")
                          .map((item) =>
                            item.charAt(0)
                          )
                          .join("")
                          .slice(0, 2)}
                      </div>

                    )}

                    <div>

                      <h3 className="font-bold text-lg">
                        {hostName}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Superhost Â· Take On BnB
                      </p>

                    </div>

                  </div>

                  <Button
                    variant="outline"
                    className="rounded-xl"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact host
                  </Button>

                </div>

              </section>

              {/* THINGS TO KNOW */}

              <section className="py-9 border-b border-gray-100">

                <h2 className="text-2xl font-bold mb-6">
                  Things to know
                </h2>

                <div className="grid md:grid-cols-2 gap-4">

                  <div className="rounded-2xl border border-gray-200 p-5">

                    <Clock className="w-5 h-5 text-orange-500 mb-3" />

                    <h3 className="font-bold">
                      Check-in & Check-out
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                      Check-in:{" "}
                      {property.checkInTime ||
                        property.checkInTimeTime ||
                        "2:00 PM"}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Check-out:{" "}
                      {property.checkOutTime ||
                        property.checkOutTimeTime ||
                        "11:00 AM"}
                    </p>

                  </div>

                  <div className="rounded-2xl border border-gray-200 p-5">

                    <Shield className="w-5 h-5 text-orange-500 mb-3" />

                    <h3 className="font-bold">
                      House rules
                    </h3>

                    <p className="text-sm text-gray-500 mt-2 leading-6">
                      {typeof property.houseRules === "string"
                        ? property.houseRules
                        : "Please respect the property and follow the host's guidelines during your stay."}
                    </p>

                  </div>

                </div>

              </section>

              {/* LOCATION */}

              <section className="py-9 border-b border-gray-100">

                <h2 className="text-2xl font-bold mb-2">
                  Where you'll be
                </h2>

                <p className="text-gray-500 mb-6">
                  {locationText}
                </p>

                <div className="grid md:grid-cols-[1.1fr_.9fr] gap-6 items-center">

                  <div className="overflow-hidden rounded-3xl border border-gray-200 h-[300px]">

                    <MapContainer
                      center={mapPosition}
                      zoom={13}
                      scrollWheelZoom={false}
                      zoomControl={false}
                      className="h-full w-full"
                    >

                      <ZoomControl position="topright" />

                      <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      <Marker
                        position={mapPosition}
                        icon={propertyMarker}
                      >
                        <Popup>
                          <strong>
                            {property.title ||
                              "Property"}
                          </strong>
                        </Popup>
                      </Marker>

                    </MapContainer>

                  </div>

                  <div>

                    <h3 className="text-xl font-bold">
                      {locationText}
                    </h3>

                    <p className="text-gray-500 leading-7 mt-3">
                      Located in a peaceful area with
                      convenient access to nearby
                      attractions, restaurants and
                      essential services.
                    </p>

                    <a
                      href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-xl border border-gray-300 font-semibold hover:bg-gray-50"
                    >
                      <Navigation className="w-4 h-4" />
                      Show directions
                    </a>

                  </div>

                </div>

              </section>

              {/* REVIEWS */}

              <section className="py-9">

                <div className="flex items-center gap-3 mb-7">

                  <Star className="w-7 h-7 fill-orange-500 text-orange-500" />

                  <div>

                    <h2 className="text-2xl font-bold">
                      {rating
                        ? Number(rating).toFixed(1)
                        : "New"}{" "}
                      Guest reviews
                    </h2>

                    <p className="text-sm text-gray-500">
                      {reviews.length} reviews
                    </p>

                  </div>

                </div>

                {reviews.length > 0 ? (

                  <div className="grid md:grid-cols-2 gap-4">

                    {reviews
                      .slice(0, 4)
                      .map((review, index) => (

                        <div
                          key={
                            review.id ||
                            review._id ||
                            index
                          }
                          className="rounded-2xl border border-gray-200 p-5"
                        >

                          <div className="flex items-center gap-3 mb-4">

                            <div className="w-11 h-11 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                              {(
                                review.name ||
                                review.userName ||
                                "G"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>

                              <p className="font-bold">
                                {review.name ||
                                  review.userName ||
                                  "Guest"}
                              </p>

                              <div className="flex items-center gap-1 text-sm">

                                <Star className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />

                                {review.rating || 5}

                              </div>

                            </div>

                          </div>

                          <p className="text-sm text-gray-600 leading-6">
                            {review.comment ||
                              review.review ||
                              "Wonderful stay and a great experience."}
                          </p>

                        </div>

                      ))}

                  </div>

                ) : (

                  <div className="rounded-3xl bg-gray-50 border border-gray-100 p-8 text-center">

                    <Star className="w-10 h-10 text-orange-400 mx-auto mb-3" />

                    <h3 className="font-bold text-lg">
                      No reviews yet
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                      Be one of the first guests to
                      experience this stay.
                    </p>

                  </div>

                )}

              </section>

            </div>

            {/* RIGHT BOOKING SIDEBAR */}

            <aside className="hidden xl:block">

              <div className="sticky top-24 space-y-5">

                <div
                  id="booking-widget"
                  className="rounded-[28px] border border-gray-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-6"
                >

                  <BookingWidget
                    property={property}
                  />

                </div>

                {/* HOST CARD */}

                <div className="rounded-3xl border border-gray-200 p-6">

                  <div className="flex items-center gap-3">

                    {hostImage ? (

                      <img
                        src={hostImage}
                        alt={hostName}
                        className="w-14 h-14 rounded-full object-cover"
                      />

                    ) : (

                      <div className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xs">
                        TAKE
                        <br />
                        ON
                        <br />
                        BNB
                      </div>

                    )}

                    <div>

                      <p className="text-xs text-gray-500">
                        Hosted by
                      </p>

                      <h3 className="font-bold">
                        {hostName}
                      </h3>

                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">

                        <span>Superhost</span>

                        <span>â€¢</span>

                        <span>
                          <Star className="inline w-3 h-3 fill-orange-500 text-orange-500 mr-1" />
                          {rating
                            ? Number(rating).toFixed(1)
                            : "New"}
                        </span>

                      </div>

                    </div>

                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t text-center">

                    <div>

                      <p className="font-bold text-sm">
                        100%
                      </p>

                      <p className="text-[10px] text-gray-500 mt-1">
                        Response rate
                      </p>

                    </div>

                    <div>

                      <p className="font-bold text-sm">
                        1 hr
                      </p>

                      <p className="text-[10px] text-gray-500 mt-1">
                        Response time
                      </p>

                    </div>

                    <div>

                      <p className="font-bold text-sm">
                        5+ yrs
                      </p>

                      <p className="text-[10px] text-gray-500 mt-1">
                        Hosting
                      </p>

                    </div>

                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-6 rounded-xl"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact host
                  </Button>

                </div>

                {/* HOUSE RULES */}

                <div className="rounded-3xl border border-gray-200 p-6">

                  <h3 className="font-bold text-lg mb-5">
                    House rules
                  </h3>

                  <div className="space-y-4 text-sm">

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CalendarCheck className="w-4 h-4" />
                        Check-in after 2:00 PM
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4" />
                        Check-out before 11:00 AM
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CigaretteOff className="w-4 h-4" />
                        No smoking
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Dog className="w-4 h-4" />
                        No pets
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <PartyPopper className="w-4 h-4" />
                        No parties
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>

                  </div>

                </div>

                {/* SAFETY */}

                <div className="rounded-3xl border border-gray-200 p-6">

                  <h3 className="font-bold text-lg mb-5">
                    Safety & property
                  </h3>

                  <div className="space-y-4 text-sm">

                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4" />
                      Safety equipment
                    </div>

                    <div className="flex items-center gap-3">
                      <Flame className="w-4 h-4" />
                      Fire extinguisher
                    </div>

                    <div className="flex items-center gap-3">
                      <Cross className="w-4 h-4" />
                      First aid kit
                    </div>

                  </div>

                </div>

              </div>

            </aside>

          </div>

          {/* =====================================================
              MORE STAYS
          ===================================================== */}

          <section className="pt-12 md:pt-16 pb-10">

            <div className="flex items-end justify-between gap-5 mb-7">

              <div>

                <h2 className="text-2xl md:text-3xl font-bold">
                  More stays in {locationText}
                </h2>

                <p className="text-gray-500 mt-2">
                  Explore other amazing properties
                  near this location
                </p>

              </div>

              {nearbyProperties.length > 3 && (

                <div className="hidden md:flex items-center gap-2">

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      scrollNearbyProperties("left")
                    }
                    className="rounded-full"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      scrollNearbyProperties("right")
                    }
                    className="rounded-full"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>

                </div>

              )}

            </div>

            {nearbyLoading ? (

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                {[1, 2, 3, 4].map((item) => (

                  <div key={item}>

                    <Skeleton className="aspect-[4/3] rounded-3xl" />

                    <Skeleton className="h-5 mt-4 w-3/4" />

                    <Skeleton className="h-4 mt-2 w-1/2" />

                  </div>

                ))}

              </div>

            ) : nearbyProperties.length > 0 ? (

              <div
                ref={nearbyScrollRef}
                className="flex gap-5 overflow-x-auto pb-5 snap-x snap-mandatory scrollbar-hide"
              >

                {nearbyProperties.map(
                  (nearbyProperty) => {

                    const nearbyId =
                      nearbyProperty.id ||
                      nearbyProperty._id;

                    const nearbyPhotos =
                      Array.isArray(
                        nearbyProperty.photos
                      )
                        ? nearbyProperty.photos
                        : [];

                    const firstImage =
                      nearbyPhotos[0] ||
                      nearbyProperty.image ||
                      nearbyProperty.thumbnail ||
                      "";

                    const imageUrl =
                      typeof firstImage === "string"
                        ? firstImage
                        : firstImage?.url ||
                          firstImage?.secure_url ||
                          firstImage?.src ||
                          "";

                    const nearbyLocation =
                      typeof nearbyProperty.location ===
                      "object"
                        ? nearbyProperty.location?.address ||
                          nearbyProperty.location?.city ||
                          nearbyProperty.city ||
                          "Dehradun"
                        : nearbyProperty.location ||
                          nearbyProperty.address ||
                          nearbyProperty.city ||
                          "Dehradun";

                    const nearbyPrice =
                      nearbyProperty.pricePerNight ||
                      nearbyProperty.price ||
                      0;

                    return (

                      <article
                        key={
                          nearbyId ||
                          nearbyProperty.title
                        }
                        onClick={() =>
                          nearbyId &&
                          navigate(
                            `/properties/${nearbyId}`
                          )
                        }
                        className="group min-w-[270px] sm:min-w-[300px] lg:min-w-[310px] max-w-[310px] cursor-pointer snap-start"
                      >

                        <div className="relative overflow-hidden rounded-3xl aspect-[4/3] bg-gray-100">

                          {imageUrl ? (

                            <img
                              src={imageUrl}
                              alt={
                                nearbyProperty.title ||
                                "Property"
                              }
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                          ) : (

                            <div className="w-full h-full flex items-center justify-center">
                              <Home className="w-12 h-12 text-gray-300" />
                            </div>

                          )}

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                            }}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 flex items-center justify-center shadow"
                          >
                            <Heart className="w-5 h-5" />
                          </button>

                        </div>

                        <div className="pt-4">

                          <h3 className="font-bold text-base truncate">
                            {nearbyProperty.title ||
                              "Beautiful stay"}
                          </h3>

                          <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">

                            <MapPin className="w-4 h-4 text-orange-500" />

                            <span className="truncate">
                              {nearbyLocation}
                            </span>

                          </div>

                          <div className="flex items-center justify-between mt-4">

                            <p className="font-bold">

                              ₹
                              {Number(
                                nearbyPrice
                              ).toLocaleString(
                                "en-IN"
                              )}

                              <span className="font-normal text-sm text-gray-500">
                                {" "}
                                / night
                              </span>

                            </p>

                            <span className="text-sm font-bold text-orange-600">
                              View stay â†’
                            </span>

                          </div>

                        </div>

                      </article>

                    );
                  }
                )}

              </div>

            ) : (

              <div className="rounded-3xl bg-gray-50 border border-gray-100 p-10 text-center">

                <MapPin className="w-10 h-10 text-orange-400 mx-auto mb-3" />

                <h3 className="font-bold text-lg">
                  More properties coming soon
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  We're adding more amazing stays
                  in this area.
                </p>

              </div>

            )}

          </section>

        </main>

        {/* MOBILE BOOKING BAR */}

        <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">

          <div className="px-4 py-3 flex items-center justify-between gap-4">

            <div>

              <div className="font-bold text-base">

                ₹
                {Number(price).toLocaleString(
                  "en-IN"
                )}

                <span className="font-normal text-sm text-gray-500">
                  {" "}
                  / night
                </span>

              </div>

              <div className="flex items-center gap-1 text-sm">

                <Star className="w-4 h-4 fill-orange-500 text-orange-500" />

                {rating
                  ? Number(rating).toFixed(1)
                  : "New"}

              </div>

            </div>

            <Button
              onClick={() => {
                const booking =
                  document.getElementById(
                    "booking-widget"
                  );

                if (booking) {
                  booking.scrollIntoView({
                    behavior: "smooth",
                  });
                } else {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl px-6 h-12"
            >
              Check dates
            </Button>

          </div>

        </div>

      </div>

      {/* =====================================================
          AMENITIES MODAL
      ===================================================== */}

      {showAmenities && (

        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
          onMouseDown={() =>
            setShowAmenities(false)
          }
        >

          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <div
            className="relative z-10 w-full sm:max-w-3xl max-h-[88vh] bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            <div className="flex items-center justify-between px-6 py-5 border-b">

              <div>

                <h2 className="text-xl font-bold">
                  What this place offers
                </h2>

                <p className="text-sm text-gray-500">
                  {amenities.length} amenities available
                </p>

              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setShowAmenities(false)
                }
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>

            </div>

            <div className="overflow-y-auto max-h-[calc(88vh-90px)] p-6">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {amenities.map(
                  (amenity, index) => (

                    <div
                      key={`${amenity}-${index}`}
                      className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200"
                    >

                      <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">

                        {getAmenityIcon(amenity)}

                      </div>

                      <span className="font-medium">
                        {formatAmenity(amenity)}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>

        </div>

      )}

    </>
  );
};

export default PropertyDetailPage;



