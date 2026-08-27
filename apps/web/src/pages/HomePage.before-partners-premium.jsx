import React, { lazy, Suspense } from "react";
import { Helmet } from "react-helmet";

import HeroBanner from "@/components/HeroBanner.jsx";

// Lazy loaded sections
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
  <div className="w-full min-h-[150px] flex items-center justify-center">
    <div className="text-gray-400 text-sm">Loading...</div>
  </div>
);

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Take on BnB - Luxury Vacation Rentals</title>

        <meta
          name="description"
          content="Discover and book luxury vacation rentals, villas, cottages and unique stays with Take on BnB."
        />

        <link rel="preconnect" href="https://images.unsplash.com" />
      </Helmet>

      {/* Hero Section */}
      <HeroBanner />

      {/* Featured Destinations */}
      <Suspense fallback={<SectionLoader />}>
        <FeaturedDestinations />
      </Suspense>

      {/* All Trending Properties */}
      <Suspense fallback={<SectionLoader />}>
        <TrendingProperties />
      </Suspense>

      {/* Luxury Villas */}
      <Suspense fallback={<SectionLoader />}>
        <LuxuryVillas />
      </Suspense>

      {/* Pool Villas */}
      <Suspense fallback={<SectionLoader />}>
        <PoolVillas />
      </Suspense>

      {/* Our Partners */}
      <section className="py-14 overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">
              Our Partners
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-foreground">
              Trusted Partners
            </h2>
          </div>

          <div className="relative overflow-hidden">
            <div className="flex w-max items-center gap-8 md:gap-12 animate-partner-marquee">
              <div className="flex h-28 w-52 shrink-0 items-center justify-center rounded-2xl border border-border bg-white p-5 shadow-sm">
                <img
                  src="https://res.cloudinary.com/bfmmvn4z/image/upload/v1787824471/sl_logo.png"
                  alt="Partner"
                  className="max-h-20 max-w-full object-contain"
                />
              </div>

              <div className="flex h-28 w-52 shrink-0 items-center justify-center rounded-2xl border border-border bg-white p-5 shadow-sm">
                <img
                  src="https://res.cloudinary.com/bfmmvn4z/image/upload/v1787825296/image.png"
                  alt="Partner"
                  className="max-h-20 max-w-full object-contain"
                />
              </div>

              <div className="flex h-28 w-52 shrink-0 items-center justify-center rounded-2xl border border-border bg-white p-5 shadow-sm">
                <img
                  src="https://res.cloudinary.com/bfmmvn4z/image/upload/v1787825296/Untitled_design.png"
                  alt="Partner"
                  className="max-h-20 max-w-full object-contain"
                />
              </div>

              <div className="flex h-28 w-52 shrink-0 items-center justify-center rounded-2xl border border-border bg-white p-5 shadow-sm">
                <img
                  src="https://res.cloudinary.com/bfmmvn4z/image/upload/v1787824497/gurbani_infra_logo.png"
                  alt="Gurbani Infra"
                  className="max-h-20 max-w-full object-contain"
                />
              </div>

              <div className="flex h-28 w-52 shrink-0 items-center justify-center rounded-2xl border border-border bg-white p-5 shadow-sm">
                <img
                  src="https://res.cloudinary.com/bfmmvn4z/image/upload/v1787824471/sl_logo.png"
                  alt="Partner"
                  className="max-h-20 max-w-full object-contain"
                />
              </div>

              <div className="flex h-28 w-52 shrink-0 items-center justify-center rounded-2xl border border-border bg-white p-5 shadow-sm">
                <img
                  src="https://res.cloudinary.com/bfmmvn4z/image/upload/v1787825296/image.png"
                  alt="Partner"
                  className="max-h-20 max-w-full object-contain"
                />
              </div>

              <div className="flex h-28 w-52 shrink-0 items-center justify-center rounded-2xl border border-border bg-white p-5 shadow-sm">
                <img
                  src="https://res.cloudinary.com/bfmmvn4z/image/upload/v1787825296/Untitled_design.png"
                  alt="Partner"
                  className="max-h-20 max-w-full object-contain"
                />
              </div>

              <div className="flex h-28 w-52 shrink-0 items-center justify-center rounded-2xl border border-border bg-white p-5 shadow-sm">
                <img
                  src="https://res.cloudinary.com/bfmmvn4z/image/upload/v1787824497/gurbani_infra_logo.png"
                  alt="Gurbani Infra"
                  className="max-h-20 max-w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Browse by Category */}
      <Suspense fallback={<SectionLoader />}>
        <PropertyCategories />
      </Suspense>

      {/* Mountain Escapes */}
      <Suspense fallback={<SectionLoader />}>
        <MountainVillas />
      </Suspense>

      {/* Why Choose Us */}
      <Suspense fallback={<SectionLoader />}>
        <WhyChooseTakeOnBnB />
      </Suspense>

      {/* Testimonials */}
      <Suspense fallback={<SectionLoader />}>
        <Testimonials />
      </Suspense>

      {/* FAQ */}
      <Suspense fallback={<SectionLoader />}>
        <FAQ />
      </Suspense>
    </div>
  );
};

export default HomePage;
