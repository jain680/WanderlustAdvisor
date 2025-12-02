import type { NearbyPlace, NearbyHotel, NearbyRestaurant, TransportationOption, NearbyLocationData } from "@shared/schema";
import { randomUUID } from "crypto";

// Regional data for different parts of India
const regionalData = {
  north: {
    states: ["Punjab", "Haryana", "Himachal Pradesh", "Uttarakhand", "Uttar Pradesh", "Rajasthan", "Delhi"],
    placeSuffixes: ["Ghat", "Mandir", "Fort", "Palace", "Garden", "Bazaar", "Gate", "Chowk"],
    hotelPrefixes: ["Hotel", "Royal", "Heritage", "Palace", "Grand", "The", "Crown"],
    restaurantTypes: ["Dhaba", "Restaurant", "Punjabi", "Tandoor", "Mughlai"],
    localDishes: ["Dal Makhani", "Butter Chicken", "Naan", "Paratha", "Lassi", "Chole Bhature", "Rajma"],
    cuisines: ["North Indian", "Punjabi", "Mughlai", "Tandoor", "Chinese", "Continental"]
  },
  south: {
    states: ["Tamil Nadu", "Karnataka", "Kerala", "Andhra Pradesh", "Telangana"],
    placeSuffixes: ["Temple", "Kovil", "Palace", "Beach", "Hills", "Falls", "Backwaters"],
    hotelPrefixes: ["Hotel", "Resort", "Beach", "Heritage", "The", "Royal", "Paradise"],
    restaurantTypes: ["Restaurant", "Mess", "Hotel", "Udupi", "Chettinad"],
    localDishes: ["Dosa", "Idli", "Sambar", "Rasam", "Biryani", "Fish Curry", "Payasam", "Uttapam"],
    cuisines: ["South Indian", "Tamil", "Kerala", "Udupi", "Chettinad", "Andhra", "Hyderabadi"]
  },
  east: {
    states: ["West Bengal", "Odisha", "Jharkhand", "Bihar", "Assam", "Tripura"],
    placeSuffixes: ["Kali Mandir", "Ghat", "Bazaar", "Museum", "Park", "Bridge"],
    hotelPrefixes: ["Hotel", "The", "Royal", "Heritage", "Bengal", "Eastern"],
    restaurantTypes: ["Restaurant", "Bengali", "Fish", "Sweet Shop"],
    localDishes: ["Fish Curry", "Rice", "Mishti Doi", "Rosogolla", "Sandesh", "Hilsa", "Panta Bhat"],
    cuisines: ["Bengali", "Odia", "Assamese", "Chinese", "Mughlai"]
  },
  west: {
    states: ["Maharashtra", "Gujarat", "Goa", "Rajasthan"],
    placeSuffixes: ["Beach", "Fort", "Market", "Temple", "Gardens", "Chowpatty"],
    hotelPrefixes: ["Hotel", "Beach", "Sea", "Heritage", "The", "Royal", "Taj"],
    restaurantTypes: ["Restaurant", "Gujarati", "Maharashtrian", "Goan", "Seafood"],
    localDishes: ["Vada Pav", "Pav Bhaji", "Dhokla", "Thali", "Fish Curry", "Modak", "Puran Poli"],
    cuisines: ["Gujarati", "Maharashtrian", "Goan", "Rajasthani", "Street Food", "Seafood"]
  }
};

// Indian city names for different regions
const indianCityNames = [
  "Anandpur", "Suryapur", "Shantinagar", "Ramgarh", "Kamalpura", "Mayurbhanj", "Chandanpur",
  "Sukhdevpur", "Narsinghpur", "Rajendranagar", "Krishnapura", "Govindpur", "Balarampur",
  "Shivapur", "Ganeshnagar", "Lakshmipur", "Saraswatipur", "Hanumangarh", "Bhimpur"
];

