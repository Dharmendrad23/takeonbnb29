import React, { useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

const destinations = [
  {
    id: 1,
    name: "Dehradun",
    count: "850+",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=900&q=80",
    path: "/destination/Dehradun",
  },
  {
    id: 2,
    name: "Mussoorie",
    count: "1,250+",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80",
    path: "/destination/Mussoorie",
  },
  {
    id: 3,
    name: "Rishikesh",
    count: "980+",
    image: "https://images.unsplash.com/photo-1609947017136-9daf32a5eb16?auto=format&fit=crop&w=900&q=80",
    path: "/destination/Rishikesh",
  },
  {
    id: 4,
    name: "Shimla",
    count: "1,650+",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
    path: "/destination/Shimla",
  },
  {
    id: 5,
    name: "Goa",
    count: "2,450+",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80",
    path: "/destination/Goa",
  },
  {
    id: 6,
    name: "Jaipur",
    count: "1,890+",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80",
    path: "/destination/Jaipur",
  },
  {
    id: 7,
    name: "Kerala",
    count: "1,320+",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80",
    path: "/destination/Kerala",
  },
  {
    id: 8,
    name: "Manali",
    count: "760+",
    image: "https://images.unsplash.com/photo-1626714208912-fad5918bad50?auto=format&fit=crop&w=900&q=80",
    path: "/destination/Manali",
  },
];

const cardVariants = {
  initial: { opacity: 0, y: 24 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 18,
      delay: i * 0.07,
    },
  }),
};

const FeaturedDestinations = () => {
  const navigate = useNavigate();
  const autoplayRef = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: false },
    [autoplayRef.current]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const handleMouseEnter = useCallback(() => {
    autoplayRef.current?.stop();
  }, []);

  const handleMouseLeave = useCallback(() => {
    autoplayRef.current?.play();
  }, []);

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Top Destinations in India
            </h2>
            <p className="text-muted-foreground mt-3">
              Explore amazing places and stay experiences.
            </p>
          </div>
          {/* Prev / Next buttons — top-right on desktop */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={scrollPrev}
              aria-label="Previous"
              className="bg-white shadow-md rounded-full w-11 h-11 flex items-center justify-center border border-border hover:bg-primary hover:text-white transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next"
              className="bg-white shadow-md rounded-full w-11 h-11 flex items-center justify-center border border-border hover:bg-primary hover:text-white transition-colors duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          className="overflow-hidden"
          ref={emblaRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex gap-4">
            {destinations.map((dest, index) => (
              <motion.div
                key={dest.id}
                custom={index}
                variants={cardVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{
                  scale: 1.03,
                  transition: { type: "spring", stiffness: 300, damping: 20 },
                }}
                onClick={() => navigate(dest.path)}
                className="
                  flex-[0_0_90%]
                  sm:flex-[0_0_48%]
                  lg:flex-[0_0_23.5%]
                  h-[340px]
                  relative
                  rounded-[24px]
                  overflow-hidden
                  cursor-pointer
                  group
                  shadow-[0_8px_30px_rgba(0,0,0,0.15)]
                  hover:shadow-[0_16px_48px_rgba(0,0,0,0.25)]
                  transition-shadow
                  duration-300
                "
              >
                {/* Image with zoom on hover */}
                <img
                  src={dest.image}
                  alt={dest.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                {/* Text */}
                <div className="absolute bottom-0 left-0 p-6 z-10">
                  <h3 className="text-white text-2xl font-bold leading-tight drop-shadow-sm">
                    {dest.name}
                  </h3>
                  <p className="text-gray-200 text-sm mt-1 drop-shadow-sm">
                    {dest.count} properties
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile prev/next */}
        <div className="flex md:hidden justify-center gap-4 mt-6">
          <button
            onClick={scrollPrev}
            aria-label="Previous"
            className="bg-white shadow-md rounded-full w-11 h-11 flex items-center justify-center border border-border hover:bg-primary hover:text-white transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next"
            className="bg-white shadow-md rounded-full w-11 h-11 flex items-center justify-center border border-border hover:bg-primary hover:text-white transition-colors duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
