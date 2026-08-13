import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Star,
  ChevronDown,
  BadgePercent,
} from 'lucide-react';
import { differenceInDays } from 'date-fns';

export const BookingWidget = ({ property }) => {
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [isReserving, setIsReserving] = useState(false);

  const propertyId = property?._id || property?.id;

  const pricePerNight = Number(property?.pricePerNight || 0);
  const rating = property?.rating || 4.9;
  const reviewCount = property?.totalBookings || 0;
  const guestCapacity = Number(property?.guestCapacity || 1);

  const today = new Date().toISOString().split('T')[0];

  let nights = 0;

  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    nights = differenceInDays(end, start);

    if (nights < 0) {
      nights = 0;
    }
  }

  const basePrice = nights * pricePerNight;

  // You can later connect these values with backend/property settings
  const cleaningFee = nights > 0 ? 1500 : 0;

  const serviceFee =
    nights > 0
      ? Math.round(basePrice * 0.12)
      : 0;

  const total =
    basePrice +
    cleaningFee +
    serviceFee;

  const handleCheckInChange = (e) => {
    const selectedDate = e.target.value;

    setCheckIn(selectedDate);

    // If checkout is before or equal to check-in, reset it
    if (
      checkOut &&
      new Date(checkOut) <= new Date(selectedDate)
    ) {
      setCheckOut('');
    }
  };

  const handleReserve = () => {
    if (!propertyId) {
      alert('Property information is missing.');
      return;
    }

    if (!checkIn) {
      alert('Please select a check-in date.');
      return;
    }

    if (!checkOut) {
      alert('Please select a checkout date.');
      return;
    }

    if (nights <= 0) {
      alert(
        'Checkout date must be after the check-in date.'
      );
      return;
    }

    setIsReserving(true);

    const bookingData = {
      propertyId,

      property: {
        id: propertyId,
        title: property?.title || '',
        location: property?.location || '',
        coverImage:
          property?.coverImage ||
          property?.photos?.[0] ||
          '',
        pricePerNight,
      },

      checkInDate: checkIn,
      checkOutDate: checkOut,

      guests,

      nights,

      pricePerNight,

      basePrice,

      cleaningFee,

      serviceFee,

      totalPrice: total,
    };

    navigate(`/checkout/${propertyId}`, {
      state: bookingData,
    });
  };

  return (
    <Card
      className="
        shadow-xl
        rounded-2xl
        border-border
        sticky
        top-28
        bg-card
        transition-shadow
        hover:shadow-2xl
      "
    >
      <CardContent className="p-6">

        {/* Fees Banner */}
        <div
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-muted/60
            border
            border-border
            px-3
            py-2
            mb-5
            text-xs
            font-medium
            text-foreground
          "
        >
          <BadgePercent className="w-4 h-4 text-primary shrink-0" />

          <span>
            Transparent pricing before payment
          </span>
        </div>

        {/* Price */}
        <div className="flex justify-between items-baseline mb-6">

          <div className="text-2xl font-bold text-foreground">

            ₹{pricePerNight.toLocaleString('en-IN')}

            <span className="text-base font-normal text-muted-foreground">
              {' '}
              / night
            </span>

          </div>

          <div className="flex items-center gap-1 text-sm font-semibold">

            <Star className="w-4 h-4 fill-foreground text-foreground" />

            <span>{rating}</span>

            {reviewCount > 0 && (
              <span className="text-muted-foreground font-normal">
                · {reviewCount} bookings
              </span>
            )}

          </div>

        </div>

        {/* Booking Inputs */}
        <div
          className="
            border
            border-border
            rounded-xl
            mb-4
            overflow-hidden
            focus-within:ring-2
            focus-within:ring-primary/30
            focus-within:border-primary/40
          "
        >

          {/* Dates */}
          <div className="flex border-b border-border">

            {/* Check In */}
            <div
              className="
                flex-1
                p-3
                border-r
                border-border
              "
            >

              <label
                className="
                  block
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-foreground
                  mb-1
                "
              >
                Check-in
              </label>

              <input
                type="date"
                className="
                  w-full
                  text-sm
                  bg-transparent
                  border-none
                  p-0
                  focus:ring-0
                  text-foreground
                  outline-none
                "
                value={checkIn}
                onChange={handleCheckInChange}
                min={today}
              />

            </div>

            {/* Check Out */}
            <div className="flex-1 p-3">

              <label
                className="
                  block
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-foreground
                  mb-1
                "
              >
                Checkout
              </label>

              <input
                type="date"
                className="
                  w-full
                  text-sm
                  bg-transparent
                  border-none
                  p-0
                  focus:ring-0
                  text-foreground
                  outline-none
                "
                value={checkOut}
                onChange={(e) =>
                  setCheckOut(e.target.value)
                }
                min={checkIn || today}
              />

            </div>

          </div>

          {/* Guests */}
          <div className="p-3 group">

            <label
              className="
                block
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-foreground
                mb-1
              "
            >
              Guests
            </label>

            <div className="relative">

              <select
                className="
                  w-full
                  text-sm
                  bg-transparent
                  border-none
                  p-0
                  focus:ring-0
                  appearance-none
                  text-foreground
                  cursor-pointer
                  outline-none
                "
                value={guests}
                onChange={(e) =>
                  setGuests(Number(e.target.value))
                }
              >

                {Array.from(
                  { length: guestCapacity },
                  (_, i) => (
                    <option
                      key={i}
                      value={i + 1}
                    >
                      {i + 1}{' '}
                      Guest{i + 1 > 1 ? 's' : ''}
                    </option>
                  )
                )}

              </select>

              <ChevronDown
                className="
                  absolute
                  right-2
                  top-1/2
                  -translate-y-1/2
                  w-4
                  h-4
                  text-muted-foreground
                  pointer-events-none
                "
              />

            </div>

          </div>

        </div>

        {/* Reserve Button */}
        <Button
          onClick={handleReserve}
          disabled={isReserving}
          className="
            w-full
            py-6
            text-lg
            font-semibold
            rounded-xl
            bg-primary
            hover:bg-primary/90
            text-primary-foreground
            shadow-brand
            transition-all
            hover:-translate-y-0.5
            active:scale-[0.98]
            disabled:opacity-70
          "
        >
          {isReserving
            ? 'Redirecting...'
            : 'Reserve'}
        </Button>

        <div className="text-center text-sm text-muted-foreground mt-4 mb-6">
          You won't be charged yet
        </div>

        {/* Price Breakdown */}
        {nights > 0 && (

          <div className="space-y-4 text-base text-foreground">

            <div className="flex justify-between">

              <span className="underline">
                ₹{pricePerNight.toLocaleString('en-IN')} ×{' '}
                {nights} night{nights > 1 ? 's' : ''}
              </span>

              <span>
                ₹{basePrice.toLocaleString('en-IN')}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="underline">
                Cleaning fee
              </span>

              <span>
                ₹{cleaningFee.toLocaleString('en-IN')}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="underline">
                TakeOnBnB service fee
              </span>

              <span>
                ₹{serviceFee.toLocaleString('en-IN')}
              </span>

            </div>

            <hr className="border-border my-4" />

            <div className="flex justify-between font-bold text-lg">

              <span>
                Total before taxes
              </span>

              <span>
                ₹{total.toLocaleString('en-IN')}
              </span>

            </div>

          </div>

        )}

      </CardContent>
    </Card>
  );
};