import React, { lazy, Suspense } from "react";
import { Helmet } from "react-helmet";

import TrustedPartners from "@/components/TrustedPartners.jsx";
import HeroBanner from "@/components/HeroBanner.jsx";
import MobileHomeOptimized from "@/components/MobileHomeOptimized.jsx";

const FeaturedDestinations = lazy(() =>
  import("@/components/FeaturedDestinations.jsx")
);

const TrendingProperties = lazy(() =>
  import("@/components/TrendingProperties.jsx")
);

const LuxuryVillas = lazy(() =>
  import("@/components/LuxuryVillas.jsx")
);

const PoolVillas = lazy(() =>
  import("@/components/PoolVillas.jsx")
);

const MountainVillas = lazy(() =>
  import("@/components/MountainVillas.jsx")
);

const WhyChooseTakeOnBnB = lazy(() =>
  import("@/components/WhyChooseTakeOnBnB.jsx")
);

const Testimonials = lazy(() =>
  import("@/components/Testimonials.jsx")
);

const FAQ = lazy(() =>
  import("@/components/FAQ.jsx")
);

const SectionLoader = () => (
  <div className="w-full min-h-[150px] flex items-center justify-center">
    <div className="text-gray-400 text-sm">Loading...</div>
  </div>
);

const HomePage = () => {
  return (
    <div className="min-h-screen">

      {/* MOBILE HOME */}
      <div className="block md:hidden">
        <MobileHomeOptimized />
      </div>

      {/* DESKTOP HOME */}
      <div className="hidden md:flex md:flex-col md:min-h-screen">

        <Helmet>
          <title>Take on BnB - Luxury Vacation Rentals</title>

          <meta
            name="description"
            content="Discover and book luxury vacation rentals, villas, cottages and unique stays with Take on BnB."
          />

          <link
            rel="preconnect"
            href="https://images.unsplash.com"
          />
        </Helmet>

        {/* Hero Section */}
        <HeroBanner />

        {/* Featured Destinations */}
        <Suspense fallback={<SectionLoader />}>
          <FeaturedDestinations />
        </Suspense>

        {/* Trending Properties */}
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

        {/* Mountain Escapes */}
        <Suspense fallback={<SectionLoader />}>
          <MountainVillas />
        </Suspense>

        {/* Trusted Partners */}
        <section className="py-8">
          <TrustedPartners />
        </section>

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
    </div>
  );
};

export default HomePage;
