import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Calendar, Users, CreditCard, 
  CheckCircle2, Clock, XCircle, Building, Phone, Mail, User, FileText, ShieldCheck, MessageSquare
} from 'lucide-react';
import api from '@/lib/api.js';
import { formatCurrency } from '@/lib/bookingUtils.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const record = await pb.collection('bookings').getOne(id, {
          expand: 'propertyId,propertyId.hostId',
          $autoCancel: false
        });
        setBooking(record);
      } catch (error) {
        console.error('Error fetching booking details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/20 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-64 w-full rounded-3xl" />
            <Skeleton className="h-96 w-full rounded-3xl" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-80 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h2 className="text-2xl font-bold mb-4">Booking not found</h2>
        <Button onClick={() => navigate('/guest/bookings')}>Return to My Bookings</Button>
      </div>
    );
  }

  const property = booking.expand?.propertyId;
  const host = property?.expand?.hostId;
  
  const getStatusConfig = (status) => {
    switch (status) {
      case 'confirmed':
        return { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2, label: 'Confirmed', step: 3 };
      case 'pending_verification':
      case 'pending':
        return { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock, label: 'Pending Verification', step: 2 };
      case 'rejected':
      case 'cancelled':
        return { color: 'bg-destructive/10 text-destructive border-destructive/20', icon: XCircle, label: 'Cancelled', step: 0 };
      case 'completed':
        return { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle2, label: 'Completed', step: 4 };
      default:
        return { color: 'bg-muted text-muted-foreground border-border', icon: Clock, label: status, step: 1 };
    }
  };

  const statusConfig = getStatusConfig(booking.bookingStatus || booking.status);
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateNights = () => {
    const start = new Date(booking.checkInDate);
    const end = new Date(booking.checkOutDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const totalAmount = booking.totalAmount || booking.totalPrice;
  const basePrice = totalAmount / 1.18; // Assuming 18% tax included
  const taxes = totalAmount - basePrice;

  return (
    <div className="min-h-screen bg-muted/20 pt-28 pb-20">
      <Helmet><title>Booking Details | Take On BnB</title></Helmet>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button variant="ghost" onClick={() => navigate('/guest/bookings')} className="mb-4 -ml-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Bookings
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Booking Details</h1>
              <p className="text-muted-foreground mt-1 font-mono">Confirmation #{booking.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <Badge variant="outline" className={`${statusConfig.color} text-sm px-4 py-1.5 rounded-full shadow-sm`}>
              <StatusIcon className="w-4 h-4 mr-2" />
              {statusConfig.label}
            </Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Main Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Property Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="overflow-hidden border-border rounded-3xl shadow-sm">
                {property?.coverImage || (property?.photos && property.photos[0]) ? (
                  <div className="h-64 w-full relative">
                    <img 
                      src={pb.files.getUrl(property, property.coverImage || property.photos[0])} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h2 className="text-2xl font-bold mb-2">{booking.propertyName || property?.title}</h2>
                      {property?.location && (
                        <p className="flex items-center text-white/90">
                          <MapPin className="w-4 h-4 mr-1.5" /> {property.location}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-muted border-b border-border">
                    <h2 className="text-2xl font-bold text-foreground mb-2">{booking.propertyName}</h2>
                  </div>
                )}
                
                <CardContent className="p-6 sm:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-2 flex items-center">
                          <Calendar className="w-4 h-4 mr-2" /> Check-in
                        </p>
                        <p className="font-semibold text-lg text-foreground">{formatDate(booking.checkInDate)}</p>
                        <p className="text-sm text-muted-foreground mt-1">After 2:00 PM</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-2 flex items-center">
                          <Calendar className="w-4 h-4 mr-2" /> Check-out
                        </p>
                        <p className="font-semibold text-lg text-foreground">{formatDate(booking.checkOutDate)}</p>
                        <p className="text-sm text-muted-foreground mt-1">Before 11:00 AM</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-2 flex items-center">
                          <Users className="w-4 h-4 mr-2" /> Guests
                        </p>
                        <p className="font-semibold text-lg text-foreground">{booking.guestCount} {booking.guestCount === 1 ? 'Guest' : 'Guests'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-2 flex items-center">
                          <Clock className="w-4 h-4 mr-2" /> Duration
                        </p>
                        <p className="font-semibold text-lg text-foreground">{nights} {nights === 1 ? 'Night' : 'Nights'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tabs Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Tabs defaultValue="guest" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl mb-6">
                  <TabsTrigger value="guest" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Guest Info</TabsTrigger>
                  <TabsTrigger value="payment" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Payment</TabsTrigger>
                  <TabsTrigger value="host" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Host</TabsTrigger>
                </TabsList>
                
                <TabsContent value="guest" className="mt-0">
                  <Card className="border-border rounded-3xl shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center"><User className="w-5 h-5 mr-2 text-primary" /> Primary Guest Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                          <p className="font-medium text-foreground">{booking.guestFullName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                          <p className="font-medium text-foreground">{booking.guestEmail}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                          <p className="font-medium text-foreground">{booking.guestMobileNumber}</p>
                        </div>
                      </div>
                      {booking.specialRequests && (
                        <div className="pt-4 border-t border-border mt-4">
                          <p className="text-sm text-muted-foreground mb-2">Special Requests</p>
                          <p className="text-sm bg-muted/50 p-4 rounded-xl italic text-foreground">{booking.specialRequests}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="payment" className="mt-0">
                  <Card className="border-border rounded-3xl shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center"><CreditCard className="w-5 h-5 mr-2 text-primary" /> Payment Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                          <p className="font-medium text-foreground uppercase">{booking.paymentMethod || 'UPI'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
                          <p className="font-mono text-sm bg-muted px-2 py-1 rounded inline-block">{booking.transactionId || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
                          <Badge variant="outline" className={booking.paymentStatus === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                            {booking.paymentStatus === 'verified' ? 'Verified' : 'Pending'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="host" className="mt-0">
                  <Card className="border-border rounded-3xl shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center"><Building className="w-5 h-5 mr-2 text-primary" /> Hosted By</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {host ? (
                        <div className="flex items-center gap-4">
                          <Avatar className="w-16 h-16 border-2 border-border">
                            {host.avatar ? (
                              <AvatarImage src={pb.files.getUrl(host, host.avatar)} alt={host.name} />
                            ) : (
                              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">{host.name?.charAt(0) || 'H'}</AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-bold text-lg text-foreground">{host.name}</p>
                            <p className="text-sm text-muted-foreground">Joined {new Date(host.created).getFullYear()}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Host information is currently unavailable.</p>
                      )}
                      <div className="mt-6 flex gap-3">
                        <Button variant="outline" className="rounded-xl"><MessageSquare className="w-4 h-4 mr-2" /> Message Host</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Right Column: Summary & Actions */}
          <div className="space-y-6">
            
            {/* Price Breakdown */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border-border rounded-3xl shadow-sm sticky top-28">
                <CardHeader className="bg-muted/30 border-b border-border pb-4">
                  <CardTitle className="text-lg">Price Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{formatCurrency(basePrice / nights)} x {nights} nights</span>
                    <span className="font-medium text-foreground">{formatCurrency(basePrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxes & Fees</span>
                    <span className="font-medium text-foreground">{formatCurrency(taxes)}</span>
                  </div>
                  <div className="pt-4 border-t border-border flex justify-between items-center">
                    <span className="font-bold text-foreground">Total Amount</span>
                    <span className="font-black text-xl text-primary">{formatCurrency(totalAmount)}</span>
                  </div>

                  <div className="pt-6 space-y-3">
                    {booking.bookingStatus === 'confirmed' && (
                      <Button className="w-full bg-gradient-orange text-white font-bold rounded-xl h-12 shadow-md hover:-translate-y-0.5 transition-all">
                        <FileText className="w-4 h-4 mr-2" /> Download Invoice
                      </Button>
                    )}
                    {booking.bookingStatus === 'pending_verification' && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex items-start">
                        <ShieldCheck className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
                        <p>Your payment is currently being verified. We will notify you once confirmed.</p>
                      </div>
                    )}
                    <Button variant="outline" className="w-full rounded-xl h-12">
                      Cancel Booking
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Status Timeline */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card className="border-border rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Booking Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative pl-6 border-l-2 border-muted space-y-6">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-background" />
                      <p className="font-semibold text-sm text-foreground">Booking Submitted</p>
                      <p className="text-xs text-muted-foreground">{formatDate(booking.created)}</p>
                    </div>
                    <div className="relative">
                      <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full ring-4 ring-background ${statusConfig.step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
                      <p className={`font-semibold text-sm ${statusConfig.step >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>Payment Verification</p>
                      {statusConfig.step === 2 && <p className="text-xs text-amber-600 mt-1">In progress...</p>}
                    </div>
                    <div className="relative">
                      <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full ring-4 ring-background ${statusConfig.step >= 3 ? 'bg-emerald-500' : 'bg-muted'}`} />
                      <p className={`font-semibold text-sm ${statusConfig.step >= 3 ? 'text-foreground' : 'text-muted-foreground'}`}>Booking Confirmed</p>
                      {statusConfig.step >= 3 && <p className="text-xs text-emerald-600 mt-1">Ready for check-in</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;