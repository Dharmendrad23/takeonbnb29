import React, { useEffect, useState } from "react";

const categories = [
  {
    name: "Villas",
    description: "Private villas for relaxing stays",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=90",
  },
  {
    name: "Apartments",
    description: "Comfortable apartments in great locations",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1800&q=90",
  },
  {
    name: "Farm Houses",
    description: "Peaceful farm stays surrounded by nature",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=90",
  },
  {
    name: "Cottages",
    description: "Cozy cottages for memorable getaways",
    image:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1800&q=90",
  },
];

export default function PropertyCategories() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((current) => (current + 1) % categories.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const changeCategory = (index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const active = categories[activeIndex];

  return (
    <section
      className="relative overflow-hidden bg-white py-14 md:py-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full bg-[#c99532]/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-[#162038]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#c99532]" />

            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#b78322]">
              Explore Stays
            </span>

            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#c99532]" />
          </div>

          <h2 className="font-serif text-4xl font-bold tracking-tight text-[#162038] sm:text-5xl md:text-6xl">
            Browse by <span className="text-[#c38b27]">Category</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#667085] sm:text-base">
            Discover stays designed around the way you want to travel.
          </p>
        </div>

        {/* SINGLE SWAP CARD */}
        <div className="mx-auto mt-10 max-w-6xl">
          <div className="relative overflow-hidden rounded-[32px] border border-[#e6d7b9] bg-[#162038] shadow-[0_25px_70px_rgba(22,32,56,0.14)]">
            {/* Image */}
            <div className="relative h-[420px] overflow-hidden md:h-[500px]">
              <img
                key={active.image}
                src={active.image}
                alt={active.name}
                className={`absolute inset-0 h-full w-full object-cover ${
                  direction === 1
                    ? "animate-category-swap-next"
                    : "animate-category-swap-prev"
                }`}
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#07101f]/85 via-[#07101f]/35 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07101f]/80 via-transparent to-transparent" />

              {/* Gold glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#d9a43c]/20 blur-3xl" />

              {/* Content */}
              <div
                key={`${active.name}-content`}
                className={`absolute inset-0 flex items-center ${
                  direction === 1
                    ? "animate-category-content-next"
                    : "animate-category-content-prev"
                }`}
              >
                <div className="max-w-xl px-7 py-10 md:px-14">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="h-px w-12 bg-[#d9a43c]" />

                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#e8bd62]">
                      Explore
                    </span>
                  </div>

                  <h3 className="font-serif text-5xl font-bold text-white sm:text-6xl md:text-7xl">
                    {active.name}
                  </h3>

                  <p className="mt-5 max-w-md text-sm leading-7 text-white/80 sm:text-base">
                    {active.description}
                  </p>

                  <button
                    type="button"
                    className="mt-7 inline-flex items-center gap-3 rounded-full bg-[#c38b27] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#a87317] hover:shadow-xl"
                  >
                    Explore {active.name}
                    <span className="text-lg">→</span>
                  </button>
                </div>
              </div>

              {/* Category counter */}
              <div className="absolute right-6 top-6 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-xs font-bold text-white backdrop-blur-md">
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(categories.length).padStart(2, "0")}
              </div>
            </div>

            {/* Bottom navigation */}
            <div className="flex flex-wrap items-center justify-between gap-5 bg-white px-5 py-5 md:px-8">
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((category, index) => (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => changeCategory(index)}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-500 ${
                      index === activeIndex
                        ? "bg-[#162038] text-white shadow-md"
                        : "bg-[#f5f2eb] text-[#667085] hover:bg-[#e9dfca] hover:text-[#162038]"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Progress */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#98a2b3]">
                  Auto Swap
                </span>

                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#e9e1d2]">
                  <div
                    key={activeIndex}
                    className="h-full rounded-full bg-gradient-to-r from-[#a86e0c] via-[#d9a43c] to-[#a86e0c] animate-category-progress"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#98a2b3]">
          <span
            className={`h-2 w-2 rounded-full ${
              isPaused ? "bg-[#98a2b3]" : "animate-pulse bg-[#c38b27]"
            }`}
          />
          {isPaused ? "Paused" : "Discovering"} · {active.name}
        </div>
      </div>
    </section>
  );
}
