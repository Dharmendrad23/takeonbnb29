import React from 'react';
import { Helmet } from 'react-helmet';
import SharedDestinationLayout from '@/components/SharedDestinationLayout.jsx';

const sampleProperties = [
  { id: 'kl-1', title: 'Luxury Houseboat Alleppey', pricePerNight: 16000, rating: 4.9, bedrooms: 2, guests: 4, location: 'Alleppey, Kerala', photos: [], _staticImage: 'https://images.unsplash.com/photo-1548625361-b51c11032a15?w=800&q=80', description: 'Experience the backwaters in ultimate luxury aboard a private houseboat.' },
  { id: 'kl-2', title: 'Beachfront Villa Marari', pricePerNight: 14500, rating: 4.8, bedrooms: 3, guests: 6, location: 'Marari, Kerala', photos: [], _staticImage: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80', description: 'Pristine beachfront property offering uninterrupted views of the Arabian Sea.' },
  { id: 'kl-3', title: 'Tea Estate Retreat Munnar', pricePerNight: 13000, rating: 4.7, bedrooms: 3, guests: 6, location: 'Munnar, Kerala', photos: [], _staticImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', description: 'Tranquil retreat nestled among lush green tea plantations.' },
];

const whyVisit = [
  {
    title: 'Serene Backwaters',
    description: 'Cruise through the emerald network of lagoons, lakes, and canals. Our luxury houseboats and backwater villas offer a peaceful, floating sanctuary surrounded by nature.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80'
  },
  {
    title: 'Ayurvedic Wellness',
    description: 'Rejuvenate your mind and body with authentic Ayurvedic spa treatments. Many of our premium properties offer in-house wellness centers and organic dining.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80'
  },
  {
    title: 'Lush Hill Stations',
    description: 'Escape to the misty hills of Munnar and Wayanad. Wake up to the aroma of fresh cardamom and sprawling tea estates right outside your luxury bungalow.',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&q=80'
  }
];

const KeralaPage = () => {
  return (
    <>
      <Helmet>
        <title>Kerala Luxury Stays | Take on BNB</title>
        <meta name="description" content="Discover premium vacation rentals and properties in Kerala on Take on BNB. Book your perfect stay today." />
      </Helmet>
      <SharedDestinationLayout
        title="Luxury Retreats in Kerala"
        destinationName="Kerala"
        description="Experience God's Own Country in private houseboats and backwater villas."
        overview="Kerala, affectionately known as 'God's Own Country', is a tropical paradise of swaying palm trees, tranquil backwaters, and lush hill stations. The slow-paced lifestyle here is a true luxury. Whether you're navigating the serene canals of Alleppey in a premium houseboat, unwinding in an Ayurvedic spa retreat, or sipping fresh tea on the misty slopes of Munnar, our Kerala properties promise total rejuvenation."
        image="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1920&q=80"
        sampleProperties={sampleProperties}
        whyVisit={whyVisit}
        highlights={['Private luxury houseboat cruises in Alleppey and Kumarakom', 'Authentic Ayurvedic spa and wellness therapies', 'Guided tours of rolling tea and spice plantations', 'Cultural performances including traditional Kathakali', 'Pristine, quiet beaches along the Malabar Coast']}
        bestTime="September to March for cool, comfortable weather, or June to August to experience the lush monsoon."
      />
    </>
  );
};

export default KeralaPage;