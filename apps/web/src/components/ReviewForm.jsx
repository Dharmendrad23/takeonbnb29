import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import RatingStars from '@/components/RatingStars.jsx';
import api from '@/lib/api.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export const ReviewForm = ({ propertyId, onReviewAdded }) => {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('You must be logged in to submit a review.');
      return;
    }
    
    if (rating === 0) {
      toast.error('Please select a rating.');
      return;
    }
    
    if (!title.trim()) {
      toast.error('Please provide a title for your review.');
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Please provide a comment.');
      return;
    }

    setLoading(true);
    
    try {
      const reviewText = `${title.trim()}\n\n${comment.trim()}`;
      
      await pb.collection('reviews').create({
        propertyId,
        guestId: currentUser.id,
        rating,
        reviewText
      }, { $autoCancel: false });

      toast.success('Review submitted successfully!');
      setRating(0);
      setTitle('');
      setComment('');
      
      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (err) {
      console.error('Review submission error:', err);
      toast.error(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Your Rating</label>
            <RatingStars 
              rating={rating} 
              onRatingChange={setRating} 
              interactive={true} 
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="review-title" className="text-sm font-semibold text-foreground">Review Title</label>
            <Input
              id="review-title"
              placeholder="Summarize your experience..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              className="bg-background border-border text-foreground focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="review-comment" className="text-sm font-semibold text-foreground">Detailed Review</label>
            <Textarea
              id="review-comment"
              placeholder="Tell us about your stay, the amenities, and the location..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={loading}
              className="min-h-[120px] bg-background border-border text-foreground focus-visible:ring-primary resize-none"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading || !currentUser} 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-xl text-base font-semibold shadow-sm transition-all duration-300"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
              </span>
            ) : (
              'Submit Review'
            )}
          </Button>

          {!currentUser && (
            <p className="text-sm text-center text-muted-foreground mt-4">
              Please log in to leave a review.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;