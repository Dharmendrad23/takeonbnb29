import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, FileText, Loader2 } from 'lucide-react';

import DateRangePicker from '@/components/DateRangePicker.jsx';
import PriceBreakdown from '@/components/PriceBreakdown.jsx';
import UPIPaymentSection from '@/components/UPIPaymentSection.jsx';
import PaymentVerificationForm from '@/components/PaymentVerificationForm.jsx';

import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';
import api from '@/lib/api.js';
import { formatCurrency } from '@/lib/bookingUtils.js';

const BookingFlowModal = ({
  isOpen,
  onClose,
  property,
  initialDates,
  initialGuests,
}) => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(initialDates ? 2 : 1);

  const [checkIn, setCheckIn] = useState(
    initialDates?.checkIn || null
  );

  const [checkOut, setCheckOut] = useState(
    initialDates?.checkOut || null
  );

  const [guests, setGuests] = useState(
    initialGuests || 1
  );

  const [guestDetails, setGuestDetails] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    specialRequests: '',
  });

  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  /*
   * Keep guest information synced with logged-in user.
   */
  useEffect(() => {
    setGuestDetails((previous) => ({
      ...previous,
      name: currentUser?.name || previous.name || '',
      email: currentUser?.email || previous.email || '',
      phone: currentUser?.phone || previous.phone || '',
    }));
  }, [currentUser]);

  /*
   * Reset booking flow when modal opens.
   */
  useEffect(() => {
    if (!isOpen) return;

    setStep(initialDates ? 2 : 1);

    setCheckIn(initialDates?.checkIn || null);
    setCheckOut(initialDates?.checkOut || null);

    setGuests(
      Math.min(
        initialGuests || 1,
        property?.guestCapacity || 10
      )
    );

    setBookingId(null);

    setGuestDetails({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      specialRequests: '',
    });
  }, [
    isOpen,
    initialDates,
    initialGuests,
    property?.guestCapacity,
    currentUser,
  ]);

  /*
   * Price calculation.
   */
  const pricePerNight = Number(
    property?.pricePerNight || 0
  );

  let nights = 0;

  if (checkIn && checkOut) {
    const checkInTime = new Date(checkIn).getTime();
    const checkOutTime = new Date(checkOut).getTime();

    const diffTime = checkOutTime - checkInTime;

    if (diffTime > 0) {
      nights = Math.ceil(
        diffTime / (1000 * 60 * 60 * 24)
      );
    }
  }

  const subtotal = nights * pricePerNight;
  const serviceFee = subtotal * 0.1;
  const taxes = subtotal * 0.05;
  const total = subtotal + serviceFee + taxes;

  /*
   * Continue to next step.
   */
  const handleNext = () => {
    /*
     * Guest must be logged in.
     */
    if (!isAuthenticated || !currentUser) {
      toast.error(
        'Please login as a guest before booking.'
      );

      onClose();

      navigate('/login', {
        state: {
          from: {
            pathname: window.location.pathname,
          },
        },
      });

      return;
    }

    /*
     * Only guest accounts can book.
     */
    if (currentUser.role !== 'guest') {
      toast.error(
        'Only guest accounts can make bookings.'
      );
      return;
    }

    /*
     * Step 1 validation.
     */
    if (step === 1) {
      if (!checkIn || !checkOut) {
        toast.error(
          'Please select both check-in and check-out dates.'
        );
        return;
      }

      if (nights <= 0) {
        toast.error(
          'Check-out date must be after check-in date.'
        );
        return;
      }

      const capacity = Number(
        property?.guestCapacity || 10
      );

      if (guests > capacity) {
        toast.error(
          `This property allows maximum ${capacity} guests.`
        );
        return;
      }
    }

    /*
     * Step 2 validation.
     */
    if (step === 2) {
      if (!guestDetails.name.trim()) {
        toast.error('Please enter your full name.');
        return;
      }

      if (!guestDetails.email.trim()) {
        toast.error('Please enter your email.');
        return;
      }

      if (!guestDetails.phone.trim()) {
        toast.error(
          'Please enter your phone number.'
        );
        return;
      }
    }

    setStep((previous) => previous + 1);
  };

  /*
   * Go back one step.
   */
  const handleBack = () => {
    if (loading) return;

    setStep((previous) =>
      Math.max(previous - 1, 1)
    );
  };

  /*
   * CREATE BOOKING
   *
   * Backend expects JSON.
   * Do NOT use FormData here.
   */
  const handlePaymentSubmit = async (
    verificationData
  ) => {
    if (loading) return;

    /*
     * Validate guest session.
     */
    if (!isAuthenticated || !currentUser?.id) {
      toast.error(
        'Guest session not found. Please login again.'
      );

      onClose();

      navigate('/login', {
        state: {
          from: {
            pathname: window.location.pathname,
          },
        },
      });

      return;
    }

    /*
     * Make sure this is actually a guest.
     */
    if (currentUser.role !== 'guest') {
      toast.error(
        'Only guest accounts can create bookings.'
      );
      return;
    }

    /*
     * Validate property.
     */
    if (!property?.id) {
      toast.error(
        'Property ID is missing. Please refresh the property page.'
      );
      return;
    }

    /*
     * Validate dates.
     */
    if (!checkIn || !checkOut) {
      toast.error(
        'Please select check-in and check-out dates.'
      );
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (
      Number.isNaN(checkInDate.getTime()) ||
      Number.isNaN(checkOutDate.getTime())
    ) {
      toast.error(
        'Invalid booking dates. Please select the dates again.'
      );
      return;
    }

    if (checkOutDate <= checkInDate) {
      toast.error(
        'Check-out must be after check-in.'
      );
      return;
    }

    /*
     * Validate payment verification.
     */
    if (
      !verificationData?.transactionId ||
      !String(
        verificationData.transactionId
      ).trim()
    ) {
      toast.error(
        'Please enter your payment transaction ID.'
      );
      return;
    }

    setLoading(true);

    try {
      /*
       * Set standard check-in/check-out times.
       */
      const bookingCheckIn = new Date(checkInDate);
      bookingCheckIn.setHours(14, 0, 0, 0);

      const bookingCheckOut = new Date(checkOutDate);
      bookingCheckOut.setHours(11, 0, 0, 0);

      /*
       * Backend Booking schema payload.
       */
      const payload = {
        propertyId: property.id,

        /*
         * IMPORTANT:
         * This is User._id.
         */
        guestId: currentUser.id,

        guestFullName:
          verificationData?.guestName ||
          guestDetails.name.trim(),

        guestEmail:
          guestDetails.email.trim().toLowerCase(),

        guestMobileNumber:
          verificationData?.phone ||
          guestDetails.phone.trim(),

        propertyName:
          property.title || '',

        checkInDate:
          bookingCheckIn.toISOString(),

        checkOutDate:
          bookingCheckOut.toISOString(),

        guestCount: Number(guests),

        totalPrice: Number(total),

        totalAmount: Number(total),

        specialRequests:
          guestDetails.specialRequests?.trim() || '',

        /*
         * Initial booking status.
         */
        status: 'pending',

        bookingStatus:
          'pending_verification',

        paymentStatus:
          'pending',

        paymentMethod:
          'upi',

        transactionId:
          String(
            verificationData.transactionId
          ).trim(),

        upiId:
          'dharmendrashah1439-1@okhdfcbank',
      };

      console.log(
        '[BOOKING] Sending payload:',
        payload
      );

      /*
       * POST /api/bookings
       */
      const response = await api.post(
        '/bookings',
        payload
      );

      console.log(
        '[BOOKING] API response:',
        response.data
      );

      /*
       * Backend returns:
       *
       * {
       *   success: true,
       *   data: populatedBooking
       * }
       */
      const createdBooking =
        response?.data?.data;

      if (!createdBooking) {
        throw new Error(
          'Booking was created but server returned no booking data.'
        );
      }

      const createdBookingId =
        createdBooking._id ||
        createdBooking.id;

      if (!createdBookingId) {
        throw new Error(
          'Booking was created but booking ID was not returned.'
        );
      }

      /*
       * Save booking ID for confirmation screen.
       */
      setBookingId(
        String(createdBookingId)
      );

      console.log(
        '[BOOKING CREATED]',
        createdBookingId
      );

      toast.success(
        'Booking submitted successfully!'
      );

      /*
       * Go to success step.
       */
      setStep(4);
    } catch (error) {
      console.error(
        '[BOOKING] Failed:',
        error
      );

      /*
       * Backend error.
       */
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error;

      const message =
        backendMessage ||
        error?.message ||
        'Failed to submit booking. Please try again.';

      /*
       * Special handling.
       */
      if (
        error?.response?.status === 409
      ) {
        toast.error(
          'These dates are already booked. Please select different dates.'
        );
      } else if (
        error?.response?.status === 401
      ) {
        toast.error(
          'Your login session has expired. Please login again.'
        );
      } else if (
        error?.response?.status === 403
      ) {
        toast.error(
          'Only guest accounts can create bookings.'
        );
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  /*
   * Finish booking flow.
   */
  const finishFlow = () => {
    onClose();

    navigate('/guest/bookings');
  };

  const variants = {
    initial: {
      opacity: 0,
      x: 20,
    },
    animate: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: -20,
    },
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && step !== 4 && !loading) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-card border-border rounded-2xl shadow-lg">
        <DialogHeader className="p-6 pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            {step > 1 && step < 4 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                disabled={loading}
                className="h-8 w-8 rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}

            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                {step === 1 &&
                  'Select dates & guests'}

                {step === 2 &&
                  'Your details'}

                {step === 3 &&
                  'Payment Verification'}

                {step === 4 &&
                  'Booking Submitted'}
              </DialogTitle>

              {step < 4 && (
                <DialogDescription className="text-sm font-medium mt-1">
                  Step {step} of 3
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 max-h-[70vh] overflow-y-auto overflow-x-hidden relative scroll-smooth">
          <AnimatePresence mode="wait">

            {/* =========================
                STEP 1
            ========================== */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div className="bg-muted p-4 rounded-xl">
                  <p className="font-semibold text-lg">
                    {formatCurrency(
                      pricePerNight
                    )}

                    <span className="text-sm text-muted-foreground font-normal">
                      {' '}
                      / night
                    </span>
                  </p>
                </div>

                <DateRangePicker
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onCheckInChange={
                    setCheckIn
                  }
                  onCheckOutChange={
                    setCheckOut
                  }
                />

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Guests
                    </h3>

                    <p className="text-xs text-muted-foreground mt-1">
                      Max{' '}
                      {property?.guestCapacity ||
                        10}{' '}
                      guests
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() =>
                        setGuests(
                          Math.max(
                            1,
                            guests - 1
                          )
                        )
                      }
                      disabled={
                        guests <= 1 ||
                        loading
                      }
                    >
                      -
                    </Button>

                    <span className="w-4 text-center font-medium">
                      {guests}
                    </span>

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() =>
                        setGuests(
                          Math.min(
                            Number(
                              property?.guestCapacity ||
                                10
                            ),
                            guests + 1
                          )
                        )
                      }
                      disabled={
                        guests >=
                          Number(
                            property?.guestCapacity ||
                              10
                          ) ||
                        loading
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>

                {nights > 0 && (
                  <PriceBreakdown
                    pricePerNight={
                      pricePerNight
                    }
                    nights={nights}
                    subtotal={subtotal}
                    serviceFee={serviceFee}
                    taxes={taxes}
                    total={total}
                  />
                )}
              </motion.div>
            )}

            {/* =========================
                STEP 2
            ========================== */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>
                    Full Name
                  </Label>

                  <Input
                    value={
                      guestDetails.name
                    }
                    onChange={(e) =>
                      setGuestDetails({
                        ...guestDetails,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter your full name"
                    className="rounded-xl h-12"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Email
                  </Label>

                  <Input
                    type="email"
                    value={
                      guestDetails.email
                    }
                    onChange={(e) =>
                      setGuestDetails({
                        ...guestDetails,
                        email: e.target.value,
                      })
                    }
                    placeholder="you@example.com"
                    className="rounded-xl h-12"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Phone Number
                  </Label>

                  <Input
                    type="tel"
                    value={
                      guestDetails.phone
                    }
                    onChange={(e) =>
                      setGuestDetails({
                        ...guestDetails,
                        phone: e.target.value,
                      })
                    }
                    placeholder="+91 9876543210"
                    className="rounded-xl h-12"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Special Requests
                    (Optional)
                  </Label>

                  <Input
                    value={
                      guestDetails.specialRequests
                    }
                    onChange={(e) =>
                      setGuestDetails({
                        ...guestDetails,
                        specialRequests:
                          e.target.value,
                      })
                    }
                    placeholder="E.g. early check-in"
                    className="rounded-xl h-12"
                    disabled={loading}
                  />
                </div>
              </motion.div>
            )}

            {/* =========================
                STEP 3
            ========================== */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8"
              >
                <div className="bg-muted p-4 rounded-xl border border-border">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>
                      Amount to Pay
                    </span>

                    <span className="text-primary">
                      {formatCurrency(
                        total
                      )}
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-bold">
                    1. Scan & Pay
                  </h3>

                  <UPIPaymentSection
                    amount={total}
                  />
                </div>

                <div className="space-y-6 pt-4 border-t border-border">
                  <h3 className="text-lg font-bold">
                    2. Payment Details
                  </h3>

                  <PaymentVerificationForm
                    onSubmit={
                      handlePaymentSubmit
                    }
                    isSubmitting={
                      loading
                    }
                    defaultValues={{
                      name:
                        guestDetails.name,
                      phone:
                        guestDetails.phone,
                    }}
                  />
                </div>
              </motion.div>
            )}

            {/* =========================
                STEP 4
            ========================== */}
            {step === 4 && (
              <motion.div
                key="step4"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col items-center justify-center py-8 space-y-4 text-center"
              >
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-2">
                  <FileText className="w-8 h-8 text-amber-600" />
                </div>

                <h3 className="text-2xl font-bold">
                  Booking Submitted!
                </h3>

                <p className="text-muted-foreground">
                  Your reservation at{' '}
                  <strong>
                    {property?.title}
                  </strong>{' '}
                  has been submitted and is
                  pending confirmation.
                </p>

                <div className="bg-muted p-4 rounded-xl w-full mt-4">
                  <p className="text-sm text-muted-foreground">
                    Booking Reference
                  </p>

                  <p className="font-mono font-bold text-lg">
                    #
                    {bookingId
                      ?.slice(-6)
                      .toUpperCase()}
                  </p>
                </div>

                <p className="text-sm text-muted-foreground mt-4">
                  You can track your booking from
                  your Guest Dashboard.
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* =========================
            CONTINUE BUTTON
        ========================== */}
        {step < 3 && (
          <div className="p-4 border-t border-border/50 flex justify-between items-center bg-card">
            {step === 1 ? (
              <button
                type="button"
                className="text-sm font-medium ml-2 underline cursor-pointer hover:text-primary disabled:opacity-50"
                onClick={() => {
                  if (loading) return;

                  setCheckIn(null);
                  setCheckOut(null);
                }}
                disabled={loading}
              >
                Clear dates
              </button>
            ) : (
              <div />
            )}

            <Button
              type="button"
              onClick={handleNext}
              disabled={
                loading ||
                (step === 1 &&
                  (!checkIn ||
                    !checkOut))
              }
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 rounded-xl h-11"
            >
              Continue
            </Button>
          </div>
        )}

        {/* =========================
            SUCCESS BUTTON
        ========================== */}
        {step === 4 && (
          <div className="p-4 border-t border-border/50 bg-card">
            <Button
              type="button"
              onClick={finishFlow}
              className="w-full bg-primary hover:bg-primary/90 font-bold rounded-xl h-12"
            >
              View My Bookings
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingFlowModal;