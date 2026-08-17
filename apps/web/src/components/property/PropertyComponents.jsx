import React from "react";
import { Button } from "@/components/ui/button";
import {
  Wifi,
  UtensilsCrossed,
  CarFront,
  Waves,
  Wind,
  Tv,
  Flame,
  Dumbbell,
  Trees,
  BedDouble,
  Bath,
  CheckCircle2,
} from "lucide-react";
export const AmenitiesGrid = ({ amenities = [] }) => {
  const [showAllAmenities, setShowAllAmenities] =
    React.useState(false);

  const [isClosing, setIsClosing] =
    React.useState(false);

  const defaultAmenities = [
    "WiFi",
    "Kitchen",
    "Free parking",
    "Pool",
    "Air conditioning",
    "TV",
    "Heating",
    "Garden",
  ];

  const safeAmenities = Array.isArray(amenities)
    ? amenities
    : [];

  const displayAmenities =
    safeAmenities.length > 0
      ? safeAmenities
      : defaultAmenities;

  const normalizedAmenities = displayAmenities
    .map((amenity) => {
      if (typeof amenity === "string") {
        return amenity;
      }

      if (
        amenity &&
        typeof amenity === "object"
      ) {
        return (
          amenity.name ||
          amenity.title ||
          amenity.label ||
          ""
        );
      }

      return "";
    })
    .filter(Boolean);

  const closeAmenities = () => {
    if (isClosing) return;

    setIsClosing(true);

    window.setTimeout(() => {
      setShowAllAmenities(false);
      setIsClosing(false);
    }, 250);
  };

  React.useEffect(() => {
    if (!showAllAmenities) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeAmenities();
      }
    };

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        originalOverflow;

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [showAllAmenities, isClosing]);

  const getIconForAmenity = (name) => {
    const n = String(name || "")
      .toLowerCase()
      .trim();

    if (
      n.includes("wifi") ||
      n.includes("internet")
    ) {
      return (
        <Wifi className="w-5 h-5 text-primary" />
      );
    }

    if (
      n.includes("kitchen") ||
      n.includes("utensils") ||
      n.includes("cook")
    ) {
      return (
        <UtensilsCrossed className="w-5 h-5 text-primary" />
      );
    }

    if (
      n.includes("parking") ||
      n.includes("car") ||
      n.includes("garage")
    ) {
      return (
        <CarFront className="w-5 h-5 text-primary" />
      );
    }

    if (
      n.includes("pool") ||
      n.includes("hot tub") ||
      n.includes("swimming")
    ) {
      return (
        <Waves className="w-5 h-5 text-primary" />
      );
    }

    if (
      n.includes("air conditioning") ||
      n === "ac" ||
      n.includes("air conditioner")
    ) {
      return (
        <Wind className="w-5 h-5 text-primary" />
      );
    }

    if (
      n.includes("tv") ||
      n.includes("television")
    ) {
      return (
        <Tv className="w-5 h-5 text-primary" />
      );
    }

    if (
      n.includes("heating") ||
      n.includes("heater")
    ) {
      return (
        <Flame className="w-5 h-5 text-primary" />
      );
    }

    if (
      n.includes("gym") ||
      n.includes("fitness")
    ) {
      return (
        <Dumbbell className="w-5 h-5 text-primary" />
      );
    }

    if (
      n.includes("garden") ||
      n.includes("trees") ||
      n.includes("balcony")
    ) {
      return (
        <Trees className="w-5 h-5 text-primary" />
      );
    }

    if (
      n.includes("bed") ||
      n.includes("bedroom")
    ) {
      return (
        <BedDouble className="w-5 h-5 text-primary" />
      );
    }

    if (
      n.includes("bath") ||
      n.includes("shower")
    ) {
      return (
        <Bath className="w-5 h-5 text-primary" />
      );
    }

    return (
      <CheckCircle2 className="w-5 h-5 text-primary" />
    );
  };

  return (
    <>
      {/* AMENITIES SECTION */}

      <div className="py-8 md:py-10 border-b border-border">

        {/* HEADER */}

        <div className="flex items-start justify-between gap-4 mb-7">

          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">
              What this place offers
            </h2>

            <p className="text-sm text-muted-foreground mt-2">
              Everything you need for a comfortable stay
            </p>
          </div>

          <div className="hidden sm:flex items-center justify-center min-w-10 h-10 px-3 rounded-full bg-primary/10 text-primary font-bold">
            {normalizedAmenities.length}
          </div>

        </div>

        {/* AMENITIES PREVIEW */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">

          {normalizedAmenities
            .slice(0, 8)
            .map((amenityName, i) => (
              <div
                key={`${amenityName}-${i}`}
                className="
                  group
                  flex
                  items-center
                  gap-4
                  p-3
                  -mx-3
                  rounded-xl
                  transition-all
                  duration-300
                  hover:bg-primary/5
                  hover:translate-x-1
                "
              >

                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-primary/10
                    flex
                    items-center
                    justify-center
                    shrink-0
                    transition-all
                    duration-300
                    group-hover:scale-110
                  "
                >
                  {getIconForAmenity(
                    amenityName
                  )}
                </div>

                <span className="font-medium text-foreground">
                  {amenityName}
                </span>

              </div>
            ))}

        </div>

        {/* SHOW ALL BUTTON */}

        <Button
          variant="outline"
          onClick={() => {
            setIsClosing(false);
            setShowAllAmenities(true);
          }}
          className="
            mt-8
            rounded-xl
            font-semibold
            px-6
            h-12
            border-foreground
            hover:bg-primary
            hover:text-primary-foreground
            transition-all
            duration-300
            hover:scale-[1.02]
            active:scale-[0.98]
          "
        >
          Show all {normalizedAmenities.length} amenities
        </Button>

      </div>

      {/* ALL AMENITIES MODAL */}

      {showAllAmenities && (
        <div
          className="
            fixed
            inset-0
            z-[999]
            flex
            items-end
            md:items-center
            justify-center
          "
          role="dialog"
          aria-modal="true"
        >

          {/* BACKDROP */}

          <div
            className={`
              absolute
              inset-0
              bg-black/50
              backdrop-blur-sm
              ${
                isClosing
                  ? "animate-out fade-out duration-200"
                  : "animate-in fade-in duration-300"
              }
            `}
            onClick={closeAmenities}
          />

          {/* MODAL */}

          <div
            className={`
              relative
              z-10
              w-full
              md:max-w-3xl
              bg-background
              rounded-t-3xl
              md:rounded-3xl
              shadow-2xl
              max-h-[90vh]
              flex
              flex-col
              overflow-hidden
              ${
                isClosing
                  ? `
                    animate-out
                    fade-out
                    slide-out-to-bottom-8
                    duration-200
                  `
                  : `
                    animate-in
                    fade-in
                    slide-in-from-bottom-10
                    md:zoom-in-95
                    duration-300
                  `
              }
            `}
          >

            {/* MOBILE HANDLE */}

            <div className="
              md:hidden
              w-12
              h-1.5
              bg-muted-foreground/30
              rounded-full
              mx-auto
              mt-3
              shrink-0
            " />

            {/* MODAL HEADER */}

            <div className="
              flex
              items-center
              justify-between
              p-5
              md:p-7
              border-b
              border-border
            ">

              <div>

                <h2 className="
                  text-xl
                  md:text-2xl
                  font-bold
                ">
                  What this place offers
                </h2>

                <p className="
                  text-sm
                  text-muted-foreground
                  mt-1
                ">
                  {normalizedAmenities.length} amenities available
                </p>

              </div>

              <button
                type="button"
                onClick={closeAmenities}
                className="
                  w-11
                  h-11
                  rounded-full
                  border
                  border-border
                  flex
                  items-center
                  justify-center
                  text-2xl
                  hover:bg-muted
                  hover:rotate-90
                  transition-all
                  duration-300
                "
                aria-label="Close amenities"
              >
                ×
              </button>

            </div>

            {/* AMENITIES LIST */}

            <div className="
              overflow-y-auto
              p-5
              md:p-7
            ">

              <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-4
              ">

                {normalizedAmenities.map(
                  (amenityName, i) => (
                    <div
                      key={`${amenityName}-${i}`}
                      className="
                        group
                        flex
                        items-center
                        gap-4
                        p-4
                        rounded-2xl
                        border
                        border-border
                        bg-background
                        transition-all
                        duration-300
                        hover:border-primary/40
                        hover:shadow-lg
                        hover:-translate-y-1
                      "
                    >

                      <div className="
                        w-11
                        h-11
                        rounded-xl
                        bg-primary/10
                        flex
                        items-center
                        justify-center
                        shrink-0
                        transition-transform
                        duration-300
                        group-hover:scale-110
                      ">

                        {getIconForAmenity(
                          amenityName
                        )}

                      </div>

                      <span className="
                        font-medium
                        text-sm
                        md:text-base
                      ">
                        {amenityName}
                      </span>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* FOOTER */}

            <div className="
              p-4
              md:p-5
              border-t
              border-border
              bg-background
              shrink-0
            ">

              <Button
                onClick={closeAmenities}
                className="
                  w-full
                  h-12
                  rounded-xl
                  font-semibold
                  bg-orange-500
                  hover:bg-orange-600
                  text-white
                  transition-all
                  duration-300
                  active:scale-[0.98]
                "
              >
                Done
              </Button>

            </div>

          </div>

        </div>
      )}
    </>
  );
};

