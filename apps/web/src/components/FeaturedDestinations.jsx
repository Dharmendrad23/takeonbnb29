
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
      <Swiper
  modules={[Autoplay, Navigation, Pagination]}
  spaceBetween={20}
  slidesPerView={1}
  loop={true}
  speed={900}
  autoplay={{
    delay: 2800,
    disableOnInteraction: false,
  }}
  navigation
  pagination={{ clickable: true }}
  breakpoints={{
    640: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 4,
    },
  }}
>
  {destinations.map((dest) => (
    <SwiperSlide key={dest.id}>
      <motion.div
        whileHover={{
          scale: 1.05,
        }}
        transition={{
          duration: 0.4,
        }}
        onClick={() => navigate(dest.path)}
        className="relative overflow-hidden rounded-3xl cursor-pointer shadow-xl"
      >
        <img
          src={dest.image}
          alt={dest.name}
          className="h-[340px] w-full object-cover transition-all duration-700 hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute bottom-5 left-5">
          <h3 className="text-white text-2xl font-bold">
            {dest.name}
          </h3>

          <p className="text-white/80">
            {dest.count} Properties
          </p>
        </div>
      </motion.div>
    </SwiperSlide>
  ))}
</Swiper>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
