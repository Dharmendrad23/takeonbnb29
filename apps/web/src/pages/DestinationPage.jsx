
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import api from '@/lib/api';
import PropertyGrid from '@/components/PropertyGrid.jsx';

const DestinationPage = () => {
  const { location } = useParams();
  const formattedLocation = location ? location.charAt(0).toUpperCase() + location.slice(1) : 'Destination';
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinationProperties = async () => {
      try {
        setLoading(true);
        const records = await pb.collection('properties').getList(1, 20, {
          filter: `location ~ "${formattedLocation}" && status="Live"`,
          sort: '-created',
          $autoCancel: false
        });
        
        if (records.items.length > 0) {
          setProperties(records.items);
        } else {
          // Provide 4 sample placeholders if none exist
          const samples = Array.from({length: 4}).map((_, i) => ({
            id: `sample-${i}`,
            title: `Luxury Stay - ${formattedLocation}`,
            location: formattedLocation,
            pricePerNight: 5000 + (i * 2000),
            rating: 4.5 + (i * 0.1),
            guests: 4,
            isSample: true,
            image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800'
          }));
          setProperties(samples);
        }
      } catch (err) {
        console.error('Error fetching destination properties:', err);
        setError(`Failed to load properties for ${formattedLocation}.`);
      } finally {
        setLoading(false);
      }
    };

    if (location) {
      fetchDestinationProperties();
    }
  }, [location, formattedLocation]);

  return (
    <div className="min-h-screen bg-background pt-28 pb-12 animate-in fade-in">
      <Helmet>
        <title>{`Stays in ${formattedLocation} | TakeOn BnB`}</title>
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
          Discover {formattedLocation}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Explore our exclusive collection of luxury stays and experiences in {formattedLocation}.
        </p>
      </div>

      <PropertyGrid 
        properties={properties} 
        isLoading={loading}
        error={error}
      />
    </div>
  );
};

export default DestinationPage;
