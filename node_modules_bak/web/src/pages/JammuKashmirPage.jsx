import React from 'react';
import { Helmet } from 'react-helmet';
import SharedDestinationLayout from '@/components/SharedDestinationLayout.jsx';

const sampleProperties = [
  { id: 'jk-1', title: 'Luxury Houseboat Srinagar', pricePerNight: 14000, rating: 4.9, bedrooms: 2, guests: 4, location: 'Srinagar, J&K', photos: [], _staticImage: 'https://images.unsplash.com/photo-1548625361-b51c11032a15?w=800&q=80', description: 'Experience the magic of Dal Lake in a beautifully carved cedar houseboat.' },
  { id: 'jk-2', title: 'Premium Villa Gulmarg', pricePerNight: 16000, rating: 4.8, bedrooms: 3, guests: 6, location: 'Gulmarg, J&K', photos: [], _staticImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', description: 'Elegant ski-in/ski-out villa offering stunning views of the snow peaks.' },
  { id: 'jk-3', title: 'Mountain Retreat Pahalgam', pricePerNight: 12000, rating: 4.7, bedrooms: 3, guests: 6, location: 'Pahalgam, J&K', photos: [], _staticImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', description: 'Peaceful mountain retreat surrounded by apple orchards and pine trees.' },
];

const whyVisit = [
  {
    title: 'Paradise on Earth',
    description: 'Kashmir\'s beauty is legendary. With pristine lakes, blooming Mughal gardens, and majestic snow-capped peaks, it provides a breathtaking backdrop for luxury stays.',
    image: 'https://images.unsplash.com/photo-1651387232922-17a2758e11b4?w=800&q=80'
  },
  {
    title: 'Heritage Houseboats',
    description: 'Experience a unique blend of colonial charm and Kashmiri craftsmanship aboard premium, fully-serviced luxury houseboats anchored on the tranquil Dal and Nigeen lakes.',
    image: 'https://images.unsplash.com/photo-1548625361-b51c11032a15?w=800&q=80'
  },
  {
    title: 'World-Class Winter Sports',
    description: 'Gulmarg is Asia\'s premier ski destination. Our winter chalets provide cozy warmth, heated floors, and immediate access to pristine snowy slopes.',
    image: 'https://images.unsplash.com/photo-1579282240050-3529805862ea?w=800&q=80'
  }
];

const JammuKashmirPage = () => {
  return (
    <>
      <Helmet>
        <title>Jammu & Kashmir Luxury Stays | Take on BNB</title>
        <meta name="description" content="Discover premium vacation rentals and properties in Jammu & Kashmir on Take on BNB. Book your perfect stay today." />
      </Helmet>
      <SharedDestinationLayout
        title="Luxury Retreats in Kashmir"
        destinationName="Jammu & Kashmir"
        description="Paradise on earth awaits with our curated selection of luxury houseboats and mountain villas."
        overview="Often described as heaven on earth, Jammu and Kashmir is a region of breathtaking vistas, from the tranquil waters of Dal Lake to the snow-powdered slopes of Gulmarg. The luxury experience here is deeply rooted in local artistry and warmth. Unwind in intricately carved walnut-wood houseboats, enjoy the famed Kashmiri 'Wazwan', and stay in private mountain estates that offer panoramic views of the Pir Panjal range."
        image="https://images.unsplash.com/photo-1651387232922-17a2758e11b4?w=1920&q=80"
        sampleProperties={sampleProperties}
        whyVisit={whyVisit}
        highlights={['Stays in premium, intricately carved heritage houseboats', 'World-class skiing and winter sports in Gulmarg', 'Scenic Shikara rides at sunset on Dal Lake', 'Visits to sprawling saffron fields and apple orchards', 'Private dining experiences featuring authentic Kashmiri Wazwan']}
        bestTime="March to May for spring blooms, or December to February for winter sports."
      />
    </>
  );
};

export default JammuKashmirPage;