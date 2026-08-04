import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isWithinInterval, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Ban, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';
import { createUnavailableDate, listBookings, listProperties, listUnavailableDates } from '@/lib/dataApi.js';
import { getEntityId } from '@/lib/propertyMappers.js';

const HostBookingCalendar = () => {
  const { currentUser } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  
  const [bookings, setBookings] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [isBlocking, setIsBlocking] = useState(false);

  // Fetch properties
  useEffect(() => {
    const fetchProps = async () => {
      try {
        const hostId = currentUser?.id || currentUser?._id || '';
        const records = (await listProperties()).filter((property) => String(property.hostId || '') === hostId);
        setProperties(records);
        if (records.length > 0) setSelectedPropertyId(getEntityId(records[0]));
      } catch (e) {
        console.error("Props fetch error", e);
      }
    };
    fetchProps();
  }, [currentUser]);

  // Fetch calendar data
  const fetchCalendarData = async () => {
    if (!selectedPropertyId) return;
    setIsLoading(true);
    try {
      const [bookRes, blockRes] = await Promise.all([
        listBookings({ propertyId: selectedPropertyId }),
        listUnavailableDates({ propertyId: selectedPropertyId }),
      ]);
      setBookings(bookRes.filter((booking) => ['confirmed', 'checked-in', 'pending'].includes(String(booking.status || '').toLowerCase())));
      setBlockedDates(blockRes);
    } catch (e) {
      console.error("Calendar data error", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
    const intervalId = window.setInterval(fetchCalendarData, 15000);
    return () => window.clearInterval(intervalId);
  }, [selectedPropertyId]);

  const handleDayClick = (day) => {
    const dayStart = startOfDay(day);
    if (!selectionStart || (selectionStart && selectionEnd)) {
      setSelectionStart(dayStart);
      setSelectionEnd(null);
    } else {
      if (dayStart < selectionStart) {
        setSelectionEnd(selectionStart);
        setSelectionStart(dayStart);
      } else {
        setSelectionEnd(dayStart);
      }
    }
  };

  const handleBlockDates = async () => {
    if (!selectionStart || !selectionEnd) return;
    setIsBlocking(true);
    try {
      await createUnavailableDate({
        propertyId: selectedPropertyId,
        startDate: format(selectionStart, "yyyy-MM-dd"),
        endDate: format(selectionEnd, "yyyy-MM-dd"),
        reason: 'Host Blocked'
      });
      
      toast.success("Dates blocked successfully");
      setSelectionStart(null);
      setSelectionEnd(null);
      fetchCalendarData();
    } catch (e) {
      toast.error("Failed to block dates");
      console.error(e);
    } finally {
      setIsBlocking(false);
    }
  };

  const getDayStatus = (day) => {
    const dayStart = startOfDay(day);
    
    // Check Bookings
    const isBooked = bookings.some(b => {
      const start = startOfDay(new Date(b.checkInDate));
      const end = startOfDay(new Date(b.checkOutDate));
      return isWithinInterval(dayStart, { start, end });
    });
    if (isBooked) return 'booked';

    // Check Blocked
    const isBlocked = blockedDates.some(b => {
      const start = startOfDay(new Date(b.startDate));
      const end = startOfDay(new Date(b.endDate));
      return isWithinInterval(dayStart, { start, end });
    });
    if (isBlocked) return 'blocked';

    // Check Selection
    if (selectionStart && !selectionEnd && isSameDay(dayStart, selectionStart)) return 'selected';
    if (selectionStart && selectionEnd && isWithinInterval(dayStart, { start: selectionStart, end: selectionEnd })) return 'selected';

    return 'available';
  };

  const renderCalendar = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });

    // Pad beginning of month
    const startDayOfWeek = start.getDay();
    const blanks = Array.from({ length: startDayOfWeek }, (_, i) => <div key={`blank-${i}`} className="h-16 border border-transparent"></div>);

    return (
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center font-bold text-sm text-muted-foreground py-2">{d}</div>
        ))}
        {blanks}
        {days.map(day => {
          const status = getDayStatus(day);
          let bgClass = "bg-card border-border hover:bg-muted text-foreground";
          
          if (status === 'booked') bgClass = "bg-primary/20 border-primary/30 text-primary font-bold shadow-inner cursor-not-allowed";
          else if (status === 'blocked') bgClass = "bg-muted border-border text-muted-foreground cursor-not-allowed opacity-60 line-through";
          else if (status === 'selected') bgClass = "bg-secondary text-secondary-foreground border-secondary shadow-md font-bold scale-105 z-10";
          
          return (
            <div 
              key={day.toISOString()} 
              onClick={() => status !== 'booked' && status !== 'blocked' ? handleDayClick(day) : null}
              className={`calendar-cell h-16 sm:h-20 md:h-24 border rounded-xl flex items-center justify-center text-sm md:text-base ${bgClass}`}
            >
              {format(day, 'd')}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-primary" /> Booking Calendar
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Manage availability and view bookings</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {properties.length > 0 && (
            <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
              <SelectTrigger className="w-[200px] bg-background border-border">
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map(p => <SelectItem key={getEntityId(p)} value={getEntityId(p)}>{p.title}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 bg-muted/30 p-2 rounded-2xl border border-border">
        <Button variant="ghost" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="rounded-xl hover:bg-background">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <span className="font-bold text-lg text-foreground tracking-wide">
          {format(currentDate, 'MMMM yyyy')}
        </span>
        <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="rounded-xl hover:bg-background">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <div className="mb-6">
        {isLoading ? (
          <div className="h-96 flex items-center justify-center text-muted-foreground">Loading calendar...</div>
        ) : (
          renderCalendar()
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-border">
        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-card border border-border"></div> Available</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-primary/20 border border-primary/30"></div> Booked</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-muted border border-border line-through"></div> Blocked</div>
        </div>

        {selectionStart && selectionEnd && (
          <Button onClick={handleBlockDates} disabled={isBlocking} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-bold shadow-sm">
            {isBlocking ? 'Blocking...' : <><Ban className="w-4 h-4 mr-2" /> Block Selected Dates</>}
          </Button>
        )}
      </div>
    </div>
  );
};

export default HostBookingCalendar;