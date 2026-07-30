import React from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Building,
  Tent,
  Tractor,
  Ship,
  Palmtree,
  Building2
} from 'lucide-react';


const categories = [
  { name: 'Villas', count: '1,245', icon: Home },
  { name: 'Apartments', count: '2,156', icon: Building },
  { name: 'Cabins', count: '892', icon: Tent },
  { name: 'Farm Houses', count: '567', icon: Tractor },
  { name: 'Houseboats', count: '234', icon: Ship },
  { name: 'Cottages', count: '1,123', icon: Palmtree },
  { name: 'Luxury Stays', count: '950', icon: Building2 },
];


const PropertyCategories = () => {

  return (

    <section className="py-24 bg-muted/30 overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* Heading */}

        <div className="mb-12 text-center">

          <h2 className="relative inline-block pb-3 text-3xl md:text-4xl font-bold">

            Browse by Category

            <span className="
              absolute
              bottom-0
              left-1/4
              w-1/2
              h-1
              bg-primary
              rounded-full
            "/>

          </h2>


          <p className="text-muted-foreground mt-4">

            Find your perfect stay from our curated categories

          </p>

        </div>



        {/* Animated Slider */}

        <div className="relative">


          <motion.div

            className="flex gap-5"

            animate={{
              x: ["0%", "-50%"]
            }}

            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}

          >


            {[...categories, ...categories].map((cat, index) => {

              const Icon = cat.icon;


              return (

                <motion.div

                  key={index}

                  whileHover={{
                    y: -10,
                    scale: 1.05
                  }}

                  transition={{
                    duration: 0.3
                  }}


                  className="
                    min-w-[180px]
                    h-[190px]
                    rounded-3xl
                    bg-card
                    border
                    border-border
                    shadow-sm
                    hover:shadow-2xl
                    cursor-pointer
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-4
                    group
                  "

                >



                  <motion.div

                    whileHover={{
                      rotate: 360
                    }}

                    transition={{
                      duration: 0.6
                    }}


                    className="
                      p-4
                      rounded-full
                      bg-muted
                      group-hover:bg-primary
                      transition-all
                    "

                  >

                    <Icon

                      className="
                        w-9
                        h-9
                        text-foreground
                        group-hover:text-white
                        transition-colors
                      "

                      strokeWidth={1.5}

                    />


                  </motion.div>




                  <div className="text-center">


                    <h3 className="
                      font-semibold
                      text-base
                      group-hover:text-primary
                      transition
                    ">

                      {cat.name}

                    </h3>



                    <p className="
                      text-xs
                      text-muted-foreground
                      mt-1
                    ">

                      {cat.count} properties

                    </p>


                  </div>



                </motion.div>

              );

            })}


          </motion.div>


        </div>


      </div>


    </section>

  );

};


export default PropertyCategories;