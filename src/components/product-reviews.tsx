'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare,
  User,
  Calendar,
  Send
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful: number;
  notHelpful: number;
  verified: boolean;
  images?: string[];
}

interface ProductReviewsProps {
  productId: number;
  productName: string;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export default function ProductReviews({ 
  productId, 
  productName, 
  reviews, 
  averageRating, 
  totalReviews 
}: ProductReviewsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to submit a review.",
        variant: "destructive"
      });
      return;
    }

    if (!title.trim() || !comment.trim()) {
      toast({
        title: "Review Required",
        description: "Please fill in both title and comment.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      // Here you would submit the review to your backend
      const newReview: Review = {
        id: Date.now().toString(),
        userId: user.uid,
        userName: user.displayName || user.email || 'Anonymous',
        userAvatar: user.photoURL || undefined,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        date: new Date().toISOString(),
        helpful: 0,
        notHelpful: 0,
        verified: true
      };

      // Add to reviews (in a real app, this would be handled by the backend)
      reviews.unshift(newReview);

      // Reset form
      setRating(5);
      setTitle('');
      setComment('');
      setShowReviewForm(false);

      toast({
        title: "Review Submitted",
        description: "Thank you for your review!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpful = (reviewId: string, isHelpful: boolean) => {
    // Here you would update the helpful/not helpful count in your backend
    const review = reviews.find(r => r.id === reviewId);
    if (review) {
      if (isHelpful) {
        review.helpful++;
      } else {
        review.notHelpful++;
      }
    }
  };

  const renderStars = (rating: number, interactive = false, size = 'w-4 h-4') => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => setRating(star) : undefined}
            className={`${interactive ? 'cursor-pointer' : ''}`}
            disabled={!interactive}
          >
            <Star
              className={`${size} ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 5: return 'Excellent';
      case 4: return 'Very Good';
      case 3: return 'Good';
      case 2: return 'Fair';
      case 1: return 'Poor';
      default: return 'No Rating';
    }
  };

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Customer Reviews</CardTitle>
              <CardDescription>
                {totalReviews} reviews for {productName}
              </CardDescription>
            </div>
            <Button onClick={() => setShowReviewForm(true)}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Write a Review
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {averageRating.toFixed(1)}
              </div>
              {renderStars(averageRating)}
              <div className="text-sm text-muted-foreground mt-1">
                {getRatingText(Math.round(averageRating))}
              </div>
            </div>
            <div className="flex-1">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter(r => r.rating === star).length;
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-sm w-8">{star}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
            <CardDescription>
              Share your experience with {productName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex items-center gap-2">
                  {renderStars(rating, true, 'w-6 h-6')}
                  <span className="text-sm text-muted-foreground">
                    {getRatingText(rating)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Review Title</Label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Summarize your experience"
                  maxLength={100}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comment">Review</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your detailed experience with this product..."
                  rows={4}
                  maxLength={1000}
                />
                <div className="text-sm text-muted-foreground text-right">
                  {comment.length}/1000
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Review
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.userAvatar} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.userName}</span>
                    {review.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified Purchase
                      </Badge>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {renderStars(review.rating)}
                    <span className="text-sm font-medium">
                      {getRatingText(review.rating)}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">{review.title}</h4>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 pt-2">
                    <button
                      onClick={() => handleHelpful(review.id, true)}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Helpful ({review.helpful})
                    </button>
                    <button
                      onClick={() => handleHelpful(review.id, false)}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      Not Helpful ({review.notHelpful})
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 