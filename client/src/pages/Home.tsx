import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ActivityCard from "@/components/ActivityCard";
import DestinationCard from "@/components/DestinationCard";
import MapView from "@/components/MapView";
import AccommodationCard from "@/components/AccommodationCard";
import ReviewCard from "@/components/ReviewCard";
import TravelGroupCard from "@/components/TravelGroupCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Clock, DollarSign, Shield, Compass } from "lucide-react";
import type { Destination, Accommodation, Review, TravelGroup } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();
  
  const { data: destinations = [] } = useQuery<Destination[]>({
    queryKey: ["/api/destinations"],
  });

  const { data: accommodations = [] } = useQuery<Accommodation[]>({
    queryKey: ["/api/accommodations"],
  });

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const { data: travelGroups = [] } = useQuery<TravelGroup[]>({
    queryKey: ["/api/travel-groups"],
  });

  const activities = [
    {
      title: "Mountain Trekking",
      description: "Discover breathtaking trails and summit adventures.",
      imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      icon: "🏔️",
      destinationCount: 2847
    },
    {
      title: "Beach Paradise",
      description: "Find your perfect beach escape and water activities.",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      icon: "🏖️",
      destinationCount: 1923
    },
    {
      title: "Adventure Sports",
      description: "Get your adrenaline pumping with extreme sports.",
      imageUrl: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      icon: "🪂",
      destinationCount: 856
    },
    {
      title: "Hidden Waterfalls",
      description: "Discover nature's most spectacular cascades.",
      imageUrl: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      icon: "💧",
      destinationCount: 1234
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      
      {/* Featured Activities */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="text-activities-heading">
              Explore by Activity
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose your adventure and let AI curate the perfect destinations for your passion.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.title}
                {...activity}
              />
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-6" data-testid="text-ai-heading">
                AI-Powered Travel Intelligence
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Brain className="text-primary text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">Smart Destination Matching</h3>
                    <p className="text-muted-foreground">Our AI analyzes your preferences and finds destinations perfectly matched to your adventure style.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-secondary/10 p-3 rounded-lg">
                    <Clock className="text-secondary text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">Optimal Timing Insights</h3>
                    <p className="text-muted-foreground">Get weather patterns, crowd levels, and seasonal recommendations for the perfect travel timing.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <DollarSign className="text-accent text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">Budget Protection</h3>
                    <p className="text-muted-foreground">Real-time local pricing data helps you avoid tourist traps and plan accurate budgets.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-2xl">
                <Card className="mb-4 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-foreground">Kashmir Recommendation</h4>
                      <span className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-sm font-medium">98% Match</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Best Time to Visit</span>
                        <span className="font-medium text-foreground">April - June</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Average Daily Budget</span>
                        <span className="font-medium text-foreground">₹2,500 - ₹4,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Adventure Activities</span>
                        <span className="font-medium text-foreground">12 available</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <span className="text-primary text-2xl mb-2 block">🌡️</span>
                      <p className="text-sm text-muted-foreground">Weather Score</p>
                      <p className="font-bold text-foreground">9.2/10</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <span className="text-secondary text-2xl mb-2 block">👥</span>
                      <p className="text-sm text-muted-foreground">Crowd Level</p>
                      <p className="font-bold text-foreground">Low</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-muted/30" id="destinations">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-black mb-4" data-testid="text-destinations-heading">
                Trending Destinations
              </h2>
              <p className="text-gray-600 text-lg">
                Discover where fellow adventurers are exploring right now.
              </p>
            </div>
            <Button variant="ghost" className="text-primary font-medium hover:text-primary/80" data-testid="button-view-all-destinations">
              View All →
            </Button>
          </div>
          
          {/* Trending Destination Cards with Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative group overflow-hidden rounded-2xl aspect-[4/5] cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1597074866923-dc0589150358?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Kashmir"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-red-500 text-xs px-2 py-1 rounded-full">🔥 Trending</span>
                </div>
                <h3 className="font-bold text-xl">Kashmir Valley</h3>
                <p className="text-sm text-white/80">Paradise on Earth</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-yellow-400">★ 4.8</span>
                  <span className="text-white/60 text-sm">• 2,300 reviews</span>
                </div>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-2xl aspect-[4/5] cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Goa"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-orange-500 text-xs px-2 py-1 rounded-full">🏖️ Popular</span>
                </div>
                <h3 className="font-bold text-xl">Goa Beaches</h3>
                <p className="text-sm text-white/80">Sun, Sand & Sea</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-yellow-400">★ 4.6</span>
                  <span className="text-white/60 text-sm">• 5,100 reviews</span>
                </div>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-2xl aspect-[4/5] cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Himachal"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-500 text-xs px-2 py-1 rounded-full">🏔️ Adventure</span>
                </div>
                <h3 className="font-bold text-xl">Himachal Pradesh</h3>
                <p className="text-sm text-white/80">Land of Gods</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-yellow-400">★ 4.9</span>
                  <span className="text-white/60 text-sm">• 3,800 reviews</span>
                </div>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-2xl aspect-[4/5] cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Kerala"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-500 text-xs px-2 py-1 rounded-full">🌴 Serene</span>
                </div>
                <h3 className="font-bold text-xl">Kerala Backwaters</h3>
                <p className="text-sm text-white/80">God's Own Country</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-yellow-400">★ 4.7</span>
                  <span className="text-white/60 text-sm">• 4,200 reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map & Itinerary */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-6" data-testid="text-route-planning-heading">
                Smart Route Planning
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Our AI creates optimized itineraries with interactive maps, showing you the best routes, transport options, and must-visit spots.
              </p>
              
              {/* Sample Itinerary */}
              <Card className="shadow-lg" data-testid="card-sample-itinerary">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg text-card-foreground">Kashmir 7-Day Adventure</h3>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      🛣️ Optimized Route
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg">
                      <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm">1</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-1">Srinagar - Dal Lake</h4>
                        <p className="text-muted-foreground text-sm mb-2">Houseboat stay, Shikara rides, Mughal Gardens</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>⏰ 2 days</span>
                          <span>₹ ₹3,500/day</span>
                          <span>🚗 Airport pickup</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg">
                      <div className="bg-secondary text-white w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm">2</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-1">Gulmarg - Gondola & Skiing</h4>
                        <p className="text-muted-foreground text-sm mb-2">Cable car, snow activities, mountain views</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>⏰ 2 days</span>
                          <span>₹ ₹4,200/day</span>
                          <span>🚌 2.5hr drive</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg">
                      <div className="bg-accent text-accent-foreground w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm">3</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-1">Pahalgam - Valley Trek</h4>
                        <p className="text-muted-foreground text-sm mb-2">Betaab Valley, Aru Valley, river rafting</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>⏰ 3 days</span>
                          <span>₹ ₹3,800/day</span>
                          <span>🏔️ Trekking</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Total estimated cost: <span className="font-semibold text-foreground">₹26,500 - ₹31,000</span>
                      </div>
                      <Button size="sm" data-testid="button-download-itinerary">
                        📥 Download Itinerary
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <MapView />
            </div>
          </div>
        </div>
      </section>

      {/* Accommodation Finder */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="text-accommodation-heading">
              Find Perfect Stays
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover accommodations that match your budget and preferences, with real reviews from fellow travelers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {accommodations.slice(0, 3).map((accommodation) => (
              <AccommodationCard key={accommodation.id} accommodation={accommodation} />
            ))}
          </div>
        </div>
      </section>

      {/* Community & Reviews */}
      <section className="py-16 bg-background" id="community">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-black mb-4" data-testid="text-community-heading">
              Travel Community
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Connect with fellow travelers, share experiences, and get insider tips from locals and adventurers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Card className="shadow-lg" data-testid="card-travel-stories">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-xl text-black">Recent Travel Stories</h3>
                    <Button variant="ghost" className="text-primary hover:text-primary/80" data-testid="button-share-story">
                      ➕ Share Your Story
                    </Button>
                  </div>
                  
                  {/* Story 1 */}
                  <div className="space-y-6">
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <img 
                        src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                        alt="Priya"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-black">Priya Sharma</span>
                          <span className="text-yellow-500">★★★★★</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">Solo Traveler • May 2024</p>
                        <p className="text-gray-700 text-sm">
                          "Kashmir exceeded all expectations! The AI recommendations were spot-on. Found amazing trekking routes that weren't overcrowded. The local cost estimates saved me from getting overcharged. Must visit Dal Lake at sunrise! 🌄"
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-sm text-gray-500">❤️ 24 likes</span>
                          <span className="text-sm text-blue-600 cursor-pointer">Reply</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Story 2 */}
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                        alt="Rahul"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-black">Rahul Gupta</span>
                          <span className="text-yellow-500">★★★★★</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">Family Trip • April 2024</p>
                        <p className="text-gray-700 text-sm">
                          "Took my family to Kerala and it was magical! The backwater houseboat experience was unforgettable. Kids loved the elephant sanctuary. WanderAI's itinerary was perfect for all ages. Highly recommend! 🐘🌴"
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-sm text-gray-500">❤️ 42 likes</span>
                          <span className="text-sm text-blue-600 cursor-pointer">Reply</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-border text-center">
                    <Button variant="ghost" className="text-primary hover:text-primary/80 font-medium" data-testid="button-view-all-stories">
                      View All Stories →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="shadow-lg mb-6" data-testid="card-travel-buddies">
                <CardContent className="p-6">
                  <div className="flex items-center mb-6">
                    <div className="bg-secondary/10 p-3 rounded-lg mr-4">
                      <span className="text-secondary text-xl">👥</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl text-black mb-1">Find Travel Buddies</h3>
                      <p className="text-black">Connect with like-minded travelers going to the same destination</p>
                    </div>
                  </div>
                  
                  {/* Travel Buddy Cards */}
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <img 
                          src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                          alt="Arjun"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-black">Arjun Mehta</span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Open</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">🏔️ Manali Trek Group</p>
                          <p className="text-xs text-gray-500 mt-1">Jun 15 - Jun 22 • Looking for 2 more</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Trekking</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Camping</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white">
                        Join Group
                      </Button>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <img 
                          src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                          alt="Sneha"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-black">Sneha Patel</span>
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">3/5 joined</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">🏖️ Goa Beach Trip</p>
                          <p className="text-xs text-gray-500 mt-1">Jul 1 - Jul 5 • ₹8,000 budget</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Beach</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Nightlife</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white">
                        Join Group
                      </Button>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <img 
                          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
                          alt="Vikram"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-black">Vikram Singh</span>
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Solo welcome</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">🌿 Kerala Backwaters</p>
                          <p className="text-xs text-gray-500 mt-1">Aug 10 - Aug 15 • ₹12,000 budget</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Nature</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Photography</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white">
                        Join Group
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-border">
                    <Button className="w-full bg-secondary text-white hover:bg-secondary/90" data-testid="button-create-travel-group">
                      ➕ Create Travel Group
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg" data-testid="card-budget-transparency">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-accent/10 p-3 rounded-lg mr-4">
                      <Shield className="text-accent text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-black mb-1">Budget Transparency</h3>
                      <p className="text-black text-sm">Real-time local pricing to prevent scams</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-black">Auto Rickshaw (per km)</span>
                      <div className="text-right">
                        <span className="font-medium text-black">₹12-15</span>
                        <div className="text-xs text-gray-600">Updated 2 hrs ago</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-black">Local Restaurant (meal)</span>
                      <div className="text-right">
                        <span className="font-medium text-black">₹150-300</span>
                        <div className="text-xs text-gray-600">Updated 4 hrs ago</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-black">Tourist Attraction Entry</span>
                      <div className="text-right">
                        <span className="font-medium text-black">₹20-50</span>
                        <div className="text-xs text-gray-600">Updated 1 hr ago</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border text-center">
                    <Button variant="ghost" className="text-black hover:text-black/80 font-medium text-sm" data-testid="button-price-guide">
                      View Complete Price Guide 🔗
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-6 text-black" data-testid="text-cta-heading">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-lg lg:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust WanderAI to plan their perfect trips. Get personalized recommendations, avoid tourist traps, and make memories that last a lifetime.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 text-white px-8 py-4 text-lg hover:bg-blue-700" data-testid="button-start-planning">
              🚀 Start Planning Now
            </Button>
            <Button variant="outline" className="border-2 border-black text-black px-8 py-4 text-lg hover:bg-gray-200" data-testid="button-watch-demo">
              ▶️ Watch Demo
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2 text-black">50K+</div>
              <div className="text-gray-600">Happy Travelers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2 text-black">2,847</div>
              <div className="text-gray-600">Destinations</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2 text-black">4.9★</div>
              <div className="text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Compass className="text-2xl text-primary" />
                <span className="font-serif font-bold text-xl text-black">WanderAI</span>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Your intelligent travel companion that uses AI to create personalized adventures, connect you with fellow travelers, and ensure authentic local experiences.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="bg-gray-200 hover:bg-gray-300 text-black">
                  📘
                </Button>
                <Button variant="ghost" size="icon" className="bg-gray-200 hover:bg-gray-300 text-black">
                  🐦
                </Button>
                <Button variant="ghost" size="icon" className="bg-gray-200 hover:bg-gray-300 text-black">
                  📷
                </Button>
                <Button variant="ghost" size="icon" className="bg-gray-200 hover:bg-gray-300 text-black">
                  📺
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-6 text-black">Discover</h3>
              <ul className="space-y-3">
                <li><Button variant="ghost" className="text-gray-700 hover:text-black p-0 h-auto">Popular Destinations</Button></li>
                <li><Button variant="ghost" className="text-gray-700 hover:text-black p-0 h-auto">Adventure Activities</Button></li>
                <li><Button variant="ghost" className="text-gray-700 hover:text-black p-0 h-auto">Cultural Experiences</Button></li>
                <li><Button variant="ghost" className="text-gray-700 hover:text-black p-0 h-auto">Hidden Gems</Button></li>
                <li><Button variant="ghost" className="text-gray-700 hover:text-black p-0 h-auto">Local Guides</Button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-6 text-black">Travel Tools</h3>
              <ul className="space-y-3">
                <li><Button variant="ghost" className="text-gray-700 hover:text-black p-0 h-auto">Trip Planner</Button></li>
                <li><Button variant="ghost" className="text-gray-700 hover:text-black p-0 h-auto">Budget Calculator</Button></li>
                <li><Button variant="ghost" className="text-gray-700 hover:text-black p-0 h-auto">Weather Insights</Button></li>
                <li><Button variant="ghost" className="text-gray-700 hover:text-black p-0 h-auto">Travel Groups</Button></li>
                <li><Button variant="ghost" className="text-gray-700 hover:text-black p-0 h-auto">Price Alerts</Button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-6 text-black">Support</h3>
              <ul className="space-y-3">
                <li><Button variant="ghost" className="text-gray-700 hover:text-black p-0 h-auto">Help Center</Button></li>
                <li><Button variant="ghost" className="text-gray-700 hover:text-black p-0 h-auto">Contact Us</Button></li>
                <li><Button variant="ghost" className="text-gray-700 hover:text-black p-0 h-auto">Travel Insurance</Button></li>
                <li><Button variant="ghost" className="text-gray-700 hover:text-black p-0 h-auto">Safety Guidelines</Button></li>
                <li><Button variant="ghost" className="text-gray-700 hover:text-black p-0 h-auto">Emergency Support</Button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-300 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-600 mb-4 md:mb-0">
                © 2024 WanderAI. All rights reserved. Made with ❤️ for travelers.
              </div>
              <div className="flex space-x-6">
                <Button variant="ghost" className="text-gray-600 hover:text-black p-0 h-auto">Privacy Policy</Button>
                <Button variant="ghost" className="text-gray-600 hover:text-black p-0 h-auto">Terms of Service</Button>
                <Button variant="ghost" className="text-gray-600 hover:text-black p-0 h-auto">Cookie Policy</Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
