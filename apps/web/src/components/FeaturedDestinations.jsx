import React from "react";
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
    image:
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=900&q=80",
    path: "/destination/Dehradun",
  },
  {
    id: 2,
    name: "Mussoorie",
    count: "1,250+",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80",
    path: "/destination/Mussoorie",
  },
  {
    id: 3,
    name: "Rishikesh",
    count: "980+",
    image:
      "https://images.unsplash.com/photo-1609947017136-9daf32a5eb16?auto=format&fit=crop&w=900&q=80",
    path: "/destination/Rishikesh",
  },
  {
    id: 4,
    name: "Shimla",
    count: "1,650+",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
    path: "/destination/Shimla",
  },
  {
    id: 5,
    name: "Goa",
    count: "2,450+",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80",
    path: "/destination/Goa",
  },
  {
    id: 6,
    name: "Jaipur",
    count: "1,890+",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80",
    path: "/destination/Jaipur",
  },
];


const FeaturedDestinations = () => {

  const navigate = useNavigate();


  const autoplay = Autoplay({
    delay: 3000,
    stopOnInteraction: false,
  });


  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
    },
    [autoplay]
  );


  return (

    <section className="py-24 bg-muted/30">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        <div className="mb-10">

          <h2 className="text-3xl md:text-4xl font-bold">
            Top Destinations in India
          </h2>

          <p className="text-muted-foreground mt-3">
            Explore amazing places and stay experiences.
          </p>

        </div>



        <div className="relative">


          <div 
            className="overflow-hidden"
            ref={emblaRef}
          >


            <div className="flex gap-5">


              {destinations.map((dest,index)=>(

                <motion.div

                  key={dest.id}

                  whileHover={{
                    scale:1.03
                  }}

                  transition={{
                    duration:0.3
                  }}

                  onClick={() =>
                    navigate(dest.path)
                  }


                  className="
                  flex-[0_0_85%]
                  sm:flex-[0_0_45%]
                  lg:flex-[0_0_32%]
                  h-[330px]
                  relative
                  rounded-3xl
                  overflow-hidden
                  cursor-pointer
                  group
                  "

                >


                  <img

                    src={dest.image}

                    alt={dest.name}

                    className="
                    w-full
                    h-full
                    object-cover
                    transition duration-700
                    group-hover:scale-110
                    "

                  />



                  <div
                    className="
                    absolute inset-0
                    bg-gradient-to-t
                    from-black/80
                    via-black/20
                    to-transparent
                    "
                  />



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


                    <p className="
                    text-gray-200
                    mt-1
                    ">

                      {dest.count} properties

                    </p>


                  </div>



                </motion.div>


              ))}


            </div>


          </div>




          <button

            onClick={() => emblaApi?.scrollPrev()}

            className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            bg-white
            shadow-lg
            rounded-full
            w-12
            h-12
            flex
            items-center
            justify-center
            hover:bg-primary
            hover:text-white
            "

          >

            <ChevronLeft />

          </button>



          <button

            onClick={() => emblaApi?.scrollNext()}

            className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            bg-white
            shadow-lg
            rounded-full
            w-12
            h-12
            flex
            items-center
            justify-center
            hover:bg-primary
            hover:text-white
            "

          >

            <ChevronRight />

          </button>



        </div>


      </div>

    </section>

  );

};


export default FeaturedDestinations;