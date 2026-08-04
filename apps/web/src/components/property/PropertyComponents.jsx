
import React from 'react';
import { 
  Share2,
  Heart, 
  MapPin, 
  Users, 
  Bed, 
  Bath, 
  Home as HomeIcon, 
  CheckCircle2, 
  Star,
  Clock,
  Wifi,
  Wind,
  UtensilsCrossed,
  CarFront,
  Waves,
  Dumbbell,
  Tv,
  Flame,
  Trees,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';
import {
  getEntityId,
  getHostAvatarUrl,
  getHostFromProperty,
  getHostName,
  getPropertyRating,
  getPropertyReviewCount,
  normalizePropertyType,
} from '@/lib/propertyMappers.js';

const getWishlistStorageKey = (userId) => `wishlist:${userId}`;

const getWishlistedIds = (userId) => {
  if (!userId) {
    return [];
  }

  try {
    const storedValue = localStorage.getItem(getWishlistStorageKey(userId));
    const parsedValue = JSON.parse(storedValue || '[]');
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    console.error('Failed to read wishlist from local storage', error);
    return [];
  }
};

export const PropertyHeader = ({ property }) => {
  const { currentUser } = useAuth();
  const propertyId = getEntityId(property);
  const reviewCount = getPropertyReviewCount(property);
  const rating = getPropertyRating(property);
  
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleFavorite = async () => {
    if (!currentUser) {
      toast.error('Please login to save favorites');
      return;
    }

    if (!propertyId) {
      toast.error('This property cannot be saved right now');
      return;
    }

    const wishlistedIds = getWishlistedIds(currentUser.id);
    const isSaved = wishlistedIds.includes(propertyId);
    const nextWishlistedIds = isSaved
      ? wishlistedIds.filter((id) => id !== propertyId)
      : [...wishlistedIds, propertyId];

    try {
      localStorage.setItem(
        getWishlistStorageKey(currentUser.id),
        JSON.stringify(nextWishlistedIds)
      );
      toast[isSaved ? 'info' : 'success'](isSaved ? 'Removed from wishlist' : 'Saved to wishlist!');
    } catch (error) {
      console.error('Wishlist storage error:', error);
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 pt-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-heading font-semibold text-foreground mb-2">
          {property?.title || 'Luxury Villa'}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm font-medium">
          <span className="flex items-center gap-1 text-foreground">
            <Star className="w-4 h-4 fill-foreground text-foreground" />
            <span className="font-semibold">{rating}</span>
            <span className="underline cursor-pointer">· {reviewCount || 0} reviews</span>
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span className="underline cursor-pointer">{property?.location || 'Location not specified'}</span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="font-semibold underline hover:bg-muted" onClick={handleShare}>
          <Share2 className="w-4 h-4 mr-2" /> Share
        </Button>
        <Button variant="ghost" size="sm" className="font-semibold underline hover:bg-muted" onClick={handleFavorite}>
          <Heart className="w-4 h-4 mr-2" /> Save
        </Button>
      </div>
    </div>
  );
};

export const PropertyInfoCards = ({ property }) => {
  const host = getHostFromProperty(property);

  return (
    <div className="py-8 border-b border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-1">Entire {normalizePropertyType(property?.propertyType)} hosted by {getHostName(host)}</h2>
          <div className="flex items-center gap-2 text-foreground/80 text-sm mt-2">
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {property?.guestCapacity || 2} guests</span> · 
            <span className="flex items-center gap-1"><Bed className="w-4 h-4" /> {property?.bedrooms || 1} bedrooms</span> · 
            <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {property?.bathrooms || 1} baths</span>
          </div>
        </div>
        <Avatar className="w-14 h-14 border border-border">
          <AvatarImage src={getHostAvatarUrl(host)} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">{getHostName(host)[0] || 'H'}</AvatarFallback>
        </Avatar>
      </div>
      
      <div className="space-y-6 pt-6 border-t border-border">
        <div className="flex gap-4">
          <HomeIcon className="w-6 h-6 text-foreground shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">Entire home</div>
            <div className="text-muted-foreground text-sm">You'll have the place to yourself.</div>
          </div>
        </div>
        <div className="flex gap-4">
          <CheckCircle2 className="w-6 h-6 text-foreground shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">Self check-in</div>
            <div className="text-muted-foreground text-sm">Check yourself in with the lockbox.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AmenitiesGrid = ({ amenities = [] }) => {
  const defaultAmenities = ['WiFi', 'Kitchen', 'Free parking', 'Pool', 'Air conditioning', 'TV', 'Heating', 'Garden'];
  const displayAmenities = amenities.length > 0 ? amenities : defaultAmenities;

  // Simple mapping for demonstration if specific names match
  const getIconForAmenity = (name) => {
    const n = name.toLowerCase();
    if (n.includes('wifi')) return <Wifi className="w-5 h-5 text-muted-foreground" />;
    if (n.includes('kitchen') || n.includes('utensils')) return <UtensilsCrossed className="w-5 h-5 text-muted-foreground" />;
    if (n.includes('parking')) return <CarFront className="w-5 h-5 text-muted-foreground" />;
    if (n.includes('pool') || n.includes('hot tub')) return <Waves className="w-5 h-5 text-muted-foreground" />;
    if (n.includes('air conditioning') || n.includes('ac') || n.includes('wind')) return <Wind className="w-5 h-5 text-muted-foreground" />;
    if (n.includes('tv')) return <Tv className="w-5 h-5 text-muted-foreground" />;
    if (n.includes('heating')) return <Flame className="w-5 h-5 text-muted-foreground" />;
    if (n.includes('gym') || n.includes('fitness')) return <Dumbbell className="w-5 h-5 text-muted-foreground" />;
    if (n.includes('garden') || n.includes('trees') || n.includes('balcony')) return <Trees className="w-5 h-5 text-muted-foreground" />;
    return <CheckCircle2 className="w-5 h-5 text-muted-foreground" />;
  };

  return (
    <div className="py-8 border-b border-border">
      <h2 className="text-2xl font-semibold mb-6">What this place offers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
        {displayAmenities.slice(0, 8).map((amenity, i) => {
          const amenityName = typeof amenity === 'string' ? amenity : amenity.name;
          return (
            <div key={i} className="flex items-center gap-4 text-foreground/90">
              {getIconForAmenity(amenityName)}
              <span>{amenityName}</span>
            </div>
          );
        })}
      </div>
      <Button variant="outline" className="mt-8 rounded-xl font-semibold px-6 py-6 border-foreground hover:bg-muted">
        Show all amenities
      </Button>
    </div>
  );
};

export const HouseRulesSection = ({ houseRules, checkInTime, checkOutTime }) => {
  return (
    <div className="py-8 border-b border-border">
      <h2 className="text-2xl font-semibold mb-6">House Rules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-foreground/90">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <span>Check-in: {checkInTime || 'After 3:00 PM'}</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <span>Checkout: {checkOutTime || '11:00 AM'}</span>
        </div>
        <div className="flex items-start gap-3 md:col-span-2 mt-2">
          <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
          <span className="leading-relaxed whitespace-pre-wrap">{houseRules || 'No smoking.\nNo parties or events.\nPets are not allowed unless explicitly approved by the host.'}</span>
        </div>
      </div>
    </div>
  );
};

export const HostCard = ({ host }) => {
  const hostName = getHostName(host);
  const joinedAt = host?.createdAt || host?.created;

  return (
    <div className="py-8 border-b border-border">
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="w-16 h-16 border border-border">
          <AvatarImage src={getHostAvatarUrl(host)} />
          <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">{hostName[0] || 'H'}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-semibold">Hosted by {hostName || 'Superhost'}</h2>
          <p className="text-muted-foreground text-sm">Joined in {joinedAt ? new Date(joinedAt).getFullYear() : '2022'}</p>
        </div>
      </div>
      <div className="flex items-center gap-6 text-foreground mb-6">
        <div className="flex flex-col">
          <span className="font-bold text-lg">124</span>
          <span className="text-xs text-muted-foreground">Reviews</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg flex items-center gap-1">4.9 <Star className="w-4 h-4 fill-foreground text-foreground" /></span>
          <span className="text-xs text-muted-foreground">Rating</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg">2</span>
          <span className="text-xs text-muted-foreground">Years hosting</span>
        </div>
      </div>
      <p className="text-foreground/90 leading-relaxed max-w-2xl mb-8">
        {host?.bio || "Passionate about travel and hospitality. I love making my guests feel at home and ensuring they have the best possible experience during their stay."}
      </p>
      <Button variant="outline" className="rounded-xl font-semibold px-6 py-6 border-foreground hover:bg-muted">
        Contact Host
      </Button>
    </div>
  );
};

export const LocationMap = ({ location }) => {
  return (
    <div className="py-8 border-b border-border">
      <h2 className="text-2xl font-semibold mb-6">Where you'll be</h2>
      <p className="text-foreground mb-6">{location || 'Location detailed after booking'}</p>
      <div className="w-full h-[400px] bg-muted rounded-2xl overflow-hidden relative border border-border">
        {/* Placeholder map */}
        <div className="absolute inset-0 bg-blue-50/50 flex items-center justify-center">
          <div className="text-center p-6 bg-white/90 backdrop-blur rounded-xl shadow-sm border border-border">
            <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="font-semibold text-foreground max-w-[250px] truncate">{location || 'Exact location provided after booking'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
