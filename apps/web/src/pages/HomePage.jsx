import TrustedPartners from "@/components/TrustedPartners.jsx";
import React, { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import SearchBar from "@/components/SearchBar";
const FeaturedDestinations = lazy(
  () => import("@/components/FeaturedDestinations.jsx"),
);

const TrendingProperties = lazy(
  () => import("@/components/TrendingProperties.jsx"),
);

const LuxuryVillas = lazy(() => import("@/components/LuxuryVillas.jsx"));

const PoolVillas = lazy(() => import("@/components/PoolVillas.jsx"));

const MountainVillas = lazy(() => import("@/components/MountainVillas.jsx"));

const PropertyCategories = lazy(
  () => import("@/components/PropertyCategories.jsx"),
);

const WhyChooseTakeOnBnB = lazy(
  () => import("@/components/WhyChooseTakeOnBnB.jsx"),
);

const Testimonials = lazy(() => import("@/components/Testimonials.jsx"));

const FAQ = lazy(() => import("@/components/FAQ.jsx"));

const SectionLoader = () => (
  <div className="w-full min-h-[120px] flex items-center justify-center">
    <div className="w-6 h-6 rounded-full border-2 border-[#F97316] border-t-transparent animate-spin" />
  </div>
);

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white text-[#171717] overflow-hidden">
      <Helmet>
        <title>TakeOnBNB - Stay More. Explore More.</title>

        <meta
          name="description"
          content="Discover premium villas, homestays, cottages and unique stays with TakeOnBNB."
        />

        <link rel="preconnect" href="https://images.unsplash.com" />
      </Helmet>

      {/* =========================================================
          PREMIUM HERO
      ========================================================= */}

      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10">

          {/* Hero heading */}
          <div className="pt-14 sm:pt-20 pb-8 text-center">

            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-8 h-px bg-[#F97316]" />
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-[#F97316]">
                STAYS • EXPERIENCES • MEMORIES
              </span>
              <span className="w-8 h-px bg-[#F97316]" />
            </div>

            <h1 className="text-[42px] sm:text-[58px] lg:text-[72px] leading-[0.98] font-semibold tracking-[-0.045em]">
              Find your{" "}
              <span className="text-[#F97316]">
                perfect stay
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[#737373]">
              Unique homes. Unforgettable experiences. Only on TakeOnBNB.
            </p>
          </div>

          {/* =====================================================
              SEARCH BAR
          ===================================================== */}

          <div className="relative z-20 max-w-[1180px] mx-auto mb-12">
            <SearchBar
              onSearch={(criteria) => {
                const params = new URLSearchParams();

                if (criteria.where) {
                  params.set("location", criteria.where);
                }

                if (criteria.checkIn) {
                  params.set("checkIn", criteria.checkIn);
                }

                if (criteria.checkOut) {
                  params.set("checkOut", criteria.checkOut);
                }

                if (criteria.guests) {
                  params.set("guests", criteria.guests);
                }

                navigate(`/search?${params.toString()}`);
              }}
            />
          </div>
          {/* =====================================================
              CATEGORY NAVIGATION
          ===================================================== */}

          <div className="border-b border-[#EEEEEE] pb-4">
            <div className="flex items-center gap-7 sm:gap-10 overflow-x-auto scrollbar-hide">

              {[
                ["⌂", "All homes"],
                ["⌂", "Villas"],
                ["⌂", "Homestays"],
                ["⌂", "Cottages"],
                ["△", "Mountain"],
                ["☀", "Beach"],
                ["♧", "Countryside"],
                ["≋", "Lakefront"],
                ["♧", "Pet friendly"],
                ["⌂", "Treehouses"],
                ["♨", "Trending"],
              ].map(([icon, label], index) => (
                <button
                  key={label}
                  type="button"
                  className={`group min-w-max flex flex-col items-center gap-2 py-2 ${
                    index === 0
                      ? "text-[#F97316]"
                      : "text-[#555]"
                  }`}
                >
                  <span
                    className={`text-2xl leading-none ${
                      index === 0
                        ? "text-[#F97316]"
                        : "text-[#333] group-hover:text-[#F97316]"
                    }`}
                  >
                    {icon}
                  </span>

                  <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                    {label}
                  </span>

                  {index === 0 && (
                    <span className="h-[2px] w-full bg-[#F97316] rounded-full mt-1" />
                  )}
                </button>
              ))}

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}

      <main className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10">

        {/* Popular destinations */}
        <section className="pt-10">
          <Suspense fallback={<SectionLoader />}>
            <FeaturedDestinations />
          </Suspense>
        </section>

        {/* Featured / Trending properties */}
        <section className="pt-8">
          <Suspense fallback={<SectionLoader />}>
            <TrendingProperties />
          </Suspense>
        </section>

        {/* Luxury */}
        <section className="pt-8">
          <Suspense fallback={<SectionLoader />}>
            <LuxuryVillas />
          </Suspense>
        </section>

        {/* Pool */}
        <section className="pt-8">
          <Suspense fallback={<SectionLoader />}>
            <PoolVillas />
          </Suspense>
        </section>

        {/* =====================================================
            PROPERTY SWAP PROMO
        ===================================================== */}

        <section className="py-12">
          <div className="rounded-[28px] overflow-hidden bg-[#FFF4EA] border border-[#FFE2CC]">

            <div className="grid lg:grid-cols-2 items-center">

              <div className="p-8 sm:p-10 lg:p-14">

                <span className="text-[10px] font-bold tracking-[0.25em] text-[#F97316] uppercase">
                  New on TakeOnBNB
                </span>

                <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
                  Swap Properties.
                  <br />
                  <span className="text-[#F97316]">
                    Explore More.
                  </span>
                </h2>

                <p className="mt-4 max-w-md text-[#666] leading-relaxed">
                  List your property, swap with other hosts and
                  discover new destinations without limits.
                </p>

                <button
                  type="button"
                  className="mt-7 inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3.5 rounded-full transition"
                >
                  Explore Property Swap
                  <span>→</span>
                </button>

              </div>

              <div className="hidden lg:flex min-h-[300px] items-center justify-center relative p-10">

                <div className="absolute w-[260px] h-[180px] bg-white rounded-2xl shadow-xl rotate-[-6deg] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=700&q=80"
                    alt="Property"
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute bottom-0 left-0 right-0 bg-white/95 p-3">
                    <p className="text-xs font-semibold">
                      Your property
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Rishikesh
                    </p>
                  </div>
                </div>

                <div className="absolute text-4xl text-[#F97316] font-light z-10">
                  ↔
                </div>

                <div className="absolute w-[260px] h-[180px] bg-white rounded-2xl shadow-xl rotate-[6deg] overflow-hidden translate-x-28">
                  <img
                    src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=700&q=80"
                    alt="Swap property"
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute bottom-0 left-0 right-0 bg-white/95 p-3">
                    <p className="text-xs font-semibold">
                      Swap & Stay
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Goa
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="py-4">
          <TrustedPartners />
        </section>

        {/* Categories */}
        <section className="pt-8">
          <Suspense fallback={<SectionLoader />}>
            <PropertyCategories />
          </Suspense>
        </section>

        {/* Mountain */}
        <section className="pt-8">
          <Suspense fallback={<SectionLoader />}>
            <MountainVillas />
          </Suspense>
        </section>

        {/* =====================================================
            WHY CHOOSE US
        ===================================================== */}

        <section className="pt-12">
          <div className="text-center mb-8">

            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#F97316]">
              The TakeOnBNB Difference
            </span>

            <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
              Why choose TakeOnBNB?
            </h2>

            <p className="mt-2 text-[#737373]">
              A better way to travel, stay and belong.
            </p>

          </div>

          <Suspense fallback={<SectionLoader />}>
            <WhyChooseTakeOnBnB />
          </Suspense>
        </section>

        {/* Testimonials */}
        <section className="pt-10">
          <Suspense fallback={<SectionLoader />}>
            <Testimonials />
          </Suspense>
        </section>

        {/* FAQ */}
        <section className="pt-8 pb-16">
          <Suspense fallback={<SectionLoader />}>
            <FAQ />
          </Suspense>
        </section>

      </main>

    </div>
  );
};

export default HomePage;







