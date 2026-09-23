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
    name: "Dehradun",
    count: "15+",
    image:
      "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787856917/Dehradun.jpg",
    path: "/destination/dehradun",
  },
  {
    id: 2,
    name: "Mussoorie",
    count: "20+",
    image:
      "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787857117/musoore.jpg",
    path: "/destination/mussoorie",
  },
  {
    id: 3,
    name: "Rishikesh",
    count: "20+",
    image:
      "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787857116/Riishkesh.jpg",
    path: "/destination/rishikesh",
  },
  {
    id: 4,
    name: "Nainital",
    count: "10+",
    image:
      "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787857115/Nanital.jpg",
    path: "/destination/nainital",
  },
  {
    id: 5,
    name: "Goa",
    count: "20+",
    image:
      "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787857116/Goa.jpg",
    path: "/destination/goa",
  },
  {
    id: 6,
    name: "Jaipur",
    count: "18+",
    image:
      "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787857116/Jaipur.jpg",
    path: "/destination/jaipur",
  },
  {
    id: 7,
    name: "Manali",
    count: "65+",
    image:
      "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787857310/MAnali.jpg",
    path: "/destination/manali",
  },
];

const FeaturedDestinations = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#F97316] mb-2">
              EXPLORE &bull; SWAP &bull; STAY
            </p>

            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
              Popular destinations
            </h2>

            <p className="mt-2 text-sm sm:text-base text-gray-500">
              Discover places to stay, swap and explore.
            </p>
          </div>

          <button
            onClick={() => navigate("/destinations")}
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-[#F97316]"
          >
            See all
            <span className="text-lg">&rarr;</span>
          </button>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={18}
          slidesPerView={1.15}
          loop
          speed={700}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          navigation
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            480: {
              slidesPerView: 1.4,
            },
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          className="pb-10"
        >
          {destinations.map((destination, index) => (
            <SwiperSlide key={destination.id}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.25 }}
                onClick={() => navigate(destination.path)}
                className="relative h-[360px] sm:h-[390px] overflow-hidden rounded-[26px] cursor-pointer bg-gray-100 shadow-md hover:shadow-xl transition-shadow"
              >
                {/* Image */}
                <img
                  src={destination.image}
                  alt={destination.name}
                  width="600"
                  height="800"
                  loading={index < 4 ? "eager" : "lazy"}
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />

                {/* Dark gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Top controls */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">

                  <span className="rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-gray-800 backdrop-blur">India</span>

                  <button
                    type="button"
                    onClick={(event) => event.stopPropagation()}
                    className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-gray-800 hover:text-[#F97316]"
                    aria-label={`Save ${destination.name}`}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M20.8 8.7c0 5.5-8.8 10.4-8.8 10.4S3.2 14.2 3.2 8.7A5 5 0 018.3 4c1.5 0 2.9.7 3.7 1.8A4.7 4.7 0 0115.7 4a5 5 0 015.1 4.7z" />
                    </svg>
                  </button>
                </div>

                {/* Property Swap badge */}
                <div className="absolute top-[72px] left-4">
                  <span className="rounded-full bg-[#F97316] px-3 py-1.5 text-[10px] font-bold tracking-wide text-white shadow-lg">&harr; PROPERTY SWAP</span>
                </div>

                {/* Content */}
                <div className="absolute left-5 right-5 bottom-5 text-white">

                  <div className="flex items-end justify-between gap-3">

                    <div>
                      <h3 className="text-2xl sm:text-3xl font-semibold">
                        {destination.name}
                      </h3>

                      <p className="mt-1 text-sm text-white/80">
                        {destination.count} Properties
                      </p>
                    </div>

                    <div className="w-11 h-11 rounded-full bg-white text-[#F97316] flex items-center justify-center shrink-0">
                      <span className="text-xl">&gt;</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/20 flex justify-between">
                    <span className="text-xs text-white/70">
                      Stay &bull; Swap &bull; Explore
                    </span>

                    <span className="text-xs font-semibold">
                      Explore
                    </span>
                  </div>
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




