import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Users, Brain, Calendar, Star, TrendingUp, Plane, Mountain, Compass } from "lucide-react";
import MapView from "@/components/MapView";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    setLocation("/home");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')",
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>

        {/* Header */}
        <header className="relative z-10 container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Compass className="h-10 w-10 text-white" />
            <span className="text-3xl font-bold text-white drop-shadow-lg">WanderAI</span>
          </div>
          <Button 
            data-testid="button-login"
            onClick={handleGetStarted}
            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 px-6"
          >
            Explore Now
          </Button>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] text-center">
          <div className="flex items-center gap-3 mb-6">
            <Plane className="h-8 w-8 text-yellow-400 animate-pulse" />
            <Mountain className="h-10 w-10 text-green-400" />
            <MapPin className="h-8 w-8 text-red-400 animate-bounce" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            Your AI-Powered<br/>
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Travel Companion
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            Discover breathtaking destinations, get personalized AI recommendations, 
            plan unforgettable itineraries, and connect with fellow adventurers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              data-testid="button-get-started"
              onClick={handleGetStarted}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg px-10 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all"
            >
              🚀 Start Your Adventure
            </Button>
            <Button 
              onClick={handleGetStarted}
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/20 text-lg px-10 py-6 rounded-full backdrop-blur-sm"
            >
              🗺️ Explore Map
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">50K+</div>
              <div className="text-white/80 text-sm md:text-base">Happy Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">2,847</div>
              <div className="text-white/80 text-sm md:text-base">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">4.9★</div>
              <div className="text-white/80 text-sm md:text-base">User Rating</div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center pt-2">
              <div className="w-2 h-3 bg-white/70 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations Showcase */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Stunning Destinations Await
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            From majestic mountains to serene beaches, explore India's most beautiful places
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative group overflow-hidden rounded-2xl aspect-[3/4]">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Mountains"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-lg">Himalayas</h3>
                <p className="text-sm text-white/80">Adventure Awaits</p>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-2xl aspect-[3/4]">
              <img 
                src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Beach"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-lg">Goa Beaches</h3>
                <p className="text-sm text-white/80">Paradise Found</p>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-2xl aspect-[3/4]">
              <img 
                src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Taj Mahal"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-lg">Taj Mahal</h3>
                <p className="text-sm text-white/80">Wonder of World</p>
              </div>
            </div>
            
            <div className="relative group overflow-hidden rounded-2xl aspect-[3/4]">
              <img 
                src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                alt="Kerala Backwaters"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-lg">Kerala</h3>
                <p className="text-sm text-white/80">God's Own Country</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            🗺️ Explore India Interactively
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Click anywhere on the map to discover nearby places, hotels, restaurants and transportation options
          </p>
          <div className="max-w-4xl mx-auto">
            <MapView />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Everything You Need to Plan Your Perfect Trip
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Powered by AI to make your travel planning effortless and exciting
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 bg-white/80 backdrop-blur">
              <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-black">AI Recommendations</h3>
              <p className="text-gray-600">
                Get personalized destination suggestions based on your interests, budget, and travel style.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 bg-white/80 backdrop-blur">
              <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-black">Interactive Maps</h3>
              <p className="text-gray-600">
                Explore destinations with detailed maps, find accommodations, restaurants, and attractions.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 bg-white/80 backdrop-blur">
              <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-black">Smart Itineraries</h3>
              <p className="text-gray-600">
                Auto-generate detailed day-by-day plans with activities, costs, and local insights.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 bg-white/80 backdrop-blur">
              <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-black">Travel Groups</h3>
              <p className="text-gray-600">
                Connect with like-minded travelers and join or create travel groups for shared adventures.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 bg-white/80 backdrop-blur">
              <Star className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-black">Local Insights</h3>
              <p className="text-gray-600">
                Get authentic cultural tips, food recommendations, and avoid tourist traps with AI insights.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 bg-white/80 backdrop-blur">
              <TrendingUp className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-black">Price Alerts</h3>
              <p className="text-gray-600">
                Track flight and accommodation prices with intelligent alerts for the best deals.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="relative py-24"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-blue-900/80" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of travelers who trust WanderAI for their adventures. Your next unforgettable experience is just a click away.
          </p>
          <Button 
            data-testid="button-join-now"
            onClick={handleGetStarted}
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg px-12 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all"
          >
            🌍 Explore Destinations Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Compass className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold text-white">WanderAI</span>
          </div>
          <p className="text-gray-400">&copy; 2025 WanderAI. Your intelligent travel companion.</p>
        </div>
      </footer>
    </div>
  );
}
