import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import api from '@/lib/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import GuestDashboardLayout from '@/components/GuestDashboardLayout.jsx';
import { Calendar, MapPin, Users, Clock, Navigation, MessageSquare, Luggage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, isPastDate } from '@/lib/bookingUtils.js';
import { differenceInDays, parseISO } from 'date-fns';

const GuestUpcomingTripsPage = () => {
  const { currentUser } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const records = await pb.collection('bookings').getFullList({
          filter: `guestId="${currentUser.id}" && status != 'cancelled' && bookingStatus != 'rejected'`,
          expand: 'propertyId,propertyId.hostId',
          sort: 'checkInDate',
          $autoCancel: false
        });
        
        const upcoming = records.filter(r => !isPastDate(r.checkInDate));
        setTrips(upcoming);
      } catch (e) {
        console.error("Error fetching upcoming trips:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [currentUser]);

  return (
    <GuestDashboardLayout>
      <Helmet><title>Upcoming Trips | TakeOn BnB</title></Helmet>
      
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2">Upcoming Trips</h1>
        <p className="text-muted-foreground text-lg">Get ready for your next adventure.</p>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2].map(i => <Skeleton key={i} className="w-full h-64 rounded-3xl" />)}
        </div>
      ) : trips.length === 0 ? (
        <div className="dashboard-card py-20 text-center flex flex-col items-center justify-center bg-muted/20">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Luggage className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">No upcoming trips</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            You don't have any upcoming reservations. Time to plan your next getaway!
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-12 px-8 shadow-md">
            <Link to="/search">Explore Properties</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {trips.map(trip => {
            const property = trip.expand?.propertyId;
            const host = property?.expand?.hostId;
            const daysUntil = differenceInDays(parseISO(trip.checkInDate), new Date());
            
            return (
              <div key={trip.id} className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 h-64 md:h-auto relative bg-muted">
                    {property?.coverImage && (
                      <img 
                        src={pb.files.getUrl(property, property.coverImage)} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-4 left-4 bg-background/90 backdrop-blur px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">
                      In {daysUntil} days
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">{trip.propertyName}</h2>
                        <p className="text-muted-foreground flex items-center font-medium">
                          <MapPin className="w-4 h-4 mr-1.5 text-primary" /> {property?.location || 'Location details available after confirmation'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1 flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5 text-primary"/> Check-in</p>
                        <p className="font-bold text-foreground">{formatDate(trip.checkInDate)}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{property?.checkInTime || '2:00 PM'}</p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1 flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5 text-primary"/> Check-out</p>
                        <p className="font-bold text-foreground">{formatDate(trip.checkOutDate)}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{property?.checkOutTime || '11:00 AM'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
                        <Users className="w-4 h-4 text-muted-foreground" /> {trip.guestCount} Guests
                      </div>
                      {host && (
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
                          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                            {host.name?.charAt(0) || 'H'}
                          </div>
                          Host: {host.name}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3 mt-auto pt-6 border-t border-border">
                      <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-sm">
                        <Link to={`/guest/bookings/${trip.id}`}>View Details</Link>
                      </Button>
                      <Button variant="outline" className="font-bold rounded-xl border-border hover:bg-muted">
                        <Navigation className="w-4 h-4 mr-2" /> Get Directions
                      </Button>
                      <Button variant="outline" className="font-bold rounded-xl border-border hover:bg-muted">
                        <MessageSquare className="w-4 h-4 mr-2" /> Contact Host
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GuestDashboardLayout>
  );
};

export default GuestUpcomingTripsPage;