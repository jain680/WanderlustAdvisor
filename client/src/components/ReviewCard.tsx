import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Calendar, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Review } from "@shared/schema";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="border-b border-border pb-6 last:border-b-0 last:pb-0" data-testid={`review-${review.id}`}>
      <div className="flex items-start space-x-4">
        <img 
          src={review.userAvatar}
          alt={`${review.userName} - ${review.travelType}`}
          className="w-12 h-12 rounded-full object-cover"
          data-testid={`img-avatar-${review.id}`}
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-medium text-card-foreground" data-testid={`text-reviewer-name-${review.id}`}>
              {review.userName}
            </h4>
            <span className="text-muted-foreground text-sm" data-testid={`text-travel-type-${review.id}`}>
              • {review.travelType}
            </span>
            <div className="flex items-center">
              <Star className="text-accent mr-1 h-4 w-4 fill-current" />
              <span className="text-sm font-medium" data-testid={`text-review-rating-${review.id}`}>
                {review.rating}.0
              </span>
            </div>
          </div>
          <p className="text-muted-foreground mb-3" data-testid={`text-review-comment-${review.id}`}>
            {review.comment}
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              <span data-testid={`text-visit-date-${review.id}`}>{review.visitDate}</span>
            </span>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 p-0 h-auto" data-testid={`button-like-review-${review.id}`}>
              <ThumbsUp className="mr-1 h-4 w-4" />
              {review.likes}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
