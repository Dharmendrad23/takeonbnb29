import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, ChevronRight, Luggage, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { formatCurrencyINR, formatDate, isPastDate } from '@/lib/bookingUtils.js';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GuestDashboardLayout from '@/components/GuestDashboardLayout.jsx';
import { listBookings, listProperties } from '@/lib/dataApi.js';
import { getEntityId, getPropertyImage } from '@/lib/propertyMappers.js';

const GuestBookingsPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!currentUser) return;

    const fetchBookings = async () => {
      try {
        const [records, properties] = await Promise.all([
          listBookings({ guestId: currentUser.id }),
          listProperties(),
        ]);
        const propertyMap = new Map(properties.map((property) => [getEntityId(property), property]));
        setBookings(
          records.map((booking) => ({
            ...booking,
            property: booking.property || propertyMap.get(String(booking.propertyId)) || null,
          }))
        );
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
    const intervalId = window.setInterval(fetchBookings, 15000);
    return () => window.clearInterval(intervalId);
  }, [currentUser]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed': return { class: 'badge-confirmed', icon: CheckCircle2, label: 'Confirmed' };
      case 'pending_verification':
      case 'pending': return { class: 'badge-pending', icon: Clock, label: 'Pending Verification' };
      case 'rejected':
      case 'cancelled': return { class: 'badge-cancelled', icon: XCircle, label: 'Cancelled' };
      case 'completed': return { class: 'badge-completed', icon: CheckCircle2, label: 'Completed' };
      default: return { class: 'bg-muted text-muted-foreground', icon: Clock, label: status };
    }
  };

  const filteredBookings = bookings.filter(b => {
    const status = b.bookingStatus || b.status;
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return !isPastDate(b.checkInDate) && status !== 'cancelled' && status !== 'rejected';
    if (activeTab === 'completed') return isPastDate(b.checkOutDate) && (status === 'completed' || status === 'confirmed');
    if (activeTab === 'cancelled') return status === 'cancelled' || status === 'rejected';
    return true;
  });

  const BookingCardList = ({ items }) => (
    items.length === 0 ? (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="dashboard-card py-16 text-center flex flex-col items-center justify-center bg-muted/20"
      >
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Luggage className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">No bookings found</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          You don't have any stays matching this category.
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-12 px-8 shadow-md">
          <Link to="/search">Explore Properties</Link>
        </Button>
      </motion.div>
    ) : (
      <div className="space-y-6">
        <AnimatePresence>
          {items.map((booking, index) => {
            const property = booking.property;
            const statusConfig = getStatusBadge(booking.bookingStatus || booking.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <motion.div
                key={getEntityId(booking)}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card 
                  className="overflow-hidden border-border rounded-2xl hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => navigate(`/guest/bookings/${getEntityId(booking)}`)}
                >
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="w-full md:w-80 h-56 md:h-auto relative overflow-hidden bg-muted shrink-0">
                      {getPropertyImage(property) ? (
                        <img 
                          src={getPropertyImage(property)} 
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MapPin className="w-8 h-8 text-muted-foreground opacity-50" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <Badge variant="outline" className={`${statusConfig.class} shadow-sm backdrop-blur-md bg-white/90 dark:bg-black/90 font-bold px-3 py-1.5`}>
                          <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-2xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                            {booking.propertyName || property?.title}
                          </h3>
                          <span className="font-mono text-xs font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-md shrink-0 ml-4 hidden sm:block">
                            ID: {getEntityId(booking).slice(0, 8).toUpperCase()}
                          </span>
                        </div>
                        
                        {property?.location && (
                          <p className="text-muted-foreground text-sm flex items-center mb-6 font-medium">
                            <MapPin className="w-4 h-4 mr-1.5 shrink-0 text-primary" />
                            <span className="line-clamp-1">{property.location}</span>
                          </p>
                        )}

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-muted/40 rounded-xl p-3 sm:p-4 border border-border/50">
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1.5 flex items-center">
                              <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary" /> Dates
                            </p>
                            <p className="font-bold text-sm sm:text-base text-foreground">
                              {formatDate(booking.checkInDate)} <span className="text-muted-foreground mx-1">→</span> {formatDate(booking.checkOutDate)}
                            </p>
                          </div>
                          <div className="bg-muted/40 rounded-xl p-3 sm:p-4 border border-border/50">
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1.5 flex items-center">
                              <Users className="w-3.5 h-3.5 mr-1.5 text-primary" /> Guests
                            </p>
                            <p className="font-bold text-sm sm:text-base text-foreground">
                              {booking.guestCount} {booking.guestCount === 1 ? 'Guest' : 'Guests'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-5 border-t border-border mt-auto">
                        <div>
                          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Total Paid</p>
                          <p className="text-xl font-extrabold text-foreground">{formatCurrencyINR(booking.totalAmount || booking.totalPrice)}</p>
                        </div>
                        <Button variant="ghost" className="group-hover:bg-primary group-hover:text-primary-foreground rounded-xl transition-all font-bold h-10 px-5 border border-border group-hover:border-primary">
                          View Details <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    )
  );

  return (
    <GuestDashboardLayout>
      <Helmet><title>My Bookings | TakeOn BnB</title></Helmet>
      
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2">My Bookings</h1>
        <p className="text-muted-foreground text-lg">Manage your upcoming stays and view past trips.</p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-card border border-border p-1 rounded-xl w-full sm:w-auto flex flex-wrap h-auto mb-8 shadow-sm">
          <TabsTrigger value="all" className="rounded-lg flex-1 sm:flex-none font-semibold">All Stays</TabsTrigger>
          <TabsTrigger value="upcoming" className="rounded-lg flex-1 sm:flex-none font-semibold">Upcoming</TabsTrigger>
          <TabsTrigger value="completed" className="rounded-lg flex-1 sm:flex-none font-semibold">Completed</TabsTrigger>
          <TabsTrigger value="cancelled" className="rounded-lg flex-1 sm:flex-none font-semibold">Cancelled</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-full h-[280px] rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            <TabsContent value="all" className="mt-0 outline-none"><BookingCardList items={filteredBookings} /></TabsContent>
            <TabsContent value="upcoming" className="mt-0 outline-none"><BookingCardList items={filteredBookings} /></TabsContent>
            <TabsContent value="completed" className="mt-0 outline-none"><BookingCardList items={filteredBookings} /></TabsContent>
            <TabsContent value="cancelled" className="mt-0 outline-none"><BookingCardList items={filteredBookings} /></TabsContent>
          </>
        )}
      </Tabs>
    </GuestDashboardLayout>
  );
};

export default GuestBookingsPage;