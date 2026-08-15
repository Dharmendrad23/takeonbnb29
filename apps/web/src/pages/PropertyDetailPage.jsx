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
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("Loading property:", id);

        const response = await api.get(`/properties/${id}`);

        console.log("Property detail API response:", response.data);

        // Backend returns { success, property }
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-10 w-1/3 mb-4 rounded-xl" />
        <Skeleton className="h-[400px] w-full rounded-2xl mb-8" />

        <div className="flex gap-12">
          <div className="w-2/3">
            <Skeleton className="h-[500px] rounded-2xl" />
          </div>

          <div className="w-1/3">
            <Skeleton className="h-[400px] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold mb-4">
          {error || "Property not found"}
        </h2>

        <Button
          onClick={() => navigate("/properties")}
          variant="outline"
        >
          Back to properties
        </Button>
      </div>
    );
  }

  const photos = Array.isArray(property.photos)
    ? property.photos
    : [];

  return (
    <div className="bg-background min-h-screen pb-24">
      <Helmet>
        <title>
          {property.title || "Property"} | Take on BnB
        </title>

        <meta
          name="description"
          content={
            property.description?.substring(
              0,
              150
            ) || "Take on BnB property"
          }
        />
      </Helmet>

      {(property.status === "pending" ||
        property.status === "rejected") && (
        <div className="bg-warning/10 border-b border-warning/30 text-warning-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 text-sm font-semibold">
            Preview only — this listing is currently{" "}
            <span className="capitalize">
              {property.status}
            </span>

            {property.status === "rejected" &&
              property.rejectionReason
              ? ` Reason: ${property.rejectionReason}`
              : ""}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="md:hidden py-4 -mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full bg-muted/50"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>

        <PropertyHeader property={property} />

        <PropertyImageGallery photos={photos} />

        <div className="flex flex-col lg:flex-row gap-12 mt-12 relative">

          <div className="flex-1 lg:max-w-[66%]">

            <PropertyInfoCards
              property={property}
            />

            <div className="py-8 border-b border-border">
              <p className="text-foreground/90 text-base leading-relaxed whitespace-pre-wrap">
                {property.description ||
                  "Experience a stay like no other. Beautiful surroundings, comfortable amenities, and a host dedicated to ensuring your perfect vacation."}
              </p>
            </div>

            <AmenitiesGrid
              amenities={property.amenities || []}
            />

            <HouseRulesSection
              houseRules={property.houseRules}
              checkInTime={property.checkInTime}
              checkOutTime={property.checkOutTime}
            />

            <LocationMap
              location={property.location}
            />

            <HostCard
              host={property.host}
            />
          </div>

          <div className="w-full lg:w-[33%] hidden lg:block">
            <BookingWidget property={property} />
          </div>

        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50 flex items-center justify-between shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">

        <div>
          <div className="font-bold text-foreground">
            ₹
            {property.pricePerNight?.toLocaleString(
              "en-IN"
            )}

            <span className="font-normal text-sm text-muted-foreground">
              {" "}
              /night
            </span>
          </div>

          <div className="text-sm font-semibold underline text-foreground">
            {property.rating || 0} ·{" "}
            {property.totalBookings || 0} reviews
          </div>
        </div>

        <Button
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          className="bg-primary text-primary-foreground font-bold rounded-xl px-8 h-12"
        >
          Check dates
        </Button>
      </div>
    </div>
  );
};

export default PropertyDetailPage;