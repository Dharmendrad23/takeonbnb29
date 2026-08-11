import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import api from '@/lib/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import GuestDashboardLayout from '@/components/GuestDashboardLayout.jsx';

import {
  Calendar,
  Heart,
  Luggage,
  IndianRupee,
  ArrowRight,
  MapPin,
  Clock,
} from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  formatCurrencyINR,
  formatDate,
  isPastDate,
} from '@/lib/bookingUtils.js';
import { Badge } from '@/components/ui/badge';

const GuestDashboardHome = () => {
  const { currentUser } = useAuth();

  const [stats, setStats] = useState({
    totalBookings: 0,
    upcoming: 0,
    totalSpent: 0,
    saved: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------

  const getId = (value) => {
    if (!value) return null;

    if (typeof value === 'string') {
      return value;
    }

    return value._id || value.id || null;
  };

  const getBookingProperty = (booking) => {
    if (!booking) return null;

    if (typeof booking.propertyId === 'object') {
      return booking.propertyId;
    }

    return null;
  };

  const getPropertyImage = (property) => {
    if (!property) return '';

    // MongoDB property image formats
    if (property.coverImage) {
      return property.coverImage;
    }

    if (Array.isArray(property.photos) && property.photos.length > 0) {
      const firstPhoto = property.photos[0];

      if (typeof firstPhoto === 'string') {
        return firstPhoto;
      }

      if (firstPhoto?.url) {
        return firstPhoto.url;
      }
    }

    return '';
  };

  const getBookingAmount = (booking) => {
    return Number(
      booking?.totalAmount ??
      booking?.totalPrice ??
      booking?.amount ??
      booking?.pricing?.totalAmount ??
      0
    );
  };

  const getBookingStatus = (booking) => {
    return (
      booking?.bookingStatus ||
      booking?.status ||
      'pending'
    ).toLowerCase();
  };

  // ---------------------------------------------------------
  // FETCH DASHBOARD DATA FROM MONGODB API
  // ---------------------------------------------------------

  const fetchData = async () => {
    if (!currentUser?.id && !currentUser?._id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const guestId =
        currentUser?.id ||
        currentUser?._id;

      console.log(
        '[GuestDashboard] Loading dashboard for guest:',
        guestId
      );

      /*
       * -------------------------------------------------------
       * BOOKINGS
       * -------------------------------------------------------
       *
       * Booking creation already uses:
       * POST /api/bookings
       *
       * So dashboard reads from the same MongoDB API.
       */

      const bookingsResponse = await api.get('/bookings');

      const rawBookings =
        bookingsResponse?.data?.data ||
        bookingsResponse?.data?.bookings ||
        bookingsResponse?.data ||
        [];

      const bookings = Array.isArray(rawBookings)
        ? rawBookings
        : [];

      console.log(
        '[GuestDashboard] Bookings received:',
        bookings.length
      );

      /*
       * Filter bookings belonging to logged-in guest.
       */

      const guestBookings = bookings.filter((booking) => {
        const bookingGuestId =
          getId(booking?.guestId);

        return (
          bookingGuestId &&
          String(bookingGuestId) === String(guestId)
        );
      });

      console.log(
        '[GuestDashboard] Guest bookings:',
        guestBookings.length
      );

      /*
       * -------------------------------------------------------
       * CALCULATE STATS
       * -------------------------------------------------------
       */

      let totalSpent = 0;
      let upcoming = [];

      guestBookings.forEach((booking) => {
        const status = getBookingStatus(booking);

        const isCancelled =
          status === 'cancelled' ||
          status === 'canceled' ||
          status === 'rejected';

        if (!isCancelled) {
          totalSpent += getBookingAmount(booking);
        }

        const checkInDate =
          booking?.checkInDate ||
          booking?.checkIn;

        if (
          checkInDate &&
          !isPastDate(checkInDate) &&
          !isCancelled
        ) {
          upcoming.push(booking);
        }
      });

      /*
       * Sort newest bookings first.
       */

      const sortedBookings = [...guestBookings].sort(
        (a, b) => {
          const dateA = new Date(
            a?.createdAt ||
            a?.created ||
            0
          ).getTime();

          const dateB = new Date(
            b?.createdAt ||
            b?.created ||
            0
          ).getTime();

          return dateB - dateA;
        }
      );

      /*
       * Sort upcoming trips by check-in date.
       */

      upcoming.sort((a, b) => {
        return (
          new Date(a.checkInDate).getTime() -
          new Date(b.checkInDate).getTime()
        );
      });

      /*
       * -------------------------------------------------------
       * SAVED PLACES
       * -------------------------------------------------------
       *
       * Favorites API will be connected separately.
       * For now we don't use PocketBase here.
       */

      let savedCount = 0;

      /*
       * If your API later exposes:
       * GET /api/favorites?guestId=...
       *
       * this section can be connected without changing
       * the dashboard UI.
       */

      try {
        const favoritesResponse = await api.get(
          '/favorites',
          {
            params: {
              guestId,
            },
          }
        );

        const favoritesData =
          favoritesResponse?.data?.data ||
          favoritesResponse?.data?.favorites ||
          favoritesResponse?.data ||
          [];

        if (Array.isArray(favoritesData)) {
          savedCount = favoritesData.length;
        }
      } catch (favoriteError) {
        /*
         * Favorites endpoint may not exist yet.
         * Don't break the complete dashboard if it doesn't.
         */
        console.warn(
          '[GuestDashboard] Favorites API unavailable:',
          favoriteError?.response?.status ||
            favoriteError?.message
        );

        savedCount = 0;
      }

      setStats({
        totalBookings: guestBookings.length,
        upcoming: upcoming.length,
        totalSpent,
        saved: savedCount,
      });

      setRecentBookings(
        sortedBookings.slice(0, 3)
      );

      setUpcomingTrips(
        upcoming.slice(0, 2)
      );
    } catch (error) {
      console.error(
        '[GuestDashboard] Failed to load dashboard:',
        error
      );

      setStats({
        totalBookings: 0,
        upcoming: 0,
        totalSpent: 0,
        saved: 0,
      });

      setRecentBookings([]);
      setUpcomingTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    currentUser?.id,
    currentUser?._id,
  ]);

  // ---------------------------------------------------------
  // STAT CARD
  // ---------------------------------------------------------

  const StatCard = ({
    icon: Icon,
    label,
    value,
    bgClass,
    iconClass,
  }) => (
    <div className="dashboard-card flex items-start gap-4">
      <div
        className={`p-4 rounded-2xl shrink-0 ${bgClass}`}
      >
        <Icon
          className={`w-7 h-7 ${iconClass}`}
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-muted-foreground mb-1">
          {label}
        </p>

        <p className="text-2xl font-extrabold text-foreground tracking-tight">
          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            value
          )}
        </p>
      </div>
    </div>
  );

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------

  return (
    <GuestDashboardLayout>
      <Helmet>
        <title>
          Dashboard | Take On BnB
        </title>
      </Helmet>

      {/* HEADER */}

      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Welcome back,{' '}
            {currentUser?.name ||
              currentUser?.fullName ||
              'Explorer'}
            !
          </h1>

          <p className="text-muted-foreground mt-2 text-lg">
            Here's an overview of your travels and account.
          </p>
        </div>

        <Button
          asChild
          className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-brand h-12 px-6"
        >
          <Link to="/search">
            Find Next Stay
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>

      {/* =====================================================
          STATS
      ====================================================== */}

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
          value={formatCurrencyINR(
            stats.totalSpent
          )}
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

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT */}

        <div className="lg:col-span-2 space-y-8">

          {/* UPCOMING TRIPS */}

          {upcomingTrips.length > 0 && (
            <div className="space-y-6">

              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">
                  Upcoming Trips
                </h2>

                <Link
                  to="/guest/bookings"
                  className="text-primary font-semibold hover:underline text-sm flex items-center"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {upcomingTrips.map((trip) => {
                  const property =
                    getBookingProperty(trip);

                  const propertyId =
                    getId(trip?.propertyId);

                  const bookingId =
                    getId(trip);

                  const image =
                    getPropertyImage(
                      property
                    );

                  return (
                    <Link
                      key={bookingId}
                      to={`/guest/bookings/${bookingId}`}
                      className="block group"
                    >
                      <div className="relative aspect-video rounded-2xl overflow-hidden mb-3 bg-muted">

                        {image ? (
                          <img
                            src={image}
                            alt={
                              property?.title ||
                              trip?.propertyName ||
                              'Property'
                            }
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <MapPin className="w-8 h-8 text-muted-foreground opacity-40" />
                          </div>
                        )}

                        <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">
                          {formatDate(
                            trip?.checkInDate
                          )}
                        </div>
                      </div>

                      <h3 className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {property?.title ||
                          trip?.propertyName ||
                          'Your Stay'}
                      </h3>

                      {property?.location && (
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {property.location}
                        </p>
                      )}
                    </Link>
                  );
                })}

              </div>
            </div>
          )}

          {/* RECENT BOOKINGS */}

          <div className="space-y-6">

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                Recent Bookings
              </h2>

              <Link
                to="/guest/bookings"
                className="text-primary font-semibold hover:underline text-sm flex items-center"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    className="w-full h-24 rounded-2xl"
                  />
                ))}
              </div>
            ) : recentBookings.length > 0 ? (

              <div className="space-y-4">

                {recentBookings.map((booking) => {

                  const property =
                    getBookingProperty(
                      booking
                    );

                  const bookingId =
                    getId(booking);

                  const status =
                    getBookingStatus(
                      booking
                    );

                  const image =
                    getPropertyImage(
                      property
                    );

                  const badgeClass =
                    status === 'confirmed'
                      ? 'badge-confirmed'
                      : status === 'pending' ||
                        status === 'pending_verification'
                      ? 'badge-pending'
                      : status === 'completed'
                      ? 'badge-completed'
                      : 'badge-cancelled';

                  return (
                    <Link
                      key={bookingId}
                      to={`/guest/bookings/${bookingId}`}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:bg-muted/50 transition-colors group"
                    >

                      {/* IMAGE */}

                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-muted">

                        {image ? (
                          <img
                            src={image}
                            alt={
                              property?.title ||
                              booking?.propertyName ||
                              'Property'
                            }
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <MapPin className="w-6 h-6 text-muted-foreground opacity-50" />
                          </div>
                        )}

                      </div>

                      {/* INFO */}

                      <div className="flex-1 min-w-0">

                        <h3 className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          {property?.title ||
                            booking?.propertyName ||
                            'Booking'}
                        </h3>

                        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">

                          <Clock className="w-3.5 h-3.5" />

                          {formatDate(
                            booking?.checkInDate
                          )}

                          {' - '}

                          {formatDate(
                            booking?.checkOutDate
                          )}

                        </p>

                        {property?.location && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {property.location}
                          </p>
                        )}

                      </div>

                      {/* AMOUNT */}

                      <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">

                        <span className="font-extrabold text-foreground">
                          {formatCurrencyINR(
                            getBookingAmount(
                              booking
                            )
                          )}
                        </span>

                        <Badge
                          variant="outline"
                          className={`${badgeClass} font-semibold`}
                        >
                          {status
                            .replaceAll(
                              '_',
                              ' '
                            )
                            .toUpperCase()}
                        </Badge>

                      </div>

                    </Link>
                  );
                })}

              </div>

            ) : (

              <div className="dashboard-card flex flex-col items-center justify-center text-center py-12 bg-muted/20">

                <Luggage className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />

                <h3 className="text-lg font-bold text-foreground mb-2">
                  No bookings yet
                </h3>

                <p className="text-muted-foreground max-w-sm mb-5">
                  When you book a stay, it will appear here.
                </p>

                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90"
                >
                  <Link to="/properties">
                    Browse Properties
                  </Link>
                </Button>

              </div>
            )}

          </div>
        </div>

        {/* =====================================================
            QUICK ACTIONS
        ====================================================== */}

        <div className="space-y-6">

          <h2 className="text-2xl font-bold text-foreground">
            Quick Actions
          </h2>

          <div className="dashboard-card space-y-3 bg-muted/20">

            <Link
              to="/guest/wishlist"
              className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary transition-colors group"
            >
              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Heart className="w-5 h-5" />
                </div>

                <span className="font-semibold text-foreground group-hover:text-primary">
                  View Wishlist
                </span>

              </div>

              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/guest/payments"
              className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary transition-colors group"
            >
              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <IndianRupee className="w-5 h-5" />
                </div>

                <span className="font-semibold text-foreground group-hover:text-primary">
                  Payment History
                </span>

              </div>

              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/guest/settings"
              className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary transition-colors group"
            >
              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Calendar className="w-5 h-5" />
                </div>

                <span className="font-semibold text-foreground group-hover:text-primary">
                  Account Settings
                </span>

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