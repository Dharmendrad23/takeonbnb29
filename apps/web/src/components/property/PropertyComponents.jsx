export const AmenitiesGrid = ({ amenities = [] }) => {
  const [showAllAmenities, setShowAllAmenities] = React.useState(false);

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

  const getIconForAmenity = (name) => {
    const n = String(name || "").toLowerCase();

    if (n.includes("wifi")) {
      return (
        <Wifi className="w-5 h-5 text-primary" />
      );
    }

    if (
      n.includes("kitchen") ||
      n.includes("utensils")
    ) {
      return (
        <UtensilsCrossed className="w-5 h-5 text-primary" />
      );
    }

    if (
      n.includes("parking") ||
      n.includes("car")
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

    if (n.includes("tv")) {
      return (
        <Tv className="w-5 h-5 text-primary" />
      );
    }

    if (n.includes("heating")) {
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

    return (
      <CheckCircle2 className="w-5 h-5 text-primary" />
    );
  };

  return (
    <>
      <div className="py-8 md:py-10 border-b border-border">

        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">
              What this place offers
            </h2>

            <p className="text-sm text-muted-foreground mt-2">
              Everything you need for a comfortable stay
            </p>
          </div>

          <div className="hidden sm:flex items-center justify-center min-w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
            {normalizedAmenities.length}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">

          {normalizedAmenities
            .slice(0, 8)
            .map((amenityName, i) => (
              <div
                key={`${amenityName}-${i}`}
                className="
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
                <div className="
                  w-10
                  h-10
                  rounded-xl
                  bg-primary/10
                  flex
                  items-center
                  justify-center
                  shrink-0
                ">
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

        <Button
          variant="outline"
          onClick={() =>
            setShowAllAmenities(true)
          }
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
            z-[100]
            flex
            items-end
            md:items-center
            justify-center
          "
        >

          {/* BACKDROP */}

          <div
            className="
              absolute
              inset-0
              bg-black/50
              backdrop-blur-sm
              animate-in
              fade-in
              duration-300
            "
            onClick={() =>
              setShowAllAmenities(false)
            }
          />

          {/* MODAL */}

          <div
            className="
              relative
              w-full
              md:max-w-3xl
              bg-background
              rounded-t-3xl
              md:rounded-3xl
              shadow-2xl
              max-h-[90vh]
              flex
              flex-col
              animate-in
              slide-in-from-bottom-10
              md:zoom-in-95
              duration-300
            "
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
                onClick={() =>
                  setShowAllAmenities(false)
                }
                className="
                  w-11
                  h-11
                  rounded-full
                  border
                  border-border
                  flex
                  items-center
                  justify-center
                  text-xl
                  hover:bg-muted
                  transition
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
                        hover:shadow-md
                        hover:-translate-y-0.5
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
            ">

              <Button
                onClick={() =>
                  setShowAllAmenities(false)
                }
                className="
                  w-full
                  h-12
                  rounded-xl
                  font-semibold
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