import React from 'react';
import { Wifi, Waves, UtensilsCrossed, Car, Wind, Flame, ShowerHead as WashingMachine, Tv, Dumbbell, Bath, Home, Trees, Zap, Building } from 'lucide-react';

const iconMap = {
  'WiFi': Wifi,
  'Pool': Waves,
  'Kitchen': UtensilsCrossed,
  'Parking': Car,
  'Air Conditioning': Wind,
  'Heating': Flame,
  'Washer': WashingMachine,
  'Dryer': WashingMachine,
  'TV': Tv,
  'Gym': Dumbbell,
  'Hot Tub': Bath,
  'Balcony': Home,
  'Garden': Trees,
  'Fireplace': Flame,
  'Elevator': Building
};

const AmenityIcon = ({ name, className = "w-5 h-5" }) => {
  const Icon = iconMap[name] || Zap;
  return <Icon className={className} />;
};

export default AmenityIcon;