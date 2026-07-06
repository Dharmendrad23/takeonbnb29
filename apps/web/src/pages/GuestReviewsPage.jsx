import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import GuestDashboardLayout from '@/components/GuestDashboardLayout.jsx';
import { Star, MessageSquare, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/bookingUtils.js';
import { toast } from 'sonner';

const GuestReviewsPage = () => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const records = await pb.collection('reviews').getFullList({
        filter: `guestId="${currentUser.id}"`,
        expand: 'propertyId',
        sort: '-created',
        $autoCancel: false
      });
      setReviews(records);
    } catch (e) {
      console.error("Error fetching reviews:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [currentUser]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await pb.collection('reviews').delete(id, { $autoCancel: false });
        setReviews(prev => prev.filter(r => r.id !== id));
        toast.success('Review deleted successfully');
      } catch (e) {
        toast.error('Failed to delete review');
      }
    }
  };

  return (
    <GuestDashboardLayout>
      <Helmet><title>My Reviews | TakeOn BnB</title></Helmet>
      
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2">My Reviews</h1>
        <p className="text-muted-foreground text-lg">Manage the reviews you've written for past stays.</p>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2].map(i => <Skeleton key={i} className="w-full h-40 rounded-2xl" />)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="dashboard-card py-20 text-center flex flex-col items-center justify-center bg-muted/20">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <MessageSquare className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">No reviews yet</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            After you complete a stay, you can write a review to share your experience with others.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => {
            const property = review.expand?.propertyId;
            return (
              <div key={review.id} className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{property?.title || 'Unknown Property'}</h3>
                    <p className="text-sm text-muted-foreground font-medium">{formatDate(review.created)}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-lg w-fit">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />
                    ))}
                  </div>
                </div>
                
                <p className="text-foreground leading-relaxed mb-6 bg-muted/30 p-4 rounded-xl border border-border/50">
                  "{review.reviewText}"
                </p>
                
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="rounded-lg font-bold border-border hover:bg-muted">
                    <Edit2 className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(review.id)} className="rounded-lg font-bold border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GuestDashboardLayout>
  );
};

export default GuestReviewsPage;