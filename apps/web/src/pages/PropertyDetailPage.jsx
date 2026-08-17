import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import api from "@/lib/api.js";

import { PropertyImageGallery } from "@/components/property/PropertyImageGallery.jsx";
import { BookingWidget } from "@/components/property/BookingWidget.jsx";

import {
  PropertyHeader,
  PropertyInfoCards,
  AmenitiesGrid,
  HouseRulesSection,
  HostCard,
  LocationMap,
} from "@/components/property/PropertyComponents.jsx";

import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Share, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);

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
          setError(
            "Property not found or unavailable."
          );
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
        console.error(
          "Error fetching property:",
          err
        );

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <Skeleton className="h-10 w-2/3 md:w-1/3 mb-6 rounded-xl" />

          <Skeleton className="h-[280px] sm:h-[400px] lg:h-[520px] w-full rounded-3xl mb-10" />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

            <div className="space-y-6">
              <Skeleton className="h-40 w-full rounded-2xl" />
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>

            <Skeleton className="h-[420px] rounded-3xl" />

          </div>

        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4 bg-white">

        <div className="max-w-md">

          <div className="text-6xl mb-6">
            🏠
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {error || "Property not found"}
          </h2>

          <p className="text-muted-foreground mb-6">
            This property may no longer be available.
          </p>

          <Button
            onClick={() =>
              navigate("/properties")
            }
            className="rounded-xl px-8"
          >
            Explore Properties
          </Button>

        </div>

      </div>
    );
  }

  const photos = Array.isArray(property.photos)
    ? property.photos
    : [];

  return (
    <div className="min-h-screen bg-white pb-28 lg:pb-16">

      <Helmet>
        <title>
          {property.title || "Property"} | Take On BnB
        </title>

        <meta
          name="description"
          content={
            property.description?.substring(0, 150) ||
            "Discover amazing stays with Take On BnB"
          }
        />
      </Helmet>

      {/* ADMIN PREVIEW */}
      {(property.status === "pending" ||
        property.status === "rejected") && (
        <div className="bg-orange-50 border-b border-orange-200">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-sm font-semibold text-orange-700">

            Preview only — this listing is currently{" "}

            <span className="capitalize">
              {property.status}
            </span>

            {property.status === "rejected" &&
            property.rejectionReason
              ? ` • Reason: ${property.rejectionReason}`
              : ""}

          </div>

        </div>
      )}

      {/* TOP NAVIGATION */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">

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
              onClick={() =>
                setIsLiked(!isLiked)
              }
              className="rounded-full hover:bg-gray-100"
            >
              <Heart
                className={`w-5 h-5 transition-all ${
                  isLiked
                    ? "fill-red-500 text-red-500 scale-110"
                    : ""
                }`}
              />
            </Button>

          </div>

        </div>

      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TITLE */}
        <div className="pt-6 md:pt-10 animate-in fade-in slide-in-from-bottom-3 duration-700">

          <PropertyHeader property={property} />

        </div>

        {/* IMAGE GALLERY */}
        <div className="mt-6 md:mt-8 animate-in fade-in zoom-in-95 duration-700">

          <div className="overflow-hidden rounded-2xl lg:rounded-3xl">

            <PropertyImageGallery
              photos={photos}
            />

          </div>

        </div>

        {/* MAIN CONTENT */}

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-8 xl:gap-16 mt-8 md:mt-12">

          {/* LEFT CONTENT */}

          <div className="min-w-0">

            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">

              <PropertyInfoCards
                property={property}
              />

            </section>

            {/* DESCRIPTION */}

            <section className="py-8 md:py-10 border-b border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-700">

              <h2 className="text-xl md:text-2xl font-bold mb-4">
                About this place
              </h2>

              <p className="text-gray-600 text-base md:text-[17px] leading-7 md:leading-8 whitespace-pre-wrap">

                {property.description ||
                  "Experience a comfortable and memorable stay with everything you need for your perfect getaway."}

              </p>

            </section>

            {/* AMENITIES */}

            <section className="py-8 md:py-10 border-b border-gray-200">

              <AmenitiesGrid
                amenities={
                  property.amenities || []
                }
              />

            </section>

            {/* HOUSE RULES */}

            <section className="py-8 md:py-10 border-b border-gray-200">

              <HouseRulesSection
                houseRules={
                  property.houseRules
                }
                checkInTime={
                  property.checkInTime
                }
                checkOutTime={
                  property.checkOutTime
                }
              />

            </section>

            {/* LOCATION */}

            <section className="py-8 md:py-10 border-b border-gray-200">

              <LocationMap
                location={
                  property.location
                }
              />

            </section>

            {/* HOST */}

            <section className="py-8 md:py-10">

              <HostCard
                host={property.host}
              />

            </section>

          </div>

          {/* DESKTOP BOOKING CARD */}

          <aside
            id="booking-widget"
            className="hidden lg:block"
          >

            <div className="sticky top-24">

              <div className="rounded-3xl border border-gray-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.10)] p-6 transition-all duration-300 hover:shadow-[0_16px_50px_rgba(0,0,0,0.14)]">

                <BookingWidget
                  property={property}
                />

              </div>

              <div className="flex items-center justify-center gap-2 mt-5 text-sm text-gray-500">

                <Star className="w-4 h-4 fill-current" />

                <span>
                  {property.rating || "New"}{" "}

                  {property.totalBookings
                    ? `• ${property.totalBookings} reviews`
                    : ""}
                </span>

              </div>

            </div>

          </aside>

        </div>

      </main>

      {/* MOBILE BOOKING BAR */}

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200">

        <div className="px-4 py-3 flex items-center justify-between gap-4">

          <div className="min-w-0">

            <div className="font-bold text-base">

              ₹
              {Number(
                property.pricePerNight || 0
              ).toLocaleString("en-IN")}

              <span className="font-normal text-sm text-gray-500">
                {" "}
                / night
              </span>

            </div>

            <div className="flex items-center gap-1 text-sm">

              <Star className="w-4 h-4 fill-current" />

              <span className="font-medium">

                {property.rating || "New"}

              </span>

              {property.totalBookings > 0 && (
                <span className="text-gray-500">

                  · {property.totalBookings} reviews

                </span>
              )}

            </div>

          </div>

          <Button
            onClick={scrollToBooking}
            className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl px-6 h-12 shadow-lg shadow-orange-200"
          >
            Check dates
          </Button>

        </div>

      </div>

    </div>
  );
};

export default PropertyDetailPage;