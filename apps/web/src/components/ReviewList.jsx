import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import RatingStars from './RatingStars';
import { format } from 'date-fns';
import { getEntityId, getHostAvatarUrl, getHostName } from '@/lib/propertyMappers.js';

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No reviews yet. Be the first to review this property.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const guest = review.guest || review.user || review.guestId;
        const avatarUrl = getHostAvatarUrl(guest);
        const initials = getHostName(guest).split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

        return (
          <Card key={getEntityId(review)}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="rounded-xl">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={getHostName(guest)} />}
                  <AvatarFallback className="rounded-xl bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{getHostName(guest) || 'Anonymous'}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(review.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <RatingStars rating={review.rating} />
                  </div>
                  <p className="text-foreground leading-relaxed">{review.reviewText}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ReviewList;