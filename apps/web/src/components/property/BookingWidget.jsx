import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ChevronDown, BadgePercent } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

export const BookingWidget = ({ property }) => {
  const navigate = useNavigate();

  // Local state for dates since we don't want to overcomplicate with full calendar logic here yet
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [isReserving, setIsReserving] = useState(false);

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
    setIsReserving(true);
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
    <Card
      className="shadow-xl rounded-2xl border-border sticky top-28 bg-card
                 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out
                 transition-shadow hover:shadow-2xl"
    >
      <CardContent className="p-6">

        {/* Fees-included banner */}
        <div
          className="flex items-center gap-2 rounded-xl bg-muted/60 border border-border
                     px-3 py-2 mb-5 text-xs font-medium text-foreground
                     animate-in fade-in slide-in-from-top-2 duration-500"
        >
          <BadgePercent className="w-4 h-4 text-primary shrink-0" />
          <span>Prices include all fees</span>
        </div>

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

        <div
          className="border border-border rounded-xl mb-4 overflow-hidden
                     transition-all duration-300 ease-out
                     focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/40"
        >
          <div className="flex border-b border-border">
            <div className="flex-1 p-3 border-r border-border transition-colors duration-200 hover:bg-muted/40">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground mb-1">Check-in</label>
              <input
                type="date"
                className="w-full text-sm bg-transparent border-none p-0 focus:ring-0 text-foreground"
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="flex-1 p-3 transition-colors duration-200 hover:bg-muted/40">
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
          <div className="p-3 group transition-colors duration-200 hover:bg-muted/40">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground mb-1">Guests</label>
            <div className="relative">
              <select
                className="w-full text-sm bg-transparent border-none p-0 focus:ring-0 appearance-none text-foreground cursor-pointer"
                value={guests}
                onChange={e => setGuests(Number(e.target.value))}
              >
                {[...Array(property?.guestCapacity || 8)].map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1} guest{i > 0 ? 's' : ''}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none transition-transform duration-200 group-hover:translate-y-[-40%]" />
            </div>
          </div>
        </div>

        <Button
          onClick={handleReserve}
          disabled={isReserving}
          className="w-full py-6 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground
                     shadow-brand transition-all duration-200 ease-out
                     hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0
                     disabled:opacity-70 disabled:pointer-events-none"
        >
          {isReserving ? 'Redirecting…' : 'Reserve'}
        </Button>
        <div className="text-center text-sm text-muted-foreground mt-4 mb-6">
          You won't be charged yet
        </div>

        {nights > 0 && (
          <div
            key={`${checkIn}-${checkOut}`}
            className="space-y-4 text-base text-foreground
                       animate-in fade-in slide-in-from-top-2 duration-400 ease-out"
          >
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
              <span className="transition-all duration-300">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};