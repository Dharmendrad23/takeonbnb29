import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from './StatusBadge';
import { formatDateRange } from '@/lib/bookingUtils';
import { Calendar, Users } from 'lucide-react';
import { getEntityId, getPropertyImage } from '@/lib/propertyMappers.js';

const BookingCard = ({ booking, onReview, onCancel }) => {
  const property = booking.property || booking.propertyId;
  
  if (!property) return null;

  const imageUrl = getPropertyImage(property) || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="relative aspect-[4/3] md:aspect-auto">
          <img
            src={imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="md:col-span-2 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-xl mb-1">{property.title}</h3>
              <p className="text-muted-foreground text-sm">{property.location}</p>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>{formatDateRange(booking.checkInDate, booking.checkOutDate)}</span>
            </div>
            <div className="flex items-center text-sm">
              <Users className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>{booking.guestCount} {booking.guestCount === 1 ? 'guest' : 'guests'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold">${booking.totalPrice}</span>
              <span className="text-muted-foreground text-sm ml-2">total</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" asChild>
                <Link to={`/property/${getEntityId(property)}`}>View Property</Link>
              </Button>
              {booking.status === 'completed' && onReview && (
                <Button onClick={() => onReview(booking)}>Leave Review</Button>
              )}
              {booking.status === 'pending' && onCancel && (
                <Button variant="destructive" onClick={() => onCancel(booking)}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default BookingCard;