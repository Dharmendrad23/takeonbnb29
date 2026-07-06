import React from 'react';
import { Helmet } from 'react-helmet';
import SharedDestinationLayout from '@/components/SharedDestinationLayout.jsx';

const sampleProperties = [
  { id: 'hp-1', title: 'Luxury Villa Manali', pricePerNight: 14500, rating: 4.9, bedrooms: 4, guests: 8, location: 'Manali, Himachal Pradesh', photos: [], _staticImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80', description: 'Cozy luxury villa with snow-capped mountain views and a fireplace.' },
  { id: 'hp-2', title: 'Premium Stay Shimla', pricePerNight: 13000, rating: 4.8, bedrooms: 3, guests: 6, location: 'Shimla, Himachal Pradesh', photos: [], _staticImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', description: 'Heritage property offering colonial charm and modern comforts.' },
  { id: 'hp-3', title: 'Mountain Retreat Dharamshala', pricePerNight: 11500, rating: 4.7, bedrooms: 3, guests: 6, location: 'Dharamshala, Himachal Pradesh', photos: [], _staticImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', description: 'Peaceful retreat nestled in the Dhauladhar range.' },
];

const whyVisit = [
  {
    title: 'Alpine Splendor',
    description: 'Himachal is a canvas of pine forests, gushing rivers, and towering snow peaks. The dramatic landscapes offer the perfect setting for luxury chalets and grand mountain estates.',
    image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=80'
  },
  {
    title: 'Rich Tibetan Culture',
    description: 'Discover the peaceful resonance of Tibetan culture in Dharamshala and Spiti. Monasteries, prayer flags, and warm local hospitality add depth to your mountain getaway.',
    image: 'https://images.unsplash.com/photo-1598094622173-86402422eb18?w=800&q=80'
  },
  {
    title: 'Orchards & Valleys',
    description: 'Stroll through private apple orchards in Kullu and Kinnaur. Many of our premium properties offer farm-to-table dining experiences right in the heart of these lush valleys.',
    image: 'https://images.unsplash.com/photo-1596783063544-77a83d463d1a?w=800&q=80'
  }
];

const HimachalPage = () => {
  return (
    <>
      <Helmet>
        <title>Himachal Luxury Stays | Take on BNB</title>
        <meta name="description" content="Discover premium vacation rentals and properties in Himachal on Take on BNB. Book your perfect stay today." />
      </Helmet>
      <SharedDestinationLayout
        title="Luxury Stays in Himachal"
        destinationName="Himachal Pradesh"
        description="Discover majestic mountain views and alpine luxury in the heart of the Himalayas."
        overview="Himachal Pradesh is India's ultimate alpine destination, characterized by deep river valleys, dense deodar forests, and charming colonial architecture. From the vibrant cafes of Old Manali to the regal heritage of Shimla and the spiritual calm of Dharamshala, Himachal offers diverse experiences. Our carefully selected luxury homes feature cozy fireplaces, heated pools, and uninterrupted views of the majestic Himalayan peaks."
        image="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1920&q=80"
        sampleProperties={sampleProperties}
        whyVisit={whyVisit}
        highlights={['Cozy fireplaces and heated pools with valley views', 'Paragliding and adventure sports in Bir Billing', 'Heritage toy train rides and colonial walks in Shimla', 'Authentic Tibetan cultural experiences in Dharamshala', 'Apple orchard tours in the Kullu Valley']}
        bestTime="April to June for pleasant summer escapes, and December to February for magical snowy landscapes."
      />
    </>
  );
};

export default HimachalPage;