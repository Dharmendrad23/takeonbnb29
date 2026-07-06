import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Badge } from '@/components/ui/badge';
import { useRealtimeBookings } from '@/hooks/useRealtimeBookings.js';
import { CalendarSkeleton, FadeInWrapper } from '@/components/LoadingSkeletons.jsx';

const localizer = momentLocalizer(moment);

const AdminBookingCalendar = () => {
  const { bookings, isLoading } = useRealtimeBookings();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (bookings.length > 0) {
      const calendarEvents = bookings.map(b => ({
        id: b.id,
        title: `${b.guestFullName || 'Guest'} - ${b.propertyName}`,
        start: new Date(b.checkInDate),
        end: new Date(b.checkOutDate),
        status: b.bookingStatus || b.status,
        resource: b
      }));
      setEvents(calendarEvents);
    } else {
      setEvents([]);
    }
  }, [bookings]);

  const eventStyleGetter = (event) => {
    let backgroundColor = 'hsl(var(--warning))'; // pending
    let color = 'hsl(var(--warning-foreground))';
    
    if (event.status === 'confirmed') {
      backgroundColor = 'hsl(var(--success))';
      color = 'white';
    }
    if (event.status === 'cancelled') {
      backgroundColor = 'hsl(var(--destructive))';
      color = 'white';
    }
    if (event.status === 'completed') {
      backgroundColor = 'hsl(var(--muted-foreground))';
      color = 'white';
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.95,
        color,
        border: '0px',
        display: 'block',
        fontSize: '12px',
        padding: '3px 6px',
        fontWeight: '500'
      }
    };
  };

  const handleSelectEvent = (event) => {
    // Could open a modal here, but for now we'll just log
    console.log("Selected booking:", event.resource);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 h-[calc(100vh-80px)] flex flex-col">
      <Helmet><title>Live Calendar | Admin</title></Helmet>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Live Availability</h1>
          <p className="text-sm text-muted-foreground mt-1">Updates automatically</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center bg-card px-4 py-2 rounded-xl border border-border text-sm shadow-sm">
          <span className="flex items-center gap-2 font-medium text-success"><span className="w-3 h-3 rounded-full bg-success"></span> Confirmed</span>
          <span className="flex items-center gap-2 font-medium text-warning"><span className="w-3 h-3 rounded-full bg-warning"></span> Pending</span>
          <span className="flex items-center gap-2 font-medium text-muted-foreground"><span className="w-3 h-3 rounded-full bg-muted-foreground"></span> Completed</span>
          <span className="flex items-center gap-2 font-medium text-destructive"><span className="w-3 h-3 rounded-full bg-destructive"></span> Cancelled</span>
        </div>
      </div>

      <FadeInWrapper isLoading={isLoading}>
        {isLoading ? (
          <CalendarSkeleton />
        ) : (
          <div className="bg-card border border-border p-4 rounded-2xl shadow-elevation-1 flex-1 min-h-[500px] overflow-hidden">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              eventPropGetter={eventStyleGetter}
              onSelectEvent={handleSelectEvent}
              views={['month', 'week', 'day']}
              defaultView="month"
              className="luxury-calendar"
            />
          </div>
        )}
      </FadeInWrapper>
    </div>
  );
};

export default AdminBookingCalendar;