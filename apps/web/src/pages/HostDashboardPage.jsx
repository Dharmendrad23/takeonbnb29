import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext.jsx";
import api from "@/lib/api";

import {
  Home,
  IndianRupee,
  CalendarDays,
  CalendarCheck,
  Plus,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle2,
  Bell,
  Wallet,
  ArrowUpRight,
  ArrowRight,
  Building2,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Button,
} from "@/components/ui/button";

import HostDashboardLayout from "@/components/HostDashboardLayout.jsx";


const HostDashboardPage = () => {
  const { currentUser } = useAuth();

  const [stats, setStats] = useState({
    properties: 0,
    liveProperties: 0,
    pendingProperties: 0,
    bookings: 0,
    revenue: 0,
    pendingPayout: 0,
  });

  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchDashboardData = async () => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/dashboard", {
        params: {
          hostId: currentUser.id,
        },
      });

      const data = response.data;

      const hostProperties = Array.isArray(
        data?.properties
      )
        ? data.properties
        : [];

      const hostBookings = Array.isArray(
        data?.bookings
      )
        ? data.bookings
        : [];


      const liveProperties =
        hostProperties.filter((property) => {
          const status = String(
            property.status || ""
          ).toLowerCase();

          return (
            status === "approved" ||
            status === "live" ||
            status === "published"
          );
        });


      const pendingProperties =
        hostProperties.filter((property) => {
          const status = String(
            property.status || ""
          ).toLowerCase();

          return status === "pending";
        });


      const revenue =
        hostBookings
          .filter((booking) => {
            return (
              booking.paymentStatus === "paid" ||
              booking.status === "confirmed"
            );
          })
          .reduce(
            (total, booking) =>
              total +
              Number(
                booking.totalAmount ||
                  booking.totalPrice ||
                  0
              ),
            0
          );


      const pendingPayout =
        revenue * 0.3;


      setProperties(hostProperties);

      setBookings(hostBookings);

      setStats({
        properties:
          hostProperties.length,

        liveProperties:
          liveProperties.length,

        pendingProperties:
          pendingProperties.length,

        bookings:
          hostBookings.length,

        revenue,

        pendingPayout,
      });

    } catch (error) {

      console.error(
        "Dashboard API Error:",
        error
      );

      setProperties([]);
      setBookings([]);

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    fetchDashboardData();

    const interval =
      setInterval(() => {

        fetchDashboardData();

      }, 30000);


    return () =>
      clearInterval(interval);

  }, [currentUser?.id]);


  const getPropertyBookings = (
    propertyId
  ) => {

    return bookings.filter(
      (booking) => {

        const bookingPropertyId =
          booking?.propertyId?._id ||
          booking?.propertyId?.id ||
          booking?.propertyId;

        return (
          String(
            bookingPropertyId
          ) ===
          String(propertyId)
        );

      }
    ).length;

  };


  const getStatusStyle = (
    status
  ) => {

    const normalized =
      String(
        status || "pending"
      ).toLowerCase();


    if (
      normalized === "approved" ||
      normalized === "live" ||
      normalized === "confirmed"
    ) {

      return (
        "bg-emerald-50 " +
        "text-emerald-600 " +
        "border-emerald-100"
      );

    }


    if (
      normalized === "pending"
    ) {

      return (
        "bg-amber-50 " +
        "text-amber-600 " +
        "border-amber-100"
      );

    }


    if (
      normalized === "cancelled" ||
      normalized === "rejected"
    ) {

      return (
        "bg-red-50 " +
        "text-red-600 " +
        "border-red-100"
      );

    }


    return (
      "bg-slate-100 " +
      "text-slate-600 " +
      "border-slate-200"
    );

  };


  const recentBookings =
    bookings.slice(0, 4);


  const recentProperties =
    properties.slice(0, 4);


  if (loading) {

    return (

      <HostDashboardLayout>

        <div className="min-h-[70vh] flex items-center justify-center">

          <div className="text-center">

            <div className="w-12 h-12 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />

            <p className="mt-4 text-sm text-muted-foreground">
              Loading your dashboard...
            </p>

          </div>

        </div>

      </HostDashboardLayout>

    );

  }


  return (

    <HostDashboardLayout>

      <Helmet>

        <title>
          Host Dashboard | Take On BnB
        </title>

      </Helmet>


      {/* HEADER */}

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 mb-8">

        <div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">

            Welcome back,{" "}

            {currentUser?.name ||
              currentUser?.fullName ||
              "Host"}

            ! 👋

          </h1>


          <p className="text-sm md:text-base text-slate-500 mt-2">

            Here's what's happening with your
            properties today.

          </p>

        </div>


        <div className="flex items-center gap-3 flex-wrap">

          <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-600">

            <CalendarDays className="w-4 h-4" />

            01 Aug - 31 Aug 2026

          </div>


          <Button
            asChild
            className="rounded-xl px-5 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          >

            <Link to="/host/property/new">

              <Plus className="w-4 h-4 mr-2" />

              Add Property

            </Link>

          </Button>

        </div>

      </div>



      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">


        {/* TOTAL PROPERTIES */}

        <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">

          <CardContent className="p-5">

            <div className="flex justify-between items-start">

              <div className="flex gap-4">

                <div className="w-12 h-12 rounded-xl bg-orange-50 text-primary flex items-center justify-center">

                  <Home className="w-6 h-6" />

                </div>


                <div>

                  <p className="text-sm font-medium text-slate-500">

                    Total Properties

                  </p>


                  <h2 className="text-2xl font-bold text-slate-800 mt-1">

                    {String(
                      stats.properties
                    ).padStart(2, "0")}

                  </h2>

                </div>

              </div>


              <Building2 className="w-5 h-5 text-slate-400" />

            </div>


            <div className="flex gap-4 mt-5 text-xs">

              <span className="text-slate-500">

                Active:{" "}

                <b className="text-slate-700">

                  {String(
                    stats.liveProperties
                  ).padStart(2, "0")}

                </b>

              </span>


              <span className="text-slate-500">

                Pending:{" "}

                <b className="text-slate-700">

                  {String(
                    stats.pendingProperties
                  ).padStart(2, "0")}

                </b>

              </span>

            </div>


            <Link
              to="/host/properties"
              className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-primary hover:underline"
            >

              View all properties

              <ArrowRight className="w-3 h-3" />

            </Link>

          </CardContent>

        </Card>



        {/* TOTAL BOOKINGS */}

        <Card className="border-slate-200 shadow-sm rounded-2xl">

          <CardContent className="p-5">

            <div className="flex justify-between items-start">

              <div className="flex gap-4">

                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">

                  <CalendarCheck className="w-6 h-6" />

                </div>


                <div>

                  <p className="text-sm font-medium text-slate-500">

                    Total Bookings

                  </p>


                  <h2 className="text-2xl font-bold text-slate-800 mt-1">

                    {stats.bookings}

                  </h2>

                </div>

              </div>


              <Users className="w-5 h-5 text-slate-400" />

            </div>


            <p className="text-xs text-slate-500 mt-5">

              All guest reservations

            </p>


            <Link
              to="/host/bookings"
              className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-emerald-600 hover:underline"
            >

              View all bookings

              <ArrowRight className="w-3 h-3" />

            </Link>

          </CardContent>

        </Card>



        {/* EARNINGS */}

        <Card className="border-slate-200 shadow-sm rounded-2xl">

          <CardContent className="p-5">

            <div className="flex justify-between items-start">

              <div className="flex gap-4">

                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">

                  <Wallet className="w-6 h-6" />

                </div>


                <div>

                  <p className="text-sm font-medium text-slate-500">

                    Monthly Earnings

                  </p>


                  <h2 className="text-2xl font-bold text-slate-800 mt-1">

                    ₹
                    {stats.revenue.toLocaleString(
                      "en-IN"
                    )}

                  </h2>

                </div>

              </div>


              <TrendingUp className="w-5 h-5 text-slate-400" />

            </div>


            <p className="text-xs text-emerald-600 mt-5">

              +12.5% from last month

            </p>


            <Link
              to="/host/earnings"
              className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-blue-600 hover:underline"
            >

              View earnings

              <ArrowRight className="w-3 h-3" />

            </Link>

          </CardContent>

        </Card>



        {/* PAYOUT */}

        <Card className="border-slate-200 shadow-sm rounded-2xl">

          <CardContent className="p-5">

            <div className="flex justify-between items-start">

              <div className="flex gap-4">

                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">

                  <IndianRupee className="w-6 h-6" />

                </div>


                <div>

                  <p className="text-sm font-medium text-slate-500">

                    Pending Payout

                  </p>


                  <h2 className="text-2xl font-bold text-slate-800 mt-1">

                    ₹
                    {Math.round(
                      stats.pendingPayout
                    ).toLocaleString(
                      "en-IN"
                    )}

                  </h2>

                </div>

              </div>


              <Clock className="w-5 h-5 text-slate-400" />

            </div>


            <p className="text-xs text-slate-500 mt-5">

              Will be processed soon

            </p>


            <Link
              to="/host/payouts"
              className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-red-500 hover:underline"
            >

              View payouts

              <ArrowRight className="w-3 h-3" />

            </Link>

          </CardContent>

        </Card>

      </div>



      {/* MIDDLE SECTION */}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">


        {/* RECENT BOOKINGS */}

        <Card className="xl:col-span-4 rounded-2xl border-slate-200 shadow-sm">

          <CardContent className="p-0">

            <div className="flex items-center justify-between p-5 border-b border-slate-100">

              <h2 className="font-bold text-slate-800">

                Recent Bookings

              </h2>


              <Link
                to="/host/bookings"
                className="text-xs font-semibold text-primary"
              >

                View all

              </Link>

            </div>


            {recentBookings.length === 0 ? (

              <div className="py-12 text-center">

                <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />

                <p className="text-sm text-slate-500">

                  No bookings yet

                </p>

              </div>

            ) : (

              <div className="divide-y divide-slate-100">

                {recentBookings.map(
                  (booking, index) => {

                    const status =
                      booking.status ||
                      booking.bookingStatus ||
                      "pending";


                    return (

                      <div
                        key={
                          booking.id ||
                          booking._id ||
                          index
                        }
                        className="flex items-center justify-between gap-3 p-4"
                      >

                        <div className="flex items-center gap-3 min-w-0">

                          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">

                            <Home className="w-5 h-5 text-primary" />

                          </div>


                          <div className="min-w-0">

                            <p className="font-semibold text-sm text-slate-800 truncate">

                              {booking.guestName ||
                                booking.guest?.name ||
                                "Guest Booking"}

                            </p>


                            <p className="text-xs text-slate-500 truncate mt-1">

                              {booking.propertyName ||
                                "Take On BnB Property"}

                            </p>

                          </div>

                        </div>


                        <div className="text-right shrink-0">

                          <span
                            className={`inline-flex px-2.5 py-1 border rounded-full text-[10px] font-semibold capitalize ${getStatusStyle(
                              status
                            )}`}
                          >

                            {String(
                              status
                            ).replace(
                              /_/g,
                              " "
                            )}

                          </span>


                          <p className="text-xs font-bold text-slate-700 mt-2">

                            ₹
                            {Number(
                              booking.totalAmount ||
                                booking.totalPrice ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}

                          </p>

                        </div>

                      </div>

                    );

                  }
                )}

              </div>

            )}

          </CardContent>

        </Card>



        {/* EARNINGS OVERVIEW */}

        <Card className="xl:col-span-5 rounded-2xl border-slate-200 shadow-sm">

          <CardContent className="p-6">

            <div className="flex justify-between items-center mb-8">

              <div>

                <h2 className="font-bold text-slate-800">

                  Earnings Overview

                </h2>

                <p className="text-xs text-slate-500 mt-1">

                  Monthly performance

                </p>

              </div>


              <Link
                to="/host/earnings"
                className="text-xs font-semibold text-primary"
              >

                View report

              </Link>

            </div>


            <div className="h-[220px] flex items-end justify-between gap-3">

              {[35, 48, 58, 46, 70, 82, 60, 78, 67, 92, 100].map(
                (height, index) => (

                  <div
                    key={index}
                    className="flex-1 flex flex-col justify-end items-center h-full"
                  >

                    <div
                      className="w-full max-w-[28px] rounded-t-lg bg-primary/20 hover:bg-primary transition-all duration-300 cursor-pointer"
                      style={{
                        height: `${height}%`,
                      }}
                    />

                  </div>

                )
              )}

            </div>


            <div className="flex justify-between text-[10px] text-slate-400 mt-4">

              <span>1 Aug</span>

              <span>8 Aug</span>

              <span>15 Aug</span>

              <span>22 Aug</span>

              <span>31 Aug</span>

            </div>

          </CardContent>

        </Card>



        {/* OCCUPANCY */}

        <Card className="xl:col-span-3 rounded-2xl border-slate-200 shadow-sm">

          <CardContent className="p-6">

            <div className="flex justify-between items-center mb-5">

              <h2 className="font-bold text-slate-800">

                Occupancy Rate

              </h2>


              <TrendingUp className="w-4 h-4 text-primary" />

            </div>


            <div className="flex flex-col items-center py-4">

              <div className="relative w-36 h-36 rounded-full flex items-center justify-center">

                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "conic-gradient(#f97316 72%, #e5e7eb 0)",
                  }}
                />

                <div className="absolute inset-[12px] bg-white rounded-full" />


                <div className="relative text-center">

                  <p className="text-3xl font-bold text-slate-800">

                    72%

                  </p>

                  <p className="text-xs text-slate-500">

                    Occupied

                  </p>

                </div>

              </div>

            </div>


            <div className="space-y-3 mt-4">

              <div className="flex items-center justify-between text-sm">

                <div className="flex items-center gap-2">

                  <span className="w-3 h-3 rounded-full bg-primary" />

                  Occupied

                </div>

                <b>72%</b>

              </div>


              <div className="flex items-center justify-between text-sm">

                <div className="flex items-center gap-2">

                  <span className="w-3 h-3 rounded-full bg-slate-200" />

                  Vacant

                </div>

                <b>28%</b>

              </div>

            </div>

          </CardContent>

        </Card>

      </div>



      {/* BOTTOM SECTION */}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">


        {/* MY PROPERTIES */}

        <Card className="xl:col-span-7 rounded-2xl border-slate-200 shadow-sm">

          <CardContent className="p-0">

            <div className="p-6 flex justify-between items-center border-b border-slate-100">

              <div>

                <h2 className="font-bold text-slate-800">

                  My Properties

                </h2>

                <p className="text-xs text-slate-500 mt-1">

                  Manage your active listings

                </p>

              </div>


              <Link
                to="/host/properties"
                className="text-xs font-semibold text-primary"
              >

                View all

              </Link>

            </div>


            {recentProperties.length === 0 ? (

              <div className="py-16 text-center">

                <Home className="w-12 h-12 mx-auto text-slate-300 mb-4" />

                <h3 className="font-bold">

                  No properties yet

                </h3>

                <p className="text-sm text-slate-500 mt-2 mb-5">

                  Add your first property to start hosting.

                </p>


                <Button asChild>

                  <Link to="/host/property/new">

                    <Plus className="w-4 h-4 mr-2" />

                    Add Property

                  </Link>

                </Button>

              </div>

            ) : (

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">

                {recentProperties.map(
                  (property) => {

                    const propertyId =
                      property.id ||
                      property._id;


                    return (

                      <div
                        key={propertyId}
                        className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                      >

                        <div className="h-28 bg-slate-100 flex items-center justify-center">

                          {property.image ||
                          property.thumbnail ? (

                            <img
                              src={
                                property.image ||
                                property.thumbnail
                              }
                              alt={
                                property.title ||
                                "Property"
                              }
                              className="w-full h-full object-cover"
                            />

                          ) : (

                            <Home className="w-8 h-8 text-slate-300" />

                          )}

                        </div>


                        <div className="p-3">

                          <h3 className="font-semibold text-sm text-slate-800 truncate">

                            {property.title ||
                              "Untitled Property"}

                          </h3>


                          <p className="text-[11px] text-slate-500 mt-1 truncate">

                            {property.location ||
                              property.city ||
                              "Dehradun"}

                          </p>


                          <p className="text-sm font-bold text-slate-800 mt-3">

                            ₹
                            {Number(
                              property.pricePerNight ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}

                            <span className="text-[10px] text-slate-400 font-normal">

                              {" "}
                              / night

                            </span>

                          </p>


                          <div className="flex gap-2 mt-3">

                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 h-8 text-xs"
                              asChild
                            >

                              <Link
                                to={`/host/edit-property/${propertyId}`}
                              >

                                Edit

                              </Link>

                            </Button>


                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-2"
                              asChild
                            >

                              <Link
                                to={`/property/${propertyId}`}
                              >

                                <Eye className="w-3.5 h-3.5" />

                              </Link>

                            </Button>

                          </div>

                        </div>

                      </div>

                    );

                  }
                )}

              </div>

            )}

          </CardContent>

        </Card>



        {/* NOTIFICATIONS */}

        <Card className="xl:col-span-5 rounded-2xl border-slate-200 shadow-sm">

          <CardContent className="p-0">

            <div className="p-6 flex justify-between items-center border-b border-slate-100">

              <div>

                <h2 className="font-bold text-slate-800">

                  Notifications

                </h2>

                <p className="text-xs text-slate-500 mt-1">

                  Latest activity

                </p>

              </div>


              <Link
                to="/host/notifications"
                className="text-xs font-semibold text-primary"
              >

                View all

              </Link>

            </div>


            <div className="divide-y divide-slate-100">

              <div className="flex gap-4 p-5">

                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">

                  <CalendarCheck className="w-5 h-5" />

                </div>

                <div>

                  <p className="text-sm font-semibold">

                    New booking received

                  </p>

                  <p className="text-xs text-slate-500 mt-1">

                    You have received a new guest booking.

                  </p>

                  <p className="text-[10px] text-slate-400 mt-2">

                    Just now

                  </p>

                </div>

              </div>


              <div className="flex gap-4 p-5">

                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">

                  <CheckCircle2 className="w-5 h-5" />

                </div>

                <div>

                  <p className="text-sm font-semibold">

                    Property approved

                  </p>

                  <p className="text-xs text-slate-500 mt-1">

                    Your property has been approved.

                  </p>

                  <p className="text-[10px] text-slate-400 mt-2">

                    1 hour ago

                  </p>

                </div>

              </div>


              <div className="flex gap-4 p-5">

                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">

                  <IndianRupee className="w-5 h-5" />

                </div>

                <div>

                  <p className="text-sm font-semibold">

                    Payout initiated

                  </p>

                  <p className="text-xs text-slate-500 mt-1">

                    Your earnings are being processed.

                  </p>

                  <p className="text-[10px] text-slate-400 mt-2">

                    3 hours ago

                  </p>

                </div>

              </div>


              <div className="flex gap-4 p-5">

                <div className="w-10 h-10 rounded-xl bg-orange-50 text-primary flex items-center justify-center shrink-0">

                  <Bell className="w-5 h-5" />

                </div>

                <div>

                  <p className="text-sm font-semibold">

                    New message from admin

                  </p>

                  <p className="text-xs text-slate-500 mt-1">

                    Please review your property details.

                  </p>

                  <p className="text-[10px] text-slate-400 mt-2">

                    1 day ago

                  </p>

                </div>

              </div>

            </div>

          </CardContent>

        </Card>

      </div>

    </HostDashboardLayout>

  );

};


export default HostDashboardPage;