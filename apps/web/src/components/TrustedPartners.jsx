import React, { useEffect, useRef } from "react";

const partners = [
  {
    name: "Trip Sutra Pvt Ltd",
    logo: "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787829569/T_-_2.png",
  },
  {
    name: "SL Co Working",
    logo: "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787829792/Untitled_design.png",
  },
  {
    name: "Gurbani Infra",
    logo: "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787829570/Gurbani_Infra_Logo.png",
  },
  {
    name: "MakeMyTrip",
    logo: "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787853305/WhatsApp_Image_2026-08-27_at_23.23.39.jpg",
  },
];

const TrustedPartners = () => {
  const sliderRef = useRef(null);
  const animationRef = useRef(null);
  const pausedRef = useRef(false);

  // Duplicate cards for seamless infinite loop
  const items = [...partners, ...partners, ...partners];

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    let lastTime = performance.now();
    const speed = 35; // pixels per second

    const animate = (currentTime) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      if (!pausedRef.current) {
        slider.scrollLeft += (speed * delta) / 1000;

        const oneSetWidth = slider.scrollWidth / 3;

        if (slider.scrollLeft >= oneSetWidth) {
          slider.scrollLeft -= oneSetWidth;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <section className="overflow-hidden bg-[#fffaf5] py-16 md:py-20">

      <div className="mx-auto max-w-[1500px] px-4 sm:px-8">

        {/* ==============================
            HEADING
        =============================== */}
        <div className="mb-10 text-center">

          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-orange-400" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-orange-500">
              Our Network
            </span>

            <span className="h-px w-12 bg-orange-400" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Trusted by our growing{" "}
            <span className="text-orange-500">
              partner network
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-500 sm:text-base">
            Leading brands, local experts and travel partners who believe
            in our vision.
          </p>

        </div>


        {/* ==============================
            CAROUSEL
        =============================== */}
        <div
          ref={sliderRef}
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
          }}
          className="
            flex
            gap-6
            overflow-x-auto
            px-1
            pb-4
            scrollbar-hide
            touch-pan-x
          "
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >

          {items.map((partner, index) => (

            <div
              key={`${partner.name}-${index}`}
              className="
                group
                flex
                h-[150px]
                min-w-[calc(25%-18px)]
                flex-shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-[#e7e7e7]
                bg-white
                px-8
                transition-all
                duration-500
                hover:-translate-y-1
                hover:border-orange-200
                hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)]
              "
            >

              {/* ==========================
                  FIXED LOGO FRAME
              =========================== */}
              <div
                className="
                  flex
                  h-[115px]
                  w-full
                  items-center
                  justify-center
                "
              >

                <img
                  src={partner.logo}
                  alt={partner.name}
                  loading="lazy"
                  className="
                    block
                    h-[90px]
                    w-[210px]
                    object-contain
                    object-center
                    transition-transform
                    duration-500
                    ease-out
                    group-hover:scale-105
                  "
                />

              </div>

            </div>

          ))}

        </div>


        {/* ==============================
            MOBILE SWIPE
        =============================== */}
        <div className="mt-4 text-center md:hidden">

          <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-gray-400">
            ← Swipe to explore →
          </span>

        </div>


        {/* ==============================
            BOTTOM LABEL
        =============================== */}
        <div className="mt-9 flex items-center justify-center gap-4">

          <span className="h-px w-12 bg-gray-200" />

          <span className="text-[9px] font-medium uppercase tracking-[0.35em] text-gray-400">
            Partners in Progress
          </span>

          <span className="h-px w-12 bg-gray-200" />

        </div>

      </div>

    </section>
  );
};

export default TrustedPartners;