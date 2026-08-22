import React, { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { CalendarDays, Eye, Loader2, Search, XCircle } from "lucide-react";
import { toast } from "sonner";

import pb from "@/lib/pocketbaseClient";
import { useAuth } from "@/contexts/AuthContext.jsx";
import HostDashboardLayout from "@/components/HostDashboardLayout.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const HostBookingsPage = () => {
  const { currentUser } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadBookings = useCallback(async () => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const hostProperties = await pb
        .collection("properties")
        .getFullList({
          filter: `hostId="${currentUser.id}"`,
          $autoCancel: false,
        });

      const propertyMap = {};
      hostProperties.forEach((property) => {
        propertyMap[property.id] = property;
      });

      setProperties(propertyMap);

      if (hostProperties.length === 0) {
        setBookings([]);
        return;
      }

      const propertyIds = hostProperties
        .map((property) => property.id);

      const filter = propertyIds
        .map((id) => `propertyId="${id}"`)
        .join(" || ");

      const records = await pb
        .collection("bookings")
        .getFullList({
          filter,
          sort: "-created",
          $autoCancel: false,
        });

      setBookings(records);
    } catch (error) {
      console.error(error);

      if (error?.status !== 404) {
        toast.error("Failed to load bookings");
      }

      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    loadBookings();

    let unsubscribe;

    try {
      unsubscribe = pb
        .collection("bookings")
        .subscribe("*", () => {
          loadBookings();
        });
    } catch (error) {
      console.warn("Realtime booking subscription unavailable", error);
    }

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }

      try {
        pb.collection("bookings").unsubscribe("*");
      } catch {
        // ignore cleanup errors
      }
    };
  }, [loadBookings]);

  const updateBookingStatus = async (booking, status) => {
    try {
      await pb.collection("bookings").update(
        booking.id,
        { status },
        { $autoCancel: false }
      );

      toast.success(`Booking ${status}`);
      loadBookings();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update booking");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const property = properties[booking.propertyId];

    const query = search.toLowerCase();

    return (
      !query ||
      String(
        property?.title ||
        booking.propertyName ||
        ""
      )
        .toLowerCase()
        .includes(query) ||
      String(
        booking.guestName ||
        booking.guest?.name ||
        ""
      )
        .toLowerCase()
        .includes(query)
    );
  });

  const getStatusClass = (status) => {
    const value = String(status || "pending").toLowerCase();

    if (
      value === "confirmed" ||
      value === "completed"
    ) {
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }

    if (
      value === "cancelled" ||
      value === "declined"
    ) {
      return "bg-red-100 text-red-700 border-red-200";
    }

    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  return (
    <HostDashboardLayout>
      <Helmet>
        <title>Bookings | Take On BnB</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Property Bookings
            </h1>

            <p className="text-muted-foreground mt-1">
              Manage all reservations for your properties.
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            {filteredBookings.length} booking
            {filteredBookings.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search guest or property..."
            className="pl-10"
          />
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {loading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-20 text-center px-6">
              <CalendarDays className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />

              <h3 className="text-lg font-semibold">
                No bookings found
              </h3>

              <p className="text-muted-foreground mt-2">
                Guest reservations will automatically appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredBookings.map((booking) => {
                const property =
                  properties[booking.propertyId];

                const status =
                  booking.status || "pending";

                return (
                  <div
                    key={booking.id}
                    className="p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-5"
                  >
                    <div className="min-w-0">
                      <h3 className="font-bold text-lg">
                        {property?.title ||
                          booking.propertyName ||
                          "Property Booking"}
                      </h3>

                      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1 mt-2 text-sm text-muted-foreground">
                        <p>
                          Guest:{" "}
                          <span className="text-foreground font-medium">
                            {booking.guestName ||
                              booking.guest?.name ||
                              "Guest"}
                          </span>
                        </p>

                        <p>
                          Check-in:{" "}
                          {booking.checkInDate || "-"}
                        </p>

                        <p>
                          Check-out:{" "}
                          {booking.checkOutDate || "-"}
                        </p>

                        <p>
                          Amount: ₹
                          {Number(
                            booking.totalAmount ||
                            booking.totalPrice ||
                            0
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Badge
                        variant="outline"
                        className={getStatusClass(status)}
                      >
                        {String(status).replace(/_/g, " ")}
                      </Badge>

                      {String(status).toLowerCase() ===
                        "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() =>
                              updateBookingStatus(
                                booking,
                                "confirmed"
                              )
                            }
                          >
                            Confirm
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateBookingStatus(
                                booking,
                                "declined"
                              )
                            }
                          >
                            Decline
                          </Button>
                        </>
                      )}

                      <Link
                        to={`/booking/${booking.id}`}
                      >
                        <Button
                          size="icon"
                          variant="outline"
                          title="View booking"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>

                      {String(status).toLowerCase() !==
                        "cancelled" && (
                        <Button
                          size="icon"
                          variant="outline"
                          title="Cancel booking"
                          onClick={() =>
                            updateBookingStatus(
                              booking,
                              "cancelled"
                            )
                          }
                        >
                          <XCircle className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </HostDashboardLayout>
  );
};

export default HostBookingsPage;
