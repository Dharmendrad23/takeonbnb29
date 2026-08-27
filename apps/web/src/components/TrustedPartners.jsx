import React from "react";

const partners = [
  {
    name: "Altura Lux",
    src: "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787825296/image.png",
  },
  {
    name: "SP Co-Working",
    src: "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787825296/Untitled_design.png",
  },
  {
    name: "Gurbani Infra",
    src: "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787829570/Gurbani_Infra_Logo.png",
  },
  {
    name: "T-2",
    src: "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787829569/T_-_2.png",
  },
  {
    name: "Partner",
    src: "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787829792/Untitled_design.png",
  },
];

function LogoCard({ partner }) {
  return (
    <div className="group flex h-32 w-52 shrink-0 items-center justify-center rounded-2xl border border-[#e8dfcf] bg-white px-7 py-5 shadow-[0_8px_30px_rgba(22,32,56,0.06)] transition-all duration-500 hover:-translate-y-1 hover:border-[#d3a34a] hover:shadow-[0_18px_40px_rgba(195,139,39,0.14)] md:h-36 md:w-60">
      <img
        src={partner.src}
        alt={partner.name}
        loading="lazy"
        className="max-h-[92px] max-w-[190px] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.04]"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
}

export default function TrustedPartners() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fffdf8] via-[#faf7ef] to-white py-14 md:py-20">
      <div className="pointer-events-none absolute -left-28 top-8 h-56 w-56 rounded-full border border-[#c99532]/10" />
      <div className="pointer-events-none absolute -right-28 bottom-0 h-64 w-64 rounded-full border border-[#c99532]/10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#c99532]" />

            <span className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#b78322]">
              Our Partners
            </span>

            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#c99532]" />
          </div>

          <h2 className="font-serif text-4xl font-bold tracking-tight text-[#162038] sm:text-5xl md:text-6xl">
            Trusted <span className="text-[#c38b27]">Partners</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#667085] sm:text-base">
            Building meaningful partnerships to create better stays, memorable
            journeys and exceptional experiences.
          </p>
        </div>

        {/* Trust Highlights */}
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 overflow-hidden rounded-3xl border border-[#e5d8bd] bg-white/80 shadow-[0_15px_50px_rgba(50,40,20,0.06)] backdrop-blur-sm md:grid-cols-4">
          <div className="flex items-center justify-center gap-3 border-b border-[#eee5d5] p-5 md:border-b-0 md:border-r">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fbf3df] text-[#bd8520]">
              ✓
            </div>
            <div>
              <p className="text-xs font-bold text-[#162038]">Verified</p>
              <p className="mt-0.5 text-[10px] text-[#98a2b3]">
                Trusted partners
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 border-b border-[#eee5d5] p-5 md:border-b-0 md:border-r">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fbf3df] text-[#bd8520]">
              ◇
            </div>
            <div>
              <p className="text-xs font-bold text-[#162038]">Premium</p>
              <p className="mt-0.5 text-[10px] text-[#98a2b3]">
                Quality focused
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 border-b border-[#eee5d5] p-5 md:border-b-0 md:border-r">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fbf3df] text-[#bd8520]">
              ★
            </div>
            <div>
              <p className="text-xs font-bold text-[#162038]">Reliable</p>
              <p className="mt-0.5 text-[10px] text-[#98a2b3]">
                Built on trust
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fbf3df] text-[#bd8520]">
              ∞
            </div>
            <div>
              <p className="text-xs font-bold text-[#162038]">Together</p>
              <p className="mt-0.5 text-[10px] text-[#98a2b3]">
                Growing together
              </p>
            </div>
          </div>
        </div>

        {/* Logo Slider */}
        <div className="relative mt-10 overflow-hidden rounded-[30px] border border-[#e6d7b9] bg-white/90 py-7 shadow-[0_18px_55px_rgba(22,32,56,0.08)]">
          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white via-white/90 to-transparent md:w-28" />

          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white via-white/90 to-transparent md:w-28" />

          {/* Animated track */}
          <div className="partner-slider-track">
            {/* First set */}
            <div className="flex shrink-0 items-center gap-5 px-3 md:gap-7 md:px-4">
              {partners.map((partner) => (
                <LogoCard key={partner.name} partner={partner} />
              ))}
            </div>

            {/* Exact duplicate */}
            <div
              className="flex shrink-0 items-center gap-5 px-3 md:gap-7 md:px-4"
              aria-hidden="true"
            >
              {partners.map((partner, index) => (
                <LogoCard
                  key={`${partner.name}-duplicate-${index}`}
                  partner={partner}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mx-auto mt-6 h-1 w-44 overflow-hidden rounded-full bg-[#eadfca]">
          <div className="partner-progress h-full w-1/2 rounded-full bg-gradient-to-r from-[#a86e0c] via-[#d9a43c] to-[#a86e0c]" />
        </div>

        {/* Bottom line */}
        <div className="mt-7 flex items-center justify-center gap-3 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-[#98a2b3]">
          <span className="h-px w-10 bg-[#d8cdbb]" />
          <span className="text-[#c38b27]">∞</span>
          Strong Partnerships · Greater Journeys
          <span className="h-px w-10 bg-[#d8cdbb]" />
        </div>
      </div>
    </section>
  );
}
