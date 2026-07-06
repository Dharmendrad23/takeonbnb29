import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

const DestinationCard = ({ name, count, image, link }) => {
  return (
    <Link to={link} className="block group relative h-[400px] w-full rounded-2xl overflow-hidden cursor-pointer shadow-luxury">
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 z-10" />
      <img 
        src={image} 
        alt={`Properties in ${name}`} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F]/90 via-[#0F0F0F]/40 to-transparent z-20" />
      
      <div className="absolute bottom-0 left-0 w-full p-8 z-30 flex flex-col justify-end transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
        <div className="flex items-center gap-2 text-[#C8A96B] font-medium text-sm tracking-wider uppercase mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          <MapPin className="w-4 h-4" />
          <span>{count} Luxury Stays</span>
        </div>
        <h3 className="font-serif text-3xl font-bold text-[#F5F2EC] mb-2 group-hover:text-[#C8A96B] transition-colors duration-300">
          {name}
        </h3>
        <div className="flex items-center gap-2 text-[#F5F2EC] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
          <span className="text-sm font-medium">Explore Collection</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;