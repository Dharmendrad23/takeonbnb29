
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import apiServerClient from '@/lib/apiServerClient.js';
import { normalizeReviews } from '@/lib/propertyMappers.js';

export const ReviewsSection = ({ propertyId, reviews: initialReviews = [] }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (initialReviews.length > 0) {
        setReviews(normalizeReviews(initialReviews));
        setLoading(false);
        return;
      }

      if (!propertyId) {
        setReviews([]);
        setLoading(false);
        return;
      }

      try {
        const response = await apiServerClient.fetch(`/properties/${propertyId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch property reviews');
        }

        const property = await response.json();
        setReviews(normalizeReviews(Array.isArray(property?.reviews) ? property.reviews.slice(0, 6) : []));
      } catch (e) {
        console.error("Reviews fetch err:", e);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [initialReviews, propertyId]);

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
                <AvatarImage src={review.guest.avatarUrl} />
                <AvatarFallback>{review.guest.name?.[0] || 'G'}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-foreground">{review.guest.name || 'Guest'}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  {review.createdAt ? format(new Date(review.createdAt), 'MMMM yyyy') : 'Recent stay'} · 
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
