import { useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L, { type LeafletMouseEvent } from 'leaflet';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  Map, Satellite, Layers, MapPin, Clock, Navigation, X, Star, MapPinIcon, 
  Building, UtensilsCrossed, Car, IndianRupee, Phone, Users, Bed, 
  Wifi, Camera, Clock2, Utensils, MapIcon, Info
} from "lucide-react";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ClickedLocation {
  lat: number;
  lng: number;
  timestamp: number;
}

interface MapViewProps {
  destination?: string;
}

// Types for location data from API
interface LocationData {
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
  };
  places: Array<{
    id: string;
    name: string;
    type: string;
    latitude: string;
    longitude: string;
    description: string;
    imageUrl: string;
    rating: number;
    reviewCount: number;
    entryFee: number | null;
    openingHours: string | null;
    specialFeatures: string[];
    bestTimeToVisit: string | null;
    localName: string | null;
    culturalSignificance: string | null;
  }>;
  hotels: Array<{
    id: string;
    name: string;
    type: string;
    latitude: string;
    longitude: string;
    description: string;
    imageUrl: string;
    pricePerNight: number;
    rating: number;
    reviewCount: number;
    amenities: string[];
    roomTypes: string[];
    maxGuests: number;
    checkInTime: string | null;
    checkOutTime: string | null;
    contactNumber: string | null;
    available: boolean;
    distanceFromCenter: string | null;
  }>;
  restaurants: Array<{
    id: string;
    name: string;
    type: string;
    latitude: string;
    longitude: string;
    description: string;
    imageUrl: string;
    cuisine: string[];
    specialties: string[];
    averageCostForTwo: number;
    rating: number;
    reviewCount: number;
    openingHours: string | null;
    veganFriendly: boolean;
    localFavorite: boolean;
    mustTryDishes: string[];
    contactNumber: string | null;
  }>;
  transportation: Array<{
    id: string;
    type: string;
    latitude: string;
    longitude: string;
    name: string;
    description: string;
    priceRange: string;
    availability: string;
    contactInfo: string | null;
    routes: string[] | null;
    tips: string[] | null;
    bookingRequired: boolean;
  }>;
  totalResults: {
    places: number;
    hotels: number;
    restaurants: number;
    transportation: number;
  };
}

interface LocationApiResponse {
  success: boolean;
  message: string;
  data: LocationData;
  coordinates: {
    latitude: number;
    longitude: number;
    radius: number;
  };
}

// Component for handling map click events
function MapClickHandler({ onLocationClick }: { onLocationClick: (location: ClickedLocation) => void }) {
  useMapEvents({
    click: (e: LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      onLocationClick({
        lat: parseFloat(lat.toFixed(6)),
        lng: parseFloat(lng.toFixed(6)),
        timestamp: Date.now()
      });
    },
  });
  return null;
}

// Helper function to render star rating
const StarRating = ({ rating, reviewCount }: { rating: number; reviewCount: number }) => {
  const stars = rating / 10; // Convert from 0-50 to 0-5
  const fullStars = Math.floor(stars);
  const hasHalfStar = stars % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < fullStars
                ? 'text-yellow-400 fill-yellow-400'
                : i === fullStars && hasHalfStar
                ? 'text-yellow-400 fill-yellow-400/50'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {stars.toFixed(1)} ({reviewCount})
      </span>
    </div>
  );
};

// Loading skeleton component
const LocationSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <div className="grid grid-cols-2 gap-4">
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
    </div>
    <Skeleton className="h-32 w-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

