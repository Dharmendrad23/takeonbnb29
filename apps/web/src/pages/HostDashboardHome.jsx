import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import {
  Home,
  CalendarCheck,
  DollarSign,
  Star,
  Plus,
  ArrowRight,
  RefreshCw,
  Clock,
  CheckCircle2,
  Eye,
  Settings,
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext.jsx';
import HostDashboardLayout from '@/components/HostDashboardLayout.jsx';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

import {
  formatCurrency,
  formatDate,
} from '@/lib/bookingUtils.js';

import pb from '@/lib/pocketbaseClient';

const HostDashboardHome = () => {
  const { currentUser } = useAuth();

  const [stats, setStats] = useState({
    properties: 0,
    liveProperties: 0,
    bookings: 0,
    earnings: 0,
    rating: 0,
  });

  const [properties, setProperties] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = useCallback(
    async (showRefreshMessage = false) => {
      if (!currentUser?.id) {
        setLoading(false);
        return;
      }

      try {
        if (showRefreshMessage) {
          setRefreshing(true);
        }

        const [
          allProperties,
          allBookings,
        ] = await Promise.all([
          pb.collection('properties').getFullList({
            filter: `hostId="${currentUser.id}"`,
            sort: '-updated',
            $autoCancel: false,
          }),

          pb.collection('bookings').getFullList({
            sort: '-created',
            $autoCancel: false,
          }),
        ]);

        const hostPropertyIds = new Set(
          allProperties.map((property) =>
            String(property.id)
          )
        );

        const hostBookings = allBookings.filter(
          (booking) => {
            const propertyId =
              typeof booking.propertyId === 'object'
                ? booking.propertyId?.id ||
                  booking.propertyId?._id
                : booking.propertyId;

            return hostPropertyIds.has(
              String(propertyId)
            );
          }
        );

        const activeBookings =
          hostBookings.filter((booking) => {
            const status = String(
              booking.bookingStatus ||
              booking.status ||
              ''
            ).toLowerCase();

            return [
              'confirmed',
              'checked-in',
              'pending',
              'pending_verification',
            ].includes(status);
          });

        const validEarnings =
          hostBookings
            .filter((booking) => {
              const status = String(
                booking.bookingStatus ||
                booking.status ||
                ''
              ).toLowerCase();

              return ![
                'cancelled',
                'rejected',
                'failed',
              ].includes(status);
            })
            .reduce(
              (sum, booking) =>
                sum +
                Number(
                  booking.hostEarnings ||
                  booking.hostAmount ||
                  booking.totalAmount ||
                  booking.totalPrice ||
                  0
                ),
              0
            );

        const liveProperties =
          allProperties.filter((property) => {
            const status = String(
              property.status ||
              property.approvalStatus ||
              ''
            ).toLowerCase();

            return [
              'live',
              'approved',
              'published',
            ].includes(status);
          }).length;

        setStats({
          properties:
            allProperties.length,

          liveProperties,

          bookings:
            activeBookings.length,

          earnings:
            validEarnings,

          rating:
            Number(
              currentUser?.rating ||
              0
            ),
        });

        setProperties(
          allProperties.slice(0, 4)
        );

        setRecentBookings(
          hostBookings.slice(0, 5)
        );

        if (showRefreshMessage) {
          toast.success(
            'Dashboard updated successfully'
          );
        }
      } catch (error) {
        console.error(
          'Host dashboard error:',
          error
        );

        toast.error(
          'Failed to load dashboard data'
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentUser]
  );

  useEffect(() => {
    loadDashboard();

    /*
      AUTO REFRESH

      Since current backend does not have
      PocketBase realtime/WebSocket,
      dashboard refreshes every 15 seconds.
    */

    const interval = setInterval(
      () => {
        loadDashboard(false);
      },
      15000
    );

    return () => {
      clearInterval(interval);
    };
  }, [loadDashboard]);

  const getPropertyImage = (property) => {
    if (!property) return null;

    return (
      property.coverImage ||
      property.thumbnail ||
      property.images?.[0] ||
      property.photos?.[0] ||
      null
    );
  };

  const getBookingProperty = (booking) => {
    const propertyId = booking?.propertyId;

    if (
      propertyId &&
      typeof propertyId === 'object'
    ) {
      return propertyId;
    }

    return (
      booking?.expand?.propertyId ||
      null
    );
  };

  const getStatus = (booking) => {
    return String(
      booking?.bookingStatus ||
      booking?.status ||
      'pending'
    ).toLowerCase();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
      case 'checked-in':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';

      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';

      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';

      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    description,
    iconClass,
  }) => (
    <div className="p-6 rounded-2xl bg-card border border-border flex items-start gap-4 hover:shadow-md transition-all">
      <div
        className={`p-3 rounded-xl shrink-0 ${iconClass}`}
      >
        <Icon className="w-6 h-6" />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-medium text-muted-foreground">
          {label}
        </p>

        {loading ? (
          <Skeleton className="h-8 w-24 mt-2" />
        ) : (
          <p className="text-2xl font-bold text-foreground mt-1">
            {value}
          </p>
        )}

        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <HostDashboardLayout>
      <Helmet>
        <title>
          Host Dashboard | Take On BnB
        </title>
      </Helmet>

      {/* HEADER */}

      <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <p className="text-sm font-semibold text-primary mb-2">
            HOST DASHBOARD
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Welcome back,{' '}
            {currentUser?.name ||
              currentUser?.fullName ||
              'Host'}
            !
          </h1>

          <p className="text-muted-foreground mt-2 text-lg">
            Manage your properties, bookings and
            earnings from one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() =>
              loadDashboard(true)
            }
            disabled={refreshing}
            className="rounded-xl"
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
            className="rounded-xl font-bold"
          >
            <Link to="/host/add-property">
              <Plus className="w-4 h-4 mr-2" />

              Add Property
            </Link>
          </Button>
        </div>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        <StatCard
          icon={Home}
          label="Total Properties"
          value={stats.properties}
          description={`${stats.liveProperties} currently live`}
          iconClass="bg-blue-100 text-blue-600"
        />

        <StatCard
          icon={CalendarCheck}
          label="Active Bookings"
          value={stats.bookings}
          description="Current & upcoming reservations"
          iconClass="bg-emerald-100 text-emerald-600"
        />

        <StatCard
          icon={DollarSign}
          label="Total Earnings"
          value={formatCurrency(stats.earnings)}
          description="From non-cancelled bookings"
          iconClass="bg-primary/10 text-primary"
        />

        <StatCard
          icon={Star}
          label="Average Rating"
          value={
            stats.rating > 0
              ? stats.rating.toFixed(1)
              : '—'
          }
          description="Based on guest reviews"
          iconClass="bg-amber-100 text-amber-600"
        />
      </div>

      {/* MAIN GRID */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* RECENT BOOKINGS */}

        <div className="xl:col-span-2">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Recent Bookings
                </h2>

                <p className="text-sm text-muted-foreground mt-1">
                  Latest guest reservations
                </p>
              </div>

              <Link
                to="/host/bookings"
                className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline"
              >
                Manage Bookings

                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((item) => (
                  <Skeleton
                    key={item}
                    className="h-20 w-full rounded-xl"
                  />
                ))}
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="p-12 text-center">
                <CalendarCheck className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />

                <h3 className="font-bold text-lg">
                  No bookings yet
                </h3>

                <p className="text-sm text-muted-foreground mt-2">
                  Guest bookings for your properties
                  will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentBookings.map(
                  (booking) => {
                    const property =
                      getBookingProperty(
                        booking
                      );

                    const status =
                      getStatus(booking);

                    return (
                      <div
                        key={booking.id}
                        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                            <Home className="w-5 h-5 text-muted-foreground" />
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-bold truncate">
                              {property?.title ||
                                booking.propertyName ||
                                'Property Booking'}
                            </h3>

                            <p className="text-sm text-muted-foreground mt-1">
                              Guest:{' '}
                              {booking.guestName ||
                                booking.guest?.name ||
                                'Guest'}
                            </p>

                            {booking.checkInDate && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDate(
                                  booking.checkInDate
                                )}
                                {' → '}
                                {formatDate(
                                  booking.checkOutDate
                                )}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 justify-between sm:justify-end">
                          <div className="text-left sm:text-right">
                            <p className="font-bold">
                              {formatCurrency(
                                Number(
                                  booking.hostEarnings ||
                                  booking.hostAmount ||
                                  booking.totalAmount ||
                                  booking.totalPrice ||
                                  0
                                )
                              )}
                            </p>

                            <Badge
                              variant="outline"
                              className={`mt-1 ${getStatusBadge(
                                status
                              )}`}
                            >
                              {status.replace(
                                /_/g,
                                ' '
                              )}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </div>

        {/* QUICK MANAGEMENT */}

        <div className="space-y-6">

          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-1">
              Quick Management
            </h2>

            <p className="text-sm text-muted-foreground mb-5">
              Manage your hosting account
            </p>

            <div className="space-y-3">

              <Link
                to="/host/properties"
                className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-primary" />

                  <span className="font-semibold">
                    Manage Properties
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/host/bookings"
                className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <CalendarCheck className="w-5 h-5 text-emerald-600" />

                  <span className="font-semibold">
                    Manage Bookings
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/host/earnings"
                className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-primary" />

                  <span className="font-semibold">
                    View Earnings
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/host/settings"
                className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-muted-foreground" />

                  <span className="font-semibold">
                    Host Settings
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

            </div>
          </div>

          {/* PROPERTY OVERVIEW */}

          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold">
                  Your Properties
                </h2>

                <p className="text-sm text-muted-foreground">
                  Quick overview
                </p>
              </div>

              <Link
                to="/host/properties"
                className="text-primary"
              >
                <Eye className="w-5 h-5" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <Skeleton
                    key={item}
                    className="h-16 w-full rounded-xl"
                  />
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-6">
                <Clock className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />

                <p className="text-sm text-muted-foreground">
                  No properties added yet
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {properties.map(
                  (property) => {
                    const image =
                      getPropertyImage(
                        property
                      );

                    const status =
                      String(
                        property.status ||
                        property.approvalStatus ||
                        'draft'
                      ).toLowerCase();

                    return (
                      <Link
                        key={property.id}
                        to={`/host/edit-property/${property.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                          {image ? (
                            <img
                              src={pb.files.getUrl(
                                property,
                                image
                              )}
                              alt={
                                property.title ||
                                'Property'
                              }
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Home className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate group-hover:text-primary">
                            {property.title ||
                              property.name ||
                              'Untitled Property'}
                          </p>

                          <div className="flex items-center gap-2 mt-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />

                            <span className="text-xs text-muted-foreground capitalize">
                              {status}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  }
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </HostDashboardLayout>
  );
};

export default HostDashboardHome;