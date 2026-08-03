import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import SharedDestinationLayout from '@/components/SharedDestinationLayout.jsx';
import api from '@/lib/api';

const whyVisit = [
  {
    title: 'Urban Sophistication',
    description: 'Delhi NCR blends historic grandeur with cutting-edge modernity. Experience the pinnacle of urban luxury in our expansive farmhouses and premium penthouses.',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80'
  },
  {
    title: 'Culinary Capital',
    description: 'From Michelin-starred restaurants to legendary street food in Chandni Chowk, the culinary landscape is unmatched. Our properties put you at the center of it all.',
    image: 'https://images.unsplash.com/photo-1627885973792-5cb0f9241680?w=800&q=80'
  },
  {
    title: 'Exclusive Retreats',
    description: 'Escape the city buzz in sprawling luxury farmhouses in Chhatarpur and Gurugram, offering private pools, manicured lawns, and complete privacy just minutes from the hub.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'
  }
];

const DelhiNCRPage = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const records = await pb.collection('properties').getList(1, 50, {
          filter: '(location ~ "Delhi" || location ~ "Gurugram" || location ~ "Noida") && approvalStatus="approved"',
          expand: 'amenities',
          $autoCancel: false
        });
        setProperties(records.items);
      } catch (error) {
        console.error("Failed to fetch Delhi NCR properties:", error);
      }
    };
    fetchProperties();
  }, []);

  return (
    <>
      <Helmet>
        <title>Delhi NCR Luxury Stays | Take on BNB</title>
        <meta name="description" content="Discover premium vacation rentals and properties in Delhi NCR on Take on BNB. Book your perfect stay today." />
      </Helmet>
      <SharedDestinationLayout
        title="Luxury Villas in Delhi NCR"
        destinationName="Delhi NCR"
        description="Premium stays blending urban sophistication with ultimate comfort in the capital region."
        overview="The National Capital Region is a dynamic blend of deep-rooted history and rapid modernity. It serves as a bustling gateway to India, yet harbors exclusive pockets of immense tranquility and luxury. From chic high-rise penthouses overlooking modern skylines to sprawling, lush farmhouses in South Delhi and Gurugram, our properties offer an oasis of calm, complete with private pools, manicured gardens, and world-class amenities."
        image="https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1920&q=80"
        sampleProperties={properties}
        whyVisit={whyVisit}
        highlights={['Sprawling private luxury farmhouses in Chhatarpur and Gurugram', 'World-class fine dining and premium shopping districts', 'Guided heritage walks through Mughal and colonial monuments', 'Proximity to major corporate hubs and diplomatic enclaves', 'High-end apartments with panoramic city views']}
        bestTime="October to March for the most pleasant outdoor weather."
      />
    </>
  );
};

export default DelhiNCRPage;