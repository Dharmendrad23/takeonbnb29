import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar as CalendarIcon, Users, MessageSquare, User, Mail, Home, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/bookingUtils.js';
import { validateBookingForm } from '@/lib/validateBookingForm.js';
import { FormFieldWrapper } from '@/components/FormFieldWrapper.jsx';
import { PhoneNumberInput } from '@/components/PhoneNumberInput.jsx';
import { BookingSuccessModal } from '@/components/BookingSuccessModal.jsx';

export const BookingForm = ({ propertyId, initialPrice = 0 }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [completedBooking, setCompletedBooking] = useState(null);

  const getInitialState = () => ({
    propertyId: propertyId || '',
    guestFullName: currentUser?.name || '',
    guestEmail: currentUser?.email || '',
    guestMobileNumber: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    specialRequests: '',
    termsAccepted: false
  });

  const [formData, setFormData] = useState(getInitialState());
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const records = await pb.collection('properties').getFullList({ $autoCancel: false });
        setProperties(records);
        if (propertyId) {
          const activeProp = records.find(p => p.id === propertyId);
          setSelectedProperty(activeProp);
        }
      } catch (error) {
        toast.error("Failed to load properties for booking. Please refresh.");
      }
    };
    fetchProperties();
  }, [propertyId]);

  useEffect(() => {
    if (formData.propertyId) {
      const activeProp = properties.find(p => p.id === formData.propertyId);
      setSelectedProperty(activeProp);
    }
  }, [formData.propertyId, properties]);

  const activePricePerNight = selectedProperty ? selectedProperty.pricePerNight : initialPrice;
  
  // Calculate Detailed Pricing
  let nights = 0;
  let subtotal = 0;
  let taxes = 0;
  let serviceFee = 0;
  let total = 0;

  if (formData.checkIn && formData.checkOut) {
    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      nights = diffDays;
      subtotal = nights * activePricePerNight;
      taxes = subtotal * 0.18; // 18% GST
      serviceFee = subtotal * 0.05; // 5% platform fee
      total = subtotal + taxes + serviceFee;
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const currentErrors = validateBookingForm({ ...formData, [field]: value });
      setErrors(prev => ({ ...prev, [field]: currentErrors[field] }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const currentErrors = validateBookingForm(formData);
    setErrors(prev => ({ ...prev, [field]: currentErrors[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const allTouched = Object.keys(formData).reduce((acc, key) => ({...acc, [key]: true}), {});
    setTouched(allTouched);

    const validationErrors = validateBookingForm(formData);
    
    // Additional Date validation
    if (formData.checkIn && formData.checkOut) {
      const start = new Date(formData.checkIn);
      const end = new Date(formData.checkOut);
      if (end <= start) {
        validationErrors.checkOut = "Check-out must be after check-in date";
      }
    }
    
    if (!formData.termsAccepted) {
      validationErrors.termsAccepted = "You must agree to the Terms and Conditions";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please correct the highlighted errors before submitting.');
      return;
    }

    if (!currentUser) {
      toast.error('Please log in to make a booking');
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    setLoading(true);

    try {
      const checkInFormatted = `${formData.checkIn} 14:00:00.000Z`;
      const checkOutFormatted = `${formData.checkOut} 11:00:00.000Z`;

      const bookingData = {
        propertyId: formData.propertyId,
        guestId: currentUser.id,
        guestFullName: formData.guestFullName,
        guestEmail: formData.guestEmail,
        guestMobileNumber: formData.guestMobileNumber,
        propertyName: selectedProperty?.title || 'Take On BNB Property',
        checkInDate: checkInFormatted,
        checkOutDate: checkOutFormatted,
        guestCount: parseInt(formData.guests, 10),
        totalPrice: total,
        totalAmount: total,
        specialRequests: formData.specialRequests,
        status: 'pending',
        bookingStatus: 'pending',
        paymentStatus: 'pending'
      };

      const record = await pb.collection('bookings').create(bookingData, { $autoCancel: false });
      
      setCompletedBooking(record);
      setSuccessModalOpen(true);
      
      setFormData(getInitialState());
      setTouched({});
      setErrors({});
      
    } catch (error) {
      toast.error(error.message || 'Failed to complete booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAnother = () => {
    setSuccessModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const minCheckOutStr = formData.checkIn ? new Date(new Date(formData.checkIn).getTime() + 86400000).toISOString().split('T')[0] : todayStr;

  return (
    <>
      <Card id="booking-form" className="border-border shadow-luxury bg-card text-card-foreground overflow-hidden scroll-mt-24 transition-all duration-500 hover:shadow-luxury-hover">
        <div className="h-2 w-full bg-gradient-orange" />
        <CardContent className="p-6 md:p-10">
          <div className="flex flex-col mb-8 text-center sm:text-left">
            <h3 className="font-serif text-3xl font-bold text-foreground mb-2">Reserve Your Stay</h3>
            {activePricePerNight > 0 ? (
              <div className="flex items-baseline justify-center sm:justify-start gap-2">
                <span className="text-3xl font-bold text-primary">{formatCurrency(activePricePerNight)}</span>
                <span className="text-muted-foreground font-medium">/ night</span>
              </div>
            ) : (
              <p className="text-muted-foreground">Select dates to see pricing</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!propertyId && (
              <FormFieldWrapper label="Select Property" icon={Home} required error={errors.propertyId} htmlFor="propertyId">
                <Select value={formData.propertyId} onValueChange={(val) => handleChange('propertyId', val)}>
                  <SelectTrigger id="propertyId" className={`w-full ${errors.propertyId ? 'border-destructive ring-1 ring-destructive text-destructive' : ''}`}>
                    <SelectValue placeholder="Choose a luxury property..." />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldWrapper>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormFieldWrapper label="Check-in Date" icon={CalendarIcon} required error={errors.checkIn} htmlFor="checkIn">
                <Input 
                  id="checkIn"
                  type="date" 
                  min={todayStr}
                  value={formData.checkIn}
                  onChange={e => handleChange('checkIn', e.target.value)}
                  onBlur={() => handleBlur('checkIn')}
                  className={`luxury-input w-full ${errors.checkIn ? 'border-destructive ring-1 ring-destructive text-destructive' : 'text-foreground'}`}
                />
              </FormFieldWrapper>
              
              <FormFieldWrapper label="Check-out Date" icon={CalendarIcon} required error={errors.checkOut} htmlFor="checkOut">
                <Input 
                  id="checkOut"
                  type="date" 
                  min={minCheckOutStr}
                  value={formData.checkOut}
                  onChange={e => handleChange('checkOut', e.target.value)}
                  onBlur={() => handleBlur('checkOut')}
                  className={`luxury-input w-full ${errors.checkOut ? 'border-destructive ring-1 ring-destructive text-destructive' : 'text-foreground'}`}
                  disabled={!formData.checkIn}
                />
              </FormFieldWrapper>
            </div>

            <FormFieldWrapper label="Number of Guests" icon={Users} required error={errors.guests} htmlFor="guests">
              <Input 
                id="guests"
                type="number" 
                min="1" 
                max="10" 
                value={formData.guests}
                onChange={e => handleChange('guests', e.target.value)}
                onBlur={() => handleBlur('guests')}
                className={`luxury-input text-foreground ${errors.guests ? 'border-destructive ring-1 ring-destructive text-destructive' : ''}`}
              />
            </FormFieldWrapper>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
              <FormFieldWrapper label="Full Name" icon={User} required error={errors.guestFullName} htmlFor="guestFullName">
                <Input 
                  id="guestFullName"
                  placeholder="e.g. Maya Chen"
                  value={formData.guestFullName}
                  onChange={e => handleChange('guestFullName', e.target.value)}
                  onBlur={() => handleBlur('guestFullName')}
                  className={`luxury-input text-foreground ${errors.guestFullName ? 'border-destructive ring-1 ring-destructive text-destructive' : ''}`}
                />
              </FormFieldWrapper>
              
              <FormFieldWrapper label="Email Address" icon={Mail} required error={errors.guestEmail} htmlFor="guestEmail">
                <Input 
                  id="guestEmail"
                  type="email"
                  placeholder="maya@example.com"
                  value={formData.guestEmail}
                  onChange={e => handleChange('guestEmail', e.target.value)}
                  onBlur={() => handleBlur('guestEmail')}
                  className={`luxury-input text-foreground ${errors.guestEmail ? 'border-destructive ring-1 ring-destructive text-destructive' : ''}`}
                />
              </FormFieldWrapper>
            </div>

            <FormFieldWrapper label="Phone Number" required error={errors.guestMobileNumber} htmlFor="guestMobileNumber">
              <PhoneNumberInput
                id="guestMobileNumber"
                value={formData.guestMobileNumber}
                onChange={val => handleChange('guestMobileNumber', val)}
                onBlur={() => handleBlur('guestMobileNumber')}
                error={errors.guestMobileNumber}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Special Requests (Optional)" icon={MessageSquare} htmlFor="specialRequests">
              <Textarea 
                id="specialRequests"
                placeholder="Any dietary requirements, arrival time, or special occasions..."
                value={formData.specialRequests}
                onChange={e => handleChange('specialRequests', e.target.value)}
                className="luxury-input min-h-[100px] resize-none text-foreground"
              />
            </FormFieldWrapper>

            {total > 0 && !errors.checkIn && !errors.checkOut && (
              <div className="bg-muted/30 p-6 rounded-xl border border-border mt-6 space-y-4">
                <h4 className="font-serif font-semibold text-lg border-b border-border pb-2 mb-4">Price Breakdown</h4>
                
                <div className="flex justify-between text-muted-foreground text-sm font-medium">
                  <span>{formatCurrency(activePricePerNight)} × {nights} night{nights > 1 ? 's' : ''}</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-muted-foreground text-sm font-medium">
                  <span>Taxes (18% GST)</span>
                  <span>{formatCurrency(taxes)}</span>
                </div>
                
                <div className="flex justify-between text-muted-foreground text-sm font-medium">
                  <span>Platform Service Fee</span>
                  <span>{formatCurrency(serviceFee)}</span>
                </div>

                <div className="h-px bg-border/80 w-full my-2" />
                
                <div className="flex justify-between font-bold text-xl text-foreground items-center">
                  <span>Total Amount</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>
            )}

            <div className="pt-4">
              <div className="flex items-start space-x-3 bg-secondary/50 p-4 rounded-lg border border-border">
                <Checkbox 
                  id="termsAccepted" 
                  checked={formData.termsAccepted}
                  onCheckedChange={checked => handleChange('termsAccepted', checked)}
                  className={`mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary ${errors.termsAccepted ? 'border-destructive' : ''}`}
                />
                <div className="space-y-1 leading-none">
                  <label htmlFor="termsAccepted" className="text-sm font-medium text-foreground cursor-pointer leading-relaxed">
                    I agree to the <Link to="/terms" className="text-primary hover:underline font-semibold">Terms and Conditions</Link> and <Link to="/cancellation-policy" className="text-primary hover:underline font-semibold">Cancellation Policy</Link>. I understand my booking is protected by a secure payment system.
                  </label>
                  {errors.termsAccepted && <p className="text-sm text-destructive mt-2">{errors.termsAccepted}</p>}
                </div>
              </div>
            </div>

            {currentUser ? (
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-orange text-white hover:shadow-luxury transition-all duration-300 text-lg h-16 rounded-xl font-bold mt-4"
              >
                {loading ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-6 h-6 animate-spin" /> Processing Booking...</span>
                ) : (
                  <span className="flex items-center gap-2"><ShieldCheck className="w-6 h-6" /> Submit Booking</span>
                )}
              </Button>
            ) : (
              <Button 
                type="button" 
                asChild
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 text-lg h-16 rounded-xl font-bold mt-4"
              >
                <Link to="/login" state={{ from: window.location.pathname }}>Log in to secure reservation</Link>
              </Button>
            )}
            
            <p className="text-center text-sm text-muted-foreground mt-4 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-success" /> Your booking is protected by our secure payment system.
            </p>
          </form>
        </CardContent>
      </Card>

      <BookingSuccessModal 
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        booking={completedBooking}
        property={selectedProperty}
        onBookAnother={handleBookAnother}
      />
    </>
  );
};