
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';

const destinations = [
  { id: 1, name: 'Dehradun', count: '850+', span: 'col-span-1 md:col-span-2 row-span-2', image: 'https://i.pinimg.com/736x/e7/cf/19/e7cf19e8f41fe01cc02ce8a7184ad3b5.jpg', path: '/destination/Dehradun' },
  { id: 2, name: 'Mussoorie', count: '1,250+', span: 'col-span-1 md:col-span-2 row-span-1', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=90&w=800', path: '/destination/Mussoorie' },
  { id: 3, name: 'Rishikesh', count: '980+', span: 'col-span-1 md:col-span-1 row-span-1', image: 'https://images.unsplash.com/photo-1609947017136-9daf32a5eb16?auto=format&fit=crop&q=90&w=600', path: '/destination/Rishikesh' },
  { id: 4, name: 'Shimla', count: '1,650+', span: 'col-span-1 md:col-span-1 row-span-1', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=90&w=600', path: '/destination/Shimla' },
  { id: 5, name: 'Goa', count: '2,450+', span: 'col-span-1 md:col-span-1 row-span-1', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=90&w=600', path: '/destination/Goa' },
  { id: 6, name: 'Jaipur', count: '1,890+', span: 'col-span-1 md:col-span-1 row-span-1', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=90&w=600', path: '/destination/Jaipur' }
];

const FeaturedDestinations = () => {
  const navigate = useNavigate();

  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: 'start',
  });

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

        <div className="overflow-hidden" ref={emblaRef}>
  <div className="flex gap-5">

    {destinations.map((dest, index) => (
      <motion.div
        key={dest.id}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        onClick={() => navigate(dest.path)}
        className="
          relative
          min-w-[280px]
          md:min-w-[350px]
          h-[320px]
          rounded-2xl
          overflow-hidden
          group
          cursor-pointer
        "
      >

        <img
          src={dest.image}
          alt={dest.name}
          className="
            w-full
            h-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-110
          "
        />

        <div className="
          absolute inset-0
          bg-gradient-to-t
          from-black/80
          via-black/20
          to-transparent
        "/>

        <div className="
          absolute bottom-0 left-0 p-6
        ">
          <h3 className="
            text-white
            text-3xl
            font-bold
          ">
            {dest.name}
          </h3>

          <p className="text-gray-300">
            {dest.count} properties
          </p>
        </div>

      </motion.div>
    ))}

  </div>
</div>