import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';

import api from '@/lib/api.js';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  formatCurrency,
  calculateTotalPrice,
  checkDateOverlap,
} from '@/lib/bookingUtils.js';

import { useAuth } from '@/contexts/AuthContext.jsx';

const BookingPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser, isAuthenticated } = useAuth();

  /*
   * ---------------------------------------------------------
   * BOOKING STATE
   * ---------------------------------------------------------
   */

  const stateData = location.state || {};

  const initialDates = stateData.dates || {
    checkIn: '',
    checkOut: '',
  };

  const guests = Math.max(
    Number(stateData.guests || 1),
    1
  );

  const [property, setProperty] = useState(null);
  const [existingBookings, setExistingBookings] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

  /*
   * ---------------------------------------------------------
   * AUTO-FILL LOGGED-IN USER
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    setFormData((previous) => ({
      ...previous,

      name:
        previous.name ||
        currentUser.name ||
        '',

      email:
        previous.email ||
        currentUser.email ||
        '',

      phone:
        previous.phone ||
        currentUser.phone ||
        '',
    }));
  }, [currentUser]);

  /*
   * ---------------------------------------------------------
   * FETCH PROPERTY + EXISTING BOOKINGS
   * ---------------------------------------------------------
   */

  useEffect(() => {
    let mounted = true;

    const fetchBookingData = async () => {
      if (!id) {
        toast.error('Property ID is missing.');

        if (mounted) {
          setIsLoading(false);
        }

        return;
      }

      try {
        setIsLoading(true);

        /*
         * Get property from MongoDB
         *
         * api.js already has /api as baseURL.
         *
         * Therefore:
         * api.get(`/properties/${id}`)
         *
         * becomes:
         * GET http://localhost:3001/api/properties/:id
         */

        const propertyResponse = await api.get(
          `/properties/${id}`
        );

        const propertyData = propertyResponse?.data;

        if (!propertyData) {
          throw new Error(
            'Property not found.'
          );
        }

        /*
         * Get all bookings
         */

        const bookingsResponse =
          await api.get('/bookings');

        const bookingsData =
          Array.isArray(bookingsResponse?.data)
            ? bookingsResponse.data
            : [];

        /*
         * Keep only bookings belonging to
         * this property and which are active.
         */

        const activeBookings =
          bookingsData.filter((booking) => {
            const bookingPropertyId =
              booking?.propertyId?._id ||
              booking?.propertyId?.id ||
              booking?.propertyId;

            return (
              String(bookingPropertyId) ===
                String(id) &&
              ['pending', 'confirmed'].includes(
                booking?.status
              )
            );
          });

        if (mounted) {
          setProperty(propertyData);
          setExistingBookings(activeBookings);
        }
      } catch (error) {
        console.error(
          'Booking data error:',
          error
        );

        if (mounted) {
          setProperty(null);

          toast.error(
            error?.response?.data?.message ||
              error?.message ||
              'Failed to load property details.'
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchBookingData();

    return () => {
      mounted = false;
    };
  }, [id]);

  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin" />

          <p className="text-muted-foreground">
            Loading booking details...
          </p>
        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * PROPERTY NOT FOUND
   * ---------------------------------------------------------
   */

  if (!property) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3">
            Property not found
          </h2>

          <p className="text-muted-foreground mb-6">
            This property may no longer be available.
          </p>

          <Button
            onClick={() =>
              navigate('/properties')
            }
          >
            Browse Properties
          </Button>
        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * PROPERTY ID
   * ---------------------------------------------------------
   */

  const propertyId =
    property?._id ||
    property?.id;

  /*
   * ---------------------------------------------------------
   * PRICE CALCULATION
   * ---------------------------------------------------------
   */

  const pricePerNight = Number(
    property?.pricePerNight || 0
  );

  const pricing = calculateTotalPrice(
    pricePerNight,
    initialDates.checkIn,
    initialDates.checkOut
  );

  const nights = Math.max(
    Number(pricing?.nights || 1),
    1
  );

  const calculatedSubtotal =
    Number(pricing?.subtotal || 0);

  const basePrice =
    calculatedSubtotal > 0
      ? calculatedSubtotal
      : pricePerNight * nights;

  /*
   * Take On BnB fees
   */

  const serviceFee = Math.floor(
    basePrice * 0.10
  );

  const taxes = Math.floor(
    basePrice * 0.18
  );

  const totalAmount =
    basePrice +
    serviceFee +
    taxes;

  /*
   * ---------------------------------------------------------
   * PROPERTY IMAGE
   * ---------------------------------------------------------
   */

  const propertyImage =
    property?.image ||
    property?.coverImage ||
    property?.imageUrl ||
    property?.photoUrl ||
    (
      Array.isArray(property?.photos)
        ? property.photos[0]
        : ''
    );

  /*
   * ---------------------------------------------------------
   * FORM CHANGE
   * ---------------------------------------------------------
   */

  const handleChange = (
    field,
    value
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /*
   * ---------------------------------------------------------
   * SUBMIT BOOKING
   * ---------------------------------------------------------
   */

  const handleSubmit = async (event) => {
    event.preventDefault();

    /*
     * 1. USER LOGIN CHECK
     */

    if (
      !isAuthenticated ||
      !currentUser
    ) {
      toast.error(
        'Please login before making a booking.'
      );

      navigate('/login', {
        state: {
          redirectTo: `/booking/${id}`,
          bookingState: location.state,
        },
      });

      return;
    }

    /*
     * 2. GET USER ID
     */

    const guestId =
      currentUser?.id ||
      currentUser?._id;

    if (!guestId) {
      toast.error(
        'User session is invalid. Please login again.'
      );

      return;
    }

    /*
     * 3. PROPERTY ID CHECK
     */

    if (!propertyId) {
      toast.error(
        'Property ID is missing.'
      );

      return;
    }

    /*
     * 4. DATE CHECK
     */

    if (
      !initialDates.checkIn ||
      !initialDates.checkOut
    ) {
      toast.error(
        'Please select check-in and check-out dates.'
      );

      return;
    }

    /*
     * Convert dates to Date objects
     */

    const checkInDate = new Date(
      `${initialDates.checkIn}T00:00:00`
    );

    const checkOutDate = new Date(
      `${initialDates.checkOut}T00:00:00`
    );

    /*
     * Invalid date check
     */

    if (
      Number.isNaN(
        checkInDate.getTime()
      ) ||
      Number.isNaN(
        checkOutDate.getTime()
      )
    ) {
      toast.error(
        'Invalid booking dates.'
      );

      return;
    }

    /*
     * Checkout must be after check-in
     */

    if (
      checkOutDate <= checkInDate
    ) {
      toast.error(
        'Check-out date must be after check-in date.'
      );

      return;
    }

    /*
     * 5. CHECK DATE OVERLAP
     */

    const hasOverlap =
      checkDateOverlap(
        initialDates.checkIn,
        initialDates.checkOut,
        existingBookings
      );

    if (hasOverlap) {
      toast.error(
        'These dates are already booked. Please select different dates.'
      );

      return;
    }

    /*
     * 6. FORM VALUES
     */

    const name =
      formData.name.trim();

    const email =
      formData.email
        .trim()
        .toLowerCase();

    const phone =
      formData.phone.trim();

    const specialRequests =
      formData.specialRequests.trim();

    /*
     * 7. VALIDATION
     */

    if (!name) {
      toast.error(
        'Please enter your full name.'
      );

      return;
    }

    if (!email) {
      toast.error(
        'Please enter your email.'
      );

      return;
    }

    if (!phone) {
      toast.error(
        'Please enter your phone number.'
      );

      return;
    }

    if (guests < 1) {
      toast.error(
        'At least one guest is required.'
      );

      return;
    }

    if (pricePerNight <= 0) {
      toast.error(
        'This property does not have a valid price.'
      );

      return;
    }

    /*
     * -------------------------------------------------------
     * CREATE BOOKING
     * -------------------------------------------------------
     */

    setIsSubmitting(true);

    try {
      /*
       * MongoDB Booking document
       */

      const bookingData = {
        propertyId,
        guestId,

        /*
         * Check-in: 2 PM
         */

        checkInDate:
          `${initialDates.checkIn}T14:00:00.000Z`,

        /*
         * Check-out: 11 AM
         */

        checkOutDate:
          `${initialDates.checkOut}T11:00:00.000Z`,

        guestCount: guests,

        /*
         * Store final booking amount
         */

        totalPrice: totalAmount,

        specialRequests,

        status: 'pending',
      };

      console.log(
        'Creating MongoDB booking:',
        bookingData
      );

      /*
       * POST /api/bookings
       *
       * api.js automatically adds /api.
       */

      const response =
        await api.post(
          '/bookings',
          bookingData
        );

      const booking =
        response?.data?.data ||
        response?.data;

      if (!booking) {
        throw new Error(
          'Booking was not created.'
        );
      }

      console.log(
        'Booking created successfully:',
        booking
      );

      /*
       * -------------------------------------------------------
       * SAVE CHECKOUT DATA
       * -------------------------------------------------------
       * React Router state is lost when the user refreshes
       * /checkout. Save the same data in sessionStorage so the
       * checkout page can restore it.
       */
      const checkoutData = {
        booking,
        property,
        dates: initialDates,
        guests,
        pricing: {
          nights,
          basePrice,
          serviceFee,
          taxes,
          totalAmount,
        },
      };

      try {
        sessionStorage.setItem(
          'takeonbnb_checkout_data',
          JSON.stringify(checkoutData)
        );
      } catch (storageError) {
        console.warn(
          'Could not save checkout data:',
          storageError
        );
      }

      toast.success(
        'Booking created successfully!'
      );

      /*
       * -------------------------------------------------------
       * GO TO CHECKOUT
       * -------------------------------------------------------
       */
      navigate('/checkout', {
        state: checkoutData,
      });
    } catch (error) {
      console.error(
        'Booking creation error:',
        error
      );

      /*
       * Backend error
       */

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to create booking. Please try again.';

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * UI
   * ---------------------------------------------------------
   */

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-20">

      <Helmet>
        <title>
          Complete Booking | Take On BnB
        </title>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* PAGE HEADER */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Confirm your booking
          </h1>

          <p className="text-muted-foreground mt-2">
            Enter your details and continue to payment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div>

            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >

              {/* GUEST DETAILS */}

              <div className="bg-card p-6 rounded-3xl shadow-soft border border-border">

                <h2 className="text-xl font-bold mb-6">
                  Your details
                </h2>

                <div className="space-y-5">

                  {/* NAME */}

                  <div>
                    <Label htmlFor="name">
                      Full Name
                    </Label>

                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(event) =>
                        handleChange(
                          'name',
                          event.target.value
                        )
                      }
                      className="mt-1"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* EMAIL + PHONE */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>
                      <Label htmlFor="email">
                        Email
                      </Label>

                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(event) =>
                          handleChange(
                            'email',
                            event.target.value
                          )
                        }
                        className="mt-1"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">
                        Phone Number
                      </Label>

                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(event) =>
                          handleChange(
                            'phone',
                            event.target.value
                          )
                        }
                        className="mt-1"
                        placeholder="+91"
                      />
                    </div>

                  </div>

                  {/* SPECIAL REQUESTS */}

                  <div>

                    <Label htmlFor="requests">
                      Special Requests (Optional)
                    </Label>

                    <textarea
                      id="requests"
                      rows={4}
                      value={
                        formData.specialRequests
                      }
                      onChange={(event) =>
                        handleChange(
                          'specialRequests',
                          event.target.value
                        )
                      }
                      className="w-full mt-1 flex min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Any special requests for your stay?"
                    />

                  </div>

                </div>
              </div>

              {/* SUBMIT */}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 text-lg rounded-xl"
              >
                {isSubmitting
                  ? 'Creating Booking...'
                  : 'Proceed to Payment'}
              </Button>

            </form>

          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div>

            <div className="bg-card p-6 rounded-3xl shadow-soft border border-border sticky top-28">

              {/* PROPERTY */}

              <div className="flex gap-4 mb-6 pb-6 border-b border-border">

                {propertyImage ? (
                  <img
                    src={propertyImage}
                    alt={
                      property?.title ||
                      property?.name ||
                      'Property'
                    }
                    className="w-24 h-24 rounded-xl object-cover"
                    loading="eager"
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

                  <h3 className="font-semibold truncate">
                    {property?.title ||
                      property?.name ||
                      'Property'}
                  </h3>

                  <p className="text-sm text-muted-foreground mt-1">
                    {property?.location ||
                      property?.city ||
                      ''}
                  </p>

                  <p className="text-sm font-medium mt-2">
                    {guests}{' '}
                    {guests > 1
                      ? 'Guests'
                      : 'Guest'}
                  </p>

                </div>
              </div>

              {/* STAY DETAILS */}

              <div className="mb-6 pb-6 border-b border-border">

                <h3 className="font-bold text-lg mb-4">
                  Stay details
                </h3>

                <div className="grid grid-cols-2 gap-4 text-sm">

                  <div>
                    <p className="text-muted-foreground">
                      Check-in
                    </p>

                    <p className="font-semibold mt-1">
                      {initialDates.checkIn ||
                        'Not selected'}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">
                      Check-out
                    </p>

                    <p className="font-semibold mt-1">
                      {initialDates.checkOut ||
                        'Not selected'}
                    </p>
                  </div>

                </div>
              </div>

              {/* PRICE DETAILS */}

              <h3 className="font-bold text-lg mb-4">
                Price details
              </h3>

              <div className="space-y-3 text-sm mb-6 pb-6 border-b border-border">

                <div className="flex justify-between gap-4">

                  <span className="text-muted-foreground">
                    {formatCurrency(
                      pricePerNight
                    )}
                    {' × '}
                    {nights}{' '}
                    {nights > 1
                      ? 'nights'
                      : 'night'}
                  </span>

                  <span className="font-medium">
                    {formatCurrency(
                      basePrice
                    )}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-muted-foreground">
                    Service fee
                  </span>

                  <span>
                    {formatCurrency(
                      serviceFee
                    )}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-muted-foreground">
                    Taxes
                  </span>

                  <span>
                    {formatCurrency(
                      taxes
                    )}
                  </span>

                </div>

              </div>

              {/* TOTAL */}

              <div className="flex justify-between items-center font-bold text-lg">

                <span>
                  Total (INR)
                </span>

                <span className="text-primary">
                  {formatCurrency(
                    totalAmount
                  )}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default BookingPage;