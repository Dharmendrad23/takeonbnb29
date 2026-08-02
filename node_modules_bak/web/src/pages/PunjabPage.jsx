import React from 'react';
import { Helmet } from 'react-helmet';
import SharedDestinationLayout from '@/components/SharedDestinationLayout.jsx';

const sampleProperties = [
  { id: 'pb-1', title: 'Luxury Farmhouse Amritsar', pricePerNight: 9500, rating: 4.8, bedrooms: 3, guests: 6, location: 'Amritsar, Punjab', photos: [], _staticImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', description: 'Spacious luxury villa surrounded by lush green fields and orchards.' },
  { id: 'pb-2', title: 'Premium Estate Chandigarh', pricePerNight: 8500, rating: 4.7, bedrooms: 3, guests: 6, location: 'Chandigarh, Punjab', photos: [], _staticImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', description: 'Authentic estate experience with modern luxury amenities.' },
  { id: 'pb-3', title: 'Boutique Stay Ludhiana', pricePerNight: 7500, rating: 4.6, bedrooms: 2, guests: 4, location: 'Ludhiana, Punjab', photos: [], _staticImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80', description: 'Charming boutique stay offering warm hospitality and comfort.' },
];

const whyVisit = [
  {
    title: 'Heartwarming Hospitality',
    description: 'Punjab is famous for its large-hearted people and unmatched hospitality. Stay in luxury farmhouses where you are treated like family and pampered with care.',
    image: 'https://images.unsplash.com/photo-1567688040542-d9a5d079b7c0?w=800&q=80'
  },
  {
    title: 'Rich Agrarian Landscapes',
    description: 'Wake up to the sight of endless golden wheat or green mustard fields. The serene countryside offers a perfect detox from urban life.',
    image: 'https://images.unsplash.com/photo-1625624021295-88cc10f5bd83?w=800&q=80'
  },
  {
    title: 'Vibrant Culture',
    description: 'From the soulful kirtans at the Golden Temple to energetic Bhangra nights and rich, buttery cuisine, Punjab is a celebration of life.',
    image: 'https://images.unsplash.com/photo-1590050751916-2917e9ea8e93?w=800&q=80'
  }
];

const PunjabPage = () => {
  return (
    <>
      <Helmet>
        <title>Punjab Luxury Stays | Take on BNB</title>
        <meta name="description" content="Discover premium vacation rentals and properties in Punjab on Take on BNB. Book your perfect stay today." />
      </Helmet>
      <SharedDestinationLayout
        title="Premium Stays in Punjab"
        destinationName="Punjab"
        description="Experience heartfelt hospitality and rich cultural heritage in our exclusive farmhouses."
        overview="Punjab, the land of five rivers, is characterized by its vibrant culture, lush agrarian landscapes, and legendary hospitality. It offers an earthy yet rich travel experience. Our curated properties in Punjab focus on expansive luxury farmhouses and elegant urban estates in cities like Chandigarh and Amritsar. Experience the true essence of 'Punjabi warmth' with private bonfire nights, traditional feasts, and tranquil mornings amidst nature."
        image="https://images.unsplash.com/photo-1567688040542-d9a5d079b7c0?w=1920&q=80"
        sampleProperties={sampleProperties}
        whyVisit={whyVisit}
        highlights={['Authentic luxury farmhouse stays surrounded by fields', 'Spiritual visits to the magnificent Golden Temple', 'Curated culinary experiences featuring rich local cuisine', 'Private cultural performances and Bhangra evenings', 'Modern luxury living in the planned city of Chandigarh']}
        bestTime="October to March, when the weather is cool and pleasant."
      />
    </>
  );
};

export default PunjabPage;