
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ChevronDown } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

export const BookingWidget = ({ property }) => {
  const navigate = useNavigate();
  
  // Local state for dates since we don't want to overcomplicate with full calendar logic here yet
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const pricePerNight = property?.pricePerNight || 0;
  const rating = property?.rating || 4.9;
  const reviewCount = property?.totalBookings || 128; // fallback for display

  let nights = 0;
  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    nights = differenceInDays(end, start);
    if (nights < 0) nights = 0;
  }

  const basePrice = nights * pricePerNight;
  const cleaningFee = nights > 0 ? 1500 : 0;
  const serviceFee = Math.round(basePrice * 0.12);
  const total = basePrice + cleaningFee + serviceFee;

  const handleReserve = () => {
    if (!checkIn || !checkOut || nights <= 0) {
      alert("Please select valid dates");
      return;
    }
    navigate('/checkout', {
      state: {
        propertyId: property._id || property.id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guestCount: guests,
        totalPrice: total
      }
    });
  };

  return (
    <Card className="shadow-xl rounded-2xl border-border sticky top-28 bg-card">
      <CardContent className="p-6">
        <div className="flex justify-between items-baseline mb-6">
          <div className="text-2xl font-bold text-foreground">
            ₹{pricePerNight.toLocaleString('en-IN')} <span className="text-base font-normal text-muted-foreground">night</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold">
            <Star className="w-4 h-4 fill-foreground text-foreground" />
            <span>{rating}</span>
            <span className="text-muted-foreground font-normal underline cursor-pointer">· {reviewCount} reviews</span>
          </div>
        </div>

        <div className="border border-border rounded-xl mb-4 overflow-hidden focus-within:ring-2 focus-within:ring-primary/20">
          <div className="flex border-b border-border">
            <div className="flex-1 p-3 border-r border-border">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground mb-1">Check-in</label>
              <input 
                type="date" 
                className="w-full text-sm bg-transparent border-none p-0 focus:ring-0 text-foreground" 
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="flex-1 p-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground mb-1">Checkout</label>
              <input 
                type="date" 
                className="w-full text-sm bg-transparent border-none p-0 focus:ring-0 text-foreground" 
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <div className="p-3">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground mb-1">Guests</label>
            <div className="relative">
              <select 
                className="w-full text-sm bg-transparent border-none p-0 focus:ring-0 appearance-none text-foreground cursor-pointer"
                value={guests}
                onChange={e => setGuests(Number(e.target.value))}
              >
                {[...Array(property?.guestCapacity || 8)].map((_, i) => (
                  <option key={i} value={i+1}>{i+1} guest{i > 0 ? 's' : ''}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <Button 
          onClick={handleReserve}
          className="w-full py-6 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-brand transition-transform active:scale-[0.98]"
        >
          Reserve
        </Button>
        <div className="text-center text-sm text-muted-foreground mt-4 mb-6">
          You won't be charged yet
        </div>

        {nights > 0 && (
          <div className="space-y-4 text-base text-foreground">
            <div className="flex justify-between">
              <span className="underline cursor-pointer">₹{pricePerNight.toLocaleString('en-IN')} × {nights} nights</span>
              <span>₹{basePrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="underline cursor-pointer">Cleaning fee</span>
              <span>₹{cleaningFee.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="underline cursor-pointer">TakeOnBnB service fee</span>
              <span>₹{serviceFee.toLocaleString('en-IN')}</span>
            </div>
            <hr className="border-border my-4" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total before taxes</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
