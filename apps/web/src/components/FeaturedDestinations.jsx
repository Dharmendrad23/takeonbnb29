import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import api from "@/lib/api.js";

const destinations = [
  {
    id: 1,
    name: "Dehradun",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Guru_Ram_Rai_Darbar_Sahib,_Dehradun.jpg?width=1200",
    path: "/destination/dehradun",
  },
  {
    id: 2,
    name: "Mussoorie",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Panoramic_view_of_Mussoorie,_Uttarakhand.jpg?width=1200",
    path: "/destination/mussoorie",
  },
  {
    id: 3,
    name: "Rishikesh",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Scenic_View_of_Rishikesh_with_Ganga_River_and_Hills_in_Background.jpg?width=1200",
    path: "/destination/rishikesh",
  },
  {
    id: 4,
    name: "Nainital",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Naini_Lake_Nainital.jpg?width=1200",
    path: "/destination/nainital",
  },
  {
    id: 5,
    name: "Goa",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Goa_beautiful_beach.JPG?width=1200",
    path: "/destination/goa",
  },
  {
    id: 6,
    name: "Jaipur",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Hawa_Mahal_2011.jpg?width=1200",
    path: "/destination/jaipur",
  },
  {
    id: 7,
    name: "Manali",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Manali_Himachal_India_(17).JPG?width=1200",
    path: "/destination/manali",
  },
];

const FeaturedDestinations = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProperties = async () => {
      try {
        const response = await api.get("/properties");

        if (isMounted) {
          setProperties(
            Array.isArray(response.data) ? response.data : []
          );
        }
      } catch (error) {
        console.error(
          "Failed to load featured destination properties:",
          error
        );

        if (isMounted) {
          setProperties([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProperties();

    return () => {
      isMounted = false;
    };
  }, []);

  const propertyCounts = useMemo(() => {
    const counts = {};

    properties.forEach((property) => {
      const location = String(property?.location || "")
        .trim()
        .toLowerCase();

      if (!location) return;

      counts[location] = (counts[location] || 0) + 1;
    });

    return counts;
  }, [properties]);

  const getPropertyCount = (destination) => {
    if (isLoading) {
      return "Loading...";
    }

    const count =
      propertyCounts[destination.toLowerCase()] || 0;

    return `${count}+`;
  };

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
                  alt={`${dest.name} destination`}
                  loading={index < 4 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={index === 0 ? "high" : "auto"}
                  width={500}
                  height={340}
                  className="h-[340px] w-full object-cover transition-all duration-700 hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-5 left-5">
                  <h3 className="text-white text-2xl font-bold">
                    {dest.name}
                  </h3>

                  <p className="text-white/80">
                    {getPropertyCount(dest.name)} Properties
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