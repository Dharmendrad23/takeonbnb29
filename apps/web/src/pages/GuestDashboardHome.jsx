import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import {
  Calendar,
  Heart,
  Luggage,
  IndianRupee,
  ArrowRight,
  MapPin,
  Clock,
  RefreshCw,
} from 'lucide-react';

import api from '@/lib/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

import GuestDashboardLayout from '@/components/GuestDashboardLayout.jsx';

import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import {
  formatCurrencyINR,
  formatDate,
  isPastDate,
} from '@/lib/bookingUtils.js';


const FAVORITES_STORAGE_KEY =
  'takeonbnb-favorites';


const GuestDashboardHome = () => {
  const { currentUser } = useAuth();

  const [stats, setStats] =
    useState({
      totalBookings: 0,
      upcoming: 0,
      totalSpent: 0,
      saved: 0,
    });

  const [recentBookings, setRecentBookings] =
    useState([]);

  const [upcomingTrips, setUpcomingTrips] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);


  /* =========================================
     GET USER ID
  ========================================= */

  const getUserId = () => {
    return (
      currentUser?.id ||
      currentUser?._id ||
      null
    );
  };


  /* =========================================
     GET FAVORITES
  ========================================= */

  const getFavoritesCount = () => {
    try {
      const stored =
        localStorage.getItem(
          FAVORITES_STORAGE_KEY
        );

      if (!stored) {
        return 0;
      }

      const favorites =
        JSON.parse(stored);

      if (!Array.isArray(favorites)) {
        return 0;
      }

      const userId =
        getUserId();

      if (!userId) {
        return favorites.length;
      }

      return favorites.filter(
        (favorite) =>
          String(
            favorite.guestId ||
            favorite.userId ||
            ''
          ) === String(userId)
      ).length;

    } catch (error) {
      console.error(
        'Failed to load favorites:',
        error
      );

      return 0;
    }
  };


  /* =========================================
     NORMALIZE API RESPONSE
  ========================================= */

  const extractArray = (
    responseData
  ) => {
    if (
      Array.isArray(
        responseData
      )
    ) {
      return responseData;
    }

    if (
      Array.isArray(
        responseData?.bookings
      )
    ) {
      return responseData.bookings;
    }

    if (
      Array.isArray(
        responseData?.items
      )
    ) {
      return responseData.items;
    }

    if (
      Array.isArray(
        responseData?.data
      )
    ) {
      return responseData.data;
    }

    return [];
  };


  /* =========================================
     GET BOOKING USER ID
  ========================================= */

  const getBookingGuestId = (
    booking
  ) => {
    if (!booking) {
      return null;
    }

    if (
      typeof booking.guestId ===
      'object'
    ) {
      return (
        booking.guestId?._id ||
        booking.guestId?.id ||
        null
      );
    }

    return (
      booking.guestId ||
      booking.userId ||
      booking.guest ||
      null
    );
  };


  /* =========================================
     GET PROPERTY ID
  ========================================= */

  const getPropertyId = (
    booking
  ) => {
    if (!booking) {
      return null;
    }

    if (
      typeof booking.propertyId ===
      'object'
    ) {
      return (
        booking.propertyId?._id ||
        booking.propertyId?.id ||
        null
      );
    }

    if (
      typeof booking.property ===
      'object'
    ) {
      return (
        booking.property?._id ||
        booking.property?.id ||
        null
      );
    }

    return (
      booking.propertyId ||
      booking.property ||
      null
    );
  };


  /* =========================================
     GET BOOKING STATUS
  ========================================= */

  const getBookingStatus = (
    booking
  ) => {
    return String(
      booking?.bookingStatus ||
      booking?.status ||
      'pending'
    )
      .trim()
      .toLowerCase();
  };


  /* =========================================
     CHECK CANCELLED
  ========================================= */

  const isCancelledBooking = (
    booking
  ) => {
    const status =
      getBookingStatus(
        booking
      );

    return (
      status === 'cancelled' ||
      status === 'canceled' ||
      status === 'rejected'
    );
  };


  /* =========================================
     GET AMOUNT
  ========================================= */

  const getBookingAmount = (
    booking
  ) => {
    const value =
      booking?.totalAmount ??
      booking?.totalPrice ??
      booking?.amount ??
      booking?.total ??
      0;

    const amount =
      Number(value);

    return Number.isFinite(amount)
      ? amount
      : 0;
  };


  /* =========================================
     GET BOOKING DATE
  ========================================= */

  const getBookingCreatedDate = (
    booking
  ) => {
    return (
      booking?.createdAt ||
      booking?.created ||
      booking?.updatedAt ||
      booking?.checkInDate ||
      0
    );
  };


  /* =========================================
     FETCH PROPERTIES
  ========================================= */

  const fetchProperties = async (
    bookings
  ) => {
    try {
      const propertyIds =
        [
          ...new Set(
            bookings
              .map(
                getPropertyId
              )
              .filter(Boolean)
              .map(String)
          ),
        ];

      if (
        propertyIds.length === 0
      ) {
        return {};
      }

      const response =
        await api.get(
          '/properties'
        );

      const properties =
        extractArray(
          response.data
        );

      const propertyMap = {};

      properties.forEach(
        (property) => {
          const propertyId =
            property?.id ||
            property?._id;

          if (propertyId) {
            propertyMap[
              String(propertyId)
            ] = property;
          }
        }
      );

      return propertyMap;

    } catch (error) {
      console.error(
        'Failed to load properties:',
        error
      );

      return {};
    }
  };


  /* =========================================
     FETCH DASHBOARD DATA
  ========================================= */

  const fetchDashboardData =
    useCallback(
      async (
        showLoader = false
      ) => {
        const userId =
          getUserId();

        if (!userId) {
          setLoading(false);
          return;
        }

        try {
          if (showLoader) {
            setLoading(true);
          } else {
            setRefreshing(true);
          }

          const token =
            localStorage.getItem(
              'authToken'
            );

          const headers =
            token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {};

          const response =
            await api.get(
              '/bookings',
              {
                headers,
              }
            );

          const allBookings =
            extractArray(
              response.data
            );

          const userBookings =
            allBookings.filter(
              (booking) => {
                const bookingGuestId =
                  getBookingGuestId(
                    booking
                  );

                return (
                  String(
                    bookingGuestId
                  ) ===
                  String(userId)
                );
              }
            );

          const sortedBookings =
            [...userBookings].sort(
              (a, b) =>
                new Date(
                  getBookingCreatedDate(
                    b
                  )
                ) -
                new Date(
                  getBookingCreatedDate(
                    a
                  )
                )
            );

          const propertyMap =
            await fetchProperties(
              sortedBookings
            );

          const bookingsWithProperties =
            sortedBookings.map(
              (booking) => {
                const propertyId =
                  getPropertyId(
                    booking
                  );

                const property =
                  propertyMap[
                    String(propertyId)
                  ];

                return {
                  ...booking,

                  id:
                    booking.id ||
                    booking._id,

                  property:
                    property ||
                    (
                      typeof booking.propertyId ===
                      'object'
                        ? booking.propertyId
                        : null
                    ),

                  expand: {
                    propertyId:
                      property ||
                      (
                        typeof booking.propertyId ===
                        'object'
                          ? booking.propertyId
                          : null
                      ),
                  },
                };
              }
            );

          const upcoming =
            bookingsWithProperties.filter(
              (booking) => {
                if (
                  isCancelledBooking(
                    booking
                  )
                ) {
                  return false;
                }

                if (
                  !booking.checkInDate
                ) {
                  return false;
                }

                return !isPastDate(
                  booking.checkInDate
                );
              }
            );

          const totalSpent =
            bookingsWithProperties
              .filter(
                (booking) =>
                  !isCancelledBooking(
                    booking
                  )
              )
              .reduce(
                (
                  total,
                  booking
                ) =>
                  total +
                  getBookingAmount(
                    booking
                  ),
                0
              );

          setStats({
            totalBookings:
              bookingsWithProperties.length,

            upcoming:
              upcoming.length,

            totalSpent,

            saved:
              getFavoritesCount(),
          });

          setRecentBookings(
            bookingsWithProperties.slice(
              0,
              3
            )
          );

          setUpcomingTrips(
            upcoming
              .sort(
                (a, b) =>
                  new Date(
                    a.checkInDate
                  ) -
                  new Date(
                    b.checkInDate
                  )
              )
              .slice(0, 2)
          );

        } catch (error) {
          console.error(
            'Guest dashboard error:',
            error
          );

          setStats(
            (previous) => ({
              ...previous,

              saved:
                getFavoritesCount(),
            })
          );

        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      [currentUser]
    );


  /* =========================================
     INITIAL LOAD
  ========================================= */

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    fetchDashboardData(
      true
    );
  }, [
    currentUser,
    fetchDashboardData,
  ]);


  /* =========================================
     AUTO REFRESH
  ========================================= */

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const interval =
      setInterval(
        () => {
          fetchDashboardData(
            false
          );
        },
        15000
      );

    return () => {
      clearInterval(
        interval
      );
    };
  }, [
    currentUser,
    fetchDashboardData,
  ]);


  /* =========================================
     REFRESH WHEN TAB BECOMES ACTIVE
  ========================================= */

  useEffect(() => {
    const handleVisibilityChange =
      () => {
        if (
          document.visibilityState ===
          'visible'
        ) {
          fetchDashboardData(
            false
          );
        }
      };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );
    };
  }, [
    fetchDashboardData,
  ]);


  /* =========================================
     REFRESH ON FOCUS
  ========================================= */

  useEffect(() => {
    const handleFocus =
      () => {
        fetchDashboardData(
          false
        );
      };

    window.addEventListener(
      'focus',
      handleFocus
    );

    return () => {
      window.removeEventListener(
        'focus',
        handleFocus
      );
    };
  }, [
    fetchDashboardData,
  ]);


  /* =========================================
     CUSTOM REALTIME EVENTS
  ========================================= */

  useEffect(() => {
    const handleDashboardUpdate =
      () => {
        fetchDashboardData(
          false
        );
      };

    window.addEventListener(
      'bookingUpdated',
      handleDashboardUpdate
    );

    window.addEventListener(
      'bookingCreated',
      handleDashboardUpdate
    );

    window.addEventListener(
      'bookingCancelled',
      handleDashboardUpdate
    );

    window.addEventListener(
      'favoritesUpdated',
      handleDashboardUpdate
    );

    return () => {
      window.removeEventListener(
        'bookingUpdated',
        handleDashboardUpdate
      );

      window.removeEventListener(
        'bookingCreated',
        handleDashboardUpdate
      );

      window.removeEventListener(
        'bookingCancelled',
        handleDashboardUpdate
      );

      window.removeEventListener(
        'favoritesUpdated',
        handleDashboardUpdate
      );
    };
  }, [
    fetchDashboardData,
  ]);


  /* =========================================
     STAT CARD
  ========================================= */

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

        <div className="text-2xl font-extrabold text-foreground tracking-tight">
          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            value
          )}
        </div>
      </div>
    </div>
  );


  /* =========================================
     GET PROPERTY IMAGE
  ========================================= */

  const getPropertyImage = (
    property
  ) => {
    if (!property) {
      return null;
    }

    return (
      property.coverImage ||
      property.image ||
      property.thumbnail ||
      (
        Array.isArray(
          property.photos
        )
          ? property.photos[0]
          : null
      ) ||
      (
        Array.isArray(
          property.images
        )
          ? property.images[0]
          : null
      )
    );
  };


  /* =========================================
     GET STATUS CLASS
  ========================================= */

  const getStatusClass = (
    status
  ) => {
    const normalizedStatus =
      String(
        status || 'pending'
      ).toLowerCase();

    if (
      normalizedStatus ===
      'confirmed'
    ) {
      return 'badge-confirmed';
    }

    if (
      normalizedStatus ===
        'pending_verification' ||
      normalizedStatus ===
        'pending'
    ) {
      return 'badge-pending';
    }

    if (
      normalizedStatus ===
        'completed'
    ) {
      return 'badge-completed';
    }

    return 'badge-cancelled';
  };


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


        <div className="flex items-center gap-3">

          <Button
            variant="outline"
            onClick={() =>
              fetchDashboardData(
                false
              )
            }
            disabled={refreshing}
            className="rounded-xl h-12"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${
                refreshing
                  ? 'animate-spin'
                  : ''
              }`}
            />

            Refresh
          </Button>


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

      </div>


      {/* STATS */}

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


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">


        {/* LEFT SECTION */}

        <div className="lg:col-span-2 space-y-10">


          {/* UPCOMING TRIPS */}

          {upcomingTrips.length > 0 && (

            <div className="space-y-6">

              <div className="flex items-center justify-between">

                <h2 className="text-2xl font-bold text-foreground">
                  Upcoming Trips
                </h2>

                <Link
                  to="/guest/upcoming-trips"
                  className="text-primary font-semibold hover:underline text-sm flex items-center"
                >
                  View All

                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {upcomingTrips.map(
                  (trip) => {

                    const property =
                      trip.property ||
                      trip.expand?.propertyId;

                    const image =
                      getPropertyImage(
                        property
                      );

                    return (

                      <Link
                        key={
                          trip.id ||
                          trip._id
                        }
                        to={`/guest/bookings/${
                          trip.id ||
                          trip._id
                        }`}
                        className="block group"
                      >

                        <div className="relative aspect-video rounded-2xl overflow-hidden mb-3 bg-muted">

                          {image ? (

                            <img
                              src={image}
                              alt={
                                property?.title ||
                                trip.propertyName ||
                                'Property'
                              }
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                          ) : (

                            <div className="w-full h-full flex items-center justify-center">

                              <MapPin className="w-10 h-10 text-muted-foreground opacity-30" />

                            </div>

                          )}


                          <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">

                            {formatDate(
                              trip.checkInDate
                            )}

                          </div>

                        </div>


                        <h3 className="font-bold text-foreground truncate group-hover:text-primary transition-colors">

                          {property?.title ||
                            trip.propertyName ||
                            'Your Stay'}

                        </h3>

                      </Link>

                    );
                  }
                )}

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

                {[1, 2, 3].map(
                  (item) => (

                    <Skeleton
                      key={item}
                      className="w-full h-24 rounded-2xl"
                    />

                  )
                )}

              </div>

            ) : recentBookings.length > 0 ? (

              <div className="space-y-4">

                {recentBookings.map(
                  (booking) => {

                    const property =
                      booking.property ||
                      booking.expand?.propertyId;

                    const image =
                      getPropertyImage(
                        property
                      );

                    const status =
                      getBookingStatus(
                        booking
                      );

                    const badgeClass =
                      getStatusClass(
                        status
                      );


                    return (

                      <Link
                        key={
                          booking.id ||
                          booking._id
                        }
                        to={`/guest/bookings/${
                          booking.id ||
                          booking._id
                        }`}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:bg-muted/50 transition-colors group"
                      >

                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-muted">

                          {image ? (

                            <img
                              src={image}
                              alt={
                                property?.title ||
                                booking.propertyName ||
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


                        <div className="flex-1 min-w-0">

                          <h3 className="font-bold text-foreground truncate group-hover:text-primary transition-colors">

                            {property?.title ||
                              booking.propertyName ||
                              'Property Booking'}

                          </h3>


                          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">

                            <Clock className="w-3.5 h-3.5" />

                            {formatDate(
                              booking.checkInDate
                            )}

                            {' - '}

                            {formatDate(
                              booking.checkOutDate
                            )}

                          </p>

                        </div>


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
                              .replace(
                                /_/g,
                                ' '
                              )
                              .toUpperCase()}

                          </Badge>

                        </div>

                      </Link>

                    );
                  }
                )}

              </div>

            ) : (

              <div className="dashboard-card flex flex-col items-center justify-center text-center py-12 bg-muted/20">

                <Luggage className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />

                <h3 className="text-lg font-bold text-foreground mb-2">
                  No bookings yet
                </h3>

                <p className="text-muted-foreground max-w-sm">
                  When you book a stay, it will appear here.
                </p>


                <Button
                  asChild
                  className="mt-5 rounded-xl"
                >

                  <Link to="/search">
                    Explore Properties
                  </Link>

                </Button>

              </div>

            )}

          </div>

        </div>


        {/* QUICK ACTIONS */}

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