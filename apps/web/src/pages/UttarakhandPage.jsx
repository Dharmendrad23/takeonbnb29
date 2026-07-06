import React from 'react';
import { Helmet } from 'react-helmet';
import SharedDestinationLayout from '@/components/SharedDestinationLayout.jsx';

const sampleProperties = [
  { id: 'uk-1', title: 'Himalayan Aura Mussoorie', pricePerNight: 15000, rating: 4.9, bedrooms: 4, guests: 8, location: 'Mussoorie, Uttarakhand', photos: [], _staticImage: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80', description: 'Perched high in the hills, offering panoramic views of the Doon Valley.' },
  { id: 'uk-2', title: 'Mountain Retreat Nainital', pricePerNight: 12000, rating: 4.8, bedrooms: 3, guests: 6, location: 'Nainital, Uttarakhand', photos: [], _staticImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', description: 'A serene lakeside property surrounded by lush pine forests.' },
  { id: 'uk-3', title: 'Luxury Villa Bhimtal', pricePerNight: 11500, rating: 4.7, bedrooms: 3, guests: 6, location: 'Bhimtal, Uttarakhand', photos: [], _staticImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', description: 'Spacious villa with modern amenities and beautiful lake views.' },
];

const whyVisit = [
  {
    title: 'Majestic Himalayan Peaks',
    description: 'Wake up to awe-inspiring views of snow-capped mountains. The tranquil environment of Uttarakhand provides the perfect backdrop for a peaceful luxury retreat away from city chaos.',
    image: 'https://images.unsplash.com/photo-1589136777351-fdc9c9cb164f?w=800&q=80'
  },
  {
    title: 'Spiritual Wellness & Yoga',
    description: 'Known as the Yoga Capital of the World, Rishikesh and surrounding areas offer unparalleled wellness experiences, combining ancient holistic practices with modern luxury.',
    image: 'https://images.unsplash.com/photo-1593351415075-3bac9f45c877?w=800&q=80'
  },
  {
    title: 'Thrilling Adventure',
    description: 'From white-water rafting in the Ganges to premium wildlife safaris in Jim Corbett National Park, Uttarakhand perfectly balances luxury stays with outdoor excitement.',
    image: 'https://images.unsplash.com/photo-1626084656712-421b8b8ed659?w=800&q=80'
  }
];

const UttarakhandPage = () => {
  return (
    <>
      <Helmet>
        <title>Uttarakhand Luxury Stays | Take on BNB</title>
        <meta name="description" content="Discover premium vacation rentals and properties in Uttarakhand on Take on BNB. Book your perfect stay today." />
      </Helmet>
      <SharedDestinationLayout
        title="Luxury Villas in Uttarakhand"
        destinationName="Uttarakhand"
        description="Escape to the Himalayas in our exclusive mountain estates and serene retreats."
        overview="Known as 'Devbhoomi' or the Land of the Gods, Uttarakhand is a sanctuary of natural beauty and spiritual peace. Characterized by dense alpine forests, dramatic mountain ranges, and sacred rivers, it offers an escape unlike any other. Whether you seek the colonial charm of Mussoorie, the lakeside tranquility of Nainital, or the wilderness of Jim Corbett, our luxury estates provide a warm, premium haven in the crisp mountain air."
        image="https://images.unsplash.com/photo-1599821306970-0440b030738f?w=1920&q=80"
        sampleProperties={sampleProperties}
        whyVisit={whyVisit}
        highlights={['Panoramic views of the Nanda Devi and Himalayan ranges', 'Exclusive wilderness safaris in Jim Corbett National Park', 'Private yoga and wellness retreats', 'Lakeside dining in Nainital and Bhimtal', 'Scenic colonial-era hill stations']}
        bestTime="March to June for pleasant summers, and September to November for clear mountain views."
      />
    </>
  );
};

export default UttarakhandPage;