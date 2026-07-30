
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const destinations = [
  { id: 1, name: 'Goa', count: '2,450+', span: 'col-span-1 md:col-span-2 row-span-2', image: 'https://images.unsplash.com/photo-1676972382977-50d1be95d6da?auto=format&fit=crop&q=80&w=800', path: '/destination/Goa' },
  { id: 2, name: 'Jaipur', count: '1,890+', span: 'col-span-1 md:col-span-2 row-span-1', image: 'https://images.unsplash.com/photo-1617516203158-1b87bb39caa7?auto=format&fit=crop&q=80&w=800', path: '/destination/Jaipur' },
  { id: 3, name: 'Kerala', count: '3,120+', span: 'col-span-1 md:col-span-1 row-span-1', image: 'https://images.unsplash.com/photo-1459100652174-45f3b5ca9d04?auto=format&fit=crop&q=80&w=600', path: '/destination/Kerala' },
  { id: 4, name: 'Manali', count: '1,650+', span: 'col-span-1 md:col-span-1 row-span-1', image: 'https://images.unsplash.com/photo-1518526394840-1478aa7da9ef?auto=format&fit=crop&q=80&w=600', path: '/destination/Manali' },
  { id: 5, name: 'Udaipur', count: '1,420+', span: 'col-span-1 md:col-span-1 row-span-1', image: 'https://images.unsplash.com/photo-1504705759706-c5ee7158f8bb?auto=format&fit=crop&q=80&w=600', path: '/destination/Udaipur' },
  { id: 6, name: 'Darjeeling', count: '980+', span: 'col-span-1 md:col-span-1 row-span-1', image: 'https://images.unsplash.com/photo-1667404838370-223748e74703?auto=format&fit=crop&q=80&w=600', path: '/destination/Darjeeling' }
];

const FeaturedDestinations = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="relative inline-block pb-2 text-3xl md:text-4xl font-bold tracking-tight">
            Top Destinations in India
            <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-primary rounded-full"></span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg max-w-2xl">
            Explore our most popular locations for your next unforgettable journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[250px]">
          {destinations.map((dest, index) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              onClick={() => navigate(dest.path)}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer ${dest.span}`}
            >
              <img 
                src={dest.image} 
                alt={`${dest.name} destination showcasing local scenery`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white font-heading text-2xl md:text-3xl font-bold mb-1">{dest.name}</h3>
                <p className="text-gray-300 font-medium text-sm">{dest.count} properties</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
