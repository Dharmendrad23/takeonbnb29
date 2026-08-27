import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import api from "@/lib/api.js";
import { BookingWidget } from "@/components/property/BookingWidget.jsx";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  CalendarCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  ShieldCheck,
  Star,
  Users,
  Wifi,
  X,
} from "lucide-react";

const SAFFRON = "#E8750A";
const SAFFRON_DARK = "#C65D00";
const SAFFRON_LIGHT = "#FFF4E5";

const propertyMarker = new L.DivIcon({
  className: "custom-property-marker",
  html: `
    <div style="
      background:#E8750A;
      color:white;
      padding:8px 12px;
      border-radius:999px;
      font-weight:800;
      font-size:14px;
      box-shadow:0 4px 14px rgba(0,0,0,.22);
      border:3px solid white;
      white-space:nowrap;
    ">
      ₹ Property
    </div>
  `,
  iconSize: [100, 40],
  iconAnchor: [50, 20],
});
const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [nearbyProperties, setNearbyProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/properties/${id}`);
        const data = response.data?.property || response.data;

        if (!data) throw new Error("Property not found.");

        if (mounted) {
          setProperty({
            ...data,
            id: data.id || data._id || id,
          });
          setActiveImage(0);
        }
      } catch (err) {
        console.error("Property loading error:", err);

        if (mounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Unable to load this property.",
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (id) loadProperty();
    else {
      setError("Property ID is missing.");
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!property) return;

    const loadNearby = async () => {
      try {
        const response = await api.get("/properties?status=approved");
        const data = response.data;
        const list = Array.isArray(data)
          ? data
          : data?.properties || data?.data || [];

        const currentId = String(property.id || property._id || id);

        setNearbyProperties(
          list
            .filter((item) => String(item.id || item._id || "") !== currentId)
            .slice(0, 8),
        );
      } catch (err) {
        console.warn("Nearby properties unavailable:", err);
        setNearbyProperties([]);
      }
    };

    loadNearby();
  }, [property, id]);

  const images = useMemo(() => {
    if (!property) return [];

    const source = Array.isArray(property.photos) ? property.photos : [];

    const normalized = source
      .map((item) => {
        if (typeof item === "string") return item;
        if (!item) return "";
        return item.url || item.secure_url || item.src || item.image || "";
      })
      .filter(Boolean);

    const fallback =
      property.coverImage || property.image || property.thumbnail || "";

    if (!normalized.length && fallback) normalized.push(fallback);

    return normalized;
  }, [property]);

  const title = property?.title || "Beautiful stay";

  const rawLocation =
    property?.location || property?.address || property?.city || "India";

  const location =
    typeof rawLocation === "object"
      ? rawLocation.address || rawLocation.city || "India"
      : rawLocation;
  const mapPosition = [
    Number(
      property?.latitude ??
        property?.lat ??
        property?.location?.latitude ??
        property?.location?.lat ??
        30.3165,
    ),
    Number(
      property?.longitude ??
        property?.lng ??
        property?.location?.longitude ??
        property?.location?.lng ??
        78.0322,
    ),
  ];

  const price = Number(property?.pricePerNight || property?.price || 0);

  const rating = Number(property?.rating || property?.averageRating || 0);

  const reviewCount =
    property?.reviewCount ||
    property?.totalReviews ||
    (Array.isArray(property?.reviews) ? property.reviews.length : 0);

  const guests =
    property?.maxGuests || property?.guestCapacity || property?.guests || 1;

  const bedrooms = property?.bedrooms || property?.numberOfBedrooms || 0;

  const bathrooms = property?.bathrooms || property?.numberOfBathrooms || 0;

  const propertyType =
    property?.propertyType || property?.type || "Entire place";

  const description =
    property?.description ||
    "Relax and enjoy a comfortable stay with everything you need for a memorable getaway.";

  const host = property?.host || property?.hostDetails || {};

  const hostName = host.name || property?.hostName || "Take On BNB";

  const hostImage = host.avatar || host.photo || property?.hostImage || "";

  const amenities = Array.isArray(property?.amenities)
    ? property.amenities
    : [];

  const reviewNames = [
    "Rahul Sharma",
    "Priya Verma",
    "Amit Joshi",
    "Neha Kapoor",
    "Rohan Mehta",
    "Pooja Gupta",
    "Arjun Singh",
    "Ananya Sharma",
    "Karan Malhotra",
    "Sneha Agarwal",
    "Vikram Rawat",
    "Riya Nair",
    "Aditya Kumar",
    "Kavya Iyer",
    "Nikhil Bansal",
    "Megha Patel",
    "Saurabh Thakur",
    "Simran Kaur",
    "Manish Verma",
    "Ayesha Khan",
  ];

  const reviews = Array.isArray(property?.reviews)
    ? property.reviews.map((review, index) => ({
        ...review,
        userName:
          review?.userName ||
          review?.name ||
          review?.guestName ||
          reviewNames[
            (String(property?.id || property?._id || property?.title || "")
              .split("")
              .reduce((sum, char) => sum + char.charCodeAt(0), 0) +
              index) %
              reviewNames.length
          ],
      }))
    : [];

  const rooms = Array.isArray(property?.rooms) ? property.rooms : [];

  const rules = Array.isArray(property?.houseRules)
    ? property.houseRules
    : Array.isArray(property?.rules)
      ? property.rules
      : [];

  const nextImage = () => {
    if (images.length <= 1) return;
    setActiveImage((current) => (current + 1) % images.length);
  };

  const previousImage = () => {
    if (images.length <= 1) return;
    setActiveImage((current) => (current - 1 + images.length) % images.length);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: `Check out ${title} on Take On BNB.`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Property link copied.");
      }
    } catch {
      // User cancelled share.
    }
  };

  const image = images[activeImage] || "";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7]">
        <div className="h-16 border-b border-gray-100 bg-white" />
        <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8">
          <div className="animate-pulse">
            <div className="mb-7 h-5 w-32 rounded bg-gray-200" />
            <div className="mb-8 h-10 w-2/3 rounded bg-gray-200" />
            <div className="grid gap-8 xl:grid-cols-[1fr_390px]">
              <div className="h-[560px] rounded-[28px] bg-gray-200" />
              <div className="h-[560px] rounded-[28px] bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf9f7] px-6">
        <div className="w-full max-w-lg rounded-[30px] border border-gray-200 bg-white p-8 text-center shadow-xl">
          <div
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: SAFFRON_LIGHT }}
          >
            <Home className="h-7 w-7" style={{ color: SAFFRON }} />
          </div>
          <h1 className="text-2xl font-extrabold">Property unavailable</h1>
          <p className="mt-3 text-gray-500">
            {error || "This property could not be found."}
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="mt-7 rounded-xl bg-[#E8750A] text-white hover:bg-[#C65D00]"
          >
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title} | Take On BNB</title>
        <meta name="description" content={description.slice(0, 155)} />
      </Helmet>

      <div className="min-h-screen bg-[#faf9f7] pb-24 text-gray-950 xl:pb-0">
        {/* HEADER */}
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-xl">
          <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-5 px-4 md:px-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-semibold transition hover:text-[#E8750A]"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLiked(!liked)}
                className="rounded-full"
              >
                <Heart
                  className={
                    liked ? "h-5 w-5 fill-[#E8750A] text-[#E8750A]" : "h-5 w-5"
                  }
                />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="rounded-full"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] px-4 md:px-8">
          {/* BREADCRUMB */}
          <div className="flex items-center gap-2 overflow-hidden py-5 text-xs text-gray-500 md:text-sm">
            <span className="font-semibold text-gray-900">Stays</span>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <span className="truncate">{location}</span>
            <ChevronRight className="hidden h-4 w-4 shrink-0 sm:block" />
            <span className="hidden truncate sm:block">{title}</span>
          </div>

          {/* TITLE */}
          <section className="mb-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-extrabold"
                    style={{
                      backgroundColor: SAFFRON_LIGHT,
                      color: SAFFRON,
                    }}
                  >
                    {propertyType}
                  </span>

                  {rating > 0 && (
                    <span className="flex items-center gap-1 text-sm font-bold">
                      <Star className="h-4 w-4 fill-[#E8750A] text-[#E8750A]" />
                      {rating.toFixed(1)}
                    </span>
                  )}
                </div>

                <h1 className="max-w-4xl text-3xl font-extrabold tracking-tight md:text-4xl lg:text-[44px] lg:leading-[1.08]">
                  {title}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#E8750A]" />
                    {location}
                  </span>

                  {rating > 0 && (
                    <span className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-[#E8750A] text-[#E8750A]" />
                      <strong className="text-gray-900">
                        {rating.toFixed(1)}
                      </strong>
                      {reviewCount > 0
                        ? ` (${reviewCount} reviews)`
                        : " Guest rating"}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleShare}
                className="hidden items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold hover:border-gray-300 lg:flex"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </section>

          {/* GALLERY + BOOKING */}
          <section className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_390px] xl:gap-9">
            <div className="min-w-0">
              {/* IMAGE GALLERY — same visual structure as requested */}
              <div className="grid h-[320px] grid-cols-1 gap-2 overflow-hidden rounded-[24px] bg-gray-200 sm:h-[430px] md:grid-cols-4 lg:h-[560px]">
                <div className="relative overflow-hidden md:col-span-2 md:row-span-2">
                  {image ? (
                    <img
                      src={image}
                      alt={title}
                      className="h-full w-full object-cover transition duration-500"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <Home className="h-16 w-16 text-gray-400" />
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />

                  <div
                    className="absolute left-4 top-4 rounded-full px-4 py-2 text-xs font-extrabold text-white shadow-lg"
                    style={{ backgroundColor: SAFFRON }}
                  >
                    {property?.badge || "Featured stay"}
                  </div>

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={previousImage}
                        className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-lg transition hover:scale-105"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-lg transition hover:scale-105"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>

                {images.slice(1, 5).map((item, index) => (
                  <button
                    key={item + index}
                    onClick={() => setActiveImage(index + 1)}
                    className="relative hidden overflow-hidden md:block"
                  >
                    <img
                      src={item}
                      alt={`${title} ${index + 2}`}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />

                    {index === 3 && (
                      <span className="absolute bottom-4 right-4 rounded-xl bg-black/75 px-4 py-2 text-xs font-bold text-white backdrop-blur">
                        View all {images.length} photos
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* THUMBNAILS */}
              {images.length > 1 && (
                <div className="scrollbar-hide flex gap-3 overflow-x-auto py-4">
                  {images.slice(0, 8).map((item, index) => (
                    <button
                      key={item + index}
                      onClick={() => setActiveImage(index)}
                      className={`h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition md:h-20 md:w-24 ${
                        activeImage === index
                          ? "border-[#E8750A]"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={item}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* QUICK STATS */}
              <div className="grid grid-cols-2 gap-3 py-3 sm:grid-cols-4">
                <QuickStat
                  icon={<Home />}
                  value={propertyType}
                  label="Property type"
                />
                <QuickStat icon={<Users />} value={guests} label="Guests" />
                <QuickStat
                  icon={<BedDouble />}
                  value={bedrooms || "—"}
                  label="Bedrooms"
                />
                <QuickStat
                  icon={<Bath />}
                  value={bathrooms || "—"}
                  label="Bathrooms"
                />
              </div>

              {/* ABOUT */}
              <section className="mb-5 rounded-[26px] border border-gray-200 bg-white p-6 md:p-8">
                <h2 className="mb-4 text-2xl font-extrabold">
                  About this place
                </h2>
                <p className="whitespace-pre-wrap leading-7 text-gray-600">
                  {description}
                </p>
              </section>

              {/* AMENITIES */}
              <section className="mb-5 rounded-[26px] border border-gray-200 bg-white p-6 md:p-8">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold">Amenities</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Everything available at this property
                    </p>
                  </div>

                  {amenities.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAmenitiesModal(true)}
                      className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold transition hover:border-[#E8750A] hover:text-[#E8750A]"
                    >
                      View all
                    </button>
                  )}
                </div>

                {amenities.length ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {amenities.slice(0, 8).map((amenity, index) => {
                      const name =
                        typeof amenity === "string"
                          ? amenity
                          : amenity?.name || "Amenity";

                      return (
                        <div
                          key={String(name) + index}
                          className="rounded-2xl border border-gray-200 bg-gray-50/60 p-4 transition hover:border-[#E8750A]"
                        >
                          <CheckCircle2 className="mb-3 h-5 w-5 text-[#E8750A]" />
                          <span className="text-sm font-semibold">{name}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Amenities will be shown here when available.
                  </p>
                )}
              </section>

              {/* AMENITIES MODAL */}
              {showAmenitiesModal && (
                <div
                  className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
                  onClick={() => setShowAmenitiesModal(false)}
                >
                  <div
                    className="relative max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 md:px-8">
                      <div>
                        <h2 className="text-2xl font-extrabold">Amenities</h2>
                        <p className="mt-1 text-sm text-gray-500">
                          {amenities.length} amenities available
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowAmenitiesModal(false)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-black"
                        aria-label="Close amenities"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="max-h-[65vh] overflow-y-auto px-6 py-6 md:px-8">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {amenities.map((amenity, index) => {
                          const name =
                            typeof amenity === "string"
                              ? amenity
                              : amenity?.name || "Amenity";

                          return (
                            <div
                              key={String(name) + index}
                              className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4 transition hover:border-[#E8750A] hover:bg-orange-50/30"
                            >
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                                <CheckCircle2 className="h-5 w-5 text-[#E8750A]" />
                              </div>

                              <span className="text-sm font-semibold text-gray-800">
                                {name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-6 py-4 md:px-8">
                      <button
                        type="button"
                        onClick={() => setShowAmenitiesModal(false)}
                        className="w-full rounded-xl bg-[#E8750A] px-5 py-3 font-extrabold text-white transition hover:bg-[#d96805]"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ROOMS */}
              {rooms.length > 0 && (
                <section className="mb-5 rounded-[26px] border border-gray-200 bg-white p-6 md:p-8">
                  <h2 className="text-2xl font-extrabold">Rooms & Beds</h2>

                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    {rooms.slice(0, 6).map((room, index) => {
                      const roomImage =
                        typeof room.image === "string"
                          ? room.image
                          : room.image?.url ||
                            room.photo ||
                            room.photos?.[0] ||
                            "";

                      return (
                        <div
                          key={room.id || room._id || index}
                          className="overflow-hidden rounded-2xl border border-gray-200"
                        >
                          {roomImage && (
                            <img
                              src={roomImage}
                              alt={room.name || `Room ${index + 1}`}
                              className="h-44 w-full object-cover"
                            />
                          )}
                          <div className="p-4">
                            <h3 className="font-extrabold">
                              {room.name || `Bedroom ${index + 1}`}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {room.bed ||
                                room.beds ||
                                room.type ||
                                "Comfortable sleeping space"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* HOST */}
              <section className="mb-5 rounded-[26px] border border-gray-200 bg-white p-6 md:p-8">
                <h2 className="mb-5 text-2xl font-extrabold">
                  Hosted by {hostName}
                </h2>

                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    {hostImage ? (
                      <img
                        src={hostImage}
                        alt={hostName}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-full text-xs font-black text-white"
                        style={{ backgroundColor: "#171717" }}
                      >
                        TOB
                      </div>
                    )}

                    <div>
                      <p className="font-extrabold">{hostName}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Superhost · Trusted host
                      </p>
                    </div>
                  </div>

                  <Button variant="outline" className="rounded-xl font-bold">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact host
                  </Button>
                </div>
              </section>

              {/* RULES */}
              {rules.length > 0 && (
                <section className="mb-5 rounded-[26px] border border-gray-200 bg-white p-6 md:p-8">
                  <h2 className="mb-5 text-2xl font-extrabold">
                    Property Rules
                  </h2>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {rules.slice(0, 10).map((rule, index) => {
                      const ruleName =
                        typeof rule === "string"
                          ? rule
                          : rule?.name || rule?.title || "Property rule";

                      return (
                        <div
                          key={String(ruleName) + index}
                          className="rounded-2xl bg-gray-50 p-4"
                        >
                          <ShieldCheck
                            className="mb-2 h-5 w-5"
                            style={{ color: SAFFRON }}
                          />
                          <p className="text-sm font-bold">{ruleName}</p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* LOCATION */}
              <section className="mb-5 rounded-[26px] border border-gray-200 bg-white p-6 md:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold">Location</h2>
                    <div className="mt-2 flex items-center gap-2 text-gray-500">
                      <MapPin className="h-4 w-4 text-[#E8750A]" />
                      {location}
                    </div>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      location,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold hover:border-[#E8750A] sm:block"
                  >
                    Get directions
                  </a>
                </div>

                <div className="relative mt-6 h-[360px] overflow-hidden rounded-3xl border border-gray-200">
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

                    <Marker position={mapPosition} icon={propertyMarker}>
                      <Popup>
                        <div className="min-w-[180px]">
                          <p className="font-extrabold">{title}</p>
                          <p className="mt-1 text-sm text-gray-500">
                            {location}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>

                  <div className="absolute bottom-4 left-4 z-[1000] rounded-2xl bg-white px-4 py-3 shadow-lg">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-[#E8750A]" />

                      <div>
                        <p className="text-sm font-extrabold">{title}</p>
                        <p className="text-xs text-gray-500">{location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* REVIEWS */}
              <section className="mb-8 rounded-[26px] border border-gray-200 bg-white p-6 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: SAFFRON_LIGHT }}
                  >
                    <Star className="h-6 w-6 fill-[#E8750A] text-[#E8750A]" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-extrabold">
                      {rating ? rating.toFixed(1) : "—"} Guest reviews
                    </h2>
                    <p className="text-sm text-gray-500">
                      {reviewCount || 0} reviews
                    </p>
                  </div>
                </div>

                {reviews.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {reviews.slice(0, 6).map((review, index) => (
                      <div
                        key={review.id || review._id || index}
                        className="rounded-2xl border border-gray-200 p-5"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-extrabold"
                            style={{
                              backgroundColor: "#FFE8CC",
                              color: SAFFRON_DARK,
                            }}
                          >
                            {(review.name || review.userName || "G")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="font-extrabold">
                              {review.name || review.userName || "Guest"}
                            </p>

                            <div className="flex items-center gap-1 text-sm">
                              <Star className="h-3.5 w-3.5 fill-[#E8750A] text-[#E8750A]" />
                              {review.rating || 5}
                            </div>
                          </div>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-gray-600">
                          {review.comment ||
                            review.review ||
                            "Wonderful stay and a great experience."}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-7 text-center">
                    <p className="font-bold">No reviews yet</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Be one of the first guests to experience this stay.
                    </p>
                  </div>
                )}
              </section>
            </div>

            {/* DESKTOP BOOKING */}
            <aside className="hidden xl:block">
              <div className="sticky top-[88px]">
                <div className="rounded-[30px] border border-gray-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.10)]">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-extrabold">
                        ₹{price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-sm text-gray-500"> / night</span>
                    </div>

                    {rating > 0 && (
                      <div className="flex items-center gap-1 text-sm font-bold">
                        <Star className="h-4 w-4 fill-[#E8750A] text-[#E8750A]" />
                        {rating.toFixed(1)}
                      </div>
                    )}
                  </div>

                  <BookingWidget property={property} />

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <ShieldCheck className="h-4 w-4 text-[#E8750A]" />
                    Secure booking
                  </div>

                  <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 py-3 font-bold hover:border-[#E8750A]">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    Chat on WhatsApp
                  </button>

                  <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 py-3 font-bold hover:border-[#E8750A]">
                    <Phone className="h-5 w-5 text-[#E8750A]" />
                    Call Host
                  </button>
                </div>

                <div className="mt-5 rounded-[26px] border border-gray-200 bg-white p-6">
                  <div className="flex items-center gap-3">
                    {hostImage ? (
                      <img
                        src={hostImage}
                        alt={hostName}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-950 text-[9px] font-black text-white">
                        TOB
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-gray-500">Hosted by</p>
                      <p className="font-extrabold">{hostName}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2 border-t border-gray-100 pt-5 text-center">
                    <HostStat value="100%" label="Response" />
                    <HostStat value="1 hr" label="Response time" />
                    <HostStat value="5+" label="Years hosting" />
                  </div>
                </div>

                {nearbyProperties.length > 0 && (
                  <div className="mt-5 rounded-[26px] border border-gray-200 bg-white p-5">
                    <h3 className="mb-3 text-lg font-extrabold">
                      Nearby stays
                    </h3>

                    {nearbyProperties.slice(0, 5).map((item) => (
                      <button
                        key={item.id || item._id || item.title}
                        onClick={() =>
                          navigate(`/properties/${item.id || item._id}`)
                        }
                        className="flex w-full items-center gap-3 border-b py-3 text-left last:border-0"
                      >
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                          {getPropertyImage(item) && (
                            <img
                              src={getPropertyImage(item)}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold">
                            {item.title || "Beautiful stay"}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {getPropertyLocation(item)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          </section>

          {/* MORE STAYS */}
          {nearbyProperties.length > 0 && (
            <section className="py-12">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p
                    className="text-sm font-extrabold uppercase tracking-wider"
                    style={{ color: SAFFRON }}
                  >
                    Explore more
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold md:text-3xl">
                    More stays nearby
                  </h2>
                </div>

                <button
                  onClick={() => navigate("/properties")}
                  className="hidden items-center gap-2 text-sm font-bold sm:flex"
                  style={{ color: SAFFRON }}
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="scrollbar-hide flex gap-5 overflow-x-auto pb-4">
                {nearbyProperties.map((item) => {
                  const itemId = item.id || item._id;
                  const itemImage = getPropertyImage(item);
                  const itemLocation = getPropertyLocation(item);
                  const itemPrice = Number(
                    item.pricePerNight || item.price || 0,
                  );

                  return (
                    <article
                      key={itemId || item.title}
                      onClick={() => {
                        if (itemId) {
                          navigate(`/properties/${itemId}`);
                        }
                      }}
                      className="group w-[280px] shrink-0 cursor-pointer sm:w-[310px]"
                    >
                      <div className="aspect-[4/3] overflow-hidden rounded-[24px] bg-gray-200">
                        {itemImage ? (
                          <img
                            src={itemImage}
                            alt={item.title || "Property"}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Home className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="pt-4">
                        <h3 className="truncate font-extrabold">
                          {item.title || "Beautiful stay"}
                        </h3>

                        <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                          <MapPin className="h-4 w-4 text-[#E8750A]" />
                          <span className="truncate">{itemLocation}</span>
                        </div>

                        <p className="mt-3 font-extrabold">
                          ₹{itemPrice.toLocaleString("en-IN")}
                          <span className="text-sm font-normal text-gray-500">
                            {" "}
                            / night
                          </span>
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </main>

        {/* MOBILE BOOKING BAR */}
        <div className="fixed bottom-0 left-0 right-0 z-[80] border-t border-gray-200 bg-white/95 shadow-[0_-15px_45px_rgba(0,0,0,0.12)] backdrop-blur-xl xl:hidden">
          <div className="mx-auto max-w-2xl px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold">
                    ₹{price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-gray-500">/ night</span>
                </div>

                {rating > 0 && (
                  <div className="mt-1 flex items-center gap-1 text-xs">
                    <Star className="h-3.5 w-3.5 fill-[#E8750A] text-[#E8750A]" />
                    <span className="font-bold">{rating.toFixed(1)}</span>
                    <span className="text-gray-400">· {reviewCount || 0}</span>
                  </div>
                )}
              </div>

              <Button
                type="button"
                onClick={() => setShowBooking(true)}
                className="h-12 shrink-0 rounded-2xl bg-[#E8750A] px-7 font-extrabold text-white shadow-[0_10px_25px_rgba(232,117,10,.30)] hover:bg-[#C65D00]"
              >
                Check dates
              </Button>
            </div>
          </div>
        </div>

        {/* MOBILE BOOKING SHEET */}
        {showBooking && (
          <div className="fixed inset-0 z-[100] flex items-end xl:hidden">
            <button
              type="button"
              aria-label="Close booking"
              onClick={() => setShowBooking(false)}
              className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            />

            <div className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-[30px] bg-white shadow-2xl">
              <div className="flex justify-center pt-3">
                <div className="h-1.5 w-12 rounded-full bg-gray-300" />
              </div>

              <div className="flex items-center justify-between border-b border-gray-100 px-5 pb-4 pt-4">
                <div>
                  <h2 className="text-lg font-extrabold">Reserve your stay</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Choose dates and guests
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowBooking(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 pb-10">
                <div className="rounded-[26px] border border-gray-200 p-4 shadow-sm">
                  <BookingWidget property={property} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FULLSCREEN GALLERY */}
        {showGallery && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black">
            <button
              type="button"
              onClick={() => setShowGallery(false)}
              className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <X className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={previousImage}
              className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white md:left-8"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {image && (
              <img
                src={image}
                alt={title}
                className="max-h-[88vh] max-w-[94vw] rounded-2xl object-contain"
              />
            )}

            <button
              type="button"
              onClick={nextImage}
              className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white md:right-8"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

function QuickStat({ icon, value, label }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="mb-3 text-[#E8750A]">
        {React.cloneElement(icon, {
          className: "h-5 w-5",
        })}
      </div>
      <p className="truncate text-sm font-extrabold">{value}</p>
      <p className="mt-1 text-xs text-gray-500">{label}</p>
    </div>
  );
}

function HostStat({ value, label }) {
  return (
    <div>
      <p className="text-sm font-extrabold">{value}</p>
      <p className="mt-1 text-[10px] text-gray-500">{label}</p>
    </div>
  );
}

function getPropertyImage(item) {
  const photos = Array.isArray(item?.photos) ? item.photos : [];

  const first = photos[0];

  if (typeof first === "string") return first;

  return (
    first?.url ||
    first?.secure_url ||
    first?.src ||
    first?.image ||
    item?.image ||
    item?.thumbnail ||
    item?.coverImage ||
    ""
  );
}

function getPropertyLocation(item) {
  const raw = item?.location;

  if (raw && typeof raw === "object") {
    return raw.address || raw.city || "India";
  }

  return raw || item?.city || item?.address || "India";
}

export default PropertyDetailPage;
