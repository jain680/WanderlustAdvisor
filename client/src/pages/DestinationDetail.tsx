import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import AccommodationCard from "@/components/AccommodationCard";
import ReviewCard from "@/components/ReviewCard";
import MapView from "@/components/MapView";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, Calendar, IndianRupee, Clock, Thermometer, Users, Sparkles, Download } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Destination, Accommodation, Review, LocalPricing, Itinerary } from "@shared/schema";

interface CulturalInsights {
  culture: string;
  food: string;
  specialties: string[];
  localTips: string[];
}

interface AIItinerary {
  title: string;
  totalDuration: number;
  totalBudget: {
    min: number;
    max: number;
  };
  days: Array<{
    day: number;
    location: string;
    activities: Array<{
      time: string;
      activity: string;
      cost: number;
      description: string;
    }>;
    transportation: {
      method: string;
      cost: number;
      duration: string;
    };
    accommodation: {
      type: string;
      cost: number;
    };
  }>;
}

export default function DestinationDetail() {
  const params = useParams();
  const destinationId = params.id;
  const [reviewForm, setReviewForm] = useState({
    userName: "",
    userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    rating: 5,
    comment: "",
    travelType: "",
    visitDate: ""
  });
  const { toast } = useToast();

  // Queries
  const { data: destination, isLoading: destinationLoading } = useQuery<Destination>({
    queryKey: ["/api/destinations", destinationId],
  });

  const { data: accommodations = [], isLoading: accommodationsLoading } = useQuery<Accommodation[]>({
    queryKey: ["/api/accommodations", { params: { destinationId } }],
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews", { params: { destinationId } }],
  });

  const { data: localPricing = [], isLoading: pricingLoading } = useQuery<LocalPricing[]>({
    queryKey: ["/api/local-pricing", { params: { destinationId } }],
  });

  const { data: culturalInsights, isLoading: cultureLoading } = useQuery<CulturalInsights>({
    queryKey: ["/api/ai/cultural-insights", destination?.name || ""],
    enabled: !!destination?.name,
  });

  // Mutations
  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: typeof reviewForm) => {
      const response = await apiRequest("POST", "/api/reviews", {
        ...reviewData,
        destinationId,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Review Submitted!",
        description: "Thank you for sharing your travel experience.",
      });
      setReviewForm({
        userName: "",
        userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        rating: 5,
        comment: "",
        travelType: "",
        visitDate: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
    },
    onError: () => {
      toast({
        title: "Failed to Submit Review",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const generateItineraryMutation = useMutation({
    mutationFn: async () => {
      if (!destination) throw new Error("Destination not loaded");
      const response = await apiRequest("POST", "/api/ai/itinerary", {
        destination: destination.name,
        duration: 7,
        budget: { min: destination.averageBudgetMin, max: destination.averageBudgetMax },
        activities: destination.activities,
        travelStyle: "balanced adventure and culture"
      });
      return response.json() as Promise<AIItinerary>;
    },
    onSuccess: (data) => {
      toast({
        title: "AI Itinerary Generated!",
        description: `Created a ${data.totalDuration}-day personalized itinerary for ${destination?.name}.`,
      });
    },
    onError: () => {
      toast({
        title: "Failed to Generate Itinerary",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  if (destinationLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-96 bg-muted rounded-2xl mb-8"></div>
            <div className="h-8 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="font-serif text-2xl font-bold text-foreground mb-2" data-testid="text-destination-not-found">
            Destination Not Found
          </h1>
          <p className="text-muted-foreground">The destination you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const rating = destination.rating / 10;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.userName || !reviewForm.comment || !reviewForm.travelType || !reviewForm.visitDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createReviewMutation.mutate(reviewForm);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${destination.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-5 w-5" />
              <span className="text-white/90" data-testid="text-destination-location">{destination.location}</span>
            </div>
            <h1 className="font-serif text-4xl lg:text-6xl font-bold mb-4" data-testid="text-destination-name">
              {destination.name}
            </h1>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Star className="text-accent mr-2 h-5 w-5 fill-current" />
                <span className="font-medium text-lg" data-testid="text-destination-rating">
                  {rating.toFixed(1)}
                </span>
                <span className="text-white/90 ml-2" data-testid="text-destination-reviews">
                  ({destination.reviewCount.toLocaleString()} reviews)
                </span>
              </div>
              <div className="flex items-center">
                <IndianRupee className="mr-1 h-5 w-5" />
                <span data-testid="text-destination-budget">
                  ₹{destination.averageBudgetMin.toLocaleString()}-{destination.averageBudgetMax.toLocaleString()}/day
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4" data-testid="text-overview-heading">
                  About {destination.name}
                </h2>
                <p className="text-muted-foreground text-lg mb-6" data-testid="text-destination-description">
                  {destination.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-medium text-foreground">Best Time</p>
                    <p className="text-muted-foreground" data-testid="text-best-time">
                      {destination.bestTimeToVisit}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Clock className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <p className="font-medium text-foreground">Duration</p>
                    <p className="text-muted-foreground" data-testid="text-ideal-duration">
                      {destination.idealDuration}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Thermometer className="h-8 w-8 text-accent mx-auto mb-2" />
                    <p className="font-medium text-foreground">Weather</p>
                    <p className="text-muted-foreground">Pleasant</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-lg text-foreground mb-3">Activities</h3>
                  <div className="flex flex-wrap gap-2">
                    {destination.activities.map((activity, index) => (
                      <Badge key={index} variant="secondary" className="capitalize" data-testid={`badge-activity-${index}`}>
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-3">Must-Visit Highlights</h3>
                  <ul className="space-y-2">
                    {destination.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center text-muted-foreground" data-testid={`text-highlight-${index}`}>
                        <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg text-foreground mb-4">Plan Your Trip</h3>
                
                <Button 
                  className="w-full mb-4"
                  onClick={() => generateItineraryMutation.mutate()}
                  disabled={generateItineraryMutation.isPending}
                  data-testid="button-generate-itinerary"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {generateItineraryMutation.isPending ? "Generating..." : "Generate AI Itinerary"}
                </Button>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Quick Stats</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reviews</span>
                        <span className="font-medium">{destination.reviewCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Activities</span>
                        <span className="font-medium">{destination.activities.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Highlights</span>
                        <span className="font-medium">{destination.highlights.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="accommodations" className="w-full">
          <TabsList className="grid w-full grid-cols-5" data-testid="tabs-destination-details">
            <TabsTrigger value="accommodations" data-testid="tab-accommodations">Stays</TabsTrigger>
            <TabsTrigger value="itinerary" data-testid="tab-itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="culture" data-testid="tab-culture">Culture & Food</TabsTrigger>
            <TabsTrigger value="pricing" data-testid="tab-pricing">Local Pricing</TabsTrigger>
            <TabsTrigger value="reviews" data-testid="tab-reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="accommodations" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {accommodationsLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl p-6 animate-pulse">
                    <div className="h-48 bg-muted rounded-lg mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                ))
              ) : accommodations.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">🏨</div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">No Accommodations Available</h3>
                  <p className="text-muted-foreground">Check back later for accommodation options.</p>
                </div>
              ) : (
                accommodations.map((accommodation) => (
                  <AccommodationCard key={accommodation.id} accommodation={accommodation} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="itinerary" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-xl text-foreground mb-4">Smart Route Planning</h3>
                    <p className="text-muted-foreground mb-6">
                      Generate personalized itineraries using AI that considers your preferences, budget, and travel style.
                    </p>
                    
                    <Button 
                      className="w-full mb-4"
                      onClick={() => generateItineraryMutation.mutate()}
                      disabled={generateItineraryMutation.isPending}
                      data-testid="button-create-itinerary"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      {generateItineraryMutation.isPending ? "Creating Itinerary..." : "Create Personalized Itinerary"}
                    </Button>

                    {generateItineraryMutation.data && (
                      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-foreground">{generateItineraryMutation.data.title}</h4>
                          <Button size="sm" variant="outline" data-testid="button-download-ai-itinerary">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Duration: {generateItineraryMutation.data.totalDuration} days</p>
                          <p>Budget: ₹{generateItineraryMutation.data.totalBudget.min.toLocaleString()} - ₹{generateItineraryMutation.data.totalBudget.max.toLocaleString()}</p>
                          <p>Activities: {generateItineraryMutation.data.days.length} days planned</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <MapView destination={destination.name} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="culture" className="mt-8">
            {cultureLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-8"></div>
                <div className="h-8 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            ) : culturalInsights ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-xl text-foreground mb-4" data-testid="text-culture-heading">
                      Culture & Heritage
                    </h3>
                    <p className="text-muted-foreground mb-6" data-testid="text-culture-description">
                      {culturalInsights.culture}
                    </p>
                    
                    <h4 className="font-medium text-foreground mb-3">Unique Specialties</h4>
                    <ul className="space-y-2">
                      {culturalInsights.specialties.map((specialty, index) => (
                        <li key={index} className="flex items-center text-muted-foreground" data-testid={`text-specialty-${index}`}>
                          <span className="w-2 h-2 bg-secondary rounded-full mr-3"></span>
                          {specialty}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-xl text-foreground mb-4" data-testid="text-food-heading">
                      Food & Cuisine
                    </h3>
                    <p className="text-muted-foreground mb-6" data-testid="text-food-description">
                      {culturalInsights.food}
                    </p>
                    
                    <h4 className="font-medium text-foreground mb-3">Local Tips</h4>
                    <ul className="space-y-2">
                      {culturalInsights.localTips.map((tip, index) => (
                        <li key={index} className="flex items-start text-muted-foreground" data-testid={`text-tip-${index}`}>
                          <span className="w-2 h-2 bg-accent rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏛️</div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Cultural Insights Loading</h3>
                <p className="text-muted-foreground">Getting cultural information for {destination.name}...</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pricing" className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl text-foreground mb-4" data-testid="text-pricing-heading">
                  Local Pricing Guide
                </h3>
                <p className="text-muted-foreground mb-6">
                  Real-time pricing data to help you budget accurately and avoid tourist traps.
                </p>

                {pricingLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex justify-between items-center py-3 animate-pulse">
                        <div className="h-4 bg-muted rounded w-1/3"></div>
                        <div className="h-4 bg-muted rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : localPricing.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">💰</div>
                    <h4 className="font-semibold text-foreground mb-2">No Pricing Data Available</h4>
                    <p className="text-muted-foreground">Local pricing information will be available soon.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {localPricing.map((price, index) => (
                      <div key={price.id} className="flex justify-between items-center py-3 border-b border-border last:border-b-0">
                        <div>
                          <span className="font-medium text-foreground" data-testid={`text-price-item-${index}`}>
                            {price.item}
                          </span>
                          <span className="text-muted-foreground text-sm ml-2">
                            ({price.unit})
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-medium text-foreground" data-testid={`text-price-range-${index}`}>
                            ₹{price.priceMin}-{price.priceMax}
                          </span>
                          <div className="text-xs text-muted-foreground">
                            Updated {price.lastUpdated ? new Date(price.lastUpdated).toLocaleDateString() : 'Unknown'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-xl text-foreground mb-4">Traveler Reviews</h3>
                    
                    {reviewsLoading ? (
                      <div className="space-y-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="flex items-start space-x-4">
                              <div className="w-12 h-12 bg-muted rounded-full"></div>
                              <div className="flex-1">
                                <div className="h-4 bg-muted rounded mb-2"></div>
                                <div className="h-3 bg-muted rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-muted rounded w-1/2"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : reviews.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">💬</div>
                        <h4 className="font-semibold text-foreground mb-2">No Reviews Yet</h4>
                        <p className="text-muted-foreground">Be the first to share your experience!</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <ReviewCard key={review.id} review={review} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-xl text-foreground mb-4">Share Your Experience</h3>
                    
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Your Name"
                          value={reviewForm.userName}
                          onChange={(e) => setReviewForm(prev => ({ ...prev, userName: e.target.value }))}
                          data-testid="input-reviewer-name"
                        />
                        <Input
                          placeholder="Visit Date (e.g., May 2024)"
                          value={reviewForm.visitDate}
                          onChange={(e) => setReviewForm(prev => ({ ...prev, visitDate: e.target.value }))}
                          data-testid="input-visit-date"
                        />
                      </div>
                      
                      <Select 
                        value={reviewForm.travelType} 
                        onValueChange={(value) => setReviewForm(prev => ({ ...prev, travelType: value }))}
                      >
                        <SelectTrigger data-testid="select-travel-type">
                          <SelectValue placeholder="Travel Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Solo Traveler">Solo Traveler</SelectItem>
                          <SelectItem value="Couple">Couple</SelectItem>
                          <SelectItem value="Family">Family</SelectItem>
                          <SelectItem value="Friends">Friends</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Rating: {reviewForm.rating}/5
                        </label>
                        <div className="flex space-x-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Button
                              key={i}
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setReviewForm(prev => ({ ...prev, rating: i + 1 }))}
                              className="p-0 h-8 w-8"
                              data-testid={`button-rating-${i + 1}`}
                            >
                              <Star 
                                className={`h-6 w-6 ${i < reviewForm.rating ? 'text-accent fill-current' : 'text-muted-foreground'}`} 
                              />
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <Textarea
                        placeholder="Share your experience..."
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                        rows={4}
                        data-testid="textarea-review-comment"
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={createReviewMutation.isPending}
                        data-testid="button-submit-review"
                      >
                        {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
