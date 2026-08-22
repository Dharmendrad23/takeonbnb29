import React, { useState, useEffect, useCallback } from "react";

import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameDay,
  isWithinInterval,
  startOfDay,
  subDays,
} from "date-fns";

import {
  ChevronLeft,
  ChevronRight,
  Ban,
  Calendar as CalendarIcon,
  Unlock,
  IndianRupee,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@/contexts/AuthContext.jsx";
import { toast } from "sonner";
import pb from "@/lib/pocketbaseClient";


const HostBookingCalendar = () => {
  const { currentUser } = useAuth();

  const [currentDate, setCurrentDate] = useState(new Date());

  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");

  const [bookings, setBookings] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);

  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingCalendar, setLoadingCalendar] = useState(false);

  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);

  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);


  // =========================
  // HOST ID
  // =========================

  const getHostId = useCallback(() => {
    return (
      currentUser?.id ||
      currentUser?._id ||
      currentUser?.userId ||
      ""
    );
  }, [currentUser]);


  // =========================
  // FETCH HOST PROPERTIES
  // =========================

  const fetchProperties = useCallback(async () => {
    const hostId = getHostId();

    if (!hostId) {
      console.warn("Host ID not found");

      setProperties([]);
      setSelectedPropertyId("");
      setLoadingProperties(false);

      return;
    }

    setLoadingProperties(true);

    try {
      let records = [];

      try {
        records = await pb
          .collection("properties")
          .getFullList({
            filter: `hostId="${hostId}"`,
            sort: "-created",
            $autoCancel: false,
          });

      } catch (firstError) {

        console.warn(
          "hostId filter failed, trying host field"
        );

        try {
          records = await pb
            .collection("properties")
            .getFullList({
              filter: `host="${hostId}"`,
              sort: "-created",
              $autoCancel: false,
            });

        } catch (secondError) {

          console.error(
            "Failed to load host properties:",
            secondError
          );

          records = [];
        }
      }

      setProperties(records);

      if (records.length > 0) {

        setSelectedPropertyId((previousId) => {
          const propertyExists = records.some(
            (property) => property.id === previousId
          );

          if (previousId && propertyExists) {
            return previousId;
          }

          return records[0].id;
        });

      } else {

        setSelectedPropertyId("");
      }

    } catch (error) {

      console.error(
        "PROPERTY LOAD ERROR:",
        error
      );

      setProperties([]);
      setSelectedPropertyId("");

      toast.error(
        error?.message ||
        "Failed to load properties"
      );

    } finally {

      setLoadingProperties(false);
    }

  }, [getHostId]);


  // =========================
  // FETCH BOOKINGS + BLOCKED
  // =========================

  const fetchCalendarData = useCallback(async () => {

    if (!selectedPropertyId) {

      setBookings([]);
      setBlockedDates([]);

      return;
    }

    setLoadingCalendar(true);

    try {

      let bookingRecords = [];
      let blockedRecords = [];


      // BOOKINGS

      try {

        bookingRecords = await pb
          .collection("bookings")
          .getFullList({
            filter: `propertyId="${selectedPropertyId}"`,
            sort: "checkInDate",
            $autoCancel: false,
          });

      } catch (firstError) {

        console.warn(
          "propertyId booking filter failed"
        );

        try {

          bookingRecords = await pb
            .collection("bookings")
            .getFullList({
              filter: `property="${selectedPropertyId}"`,
              $autoCancel: false,
            });

        } catch (secondError) {

          console.warn(
            "Could not load bookings:",
            secondError
          );

          bookingRecords = [];
        }
      }


      // REMOVE CANCELLED BOOKINGS

      bookingRecords = bookingRecords.filter(
        (booking) => {

          const status = String(
            booking.status || ""
          ).toLowerCase();

          return ![
            "cancelled",
            "canceled",
            "rejected",
            "failed",
          ].includes(status);
        }
      );


      // BLOCKED DATES

      try {

        blockedRecords = await pb
          .collection("unavailable_dates")
          .getFullList({
            filter: `propertyId="${selectedPropertyId}"`,
            $autoCancel: false,
          });

      } catch (firstError) {

        console.warn(
          "propertyId unavailable_dates filter failed"
        );

        try {

          blockedRecords = await pb
            .collection("unavailable_dates")
            .getFullList({
              filter: `property="${selectedPropertyId}"`,
              $autoCancel: false,
            });

        } catch (secondError) {

          console.warn(
            "Blocked dates unavailable:",
            secondError
          );

          blockedRecords = [];
        }
      }


      setBookings(bookingRecords);
      setBlockedDates(blockedRecords);

    } catch (error) {

      console.error(
        "CALENDAR LOAD ERROR:",
        error
      );

      toast.error(
        error?.message ||
        "Failed to load calendar"
      );

    } finally {

      setLoadingCalendar(false);
    }

  }, [selectedPropertyId]);


  // =========================
  // LOAD PROPERTIES
  // =========================

  useEffect(() => {

    fetchProperties();

  }, [fetchProperties]);


  // =========================
  // LOAD CALENDAR
  // =========================

  useEffect(() => {

    fetchCalendarData();

  }, [fetchCalendarData]);


  // =========================
  // UPDATE PRICE WHEN
  // PROPERTY CHANGES
  // =========================

  useEffect(() => {

    if (!selectedPropertyId) {
      setPrice("");
      return;
    }

    const property = properties.find(
      (item) => item.id === selectedPropertyId
    );

    if (property) {

      setPrice(
        property.price ??
        property.pricePerNight ??
        property.nightlyPrice ??
        ""
      );
    }

  }, [
    selectedPropertyId,
    properties,
  ]);


  // =========================
  // DATE HELPERS
  // =========================

  const getBookingStart = (booking) => {

    return (
      booking.checkInDate ||
      booking.checkIn ||
      booking.check_in ||
      booking.startDate ||
      booking.start_date ||
      null
    );
  };


  const getBookingEnd = (booking) => {

    return (
      booking.checkOutDate ||
      booking.checkOut ||
      booking.check_out ||
      booking.endDate ||
      booking.end_date ||
      null
    );
  };


  const getBlockStart = (block) => {

    return (
      block.startDate ||
      block.start_date ||
      block.date ||
      block.fromDate ||
      null
    );
  };


  const getBlockEnd = (block) => {

    return (
      block.endDate ||
      block.end_date ||
      block.toDate ||
      block.date ||
      getBlockStart(block)
    );
  };


  const getSafeDate = (value) => {

    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return startOfDay(date);
  };


  // =========================
  // DAY STATUS
  // =========================

  const getDayStatus = (day) => {

    const currentDay = startOfDay(day);


    // BOOKED

    const booked = bookings.some(
      (booking) => {

        const startValue =
          getBookingStart(booking);

        const endValue =
          getBookingEnd(booking);

        const start =
          getSafeDate(startValue);

        const checkoutDate =
          getSafeDate(endValue);

        if (!start || !checkoutDate) {
          return false;
        }

        // Checkout day is available
        const end = subDays(
          checkoutDate,
          1
        );

        if (end < start) {
          return isSameDay(
            currentDay,
            start
          );
        }

        return isWithinInterval(
          currentDay,
          {
            start,
            end,
          }
        );
      }
    );

    if (booked) {
      return "booked";
    }


    // BLOCKED

    const blocked = blockedDates.some(
      (block) => {

        const start =
          getSafeDate(
            getBlockStart(block)
          );

        const end =
          getSafeDate(
            getBlockEnd(block)
          );

        if (!start) {
          return false;
        }

        return isWithinInterval(
          currentDay,
          {
            start,
            end: end || start,
          }
        );
      }
    );

    if (blocked) {
      return "blocked";
    }


    // SELECTED

    if (
      selectionStart &&
      !selectionEnd &&
      isSameDay(
        currentDay,
        selectionStart
      )
    ) {

      return "selected";
    }


    if (
      selectionStart &&
      selectionEnd
    ) {

      return isWithinInterval(
        currentDay,
        {
          start: selectionStart,
          end: selectionEnd,
        }
      );
    }

    return "available";
  };


  // =========================
  // DAY CLICK
  // =========================

  const handleDayClick = (day) => {

    const dayStart =
      startOfDay(day);

    const status =
      getDayStatus(day);


    if (status === "booked") {

      toast.error(
        "This date is already booked"
      );

      return;
    }


    if (status === "blocked") {

      toast.error(
        "This date is blocked. Select the range and use Unblock."
      );

      return;
    }


    if (
      !selectionStart ||
      selectionEnd
    ) {

      setSelectionStart(dayStart);
      setSelectionEnd(null);

      return;
    }


    if (
      dayStart < selectionStart
    ) {

      setSelectionEnd(
        selectionStart
      );

      setSelectionStart(
        dayStart
      );

    } else {

      setSelectionEnd(
        dayStart
      );
    }
  };


  // =========================
  // CHECK RANGE AVAILABILITY
  // =========================

  const rangeContainsBookedDate = () => {

    if (
      !selectionStart ||
      !selectionEnd
    ) {
      return false;
    }

    const days =
      eachDayOfInterval({
        start: selectionStart,
        end: selectionEnd,
      });

    return days.some(
      (day) =>
        getDayStatus(day) === "booked"
    );
  };


  // =========================
  // BLOCK DATES
  // =========================

  const handleBlockDates = async () => {

    if (!selectedPropertyId) {

      toast.error(
        "Please select a property"
      );

      return;
    }


    if (
      !selectionStart ||
      !selectionEnd
    ) {

      toast.error(
        "Please select a date range"
      );

      return;
    }


    if (rangeContainsBookedDate()) {

      toast.error(
        "Cannot block dates that include an existing booking"
      );

      return;
    }


    setSaving(true);

    try {

      await pb
        .collection("unavailable_dates")
        .create(
          {
            propertyId:
              selectedPropertyId,

            startDate:
              format(
                selectionStart,
                "yyyy-MM-dd"
              ),

            endDate:
              format(
                selectionEnd,
                "yyyy-MM-dd"
              ),

            reason:
              "Host Blocked",
          },
          {
            $autoCancel: false,
          }
        );


      toast.success(
        "Dates blocked successfully"
      );

      setSelectionStart(null);
      setSelectionEnd(null);

      await fetchCalendarData();

    } catch (error) {

      console.error(
        "BLOCK DATE ERROR:",
        error
      );

      toast.error(
        error?.message ||
        "Failed to block dates"
      );

    } finally {

      setSaving(false);
    }
  };


  // =========================
  // UNBLOCK DATES
  // =========================

  const handleUnblockDates = async () => {

    if (
      !selectionStart ||
      !selectionEnd
    ) {

      toast.error(
        "Select a blocked date range first"
      );

      return;
    }


    setSaving(true);

    try {

      const matchingBlocks =
        blockedDates.filter(
          (block) => {

            const start =
              getSafeDate(
                getBlockStart(block)
              );

            const end =
              getSafeDate(
                getBlockEnd(block)
              ) || start;

            if (!start) {
              return false;
            }

            return (
              isWithinInterval(
                selectionStart,
                {
                  start,
                  end,
                }
              ) ||
              isWithinInterval(
                selectionEnd,
                {
                  start,
                  end,
                }
              ) ||
              (
                selectionStart <= start &&
                selectionEnd >= end
              )
            );
          }
        );


      if (
        matchingBlocks.length === 0
      ) {

        toast.error(
          "No blocked dates found in this range"
        );

        return;
      }


      await Promise.all(

        matchingBlocks.map(
          (block) =>
            pb
              .collection(
                "unavailable_dates"
              )
              .delete(
                block.id,
                {
                  $autoCancel: false,
                }
              )
        )
      );


      toast.success(
        "Dates unblocked successfully"
      );

      setSelectionStart(null);
      setSelectionEnd(null);

      await fetchCalendarData();

    } catch (error) {

      console.error(
        "UNBLOCK ERROR:",
        error
      );

      toast.error(
        error?.message ||
        "Failed to unblock dates"
      );

    } finally {

      setSaving(false);
    }
  };


  // =========================
  // UPDATE PRICE
  // =========================

  const handlePriceUpdate = async () => {

    if (!selectedPropertyId) {

      toast.error(
        "Please select a property"
      );

      return;
    }


    if (
      !price ||
      Number(price) <= 0
    ) {

      toast.error(
        "Enter a valid price"
      );

      return;
    }


    setSaving(true);

    try {

      await pb
        .collection("properties")
        .update(
          selectedPropertyId,
          {
            price:
              Number(price),
          },
          {
            $autoCancel: false,
          }
        );


      toast.success(
        "Property price updated successfully"
      );

      await fetchProperties();

    } catch (error) {

      console.error(
        "PRICE UPDATE ERROR:",
        error
      );

      toast.error(
        error?.message ||
        "Failed to update price"
      );

    } finally {

      setSaving(false);
    }
  };


  // =========================
  // RENDER CALENDAR
  // =========================

  const renderCalendar = () => {

    const monthStart =
      startOfMonth(currentDate);

    const monthEnd =
      endOfMonth(currentDate);

    const days =
      eachDayOfInterval({
        start: monthStart,
        end: monthEnd,
      });

    const blanks =
      Array.from({
        length:
          monthStart.getDay(),
      });


    return (

      <div className="grid grid-cols-7 gap-1 sm:gap-2">

        {[
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
        ].map((day) => (

          <div
            key={day}
            className="text-center text-xs sm:text-sm font-bold text-muted-foreground py-2"
          >
            {day}
          </div>

        ))}


        {blanks.map(
          (_, index) => (

            <div
              key={`blank-${index}`}
              className="min-h-[55px] sm:min-h-[75px]"
            />

          )
        )}


        {days.map((day) => {

          const status =
            getDayStatus(day);


          let classes =
            "bg-background border-border hover:bg-muted cursor-pointer";


          if (
            status === "booked"
          ) {

            classes =
              "bg-primary/20 border-primary text-primary font-bold cursor-not-allowed";
          }


          if (
            status === "blocked"
          ) {

            classes =
              "bg-destructive/10 border-destructive/30 text-destructive font-bold";
          }


          if (
            status === "selected"
          ) {

            classes =
              "bg-secondary border-secondary text-secondary-foreground font-bold ring-2 ring-primary/30";
          }


          return (

            <button
              type="button"
              key={day.toISOString()}
              onClick={() =>
                handleDayClick(day)
              }
              disabled={
                status === "booked"
              }
              className={`min-h-[55px] sm:min-h-[75px] md:min-h-[90px] rounded-xl border transition-all flex items-center justify-center ${classes}`}
            >

              {format(
                day,
                "d"
              )}

            </button>

          );

        })}

      </div>
    );
  };


  const selectedProperty =
    properties.find(
      (property) =>
        property.id ===
        selectedPropertyId
    );


  return (

    <div className="w-full max-w-7xl mx-auto space-y-6">

      {/* HEADER */}

      <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>

            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">

              <CalendarIcon className="w-7 h-7 text-primary" />

              Booking Calendar

            </h1>

            <p className="text-muted-foreground mt-2">

              Manage bookings, blocked dates and property pricing.

            </p>

          </div>


          <div className="flex flex-col sm:flex-row gap-3">

            <Select
              value={selectedPropertyId}
              onValueChange={(value) => {

                setSelectedPropertyId(value);

                setSelectionStart(null);
                setSelectionEnd(null);

              }}
            >

              <SelectTrigger className="w-full sm:w-[280px]">

                <SelectValue placeholder="Select property" />

              </SelectTrigger>


              <SelectContent>

                {properties.map(
                  (property) => (

                    <SelectItem
                      key={property.id}
                      value={property.id}
                    >

                      {property.title ||
                        property.name ||
                        "Untitled Property"}

                    </SelectItem>

                  )
                )}

              </SelectContent>

            </Select>


            <Button
              type="button"
              variant="outline"
              onClick={fetchCalendarData}
              disabled={loadingCalendar}
              className="rounded-xl"
            >

              <RefreshCw
                className={`w-4 h-4 mr-2 ${
                  loadingCalendar
                    ? "animate-spin"
                    : ""
                }`}
              />

              Refresh

            </Button>

          </div>

        </div>

      </div>


      {/* NO PROPERTY */}

      {!selectedPropertyId &&
      !loadingProperties ? (

        <div className="bg-card border border-border rounded-3xl p-10 text-center">

          <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />

          <h2 className="text-xl font-bold">

            No Property Found

          </h2>

          <p className="text-muted-foreground mt-2">

            Add a property first to manage its calendar.

          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


          {/* CALENDAR */}

          <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-4 sm:p-6 shadow-sm">

            <div className="flex items-center justify-between mb-6">

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-xl"
                onClick={() =>
                  setCurrentDate(
                    subMonths(
                      currentDate,
                      1
                    )
                  )
                }
              >

                <ChevronLeft className="w-5 h-5" />

              </Button>


              <h2 className="font-bold text-lg sm:text-xl">

                {format(
                  currentDate,
                  "MMMM yyyy"
                )}

              </h2>


              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-xl"
                onClick={() =>
                  setCurrentDate(
                    addMonths(
                      currentDate,
                      1
                    )
                  )
                }
              >

                <ChevronRight className="w-5 h-5" />

              </Button>

            </div>


            {loadingCalendar ? (

              <div className="h-[450px] flex items-center justify-center">

                <div className="flex flex-col items-center gap-3 text-muted-foreground">

                  <RefreshCw className="w-8 h-8 animate-spin" />

                  Loading calendar...

                </div>

              </div>

            ) : (

              renderCalendar()

            )}


            <div className="flex flex-wrap gap-4 mt-6 pt-5 border-t border-border text-sm">

              <div className="flex items-center gap-2">

                <div className="w-4 h-4 rounded border bg-background" />

                Available

              </div>


              <div className="flex items-center gap-2">

                <div className="w-4 h-4 rounded bg-primary/20 border border-primary" />

                Booked

              </div>


              <div className="flex items-center gap-2">

                <div className="w-4 h-4 rounded bg-destructive/10 border border-destructive/30" />

                Blocked

              </div>

            </div>

          </div>


          {/* RIGHT PANEL */}

          <div className="space-y-6">


            {/* MANAGE DATES */}

            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">

              <h3 className="font-bold text-lg">

                Manage Dates

              </h3>

              <p className="text-sm text-muted-foreground mt-2">

                Select a start and end date from the calendar.

              </p>


              <div className="mt-5 space-y-2 text-sm">

                <div className="p-3 rounded-xl bg-muted">

                  Start:{" "}

                  <strong>

                    {selectionStart
                      ? format(
                          selectionStart,
                          "dd MMM yyyy"
                        )
                      : "Not selected"}

                  </strong>

                </div>


                <div className="p-3 rounded-xl bg-muted">

                  End:{" "}

                  <strong>

                    {selectionEnd
                      ? format(
                          selectionEnd,
                          "dd MMM yyyy"
                        )
                      : "Not selected"}

                  </strong>

                </div>

              </div>


              <div className="grid grid-cols-1 gap-3 mt-5">

                <Button
                  type="button"
                  onClick={handleBlockDates}
                  disabled={
                    saving ||
                    !selectionStart ||
                    !selectionEnd
                  }
                  className="rounded-xl"
                >

                  <Ban className="w-4 h-4 mr-2" />

                  {saving
                    ? "Saving..."
                    : "Block Selected Dates"}

                </Button>


                <Button
                  type="button"
                  variant="outline"
                  onClick={handleUnblockDates}
                  disabled={
                    saving ||
                    !selectionStart ||
                    !selectionEnd
                  }
                  className="rounded-xl"
                >

                  <Unlock className="w-4 h-4 mr-2" />

                  Unblock Selected Dates

                </Button>


                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {

                    setSelectionStart(null);
                    setSelectionEnd(null);

                  }}
                  className="rounded-xl"
                >

                  Clear Selection

                </Button>

              </div>

            </div>


            {/* PRICE */}

            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">

              <h3 className="font-bold text-lg flex items-center gap-2">

                <IndianRupee className="w-5 h-5 text-primary" />

                Property Price

              </h3>


              <p className="text-sm text-muted-foreground mt-2">

                {selectedProperty?.title ||
                  selectedProperty?.name ||
                  "Selected property"}

              </p>


              <div className="mt-5">

                <input
                  type="number"
                  min="1"
                  value={price}
                  onChange={(event) =>
                    setPrice(
                      event.target.value
                    )
                  }
                  placeholder="Price per night"
                  className="w-full h-11 rounded-xl border border-border bg-background px-4 outline-none focus:ring-2 focus:ring-primary/30"
                />

              </div>


              <Button
                type="button"
                onClick={handlePriceUpdate}
                disabled={saving}
                className="w-full mt-3 rounded-xl"
              >

                <IndianRupee className="w-4 h-4 mr-2" />

                Update Price

              </Button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default HostBookingCalendar;
