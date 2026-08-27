import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import api from "@/lib/api.js";
import { BookingWidget } from "@/components/property/BookingWidget.jsx";
import { Button } from "@/components/ui/button";

import {
  ArrowLeft,
  CheckCircle2,
  ArrowRight,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  Home,
  MapPin,
  Menu,
  MessageCircle,
  Share2,
  ShieldCheck,
  Star,
  Users,
  Wifi,
  X,
} from "lucide-react";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const [nearbyProperties, setNearbyProperties] =
    useState([]);

  /* =====================================================
     FETCH PROPERTY
  ===================================================== */

  useEffect(() => {
    let mounted = true;

    const loadProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/properties/${id}`
        );

        const data =
          response.data?.property ||
          response.data;

        if (!data) {
          throw new Error(
            "Property not found."
          );
        }

        if (!mounted) return;

        setProperty({
          ...data,
          id:
            data.id ||
            data._id ||
            id,
        });

      } catch (err) {
        console.error(
          "Property loading error:",
          err
        );

        if (!mounted) return;

        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load this property."
        );

      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadProperty();
    } else {
      setError("Property ID is missing.");
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  /* =====================================================
     NEARBY PROPERTIES
  ===================================================== */

  useEffect(() => {
    const loadNearby = async () => {
      try {
        const response = await api.get(
          "/properties?status=approved"
        );

        const data = response.data;

        const list = Array.isArray(data)
          ? data
          : data?.properties ||
            data?.data ||
            [];

        const currentId = String(
          property?.id ||
          property?._id ||
          id
        );

        setNearbyProperties(
          list
            .filter(
              (item) =>
                String(
                  item.id ||
                  item._id ||
                  ""
                ) !== currentId
            )
            .slice(0, 8)
        );

      } catch (err) {
        console.warn(
          "Nearby properties unavailable:",
          err
        );

        setNearbyProperties([]);
      }
    };

    if (property) {
      loadNearby();
    }
  }, [property, id]);

  /* =====================================================
     NORMALIZE PROPERTY DATA
  ===================================================== */

  const images = useMemo(() => {
    if (!property) return [];

    const source =
      Array.isArray(property.photos)
        ? property.photos
        : [];

    const normalized = source
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (!item) return "";

        return (
          item.url ||
          item.secure_url ||
          item.src ||
          item.image ||
          ""
        );
      })
      .filter(Boolean);

    const fallback =
      property.coverImage ||
      property.image ||
      property.thumbnail ||
      "";

    if (
      normalized.length === 0 &&
      fallback
    ) {
      normalized.push(fallback);
    }

    return normalized;
  }, [property]);

  const title =
    property?.title ||
    "Beautiful stay";

  const rawLocation =
    property?.location ||
    property?.address ||
    property?.city ||
    "India";

  const location =
    typeof rawLocation === "object"
      ? rawLocation.address ||
        rawLocation.city ||
        "India"
      : rawLocation;

  const price = Number(
    property?.pricePerNight ||
    property?.price ||
    0
  );

  const rating = Number(
    property?.rating ||
    property?.averageRating ||
    4.9
  );

  const reviewCount =
    property?.reviewCount ||
    property?.totalReviews ||
    property?.reviews?.length ||
    0;

  const guests =
    property?.maxGuests ||
    property?.guestCapacity ||
    property?.guests ||
    1;

  const bedrooms =
    property?.bedrooms ||
    property?.numberOfBedrooms ||
    0;

  const bathrooms =
    property?.bathrooms ||
    property?.numberOfBathrooms ||
    0;

  const propertyType =
    property?.propertyType ||
    property?.type ||
    "Entire place";

  const description =
    property?.description ||
    "Relax and enjoy a comfortable stay with everything you need for a memorable getaway.";

  const host =
    property?.host ||
    property?.hostDetails ||
    {};

  const hostName =
    host.name ||
    property?.hostName ||
    "Take On BnB";

  const hostImage =
    host.avatar ||
    host.photo ||
    property?.hostImage ||
    "";

  const amenities = Array.isArray(
    property?.amenities
  )
    ? property.amenities
    : [];

  /* =====================================================
     IMAGE HELPERS
  ===================================================== */

  const nextImage = () => {
    if (images.length <= 1) return;

    setActiveImage(
      (current) =>
        (current + 1) %
        images.length
    );
  };

  const previousImage = () => {
    if (images.length <= 1) return;

    setActiveImage(
      (current) =>
        (current - 1 + images.length) %
        images.length
    );
  };

  const image =
    images[activeImage] ||
    "";

  /* =====================================================
     SHARE
  ===================================================== */

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text:
            "Check out this stay on TakeOnBnB.",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          window.location.href
        );

        alert(
          "Property link copied."
        );
      }
    } catch (err) {
      console.log(
        "Share cancelled"
      );
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7]">

        <div className="h-16 bg-white border-b border-gray-100" />

        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">

          <div className="animate-pulse">

            <div className="h-5 w-32 bg-gray-200 rounded mb-7" />

            <div className="h-10 w-2/3 bg-gray-200 rounded mb-8" />

            <div className="grid lg:grid-cols-[1fr_390px] gap-8">

              <div className="h-[560px] bg-gray-200 rounded-[30px]" />

              <div className="h-[560px] bg-gray-200 rounded-[30px]" />

            </div>

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
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-6">

        <div className="w-full max-w-lg bg-white rounded-[30px] border border-gray-200 shadow-xl p-8 text-center">

          <div className="w-16 h-16 mx-auto rounded-full bg-orange-50 flex items-center justify-center mb-5">

            <Home className="w-7 h-7 text-orange-500" />

          </div>

          <h1 className="text-2xl font-extrabold">
            Property unavailable
          </h1>

          <p className="text-gray-500 mt-3">
            {error ||
              "This property could not be found."}
          </p>

          <Button
            onClick={() => navigate(-1)}
            className="
              mt-7
              rounded-xl
              bg-orange-500
              hover:bg-orange-600
              text-white
            "
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

        <title>
          {title} | TakeOnBnB
        </title>

        <meta
          name="description"
          content={description.slice(
            0,
            155
          )}
        />

      </Helmet>

      <div className="min-h-screen bg-[#faf9f7] text-gray-950 pb-28 xl:pb-0">

        {/* =================================================
            PREMIUM HEADER
        ================================================= */}

        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100">

          <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-[68px] flex items-center justify-between gap-5">

            <button
              onClick={() => navigate(-1)}
              className="
                flex
                items-center
                gap-2
                font-semibold
                text-sm
                hover:text-orange-500
                transition
              "
            >
              <ArrowLeft className="w-5 h-5" />

              <span className="hidden sm:inline">
                Back
              </span>
            </button>

            

            <div className="flex items-center gap-2">

              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setLiked(!liked)
                }
                className="rounded-full"
              >
                <Heart
                  className={
                    liked
                      ? "w-5 h-5 fill-orange-500 text-orange-500"
                      : "w-5 h-5"
                  }
                />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="rounded-full"
              >
                <Share2 className="w-5 h-5" />
              </Button>

            </div>

          </div>

        </header>

        {/* =================================================
            MAIN
        ================================================= */}

        <main className="max-w-[1440px] mx-auto px-4 md:px-8">

          {/* BREADCRUMB */}

          <div className="flex items-center gap-2 py-5 text-xs md:text-sm text-gray-500 overflow-hidden">

            <span className="font-semibold text-gray-900">
              Stays
            </span>

            <ChevronRight className="w-4 h-4 shrink-0" />

            <span className="truncate">
              {location}
            </span>

            <ChevronRight className="w-4 h-4 shrink-0 hidden sm:block" />

            <span className="truncate hidden sm:block">
              {title}
            </span>

          </div>

          {/* TITLE */}

          <section className="mb-6">

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">

              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-2 mb-3">

                  <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-extrabold">
                    {propertyType}
                  </span>

                  {rating > 0 && (
                    <span className="flex items-center gap-1 text-sm font-bold">
                      <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                      {rating.toFixed(1)}
                    </span>
                  )}

                </div>

                <h1 className="
                  text-3xl
                  md:text-4xl
                  lg:text-[44px]
                  leading-[1.08]
                  font-extrabold
                  tracking-tight
                  max-w-4xl
                ">
                  {title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm text-gray-600">

                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    {location}
                  </span>

                  <span className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                    <strong className="text-gray-900">
                      {rating.toFixed(1)}
                    </strong>
                    {reviewCount > 0
                      ? ` (${reviewCount} reviews)`
                      : " Guest rating"}
                  </span>

                </div>

              </div>

              <button
                onClick={handleShare}
                className="
                  hidden
                  lg:flex
                  items-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  font-bold
                  text-sm
                  hover:border-gray-300
                "
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>

            </div>

          </section>

          {/* =================================================
              PREMIUM IMAGE + BOOKING
          ================================================= */}

          <section className="grid xl:grid-cols-[minmax(0,1fr)_390px] gap-7 xl:gap-9 items-start">

            {/* LEFT */}

            <div className="min-w-0">

              {/* GALLERY */}

              <div className="
                relative
                overflow-hidden
                rounded-[28px]
                bg-gray-200
                h-[320px]
                sm:h-[430px]
                lg:h-[560px]
              ">

                {image ? (

                  <img
                    src={image}
                    alt={title}
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />

                ) : (

                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-100">
                    <Home className="w-16 h-16 text-gray-400" />
                  </div>

                )}

                {/* GRADIENT */}

                <div className="
                  absolute
                  inset-x-0
                  bottom-0
                  h-32
                  bg-gradient-to-t
                  from-black/50
                  to-transparent
                  pointer-events-none
                " />

                {/* BEST SELLER */}

                <div className="
                  absolute
                  top-5
                  left-5
                  px-4
                  py-2
                  rounded-full
                  bg-orange-500
                  text-white
                  text-xs
                  font-extrabold
                  shadow-lg
                ">
                  Best seller
                </div>

                {/* ARROWS */}

                {images.length > 1 && (
                  <>
                    <button
                      onClick={previousImage}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        w-11
                        h-11
                        rounded-full
                        bg-white/95
                        shadow-lg
                        flex
                        items-center
                        justify-center
                        hover:scale-105
                        transition
                      "
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      onClick={nextImage}
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        w-11
                        h-11
                        rounded-full
                        bg-white/95
                        shadow-lg
                        flex
                        items-center
                        justify-center
                        hover:scale-105
                        transition
                      "
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* COUNTER */}

                <button
                  onClick={() =>
                    setShowGallery(true)
                  }
                  className="
                    absolute
                    bottom-5
                    right-5
                    px-4
                    py-2.5
                    rounded-xl
                    bg-black/65
                    text-white
                    text-xs
                    font-bold
                    backdrop-blur
                  "
                >
                  {Math.min(
                    activeImage + 1,
                    Math.max(images.length, 1)
                  )}{" "}
                  / {Math.max(images.length, 1)}
                </button>

              </div>

              {/* THUMBNAILS */}

              {images.length > 1 && (
                <div className="
                  flex
                  gap-3
                  overflow-x-auto
                  py-4
                  scrollbar-hide
                ">

                  {images
                    .slice(0, 6)
                    .map(
                      (item, index) => (
                        <button
                          key={item + index}
                          onClick={() =>
                            setActiveImage(index)
                          }
                          className={`
                            shrink-0
                            w-20
                            h-16
                            md:w-24
                            md:h-20
                            rounded-xl
                            overflow-hidden
                            border-2
                            transition
                            ${
                              activeImage === index
                                ? "border-orange-500"
                                : "border-transparent"
                            }
                          `}
                        >

                          <img
                            src={item}
                            alt=""
                            className="w-full h-full object-cover"
                          />

                        </button>
                      )
                    )}

                </div>
              )}

              {/* QUICK STATS */}

              <div className="
                grid
                grid-cols-2
                sm:grid-cols-4
                gap-3
                py-5
              ">

                <div className="rounded-2xl bg-white border border-gray-200 p-4">

                  <Home className="w-5 h-5 text-orange-500 mb-3" />

                  <p className="font-extrabold text-sm">
                    Entire place
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Private stay
                  </p>

                </div>

                <div className="rounded-2xl bg-white border border-gray-200 p-4">

                  <Users className="w-5 h-5 text-orange-500 mb-3" />

                  <p className="font-extrabold text-sm">
                    {guests} guests
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Max capacity
                  </p>

                </div>

                <div className="rounded-2xl bg-white border border-gray-200 p-4">

                  <Home className="w-5 h-5 text-orange-500 mb-3" />

                  <p className="font-extrabold text-sm">
                    {bedrooms || "-"} bedrooms
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Comfortable
                  </p>

                </div>

                <div className="rounded-2xl bg-white border border-gray-200 p-4">

                  <Wifi className="w-5 h-5 text-orange-500 mb-3" />

                  <p className="font-extrabold text-sm">
                    Premium stay
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Quality assured
                  </p>

                </div>

              </div>

              {/* ABOUT */}

              <section className="bg-white rounded-[26px] border border-gray-200 p-6 md:p-8 mb-5">

                <h2 className="text-2xl font-extrabold mb-4">
                  About this place
                </h2>

                <p className="
                  text-gray-600
                  leading-7
                  whitespace-pre-wrap
                ">
                  {description}
                </p>

              </section>

              {/* AMENITIES */}

              <section className="bg-white rounded-[26px] border border-gray-200 p-6 md:p-8 mb-5">

                <div className="flex items-center justify-between gap-4 mb-5">

                  <h2 className="text-2xl font-extrabold">
                    Top amenities
                  </h2>

                  <span className="text-sm font-bold text-orange-500">
                    {amenities.length || 0} available
                  </span>

                </div>

                {amenities.length > 0 ? (

                  <div className="
                    grid
                    grid-cols-2
                    sm:grid-cols-3
                    lg:grid-cols-4
                    gap-3
                  ">

                    {amenities
                      .slice(0, 12)
                      .map(
                        (amenity, index) => (
                          <div
                            key={
                              String(
                                amenity
                              ) +
                              index
                            }
                            className="
                              rounded-2xl
                              border
                              border-gray-200
                              p-4
                              bg-gray-50/60
                            "
                          >

                            <CheckCircle2
                              className="
                                w-5
                                h-5
                                text-orange-500
                                mb-3
                              "
                            />

                            <span className="text-sm font-semibold">
                              {typeof amenity ===
                              "string"
                                ? amenity
                                : amenity?.name ||
                                  "Amenity"}
                            </span>

                          </div>
                        )
                      )}

                  </div>

                ) : (

                  <p className="text-gray-500">
                    Premium amenities available
                    at this property.
                  </p>

                )}

              </section>

              {/* HOST */}

              <section className="bg-white rounded-[26px] border border-gray-200 p-6 md:p-8 mb-5">

                <h2 className="text-2xl font-extrabold mb-5">
                  Hosted by {hostName}
                </h2>

                <div className="
                  flex
                  flex-col
                  sm:flex-row
                  sm:items-center
                  justify-between
                  gap-5
                ">

                  <div className="flex items-center gap-4">

                    {hostImage ? (

                      <img
                        src={hostImage}
                        alt={hostName}
                        className="
                          w-16
                          h-16
                          rounded-full
                          object-cover
                        "
                      />

                    ) : (

                      <div className="
                        w-16
                        h-16
                        rounded-full
                        bg-gray-950
                        text-white
                        flex
                        items-center
                        justify-center
                        font-black
                        text-xs
                        text-center
                      ">
                        TAKE
                        <br />
                        ON
                        <br />
                        BNB
                      </div>

                    )}

                    <div>

                      <p className="font-extrabold">
                        {hostName}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Superhost · Trusted host
                      </p>

                    </div>

                  </div>

                  <Button
                    variant="outline"
                    className="rounded-xl font-bold"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact host
                  </Button>

                </div>

              </section>

              {/* LOCATION */}

              <section className="bg-white rounded-[26px] border border-gray-200 p-6 md:p-8 mb-5">

                <h2 className="text-2xl font-extrabold">
                  Where you'll be
                </h2>

                <div className="
                  flex
                  items-center
                  gap-2
                  text-gray-500
                  mt-2
                ">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  {location}
                </div>

                <div className="
                  mt-6
                  h-[260px]
                  rounded-3xl
                  overflow-hidden
                  relative
                  bg-gradient-to-br
                  from-orange-50
                  via-white
                  to-gray-100
                  border
                  border-gray-200
                ">

                  <div className="
                    absolute
                    inset-0
                    opacity-30
                    bg-[radial-gradient(circle_at_30%_40%,#f97316_0,transparent_2px),radial-gradient(circle_at_70%_60%,#9ca3af_0,transparent_2px)]
                    [background-size:28px_28px]
                  " />

                  <div className="
                    absolute
                    left-1/2
                    top-1/2
                    -translate-x-1/2
                    -translate-y-1/2
                    w-14
                    h-14
                    rounded-full
                    bg-orange-500
                    border-4
                    border-white
                    shadow-xl
                    flex
                    items-center
                    justify-center
                  ">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>

                  <div className="
                    absolute
                    left-5
                    top-5
                    bg-white
                    rounded-2xl
                    px-4
                    py-3
                    shadow-lg
                    border
                    border-gray-100
                  ">
                    <p className="text-xs text-gray-500">
                      Property location
                    </p>

                    <p className="font-extrabold text-sm mt-1">
                      {location}
                    </p>
                  </div>

                </div>

              </section>

              {/* REVIEWS */}

              <section className="bg-white rounded-[26px] border border-gray-200 p-6 md:p-8 mb-8">

                <div className="flex items-center gap-3 mb-6">

                  <div className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-orange-50
                    flex
                    items-center
                    justify-center
                  ">
                    <Star className="
                      w-6
                      h-6
                      fill-orange-500
                      text-orange-500
                    " />
                  </div>

                  <div>

                    <h2 className="text-2xl font-extrabold">
                      {rating.toFixed(1)} Guest reviews
                    </h2>

                    <p className="text-sm text-gray-500">
                      {reviewCount || 0} reviews
                    </p>

                  </div>

                </div>

                {Array.isArray(
                  property.reviews
                ) &&
                property.reviews.length > 0 ? (

                  <div className="
                    grid
                    md:grid-cols-2
                    gap-4
                  ">

                    {property.reviews
                      .slice(0, 4)
                      .map(
                        (review, index) => (
                          <div
                            key={
                              review.id ||
                              review._id ||
                              index
                            }
                            className="
                              rounded-2xl
                              border
                              border-gray-200
                              p-5
                            "
                          >

                            <div className="flex items-center gap-3">

                              <div className="
                                w-11
                                h-11
                                rounded-full
                                bg-orange-100
                                text-orange-600
                                flex
                                items-center
                                justify-center
                                font-extrabold
                              ">
                                {(
                                  review.name ||
                                  review.userName ||
                                  "G"
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>

                                <p className="font-extrabold">
                                  {review.name ||
                                    review.userName ||
                                    "Guest"}
                                </p>

                                <div className="flex items-center gap-1 text-sm">
                                  <Star className="
                                    w-3.5
                                    h-3.5
                                    fill-orange-500
                                    text-orange-500
                                  " />

                                  {review.rating ||
                                    5}
                                </div>

                              </div>

                            </div>

                            <p className="
                              text-sm
                              text-gray-600
                              leading-6
                              mt-4
                            ">
                              {review.comment ||
                                review.review ||
                                "Wonderful stay and a great experience."}
                            </p>

                          </div>
                        )
                      )}

                  </div>

                ) : (

                  <div className="
                    rounded-2xl
                    bg-gray-50
                    border
                    border-gray-100
                    p-7
                    text-center
                  ">

                    <p className="font-bold">
                      No reviews yet
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Be one of the first guests
                      to experience this stay.
                    </p>

                  </div>

                )}

              </section>

            </div>

            {/* =================================================
                DESKTOP BOOKING CARD
            ================================================= */}

            <aside className="hidden xl:block">

              <div className="sticky top-[88px]">

                <div className="
                  bg-white
                  rounded-[30px]
                  border
                  border-gray-200
                  shadow-[0_20px_60px_rgba(0,0,0,0.10)]
                  p-6
                ">

                  <BookingWidget
                    property={property}
                  />

                </div>

                <div className="
                  mt-5
                  bg-white
                  rounded-[26px]
                  border
                  border-gray-200
                  p-6
                ">

                  <div className="flex items-center gap-3">

                    <div className="
                      w-12
                      h-12
                      rounded-full
                      bg-gray-950
                      text-white
                      flex
                      items-center
                      justify-center
                      text-[9px]
                      font-black
                    ">
                      TOB
                    </div>

                    <div>

                      <p className="text-xs text-gray-500">
                        Hosted by
                      </p>

                      <p className="font-extrabold">
                        {hostName}
                      </p>

                    </div>

                  </div>

                  <div className="
                    grid
                    grid-cols-3
                    gap-2
                    mt-5
                    pt-5
                    border-t
                    border-gray-100
                    text-center
                  ">

                    <div>
                      <p className="font-extrabold text-sm">
                        100%
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1">
                        Response
                      </p>
                    </div>

                    <div>
                      <p className="font-extrabold text-sm">
                        1 hr
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1">
                        Response time
                      </p>
                    </div>

                    <div>
                      <p className="font-extrabold text-sm">
                        5+
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1">
                        Years hosting
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </aside>

          </section>

          {/* =================================================
              MORE STAYS
          ================================================= */}

          {nearbyProperties.length > 0 && (

            <section className="py-12">

              <div className="flex items-end justify-between gap-4 mb-6">

                <div>

                  <p className="text-orange-500 text-sm font-extrabold uppercase tracking-wider">
                    Explore more
                  </p>

                  <h2 className="text-2xl md:text-3xl font-extrabold mt-1">
                    More stays nearby
                  </h2>

                </div>

                <button
                  onClick={() =>
                    navigate("/properties")
                  }
                  className="
                    hidden
                    sm:flex
                    items-center
                    gap-2
                    text-sm
                    font-bold
                    text-orange-500
                  "
                >
                  View all
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>

              <div className="
                flex
                gap-5
                overflow-x-auto
                pb-4
                scrollbar-hide
              ">

                {nearbyProperties.map(
                  (item) => {

                    const itemImages =
                      Array.isArray(
                        item.photos
                      )
                        ? item.photos
                        : [];

                    const itemImage =
                      typeof itemImages[0] ===
                      "string"
                        ? itemImages[0]
                        : itemImages[0]?.url ||
                          itemImages[0]?.secure_url ||
                          item.image ||
                          item.thumbnail ||
                          "";

                    const itemId =
                      item.id ||
                      item._id;

                    const itemLocation =
                      typeof item.location ===
                      "object"
                        ? item.location?.address ||
                          item.location?.city ||
                          "India"
                        : item.location ||
                          item.city ||
                          "India";

                    const itemPrice =
                      Number(
                        item.pricePerNight ||
                        item.price ||
                        0
                      );

                    return (
                      <article
                        key={
                          itemId ||
                          item.title
                        }
                        onClick={() => {
                          if (itemId) {
                            navigate(
                              `/properties/${itemId}`
                            );
                          }
                        }}
                        className="
                          shrink-0
                          w-[280px]
                          sm:w-[310px]
                          cursor-pointer
                          group
                        "
                      >

                        <div className="
                          aspect-[4/3]
                          rounded-[24px]
                          overflow-hidden
                          bg-gray-200
                        ">

                          {itemImage ? (

                            <img
                              src={itemImage}
                              alt={
                                item.title ||
                                "Property"
                              }
                              className="
                                w-full
                                h-full
                                object-cover
                                group-hover:scale-105
                                transition
                                duration-500
                              "
                            />

                          ) : (

                            <div className="w-full h-full flex items-center justify-center">
                              <Home className="w-10 h-10 text-gray-400" />
                            </div>

                          )}

                        </div>

                        <div className="pt-4">

                          <h3 className="font-extrabold truncate">
                            {item.title ||
                              "Beautiful stay"}
                          </h3>

                          <div className="
                            flex
                            items-center
                            gap-1.5
                            text-sm
                            text-gray-500
                            mt-2
                          ">
                            <MapPin className="
                              w-4
                              h-4
                              text-orange-500
                            " />

                            <span className="truncate">
                              {itemLocation}
                            </span>
                          </div>

                          <p className="font-extrabold mt-3">
                            {"₹"}
                            {itemPrice.toLocaleString(
                              "en-IN"
                            )}

                            <span className="text-sm text-gray-500 font-normal">
                              {" "}
                              / night
                            </span>
                          </p>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>

            </section>

          )}

        </main>

        {/* =================================================
            MOBILE BOOKING BAR
        ================================================= */}

        <div className="
          xl:hidden
          fixed
          bottom-0
          left-0
          right-0
          z-[80]
          bg-white/95
          backdrop-blur-xl
          border-t
          border-gray-200
          shadow-[0_-15px_45px_rgba(0,0,0,0.12)]
        ">

          <div className="
            max-w-2xl
            mx-auto
            px-4
            py-3
          ">

            <div className="
              flex
              items-center
              justify-between
              gap-4
            ">

              <div className="min-w-0">

                <div className="flex items-baseline gap-1">

                  <span className="text-xl font-extrabold">
                    {"₹"}
                    {price.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                  <span className="text-xs text-gray-500">
                    / night
                  </span>

                </div>

                <div className="
                  flex
                  items-center
                  gap-1
                  mt-1
                  text-xs
                ">

                  <Star className="
                    w-3.5
                    h-3.5
                    fill-orange-500
                    text-orange-500
                  " />

                  <span className="font-bold">
                    {rating.toFixed(1)}
                  </span>

                  <span className="text-gray-400">
                    · {reviewCount || 0}
                  </span>

                </div>

              </div>

              <Button
                type="button"
                onClick={() =>
                  setShowBooking(true)
                }
                className="
                  shrink-0
                  h-12
                  px-7
                  rounded-2xl
                  bg-orange-500
                  hover:bg-orange-600
                  text-white
                  font-extrabold
                  shadow-[0_10px_25px_rgba(249,115,22,.30)]
                "
              >
                Check dates
              </Button>

            </div>

          </div>

        </div>

        {/* =================================================
            MOBILE BOOKING SHEET
        ================================================= */}

        {showBooking && (

          <div className="
            xl:hidden
            fixed
            inset-0
            z-[100]
            flex
            items-end
          ">

            <button
              type="button"
              aria-label="Close booking"
              onClick={() =>
                setShowBooking(false)
              }
              className="
                absolute
                inset-0
                bg-black/55
                backdrop-blur-sm
              "
            />

            <div className="
              relative
              z-10
              w-full
              max-h-[92vh]
              overflow-y-auto
              bg-white
              rounded-t-[30px]
              shadow-2xl
            ">

              <div className="flex justify-center pt-3">
                <div className="
                  w-12
                  h-1.5
                  rounded-full
                  bg-gray-300
                " />
              </div>

              <div className="
                flex
                items-center
                justify-between
                px-5
                pt-4
                pb-4
                border-b
                border-gray-100
              ">

                <div>

                  <h2 className="text-lg font-extrabold">
                    Reserve your stay
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Choose dates and guests
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowBooking(false)
                  }
                  className="
                    w-10
                    h-10
                    rounded-full
                    bg-gray-100
                    flex
                    items-center
                    justify-center
                  "
                >
                  <X className="w-5 h-5" />
                </button>

              </div>

              <div className="p-4 pb-10">

                <div className="
                  rounded-[26px]
                  border
                  border-gray-200
                  p-4
                  shadow-sm
                ">

                  <BookingWidget
                    property={property}
                  />

                </div>

              </div>

            </div>

          </div>

        )}

        {/* =================================================
            FULLSCREEN GALLERY
        ================================================= */}

        {showGallery && (

          <div className="
            fixed
            inset-0
            z-[120]
            bg-black
            flex
            items-center
            justify-center
          ">

            <button
              type="button"
              onClick={() =>
                setShowGallery(false)
              }
              className="
                absolute
                top-5
                right-5
                z-20
                w-11
                h-11
                rounded-full
                bg-white/10
                text-white
                flex
                items-center
                justify-center
              "
            >
              <X className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={previousImage}
              className="
                absolute
                left-4
                md:left-8
                w-12
                h-12
                rounded-full
                bg-white/10
                text-white
                flex
                items-center
                justify-center
              "
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {image && (
              <img
                src={image}
                alt={title}
                className="
                  max-w-[94vw]
                  max-h-[88vh]
                  object-contain
                  rounded-2xl
                "
              />
            )}

            <button
              type="button"
              onClick={nextImage}
              className="
                absolute
                right-4
                md:right-8
                w-12
                h-12
                rounded-full
                bg-white/10
                text-white
                flex
                items-center
                justify-center
              "
            >
              <ChevronRight className="w-6 h-6" />
            </button>

          </div>

        )}

      </div>
    </>
  );
};

export default PropertyDetailPage;


