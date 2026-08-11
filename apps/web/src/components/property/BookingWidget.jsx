import React, { useMemo, useState } from 'react';
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

  const propertyId =
    property?._id || property?.id;

  const pricePerNight = Number(
    property?.pricePerNight || 0
  );

  const rating = Number(
    property?.rating || 4.9
  );

  const reviewCount = Number(
    property?.totalBookings ||
      property?.reviewCount ||
      128
  );

  const guestCapacity = Math.max(
    Number(property?.guestCapacity || 8),
    1
  );

  const today = new Date()
    .toISOString()
    .split('T')[0];

  /*
   * Calculate nights
   */
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) {
      return 0;
    }

    const start = new Date(
      `${checkIn}T00:00:00`
    );

    const end = new Date(
      `${checkOut}T00:00:00`
    );

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      return 0;
    }

    return Math.max(
      differenceInDays(end, start),
      0
    );
  }, [checkIn, checkOut]);

  /*
   * Pricing
   * Same calculation used in BookingPage
   */
  const basePrice =
    nights > 0
      ? pricePerNight * nights
      : 0;

  const serviceFee = Math.floor(
    basePrice * 0.1
  );

  const taxes = Math.floor(
    basePrice * 0.18
  );

  const totalAmount =
    basePrice +
    serviceFee +
    taxes;

  /*
   * INR formatter
   */
  const formatINR = (amount) =>
    `₹${Number(amount || 0).toLocaleString(
      'en-IN'
    )}`;

  /*
   * Check-in change
   */
  const handleCheckInChange = (event) => {
    const value = event.target.value;

    setCheckIn(value);

    // Reset checkout if it becomes invalid
    if (
      checkOut &&
      value &&
      checkOut <= value
    ) {
      setCheckOut('');
    }
  };

  /*
   * Reserve
   *
   * Flow:
   *
   * Property Detail
   *      ↓
   * Booking Page
   *      ↓
   * Create MongoDB Booking
   *      ↓
   * Checkout
   */
  const handleReserve = () => {
    if (!propertyId) {
      alert(
        'Property information is missing. Please refresh the page and try again.'
      );
      return;
    }

    if (!checkIn || !checkOut) {
      alert(
        'Please select check-in and check-out dates.'
      );
      return;
    }

    if (nights <= 0) {
      alert(
        'Check-out date must be after check-in date.'
      );
      return;
    }

    if (
      guests < 1 ||
      guests > guestCapacity
    ) {
      alert(
        `This property allows a maximum of ${guestCapacity} guests.`
      );
      return;
    }

    setIsReserving(true);

    /*
     * IMPORTANT:
     * BookingPage expects:
     *
     * location.state.dates.checkIn
     * location.state.dates.checkOut
     * location.state.guests
     */
    navigate(`/booking/${propertyId}`, {
      state: {
        dates: {
          checkIn,
          checkOut,
        },
        guests,
      },
    });

    /*
     * Reset button state shortly after navigation
     */
    setTimeout(() => {
      setIsReserving(false);
    }, 1000);
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
        animate-in
        fade-in
        slide-in-from-bottom-4
        duration-500
        ease-out
        transition-shadow
        hover:shadow-2xl
      "
    >
      <CardContent className="p-6">

        {/* Fees banner */}
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
            Taxes and service fee are calculated at checkout
          </span>
        </div>

        {/* Price and rating */}
        <div className="flex justify-between items-baseline mb-6">

          <div className="text-2xl font-bold text-foreground">
            {formatINR(pricePerNight)}

            <span className="text-base font-normal text-muted-foreground">
              {' '}
              / night
            </span>
          </div>

          <div className="flex items-center gap-1 text-sm font-semibold">

            <Star className="w-4 h-4 fill-foreground text-foreground" />

            <span>
              {rating.toFixed(1)}
            </span>

            <span className="text-muted-foreground font-normal">
              · {reviewCount} reviews
            </span>

          </div>
        </div>

        {/* Booking fields */}
        <div
          className="
            border
            border-border
            rounded-xl
            mb-4
            overflow-hidden
            transition-all
            duration-300
            focus-within:ring-2
            focus-within:ring-primary/30
            focus-within:border-primary/40
          "
        >

          {/* Dates */}
          <div className="flex border-b border-border">

            {/* Check-in */}
            <div
              className="
                flex-1
                p-3
                border-r
                border-border
                transition-colors
                duration-200
                hover:bg-muted/40
              "
            >
              <label
                htmlFor="booking-check-in"
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
                id="booking-check-in"
                type="date"
                value={checkIn}
                min={today}
                onChange={handleCheckInChange}
                className="
                  w-full
                  text-sm
                  bg-transparent
                  border-none
                  p-0
                  focus:ring-0
                  text-foreground
                "
              />
            </div>

            {/* Check-out */}
            <div
              className="
                flex-1
                p-3
                transition-colors
                duration-200
                hover:bg-muted/40
              "
            >
              <label
                htmlFor="booking-check-out"
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
                Check-out
              </label>

              <input
                id="booking-check-out"
                type="date"
                value={checkOut}
                min={checkIn || today}
                onChange={(event) =>
                  setCheckOut(
                    event.target.value
                  )
                }
                className="
                  w-full
                  text-sm
                  bg-transparent
                  border-none
                  p-0
                  focus:ring-0
                  text-foreground
                "
              />
            </div>

          </div>

          {/* Guests */}
          <div
            className="
              p-3
              group
              transition-colors
              duration-200
              hover:bg-muted/40
            "
          >
            <label
              htmlFor="booking-guests"
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
                id="booking-guests"
                value={guests}
                onChange={(event) =>
                  setGuests(
                    Number(event.target.value)
                  )
                }
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
                "
              >
                {Array.from(
                  {
                    length: guestCapacity,
                  },
                  (_, index) =>
                    index + 1
                ).map((guestNumber) => (
                  <option
                    key={guestNumber}
                    value={guestNumber}
                  >
                    {guestNumber}{' '}
                    {guestNumber === 1
                      ? 'guest'
                      : 'guests'}
                  </option>
                ))}
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

        {/* Reserve button */}
        <Button
          type="button"
          onClick={handleReserve}
          disabled={
            isReserving ||
            !propertyId
          }
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
            duration-200
            ease-out
            hover:shadow-lg
            hover:-translate-y-0.5
            active:scale-[0.98]
            active:translate-y-0
            disabled:opacity-70
            disabled:pointer-events-none
          "
        >
          {isReserving
            ? 'Opening booking...'
            : 'Reserve'}
        </Button>

        <div className="text-center text-sm text-muted-foreground mt-4 mb-6">
          You won't be charged yet
        </div>

        {/* Price breakdown */}
        {nights > 0 && (
          <div
            key={`${checkIn}-${checkOut}`}
            className="
              space-y-4
              text-base
              text-foreground
              animate-in
              fade-in
              slide-in-from-top-2
              duration-300
              ease-out
            "
          >

            {/* Base price */}
            <div className="flex justify-between gap-4">

              <span className="text-muted-foreground">
                {formatINR(pricePerNight)}
                {' × '}
                {nights}{' '}
                {nights === 1
                  ? 'night'
                  : 'nights'}
              </span>

              <span>
                {formatINR(basePrice)}
              </span>

            </div>

            {/* Service fee */}
            <div className="flex justify-between">

              <span className="text-muted-foreground">
                Service fee
              </span>

              <span>
                {formatINR(serviceFee)}
              </span>

            </div>

            {/* Taxes */}
            <div className="flex justify-between">

              <span className="text-muted-foreground">
                Taxes
              </span>

              <span>
                {formatINR(taxes)}
              </span>

            </div>

            <hr className="border-border my-4" />

            {/* Total */}
            <div className="flex justify-between font-bold text-lg">

              <span>
                Total
              </span>

              <span className="text-primary">
                {formatINR(totalAmount)}
              </span>

            </div>

          </div>
        )}

      </CardContent>
    </Card>
  );
};

export default BookingWidget;