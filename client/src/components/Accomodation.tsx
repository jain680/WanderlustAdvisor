import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Bed, Users, Heart, IndianRupee } from "lucide-react";
import type { Accommodation } from "@shared/schema";

interface AccommodationCardProps {
  accommodation: Accommodation;
}

export default function AccommodationCard({ accommodation }: AccommodationCardProps) {
  const rating = accommodation.rating / 10;

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow" data-testid={`card-accommodation-${accommodation.id}`}>
      <div className="relative">
        <div 
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${accommodation.imageUrl})` }}
        />
        <div className="absolute top-3 right-3">
          <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur-sm hover:bg-white" data-testid={`button-favorite-${accommodation.id}`}>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="bg-accent text-accent-foreground px-2 py-1 rounded text-sm font-medium capitalize" data-testid={`text-accommodation-type-${accommodation.id}`}>
            {accommodation.type}
          </span>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg text-card-foreground mb-1" data-testid={`text-accommodation-name-${accommodation.id}`}>
              {accommodation.name}
            </h3>
            <p className="text-muted-foreground text-sm" data-testid={`text-accommodation-type-desc-${accommodation.id}`}>
              {accommodation.type === 'houseboat' && 'Traditional Kashmiri Houseboat'}
              {accommodation.type === 'resort' && 'Luxury Mountain Resort'}
              {accommodation.type === 'guesthouse' && 'Cozy Local Guesthouse'}
              {accommodation.type === 'hotel' && 'Modern Hotel'}
            </p>
          </div>
          <div className="flex items-center">
            <Star className="text-accent mr-1 h-4 w-4 fill-current" />
            <span className="font-medium" data-testid={`text-accommodation-rating-${accommodation.id}`}>
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Bed className="mr-1 h-4 w-4" />
            <span data-testid={`text-bedrooms-${accommodation.id}`}>
              {accommodation.bedrooms} bedroom{accommodation.bedrooms !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center">
            <Users className="mr-1 h-4 w-4" />
            <span data-testid={`text-max-guests-${accommodation.id}`}>
              Up to {accommodation.maxGuests} guests
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mb-4">
          {accommodation.amenities.slice(0, 3).map((amenity: string, index: number) => (
            <span 
              key={index}
              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
              data-testid={`tag-amenity-${accommodation.id}-${index}`}
            >
              {amenity}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <IndianRupee className="h-5 w-5 mr-1" />
              <span className="text-xl font-bold text-card-foreground" data-testid={`text-price-${accommodation.id}`}>
                ₹{accommodation.pricePerNight.toLocaleString()}
              </span>
            </div>
            <span className="text-muted-foreground text-sm">/night</span>
          </div>
          <Button data-testid={`button-book-${accommodation.id}`}>
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
