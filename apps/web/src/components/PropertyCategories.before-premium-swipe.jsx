import React from "react";

const categories = [
  {
    name: "Villas",
    description: "Private villas for relaxing stays",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "Apartments",
    description: "Comfortable apartments in great locations",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "Farm Houses",
    description: "Peaceful farm stays surrounded by nature",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "Cottages",
    description: "Cozy cottages for memorable getaways",
    image:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=85",
  },
];

function CategoryCard({ category }) {
  const categoryPath = `/properties?category=${encodeURIComponent(category.name)}`;

  return (
    <a
      href={categoryPath}
      className="category-slider-card group relative block h-52 w-[260px] shrink-0 overflow-hidden rounded-2xl border border-[#e6d7b9] bg-[#162038] shadow-[0_8px_28px_rgba(22,32,56,0.08)] transition-all duration-500 hover:-translate-y-1 hover:border-[#c99532] hover:shadow-[0_18px_40px_rgba(22,32,56,0.16)] md:h-56 md:w-[290px]"
      aria-label={`Explore ${category.name}`}
    >
      <img
        src={category.image}
        alt={category.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />

      {/* TakeOnBnB premium overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#101a2d] via-[#101a2d]/35 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#e8bd62]">
          Explore Stays
        </p>

        <div className="mt-1 flex items-end justify-between gap-3">
          <div>
            <h3 className="font-serif text-2xl font-bold text-white md:text-3xl">
              {category.name}
            </h3>

            <p className="mt-1 line-clamp-1 text-xs text-white/75">
              {category.description}
            </p>
          </div>

          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e8bd62]/50 bg-[#162038]/60 text-lg text-[#e8bd62] backdrop-blur-md transition-all duration-500 group-hover:translate-x-1 group-hover:bg-[#c38b27] group-hover:text-white">
            →
          </span>
        </div>
      </div>
    </a>
  );
}

export default function PropertyCategories() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#fffdf8] to-[#faf7ef] py-14 md:py-18">
      <div className="pointer-events-none absolute -left-32 top-10 h-64 w-64 rounded-full bg-[#c99532]/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-[#162038]/5 blur-3xl" />

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

        {/* Category Marquee */}
        <div className="relative mt-10 overflow-hidden rounded-[28px] border border-[#e6d7b9] bg-white/80 py-6 shadow-[0_18px_55px_rgba(22,32,56,0.07)]">
          {/* Left fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white via-white/90 to-transparent md:w-28" />

          {/* Right fade */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white via-white/90 to-transparent md:w-28" />

          {/* Moving Track */}
          <div className="category-slider-track">
            {/* First set */}
            <div className="flex shrink-0 items-center gap-5 px-3 md:gap-7 md:px-4">
              {categories.map((category) => (
                <CategoryCard key={category.name} category={category} />
              ))}
            </div>

            {/* Exact duplicate for seamless animation */}
            <div
              className="flex shrink-0 items-center gap-5 px-3 md:gap-7 md:px-4"
              aria-hidden="true"
            >
              {categories.map((category) => (
                <CategoryCard
                  key={`duplicate-${category.name}`}
                  category={category}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Moving indicator */}
        <div className="mx-auto mt-5 h-1 w-40 overflow-hidden rounded-full bg-[#e9e1d2]">
          <div className="category-progress h-full w-1/2 rounded-full bg-gradient-to-r from-[#a86e0c] via-[#d9a43c] to-[#a86e0c]" />
        </div>

        {/* Bottom text */}
        <div className="mt-6 flex items-center justify-center gap-3 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-[#98a2b3]">
          <span className="h-px w-10 bg-[#d8cdbb]" />
          <span className="text-[#c38b27]">∞</span>
          Explore · Choose · Stay
          <span className="h-px w-10 bg-[#d8cdbb]" />
        </div>
      </div>
    </section>
  );
}
