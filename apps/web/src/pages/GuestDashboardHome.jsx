import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import api from '@/lib/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import GuestDashboardLayout from '@/components/GuestDashboardLayout.jsx';
import { Calendar, Heart, Luggage, IndianRupee, ArrowRight, MapPin, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { formatCurrencyINR, formatDate, isPastDate } from '@/lib/bookingUtils.js';
import { Badge } from '@/components/ui/badge';
import pb from '@/lib/pocketbaseClient';

const GuestDashboardHome = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({ totalBookings: 0, upcoming: 0, totalSpent: 0, saved: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, favsRes] = await Promise.all([
          pb.collection('bookings').getFullList({ 
            filter: `guestId="${currentUser.id}"`, 
            expand: 'propertyId',
            sort: '-created',
            $autoCancel: false 
          }),
          pb.collection('favorites').getList(1, 1, { filter: `guestId="${currentUser.id}"`, $autoCancel: false })
        ]);
        
        let totalSpent = 0;
        let upcoming = [];
        
        bookingsRes.forEach(b => {
          if (b.status !== 'cancelled' && b.bookingStatus !== 'rejected') {
            totalSpent += (b.totalAmount || b.totalPrice || 0);
          }
          if (!isPastDate(b.checkInDate) && b.status !== 'cancelled') {
            upcoming.push(b);
          }
        });
        
        setStats({
          totalBookings: bookingsRes.length,
          upcoming: upcoming.length,
          totalSpent,
          saved: favsRes.totalItems
        });

        setRecentBookings(bookingsRes.slice(0, 3));
        setUpcomingTrips(upcoming.slice(0, 2));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();

    // Real-time sync
    pb.collection('bookings').subscribe('*', function (e) {
      if (e.record.guestId === currentUser.id) {
        fetchData();
      }
    });

    return () => pb.collection('bookings').unsubscribe('*');
  }, [currentUser]);

  const StatCard = ({ icon: Icon, label, value, bgClass, iconClass }) => (
    <div className="dashboard-card flex items-start gap-4">
      <div className={`p-4 rounded-2xl shrink-0 ${bgClass}`}>
        <Icon className={`w-7 h-7 ${iconClass}`} />
      </div>
      <div>
        <p className="text-sm font-semibold text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-extrabold text-foreground tracking-tight">
          {loading ? <Skeleton className="h-8 w-24" /> : value}
        </p>
      </div>
    </div>
  );

  return (
    <GuestDashboardLayout>
      <Helmet><title>Dashboard | Take On BnB</title></Helmet>
      
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">Welcome back, {currentUser?.name || 'Explorer'}!</h1>
          <p className="text-muted-foreground mt-2 text-lg">Here's an overview of your travels and account.</p>
        </div>
        <Button asChild className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-brand h-12 px-6">
          <Link to="/search">Find Next Stay <ArrowRight className="w-4 h-4 ml-2" /></Link>
        </Button>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          icon={Luggage} 
          label="Total Bookings" 
          value={stats.totalBookings} 
          bgClass="bg-blue-100 dark:bg-blue-900/30" 
          iconClass="text-blue-600 dark:text-blue-400" 
        />
        <StatCard 
          icon={Calendar} 
          label="Upcoming Trips" 
          value={stats.upcoming} 
          bgClass="bg-emerald-100 dark:bg-emerald-900/30" 
          iconClass="text-emerald-600 dark:text-emerald-400" 
        />
        <StatCard 
          icon={IndianRupee} 
          label="Total Spent" 
          value={formatCurrencyINR(stats.totalSpent)} 
          bgClass="bg-amber-100 dark:bg-amber-900/30" 
          iconClass="text-amber-600 dark:text-amber-400" 
        />
        <StatCard 
          icon={Heart} 
          label="Saved Places" 
          value={stats.saved} 
          bgClass="bg-primary/10" 
          iconClass="text-primary" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings List */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Upcoming Trips Preview */}
          {upcomingTrips.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Upcoming Trips</h2>
                <Link to="/guest/upcoming-trips" className="text-primary font-semibold hover:underline text-sm flex items-center">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcomingTrips.map(trip => (
                  <Link key={trip.id} to={`/guest/bookings/${trip.id}`} className="block group">
                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-3 bg-muted">
                      {trip.expand?.propertyId?.coverImage && (
                        <img src={pb.files.getUrl(trip.expand.propertyId, trip.expand.propertyId.coverImage)} alt="Property" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      )}
                      <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">
                        {formatDate(trip.checkInDate)}
                      </div>
                    </div>
                    <h3 className="font-bold text-foreground truncate group-hover:text-primary transition-colors">{trip.propertyName}</h3>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Recent Bookings</h2>
              <Link to="/guest/bookings" className="text-primary font-semibold hover:underline text-sm flex items-center">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="w-full h-24 rounded-2xl" />)}
              </div>
            ) : recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map(booking => {
                  const property = booking.expand?.propertyId;
                  const status = booking.bookingStatus || booking.status;
                  const badgeClass = status === 'confirmed' ? 'badge-confirmed' : 
                                     status === 'pending_verification' || status === 'pending' ? 'badge-pending' : 
                                     status === 'completed' ? 'badge-completed' : 'badge-cancelled';
                  
                  return (
                    <Link 
                      key={booking.id} 
                      to={`/guest/bookings/${booking.id}`}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:bg-muted/50 transition-colors group"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-muted">
                        {(property?.coverImage || property?.photos?.[0]) ? (
                          <img 
                            src={pb.files.getUrl(property, property.coverImage || property.photos[0])} 
                            alt={property?.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <MapPin className="w-6 h-6 text-muted-foreground opacity-50" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          {property?.title || booking.propertyName}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                        </p>
                      </div>
                      <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                        <span className="font-extrabold text-foreground">{formatCurrencyINR(booking.totalAmount || booking.totalPrice)}</span>
                        <Badge variant="outline" className={`${badgeClass} font-semibold`}>
                          {status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="dashboard-card flex flex-col items-center justify-center text-center py-12 bg-muted/20">
                <Luggage className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-bold text-foreground mb-2">No bookings yet</h3>
                <p className="text-muted-foreground max-w-sm">When you book a stay, it will appear here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Quick Actions</h2>
          <div className="dashboard-card space-y-3 bg-muted/20">
            <Link to="/guest/wishlist" className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Heart className="w-5 h-5" />
                </div>
                <span className="font-semibold text-foreground group-hover:text-primary">View Wishlist</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
            </Link>

            <Link to="/guest/payments" className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <span className="font-semibold text-foreground group-hover:text-primary">Payment History</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link to="/guest/settings" className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="font-semibold text-foreground group-hover:text-primary">Account Settings</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </GuestDashboardLayout>
  );
};

export default GuestDashboardHome;