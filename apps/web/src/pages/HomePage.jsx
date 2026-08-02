
import React from 'react';
import { Helmet } from 'react-helmet';
import HeroBanner from '@/components/HeroBanner.jsx';
import FeaturedDestinations from '@/components/FeaturedDestinations.jsx';
import TrendingProperties from '@/components/TrendingProperties.jsx';
import LuxuryVillas from '@/components/LuxuryVillas.jsx';
import PoolVillas from '@/components/PoolVillas.jsx';
import MountainVillas from '@/components/MountainVillas.jsx';
import BeachVillas from '@/components/BeachVillas.jsx';
import PropertyCategories from '@/components/PropertyCategories.jsx';
import WhyChooseTakeOnBnB from '@/components/WhyChooseTakeOnBnB.jsx';
import Testimonials from '@/components/Testimonials.jsx';
import FAQ from '@/components/FAQ.jsx';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Take on BnB - Luxury Vacation Rentals</title>
        <meta name="description" content="Discover and book luxury vacation rentals, villas, and unique stays globally with Take on BnB." />
      </Helmet>

      <HeroBanner />
      <FeaturedDestinations />
      <TrendingProperties />
      <LuxuryVillas />
      <PoolVillas />
      <PropertyCategories />
      <MountainVillas />
      <WhyChooseTakeOnBnB />
      <BeachVillas />
      <Testimonials />
      <FAQ />
    </div>
  );
};

export default HomePage;
