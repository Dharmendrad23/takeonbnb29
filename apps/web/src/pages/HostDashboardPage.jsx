import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext.jsx";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Home,
  IndianRupee,
  Calendar,
  PlusCircle,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import HostDashboardLayout from "@/components/HostDashboardLayout.jsx";

const HostDashboardPage = () => {
  const { currentUser } = useAuth();

  const [stats, setStats] = useState({
    properties: 0,
    liveProperties: 0,
    bookings: 0,
    revenue: 0,
  });

  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!currentUser?.id) return;

    try {
      setLoading(true);

      const response = await api.get("/dashboard", {
        params: {
          hostId: currentUser.id,
        },
      });

      const data = response.data;

      const hostProperties = Array.isArray(data?.properties)
        ? data.properties
        : [];

      const hostBookings = Array.isArray(data?.bookings)
        ? data.bookings
        : [];

      const liveProperties = hostProperties.filter(
        (property) =>
          String(property.status || "").toLowerCase() === "approved" ||
          String(property.status || "").toLowerCase() === "live"
      );

      const revenue = hostBookings
        .filter(
          (booking) =>
            booking.paymentStatus === "paid" ||
            booking.status === "confirmed"
        )
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

      setProperties(hostProperties);
      setBookings(hostBookings);

      setStats({
        properties: hostProperties.length,
        liveProperties: liveProperties.length,
        bookings: hostBookings.length,
        revenue,
      });
    } catch (error) {
      console.error("Dashboard API Error:", error);
      setProperties([]);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, [currentUser?.id]);

  const getPropertyBookings = (propertyId) => {
    return bookings.filter((booking) => {
      const bookingPropertyId =
        booking?.propertyId?._id ||
        booking?.propertyId?.id ||
        booking?.propertyId;

      return String(bookingPropertyId) === String(propertyId);
    }).length;
  };

  const getStatusStyle = (status) => {
    const normalized = String(status || "pending").toLowerCase();

    if (
      normalized === "approved" ||
      normalized === "live"
    ) {
      return "bg-emerald-100 text-emerald-700";
    }

    if (normalized === "pending") {
      return "bg-amber-100 text-amber-700";
    }

    if (normalized === "rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <HostDashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </HostDashboardLayout>
    );
  }

  return (
    <HostDashboardLayout>
      <Helmet>
        <title>Host Dashboard | Take On BnB</title>
      </Helmet>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {currentUser?.name || "Host"}
          </h1>

          <p className="text-muted-foreground mt-2">
            Manage your properties, bookings and earnings in real time.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button asChild>
            <Link to="/host/property/new">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add New Property
            </Link>
          </Button>

          <Button variant="outline" onClick={fetchDashboardData}>
            Refresh
          </Button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Properties
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {stats.properties}
                </h2>
              </div>

              <Home className="w-10 h-10 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Live Properties
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {stats.liveProperties}
                </h2>
              </div>

              <Eye className="w-10 h-10 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Bookings
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {stats.bookings}
                </h2>
              </div>

              <Calendar className="w-10 h-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Revenue
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  ₹{stats.revenue.toLocaleString("en-IN")}
                </h2>
              </div>

              <IndianRupee className="w-10 h-10 text-primary" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* PROPERTIES */}
      <Card>
        <CardContent className="p-0">

          <div className="p-6 border-b flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Your Properties
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                Live data from your Take On BnB account
              </p>
            </div>

            <Button variant="outline" asChild>
              <Link to="/host/properties">
                View All
              </Link>
            </Button>
          </div>

          {properties.length === 0 ? (
            <div className="py-16 text-center px-6">

              <Home className="w-14 h-14 mx-auto text-muted-foreground mb-4" />

              <h3 className="text-xl font-bold">
                No properties listed yet
              </h3>

              <p className="text-muted-foreground mt-2 mb-6">
                Start hosting by adding your first property.
              </p>

              <Button asChild>
                <Link to="/host/property/new">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Your First Property
                </Link>
              </Button>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-4">
                      Property
                    </th>

                    <th className="text-left px-6 py-4">
                      Status
                    </th>

                    <th className="text-left px-6 py-4">
                      Price/Night
                    </th>

                    <th className="text-left px-6 py-4">
                      Bookings
                    </th>

                    <th className="text-right px-6 py-4">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {properties.slice(0, 10).map((property) => {

                    const propertyId =
                      property._id || property.id;

                    const bookingCount =
                      getPropertyBookings(propertyId);

                    return (
                      <tr
                        key={propertyId}
                        className="border-t hover:bg-muted/30"
                      >

                        <td className="px-6 py-4">
                          <div className="font-semibold">
                            {property.title ||
                              "Untitled Property"}
                          </div>

                          <div className="text-xs text-muted-foreground mt-1">
                            {property.location ||
                              property.city ||
                              ""}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
                              property.status
                            )}`}
                          >
                            {property.status || "pending"}
                          </span>
                        </td>

                        <td className="px-6 py-4 font-semibold">
                          ₹
                          {Number(
                            property.pricePerNight || 0
                          ).toLocaleString("en-IN")}
                        </td>

                        <td className="px-6 py-4">
                          {bookingCount}
                        </td>

                        <td className="px-6 py-4 text-right">

                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <Link
                              to={`/property/${propertyId}`}
                            >
                              View
                            </Link>
                          </Button>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </CardContent>
      </Card>

    </HostDashboardLayout>
  );
};

export default HostDashboardPage;