import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
} from 'react-router-dom';
import CheckoutButton from '@/components/CheckoutButton.jsx';

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
  Loader2,
} from 'lucide-react';

import api from '@/lib/api.js';

const formatINR = (amount) =>
  `₹${Number(amount || 0).toLocaleString('en-IN')}`;

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop';

const getImageUrl = (property) => {
  if (!property) return FALLBACK_IMAGE;

  if (property.coverImage) {
    return property.coverImage;
  }

  if (property._staticImage) {
    return property._staticImage;
  }

  if (
    Array.isArray(property.photos) &&
    property.photos.length > 0
  ) {
    const photo = property.photos[0];

    if (typeof photo === 'string') {
      return photo;
    }

    if (photo && typeof photo === 'object') {
      return (
        photo.url ||
        photo.src ||
        photo.image ||
        FALLBACK_IMAGE
      );
    }
  }

  return FALLBACK_IMAGE;
};

const CheckoutPage = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const { id, propertyId: routePropertyId } = useParams();

  const [searchParams] = useSearchParams();

  const bookingData = location.state || {};

  const propertyId =
    id ||
    routePropertyId ||
    bookingData.propertyId ||
    searchParams.get('propertyId');

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState('stripe');

  const [isCopied, setIsCopied] = useState(false);

  const [property, setProperty] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  /*
    BOOKING DATA

    Priority:
    1. Data coming from BookingWidget
    2. URL search params
  */

  const checkIn =
    bookingData.checkInDate ||
    searchParams.get('checkIn') ||
    '';

  const checkOut =
    bookingData.checkOutDate ||
    searchParams.get('checkOut') ||
    '';

  const guests =
    Number(
      bookingData.guestCount ||
      searchParams.get('guests') ||
      1
    );

  useEffect(() => {
    const loadProperty = async () => {
      if (!propertyId) {
        setError('Property ID not found.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        setError('');

        const { data } = await api.get(
          `/properties/${propertyId}`
        );

        setProperty(data);
      } catch (err) {
        console.error(
          'Failed to load property:',
          err
        );

        setError('Unable to load this property.');
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [propertyId]);

  const nights = useMemo(() => {
    /*
      If BookingWidget already calculated nights,
      use that value.
    */

    if (bookingData.nights) {
      return Number(bookingData.nights);
    }

    if (!checkIn || !checkOut) {
      return 1;
    }

    const start = new Date(
      `${checkIn}T00:00:00`
    );

    const end = new Date(
      `${checkOut}T00:00:00`
    );

    const difference = end - start;

    const calculatedNights = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    return calculatedNights > 0
      ? calculatedNights
      : 1;

  }, [
    checkIn,
    checkOut,
    bookingData.nights,
  ]);

  const pricePerNight = Number(
    bookingData.pricePerNight ||
    property?.pricePerNight ||
    property?.price ||
    0
  );

  /*
    Use booking values if they were sent
    from BookingWidget.
  */

  const cleaningFee =
    bookingData.cleaningFee !== undefined
      ? Number(bookingData.cleaningFee)
      : 1500;

  const serviceFee =
    bookingData.serviceFee !== undefined
      ? Number(bookingData.serviceFee)
      : Math.round(
          pricePerNight *
          nights *
          0.12
        );

  const subtotal =
    bookingData.basePrice !== undefined
      ? Number(bookingData.basePrice)
      : pricePerNight * nights;

  const totalAmount =
    bookingData.totalPrice !== undefined
      ? Number(bookingData.totalPrice)
      : subtotal +
        cleaningFee +
        serviceFee;

  const bankDetails = [
    {
      label: 'Bank Name',
      value: 'KKBK',
    },
    {
      label: 'Account Holder',
      value: 'TakeOn BnB',
    },
    {
      label: 'Account Number',
      value: '9749885381',
    },
    {
      label: 'IFSC Code',
      value: 'KKBK00051175',
    },
    {
      label: 'UPI ID',
      value: 'takeonbnb@upi',
    },
  ];

  const paymentDetailsText =
    bankDetails
      .map(
        ({ label, value }) =>
          `${label}: ${value}`
      )
      .join('\n');

  const handleCopyPaymentDetails =
    async () => {
      try {
        if (
          navigator?.clipboard?.writeText
        ) {
          await navigator.clipboard.writeText(
            paymentDetailsText
          );
        }

        setIsCopied(true);

        window.setTimeout(() => {
          setIsCopied(false);
        }, 2000);

      } catch (error) {
        console.error(
          'Failed to copy payment details:',
          error
        );
      }
    };

  if (loading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">

        <div className="flex items-center gap-3 text-muted-foreground">

          <Loader2 className="w-6 h-6 animate-spin" />

          <span>
            Loading your booking...
          </span>

        </div>

      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4">

        <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 text-center shadow-sm">

          <h1 className="text-xl font-bold mb-3">
            Property not found
          </h1>

          <p className="text-muted-foreground mb-6">
            {error ||
              'This property could not be loaded.'}
          </p>

          <button
            onClick={() => navigate('/properties')}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />

            Back to properties
          </button>

        </div>

      </div>
    );
  }

  const propertyImage =
    getImageUrl(property);

  return (
    <div className="min-h-[85vh] bg-muted/20 py-12 px-4">

      <Helmet>
        <title>
          Checkout |{' '}
          {property.title ||
            property.name}{' '}
          | Take On BnB
        </title>
      </Helmet>

      <div className="max-w-5xl mx-auto">

        {/* BACK BUTTON */}

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4" />

          Back to property
        </button>

        <h1 className="text-3xl font-extrabold text-foreground mb-8">
          Confirm your booking
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT SIDE */}

          <div className="lg:col-span-7 space-y-8">

            {/* TRIP DETAILS */}

            <div className="bg-card rounded-3xl p-6 border border-border shadow-sm">

              <h2 className="text-xl font-bold text-foreground mb-4">
                Trip Details
              </h2>

              <div className="grid sm:grid-cols-2 gap-6">

                <div className="space-y-1">

                  <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">

                    <Calendar className="w-4 h-4" />

                    Dates

                  </span>

                  <p className="text-foreground font-medium">

                    {checkIn || 'Select check-in date'}

                    {' - '}

                    {checkOut ||
                      'Select check-out date'}

                  </p>

                  <p className="text-sm text-muted-foreground">
                    {nights} night
                    {nights !== 1 ? 's' : ''}
                  </p>

                </div>

                <div className="space-y-1">

                  <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">

                    <Users className="w-4 h-4" />

                    Guests

                  </span>

                  <p className="text-foreground font-medium">

                    {guests} guest
                    {guests !== 1
                      ? 's'
                      : ''}

                  </p>

                </div>

              </div>

            </div>

            {/* PAYMENT METHOD */}

            <div className="bg-card rounded-3xl p-6 border border-border shadow-sm">

              <h2 className="text-xl font-bold text-foreground mb-4">
                Payment method
              </h2>

              <div className="grid gap-3 md:grid-cols-2 mb-6">

                {/* ONLINE PAYMENT */}

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
                      Online Payment
                    </span>

                  </div>

                  <p className="text-sm text-muted-foreground">
                    Pay securely using available
                    online payment methods.
                  </p>

                </button>

                {/* BANK PAYMENT */}

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
                      Bank / UPI Transfer
                    </span>

                  </div>

                  <p className="text-sm text-muted-foreground">
                    Transfer payment and share
                    payment proof.
                  </p>

                </button>

              </div>

              {/* ONLINE PAYMENT */}

              {selectedPaymentMethod ===
              'stripe' ? (

                <>

                  <p className="text-muted-foreground mb-6 text-sm">
                    Complete your payment securely
                    to confirm this booking.
                  </p>

                  <CheckoutButton
                    amount={totalAmount}
                    productName={`Booking: ${
                      property.title ||
                      property.name
                    }`}
                  />

                  <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-emerald-600">

                    <ShieldCheck className="w-4 h-4" />

                    SSL Secured Payment

                  </div>

                </>

              ) : (

                /* BANK / UPI */

                <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-4">

                  <p className="text-sm text-muted-foreground">

                    Transfer{' '}

                    {formatINR(
                      totalAmount
                    )}

                    {' '}to the account below and
                    share the payment screenshot
                    for booking confirmation.

                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">

                    {bankDetails.map(
                      (detail) => (

                        <div
                          key={detail.label}
                          className="rounded-xl border border-border bg-background/80 p-3"
                        >

                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">

                            {detail.label}

                          </p>

                          <p className="mt-1 font-medium text-foreground">

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

          {/* RIGHT SIDE - PROPERTY */}

          <div className="lg:col-span-5">

            <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden sticky top-24">

              <div className="flex gap-4 p-6 border-b border-border">

                <img
                  src={propertyImage}
                  alt={
                    property.title ||
                    property.name
                  }
                  className="w-24 h-24 rounded-xl object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      FALLBACK_IMAGE;
                  }}
                />

                <div>

                  <h3 className="font-bold text-foreground text-lg leading-tight mb-1">

                    {property.title ||
                      property.name}

                  </h3>

                  <span className="text-muted-foreground text-sm flex items-center font-medium">

                    <MapPin className="w-3.5 h-3.5 mr-1" />

                    {property.location ||
                      'India'}

                  </span>

                </div>

              </div>

              {/* PRICE DETAILS */}

              <div className="p-6">

                <h3 className="font-bold text-foreground mb-4">
                  Price details
                </h3>

                <div className="space-y-3 text-sm mb-6">

                  <div className="flex justify-between">

                    <span className="text-muted-foreground">

                      {formatINR(
                        pricePerNight
                      )}

                      {' '}× {nights} night
                      {nights !== 1
                        ? 's'
                        : ''}

                    </span>

                    <span className="font-medium text-foreground">

                      {formatINR(subtotal)}

                    </span>

                  </div>

                  {cleaningFee > 0 && (

                    <div className="flex justify-between">

                      <span className="text-muted-foreground">
                        Cleaning fee
                      </span>

                      <span className="font-medium text-foreground">

                        {formatINR(
                          cleaningFee
                        )}

                      </span>

                    </div>

                  )}

                  {serviceFee > 0 && (

                    <div className="flex justify-between">

                      <span className="text-muted-foreground">
                        Take On BnB service fee
                      </span>

                      <span className="font-medium text-foreground">

                        {formatINR(
                          serviceFee
                        )}

                      </span>

                    </div>

                  )}

                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border">

                  <span className="font-extrabold text-foreground text-lg">
                    Total
                  </span>

                  <span className="font-extrabold text-foreground text-xl">

                    {formatINR(
                      totalAmount
                    )}

                  </span>

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