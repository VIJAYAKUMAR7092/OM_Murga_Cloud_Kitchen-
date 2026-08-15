"use client";

import { useState } from "react";
import { Star, Loader2, MessageSquare, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface CustomerReviewFormProps {
  trackingId: string;
  phone: string;
  customerName: string;
  hasReviewed: boolean;
}

export function CustomerReviewForm({ trackingId, phone, customerName, hasReviewed }: CustomerReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(hasReviewed);

  if (isSuccess) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 text-center mt-8">
        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-6 h-6 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Review Submitted</h3>
        <p className="text-muted-foreground mt-2">Thank you for your feedback!</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackingId,
          phone,
          customerName,
          rating,
          review
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit review");

      toast.success("Review submitted successfully!");
      setIsSuccess(true);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mt-8">
      {!isExpanded ? (
        <div 
          className="p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => setIsExpanded(true)}
        >
          <h3 className="font-bold text-xl text-foreground mb-4">Rate this order</h3>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-8 h-8 text-muted-foreground hover:text-primary hover:fill-primary transition-colors duration-200"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-xl text-foreground">Write a Review</h3>
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-sm text-muted-foreground hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none focus:scale-110 transition-transform"
                >
                  <Star
                    className={`w-10 h-10 transition-all duration-200 ${
                      star <= (hoverRating || rating)
                        ? "text-primary fill-primary drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                Tell us about your food (Optional)
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="How was the taste, packaging, and portion size?"
                className="w-full bg-background border border-border rounded-xl p-4 text-foreground focus:outline-none focus:border-primary transition-colors resize-none min-h-[120px]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="w-full btn btn-primary py-4 rounded-xl font-bold flex items-center justify-center disabled:opacity-50 transition-opacity"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
}
