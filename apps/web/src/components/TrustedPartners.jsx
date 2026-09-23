import React, { useEffect, useRef, useState } from "react";

const partners = [
  {
    name: "SL Architect & Developers",
    type: "PROPERTY PARTNER",
    image:
      "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787825296/image.png",
  },
  {
    name: "SL Co Working",
    type: "WORKSPACE PARTNER",
    image:
      "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787829569/T_-_2.png",
  },
  {
    name: "Trip Sutara",
    type: "TRAVEL PARTNER",
    image:
      "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787829792/Untitled_design.png",
  },
  {
    name: "Gurbani Infra",
    type: "INFRA PARTNER",
    image:
      "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787829570/Gurbani_Infra_Logo.png",
  },
  {
    name: "MakeMyTrip",
    type: "TRAVEL PARTNER",
    image:
      "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787853305/WhatsApp_Image_2026-08-27_at_23.23.39.jpg",
  },
];

export default function TrustedPartners() {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  const move = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    track.scrollBy({
      left: direction * 330,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateActive = () => {
      const cardWidth = 330;
      const index = Math.round(track.scrollLeft / cardWidth);
      setActive(Math.min(index, partners.length - 1));
    };

    track.addEventListener("scroll", updateActive, {
      passive: true,
    });

    const timer = setInterval(() => {
      const max = track.scrollWidth - track.clientWidth;

      if (track.scrollLeft >= max - 10) {
        track.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        track.scrollBy({
          left: 330,
          behavior: "smooth",
        });
      }
    }, 3500);

    return () => {
      clearInterval(timer);
      track.removeEventListener("scroll", updateActive);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-14">

      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        {/* HEADER */}
        <div className="text-center">

          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-[#d88900]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#d88900] sm:text-xs">
              Trusted By
            </span>

            <span className="h-px w-12 bg-[#d88900]" />
          </div>

          <h2 className="font-heading text-3xl font-bold leading-tight text-[#111827] sm:text-4xl lg:text-5xl">
            Trusted by Leading{" "}
            <span className="text-[#d88900]">
              Travel Partners
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            We collaborate with trusted partners to bring you
            better stays, experiences and services.
          </p>

        </div>

        {/* SLIDER */}
        <div className="relative mt-9">

          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-3"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >

            {partners.map((partner) => (
              <div
                key={partner.name}
                className="
                  group
                  flex
                  h-28
                  min-w-[220px]
                  snap-start
                  flex-1
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  px-5
                  shadow-[0_5px_25px_rgba(0,0,0,0.04)]
                  transition-all
                  duration-500
                  hover:-translate-y-1
                  hover:border-[#d88900]
                  hover:shadow-[0_12px_35px_rgba(216,137,0,0.12)]
                  sm:min-w-[245px]
                "
              >

                <img
                  src={partner.image}
                  alt={partner.name}
                  loading="lazy"
                  className="
                    max-h-14
                    max-w-[82%]
                    object-contain
                    transition-transform
                    duration-500
                    group-hover:scale-105
                  "
                />

                <div className="mt-2 text-[8px] font-bold uppercase tracking-[0.25em] text-[#d88900]">
                  {partner.type}
                </div>

              </div>
            ))}

          </div>

          {/* LEFT */}
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous partner"
            className="
              absolute -left-4 top-1/2
              flex h-10 w-10
              -translate-y-1/2
              items-center justify-center
              rounded-full
              border border-[#e1a23c]
              bg-white
              text-2xl text-[#d88900]
              shadow-md
              transition
              hover:bg-[#fff8eb]
            "
          >
            ‹
          </button>

          {/* RIGHT */}
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next partner"
            className="
              absolute -right-4 top-1/2
              flex h-10 w-10
              -translate-y-1/2
              items-center justify-center
              rounded-full
              border border-[#e1a23c]
              bg-white
              text-2xl text-[#d88900]
              shadow-md
              transition
              hover:bg-[#fff8eb]
            "
          >
            ›
          </button>

        </div>

        {/* DOTS */}
        <div className="mt-6 flex justify-center gap-2">
          {partners.map((partner, index) => (
            <button
              key={partner.name}
              type="button"
              onClick={() => {
                trackRef.current?.scrollTo({
                  left: index * 330,
                  behavior: "smooth",
                });
              }}
              aria-label={`Go to ${partner.name}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                active === index
                  ? "w-8 bg-[#d88900]"
                  : "w-2 bg-gray-200"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
