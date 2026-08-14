import React, { lazy, Suspense } from "react";
import { Helmet } from "react-helmet";

import HeroBanner from "@/components/HeroBanner.jsx";

// Lazy loaded sections
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

const BeachVillas = lazy(() =>
  import("@/components/BeachVillas.jsx")
);

const PropertyCategories = lazy(() =>
  import("@/components/PropertyCategories.jsx")
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
    <div className="text-gray-400 text-sm">
      Loading...
    </div>
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

      {/* Load Hero immediately for faster LCP */}
      <HeroBanner />

      {/* Below-the-fold sections */}
      <Suspense fallback={<SectionLoader />}>
        <FeaturedDestinations />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <TrendingProperties />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <LuxuryVillas />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <PoolVillas />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <PropertyCategories />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <MountainVillas />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <WhyChooseTakeOnBnB />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <BeachVillas />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Testimonials />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <FAQ />
      </Suspense>
    </div>
  );
};

export default HomePage;