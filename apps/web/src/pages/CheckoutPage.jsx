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
  Star,
  UserCheck,
  BriefcaseBusiness,
  ChevronRight,
} from 'lucide-react';

import api from '@/lib/api.js';

const RUPEE = String.fromCharCode(0x20b9);

const formatINR = (amount) =>
  `${RUPEE}${Number(amount || 0).toLocaleString('en-IN')}`;

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

const formatDate = (value) => {
  if (!value) return 'Not selected';

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const getRating = (property) => {
  const value =
    property?.rating ??
    property?.averageRating ??
    property?.reviews?.averageRating;

  if (value === undefined || value === null || value === '') {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number.toFixed(2)
    : null;
};

const getReviewCount = (property) => {
  const value =
    property?.reviewCount ??
    property?.reviewsCount ??
    property?.reviews?.length;

  if (value === undefined || value === null) {
    return null;
  }

  return Number(value) || 0;
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { id, propertyId: routePropertyId } =
    useParams();

  const [searchParams] = useSearchParams();

  const bookingData = location.state || {};

  const propertyId =
    id ||
    routePropertyId ||
    bookingData.propertyId ||
    searchParams.get('propertyId');

  const [
    selectedPaymentMethod,
    setSelectedPaymentMethod,
  ] = useState('stripe');

  const [isCopied, setIsCopied] =
    useState(false);

  const [isWorkTrip, setIsWorkTrip] =
    useState(false);

  const [property, setProperty] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  /*
   * BOOKING DATA
   */

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

  /*
   * LOAD PROPERTY
   */

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

        const response = await api.get(
          `/properties/${propertyId}`
        );

        console.log(
          '[CHECKOUT] Property response:',
          response.data
        );

        const propertyData =
          response?.data?.data ||
          response?.data?.property ||
          response?.data;

        setProperty(propertyData);
      } catch (err) {
        console.error(
          '[CHECKOUT] Failed to load property:',
          err
        );

        setError(
          err?.response?.data?.message ||
            'Unable to load this property.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [propertyId]);

  /*
   * CALCULATE NIGHTS
   */

  const nights = useMemo(() => {
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

    const difference =
      end.getTime() - start.getTime();

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

  /*
   * PRICE CALCULATION
   *
   * Internal pricing:
   * 6% margin + 5% GST
   *
   * These are not shown as separate customer-facing
   * fee lines.
   */

  const pricePerNight = Number(
    bookingData.pricePerNight ||
      property?.pricePerNight ||
      property?.price ||
      0
  );

  const subtotal =
    bookingData.basePrice !== undefined
      ? Number(bookingData.basePrice)
      : pricePerNight * nights;

  const serviceFee =
    bookingData.serviceFee !== undefined
      ? Number(bookingData.serviceFee)
      : Math.round(subtotal * 0.05);

  const gst =
    subtotal > 0
      ? Math.round(subtotal * 0.05)
      : 0;

  const calculatedTotal =
    subtotal + serviceFee + gst;

  const totalAmount =
    bookingData.totalPrice !== undefined
      ? Number(bookingData.totalPrice)
      : calculatedTotal;

  /*
   * OPTIONAL DISCOUNT
   *
   * Only display if real booking data contains
   * a discount.
   */

  const discount = Number(
    bookingData.discount ||
      bookingData.discountAmount ||
      0
  );

  const displayTotal =
    discount > 0
      ? Math.max(0, totalAmount - discount)
      : totalAmount;

  /*
   * BANK DETAILS
   */

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

  /*
   * COPY PAYMENT DETAILS
   */

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
      } catch (copyError) {
        console.error(
          'Failed to copy payment details:',
          copyError
        );
      }
    };

  /*
   * PROPERTY META
   */

  const propertyImage =
    getImageUrl(property);

  const propertyTitle =
    property?.title ||
    property?.name ||
    'Your stay';

  const propertyLocation =
    property?.location ||
    property?.city ||
    property?.destination ||
    'India';

  const rating = getRating(property);
  const reviewCount =
    getReviewCount(property);

  const isSuperhost =
    property?.isSuperhost ||
    property?.superhost ||
    property?.host?.isSuperhost;

  /*
   * LOADING
   */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>
            Loading your booking...
          </span>
        </div>
      </div>
    );
  }

  /*
   * ERROR
   */

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold mb-3">
            Property not found
          </h1>

          <p className="text-muted-foreground mb-6">
            {error ||
              'This property could not be loaded.'}
          </p>

          <button
            onClick={() =>
              navigate('/properties')
            }
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          Confirm & Pay | {propertyTitle} | Take On BnB
        </title>
      </Helmet>

      <div className="min-h-screen bg-background pb-28 lg:pb-12">

        {/* HEADER */}

        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">
              Confirm and pay
            </h1>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-10">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* LEFT */}

            <div className="lg:col-span-7 space-y-6">

              {/* PROPERTY CARD */}

              <section className="border-b border-border pb-6">

                <div className="flex gap-4">

                  <img
                    src={propertyImage}
                    alt={propertyTitle}
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover shrink-0"
                    onError={(event) => {
                      event.currentTarget.src =
                        FALLBACK_IMAGE;
                    }}
                  />

                  <div className="min-w-0 flex-1">

                    <p className="text-sm text-muted-foreground mb-2">
                      Entire home
                    </p>

                    <h2 className="text-xl sm:text-2xl font-semibold leading-tight text-foreground">
                      {propertyTitle}
                    </h2>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-4 text-sm text-muted-foreground">

                      {rating && (
                        <span className="inline-flex items-center gap-1 text-foreground font-medium">
                          <Star className="w-4 h-4 fill-current" />
                          {rating}
                          {reviewCount !== null && (
                            <span>
                              ({reviewCount})
                            </span>
                          )}
                        </span>
                      )}

                      {isSuperhost && (
                        <span className="inline-flex items-center gap-1">
                          <UserCheck className="w-4 h-4" />
                          Superhost
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {propertyLocation}
                      </span>

                    </div>

                  </div>
                </div>
              </section>

              {/* CANCELLATION */}

              <section className="border-b border-border pb-6">

                <div className="flex items-start justify-between gap-6">

                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">
                      Cancellation policy
                    </h3>

                    <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Review the property's cancellation
                      policy before completing payment.
                    </p>
                  </div>

                  <div className="hidden sm:flex w-12 h-12 rounded-full bg-muted items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6 text-foreground" />
                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/property/${propertyId}`
                    )
                  }
                  className="mt-4 text-sm font-semibold underline underline-offset-4 hover:text-primary"
                >
                  View property details
                </button>

              </section>

              {/* YOUR TRIP */}

              <section className="border-b border-border pb-6">

                <div className="flex items-center justify-between mb-6">

                  <h2 className="text-2xl font-bold text-foreground">
                    Your trip
                  </h2>

                </div>

                <div className="space-y-7">

                  {/* DATES */}

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <p className="font-bold text-base">
                        Dates
                      </p>

                      <p className="mt-2 text-muted-foreground">
                        {formatDate(checkIn)}
                        {' - '}
                        {formatDate(checkOut)}
                      </p>

                      <p className="text-sm text-muted-foreground mt-1">
                        {nights} night
                        {nights !== 1
                          ? 's'
                          : ''}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="font-semibold underline underline-offset-4"
                    >
                      Edit
                    </button>

                  </div>

                  {/* GUESTS */}

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <p className="font-bold text-base">
                        Guests
                      </p>

                      <p className="mt-2 text-muted-foreground">
                        {guests} guest
                        {guests !== 1
                          ? 's'
                          : ''}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="font-semibold underline underline-offset-4"
                    >
                      Edit
                    </button>

                  </div>

                </div>
              </section>

              {/* WORK TRIP */}

              <section className="border-b border-border pb-6">

                <div className="flex items-center justify-between gap-4">

                  <div className="flex items-center gap-4">

                    <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center">
                      <BriefcaseBusiness className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="font-bold text-base sm:text-lg">
                        Is this a work trip?
                      </h3>

                      <p className="text-sm text-muted-foreground mt-1">
                        Help us personalize your booking.
                      </p>
                    </div>

                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={isWorkTrip}
                    onClick={() =>
                      setIsWorkTrip(
                        (current) => !current
                      )
                    }
                    className={`relative w-14 h-8 rounded-full transition ${
                      isWorkTrip
                        ? 'bg-primary'
                        : 'bg-muted-foreground/30'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-all ${
                        isWorkTrip
                          ? 'left-7'
                          : 'left-1'
                      }`}
                    />
                  </button>

                </div>
              </section>

              {/* PAYMENT METHOD */}

              <section className="pt-1">

                <h2 className="text-2xl font-bold text-foreground mb-5">
                  Payment method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {/* ONLINE */}

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPaymentMethod(
                        'stripe'
                      )
                    }
                    className={`rounded-2xl border p-5 text-left transition ${
                      selectedPaymentMethod ===
                      'stripe'
                        ? 'border-primary ring-1 ring-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">

                      <CreditCard className="w-5 h-5 text-primary" />

                      <span className="font-bold">
                        Online Payment
                      </span>

                    </div>

                    <p className="mt-3 text-sm text-muted-foreground">
                      Pay securely using available
                      online payment methods.
                    </p>

                  </button>

                  {/* BANK */}

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPaymentMethod(
                        'bank'
                      )
                    }
                    className={`rounded-2xl border p-5 text-left transition ${
                      selectedPaymentMethod ===
                      'bank'
                        ? 'border-primary ring-1 ring-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">

                      <Landmark className="w-5 h-5 text-primary" />

                      <span className="font-bold">
                        Bank / UPI Transfer
                      </span>

                    </div>

                    <p className="mt-3 text-sm text-muted-foreground">
                      Transfer payment and share
                      payment proof.
                    </p>

                  </button>

                </div>

                {/* ONLINE PAYMENT */}

                {selectedPaymentMethod ===
                'stripe' ? (
                  <div className="mt-5">

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Secure encrypted payment
                    </div>

                    <CheckoutButton
                      amount={displayTotal}
                      productName={`Booking: ${propertyTitle}`}
                    />

                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-emerald-600 font-medium">
                      <ShieldCheck className="w-4 h-4" />
                      SSL Secured Payment
                    </div>

                  </div>
                ) : (
                  /* BANK / UPI */

                  <div className="mt-5 rounded-2xl border border-border bg-muted/30 p-5 space-y-5">

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Transfer{' '}
                      <strong className="text-foreground">
                        {formatINR(displayTotal)}
                      </strong>{' '}
                      to the account below and share
                      the payment screenshot for booking
                      confirmation.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                      {bankDetails.map(
                        (detail) => (
                          <div
                            key={detail.label}
                            className="rounded-xl border border-border bg-background p-4"
                          >
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              {detail.label}
                            </p>

                            <p className="mt-1 font-medium break-all">
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
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary transition"
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

              </section>

            </div>

            {/* RIGHT / TOTAL */}

            <aside className="lg:col-span-5">

              <div className="lg:sticky lg:top-24">

                <section className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">

                  {/* PROPERTY SUMMARY */}

                  <div className="p-5 border-b border-border">

                    <div className="flex gap-4">

                      <img
                        src={propertyImage}
                        alt={propertyTitle}
                        className="w-24 h-24 rounded-xl object-cover shrink-0"
                        onError={(event) => {
                          event.currentTarget.src =
                            FALLBACK_IMAGE;
                        }}
                      />

                      <div className="min-w-0">

                        <p className="text-sm text-muted-foreground mb-1">
                          Entire home
                        </p>

                        <h3 className="font-bold text-lg leading-tight">
                          {propertyTitle}
                        </h3>

                        <p className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {propertyLocation}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* TOTAL */}

                  <div className="p-5 sm:p-6">

                    <h2 className="text-2xl font-bold mb-6">
                      Your total
                    </h2>

                    <div className="space-y-4">

                      <div className="flex items-start justify-between gap-6">

                        <span className="text-muted-foreground">
                          {formatINR(pricePerNight)} x {nights} night
                          {nights !== 1 ? 's' : ''}
                        </span>

                        <span className="font-medium text-right">
                          {formatINR(subtotal)}
                        </span>

                      </div>

                      <div className="flex items-start justify-between gap-6">

                        <span className="text-muted-foreground">
                          Taxes &amp; charges
                        </span>

                        <span className="font-medium text-right">
                          {formatINR(serviceFee + gst)}
                        </span>

                      </div>

                    </div>

                    <div className="my-5 border-t border-border" />

                    <div className="flex items-center justify-between gap-6">

                      <div>
                        <p className="font-bold text-lg">
                          Total
                        </p>
                      </div>

                      <span className="font-extrabold text-xl">
                        {formatINR(displayTotal)}
                      </span>

                    </div>

                  </div>

                </section>

                {/* SECURITY NOTE */}

                <div className="mt-4 px-2 flex items-start gap-3 text-sm text-muted-foreground">

                  <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600" />

                  <p>
                    Your payment information is
                    handled securely through the
                    selected payment method.
                  </p>

                </div>

              </div>

            </aside>

          </div>
        </main>

        {/* MOBILE STICKY PAY BAR */}

        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border p-3 lg:hidden">

          <div className="max-w-6xl mx-auto flex items-center gap-4">

            <div className="flex-1 min-w-0">

              <p className="text-xs text-muted-foreground">
                Total
              </p>

              <p className="font-extrabold text-lg">
                {formatINR(displayTotal)}
              </p>

            </div>

            {selectedPaymentMethod ===
            'stripe' ? (
              <div className="w-[58%]">
                <CheckoutButton
                  amount={displayTotal}
                  productName={`Booking: ${propertyTitle}`}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth',
                  });
                }}
                className="flex-1 max-w-[220px] bg-primary text-primary-foreground rounded-xl py-3 px-5 font-bold"
              >
                Payment details
              </button>
            )}

          </div>

        </div>

      </div>
    </>
  );
};

export default CheckoutPage;
