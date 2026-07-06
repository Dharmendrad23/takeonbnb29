import React from 'react';
import { Wifi, Wind, UtensilsCrossed, Car, Waves, Dumbbell, ShowerHead as WashingMachine, Tv, Home, Trees, Shield, Droplet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const amenityIcons = {
  'WiFi': Wifi,
  'AC': Wind,
  'Kitchen': UtensilsCrossed,
  'Parking': Car,
  'Pool': Waves,
  'Gym': Dumbbell,
  'Washing Machine': WashingMachine,
  'TV': Tv,
  'Balcony': Home,
  'Garden': Trees,
  'Security': Shield,
  'Hot Water': Droplet,
};

const AmenityBadge = ({ name, showIcon = true, variant = 'secondary' }) => {
  const Icon = amenityIcons[name];
  
  return (
    <Badge variant={variant} className="flex items-center gap-1.5 px-3 py-1.5">
      {showIcon && Icon && <Icon className="w-3.5 h-3.5" />}
      <span className="text-xs font-medium">{name}</span>
    </Badge>
  );
};

export default AmenityBadge;