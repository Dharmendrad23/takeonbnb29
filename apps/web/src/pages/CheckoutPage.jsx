import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useSearchParams, useLocation, useParams } from 'react-router-dom';
import {
  ShieldCheck,
  MapPin,
  Calendar,
  Users,
  ArrowLeft,
  Loader2,
  CreditCard,
} from 'lucide-react';

import CashfreePaymentButton from '@/components/CashfreePaymentButton.jsx';
import api from '@/lib/api.js';

const formatINR = (amount) =>
  `?${Number(amount || 0).toLocaleString('en-IN')}`;

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop';

const getImageUrl = (property) => {
  if (!property) return FALLBACK_IMAGE;

  if (property.coverImage) return property.coverImage;

  if (property._staticImage) return property._staticImage;

  if (Array.isArray(property.photos) && property.photos.length > 0) {
    const photo = property.photos[0];

    if (typeof photo === 'string') return photo;

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
  const { propertyId: routePropertyId } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const bookingData = location.state?.booking || location.state || {};
  const stateProperty = location.state?.property || null;

  const propertyId =
    bookingData.propertyId ||
    bookingData.property?.id ||
    bookingData.property?._id ||
    stateProperty?.id ||
    stateProperty?._id ||
    searchParams.get('propertyId') ||
    routePropertyId;

  const bookingId = bookingData.bookingId || bookingData.id || bookingData._id || searchParams.get('bookingId') || routePropertyId || '';
  const [property, setProperty] = useState(stateProperty);
  const [loading, setLoading] = useState(!stateProperty);
  const [error, setError] = useState('');

  const checkIn =
    bookingData.checkInDate ||
    bookingData.checkIn ||
    searchParams.get('checkIn') ||
    '';

  const checkOut =
    bookingData.checkOutDate ||
    bookingData.checkOut ||
    searchParams.get('checkOut') ||
    '';

  const guests = Number(
    bookingData.guestCount ||
    bookingData.guests ||
    searchParams.get('guests') ||
    1
  );

  useEffect(() => {
    const loadProperty = async () => {
      if (property) {
        setLoading(false);
        return;
      }

      if (!propertyId) {
        setError('Property information is missing.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const response = await api.get(
          `/properties/${encodeURIComponent(propertyId)}`
        );

        const propertyData =
          response?.data?.data ||
          response?.data?.property ||
          response?.data;

        setProperty(propertyData);
      } catch (err) {
        console.error('[CHECKOUT] Property load error:', err);

        setError(
          err?.response?.data?.message ||
          'Unable to load this property.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [property, propertyId]);

  const nights = useMemo(() => {
    if (bookingData.nights) {
      return Math.max(1, Number(bookingData.nights));
    }

    if (!checkIn || !checkOut) return 1;

    const start = new Date(`${checkIn}T00:00:00`);
    const end = new Date(`${checkOut}T00:00:00`);

    const difference =
      end.getTime() - start.getTime();

    const calculated =
      Math.ceil(
        difference / (1000 * 60 * 60 * 24)
      );

    return calculated > 0 ? calculated : 1;
  }, [checkIn, checkOut, bookingData.nights]);

  const pricePerNight = Number(
    bookingData.pricePerNight ||
    property?.pricePerNight ||
    property?.price ||
    0
  );

  const basePrice =
    bookingData.basePrice !== undefined
      ? Number(bookingData.basePrice)
      : bookingData.totalPrice !== undefined
        ? Number(bookingData.totalPrice)
        : pricePerNight * nights;

  const serviceFee =
    bookingData.serviceFee !== undefined
      ? Number(bookingData.serviceFee)
      : 0;

  const calculatedTotal =
    basePrice + serviceFee;

  const totalAmount =
    bookingData.totalAmount !== undefined
      ? Number(bookingData.totalAmount)
      : bookingData.totalPrice !== undefined
        ? Number(bookingData.totalPrice)
        : calculatedTotal;

  if (loading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading your booking...</span>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold mb-3">
            Booking information not found
          </h1>

          <p className="text-muted-foreground mb-6">
            {error || 'This booking could not be loaded.'}
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

  const propertyImage = getImageUrl(property);
  const propertyName =
    property.title ||
    property.name ||
    'Your selected property';

  return (
    <div className="min-h-[85vh] bg-muted/20 py-10 px-4">
      <Helmet>
        <title>
          Confirm & Pay | {propertyName} | Take On BnB
        </title>
      </Helmet>

      <div className="max-w-5xl mx-auto">

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="mb-8">
          <p className="text-sm font-semibold text-primary mb-2">
            TAKE ON BNB
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Confirm & Pay
          </h1>

          <p className="mt-2 text-muted-foreground">
            Review your booking details and complete your secure payment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-7 space-y-6">

            {/* PROPERTY */}
            <div className="bg-card rounded-3xl p-5 border border-border shadow-sm">
              <div className="flex gap-4">
                <img
                  src={propertyImage}
                  alt={propertyName}
                  className="w-28 h-28 rounded-2xl object-cover shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />

                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-foreground">
                    {propertyName}
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {property.location ||
                      property.city ||
                      'India'}
                  </p>
                </div>
              </div>
            </div>

            {/* TRIP DETAILS */}
            <div className="bg-card rounded-3xl p-6 border border-border shadow-sm">
              <h2 className="text-xl font-bold mb-5">
                Trip Details
              </h2>

              <div className="grid sm:grid-cols-2 gap-5">

                <div className="rounded-2xl bg-muted/40 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Dates
                  </div>

                  <p className="mt-2 font-semibold">
                    {checkIn || 'Check-in'} — {checkOut || 'Check-out'}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {nights} night{nights !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="rounded-2xl bg-muted/40 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Users className="w-4 h-4" />
                    Guests
                  </div>

                  <p className="mt-2 font-semibold">
                    {guests} guest{guests !== 1 ? 's' : ''}
                  </p>
                </div>

              </div>
            </div>

            {/* PAYMENT */}
            <div className="bg-card rounded-3xl p-6 border border-border shadow-sm">

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    Secure Online Payment
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Pay securely using Cashfree.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 mb-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold">
                    Amount to pay
                  </span>

                  <span className="text-2xl font-extrabold text-primary">
                    {formatINR(totalAmount)}
                  </span>
                </div>
              </div>

              {bookingId ? (
                <CashfreePaymentButton bookingId={String(bookingId || "")}
                  amount={totalAmount}
                />
              ) : (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                  Booking ID is missing. Please go back and create the booking again.
                </div>
              )}

              <div className="mt-5 flex items-center justify-center gap-2 text-sm font-medium text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
                Secure payment powered by Cashfree
              </div>

            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5">
            <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden lg:sticky lg:top-24">

              <div className="p-6">
                <h2 className="text-xl font-bold mb-5">
                  Price Details
                </h2>

                <div className="space-y-4 text-sm">

                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">
                      {formatINR(pricePerNight)} × {nights} night
                      {nights !== 1 ? 's' : ''}
                    </span>

                    <span className="font-semibold">
                      {formatINR(basePrice)}
                    </span>
                  </div>

                  {serviceFee > 0 && (
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">
                        Take On BnB service fee
                      </span>

                      <span className="font-semibold">
                        {formatINR(serviceFee)}
                      </span>
                    </div>
                  )}

                </div>

                <div className="border-t border-border mt-6 pt-5 flex justify-between items-center">
                  <span className="text-lg font-extrabold">
                    Total
                  </span>

                  <span className="text-2xl font-extrabold">
                    {formatINR(totalAmount)}
                  </span>
                </div>
              </div>

              <div className="border-t border-border bg-muted/30 p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />

                  <div>
                    <p className="font-semibold text-sm">
                      Safe & Secure
                    </p>

                    <p className="text-xs text-muted-foreground mt-1">
                      Your payment is securely processed by Cashfree.
                    </p>
                  </div>
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











