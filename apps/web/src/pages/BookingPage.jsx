import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency, calculateTotalPrice, checkDateOverlap } from '@/lib/bookingUtils.js';
import { toast } from 'sonner';
import { createBooking, getProperty, listBookings } from '@/lib/dataApi.js';
import { getEntityId, getPropertyImage } from '@/lib/propertyMappers.js';

const BookingPage = () => {
  const { id } = useParams(); // propertyId
  const location = useLocation();
  const navigate = useNavigate();
  
  const stateData = location.state || {};
  const initialDates = stateData.dates || { checkIn: '', checkOut: '' };
  
  const [property, setProperty] = useState(null);
  const [existingBookings, setExistingBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPropertyAndBookings = async () => {
      try {
        const propRecord = await getProperty(id);
        setProperty(propRecord);

        const bookingsRecord = await listBookings({ propertyId: id });
        setExistingBookings(bookingsRecord.filter((booking) => booking.status === 'pending' || booking.status === 'confirmed'));
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load property details.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPropertyAndBookings();
  }, [id]);

  if (isLoading) return <div className="pt-32 text-center">Loading booking details...</div>;
  if (!property) return <div className="pt-32 text-center">Property not found.</div>;

  const pricing = calculateTotalPrice(property.pricePerNight, initialDates.checkIn, initialDates.checkOut);
  const nights = pricing.nights || 1;
  const basePrice = pricing.subtotal || property.pricePerNight;
  const serviceFee = Math.floor(basePrice * 0.1);
  const taxes = Math.floor(basePrice * 0.18);
  const totalAmount = basePrice + serviceFee + taxes;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!initialDates.checkIn || !initialDates.checkOut) {
      toast.error("Please select valid dates.");
      return;
    }

    if (checkDateOverlap(initialDates.checkIn, initialDates.checkOut, existingBookings)) {
      toast.error("These dates are already booked. Please select different dates.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const bookingData = {
        propertyId: getEntityId(property),
        guestId: '',
        checkInDate: `${initialDates.checkIn} 14:00:00.000Z`,
        checkOutDate: `${initialDates.checkOut} 11:00:00.000Z`,
        guestCount: stateData.guests || 1,
        totalPrice: basePrice,
        totalAmount: totalAmount,
        status: 'pending',
        bookingStatus: 'pending',
        paymentStatus: 'pending',
        guestFullName: formData.name,
        guestEmail: formData.email,
        guestMobileNumber: formData.phone,
        propertyName: property.title,
        specialRequests: formData.specialRequests
      };

      const record = await createBooking(bookingData);
      
      toast.success("Booking created successfully!");
      navigate('/checkout', { state: { booking: record, property } });

    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-20">
      <Helmet><title>Complete Booking | Take On BnB</title></Helmet>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Confirm your booking</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-card p-6 rounded-3xl shadow-soft border border-border">
                <h2 className="text-xl font-bold mb-6">Your details</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="requests">Special Requests (Optional)</Label>
                    <textarea 
                      id="requests" 
                      rows={3}
                      className="w-full mt-1 flex min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.specialRequests}
                      onChange={e => setFormData({...formData, specialRequests: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-lg rounded-xl">
                {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
              </Button>
            </form>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-card p-6 rounded-3xl shadow-soft border border-border sticky top-28">
              <div className="flex gap-4 mb-6 pb-6 border-b border-border">
                {getPropertyImage(property) ? (
                  <img src={getPropertyImage(property)} alt="Property" className="w-24 h-24 rounded-xl object-cover" />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                )}
                <div>
                  <h3 className="font-semibold">{property.title}</h3>
                  <p className="text-sm text-muted-foreground">{property.location}</p>
                  <p className="text-sm font-medium mt-2">{stateData.guests || 1} Guest(s)</p>
                </div>
              </div>

              <h3 className="font-bold text-lg mb-4">Price details</h3>
              <div className="space-y-3 text-sm mb-6 pb-6 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{formatCurrency(property.pricePerNight)} x {nights} nights</span>
                  <span>{formatCurrency(basePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service fee</span>
                  <span>{formatCurrency(serviceFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes</span>
                  <span>{formatCurrency(taxes)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total (INR)</span>
                <span className="text-primary">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;