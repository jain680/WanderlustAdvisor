import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Calendar, IndianRupee } from "lucide-react";
import { Link } from "wouter";
import type { Destination } from "@shared/schema";

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const rating = destination.rating / 10;

  return (
    <Card className="destination-card overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl" data-testid={`card-destination-${destination.id}`}>
      <div className="relative">
        <div 
          className="h-64 bg-cover bg-center"
          style={{ backgroundImage: `url(${destination.imageUrl})` }}
        />
        <div className="absolute top-4 right-4">
          <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium" data-testid={`text-best-time-${destination.id}`}>
            Best Time: {destination.bestTimeToVisit}
          </span>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center space-x-2">
            {destination.activities.slice(0, 2).map((activity: string, index: number) => (
              <span key={index} className="bg-black/50 text-white px-2 py-1 rounded text-sm capitalize" data-testid={`tag-activity-${destination.id}-${index}`}>
                {activity}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif text-xl font-semibold text-card-foreground" data-testid={`text-destination-name-${destination.id}`}>
            {destination.name}
          </h3>
          <div className="flex items-center">
            <Star className="text-accent mr-1 h-4 w-4 fill-current" />
            <span className="font-medium text-foreground" data-testid={`text-rating-${destination.id}`}>
              {rating.toFixed(1)}
            </span>
            <span className="text-muted-foreground text-sm ml-1" data-testid={`text-review-count-${destination.id}`}>
              ({destination.reviewCount.toLocaleString()})
            </span>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-4 line-clamp-2" data-testid={`text-destination-description-${destination.id}`}>
          {destination.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground">
            <IndianRupee className="inline h-4 w-4 mr-1" />
            <span data-testid={`text-budget-range-${destination.id}`}>
              ₹{destination.averageBudgetMin.toLocaleString()}-{destination.averageBudgetMax.toLocaleString()}/day
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            <Calendar className="inline h-4 w-4 mr-1" />
            <span data-testid={`text-ideal-duration-${destination.id}`}>
              {destination.idealDuration} ideal
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {destination.activities.slice(0, 3).map((activity: string, index: number) => (
              <div 
                key={index}
                className="w-8 h-8 rounded-full bg-primary/20 border-2 border-white flex items-center justify-center"
                title={activity}
                data-testid={`icon-activity-${destination.id}-${index}`}
              >
                <span className="text-primary text-xs">
                  {activity === 'trekking' && '🏔️'}
                  {activity === 'beaches' && '🏖️'}
                  {activity === 'culture' && '🏛️'}
                  {activity === 'adventure' && '🪂'}
                  {activity === 'waterfalls' && '💧'}
                  {activity === 'lakes' && '🏞️'}
                  {activity === 'mountains' && '⛰️'}
                </span>
              </div>
            ))}
          </div>
          <Link href={`/destinations/${destination.id}`}>
            <Button data-testid={`button-explore-guide-${destination.id}`}>
              Explore Guide
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