export default function MapView({ destination = "Kashmir" }: MapViewProps) {
  const [clickedLocations, setClickedLocations] = useState<ClickedLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<ClickedLocation | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');
  const [showLayers, setShowLayers] = useState(false);
  const { toast } = useToast();

  // Center on India coordinates
  const indiaCenter: [number, number] = [20.5937, 78.9629];
  
  // Generate sample location data for demo
  const generateSampleData = (lat: number, lng: number): LocationData => {
    const samplePlaces = [
      { id: '1', name: 'Ancient Temple', type: 'temple', latitude: String(lat + 0.01), longitude: String(lng + 0.01), description: 'A beautiful ancient temple with rich history', imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400', rating: 45, reviewCount: 234, entryFee: 0, openingHours: '6:00 AM - 8:00 PM', specialFeatures: ['Architecture', 'Peaceful'], bestTimeToVisit: 'Morning', localName: 'प्राचीन मंदिर', culturalSignificance: 'Important religious site' },
      { id: '2', name: 'City Park', type: 'park', latitude: String(lat - 0.01), longitude: String(lng + 0.02), description: 'Lush green park perfect for families', imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400', rating: 42, reviewCount: 156, entryFee: 20, openingHours: '5:00 AM - 9:00 PM', specialFeatures: ['Jogging Track', 'Playground'], bestTimeToVisit: 'Evening', localName: null, culturalSignificance: null },
      { id: '3', name: 'Heritage Fort', type: 'fort', latitude: String(lat + 0.02), longitude: String(lng - 0.01), description: 'Magnificent fort showcasing medieval architecture', imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400', rating: 48, reviewCount: 512, entryFee: 100, openingHours: '9:00 AM - 6:00 PM', specialFeatures: ['Panoramic Views', 'Museum'], bestTimeToVisit: 'Morning', localName: null, culturalSignificance: 'Historical landmark' },
    ];
    const sampleHotels = [
      { id: '1', name: 'Grand Palace Hotel', type: 'hotel', latitude: String(lat + 0.005), longitude: String(lng + 0.005), description: 'Luxury hotel with modern amenities', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', pricePerNight: 3500, rating: 44, reviewCount: 89, amenities: ['Free WiFi', 'Pool', 'Spa'], roomTypes: ['Deluxe', 'Suite'], maxGuests: 4, checkInTime: '14:00', checkOutTime: '11:00', contactNumber: '+91 98765 43210', available: true, distanceFromCenter: '0.5' },
      { id: '2', name: 'Budget Inn', type: 'guesthouse', latitude: String(lat - 0.005), longitude: String(lng - 0.005), description: 'Affordable stay with basic amenities', imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400', pricePerNight: 800, rating: 38, reviewCount: 45, amenities: ['Free WiFi', 'AC'], roomTypes: ['Standard'], maxGuests: 2, checkInTime: '12:00', checkOutTime: '10:00', contactNumber: '+91 87654 32109', available: true, distanceFromCenter: '1.2' },
    ];
    const sampleRestaurants = [
      { id: '1', name: 'Spice Garden', type: 'restaurant', latitude: String(lat + 0.003), longitude: String(lng - 0.003), description: 'Authentic Indian cuisine', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', cuisine: ['North Indian', 'Mughlai'], specialties: ['Butter Chicken', 'Biryani'], averageCostForTwo: 800, rating: 46, reviewCount: 234, openingHours: '11:00 AM - 11:00 PM', veganFriendly: true, localFavorite: true, mustTryDishes: ['Dal Makhani', 'Naan'], contactNumber: '+91 76543 21098' },
      { id: '2', name: 'Street Bites', type: 'street_food', latitude: String(lat - 0.003), longitude: String(lng + 0.003), description: 'Famous street food stall', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', cuisine: ['Street Food'], specialties: ['Chaat', 'Samosa'], averageCostForTwo: 200, rating: 44, reviewCount: 567, openingHours: '4:00 PM - 10:00 PM', veganFriendly: true, localFavorite: true, mustTryDishes: ['Pani Puri', 'Aloo Tikki'], contactNumber: null },
    ];
    const sampleTransport = [
      { id: '1', type: 'auto_rickshaw', latitude: String(lat), longitude: String(lng), name: 'Auto Rickshaw Stand', description: 'Local auto service for short trips', priceRange: '₹10-15 per km', availability: '6:00 AM - 11:00 PM', contactInfo: null, routes: ['Railway Station', 'Bus Stand', 'Market'], tips: ['Negotiate fare beforehand', 'Use meter'], bookingRequired: false },
      { id: '2', type: 'taxi', latitude: String(lat + 0.001), longitude: String(lng + 0.001), name: 'City Taxi Service', description: 'Comfortable taxi for city tours', priceRange: '₹500-1000 for city tour', availability: '24/7', contactInfo: '+91 65432 10987', routes: ['Airport', 'Tourist Places'], tips: ['Book in advance for long trips'], bookingRequired: true },
    ];
    
    return {
      location: { latitude: lat, longitude: lng, address: `Near Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`, city: 'Sample City', state: 'India' },
      places: samplePlaces,
      hotels: sampleHotels,
      restaurants: sampleRestaurants,
      transportation: sampleTransport,
      totalResults: { places: samplePlaces.length, hotels: sampleHotels.length, restaurants: sampleRestaurants.length, transportation: sampleTransport.length }
    };
  };

  // API mutation for fetching location data
  const fetchLocationDataMutation = useMutation({
    mutationFn: async ({ latitude, longitude }: { latitude: number; longitude: number }) => {
      const response = await apiRequest('POST', '/api/locations/nearby', {
        latitude,
        longitude,
        radius: 5
      });
      return response.json() as Promise<LocationApiResponse>;
    },
    onSuccess: (data) => {
      setLocationData(data.data);
      toast({
        title: "Location data loaded!",
        description: data.message,
      });
    },
    onError: (error, variables) => {
      console.error('Location data fetch error:', error);
      // Use sample data when API fails
      const sampleData = generateSampleData(variables.latitude, variables.longitude);
      setLocationData(sampleData);
      toast({
        title: "Showing sample data",
        description: "API unavailable. Displaying demo locations.",
      });
    }
  });

  const handleLocationClick = useCallback((location: ClickedLocation) => {
    setClickedLocations(prev => [...prev, location]);
    setSelectedLocation(location);
    setLocationData(null); // Clear previous data
    setIsModalOpen(true);
    
    // Fetch location data from API
    fetchLocationDataMutation.mutate({
      latitude: location.lat,
      longitude: location.lng
    });
  }, [fetchLocationDataMutation]);

  const handleMarkerClick = useCallback((location: ClickedLocation) => {
    setSelectedLocation(location);
    setLocationData(null); // Clear previous data
    setIsModalOpen(true);
    
    // Fetch location data from API
    fetchLocationDataMutation.mutate({
      latitude: location.lat,
      longitude: location.lng
    });
  }, [fetchLocationDataMutation]);

  const clearAllMarkers = useCallback(() => {
    setClickedLocations([]);
    setSelectedLocation(null);
    setLocationData(null);
    setIsModalOpen(false);
  }, []);

  const getTileLayerUrl = () => {
    return mapType === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  };

  const getTileLayerAttribution = () => {
    return mapType === 'satellite'
      ? '&copy; <a href="https://www.esri.com/">Esri</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  };

  return (
    <Card className="shadow-lg" data-testid="map-view-container">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-card-foreground" data-testid="text-map-title">
            Interactive Map - Click anywhere to explore
          </h3>
          <div className="flex space-x-2">
            <Button 
              variant={mapType === 'street' ? 'default' : 'outline'} 
              size="icon" 
              onClick={() => setMapType('street')}
              data-testid="button-map-view"
            >
              <Map className="h-4 w-4" />
            </Button>
            <Button 
              variant={mapType === 'satellite' ? 'default' : 'outline'} 
              size="icon" 
              onClick={() => setMapType('satellite')}
              data-testid="button-satellite-view"
            >
              <Satellite className="h-4 w-4" />
            </Button>
            <Button 
              variant={showLayers ? 'default' : 'outline'} 
              size="icon" 
              onClick={() => setShowLayers(!showLayers)}
              data-testid="button-layers"
            >
              <Layers className="h-4 w-4" />
            </Button>
            {clickedLocations.length > 0 && (
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={clearAllMarkers}
                data-testid="button-clear-markers"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="h-96 rounded-xl overflow-hidden border border-border" data-testid="map-container">
          <MapContainer
            center={indiaCenter}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
            className="rounded-xl"
          >
            <TileLayer
              url={getTileLayerUrl()}
              attribution={getTileLayerAttribution()}
            />
            
            <MapClickHandler onLocationClick={handleLocationClick} />
            
            {clickedLocations.map((location) => (
              <Marker
                key={location.timestamp}
                position={[location.lat, location.lng]}
                eventHandlers={{
                  click: () => handleMarkerClick(location),
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <p><strong>Coordinates:</strong></p>
                    <p>Lat: {location.lat}</p>
                    <p>Lng: {location.lng}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Clicked: {new Date(location.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        
        {showLayers && (
          <div className="mt-3 p-3 bg-muted rounded-lg">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Layers className="h-4 w-4 mr-2" />
              Map Layers & Info
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                {mapType === 'street' ? 'Street View' : 'Satellite View'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {clickedLocations.length} locations marked
              </Badge>
              <Badge variant="outline" className="text-xs">
                Zoom to explore
              </Badge>
            </div>
          </div>
        )}
        
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="mr-2 text-primary h-4 w-4" />
            <span data-testid="text-clicked-locations">
              Clicked locations: <span className="font-medium">{clickedLocations.length}</span>
            </span>
          </div>
          <div className="flex items-center">
            <Navigation className="mr-2 text-secondary h-4 w-4" />
            <span data-testid="text-map-info">Click anywhere on the map to explore</span>
          </div>
        </div>
      </CardContent>
      
      {/* Enhanced Location Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden" data-testid="location-modal">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              {locationData ? locationData.location.city : 'Location'} Details
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden">
            {fetchLocationDataMutation.isPending ? (
              <LocationSkeleton />
            ) : selectedLocation ? (
              <div className="space-y-4">
                {/* Basic Location Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Latitude</label>
                    <p className="text-lg font-mono" data-testid="text-latitude">{selectedLocation.lat}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Longitude</label>
                    <p className="text-lg font-mono" data-testid="text-longitude">{selectedLocation.lng}</p>
                  </div>
                </div>

                {locationData && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Address</span>
                      <MapIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm" data-testid="text-location-address">
                      {locationData.location.address}, {locationData.location.city}, {locationData.location.state}
                    </p>
                  </div>
                )}

                {/* Location Data Tabs */}
                {locationData && (
                  <Tabs defaultValue="places" className="flex-1">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="places" className="flex items-center gap-1" data-testid="tab-places">
                        <MapPinIcon className="h-4 w-4" />
                        Places ({locationData.totalResults.places})
                      </TabsTrigger>
                      <TabsTrigger value="hotels" className="flex items-center gap-1" data-testid="tab-hotels">
                        <Building className="h-4 w-4" />
                        Hotels ({locationData.totalResults.hotels})
                      </TabsTrigger>
                      <TabsTrigger value="restaurants" className="flex items-center gap-1" data-testid="tab-restaurants">
                        <UtensilsCrossed className="h-4 w-4" />
                        Food ({locationData.totalResults.restaurants})
                      </TabsTrigger>
                      <TabsTrigger value="transport" className="flex items-center gap-1" data-testid="tab-transport">
                        <Car className="h-4 w-4" />
                        Transport ({locationData.totalResults.transportation})
                      </TabsTrigger>
                    </TabsList>

                    <ScrollArea className="h-96 mt-4">
                      {/* Places Tab */}
                      <TabsContent value="places" className="space-y-4" data-testid="content-places">
                        {locationData.places.map((place) => (
                          <Card key={place.id} className="overflow-hidden" data-testid={`card-place-${place.id}`}>
                            <div className="flex">
                              <div className="w-24 h-24 bg-muted">
                                <img 
                                  src={place.imageUrl} 
                                  alt={place.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150`;
                                  }}
                                />
                              </div>
                              <div className="flex-1 p-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold" data-testid={`text-place-name-${place.id}`}>{place.name}</h4>
                                    <Badge variant="outline" className="text-xs mt-1">{place.type}</Badge>
                                  </div>
                                  {place.entryFee !== null && (
                                    <div className="text-right">
                                      <div className="flex items-center text-sm font-medium">
                                        <IndianRupee className="h-3 w-3" />
                                        {place.entryFee === 0 ? 'Free' : place.entryFee}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <StarRating rating={place.rating} reviewCount={place.reviewCount} />
                                <p className="text-sm text-muted-foreground mt-2">{place.description}</p>
                                {place.openingHours && (
                                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                    <Clock2 className="h-3 w-3" />
                                    {place.openingHours}
                                  </div>
                                )}
                                {place.specialFeatures && place.specialFeatures.length > 0 && (
                                  <div className="flex gap-1 mt-2 flex-wrap">
                                    {place.specialFeatures.slice(0, 3).map((feature, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">{feature}</Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </TabsContent>

                      {/* Hotels Tab */}
                      <TabsContent value="hotels" className="space-y-4" data-testid="content-hotels">
                        {locationData.hotels.map((hotel) => (
                          <Card key={hotel.id} className="overflow-hidden" data-testid={`card-hotel-${hotel.id}`}>
                            <div className="flex">
                              <div className="w-24 h-24 bg-muted">
                                <img 
                                  src={hotel.imageUrl} 
                                  alt={hotel.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150`;
                                  }}
                                />
                              </div>
                              <div className="flex-1 p-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold" data-testid={`text-hotel-name-${hotel.id}`}>{hotel.name}</h4>
                                    <Badge variant="outline" className="text-xs mt-1">{hotel.type}</Badge>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center text-lg font-bold">
                                      <IndianRupee className="h-4 w-4" />
                                      {hotel.pricePerNight}
                                    </div>
                                    <span className="text-xs text-muted-foreground">per night</span>
                                  </div>
                                </div>
                                <StarRating rating={hotel.rating} reviewCount={hotel.reviewCount} />
                                <p className="text-sm text-muted-foreground mt-2">{hotel.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {hotel.maxGuests} guests
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Bed className="h-3 w-3" />
                                    {hotel.roomTypes[0]}
                                  </div>
                                  {hotel.contactNumber && (
                                    <div className="flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      Contact
                                    </div>
                                  )}
                                </div>
                                {hotel.amenities && hotel.amenities.length > 0 && (
                                  <div className="flex gap-1 mt-2 flex-wrap">
                                    {hotel.amenities.slice(0, 4).map((amenity, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">{amenity}</Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </TabsContent>

                      {/* Restaurants Tab */}
                      <TabsContent value="restaurants" className="space-y-4" data-testid="content-restaurants">
                        {locationData.restaurants.map((restaurant) => (
                          <Card key={restaurant.id} className="overflow-hidden" data-testid={`card-restaurant-${restaurant.id}`}>
                            <div className="flex">
                              <div className="w-24 h-24 bg-muted">
                                <img 
                                  src={restaurant.imageUrl} 
                                  alt={restaurant.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150`;
                                  }}
                                />
                              </div>
                              <div className="flex-1 p-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold" data-testid={`text-restaurant-name-${restaurant.id}`}>{restaurant.name}</h4>
                                    <div className="flex gap-1 mt-1">
                                      <Badge variant="outline" className="text-xs">{restaurant.type}</Badge>
                                      {restaurant.localFavorite && <Badge variant="secondary" className="text-xs">Local Favorite</Badge>}
                                      {restaurant.veganFriendly && <Badge variant="secondary" className="text-xs">Vegan</Badge>}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center text-lg font-bold">
                                      <IndianRupee className="h-4 w-4" />
                                      {restaurant.averageCostForTwo}
                                    </div>
                                    <span className="text-xs text-muted-foreground">for two</span>
                                  </div>
                                </div>
                                <StarRating rating={restaurant.rating} reviewCount={restaurant.reviewCount} />
                                <p className="text-sm text-muted-foreground mt-2">{restaurant.description}</p>
                                {restaurant.openingHours && (
                                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                    <Clock2 className="h-3 w-3" />
                                    {restaurant.openingHours}
                                  </div>
                                )}
                                <div className="flex gap-1 mt-2 flex-wrap">
                                  {restaurant.cuisine.map((cuisine, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">{cuisine}</Badge>
                                  ))}
                                  {restaurant.mustTryDishes.slice(0, 2).map((dish, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">{dish}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </TabsContent>

                      {/* Transportation Tab */}
                      <TabsContent value="transport" className="space-y-4" data-testid="content-transport">
                        {locationData.transportation.map((transport) => (
                          <Card key={transport.id} className="p-4" data-testid={`card-transport-${transport.id}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Car className="h-5 w-5 text-primary" />
                                  <h4 className="font-semibold" data-testid={`text-transport-name-${transport.id}`}>{transport.name}</h4>
                                  <Badge variant="outline" className="text-xs">{transport.type.replace('_', ' ')}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">{transport.description}</p>
                                <div className="grid grid-cols-2 gap-4 mt-3">
                                  <div>
                                    <span className="text-xs font-medium text-muted-foreground">Price Range</span>
                                    <p className="text-sm font-medium">{transport.priceRange}</p>
                                  </div>
                                  <div>
                                    <span className="text-xs font-medium text-muted-foreground">Availability</span>
                                    <p className="text-sm font-medium">{transport.availability}</p>
                                  </div>
                                </div>
                                {transport.routes && transport.routes.length > 0 && (
                                  <div className="mt-3">
                                    <span className="text-xs font-medium text-muted-foreground">Popular Routes</span>
                                    <div className="flex gap-1 mt-1 flex-wrap">
                                      {transport.routes.slice(0, 4).map((route, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-xs">{route}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {transport.tips && transport.tips.length > 0 && (
                                  <div className="mt-3">
                                    <span className="text-xs font-medium text-muted-foreground">Tips</span>
                                    <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                                      {transport.tips.slice(0, 2).map((tip, idx) => (
                                        <li key={idx}>• {tip}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                {transport.bookingRequired && (
                                  <Badge variant="destructive" className="text-xs">Booking Required</Badge>
                                )}
                                {transport.contactInfo && (
                                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                    <Phone className="h-3 w-3" />
                                    Contact
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </TabsContent>
                    </ScrollArea>
                  </Tabs>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigator.clipboard.writeText(`${selectedLocation.lat}, ${selectedLocation.lng}`)}
                    data-testid="button-copy-coordinates"
                  >
                    Copy Coordinates
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsModalOpen(false)}
                    data-testid="button-close-modal"
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}