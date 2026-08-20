import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  Users,
  Home,
  Calendar,
  IndianRupee,
  ArrowUpRight,
  ArrowRight,
  MoreHorizontal,
  Plus,
  Search,
  TrendingUp,
  Building2,
} from 'lucide-react';

import { useRealtimeDashboardStats } from '@/hooks/useRealtimeDashboardStats.js';
import { formatCurrencyINR, formatDate } from '@/lib/bookingUtils.js';
import pb from '@/lib/pocketbaseClient';

const AdminDashboard = () => {
  const { stats, isLoading } = useRealtimeDashboardStats();
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const fetchRecentBookings = async () => {
      try {
        const records = await pb.collection('bookings').getList(1, 6, {
          sort: '-created',
          $autoCancel: false,
        });

        setRecentBookings(records.items || []);
      } catch (error) {
        console.error('Failed to load recent bookings:', error);
      }
    };

    fetchRecentBookings();
  }, []);

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrencyINR(stats?.totalRevenue || 0),
      change: '+12.5%',
      subtitle: 'vs last month',
      icon: IndianRupee,
      iconBg: 'bg-orange-50 text-orange-600',
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      change: '+8.2%',
      subtitle: 'vs last month',
      icon: Calendar,
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Active Properties',
      value: stats?.totalProperties || 0,
      change: '+5.4%',
      subtitle: 'vs last month',
      icon: Home,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      change: '+10.3%',
      subtitle: 'vs last month',
      icon: Users,
      iconBg: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">

      <Helmet>
        <title>Dashboard | Take On BnB Admin</title>
      </Helmet>

      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Welcome back, Administrator
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            Dashboard Overview
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Monitor your properties, bookings, revenue and platform activity.
          </p>
        </div>

        <Link
          to="/admin/properties"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Add Property
        </Link>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>

                  {isLoading ? (
                    <div className="mt-3 h-9 w-24 animate-pulse rounded bg-muted" />
                  ) : (
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                      {card.value}
                    </h2>
                  )}
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg}`}
                >
                  <Icon className="h-6 w-6" />
                </div>

              </div>

              <div className="mt-5 flex items-center gap-2">

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  {card.change}
                </span>

                <span className="text-xs text-muted-foreground">
                  {card.subtitle}
                </span>

              </div>

            </div>
          );
        })}

      </div>

      {/* MIDDLE SECTION */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* REVENUE */}
        <div className="xl:col-span-2 rounded-2xl border border-border bg-card shadow-sm">

          <div className="flex items-center justify-between border-b border-border p-6">

            <div>
              <h2 className="text-lg font-bold text-foreground">
                Revenue Overview
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Your platform revenue performance
              </p>
            </div>

            <Link
              to="/admin/analytics"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              View Report
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

          <div className="p-6">

            <div className="flex h-[320px] items-end gap-3 sm:gap-5">

              {[35, 48, 42, 65, 58, 72, 84, 70, 90, 78, 96, 88].map(
                (height, index) => (
                  <div
                    key={index}
                    className="group flex flex-1 flex-col items-center justify-end gap-3"
                  >
                    <div
                      className="w-full rounded-t-xl bg-primary/20 transition-all duration-300 group-hover:bg-primary"
                      style={{ height: `${height}%` }}
                    />

                    <span className="text-[10px] font-medium text-muted-foreground sm:text-xs">
                      {[
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec',
                      ][index]}
                    </span>
                  </div>
                )
              )}

            </div>

          </div>

        </div>

        {/* QUICK ACTIONS */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">

          <div className="mb-6">
            <h2 className="text-lg font-bold text-foreground">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage your platform quickly
            </p>
          </div>

          <div className="space-y-3">

            <Link
              to="/admin/properties"
              className="flex items-center justify-between rounded-xl border border-border p-4 transition-all hover:border-primary hover:bg-primary/5"
            >
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-semibold text-foreground">
                    Manage Properties
                  </p>

                  <p className="text-xs text-muted-foreground">
                    View all listings
                  </p>
                </div>

              </div>

              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            <Link
              to="/admin/bookings"
              className="flex items-center justify-between rounded-xl border border-border p-4 transition-all hover:border-primary hover:bg-primary/5"
            >
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Calendar className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-semibold text-foreground">
                    Manage Bookings
                  </p>

                  <p className="text-xs text-muted-foreground">
                    View booking activity
                  </p>
                </div>

              </div>

              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>

            <Link
              to="/admin/users"
              className="flex items-center justify-between rounded-xl border border-border p-4 transition-all hover:border-primary hover:bg-primary/5"
            >
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <Users className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-semibold text-foreground">
                    Manage Users
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Guests and hosts
                  </p>
                </div>

              </div>

              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>

          </div>

        </div>

      </div>

      {/* RECENT BOOKINGS */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">

        <div className="flex flex-col gap-4 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-lg font-bold text-foreground">
              Recent Bookings
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Latest booking activity on your platform
            </p>
          </div>

          <Link
            to="/admin/bookings"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[700px]">

            <thead className="bg-muted/40">

              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Property
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Guest
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Date
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Amount
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Action
                </th>
              </tr>

            </thead>

            <tbody className="divide-y divide-border">

              {recentBookings.length === 0 ? (

                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-14 text-center text-sm text-muted-foreground"
                  >
                    No recent bookings found.
                  </td>
                </tr>

              ) : (

                recentBookings.map((booking) => {

                  const status =
                    booking.bookingStatus ||
                    booking.status ||
                    'pending';

                  const isConfirmed =
                    status === 'confirmed';

                  return (

                    <tr
                      key={booking.id}
                      className="transition-colors hover:bg-muted/30"
                    >

                      <td className="px-6 py-4">

                        <div className="font-semibold text-foreground">
                          {booking.propertyName || 'Property'}
                        </div>

                        <div className="mt-1 text-xs text-muted-foreground">
                          #{booking.id?.slice(-6)}
                        </div>

                      </td>

                      <td className="px-6 py-4 text-sm text-foreground">
                        {booking.guestFullName || 'Guest'}
                      </td>

                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {booking.created
                          ? formatDate(booking.created)
                          : '-'}
                      </td>

                      <td className="px-6 py-4 font-semibold text-foreground">
                        {formatCurrencyINR(
                          booking.totalAmount ||
                          booking.totalPrice ||
                          0
                        )}
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            isConfirmed
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : 'bg-amber-500/10 text-amber-600'
                          }`}
                        >
                          {status.replace(/_/g, ' ')}
                        </span>

                      </td>

                      <td className="px-6 py-4 text-right">

                        <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>

                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;