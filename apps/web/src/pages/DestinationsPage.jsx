import React from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const destinations = [
  {
    name: "Dehradun",
    region: "Uttarakhand",
    count: "15+ Properties",
    path: "/destination/dehradun",
    image:
      "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787856917/Dehradun.jpg",
  },
  {
    name: "Mussoorie",
    region: "Uttarakhand",
    count: "20+ Properties",
    path: "/destination/mussoorie",
    image:
      "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787857117/musoore.jpg",
  },
  {
    name: "Rishikesh",
    region: "Uttarakhand",
    count: "20+ Properties",
    path: "/destination/rishikesh",
    image:
      "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787857116/Riishkesh.jpg",
  },
  {
    name: "Nainital",
    region: "Uttarakhand",
    count: "10+ Properties",
    path: "/destination/nainital",
    image:
      "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787857115/Nanital.jpg",
  },
  {
    name: "Goa",
    region: "India",
    count: "20+ Properties",
    path: "/destination/goa",
    image:
      "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787857116/Goa.jpg",
  },
  {
    name: "Jaipur",
    region: "Rajasthan",
    count: "18+ Properties",
    path: "/destination/jaipur",
    image:
      "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787857116/Jaipur.jpg",
  },
  {
    name: "Manali",
    region: "Himachal Pradesh",
    count: "65+ Properties",
    path: "/destination/manali",
    image:
      "https://res.cloudinary.com/bfmmvn4z/image/upload/v1787857310/MAnali.jpg",
  },
];

const DestinationsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Helmet>
        <title>Explore Destinations | TakeOnBNB</title>
        <meta
          name="description"
          content="Explore beautiful destinations and discover unique stays with TakeOnBNB."
        />
      </Helmet>

      {/* Hero */}
      <section className="pt-28 pb-12 bg-[#FFF8F2] border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <div className="inline-flex items-center gap-3 mb-5">
            <span className="w-8 h-px bg-[#F97316]" />

            <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#F97316]">
              EXPLORE â€¢ SWAP â€¢ STAY
            </span>

            <span className="w-8 h-px bg-[#F97316]" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight">
            Where will you{" "}
            <span className="text-[#F97316]">stay next?</span>
          </h1>

          <p className="max-w-2xl mx-auto mt-5 text-gray-500 text-base sm:text-lg">
            Explore beautiful destinations, discover unique properties
            and swap your stay with TakeOnBNB.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-white rounded-full p-2 shadow-[0_10px_35px_rgba(0,0,0,0.10)] border border-gray-100 flex items-center">

              <div className="flex-1 flex items-center gap-3 px-5 text-left">
                <svg
                  className="w-5 h-5 text-[#F97316]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>

                <span className="text-sm text-gray-400">
                  Search destinations
                </span>
              </div>

              <button
                type="button"
                className="bg-[#F97316] hover:bg-[#EA580C] text-white rounded-full px-6 py-3 font-semibold text-sm transition"
              >
                Search
              </button>

            </div>
          </div>
        </div>
      </section>

      {/* Property Swap Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        <div className="rounded-[28px] bg-[#171717] text-white overflow-hidden">
          <div className="p-7 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-7">

            <div>
              <div className="flex items-center gap-2 text-[#F97316] text-xs font-bold tracking-[0.2em] uppercase">
                <span>â†”</span>
                Property Swap
              </div>

              <h2 className="mt-3 text-2xl sm:text-3xl font-semibold">
                Your home can take you somewhere new.
              </h2>

              <p className="mt-2 text-gray-400 max-w-xl">
                Swap your property with another host and experience
                a completely new destination.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/property-swap")}
              className="shrink-0 bg-[#F97316] hover:bg-[#EA580C] px-6 py-3 rounded-full font-semibold transition"
            >
              Explore Property Swap â†’
            </button>

          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F97316]">
            CHOOSE YOUR ESCAPE
          </p>

          <h2 className="mt-2 text-3xl sm:text-4xl font-semibold">
            Popular destinations
          </h2>

          <p className="mt-2 text-gray-500">
            Find your next stay across India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

          {destinations.map((destination) => (
            <article
              key={destination.name}
              onClick={() => navigate(destination.path)}
              className="group relative h-[360px] rounded-[25px] overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >

              <img
                src={destination.image}
                alt={destination.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {/* Swap */}
              <div className="absolute top-4 left-4">
                <span className="bg-[#F97316] text-white text-[10px] font-bold tracking-wide px-3 py-1.5 rounded-full">
                  â†” SWAP AVAILABLE
                </span>
              </div>

              {/* Heart */}
              <button
                type="button"
                onClick={(event) => event.stopPropagation()}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:text-[#F97316]"
                aria-label={`Save ${destination.name}`}
              >
                â™¡
              </button>

              {/* Content */}
              <div className="absolute bottom-5 left-5 right-5 text-white">

                <p className="text-xs text-white/70 uppercase tracking-wider">
                  {destination.region}
                </p>

                <div className="flex items-end justify-between gap-3 mt-1">

                  <div>
                    <h3 className="text-2xl font-semibold">
                      {destination.name}
                    </h3>

                    <p className="text-sm text-white/75 mt-1">
                      {destination.count}
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-full bg-white text-[#F97316] flex items-center justify-center text-xl">
                    â†’
                  </div>

                </div>

              </div>

            </article>
          ))}

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#FFF8F2] border-t border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">

          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#F97316]">
            TAKEONBNB
          </p>

          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold">
            Stay somewhere unforgettable.
          </h2>

          <p className="mt-3 text-gray-500">
            Discover. Swap. Stay. Repeat.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-6 bg-[#F97316] hover:bg-[#EA580C] text-white px-7 py-3.5 rounded-full font-semibold transition"
          >
            Start exploring
          </button>

        </div>
      </section>
    </div>
  );
};

export default DestinationsPage;
