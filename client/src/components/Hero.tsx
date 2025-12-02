import { useState, useEffect, useRef } from "react";
import { Search, Calendar, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AIRecommendation {
  destinations: Array<{
    name: string;
    location: string;
    matchScore: number;
    reasons: string[];
    bestTimeToVisit: string;
    estimatedBudget: {
      min: number;
      max: number;
    };
    recommendedDuration: string;
    activities: string[];
  }>;
}

// Popular destinations for autocomplete
const popularDestinations = [
  { name: "Kashmir Valley", state: "Jammu & Kashmir", icon: "🏔️", type: "Mountains" },
  { name: "Goa Beaches", state: "Goa", icon: "🏖️", type: "Beaches" },
  { name: "Manali", state: "Himachal Pradesh", icon: "🏔️", type: "Mountains" },
  { name: "Kerala Backwaters", state: "Kerala", icon: "🌴", type: "Nature" },
  { name: "Jaipur", state: "Rajasthan", icon: "🏰", type: "Heritage" },
  { name: "Ladakh", state: "Ladakh", icon: "🏔️", type: "Adventure" },
  { name: "Rishikesh", state: "Uttarakhand", icon: "🧘", type: "Spiritual" },
  { name: "Udaipur", state: "Rajasthan", icon: "🏰", type: "Heritage" },
  { name: "Andaman Islands", state: "Andaman", icon: "🏝️", type: "Beaches" },
  { name: "Darjeeling", state: "West Bengal", icon: "🍵", type: "Hills" },
  { name: "Varanasi", state: "Uttar Pradesh", icon: "🕉️", type: "Spiritual" },
  { name: "Shimla", state: "Himachal Pradesh", icon: "❄️", type: "Hills" },
  { name: "Ooty", state: "Tamil Nadu", icon: "🌿", type: "Hills" },
  { name: "Munnar", state: "Kerala", icon: "🍃", type: "Nature" },
  { name: "Ranthambore", state: "Rajasthan", icon: "🐅", type: "Wildlife" },
];

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState(popularDestinations);
  const [selectedActivities, setSelectedActivities] = useState<string[]>(["trekking"]);
  const { toast } = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activities = [
    { id: "trekking", label: "Trekking", icon: "🏔️" },
    { id: "camping", label: "Camping", icon: "⛺" },
    { id: "beaches", label: "Beaches", icon: "🏖️" },
    { id: "waterfalls", label: "Waterfalls", icon: "💧" },
    { id: "adventure", label: "Adventure Sports", icon: "🪂" },
  ];

  // Filter destinations based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDestinations(popularDestinations.slice(0, 6));
    } else {
      const filtered = popularDestinations.filter(
        dest =>
          dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dest.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dest.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDestinations(filtered);
    }
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDestinationSelect = (destination: typeof popularDestinations[0]) => {
    setSearchQuery(destination.name);
    setShowDropdown(false);
  };

  const aiSearchMutation = useMutation({
    mutationFn: async (data: { activities: string[]; location?: string }) => {
      const response = await apiRequest("POST", "/api/ai/recommendations", {
        activities: data.activities,
        location: data.location,
        budget: { min: 2000, max: 5000 },
        duration: "5-7 days",
        travelStyle: "adventurous"
      });
      return response.json() as Promise<AIRecommendation>;
    },
    onSuccess: (data) => {
      toast({
        title: "AI Recommendations Ready!",
        description: `Found ${data.destinations.length} perfect destinations for you.`,
      });
      console.log("AI Recommendations:", data);
    },
    onError: (error) => {
      toast({
        title: "Search Complete",
        description: "Showing results for " + searchQuery,
      });
      console.error("AI search error:", error);
    },
  });

  const handleActivityToggle = (activityId: string) => {
    setSelectedActivities(prev => 
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const handleSearch = () => {
    if (selectedActivities.length === 0) {
      toast({
        title: "Select Activities",
        description: "Please select at least one activity to get personalized recommendations.",
        variant: "destructive",
      });
      return;
    }

    aiSearchMutation.mutate({
      activities: selectedActivities,
      location: searchQuery || undefined,
    });
  };

  return (
    <section className="hero-gradient text-white relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/30"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl lg:text-6xl font-bold mb-6 leading-tight" data-testid="text-hero-title">
            Discover Your Perfect<br/>Adventure with AI
          </h1>
          <p className="text-lg lg:text-xl text-white/90 max-w-2xl mx-auto mb-8" data-testid="text-hero-description">
            From hidden waterfalls to thrilling paragliding spots, let our AI guide you to unforgettable experiences tailored to your adventure style.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto glass-card rounded-2xl p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2 relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-black mb-2">
                Where do you want to explore?
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search destinations, cities, or regions..."
                  className="pl-12 py-4 text-black placeholder:text-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  data-testid="input-search-destination"
                />
              </div>
              
              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-80 overflow-y-auto">
                  <div className="p-2">
                    <p className="text-xs text-gray-500 px-3 py-2 font-medium">
                      {searchQuery ? "Search Results" : "Popular Destinations"}
                    </p>
                    {filteredDestinations.length > 0 ? (
                      filteredDestinations.map((dest, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 px-3 py-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                          onClick={() => handleDestinationSelect(dest)}
                        >
                          <span className="text-2xl">{dest.icon}</span>
                          <div className="flex-1">
                            <p className="font-medium text-black">{dest.name}</p>
                            <p className="text-sm text-gray-500">{dest.state} • {dest.type}</p>
                          </div>
                          <MapPin className="h-4 w-4 text-gray-400" />
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-center text-gray-500">
                        No destinations found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Travel Dates
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Select dates"
                  className="pl-12 py-4 text-black placeholder:text-gray-500"
                  data-testid="input-travel-dates"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-3">
              What kind of adventure are you seeking?
            </label>
            <div className="flex flex-wrap gap-3">
              {activities.map((activity) => (
                <Button
                  key={activity.id}
                  variant={selectedActivities.includes(activity.id) ? "default" : "outline"}
                  onClick={() => handleActivityToggle(activity.id)}
                  className="transition-colors text-black"
                  data-testid={`button-activity-${activity.id}`}
                >
                  <span className="mr-2">{activity.icon}</span>
                  {activity.label}
                </Button>
              ))}
            </div>
          </div>
          
          <Button 
            className="w-full bg-secondary text-white py-4 px-6 text-lg hover:bg-secondary/90 transition-colors"
            onClick={handleSearch}
            disabled={aiSearchMutation.isPending}
            data-testid="button-find-trip"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {aiSearchMutation.isPending ? "Finding Your Perfect Trip..." : "Find My Perfect Trip"}
          </Button>
        </div>
      </div>
    </section>
  );
}
