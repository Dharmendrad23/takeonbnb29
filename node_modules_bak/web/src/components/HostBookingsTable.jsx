import React, { useMemo, useState } from "react";
import { format, differenceInCalendarDays } from "date-fns";
import {
  Search,
  Eye,
  Calendar,
  User
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const HostBookingsTable = ({
  bookings = [],
  isLoading,
  onViewBooking,
}) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const guest =
        booking.expand?.guestId?.name ||
        booking.guestFullName ||
        "";

      const property =
        booking.expand?.propertyId?.title ||
        booking.propertyName ||
        "";

      const matchesSearch =
        guest.toLowerCase().includes(search.toLowerCase()) ||
        property.toLowerCase().includes(search.toLowerCase());

      const status =
        booking.status ||
        booking.bookingStatus ||
        "";

      const matchesStatus =
        statusFilter === "all"
          ? true
          : status.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return (
          <Badge className="bg-green-500">
            Confirmed
          </Badge>
        );

      case "pending":
        return (
          <Badge
            variant="outline"
            className="border-yellow-400 text-yellow-700"
          >
            Pending
          </Badge>
        );

      case "checked-in":
        return (
          <Badge className="bg-blue-500">
            Checked In
          </Badge>
        );

      case "completed":
        return (
          <Badge variant="secondary">
            Completed
          </Badge>
        );

      case "cancelled":
        return (
          <Badge variant="destructive">
            Cancelled
          </Badge>
        );

      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border p-10 text-center">
        Loading Bookings...
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Header */}

      <div className="flex flex-col md:flex-row gap-3 justify-between">

        <Input
          placeholder="Search Guest or Property..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <select
          className="border rounded-lg h-10 px-3"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="checked-in">Checked In</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

      </div>

      <div className="rounded-xl border overflow-hidden">

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead>ID</TableHead>

              <TableHead>Guest</TableHead>

              <TableHead>Property</TableHead>

              <TableHead>Stay</TableHead>

              <TableHead>Status</TableHead>

              <TableHead>Amount</TableHead>

              <TableHead></TableHead>

            </TableRow>

          </TableHeader>

          <TableBody>

            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12"
                >
                  No Bookings Found
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => {
                const guest =
                  booking.expand?.guestId?.name ||
                  booking.guestFullName ||
                  "Guest";

                const property =
                  booking.expand?.propertyId?.title ||
                  booking.propertyName ||
                  "Property";

                const checkIn = new Date(
                  booking.checkInDate
                );

                const checkOut = new Date(
                  booking.checkOutDate
                );

                const nights =
                  differenceInCalendarDays(
                    checkOut,
                    checkIn
                  );

                const amount =
                  booking.totalPrice ||
                  booking.totalAmount ||
                  0;

                return (
                  <TableRow key={booking.id}>

                    <TableCell>
                      #{booking.id.slice(-6)}
                    </TableCell>

                    <TableCell>

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <User size={18} />
                        </div>

                        <div>

                          <p className="font-medium">
                            {guest}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            Guest
                          </p>

                        </div>

                      </div>

                    </TableCell>

                    <TableCell>

                      <div className="font-medium">
                        {property}
                      </div>

                    </TableCell>

                    <TableCell>

                      <div className="flex flex-col">

                        <span>
                          {format(
                            checkIn,
                            "dd MMM"
                          )}{" "}
                          -{" "}
                          {format(
                            checkOut,
                            "dd MMM yyyy"
                          )}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {nights} Nights
                        </span>

                      </div>

                    </TableCell>

                    <TableCell>
                      {getStatusBadge(
                        booking.status ||
                          booking.bookingStatus
                      )}
                    </TableCell>

                    <TableCell className="font-semibold">
                      ₹
                      {amount.toLocaleString(
                        "en-IN"
                      )}
                    </TableCell>

                    <TableCell>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          onViewBooking?.(booking)
                        }
                      >
                        <Eye size={18} />
                      </Button>

                    </TableCell>

                  </TableRow>
                );
              })
            )}

          </TableBody>

        </Table>

      </div>
    </div>
  );
};

export default HostBookingsTable;