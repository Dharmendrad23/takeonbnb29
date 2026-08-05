
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import api from '@/lib/api.js';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import pb from '@/lib/pocketbaseClient';

export const ReviewsSection = ({ propertyId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propertyId) return;
    
    const fetchReviews = async () => {
      try {
        const res = await pb.collection('reviews').getList(1, 6, {
          filter: `propertyId="${propertyId}"`,
          expand: 'guestId',
          sort: '-created',
          $autoCancel: false
        });
        setReviews(res.items);
      } catch (e) {
        console.error("Reviews fetch err:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [propertyId]);

  if (loading) return <div className="py-8"><div className="h-40 bg-muted animate-pulse rounded-2xl"></div></div>;
  if (reviews.length === 0) return (
    <div className="py-8 border-b border-border">
      <h2 className="text-2xl font-semibold mb-2">No reviews (yet)</h2>
      <p className="text-muted-foreground">Be the first to review this property after your stay.</p>
    </div>
  );

  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="py-8 border-b border-border">
      <div className="flex items-center gap-2 mb-8">
        <Star className="w-6 h-6 fill-foreground text-foreground" />
        <h2 className="text-2xl font-semibold">{avgRating} · {reviews.length} reviews</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        {reviews.map(review => (
          <div key={review.id}>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={review.expand?.guestId?.avatar ? pb.files.getURL(review.expand.guestId, review.expand.guestId.avatar) : ''} />
                <AvatarFallback>{review.expand?.guestId?.name?.[0] || 'G'}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-foreground">{review.expand?.guestId?.name || 'Guest'}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  {format(new Date(review.created), 'MMMM yyyy')} · 
                  <span className="flex"><Star className="w-3 h-3 fill-foreground" /> {review.rating}</span>
                </div>
              </div>
            </div>
            <p className="text-foreground/90 leading-relaxed text-sm">
              {review.reviewText}
            </p>
          </div>
        ))}
      </div>
      
      {reviews.length >= 6 && (
        <Button variant="outline" className="mt-8 rounded-xl font-semibold px-6 py-6 border-foreground">
          Show all reviews
        </Button>
      )}
    </div>
  );
};
