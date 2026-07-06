import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import pb from '@/lib/pocketbaseClient';
import { parseISO, eachDayOfInterval } from 'date-fns';

const AvailabilityCalendar = ({ propertyId }) => {
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookedDates();
  }, [propertyId]);

  const loadBookedDates = async () => {
    try {
      const bookings = await pb.collection('bookings').getFullList({
        filter: `propertyId="${propertyId}" && (status="pending" || status="confirmed")`,
        $autoCancel: false
      });

      const dates = [];
      bookings.forEach(booking => {
        const start = parseISO(booking.checkInDate);
        const end = parseISO(booking.checkOutDate);
        const range = eachDayOfInterval({ start, end });
        dates.push(...range);
      });

      setBookedDates(dates);
    } catch (error) {
      console.error('Failed to load booked dates:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading availability...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          disabled={(date) => bookedDates.some(d => d.toDateString() === date.toDateString())}
          className="rounded-md border"
        />
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-muted rounded"></div>
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <span className="text-muted-foreground">Booked</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailabilityCalendar;