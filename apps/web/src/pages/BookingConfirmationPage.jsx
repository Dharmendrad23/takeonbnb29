import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import api from '@/lib/api';
import { CheckCircle2, Download, Home, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/bookingUtils.js';

const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const record = await pb.collection('bookings').getOne(bookingId, { $autoCancel: false });
        setBooking(record);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (!booking) return <div className="pt-32 text-center">Loading confirmation...</div>;

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <Helmet><title>Booking Confirmed | Take On BnB</title></Helmet>
      
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground text-lg">You're all set for your trip, {booking.guestFullName.split(' ')[0]}.</p>
        </div>

        <div className="bg-card border border-border shadow-soft rounded-3xl p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border pb-6 mb-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide font-bold mb-1">Confirmation Code</p>
              <p className="font-mono text-xl font-bold">{booking.id.toUpperCase()}</p>
            </div>
            <BadgeStatus status={booking.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-primary">Trip Details</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Property</p>
                  <p className="font-medium">{booking.propertyName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Dates</p>
                  <p className="font-medium">{formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Guests</p>
                  <p className="font-medium">{booking.guestCount} Guest(s)</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-primary">Payment Details</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Amount Paid</p>
                  <p className="font-bold text-lg">{formatCurrency(booking.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Payment Method</p>
                  <p className="font-medium capitalize">{booking.paymentMethod || 'Card'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-6 border-t border-border">
            <Button variant="outline" className="rounded-xl flex-1 sm:flex-none"><Download className="w-4 h-4 mr-2" /> Invoice</Button>
            <Button variant="outline" className="rounded-xl flex-1 sm:flex-none"><MessageCircle className="w-4 h-4 mr-2" /> Contact Host</Button>
            <Button asChild className="rounded-xl flex-1 sm:flex-none bg-primary hover:bg-primary/90">
              <Link to="/guest/dashboard"><Home className="w-4 h-4 mr-2"/> Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BadgeStatus = ({ status }) => {
  if(status === 'confirmed') return <span className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-bold">Confirmed</span>
  return <span className="bg-muted px-3 py-1 rounded-full text-sm font-bold capitalize">{status}</span>
}

export default BookingConfirmationPage;