// Generate place names based on region
const generatePlaceName = (region: string, type: string): string => {
  const regional = regionalData[region as keyof typeof regionalData];
  const suffixes = regional.placeSuffixes;
  const cityName = indianCityNames[Math.floor(Math.random() * indianCityNames.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  // Remove common suffix from city name if it exists and add new suffix
  const baseName = cityName.replace(/(pur|nagar|garh)$/, "");
  return `${baseName} ${suffix}`;
};

// Determine region based on coordinates (simplified)
const getRegionFromCoordinates = (lat: number, lng: number): string => {
  if (lat > 26) return "north";  // North India
  if (lat < 15) return "south";  // South India
  if (lng < 77) return "west";   // West India
  return "east";                 // East India
};

// Generate realistic Indian address
const generateAddress = (lat: number, lng: number): { address: string; city: string; state: string } => {
  const region = getRegionFromCoordinates(lat, lng);
  const regional = regionalData[region as keyof typeof regionalData];
  const state = regional.states[Math.floor(Math.random() * regional.states.length)];
  const city = indianCityNames[Math.floor(Math.random() * indianCityNames.length)];
  const areaName = generatePlaceName(region, "area").split(" ")[0];
  const streetNumber = Math.floor(Math.random() * 99) + 1;
  
  const address = `${streetNumber}, ${areaName} Road, Near ${generatePlaceName(region, "landmark")}`;
  
  return { address, city, state };
};

// Generate nearby places/attractions
const generateNearbyPlaces = (lat: number, lng: number, count: number = 8): NearbyPlace[] => {
  const region = getRegionFromCoordinates(lat, lng);
  const places: NearbyPlace[] = [];
  
  const placeTypes = ["temple", "monument", "park", "market", "viewpoint", "museum", "fort", "palace"];
  
  for (let i = 0; i < count; i++) {
    const offsetLat = lat + (Math.random() - 0.5) * 0.02; // ~1km radius
    const offsetLng = lng + (Math.random() - 0.5) * 0.02;
    const type = placeTypes[Math.floor(Math.random() * placeTypes.length)];
    const name = generatePlaceName(region, type);
    
    const place: NearbyPlace = {
      id: randomUUID(),
      name,
      type,
      latitude: offsetLat.toString(),
      longitude: offsetLng.toString(),
      description: generatePlaceDescription(name, type, region),
      imageUrl: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600`,
      rating: Math.floor(Math.random() * 21) + 30, // 3.0 - 5.0 rating (30-50)
      reviewCount: Math.floor(Math.random() * 500) + 50,
      entryFee: type === "temple" ? 0 : Math.floor(Math.random() * 200) + 50,
      openingHours: generateOpeningHours(type),
      specialFeatures: generateSpecialFeatures(type, region),
      bestTimeToVisit: generateBestTimeToVisit(type),
      localName: generateLocalName(name, region),
      culturalSignificance: generateCulturalSignificance(type, region),
      createdAt: new Date(),
    };
    
    places.push(place);
  }
  
  return places;
};

// Generate nearby hotels
const generateNearbyHotels = (lat: number, lng: number, count: number = 6): NearbyHotel[] => {
  const region = getRegionFromCoordinates(lat, lng);
  const regional = regionalData[region as keyof typeof regionalData];
  const hotels: NearbyHotel[] = [];
  
  const hotelTypes = ["hotel", "guesthouse", "resort", "homestay", "lodge"];
  
  for (let i = 0; i < count; i++) {
    const offsetLat = lat + (Math.random() - 0.5) * 0.015;
    const offsetLng = lng + (Math.random() - 0.5) * 0.015;
    const type = hotelTypes[Math.floor(Math.random() * hotelTypes.length)];
    const prefix = regional.hotelPrefixes[Math.floor(Math.random() * regional.hotelPrefixes.length)];
    const suffix = indianCityNames[Math.floor(Math.random() * indianCityNames.length)].split("").slice(-3).join("");
    const name = `${prefix} ${suffix}${type === "homestay" ? " Homestay" : type === "resort" ? " Resort" : ""}`;
    
    const basePrice = type === "resort" ? 3000 : type === "hotel" ? 1500 : type === "homestay" ? 800 : 1200;
    const price = basePrice + Math.floor(Math.random() * basePrice);
    
    const hotel: NearbyHotel = {
      id: randomUUID(),
      name,
      type,
      latitude: offsetLat.toString(),
      longitude: offsetLng.toString(),
      description: generateHotelDescription(name, type, region),
      imageUrl: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600`,
      pricePerNight: price,
      rating: Math.floor(Math.random() * 21) + 30,
      reviewCount: Math.floor(Math.random() * 300) + 25,
      amenities: generateHotelAmenities(type),
      roomTypes: generateRoomTypes(type),
      maxGuests: Math.floor(Math.random() * 4) + 2,
      checkInTime: "14:00",
      checkOutTime: "11:00",
      contactNumber: generatePhoneNumber(),
      available: Math.random() > 0.1, // 90% availability
      distanceFromCenter: (Math.random() * 3 + 0.5).toString(),
      createdAt: new Date(),
    };
    
    hotels.push(hotel);
  }
  
  return hotels;
};

// Generate nearby restaurants
const generateNearbyRestaurants = (lat: number, lng: number, count: number = 10): NearbyRestaurant[] => {
  const region = getRegionFromCoordinates(lat, lng);
  const regional = regionalData[region as keyof typeof regionalData];
  const restaurants: NearbyRestaurant[] = [];
  
  const restaurantTypes = ["restaurant", "dhaba", "street_food", "cafe", "sweet_shop", "local_eatery"];
  
  for (let i = 0; i < count; i++) {
    const offsetLat = lat + (Math.random() - 0.5) * 0.01;
    const offsetLng = lng + (Math.random() - 0.5) * 0.01;
    const type = restaurantTypes[Math.floor(Math.random() * restaurantTypes.length)];
    const restaurantType = regional.restaurantTypes[Math.floor(Math.random() * regional.restaurantTypes.length)];
    const suffix = indianCityNames[Math.floor(Math.random() * indianCityNames.length)].split("").slice(0, 4).join("");
    const name = `${suffix} ${restaurantType}`;
    
    const baseCost = type === "street_food" ? 200 : type === "dhaba" ? 400 : type === "cafe" ? 600 : 800;
    const cost = baseCost + Math.floor(Math.random() * baseCost);
    
    const restaurant: NearbyRestaurant = {
      id: randomUUID(),
      name,
      type,
      latitude: offsetLat.toString(),
      longitude: offsetLng.toString(),
      description: generateRestaurantDescription(name, type, region),
      imageUrl: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600`,
      cuisine: [regional.cuisines[Math.floor(Math.random() * regional.cuisines.length)]],
      specialties: regional.localDishes.slice(0, 3),
      averageCostForTwo: cost,
      rating: Math.floor(Math.random() * 21) + 30,
      reviewCount: Math.floor(Math.random() * 200) + 15,
      openingHours: generateRestaurantHours(type),
      veganFriendly: Math.random() > 0.6,
      localFavorite: Math.random() > 0.7,
      mustTryDishes: regional.localDishes.slice(0, 2),
      contactNumber: generatePhoneNumber(),
      createdAt: new Date(),
    };
    
    restaurants.push(restaurant);
  }
  
  return restaurants;
};

// Generate transportation options
const generateTransportationOptions = (lat: number, lng: number, count: number = 5): TransportationOption[] => {
  const transportation: TransportationOption[] = [];
  
  const transportTypes = ["auto_rickshaw", "taxi", "bus", "local_transport", "bike_rental"];
  
  for (let i = 0; i < count; i++) {
    const offsetLat = lat + (Math.random() - 0.5) * 0.008;
    const offsetLng = lng + (Math.random() - 0.5) * 0.008;
    const type = transportTypes[Math.floor(Math.random() * transportTypes.length)];
    
    const option: TransportationOption = {
      id: randomUUID(),
      type,
      latitude: offsetLat.toString(),
      longitude: offsetLng.toString(),
      name: generateTransportName(type),
      description: generateTransportDescription(type),
      priceRange: generatePriceRange(type),
      availability: generateAvailability(type),
      contactInfo: type !== "bus" ? generatePhoneNumber() : null,
      routes: generateRoutes(type),
      tips: generateTransportTips(type),
      bookingRequired: type === "taxi" || type === "bike_rental",
      createdAt: new Date(),
    };
    
    transportation.push(option);
  }
  
  return transportation;
};

// Helper functions for generating realistic descriptions and details
const generatePlaceDescription = (name: string, type: string, region: string): string => {
  const descriptions = {
    temple: `Ancient ${name} is a revered spiritual site known for its stunning architecture and peaceful atmosphere. Daily prayers and festivals attract devotees from across the region.`,
    monument: `Historic ${name} stands as a testament to India's rich heritage, featuring intricate carvings and remarkable craftsmanship from centuries past.`,
    park: `Beautiful ${name} offers a serene escape with lush greenery, walking trails, and scenic spots perfect for families and nature lovers.`,
    market: `Bustling ${name} is the heart of local commerce, offering everything from traditional handicrafts to fresh produce and local delicacies.`,
    viewpoint: `Scenic ${name} provides breathtaking panoramic views of the surrounding landscape, especially during sunrise and sunset.`,
    museum: `Fascinating ${name} showcases regional history, art, and culture through carefully curated exhibits and artifacts.`,
    fort: `Majestic ${name} is a well-preserved fortress that offers insights into India's military history and architectural brilliance.`,
    palace: `Grand ${name} exemplifies royal architecture with ornate decorations, sprawling courtyards, and historical significance.`
  };
  
  return descriptions[type as keyof typeof descriptions] || `Popular ${name} is a must-visit destination known for its cultural significance and beautiful surroundings.`;
};

const generateHotelDescription = (name: string, type: string, region: string): string => {
  const descriptions = {
    hotel: `Comfortable ${name} offers modern amenities and excellent service in the heart of the city. Popular among both business and leisure travelers.`,
    guesthouse: `Cozy ${name} provides a homely atmosphere with personalized service and local hospitality. Perfect for budget-conscious travelers.`,
    resort: `Luxurious ${name} features world-class facilities, spa services, and recreational activities in a stunning natural setting.`,
    homestay: `Authentic ${name} offers an intimate experience of local culture and traditional hospitality with home-cooked meals.`,
    lodge: `Simple yet comfortable ${name} provides basic amenities and clean accommodations for travelers seeking budget-friendly options.`
  };
  
  return descriptions[type as keyof typeof descriptions] || `Well-located ${name} offers comfortable accommodation with essential amenities for travelers.`;
};

const generateRestaurantDescription = (name: string, type: string, region: string): string => {
  const descriptions = {
    restaurant: `Popular ${name} serves authentic regional cuisine in a comfortable setting with excellent service and traditional recipes.`,
    dhaba: `Traditional ${name} offers hearty, home-style cooking popular with locals and truckers. Known for generous portions and authentic flavors.`,
    street_food: `Famous ${name} stall serves delicious street food favorites that locals have been enjoying for generations.`,
    cafe: `Trendy ${name} provides a relaxed atmosphere perfect for coffee, light meals, and socializing with friends.`,
    sweet_shop: `Renowned ${name} specializes in traditional sweets and snacks, using time-honored recipes and quality ingredients.`,
    local_eatery: `Beloved ${name} is a neighborhood favorite known for fresh ingredients, reasonable prices, and friendly service.`
  };
  
  return descriptions[type as keyof typeof descriptions] || `Local ${name} serves delicious food that represents the authentic flavors of the region.`;
};

// Additional helper functions
const generateOpeningHours = (type: string): string => {
  const hours = {
    temple: "5:00 AM - 8:00 PM",
    monument: "9:00 AM - 6:00 PM",
    park: "6:00 AM - 7:00 PM",
    market: "8:00 AM - 10:00 PM",
    viewpoint: "24 Hours",
    museum: "10:00 AM - 5:00 PM",
    fort: "9:00 AM - 6:00 PM",
    palace: "9:00 AM - 5:00 PM"
  };
  
  return hours[type as keyof typeof hours] || "9:00 AM - 6:00 PM";
};

const generateSpecialFeatures = (type: string, region: string): string[] => {
  const features: { [key: string]: string[] } = {
    temple: ["Ancient Architecture", "Daily Prayers", "Festival Celebrations", "Peaceful Environment"],
    monument: ["Historical Significance", "Architectural Marvel", "Photo Opportunities", "Guided Tours"],
    park: ["Nature Trails", "Family Friendly", "Picnic Areas", "Bird Watching"],
    market: ["Local Products", "Bargaining", "Street Food", "Cultural Experience"],
    viewpoint: ["Panoramic Views", "Sunset Point", "Photography", "Peaceful Atmosphere"],
    museum: ["Historical Artifacts", "Educational", "Guided Tours", "Cultural Learning"],
    fort: ["Historical Tours", "Architecture", "Panoramic Views", "Cultural Heritage"],
    palace: ["Royal Architecture", "Historical Tours", "Art Collections", "Cultural Heritage"]
  };
  
  return features[type] || ["Cultural Significance", "Historical Value", "Tourist Attraction"];
};

const generateBestTimeToVisit = (type: string): string => {
  if (type === "viewpoint") return "Early morning or evening for best views";
  if (type === "temple") return "Early morning for peaceful prayers";
  if (type === "market") return "Evening hours when most active";
  return "Anytime during operating hours";
};

const generateLocalName = (name: string, region: string): string => {
  const localPrefixes = {
    north: ["श्री", "गुरु", "राजा"],
    south: ["श्री", "स्वामी", "राजा"],
    east: ["श्री", "महा", "बाबा"],
    west: ["श्री", "छत्रपति", "राजा"]
  };
  
  const prefixes = localPrefixes[region as keyof typeof localPrefixes] || ["श्री"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  
  return `${prefix} ${name}`;
};

const generateCulturalSignificance = (type: string, region: string): string => {
  const significance: { [key: string]: string } = {
    temple: "This sacred site holds deep spiritual significance for the local community and has been a center of worship for centuries.",
    monument: "A testament to the architectural and cultural achievements of ancient Indian civilizations.",
    fort: "Represents the military heritage and strategic importance of the region throughout history.",
    palace: "Showcases the royal lifestyle and artistic patronage of former rulers.",
    market: "Traditional trading center that has preserved local commerce and cultural practices."
  };
  
  return significance[type] || "An important cultural landmark that reflects the heritage and traditions of the region.";
};

const generateHotelAmenities = (type: string): string[] => {
  const baseAmenities = ["Free Wi-Fi", "24/7 Front Desk", "Room Service"];
  const typeSpecific: { [key: string]: string[] } = {
    resort: ["Swimming Pool", "Spa", "Restaurant", "Gym", "Conference Hall"],
    hotel: ["Restaurant", "Business Center", "Parking", "Laundry"],
    homestay: ["Home-cooked Meals", "Local Tours", "Cultural Activities"],
    guesthouse: ["Common Kitchen", "Travel Assistance", "Luggage Storage"],
    lodge: ["Basic Amenities", "Shared Facilities", "Budget Friendly"]
  };
  
  return [...baseAmenities, ...(typeSpecific[type] || [])];
};

const generateRoomTypes = (type: string): string[] => {
  const types: { [key: string]: string[] } = {
    resort: ["Deluxe Room", "Suite", "Villa", "Premium Room"],
    hotel: ["Standard Room", "Deluxe Room", "Executive Room"],
    homestay: ["Private Room", "Shared Room", "Family Room"],
    guesthouse: ["Single Room", "Double Room", "Dormitory"],
    lodge: ["Basic Room", "Shared Room"]
  };
  
  return types[type] || ["Standard Room", "Deluxe Room"];
};

const generateRestaurantHours = (type: string): string => {
  const hours: { [key: string]: string } = {
    street_food: "6:00 PM - 11:00 PM",
    dhaba: "24 Hours",
    cafe: "8:00 AM - 10:00 PM",
    sweet_shop: "9:00 AM - 9:00 PM",
    restaurant: "11:00 AM - 11:00 PM",
    local_eatery: "7:00 AM - 10:00 PM"
  };
  
  return hours[type] || "11:00 AM - 10:00 PM";
};

const generateTransportName = (type: string): string => {
  const names: { [key: string]: string } = {
    auto_rickshaw: "Local Auto Stand",
    taxi: "City Taxi Service",
    bus: "Regional Bus Stop",
    local_transport: "Local Transport Hub",
    bike_rental: "Bike Rental Center"
  };
  
  return names[type] || "Transport Service";
};

const generateTransportDescription = (type: string): string => {
  const descriptions: { [key: string]: string } = {
    auto_rickshaw: "Convenient three-wheeler service for short to medium distance travel within the city.",
    taxi: "Comfortable car service for city tours and longer distances with experienced drivers.",
    bus: "Public transportation connecting to various parts of the city and nearby areas.",
    local_transport: "Local transportation hub offering various options for getting around the area.",
    bike_rental: "Self-drive bike rental service for exploring the area at your own pace."
  };
  
  return descriptions[type] || "Local transportation service";
};

const generatePriceRange = (type: string): string => {
  const ranges: { [key: string]: string } = {
    auto_rickshaw: "₹10-15 per km",
    taxi: "₹500-800 for city tour",
    bus: "₹5-20 per trip",
    local_transport: "₹10-50 per trip",
    bike_rental: "₹300-500 per day"
  };
  
  return ranges[type] || "₹20-100 per trip";
};

const generateAvailability = (type: string): string => {
  const availability: { [key: string]: string } = {
    auto_rickshaw: "6:00 AM - 11:00 PM",
    taxi: "24/7",
    bus: "5:00 AM - 10:00 PM",
    local_transport: "6:00 AM - 9:00 PM",
    bike_rental: "8:00 AM - 8:00 PM"
  };
  
  return availability[type] || "6:00 AM - 10:00 PM";
};

const generateRoutes = (type: string): string[] => {
  const routes: { [key: string]: string[] } = {
    auto_rickshaw: ["City Center", "Railway Station", "Bus Stand", "Market Area"],
    taxi: ["Airport", "Railway Station", "Tourist Places", "Hotels"],
    bus: ["City Center", "Outskirts", "Nearby Towns", "Transport Hub"],
    local_transport: ["Local Areas", "Nearby Villages", "Market", "Schools"],
    bike_rental: ["City Tour", "Nearby Attractions", "Scenic Routes"]
  };
  
  return routes[type] || ["Local Areas", "City Center"];
};

const generateTransportTips = (type: string): string[] => {
  const tips: { [key: string]: string[] } = {
    auto_rickshaw: ["Always ask for meter rate", "Negotiate fare beforehand", "Keep exact change"],
    taxi: ["Book through reliable operators", "Confirm rate before starting", "Ask for local driver recommendations"],
    bus: ["Check schedule in advance", "Keep exact change", "Validate ticket"],
    local_transport: ["Ask locals for best routes", "Be prepared for delays", "Keep small denominations"],
    bike_rental: ["Check bike condition", "Carry license", "Follow traffic rules", "Wear helmet"]
  };
  
  return tips[type] || ["Be polite", "Keep exact change", "Ask for recommendations"];
};

const generatePhoneNumber = (): string => {
  return `+91 ${Math.floor(Math.random() * 90000) + 70000}${Math.floor(Math.random() * 90000) + 10000}`;
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

// Validate coordinates
export const validateCoordinates = (lat: number, lng: number): boolean => {
  // India's approximate bounding box
  const indiaBounds = {
    north: 37.6,
    south: 6.4,
    east: 97.25,
    west: 68.7
  };
  
  return lat >= indiaBounds.south && lat <= indiaBounds.north && 
         lng >= indiaBounds.west && lng <= indiaBounds.east;
};

// Main function to generate nearby location data
export const generateNearbyLocationData = (latitude: number, longitude: number, radius: number = 5): NearbyLocationData => {
  const location = generateAddress(latitude, longitude);
  
  const places = generateNearbyPlaces(latitude, longitude, 8);
  const hotels = generateNearbyHotels(latitude, longitude, 6);
  const restaurants = generateNearbyRestaurants(latitude, longitude, 10);
  const transportation = generateTransportationOptions(latitude, longitude, 5);
  
  return {
    location: {
      latitude,
      longitude,
      address: location.address,
      city: location.city,
      state: location.state
    },
    places,
    hotels,
    restaurants,
    transportation,
    totalResults: {
      places: places.length,
      hotels: hotels.length,
      restaurants: restaurants.length,
      transportation: transportation.length
    }
  };
};