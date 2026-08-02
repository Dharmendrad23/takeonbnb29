import React from 'react';
import { Helmet } from 'react-helmet';
import SharedDestinationLayout from '@/components/SharedDestinationLayout.jsx';

const sampleProperties = [
  { id: 'rj-1', title: 'Royal Palace Villa Jaipur', pricePerNight: 13500, rating: 4.9, bedrooms: 4, guests: 8, location: 'Jaipur, Rajasthan', photos: [], _staticImage: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=800&q=80', description: 'Live like royalty in this meticulously restored heritage palace villa.' },
  { id: 'rj-2', title: 'Luxury Heritage Villa Udaipur', pricePerNight: 15000, rating: 4.8, bedrooms: 5, guests: 10, location: 'Udaipur, Rajasthan', photos: [], _staticImage: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&q=80', description: 'Stunning heritage property overlooking the beautiful Lake Pichola.' },
  { id: 'rj-3', title: 'Premium Villa Jodhpur', pricePerNight: 11500, rating: 4.7, bedrooms: 3, guests: 6, location: 'Jodhpur, Rajasthan', photos: [], _staticImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', description: 'Majestic villa offering views of the magnificent Mehrangarh Fort.' },
];

const whyVisit = [
  {
    title: 'Royal Heritage & Architecture',
    description: 'Step into a world of grand palaces, ornate havelis, and majestic forts. Our heritage properties are meticulously restored to offer a true royal experience.',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80'
  },
  {
    title: 'Mesmerizing Deserts',
    description: 'Experience the magic of the Thar Desert. Enjoy luxury glamping, private dune dinners under the stars, and camel safaris in absolute comfort.',
    image: 'https://images.unsplash.com/photo-1541410965313-d53b3c16ef17?w=800&q=80'
  },
  {
    title: 'Vibrant Culture & Cuisine',
    description: 'Rajasthan is a riot of colors, folk music, and incredible culinary traditions. Enjoy private performances and royal dining experiences curated by your hosts.',
    image: 'https://images.unsplash.com/photo-1599661559622-c3f2518eeb68?w=800&q=80'
  }
];

const RajasthanPage = () => {
  return (
    <>
      <Helmet>
        <title>Rajasthan Luxury Stays | Take on BNB</title>
        <meta name="description" content="Discover premium vacation rentals and properties in Rajasthan on Take on BNB. Book your perfect stay today." />
      </Helmet>
      <SharedDestinationLayout
        title="Royal Heritage in Rajasthan"
        destinationName="Rajasthan"
        description="Immerse yourself in royal luxury with stays in magnificent havelis and modern desert retreats."
        overview="Rajasthan is India's most flamboyant state, woven with tales of Rajput valor, grand palaces, and endless sand dunes. It offers an opulent travel experience steeped in history. Stay in our curated collection of centuries-old havelis, royal estates in the Pink City of Jaipur, lakeside luxury in Udaipur, or exclusive desert camps in Jaisalmer. Every property here treats you to legendary Rajasthani hospitality."
        image="https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1920&q=80"
        sampleProperties={sampleProperties}
        whyVisit={whyVisit}
        highlights={['Stay in meticulously restored historic havelis and palaces', 'Private boat dining on Lake Pichola in Udaipur', 'Exclusive desert safaris and luxury glamping in Jaisalmer', 'Curated royal dining and traditional Thali experiences', 'Bespoke shopping for textiles and gems in Jaipur']}
        bestTime="October to March when the desert climate is cool and comfortable."
      />
    </>
  );
};

export default RajasthanPage;