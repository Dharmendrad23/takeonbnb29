import React from 'react';
import { motion } from 'framer-motion';
import { BedDouble, Bath, Users, DollarSign, Check, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import pb from '@/lib/pocketbaseClient.js';
import { formatCurrency } from '@/lib/bookingUtils.js';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const PropertyDetailCard = ({ property, host, amenities, reviewStats }) => {
  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-12"
    >
      {/* Color Coded Info Cards */}
      <motion.div variants={fadeUpItem} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Bedrooms - Blue */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-transform hover:scale-105 duration-300">
          <BedDouble className="w-8 h-8 text-blue-500 mb-2" />
          <span className="font-bold text-foreground">{property.bedrooms || '1'}</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Bedrooms</span>
        </div>
        
        {/* Bathrooms - Green */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-transform hover:scale-105 duration-300">
          <Bath className="w-8 h-8 text-emerald-500 mb-2" />
          <span className="font-bold text-foreground">{property.bathrooms || '1'}</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Bathrooms</span>
        </div>
        
        {/* Guests - Purple */}
        <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-transform hover:scale-105 duration-300">
          <Users className="w-8 h-8 text-violet-500 mb-2" />
          <span className="font-bold text-foreground">{property.guestCapacity || '2'}</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Guests</span>
        </div>

        {/* Price - Orange */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-transform hover:scale-105 duration-300">
          <DollarSign className="w-8 h-8 text-primary mb-2" />
          <span className="font-bold text-foreground">{formatCurrency(property.pricePerNight)}</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Per Night</span>
        </div>
      </motion.div>

      {/* Description */}
      <motion.div variants={fadeUpItem} className="pb-8 border-b border-border">
        <h3 className="text-2xl font-bold mb-4 text-foreground tracking-tight">About this space</h3>
        <div className="prose max-w-none text-muted-foreground text-base leading-relaxed whitespace-pre-wrap">
          {property.description}
        </div>
      </motion.div>

      {/* Amenities Grid */}
      <motion.div variants={fadeUpItem} className="pb-8 border-b border-border">
        <h3 className="text-2xl font-bold mb-6 text-foreground tracking-tight">What this place offers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
          {amenities.length > 0 ? (
            amenities.map(amenity => (
              <div key={amenity.id} className="flex items-center gap-4 text-foreground/90 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="p-2 bg-secondary/10 rounded-lg text-secondary-foreground">
                  <Check className="w-5 h-5" />
                </div>
                <span className="font-medium text-base">{amenity.name}</span>
              </div>
            ))
          ) : (
            <>
              <div className="flex items-center gap-4 text-foreground/90 p-3 rounded-xl"><div className="p-2 bg-secondary/10 rounded-lg"><Check className="w-5 h-5" /></div><span className="font-medium">Fast Wifi</span></div>
              <div className="flex items-center gap-4 text-foreground/90 p-3 rounded-xl"><div className="p-2 bg-secondary/10 rounded-lg"><Check className="w-5 h-5" /></div><span className="font-medium">Dedicated workspace</span></div>
              <div className="flex items-center gap-4 text-foreground/90 p-3 rounded-xl"><div className="p-2 bg-secondary/10 rounded-lg"><Check className="w-5 h-5" /></div><span className="font-medium">Pool</span></div>
              <div className="flex items-center gap-4 text-foreground/90 p-3 rounded-xl"><div className="p-2 bg-secondary/10 rounded-lg"><Check className="w-5 h-5" /></div><span className="font-medium">Air conditioning</span></div>
            </>
          )}
        </div>
      </motion.div>

      {/* House Rules */}
      <motion.div variants={fadeUpItem} className="pb-8 border-b border-border">
        <h3 className="text-2xl font-bold mb-6 text-foreground tracking-tight">House Rules</h3>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Check-in</span>
              <span className="text-lg font-medium text-foreground bg-muted w-fit px-4 py-1.5 rounded-lg">After {property.checkInTime || '14:00'}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Check-out</span>
              <span className="text-lg font-medium text-foreground bg-muted w-fit px-4 py-1.5 rounded-lg">Before {property.checkOutTime || '11:00'}</span>
            </div>
            {property.houseRules && (
              <div className="md:col-span-2 pt-4 border-t border-border">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider block mb-3">Additional Rules</span>
                <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{property.houseRules}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Review Section */}
      <motion.div variants={fadeUpItem} className="pb-8">
        <div className="flex items-center gap-3 mb-8">
          <Star className="w-8 h-8 fill-amber-500 text-amber-500 drop-shadow-sm" />
          <h3 className="text-2xl font-bold text-foreground tracking-tight">
            {reviewStats.rating} <span className="text-muted-foreground font-medium text-xl ml-2">({reviewStats.count} reviews)</span>
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sample stylized reviews */}
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-12 h-12 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-bold">AL</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-bold text-foreground">Alice L.</div>
                <div className="text-xs text-muted-foreground">October 2025</div>
              </div>
            </div>
            <p className="text-muted-foreground text-base leading-relaxed">
              "Incredible stay! The attention to detail was immaculate and the host was extremely accommodating. Would absolutely stay here again."
            </p>
          </div>
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-12 h-12 border-2 border-violet-500/20">
                <AvatarFallback className="bg-violet-500/10 text-violet-500 font-bold">MK</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-bold text-foreground">Mark K.</div>
                <div className="text-xs text-muted-foreground">September 2025</div>
              </div>
            </div>
            <p className="text-muted-foreground text-base leading-relaxed">
              "Perfect location, walking distance to everything. The property matched the photos exactly. Highly recommended!"
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PropertyDetailCard;