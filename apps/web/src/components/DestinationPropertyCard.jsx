import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, BedDouble, ArrowRight, MapPin } from 'lucide-react';

const DestinationPropertyCard = ({ property }) => {
  return (
    <Link to={`/properties/${property.id}`} className="group block h-full">
      <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-luxury transition-smooth h-full flex flex-col border border-border">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={property.image} 
            alt={property.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 text-sm font-medium shadow-sm text-black">
            <Star className="w-3.5 h-3.5 fill-[#C8A96B] text-[#C8A96B]" />
            {property.rating}
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" /> {property.location}
          </div>
          <h3 className="font-serif text-xl font-semibold mb-2 group-hover:text-accent transition-colors line-clamp-1">{property.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
            {property.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5"><BedDouble className="w-4 h-4" /> {property.bedrooms} Beds</div>
            <div className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {property.guests} Guests</div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
            <div className="flex items-baseline gap-1">
              <span className="font-semibold text-lg text-foreground">₹{property.price.toLocaleString('en-IN')}</span>
              <span className="text-sm text-muted-foreground">/ night</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-accent group-hover:text-primary transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DestinationPropertyCard;