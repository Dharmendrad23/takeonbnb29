import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, FileText } from 'lucide-react';
import DateRangePicker from '@/components/DateRangePicker.jsx';
import PriceBreakdown from '@/components/PriceBreakdown.jsx';
import UPIPaymentSection from '@/components/UPIPaymentSection.jsx';
import PaymentVerificationForm from '@/components/PaymentVerificationForm.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';
import api from '@/lib/api.js';
import apiServerClient from '@/lib/apiServerClient.js';
import { formatCurrency } from '@/lib/bookingUtils.js';

const BookingFlowModal = ({ isOpen, onClose, property, initialDates, initialGuests }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(initialDates ? 2 : 1);
  
  // Step 1: Dates & Guests
  const [checkIn, setCheckIn] = useState(initialDates?.checkIn || null);
  const [checkOut, setCheckOut] = useState(initialDates?.checkOut || null);
  const [guests, setGuests] = useState(initialGuests || 1);
  
  // Step 2: Details
  const [guestDetails, setGuestDetails] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    specialRequests: ''
  });

  // Step 3: Payment
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const pricePerNight = property?.pricePerNight || 0;
  let nights = 0;
  if (checkIn && checkOut) {
    const diffTime = checkOut - checkIn;
    nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  const subtotal = nights * pricePerNight;
  const serviceFee = subtotal * 0.10;
  const taxes = subtotal * 0.05;
  const total = subtotal + serviceFee + taxes;

  const handleNext = () => {
    if (step === 1 && (!checkIn || !checkOut)) {
      toast.error('Please select both check-in and check-out dates.');
      return;
    }
    if (step === 2 && (!guestDetails.name || !guestDetails.email || !guestDetails.phone)) {
      toast.error('Please fill in all required details.');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handlePaymentSubmit = async (verificationData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('propertyId', property.id);
      if (currentUser?.id) {
        formData.append('guestId', currentUser.id);
      }
      formData.append('guestFullName', verificationData.guestName);
      formData.append('guestEmail', guestDetails.email);
      formData.append('guestMobileNumber', verificationData.phone);
      formData.append('specialRequests', guestDetails.specialRequests);
      formData.append('propertyName', property.title);
      
      const checkInISO = new Date(checkIn);
      checkInISO.setHours(14, 0, 0, 0);
      formData.append('checkInDate', checkInISO.toISOString());
      
      const checkOutISO = new Date(checkOut);
      checkOutISO.setHours(11, 0, 0, 0);
      formData.append('checkOutDate', checkOutISO.toISOString());
      
      formData.append('guestCount', guests);
      formData.append('totalPrice', total);
      formData.append('totalAmount', total);
      
      // UPI specifics
      formData.append('upiId', 'dharmendrashah1439-1@okhdfcbank');
      formData.append('transactionId', verificationData.transactionId);
      if (verificationData.screenshot) {
        formData.append('paymentScreenshot', verificationData.screenshot);
      }
      
      formData.append('status', 'pending'); 
      formData.append('bookingStatus', 'pending_verification');
      formData.append('paymentStatus', 'pending');
      formData.append('paymentMethod', 'upi');
      formData.append('bookingStep', 5);

     const { data } = await api.post("/bookings", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

setBookingId(data._id || data.id);

      try {
        await apiServerClient.fetch('/bookings/send-booking-confirmation-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
  bookingId: data._id || data.id,
})
        toast.success('Booking submitted successfully. A confirmation message has been sent.');
      } catch (messageError) {
        console.error('Failed to send booking confirmation message:', messageError);
        toast.success('Booking submitted successfully. We will follow up with confirmation shortly.');
      }
      
      setStep(4); // Success step
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const finishFlow = () => {
    onClose();
    navigate(`/guest/bookings`);
  };

  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && step !== 4) onClose();
    }}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-card border-border rounded-2xl shadow-lg">
        <DialogHeader className="p-6 pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            {step > 1 && step < 4 && (
              <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8 rounded-full">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">
                {step === 1 && 'Select dates & guests'}
                {step === 2 && 'Your details'}
                {step === 3 && 'Payment Verification'}
                {step === 4 && 'Booking Pending Verification'}
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
            {step === 1 && (
              <motion.div key="step1" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <div className="bg-muted p-4 rounded-xl">
                  <p className="font-semibold text-lg">{formatCurrency(pricePerNight)} <span className="text-sm text-muted-foreground font-normal">/ night</span></p>
                </div>
                <DateRangePicker 
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onCheckInChange={setCheckIn}
                  onCheckOutChange={setCheckOut}
                />
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                  <div>
                    <h3 className="font-semibold text-foreground">Guests</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setGuests(Math.max(1, guests - 1))} disabled={guests <= 1}>-</Button>
                    <span className="w-4 text-center font-medium">{guests}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setGuests(Math.min(10, guests + 1))}>+</Button>
                  </div>
                </div>
                {nights > 0 && (
                  <PriceBreakdown 
                    pricePerNight={pricePerNight}
                    nights={nights}
                    subtotal={subtotal}
                    serviceFee={serviceFee}
                    taxes={taxes}
                    total={total}
                  />
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={guestDetails.name} onChange={e => setGuestDetails({...guestDetails, name: e.target.value})} placeholder="John Doe" className="rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={guestDetails.email} onChange={e => setGuestDetails({...guestDetails, email: e.target.value})} placeholder="john@example.com" className="rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input type="tel" value={guestDetails.phone} onChange={e => setGuestDetails({...guestDetails, phone: e.target.value})} placeholder="+91 9876543210" className="rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <Label>Special Requests (Optional)</Label>
                  <Input value={guestDetails.specialRequests} onChange={e => setGuestDetails({...guestDetails, specialRequests: e.target.value})} placeholder="E.g., early check-in" className="rounded-xl h-12" />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                <div className="bg-muted p-4 rounded-xl border border-border">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Amount to Pay</span>
                    <span className="text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-bold">1. Scan & Pay</h3>
                  <UPIPaymentSection amount={total} />
                </div>

                <div className="space-y-6 pt-4 border-t border-border">
                  <h3 className="text-lg font-bold">2. Upload Verification</h3>
                  <PaymentVerificationForm 
                    onSubmit={handlePaymentSubmit} 
                    isSubmitting={loading} 
                    defaultValues={{ name: guestDetails.name, phone: guestDetails.phone }}
                  />
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" variants={variants} initial="initial" animate="animate" exit="exit" className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-2">
                  <FileText className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold">Booking Submitted!</h3>
                <p className="text-muted-foreground">Your reservation at {property.title} is currently pending verification.</p>
                <div className="bg-muted p-4 rounded-xl w-full mt-4">
                  <p className="text-sm text-muted-foreground">Booking Reference</p>
                  <p className="font-mono font-bold text-lg">#{bookingId?.slice(-6).toUpperCase()}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-4">We will verify your UPI payment and confirm your booking shortly.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {step < 3 && (
          <div className="p-4 border-t border-border/50 flex justify-between items-center bg-card">
            {step === 1 ? (
              <p className="text-sm font-medium ml-2 underline cursor-pointer hover:text-primary" onClick={() => { setCheckIn(null); setCheckOut(null); }}>Clear dates</p>
            ) : (
              <div></div>
            )}
            
            <Button 
              onClick={handleNext} 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 rounded-xl h-11"
              disabled={step === 1 && (!checkIn || !checkOut)}
            >
              Continue
            </Button>
          </div>
        )}
        
        {step === 4 && (
          <div className="p-4 border-t border-border/50 bg-card">
            <Button onClick={finishFlow} className="w-full bg-primary hover:bg-primary/90 font-bold rounded-xl h-12">
              View My Bookings
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingFlowModal;