import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import BookingCard from '@/components/BookingCard.jsx';
import ReviewForm from '@/components/ReviewForm.jsx';
import EmptyState from '@/components/EmptyState.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const GuestDashboard = () => {
  const { currentUser } = useAuth();
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (currentUser) {
      loadBookings();
    }
  }, [currentUser]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('bookings').getList(1, 50, {
        filter: `guestId="${currentUser.id}"`,
        expand: 'propertyId,propertyId.hostId',
        sort: '-checkInDate',
        $autoCancel: false
      });

      const now = new Date();
      const upcoming = [];
      const past = [];

      records.items.forEach(booking => {
        if (new Date(booking.checkOutDate) > now && booking.status !== 'cancelled') {
          upcoming.push(booking);
        } else {
          past.push(booking);
        }
      });

      setUpcomingBookings(upcoming);
      setPastBookings(past);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (booking) => {
    setSelectedBooking(booking);
    setReviewDialogOpen(true);
  };

  const handleReviewSuccess = () => {
    setReviewDialogOpen(false);
    setSelectedBooking(null);
    toast.success('Review submitted successfully');
  };

  const handleCancel = async (booking) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await pb.collection('bookings').update(booking.id, {
        status: 'cancelled',
        bookingStatus: 'cancelled'
      }, { $autoCancel: false });
      toast.success('Booking cancelled');
      loadBookings();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Bookings - Take on BNB</title>
        <meta name="description" content="View and manage your bookings" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full min-h-screen">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ letterSpacing: '-0.02em' }}>
            My Bookings
          </h1>
          <p className="text-xl text-muted-foreground">View and manage your reservations</p>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="upcoming" className="text-base px-6 py-2">Upcoming ({upcomingBookings.length})</TabsTrigger>
            <TabsTrigger value="past" className="text-base px-6 py-2">Past & Cancelled ({pastBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingBookings.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No upcoming bookings"
                description="Start exploring properties and book your next adventure"
                actionLabel="Explore Properties"
                actionPath="/"
              />
            ) : (
              <div className="space-y-6">
                {upcomingBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onReview={handleReview}
                    onCancel={handleCancel}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastBookings.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No past bookings"
                description="You haven't completed any stays yet."
              />
            ) : (
              <div className="space-y-6">
                {pastBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onReview={handleReview}
                    onCancel={handleCancel}
                    isPast={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <ReviewForm
              propertyId={selectedBooking.propertyId}
              onSuccess={handleReviewSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GuestDashboard;