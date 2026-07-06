import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import CheckoutButton from '@/components/CheckoutButton.jsx';
import { ShieldCheck, MapPin, Calendar, Users } from 'lucide-react';

const CheckoutPage = () => {
  // Mock data for demonstration of the booking flow checkout
  const [bookingData] = useState({
    property: {
      name: "Luxury Seaside Villa",
      location: "Goa, India",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
    },
    details: {
      checkIn: "Oct 15, 2026",
      checkOut: "Oct 20, 2026",
      guests: 2
    },
    pricing: {
      pricePerNight: 120,
      nights: 5,
      cleaningFee: 50,
      serviceFee: 35
    }
  });

  const totalAmount = (bookingData.pricing.pricePerNight * bookingData.pricing.nights) + bookingData.pricing.cleaningFee + bookingData.pricing.serviceFee;

  return (
    <div className="min-h-[85vh] bg-muted/20 py-12 px-4">
      <Helmet>
        <title>Checkout | TakeOn BnB</title>
      </Helmet>
      
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-foreground mb-8">Confirm your booking</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-card rounded-3xl p-6 border border-border shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-4">Trip Details</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5"><Calendar className="w-4 h-4"/> Dates</span>
                  <p className="text-foreground font-medium">{bookingData.details.checkIn} - {bookingData.details.checkOut}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5"><Users className="w-4 h-4"/> Guests</span>
                  <p className="text-foreground font-medium">{bookingData.details.guests} guests</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-3xl p-6 border border-border shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-4">Pay with Stripe</h2>
              <p className="text-muted-foreground mb-6 text-sm">
                You will be redirected to Stripe's secure checkout page to complete your payment.
              </p>
              
              <CheckoutButton 
                amount={totalAmount} 
                productName={`Booking: ${bookingData.property.name}`} 
              />
              
              <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> SSL Secured Payment
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden sticky top-24">
              <div className="flex gap-4 p-6 border-b border-border">
                <img src={bookingData.property.image} alt={bookingData.property.name} className="w-24 h-24 rounded-xl object-cover" />
                <div>
                  <h3 className="font-bold text-foreground text-lg leading-tight mb-1">{bookingData.property.name}</h3>
                  <span className="text-muted-foreground text-sm flex items-center font-medium">
                    <MapPin className="w-3.5 h-3.5 mr-1" /> {bookingData.property.location}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-foreground mb-4">Price details</h3>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">${bookingData.pricing.pricePerNight} x {bookingData.pricing.nights} nights</span>
                    <span className="font-medium text-foreground">${bookingData.pricing.pricePerNight * bookingData.pricing.nights}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cleaning fee</span>
                    <span className="font-medium text-foreground">${bookingData.pricing.cleaningFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service fee</span>
                    <span className="font-medium text-foreground">${bookingData.pricing.serviceFee}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <span className="font-extrabold text-foreground text-lg">Total (USD)</span>
                  <span className="font-extrabold text-foreground text-xl">${totalAmount}</span>
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