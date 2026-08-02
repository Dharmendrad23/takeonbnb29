import React from 'react';
import { Helmet } from 'react-helmet';
import SharedDestinationLayout from '@/components/SharedDestinationLayout.jsx';

const sampleProperties = [
  { id: 'up-1', title: 'Heritage Boutique Stay Agra', pricePerNight: 12500, rating: 4.8, bedrooms: 3, guests: 6, location: 'Agra, UP', photos: [], _staticImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', description: 'Serene luxury villa located close to the major monuments with Taj views.' },
  { id: 'up-2', title: 'Awadhi Estate Lucknow', pricePerNight: 10500, rating: 4.7, bedrooms: 4, guests: 8, location: 'Lucknow, UP', photos: [], _staticImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', description: 'Experience Nawabi royalty in this carefully restored heritage estate.' },
  { id: 'up-3', title: 'Ghat-view Villa Varanasi', pricePerNight: 9500, rating: 4.6, bedrooms: 2, guests: 4, location: 'Varanasi, UP', photos: [], _staticImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80', description: 'Premium stay overlooking the spiritual Ganges river.' },
];

const whyVisit = [
  {
    title: 'Architectural Marvels',
    description: 'Home to the iconic Taj Mahal, Uttar Pradesh boasts an incredible array of Mughal and colonial architecture. Our stays put you right in the heart of history.',
    image: 'https://images.unsplash.com/photo-1564507592208-0270e9323171?w=800&q=80'
  },
  {
    title: 'Spiritual Awakening',
    description: 'Experience the profound spirituality of Varanasi and Vrindavan. Stay in comfortable luxury while exploring ancient ghats and mesmerizing evening Aartis.',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80'
  },
  {
    title: 'Nawabi Elegance',
    description: 'Lucknow offers a deep dive into Awadhi culture, famous for its courtly manners, intricate embroidery (Chikankari), and extraordinary culinary legacy.',
    image: 'https://images.unsplash.com/photo-1684990214842-a5b1c8761a4e?w=800&q=80'
  }
];

const UttarPradeshPage = () => {
  return (
    <>
      <Helmet>
        <title>Uttar Pradesh Luxury Stays | Take on BNB</title>
        <meta name="description" content="Discover premium vacation rentals and properties in Uttar Pradesh on Take on BNB. Book your perfect stay today." />
      </Helmet>
      <SharedDestinationLayout
        title="Heritage Stays in Uttar Pradesh"
        destinationName="Uttar Pradesh"
        description="Experience the spiritual and cultural heartland of India from the comfort of premium estates."
        overview="Uttar Pradesh is the cultural and spiritual heartland of India. It is a land of vivid contrasts, housing the timeless romance of the Taj Mahal in Agra, the deep mysticism of the ghats in Varanasi, and the refined Nawabi elegance of Lucknow. Our luxury properties here blend rich regional heritage with modern comforts, offering private havelis, boutique ghat-side villas, and sprawling estates that let you experience the state's grandeur in absolute peace."
        image="https://images.unsplash.com/photo-1564507592208-0270e9323171?w=1920&q=80"
        sampleProperties={sampleProperties}
        whyVisit={whyVisit}
        highlights={['Private guided tours of the Taj Mahal and Fatehpur Sikri', 'Exclusive boat rides and Ganga Aarti viewing in Varanasi', 'Heritage stays showcasing authentic Awadhi architecture', 'Curated culinary tours focusing on famous Lucknowi kebabs', 'Spiritual tranquility in luxury settings near Vrindavan']}
        bestTime="October to March when the weather is cool and perfect for sightseeing."
      />
    </>
  );
};

export default UttarPradeshPage;