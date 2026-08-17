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
  ChevronRight,
  MapPin,
  Users,
  Bed,
  CheckCircle2,
  Sparkles,
  Clock,
  UserRound,
  MessageCircle,
  Navigation,
} from "lucide-react";

/* ==========================================
   CUSTOM LEAFLET MARKER
========================================== */

const propertyMarker = new L.DivIcon({ className: "custom-property-marker", html: `<div style="position:relative;width:64px;height:64px;display:flex;align-items:center;justify-content:center;"><div style="position:absolute;width:64px;height:64px;border-radius:50%;background:rgba(249,115,22,.18);animation:pulse 2s infinite;"></div><div style="width:52px;height:52px;border-radius:50% 50% 50% 0;background:linear-gradient(135deg,#fb923c,#ea580c);transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:4px solid white;box-shadow:0 8px 24px rgba(234,88,12,.35);"><span style="transform:rotate(45deg);font-size:23px;color:white;">HOME</span></div></div>`, iconSize: [64, 64], iconAnchor: [32, 56], popupAnchor: [0, -58], });

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

  /* ==========================================
     FETCH PROPERTY
  ========================================== */

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

  /* ==========================================
     FETCH NEARBY LIVE PROPERTIES
  ========================================== */

  useEffect(() => {
    if (!property?.id && !property?._id) return;

    const fetchNearbyProperties = async () => {
      try {
        setNearbyLoading(true);

        const response = await api.get("/properties?status=approved");

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

        const currentLocation = String(
          typeof property.location === "object"
            ? (
                property.location?.city ||
                property.location?.address ||
                property.city ||
                ""
              )
            : (
                property.location ||
                property.address ||
                property.city ||
                ""
              )
        )
          .toLowerCase()
          .trim();

        const liveProperties = propertiesList.filter((item) => {
          const itemId = String(
            item.id || item._id || ""
          );

          return itemId !== currentId;
        });

        const sameAreaProperties = liveProperties.filter((item) => {
          const itemLocation = String(
            typeof item.location === "object"
              ? (
                  item.location?.city ||
                  item.location?.address ||
                  item.city ||
                  ""
                )
              : (
                  item.location ||
                  item.address ||
                  item.city ||
                  ""
                )
          )
            .toLowerCase()
            .trim();

          return (
            currentLocation &&
            itemLocation &&
            (
              itemLocation.includes(currentLocation) ||
              currentLocation.includes(itemLocation)
            )
          );
        });

        setNearbyProperties(
          sameAreaProperties.length > 0
            ? sameAreaProperties.slice(0, 12)
            : liveProperties.slice(0, 12)
        );

      } catch (error) {

        console.error(
          "Error fetching nearby properties:",
          error
        );

        setNearbyProperties([]);

      } finally {

        setNearbyLoading(false);

      }
    };

    fetchNearbyProperties();

  }, [property?.id, property?._id, id]);


  /* ==========================================
     NEARBY PROPERTIES SCROLL
  ========================================== */

  const scrollNearbyProperties = (direction) => {

    if (!nearbyScrollRef.current) return;

    nearbyScrollRef.current.scrollBy({
      left:
        direction === "left"
          ? -350
          : 350,
      behavior: "smooth",
    });

  };

  /* ==========================================
     AMENITIES MODAL
  ========================================== */

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

  /* ==========================================
     SHARE
  ========================================== */

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

  /* ==========================================
     SCROLL TO BOOKING
  ========================================== */

  const scrollToBooking = () => {
    const element =
      document.getElementById("booking-widget");

    if (element) {
      const position =
        element.getBoundingClientRect().top +
        window.scrollY -
        100;

      window.scrollTo({
        top: position,
        behavior: "smooth",
      });
    }
  };

  /* ==========================================
     AMENITY ICON
  ========================================== */

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

    return <Star className="w-5 h-5" />;
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

  /* ==========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-2/3 mb-6 rounded-xl" />

          <Skeleton className="h-[400px] w-full rounded-3xl mb-10" />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
            <div className="space-y-6">
              <Skeleton className="h-40 w-full rounded-2xl" />
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>

            <Skeleton className="h-[420px] rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  /* ==========================================
     ERROR
  ========================================== */

  if (error || !property) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4 bg-white">
        <div className="max-w-md">
          <div className="text-6xl mb-6">
            HOME</div>

          <h2 className="text-2xl font-bold mb-4">
            {error || "Property not found"}
          </h2>

          <p className="text-muted-foreground mb-6">
            This property may no longer be available.
          </p>

          <Button
            onClick={() => navigate("/properties")}
            className="rounded-xl px-8 bg-orange-500 hover:bg-orange-600"
          >
            Explore Properties
          </Button>
        </div>
      </div>
    );
  }

  /* ==========================================
     PROPERTY DATA
  ========================================== */

  const photos = Array.isArray(property.photos)
    ? property.photos
    : [];

  const amenities = getAmenitiesList();

  const previewAmenities =
    amenities.slice(0, 8);

  const location =
    property.location ||
    property.address ||
    property.city ||
    "Dehradun, Uttarakhand, India";

  /* ==========================================
     MAP COORDINATES
  ========================================== */

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

  const description =
    property.description ||
    "Experience a comfortable and memorable stay with everything you need for your perfect getaway.";

  const shouldTruncate =
    description.length > 500;

  const displayedDescription =
    !shouldTruncate || showFullDescription
      ? description
      : `${description.slice(0, 500)}...`;

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

  const locationText =
    typeof location === "object"
      ? location.address ||
        location.city ||
        "Dehradun, Uttarakhand, India"
      : location;

  return (
    <>
      <div className="min-h-screen bg-white pb-28 lg:pb-16">

        <Helmet>
          <title>
            {property.title || "Property"} | Take On BnB
          </title>

          <meta
            name="description"
            content={description.substring(0, 150)}
          />
        </Helmet>

        {/* TOP NAVIGATION */}

        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <div className="flex items-center gap-2">

              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="rounded-full hover:bg-gray-100"
              >
                <Share className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
                className="rounded-full hover:bg-gray-100"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isLiked
                      ? "fill-red-500 text-red-500"
                      : ""
                  }`}
                />
              </Button>

            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* TITLE */}

          <section className="pt-7 md:pt-10">

            <div className="flex flex-col gap-4">

              <div className="flex flex-wrap gap-2">

                {property.featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 text-orange-700 px-3 py-1 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    Guest favourite
                  </span>
                )}

                {property.propertyType && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize">
                    {property.propertyType}
                  </span>
                )}

              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                {property.title || "Beautiful stay"}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-sm md:text-base">

                <div className="flex items-center gap-2 font-semibold">

                  <Star className="w-4 h-4 fill-orange-500 text-orange-500" />

                  <span>
                    {rating
                      ? Number(rating).toFixed(1)
                      : "New"}
                  </span>

                </div>

                <span className="text-gray-300">
                  |
                </span>

                <div className="flex items-center gap-2 text-gray-600">

                  <MapPin className="w-4 h-4 text-orange-500" />

                  <span>
                    {locationText}
                  </span>

                </div>

              </div>

            </div>
          </section>

          {/* IMAGE GALLERY */}

          <div className="mt-7 md:mt-9 overflow-hidden rounded-3xl">
            <PropertyImageGallery photos={photos} />
          </div>

          {/* MAIN CONTENT */}

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-8 xl:gap-16 mt-8 md:mt-12">

            <div className="min-w-0">

              {/* SUMMARY */}

              <section className="pb-10 border-b border-gray-200">

                <h2 className="text-2xl md:text-3xl font-bold">
                  {property.propertyType
                    ? `${property.propertyType} hosted by ${hostName}`
                    : `Hosted by ${hostName}`}
                </h2>

                <div className="flex flex-wrap gap-2 mt-3 text-gray-600">

                  {guests > 0 && (
                    <span>{guests} guests</span>
                  )}

                  {bedrooms > 0 && (
                    <span>Â· {bedrooms} bedrooms</span>
                  )}

                  {beds > 0 && (
                    <span>Â· {beds} beds</span>
                  )}

                  {bathrooms > 0 && (
                    <span>Â· {bathrooms} bathrooms</span>
                  )}

                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7">

                  <div className="rounded-2xl bg-gray-50 p-4">
                    <Users className="w-5 h-5 text-orange-500 mb-3" />
                    <p className="text-xs text-gray-500">Guests</p>
                    <p className="font-bold">
                      {guests || "Flexible"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4">
                    <Bed className="w-5 h-5 text-orange-500 mb-3" />
                    <p className="text-xs text-gray-500">Bedrooms</p>
                    <p className="font-bold">
                      {bedrooms || "â€”"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4">
                    <BedDouble className="w-5 h-5 text-orange-500 mb-3" />
                    <p className="text-xs text-gray-500">Beds</p>
                    <p className="font-bold">
                      {beds || "â€”"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4">
                    <Bath className="w-5 h-5 text-orange-500 mb-3" />
                    <p className="text-xs text-gray-500">Bathrooms</p>
                    <p className="font-bold">
                      {bathrooms || "â€”"}
                    </p>
                  </div>

                </div>
              </section>

              {/* HOST */}

              <section className="py-8 md:py-10 border-b border-gray-200">

                <h2 className="text-2xl font-bold mb-6">
                  Meet your host
                </h2>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-6 rounded-3xl border border-gray-200">

                  <div className="flex items-center gap-4">

                    {hostImage ? (
                      <img
                        src={hostImage}
                        alt={hostName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                        <UserRound className="w-8 h-8 text-orange-500" />
                      </div>
                    )}

                    <div>
                      <h3 className="font-bold text-lg">
                        {hostName}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Host on Take On BnB
                      </p>
                    </div>

                  </div>

                  <Button
                    variant="outline"
                    className="rounded-xl h-11 px-5"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact host
                  </Button>

                </div>
              </section>

              {/* DESCRIPTION */}

              <section className="py-8 md:py-10 border-b border-gray-200">

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
                    className="mt-5 font-bold underline"
                  >
                    {showFullDescription
                      ? "Show less"
                      : "Show more"}
                  </button>
                )}

              </section>

              {/* AMENITIES */}

              <section className="py-8 md:py-10 border-b border-gray-200">

                <h2 className="text-2xl font-bold mb-7">
                  What this place offers
                </h2>

                {amenities.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">

                      {previewAmenities.map(
                        (amenity, index) => (
                          <div
                            key={`${amenity}-${index}`}
                            className="flex items-center gap-4"
                          >
                            {getAmenityIcon(amenity)}

                            <span>
                              {formatAmenity(amenity)}
                            </span>
                          </div>
                        )
                      )}

                    </div>

                    <Button
                      variant="outline"
                      onClick={() =>
                        setShowAmenities(true)
                      }
                      className="mt-8 h-12 px-6 rounded-xl border-black"
                    >
                      Show all {amenities.length} amenities

                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                ) : (
                  <AmenitiesGrid
                    amenities={property.amenities || []}
                  />
                )}

              </section>

              {/* THINGS TO KNOW */}

              <section className="py-8 md:py-10 border-b border-gray-200">

                <h2 className="text-2xl font-bold mb-7">
                  Things to know
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="rounded-2xl border p-5">

                    <Clock className="w-5 h-5 text-orange-500 mb-3" />

                    <h3 className="font-bold">
                      Check-in & Check-out
                    </h3>

                    <p className="text-sm text-gray-600 mt-2">
                      {property.checkIn
                        ? `Check-in: ${property.checkIn}`
                        : "Check-in details will be shared by the host."}
                    </p>

                    {property.checkOut && (
                      <p className="text-sm text-gray-600 mt-1">
                        Check-out: {property.checkOut}
                      </p>
                    )}

                  </div>

                  <div className="rounded-2xl border p-5">

                    <CheckCircle2 className="w-5 h-5 text-orange-500 mb-3" />

                    <h3 className="font-bold">
                      House rules
                    </h3>

                    <p className="text-sm text-gray-600 mt-2">
                      {typeof property.houseRules === "string"
                        ? property.houseRules
                        : "Please respect the property and follow the host's guidelines."}
                    </p>

                  </div>

                </div>
              </section>

              {/* REVIEWS */}

              <section className="py-8 md:py-10 border-b border-gray-200">

                <div className="flex items-center gap-3 mb-7">

                  <Star className="w-7 h-7 fill-orange-500 text-orange-500" />

                  <h2 className="text-2xl font-bold">
                    {rating
                      ? Number(rating).toFixed(1)
                      : "New"}{" "}
                    Â· Guest reviews
                  </h2>

                </div>

                {reviews.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {reviews.slice(0, 6).map(
                      (review, index) => (
                        <div
                          key={review.id || index}
                          className="rounded-2xl border border-gray-100 p-5"
                        >
                          <div className="flex items-center gap-3 mb-4">

                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600">
                              {(review.name ||
                                review.userName ||
                                "G")
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="font-bold">
                                {review.name ||
                                  review.userName ||
                                  "Guest"}
                              </p>

                              <div className="flex gap-1">
                                <Star className="w-4 h-4 fill-orange-500 text-orange-500" />

                                <span className="text-sm">
                                  {review.rating || 5}
                                </span>
                              </div>
                            </div>

                          </div>

                          <p className="text-sm text-gray-600 leading-6">
                            {review.comment ||
                              review.review ||
                              "Great stay and wonderful experience."}
                          </p>

                        </div>
                      )
                    )}

                  </div>
                ) : (
                  <div className="rounded-3xl bg-gray-50 border border-gray-100 p-8 text-center">

                    <Star className="w-10 h-10 text-orange-400 mx-auto mb-3" />

                    <h3 className="font-bold text-lg">
                      No reviews yet
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                      Be one of the first guests to stay here.
                    </p>

                  </div>
                )}

              </section>

              {/* LOCATION + MAP */}

              <section className="py-8 md:py-10">

                <h2 className="text-2xl font-bold mb-2">
                  Where you'll be
                </h2>

                <p className="text-gray-500 mb-6">
                  {locationText}
                </p>

                <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-sm">

                  <div className="h-[380px] md:h-[460px] w-full">

                    <MapContainer
                      center={mapPosition}
                      zoom={13}
                      scrollWheelZoom={true}
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
                          <div className="min-w-[180px]">

                            <strong>
                              {property.title || "Property"}
                            </strong>

                            <p className="text-sm mt-1">
                              {locationText}
                            </p>

                          </div>
                        </Popup>

                      </Marker>

                    </MapContainer>

                  </div>

                  <div className="bg-white p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-orange-500" />
                      </div>

                      <div>
                        <h3 className="font-bold text-lg">
                          Property location
                        </h3>

                        <p className="text-gray-500 text-sm">
                          {locationText}
                        </p>
                      </div>

                    </div>

                    <a
                      href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-gray-300 font-semibold hover:bg-gray-50"
                    >
                      <Navigation className="w-4 h-4" />

                      Open map
                    </a>

                  </div>

                </div>

              </section>

            </div>


              {/* ==========================================
                  MORE PROPERTIES IN THIS AREA
              ========================================== */}
            


              {/* DESKTOP BOOKING */}

            <aside
              id="booking-widget"
              className="hidden lg:block"
            >

              <div className="sticky top-24">

                <div className="rounded-3xl border border-gray-200 bg-white shadow-xl p-6">
                  <BookingWidget property={property} />
                </div>

              </div>

            </aside>

<section className="py-8 md:py-10 border-t border-gray-200">

                <div className="flex items-center justify-between gap-4 mb-7">

                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      More stays in {locationText}
                    </h2>

                    <p className="text-sm md:text-base text-gray-500 mt-2">
                      Explore other live properties near this location
                    </p>
                  </div>

                  {nearbyProperties.length > 2 && (
                    <div className="hidden md:flex items-center gap-2">

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          scrollNearbyProperties("left")
                        }
                        className="rounded-full w-11 h-11"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          scrollNearbyProperties("right")
                        }
                        className="rounded-full w-11 h-11"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>

                    </div>
                  )}

                </div>

                {nearbyLoading ? (

                  <div className="flex gap-5 overflow-hidden">

                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="min-w-[280px] sm:min-w-[320px]"
                      >
                        <Skeleton className="h-[220px] w-full rounded-3xl mb-4" />
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}

                  </div>

                ) : nearbyProperties.length > 0 ? (

                  <div
                    ref={nearbyScrollRef}
                    className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory"
                  >

                    {nearbyProperties.map((nearbyProperty) => {

                      const nearbyId =
                        nearbyProperty.id ||
                        nearbyProperty._id;

                      const nearbyPhotos =
                        Array.isArray(nearbyProperty.photos)
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
                          : (
                              firstImage?.url ||
                              firstImage?.secure_url ||
                              firstImage?.src ||
                              ""
                            );

                      const nearbyLocation =
                        typeof (
                          nearbyProperty.location ||
                          nearbyProperty.address ||
                          nearbyProperty.city
                        ) === "object"
                          ? (
                              nearbyProperty.location?.address ||
                              nearbyProperty.location?.city ||
                              nearbyProperty.city ||
                              locationText
                            )
                          : (
                              nearbyProperty.location ||
                              nearbyProperty.address ||
                              nearbyProperty.city ||
                              locationText
                            );

                      const nearbyRating =
                        nearbyProperty.rating ||
                        nearbyProperty.averageRating;

                      const nearbyPrice =
                        nearbyProperty.pricePerNight ||
                        nearbyProperty.price ||
                        0;

                      return (

                        <article
                          key={nearbyId || nearbyProperty.title}
                          onClick={() => {
                            if (!nearbyId) {
                              console.error("Nearby property ID is missing:", nearbyProperty);
                              return;
                            }

                            navigate(`/properties/${nearbyId}`);
                          }}
                          className="group min-w-[280px] sm:min-w-[320px] max-w-[320px] cursor-pointer snap-start"
                        >

                          <div className="relative overflow-hidden rounded-3xl aspect-[4/3] bg-gray-100">

                            {imageUrl ? (

                              <img
                                src={imageUrl}
                                alt={
                                  nearbyProperty.title ||
                                  "Property"
                                }
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />

                            ) : (

                              <div className="w-full h-full flex items-center justify-center text-5xl">
                                🏡
                              </div>

                            )}

                            <button
                              type="button"
                              onClick={(event) =>
                                event.stopPropagation()
                              }
                              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm"
                            >
                              <Heart className="w-5 h-5" />
                            </button>

                            {nearbyProperty.featured && (
                              <div className="absolute top-4 left-4">

                                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold shadow-sm">
                                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                                  Guest favourite
                                </span>

                              </div>
                            )}

                          </div>

                          <div className="pt-4">

                            <div className="flex items-start justify-between gap-3">

                              <div className="min-w-0">

                                <h3 className="font-bold text-base text-gray-900 truncate">
                                  {nearbyProperty.title ||
                                    "Beautiful stay"}
                                </h3>

                                <div className="flex items-center gap-1 mt-1 text-sm text-gray-500 truncate">

                                  <MapPin className="w-4 h-4 text-orange-500 shrink-0" />

                                  <span className="truncate">
                                    {nearbyLocation}
                                  </span>

                                </div>

                              </div>

                              {nearbyRating && (
                                <div className="flex items-center gap-1 text-sm font-semibold shrink-0">

                                  <Star className="w-4 h-4 fill-orange-500 text-orange-500" />

                                  {Number(nearbyRating).toFixed(1)}

                                </div>
                              )}

                            </div>

                            <div className="flex items-center justify-between mt-3">

                              <p className="font-bold text-gray-900">

                                ₹
                                {Number(
                                  nearbyPrice
                                ).toLocaleString("en-IN")}

                                <span className="font-normal text-sm text-gray-500">
                                  {" "}
                                  / night
                                </span>

                              </p>

                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();

                                  if (!nearbyId) {
                                    console.error("Nearby property ID is missing:", nearbyProperty);
                                    return;
                                  }

                                  navigate(`/properties/${nearbyId}`);
                                }}
                                className="text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline transition-colors"
                              >
                                View stay →
                              </button>

                            </div>

                          </div>

                        </article>
                      );
                    })}

                  </div>

                ) : (

                  <div className="rounded-3xl bg-gray-50 border border-gray-100 p-8 text-center">

                    <MapPin className="w-10 h-10 text-orange-400 mx-auto mb-3" />

                    <h3 className="font-bold text-lg">
                      More properties coming soon
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                      We're adding more amazing stays in this area.
                    </p>

                  </div>

                )}

              </section>


          </div>

        </main>

        {/* MOBILE BOOKING BAR */}

        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-xl">

          <div className="px-4 py-3 flex items-center justify-between gap-4">

            <div>

              <div className="font-bold text-base">
                â‚¹
                {Number(
                  property.pricePerNight ||
                    property.price ||
                    0
                ).toLocaleString("en-IN")}

                <span className="font-normal text-sm text-gray-500">
                  {" "}
                  / night
                </span>
              </div>

              <div className="flex items-center gap-1 text-sm">

                <Star className="w-4 h-4 fill-orange-500 text-orange-500" />

                <span>
                  {rating
                    ? Number(rating).toFixed(1)
                    : "New"}
                </span>

              </div>

            </div>

            <Button
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });

                setTimeout(() => {
                  alert(
                    "Please select your check-in and check-out dates."
                  );
                }, 500);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl px-6 h-12"
            >
              Check dates
            </Button>

          </div>

        </div>

      </div>

      {/* AMENITIES MODAL */}

      {showAmenities && (

        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
          onMouseDown={() =>
            setShowAmenities(false)
          }
        >

          <div className="absolute inset-0 bg-black/50" />

          <div
            className="relative z-10 w-full sm:max-w-2xl max-h-[88vh] bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden"
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

            <div className="overflow-y-auto max-h-[calc(88vh-90px)] px-6 py-6">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {amenities.map(
                  (amenity, index) => (
                    <div
                      key={`${amenity}-${index}`}
                      className="flex items-center gap-4 p-4 rounded-2xl border"
                    >

                      <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
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







