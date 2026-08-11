import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  MapPin,
  Calendar,
  Users,
  Landmark,
  Copy,
  CheckCircle2,
  CreditCard,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';

import CheckoutButton from '@/components/CheckoutButton.jsx';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/bookingUtils.js';

const STORAGE_KEY = 'takeonbnb_checkout_data';

const getStoredCheckoutData = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Could not read checkout data:', error);
    return null;
  }
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [bookingData, setBookingData] = useState(
    () => location.state || getStoredCheckoutData()
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState('stripe');
  const [isCopied, setIsCopied] = useState(false);

  // Restore checkout data if the page was refreshed.
  useEffect(() => {
    const stateData = location.state;

    if (stateData?.booking) {
      setBookingData(stateData);

      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(stateData)
        );
      } catch (error) {
        console.warn('Could not save checkout data:', error);
      }

      return;
    }

    const storedData = getStoredCheckoutData();

    if (storedData?.booking) {
      setBookingData(storedData);
    }
  }, [location.state]);

  const booking = bookingData?.booking;
  const property = bookingData?.property;

  const dates = bookingData?.dates || {};
  const guests = Math.max(
    Number(bookingData?.guests || booking?.guestCount || 1),
    1
  );

  const pricing = bookingData?.pricing || {};

  const pricePerNight = Number(
    property?.pricePerNight ||
      bookingData?.pricePerNight ||
      0
  );

  const nights = Math.max(
    Number(pricing?.nights || 1),
    1
  );

  const basePrice = Number(
    pricing?.basePrice ??
      (booking?.totalPrice || pricePerNight * nights)
  );

  const serviceFee = Number(
    pricing?.serviceFee ??
      Math.floor(basePrice * 0.1)
  );

  const taxes = Number(
    pricing?.taxes ??
      Math.floor(basePrice * 0.18)
  );

  const calculatedTotal =
    basePrice + serviceFee + taxes;

  /*
   * Older bookings may already contain the final totalPrice.
   * New bookings created by BookingPage store totalPrice as the
   * final payable amount.
   */
  const totalAmount = Number(
    pricing?.totalAmount ||
      booking?.totalPrice ||
      calculatedTotal
  );

  const propertyName =
    property?.title ||
    property?.name ||
    booking?.propertyName ||
    'Your property booking';

  const propertyLocation =
    property?.location ||
    property?.city ||
    '';

  const propertyImage =
    property?.image ||
    property?.coverImage ||
    property?.imageUrl ||
    property?.photoUrl ||
    (Array.isArray(property?.photos)
      ? property.photos[0]
      : '');

  const bookingId =
    booking?._id ||
    booking?.id ||
    '';

  const bankDetails = [
    { label: 'Bank Name', value: 'KKBK' },
    { label: 'Account Holder', value: 'TakeOn BnB' },
    { label: 'Account Number', value: '9749885381' },
    { label: 'IFSC Code', value: 'KKBK00051175' },
    { label: 'UPI ID', value: 'takeonbnb@upi' },
  ];

  const paymentDetailsText = useMemo(
    () =>
      bankDetails
        .map(
          ({ label, value }) =>
            `${label}: ${value}`
        )
        .join('\n'),
    []
  );

  const formatDate = (value) => {
    if (!value) return 'Not selected';

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleCopyPaymentDetails = async () => {
    try {
      await navigator.clipboard.writeText(
        paymentDetailsText
      );

      setIsCopied(true);
      toast.success('Payment details copied.');

      window.setTimeout(
        () => setIsCopied(false),
        2000
      );
    } catch (error) {
      console.error(
        'Failed to copy payment details:',
        error
      );
      toast.error(
        'Could not copy payment details.'
      );
    }
  };

  /*
   * If someone opens /checkout directly without going through
   * BookingPage, there is no booking to pay for.
   */
  if (!bookingData?.booking) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-muted/20 py-20 px-4">
        <Helmet>
          <title>
            Checkout | Take On BnB
          </title>
        </Helmet>

        <div className="max-w-2xl w-full bg-card rounded-3xl shadow-sm p-8 md:p-12 border border-border text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Booking information not found
          </h1>

          <p className="text-muted-foreground text-lg mb-8">
            Please select a property and start the
            booking process again.
          </p>

          <Button
            onClick={() => {
              try {
                sessionStorage.removeItem(
                  STORAGE_KEY
                );
              } catch {
                // Ignore storage errors.
              }

              navigate('/properties');
            }}
            className="h-12 px-7 rounded-xl"
          >
            Browse Properties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-12 px-4">
      <Helmet>
        <title>
          Checkout | Take On BnB
        </title>
      </Helmet>

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div>
            <h1 className="text-3xl font-extrabold text-foreground">
              Confirm your booking
            </h1>

            <p className="text-muted-foreground mt-1">
              Review your booking and complete payment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* MAIN */}
          <div className="lg:col-span-7 space-y-8">
            {/* BOOKING DETAILS */}
            <div className="bg-card rounded-3xl p-6 border border-border shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-5">
                Booking details
              </h2>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Check-in
                  </span>

                  <p className="text-foreground font-medium">
                    {formatDate(
                      dates.checkIn ||
                        booking?.checkInDate
                    )}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Check-out
                  </span>

                  <p className="text-foreground font-medium">
                    {formatDate(
                      dates.checkOut ||
                        booking?.checkOutDate
                    )}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    Guests
                  </span>

                  <p className="text-foreground font-medium">
                    {guests}{' '}
                    {guests === 1
                      ? 'Guest'
                      : 'Guests'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-semibold text-muted-foreground">
                    Booking ID
                  </span>

                  <p className="text-foreground font-medium break-all">
                    {bookingId || 'Created'}
                  </p>
                </div>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="bg-card rounded-3xl p-6 border border-border shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Payment method
              </h2>

              <div className="grid gap-3 md:grid-cols-2 mb-6">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedPaymentMethod(
                      'stripe'
                    )
                  }
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    selectedPaymentMethod ===
                    'stripe'
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/60'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-4 h-4 text-primary" />

                    <span className="font-semibold text-foreground">
                      Pay Online
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Pay securely using Stripe.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedPaymentMethod(
                      'bank'
                    )
                  }
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    selectedPaymentMethod ===
                    'bank'
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/60'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Landmark className="w-4 h-4 text-primary" />

                    <span className="font-semibold text-foreground">
                      Bank Transfer
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Transfer the amount manually.
                  </p>
                </button>
              </div>

              {selectedPaymentMethod ===
              'stripe' ? (
                <>
                  <p className="text-sm text-muted-foreground mb-6">
                    Your booking has already been
                    created. Continue to secure payment
                    for the amount shown below.
                  </p>

                  <CheckoutButton
                    amount={totalAmount}
                    productName={`Booking: ${propertyName}`}
                  />

                  <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-emerald-600">
                    <ShieldCheck className="w-4 h-4" />
                    Secure Payment
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Transfer the booking amount below
                    and share the payment proof with
                    Take On BnB for confirmation.
                  </p>

                  <div className="rounded-xl bg-background border border-border p-4">
                    <p className="text-sm text-muted-foreground">
                      Amount to transfer
                    </p>

                    <p className="text-2xl font-bold mt-1">
                      {formatCurrency(totalAmount)}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {bankDetails.map(
                      (detail) => (
                        <div
                          key={detail.label}
                          className="rounded-xl border border-border bg-background p-3"
                        >
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {detail.label}
                          </p>

                          <p className="mt-1 font-medium text-foreground break-all">
                            {detail.value}
                          </p>
                        </div>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={
                      handleCopyPaymentDetails
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
                  >
                    {isCopied ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}

                    {isCopied
                      ? 'Copied'
                      : 'Copy payment details'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-5">
            <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden sticky top-24">
              <div className="flex gap-4 p-6 border-b border-border">
                {propertyImage ? (
                  <img
                    src={propertyImage}
                    alt={propertyName}
                    className="w-24 h-24 rounded-xl object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        'none';
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center text-xs text-muted-foreground">
                    No Image
                  </div>
                )}

                <div className="min-w-0">
                  <h3 className="font-bold text-foreground text-lg leading-tight mb-1">
                    {propertyName}
                  </h3>

                  {propertyLocation && (
                    <span className="text-muted-foreground text-sm flex items-center font-medium">
                      <MapPin className="w-3.5 h-3.5 mr-1" />
                      {propertyLocation}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-foreground mb-4">
                  Price details
                </h3>

                <div className="space-y-3 text-sm mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">
                      {formatCurrency(
                        pricePerNight
                      )}{' '}
                      × {nights}{' '}
                      {nights === 1
                        ? 'night'
                        : 'nights'}
                    </span>

                    <span className="font-medium text-foreground">
                      {formatCurrency(basePrice)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Service fee
                    </span>

                    <span className="font-medium text-foreground">
                      {formatCurrency(
                        serviceFee
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Taxes
                    </span>

                    <span className="font-medium text-foreground">
                      {formatCurrency(taxes)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="font-extrabold text-foreground text-lg">
                    Total (INR)
                  </span>

                  <span className="font-extrabold text-primary text-xl">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>

                <div className="mt-6 rounded-xl bg-muted/60 p-4 text-sm">
                  <p className="font-semibold text-foreground">
                    Guest
                  </p>

                  <p className="text-muted-foreground mt-1">
                    {booking?.guestFullName ||
                      bookingData?.guest?.name ||
                      'Booking guest'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;