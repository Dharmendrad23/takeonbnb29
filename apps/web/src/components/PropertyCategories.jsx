import React, { useEffect, useState } from "react";

const categories = [
  {
    name: "Villas",
    description: "Private villas for relaxing stays",
    count: "120+ Stays",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=90",
  },
  {
    name: "Apartments",
    description: "Comfortable apartments in great locations",
    count: "200+ Stays",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=90",
  },
  {
    name: "Farm Houses",
    description: "Peaceful farm stays surrounded by nature",
    count: "85+ Stays",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=90",
  },
  {
    name: "Cottages",
    description: "Cozy cottages for memorable getaways",
    count: "70+ Stays",
    image:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1600&q=90",
  },
];

export default function PropertyCategories() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const activeCategory = categories[activeIndex];

  const nextCategory = () => {
    setDirection(1);
    setActiveIndex((current) => (current + 1) % categories.length);
  };

  const previousCategory = () => {
    setDirection(-1);
    setActiveIndex(
      (current) => (current - 1 + categories.length) % categories.length,
    );
  };

  const selectCategory = (index) => {
    if (index === activeIndex) return;

    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      nextCategory();
    }, 5000);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const categoryUrl = `/properties?category=${encodeURIComponent(
    activeCategory.name,
  )}`;

  return (
    <section
      className="relative overflow-hidden bg-[hsl(var(--background))] py-14 sm:py-16 lg:py-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Soft brand background decoration */}
      <div className="pointer-events-none absolute -left-24 top-8 h-64 w-64 rounded-full bg-[hsl(var(--primary)/0.06)] blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[hsl(var(--primary)/0.05)] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 flex items-center justify-center gap-4">
            <span className="h-[2px] w-12 bg-[hsl(var(--primary))]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-[hsl(var(--primary))] sm:text-[11px]">
              Explore Stays
            </span>

            <span className="h-[2px] w-12 bg-[hsl(var(--primary))]" />
          </div>

          <h2 className="font-serif text-4xl font-bold leading-tight tracking-tight text-[hsl(var(--foreground))] sm:text-5xl lg:text-6xl">
            Browse by{" "}
            <span className="text-[hsl(var(--primary))]">Category</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[hsl(var(--foreground)/0.62)] sm:text-base">
            Find the perfect stay for the way you want to travel.
          </p>
        </div>

        {/* Single SWAP card */}
        <div className="relative mx-auto mt-10 max-w-6xl">
          {/* Previous */}
          <button
            type="button"
            onClick={previousCategory}
            aria-label="Previous category"
            className="category-arrow category-arrow-left"
          >
            <span>←</span>
          </button>

          {/* Main card */}
          <div className="rounded-[28px] border border-[hsl(var(--primary)/0.16)] bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-3">
            <div
              className="category-swap-card relative h-[330px] overflow-hidden rounded-[22px] sm:h-[390px] md:h-[470px]"
              key={activeCategory.name}
            >
              {/* Image */}
              <img
                src={activeCategory.image}
                alt={activeCategory.name}
                className={`absolute inset-0 h-full w-full object-cover ${
                  direction === 1
                    ? "category-image-next"
                    : "category-image-prev"
                }`}
              />

              {/* Image overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

              {/* Stay count */}
              <div className="absolute right-5 top-5 rounded-full bg-white/95 px-4 py-2.5 text-xs font-semibold text-[hsl(var(--foreground))] shadow-lg backdrop-blur-md sm:right-7 sm:top-7 sm:px-5 sm:py-3 sm:text-sm">
                <span className="mr-2">⌂</span>
                {activeCategory.count}
              </div>

              {/* Content */}
              <div
                className={`absolute inset-x-0 bottom-0 ${
                  direction === 1
                    ? "category-content-next"
                    : "category-content-prev"
                }`}
              >
                <div className="max-w-xl p-6 sm:p-9 md:p-12">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="h-[2px] w-10 bg-[hsl(var(--primary))]" />

                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[hsl(var(--primary))] sm:text-xs">
                      Explore Stays
                    </span>
                  </div>

                  <h3 className="font-serif text-4xl font-bold leading-none text-white sm:text-5xl md:text-6xl">
                    {activeCategory.name}
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-white/85 sm:text-base sm:leading-7">
                    {activeCategory.description}
                  </p>

                  {/* Related properties */}
                  <a
                    href={categoryUrl}
                    className="mt-5 inline-flex items-center gap-3 rounded-full bg-[hsl(var(--primary))] px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:brightness-95 hover:shadow-xl sm:mt-6"
                  >
                    Explore {activeCategory.name}
                    <span className="text-lg leading-none">→</span>
                  </a>
                </div>
              </div>

              {/* Card arrow */}
              <a
                href={categoryUrl}
                aria-label={`Open ${activeCategory.name} properties`}
                className="absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-xl text-white shadow-xl transition-all duration-300 hover:scale-110 sm:bottom-8 sm:right-8 sm:h-14 sm:w-14"
              >
                →
              </a>
            </div>
          </div>

          {/* Next */}
          <button
            type="button"
            onClick={nextCategory}
            aria-label="Next category"
            className="category-arrow category-arrow-right"
          >
            <span>→</span>
          </button>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-center gap-3">
          {categories.map((category, index) => (
            <button
              key={category.name}
              type="button"
              onClick={() => selectCategory(index)}
              aria-label={`Show ${category.name}`}
              className={`category-dot ${
                index === activeIndex ? "category-dot-active" : ""
              }`}
            />
          ))}
        </div>

        {/* Bottom label */}
        <div className="mt-8 flex items-center justify-center gap-4 text-center">
          <span className="h-[2px] w-10 bg-[hsl(var(--primary)/0.35)] sm:w-16" />

          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[hsl(var(--foreground)/0.55)] sm:text-xs">
            <span className="mr-2 text-lg text-[hsl(var(--primary))]">∞</span>
            Discover Your Stay
            <span className="ml-2 text-lg text-[hsl(var(--primary))]">∞</span>
          </span>

          <span className="h-[2px] w-10 bg-[hsl(var(--primary)/0.35)] sm:w-16" />
        </div>
      </div>
    </section>
  );
}
