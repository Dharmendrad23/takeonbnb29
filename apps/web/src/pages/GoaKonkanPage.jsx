import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import SharedDestinationLayout from '@/components/SharedDestinationLayout.jsx';
import pb from '@/lib/pocketbaseClient.js';

const whyVisit = [
  {
    title: 'Pristine Beaches & Coastlines',
    description: 'Experience miles of golden sands and azure waters. From vibrant party beaches in the North to secluded, serene coves in the South, the Konkan coast offers a beach for every mood.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80'
  },
  {
    title: 'Rich Portuguese Heritage',
    description: 'Wander through streets lined with colorful Portuguese-era villas, majestic basilicas, and historic forts that tell tales of a bygone colonial era blended seamlessly with Indian culture.',
    image: 'https://images.unsplash.com/photo-1537565266752-349f4c39f150?w=800&q=80'
  },
  {
    title: 'Vibrant Culinary Scene',
    description: 'Delight your palate with authentic Goan fish curries, fresh seafood caught daily, and an exciting fusion of local spices and international cuisines at world-class beach shacks.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80'
  }
];

const GoaKonkanPage = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const records = await pb.collection('properties').getList(1, 50, {
          filter: '(location ~ "Goa" || location ~ "Konkan") && approvalStatus="approved"',
          expand: 'amenities',
          $autoCancel: false
        });
        setProperties(records.items);
      } catch (error) {
        console.error("Failed to fetch Goa properties:", error);
      }
    };
    fetchProperties();
  }, []);

  return (
    <>
      <Helmet>
        <title>Goa & Konkan Luxury Stays | Take on BNB</title>
        <meta name="description" content="Discover premium vacation rentals and properties in Goa & Konkan on Take on BNB. Book your perfect stay today." />
      </Helmet>
      <SharedDestinationLayout
        title="Luxury Villas in Goa & Konkan"
        destinationName="Goa & Konkan"
        description="Where Golden Beaches Meet Vibrant Culture and Luxury."
        overview="Goa and the Konkan Coast are India's premier coastal destinations, renowned for their laid-back lifestyle, stunning sunsets, and vibrant nightlife. Beyond the popular beaches, you'll discover a world of lush spice plantations, hidden waterfalls, and grand Portuguese architecture. Our curated luxury villas offer the perfect blend of private tranquility and easy access to the region's best experiences."
        image="https://images.unsplash.com/photo-1593321706583-6a76bdbee0f1?w=1920&q=80"
        sampleProperties={properties}
        whyVisit={whyVisit}
        highlights={['World-class beaches and water sports', 'Portuguese architecture and heritage walks', 'Vibrant nightlife and beach clubs', 'Authentic Goan seafood and spice plantations', 'Private yacht charters along the Mandovi River']}
        bestTime="Mid-November to mid-February for ideal weather, or monsoon (June-August) for lush greenery."
      />
    </>
  );
};

export default GoaKonkanPage;