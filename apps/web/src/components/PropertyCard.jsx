import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useFavorites } from "@/hooks/useFavorites.js";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=85";

const PropertyCard = memo(({ property, isHostView = false }) => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();

  const propertyId = property?.id || property?._id;
  const isFavorite = favorites.includes(propertyId);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (propertyId) {
      toggleFavorite(propertyId);
    }
  };

  const handleCardClick = () => {
    if (!propertyId) return;

    navigate(
      isHostView
        ? `/host/edit-property/${propertyId}`
        : `/property/${propertyId}`
    );
  };

  const imageUrl =
    property?.coverImage ||
    property?.photos?.[0] ||
    FALLBACK_IMAGE;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(Number(price || 0));
  };

  const rating = Number(property?.rating || 0);
  const reviewCount = Number(
    property?.reviewCount ||
    property?.reviewsCount ||
    property?.totalReviews ||
    0
  );

  /*
   * Show only amenities that actually exist on the property.
   * This keeps every card compact like the reference design.
   */
  const rawAmenities = Array.isArray(property?.amenities)
    ? property.amenities
    : [];

  const amenityNames = rawAmenities
    .map((item) => {
      if (typeof item === "string") return item;
      return item?.name || item?.title || item?.label || "";
    })
    .filter(Boolean);

  const defaultAmenities = [];

  if (
    property?.parking ||
    property?.freeParking ||
    property?.hasParking ||
    amenityNames.some((a) => a.toLowerCase().includes("parking"))
  ) {
    defaultAmenities.push("Free parking");
  }

  if (
    property?.bonfire ||
    property?.hasBonfire ||
    amenityNames.some((a) => a.toLowerCase().includes("bonfire"))
  ) {
    defaultAmenities.push("Bonfire");
  }

  if (
    property?.garden ||
    property?.hasGarden ||
    amenityNames.some((a) => a.toLowerCase().includes("garden"))
  ) {
    defaultAmenities.push("Garden");
  }

  if (
    property?.pool ||
    property?.hasPool ||
    amenityNames.some((a) => a.toLowerCase().includes("pool"))
  ) {
    defaultAmenities.push("Pool");
  }

  const amenities = [
    ...new Set([...defaultAmenities, ...amenityNames]),
  ].slice(0, 3);

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0 },
      }}
      className="
        group
        relative
        w-full
        max-w-[320px]
        overflow-hidden
        rounded-2xl
        bg-white
        cursor-pointer
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_14px_35px_rgba(0,0,0,0.12)]
      "
      onClick={handleCardClick}
    >
      {/* IMAGE */}
      <div className="relative aspect-[1.32/1] overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={property?.title || "Take On BnB property"}
          loading="lazy"
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-[1.04]
          "
          onError={(e) => {
            if (e.currentTarget.src !== FALLBACK_IMAGE) {
              e.currentTarget.src = FALLBACK_IMAGE;
            }
          }}
        />

        {/* IMAGE DARK GRADIENT */}
        <div className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-20
          bg-gradient-to-t
          from-black/55
          via-black/15
          to-transparent
        " />

        {/* HEART */}
        {!isHostView && (
          <button
            type="button"
            aria-label={
              isFavorite
                ? "Remove from wishlist"
                : "Save to wishlist"
            }
            onClick={handleFavoriteClick}
            className="
              absolute
              right-3
              top-3
              z-20
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-white/95
              shadow-md
              backdrop-blur-sm
              transition-all
              duration-200
              hover:scale-110
              active:scale-95
            "
          >
            <Heart
              className={`
                h-[17px]
                w-[17px]
                transition-colors
                duration-200
                ${
                  isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-gray-700"
                }
              `}
            />
          </button>
        )}

        {/* RATING - BOTTOM LEFT */}
        {rating > 0 && (
          <div
            className="
              absolute
              bottom-2.5
              left-2.5
              z-10
              flex
              items-center
              gap-1
              rounded-md
              bg-black/80
              px-2
              py-1
              text-white
              backdrop-blur-sm
            "
          >
            <Star className="h-3 w-3 fill-white text-white" />

            <span className="text-[11px] font-bold">
              {rating.toFixed(1)}
            </span>

            {reviewCount > 0 && (
              <span className="text-[10px] font-medium text-white/90">
                ({reviewCount})
              </span>
            )}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="px-3.5 pb-3.5 pt-2.5">
        {/* TITLE */}
        <h3
          className="
            line-clamp-1
            text-[14px]
            font-bold
            leading-5
            text-gray-900
            transition-colors
            group-hover:text-[#d88900]
          "
        >
          {property?.title || "Beautiful Stay"}
        </h3>

        {/* LOCATION */}
        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-500">
          <MapPin className="h-3 w-3 shrink-0 text-gray-500" />

          <span className="truncate">
            {property?.location || "Location unavailable"}
          </span>
        </div>

        {/* PRICE */}
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-[15px] font-extrabold text-gray-950">
            ₹ {formatPrice(property?.pricePerNight)}
          </span>

          <span className="text-[10px] font-medium text-gray-500">
            / night
          </span>
        </div>

        {/* AMENITIES */}
        {amenities.length > 0 && (
          <div className="mt-2 flex gap-1.5 overflow-hidden">
            {amenities.map((amenity, index) => (
              <span
                key={`${amenity}-${index}`}
                className="
                  shrink-0
                  rounded-md
                  bg-gray-100
                  px-2
                  py-1
                  text-[9px]
                  font-medium
                  leading-none
                  text-gray-600
                "
              >
                {amenity}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
});

PropertyCard.displayName = "PropertyCard";

export default PropertyCard;
