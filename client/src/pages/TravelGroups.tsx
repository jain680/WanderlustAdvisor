import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import TravelGroupCard from "@/components/TravelGroupCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, Search, Calendar, IndianRupee, MapPin } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { TravelGroup, Destination } from "@shared/schema";

export default function TravelGroups() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activityFilter, setActivityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [groupForm, setGroupForm] = useState({
    title: "",
    destinationId: "",
    organizerName: "",
    organizerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    description: "",
    startDate: "",
    endDate: "",
    maxMembers: 4,
    budget: 15000,
    activities: [] as string[],
    requirements: ""
  });
  const { toast } = useToast();

  // Queries
  const { data: travelGroups = [], isLoading: groupsLoading } = useQuery<TravelGroup[]>({
    queryKey: ["/api/travel-groups"],
  });

  const { data: destinations = [] } = useQuery<Destination[]>({
    queryKey: ["/api/destinations"],
  });

  // Filter groups based on search and filters
  const filteredGroups = travelGroups.filter(group => {
    const matchesSearch = searchQuery === "" || 
      group.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesActivity = activityFilter === "" || group.activities.includes(activityFilter);
    const matchesStatus = statusFilter === "" || group.status === statusFilter;
    
    return matchesSearch && matchesActivity && matchesStatus;
  });

  // Mutations
  const createGroupMutation = useMutation({
    mutationFn: async (groupData: typeof groupForm) => {
      const response = await apiRequest("POST", "/api/travel-groups", groupData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Travel Group Created!",
        description: "Your travel group has been created successfully. Other travelers can now join!",
      });
      setIsCreateDialogOpen(false);
      setGroupForm({
        title: "",
        destinationId: "",
        organizerName: "",
        organizerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        description: "",
        startDate: "",
        endDate: "",
        maxMembers: 4,
        budget: 15000,
        activities: [],
        requirements: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/travel-groups"] });
    },
    onError: () => {
      toast({
        title: "Failed to Create Group",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupForm.title || !groupForm.organizerName || !groupForm.destinationId || !groupForm.startDate || !groupForm.endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (groupForm.activities.length === 0) {
      toast({
        title: "Select Activities",
        description: "Please select at least one activity for your trip.",
        variant: "destructive",
      });
      return;
    }

    createGroupMutation.mutate(groupForm);
  };

  const toggleActivity = (activity: string) => {
    setGroupForm(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity]
    }));
  };

  const activities = ["trekking", "beaches", "adventure", "culture", "camping", "waterfalls"];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4" data-testid="text-travel-groups-title">
            Find Travel Companions
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Connect with like-minded travelers, join existing groups, or create your own adventure. 
            Solo travel becomes group fun when you find the right companions!
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search travel groups..."
                    className="pl-12 py-4"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="input-search-groups"
                  />
                </div>
              </div>
              <div>
                <Select value={activityFilter} onValueChange={setActivityFilter}>
                  <SelectTrigger className="py-4" data-testid="select-activity-filter">
                    <SelectValue placeholder="Filter by activity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Activities</SelectItem>
                    <SelectItem value="trekking">Trekking</SelectItem>
                    <SelectItem value="beaches">Beaches</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="culture">Culture</SelectItem>
                    <SelectItem value="camping">Camping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="py-4" data-testid="select-status-filter">
                    <SelectValue placeholder="Group status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Groups</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground" data-testid="text-groups-count">
                {filteredGroups.length} travel group{filteredGroups.length !== 1 ? 's' : ''} found
              </p>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-secondary text-white hover:bg-secondary/90" data-testid="button-create-group-trigger">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Travel Group
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle data-testid="text-create-group-title">Create New Travel Group</DialogTitle>
                  </DialogHeader>
                  
                  <form onSubmit={handleCreateGroup} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Group Title"
                        value={groupForm.title}
                        onChange={(e) => setGroupForm(prev => ({ ...prev, title: e.target.value }))}
                        data-testid="input-group-title"
                      />
                      <Input
                        placeholder="Your Name"
                        value={groupForm.organizerName}
                        onChange={(e) => setGroupForm(prev => ({ ...prev, organizerName: e.target.value }))}
                        data-testid="input-organizer-name"
                      />
                    </div>
                    
                    <Select 
                      value={groupForm.destinationId} 
                      onValueChange={(value) => setGroupForm(prev => ({ ...prev, destinationId: value }))}
                    >
                      <SelectTrigger data-testid="select-destination">
                        <SelectValue placeholder="Select Destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {destinations.map((destination) => (
                          <SelectItem key={destination.id} value={destination.id}>
                            {destination.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Textarea
                      placeholder="Describe your trip plan..."
                      value={groupForm.description}
                      onChange={(e) => setGroupForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      data-testid="textarea-group-description"
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Start Date (e.g., Jun 15)"
                        value={groupForm.startDate}
                        onChange={(e) => setGroupForm(prev => ({ ...prev, startDate: e.target.value }))}
                        data-testid="input-start-date"
                      />
                      <Input
                        placeholder="End Date (e.g., Jun 22)"
                        value={groupForm.endDate}
                        onChange={(e) => setGroupForm(prev => ({ ...prev, endDate: e.target.value }))}
                        data-testid="input-end-date"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Max Members: {groupForm.maxMembers}
                        </label>
                        <Input
                          type="number"
                          min="2"
                          max="20"
                          value={groupForm.maxMembers}
                          onChange={(e) => setGroupForm(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
                          data-testid="input-max-members"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Budget per person: ₹{groupForm.budget.toLocaleString()}
                        </label>
                        <Input
                          type="number"
                          min="5000"
                          step="1000"
                          value={groupForm.budget}
                          onChange={(e) => setGroupForm(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                          data-testid="input-budget"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Activities (select all that apply)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {activities.map((activity) => (
                          <Button
                            key={activity}
                            type="button"
                            variant={groupForm.activities.includes(activity) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleActivity(activity)}
                            className="capitalize"
                            data-testid={`button-activity-${activity}`}
                          >
                            {activity}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <Textarea
                      placeholder="Any special requirements or preferences..."
                      value={groupForm.requirements}
                      onChange={(e) => setGroupForm(prev => ({ ...prev, requirements: e.target.value }))}
                      rows={2}
                      data-testid="textarea-requirements"
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-secondary text-white hover:bg-secondary/90" 
                      disabled={createGroupMutation.isPending}
                      data-testid="button-submit-group"
                    >
                      {createGroupMutation.isPending ? "Creating Group..." : "Create Travel Group"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Travel Groups */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4" data-testid="tabs-group-categories">
            <TabsTrigger value="all" data-testid="tab-all-groups">All Groups</TabsTrigger>
            <TabsTrigger value="open" data-testid="tab-open-groups">Open</TabsTrigger>
            <TabsTrigger value="trending" data-testid="tab-trending-groups">Trending</TabsTrigger>
            <TabsTrigger value="my-groups" data-testid="tab-my-groups">My Groups</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            {groupsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-muted/50 rounded-xl p-4 animate-pulse">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-muted rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded mb-1"></div>
                        <div className="h-3 bg-muted rounded w-3/4"></div>
                      </div>
                    </div>
                    <div className="h-3 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="font-semibold text-lg text-foreground mb-2" data-testid="text-no-groups">
                  No Travel Groups Found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Be the first to create a travel group for your dream destination!
                </p>
                <Button 
                  className="bg-secondary text-white hover:bg-secondary/90"
                  onClick={() => setIsCreateDialogOpen(true)}
                  data-testid="button-create-first-group"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Group
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.map((group) => (
                  <TravelGroupCard key={group.id} group={group} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="open" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.filter(group => group.status === "open" && group.currentMembers < group.maxMembers)
                .map((group) => (
                  <TravelGroupCard key={group.id} group={group} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.filter(group => group.currentMembers >= 2)
                .sort((a, b) => b.currentMembers - a.currentMembers)
                .map((group) => (
                  <TravelGroupCard key={group.id} group={group} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="my-groups" className="mt-8">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔐</div>
              <h3 className="font-semibold text-lg text-foreground mb-2">Sign In Required</h3>
              <p className="text-muted-foreground mb-6">
                Sign in to view and manage your travel groups.
              </p>
              <Button data-testid="button-sign-in-groups">
                Sign In
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Community Stats */}
        <Card className="mt-12 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4" data-testid="text-community-stats-title">
                Growing Travel Community
              </h2>
              <p className="text-muted-foreground">
                Join thousands of travelers who have found their perfect travel companions through WanderAI.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">150+</div>
                <div className="text-muted-foreground">Active Groups</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary mb-2">2.5K+</div>
                <div className="text-muted-foreground">Happy Travelers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-2">89%</div>
                <div className="text-muted-foreground">Successful Trips</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground mb-2">50+</div>
                <div className="text-muted-foreground">Destinations</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Tips */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-xl text-foreground mb-4" data-testid="text-safety-tips-title">
              🛡️ Safety & Community Guidelines
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-medium text-foreground mb-2">Meet Safely</h4>
                <p className="text-muted-foreground">
                  Always meet new travel companions in public places first and trust your instincts.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Verify Details</h4>
                <p className="text-muted-foreground">
                  Confirm trip details, costs, and accommodations before committing to join any group.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Stay Connected</h4>
                <p className="text-muted-foreground">
                  Keep emergency contacts informed about your travel plans and group members.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
