import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const destinations = [
  {
    id: 1,
    name: 'Dehradun',
    count: '40+',
    span: 'col-span-1 md:col-span-2 row-span-2',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990f1e?auto=format&fit=crop&q=80&w=1200',
    path: '/destination/dehradun'
  },
  {
    id: 2,
    name: 'Mussoorie',
    count: '50+',
    span: 'col-span-1 md:col-span-2 row-span-1',
    image: 'https://images.unsplash.com/photo-1622037022824-0c71d511ad76?auto=format&fit=crop&q=80&w=1200',
    path: '/destination/mussoorie'
  },
  {
    id: 3,
    name: 'Rishikesh',
    count: '20+',
    span: 'col-span-1 md:col-span-1 row-span-1',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=1200',
    path: '/destination/rishikesh'
  },
  {
    id: 4,
    name: 'Nainital',
    count: '60+',
    span: 'col-span-1 md:col-span-1 row-span-1',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=1200',
    path: '/destination/nainital'
  },
  {
    id: 5,
    name: 'Goa',
    count: '20+',
    span: 'col-span-1 md:col-span-1 row-span-1',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1200',
    path: '/destination/goa'
  },
  {
    id: 6,
    name: 'Jaipur',
    count: '18+',
    span: 'col-span-1 md:col-span-1 row-span-1',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=1200',
    path: '/destination/jaipur'
  },
  {
    id: 7,
    name: 'Kerala',
    count: '20+',
    span: 'col-span-1 md:col-span-1 row-span-1',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1200',
    path: '/destination/kerala'
  },
  {
    id: 8,
    name: 'Manali',
    count: '65+',
    span: 'col-span-1 md:col-span-1 row-span-1',
    image: 'https://images.unsplash.com/photo-1518526394840-1478aa7da9ef?auto=format&fit=crop&q=80&w=1200',
    path: '/destination/manali'
  },
  {
    id: 9,
    name: 'Udaipur',
    count: '30+',
    span: 'col-span-1 md:col-span-1 row-span-1',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1200',
    path: '/destination/udaipur'
  },
  {
    id: 10,
    name: 'Darjeeling',
    count: '18+',
    span: 'col-span-1 md:col-span-1 row-span-1',
    image: 'https://images.unsplash.com/photo-1544634076-a90160ddf22e?auto=format&fit=crop&q=80&w=1200',
    path: '/destination/darjeeling'
  }
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
          autoplay={{ delay: 2800, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
        >
          {destinations.map((dest, index) => (
            <SwiperSlide key={dest.id}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                onClick={() => navigate(dest.path)}
                className="relative overflow-hidden rounded-3xl cursor-pointer shadow-xl"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  loading={index < 4 ? "eager" : "lazy"}
                  decoding="async"
                  fetchpriority={index === 0 ? "high" : "auto"}
                  width={500}
                  height={340}
                  className="h-[340px] w-full object-cover transition-all duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <h3 className="text-white text-2xl font-bold">{dest.name}</h3>
                  <p className="text-white/80">{dest.count} Properties</p>
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