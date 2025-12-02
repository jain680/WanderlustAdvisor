import { type Destination, type InsertDestination, type Accommodation, type InsertAccommodation, type Review, type InsertReview, type TravelGroup, type InsertTravelGroup, type Itinerary, type InsertItinerary, type LocalPricing, type InsertLocalPricing, type NearbyPlace, type InsertNearbyPlace, type NearbyHotel, type InsertNearbyHotel, type NearbyRestaurant, type InsertNearbyRestaurant, type TransportationOption, type InsertTransportationOption, type NearbyLocationData, type User, type UpsertUser, destinations, accommodations, reviews, travelGroups, itineraries, localPricing, users } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, like, or, and, arrayOverlaps, arrayContains, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Destinations
  getDestinations(): Promise<Destination[]>;
  getDestination(id: string): Promise<Destination | undefined>;
  searchDestinations(query: string, activities?: string[]): Promise<Destination[]>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  
  // Accommodations
  getAccommodations(destinationId?: string): Promise<Accommodation[]>;
  createAccommodation(accommodation: InsertAccommodation): Promise<Accommodation>;
  
  // Reviews
  getReviews(destinationId?: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Travel Groups
  getTravelGroups(destinationId?: string): Promise<TravelGroup[]>;
  getTravelGroup(id: string): Promise<TravelGroup | undefined>;
  createTravelGroup(group: InsertTravelGroup): Promise<TravelGroup>;
  
  // Itineraries
  getItineraries(destinationId?: string): Promise<Itinerary[]>;
  createItinerary(itinerary: InsertItinerary): Promise<Itinerary>;
  
  // Local Pricing
  getLocalPricing(destinationId?: string): Promise<LocalPricing[]>;
  createLocalPricing(pricing: InsertLocalPricing): Promise<LocalPricing>;
  
  // Location-based queries (for map functionality)
  getNearbyLocationData(latitude: number, longitude: number, radius?: number): Promise<NearbyLocationData>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private destinations: Map<string, Destination> = new Map();
  private accommodations: Map<string, Accommodation> = new Map();
  private reviews: Map<string, Review> = new Map();
  private travelGroups: Map<string, TravelGroup> = new Map();
  private itineraries: Map<string, Itinerary> = new Map();
  private localPricing: Map<string, LocalPricing> = new Map();

  constructor() {
    this.initializeData();
  }

  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      id: userData.id!,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      createdAt: userData.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  private initializeData() {
    // Initialize with some sample destinations
    const kashmir: Destination = {
      id: "kashmir-1",
      name: "Kashmir Valley",
      location: "Jammu and Kashmir, India",
      description: "Paradise on Earth with snow-capped mountains, serene lakes, and vibrant culture. Perfect for trekking and spiritual experiences.",
      imageUrl: "https://images.unsplash.com/photo-1523978591478-c753949ff840?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      activities: ["trekking", "culture", "lakes", "mountains"],
      bestTimeToVisit: "April - June",
      averageBudgetMin: 2500,
      averageBudgetMax: 4000,
      idealDuration: "5-7 days",
      rating: 48, // 4.8 * 10
      reviewCount: 2300,
      highlights: ["Dal Lake", "Gulmarg", "Pahalgam", "Mughal Gardens"],
      culture: "Rich Kashmiri culture with influences from Central Asia, Persia and the Indian subcontinent",
      food: "Famous for Rogan Josh, Yakhni, Kahwa tea, and traditional Wazwan feast",
      createdAt: new Date(),
    };

    const goa: Destination = {
      id: "goa-1",
      name: "Goa",
      location: "Goa, India",
      description: "Tropical paradise with pristine beaches, vibrant nightlife, and Portuguese heritage. Perfect for relaxation and water adventures.",
      imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      activities: ["beaches", "water sports", "nightlife", "heritage"],
      bestTimeToVisit: "November - March",
      averageBudgetMin: 1800,
      averageBudgetMax: 3500,
      idealDuration: "3-5 days",
      rating: 46, // 4.6 * 10
      reviewCount: 5100,
      highlights: ["Baga Beach", "Old Goa", "Dudhsagar Falls", "Spice Plantations"],
      culture: "Unique blend of Indian and Portuguese cultures with vibrant festivals",
      food: "Famous for seafood curry, bebinca, feni, and Portuguese-inspired cuisine",
      createdAt: new Date(),
    };

    const himachal: Destination = {
      id: "himachal-1",
      name: "Himachal Pradesh",
      location: "Himachal Pradesh, India",
      description: "Land of gods with stunning mountain ranges, adventure sports, and serene hill stations. Paradise for trekkers and nature lovers.",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      activities: ["adventure", "trekking", "mountains", "skiing"],
      bestTimeToVisit: "March - June",
      averageBudgetMin: 2000,
      averageBudgetMax: 4500,
      idealDuration: "7-10 days",
      rating: 49, // 4.9 * 10
      reviewCount: 3800,
      highlights: ["Manali", "Shimla", "Dharamshala", "Spiti Valley"],
      culture: "Rich Himalayan culture with Buddhist and Hindu influences",
      food: "Famous for Dham, Chha Gosht, Madra, and local apple-based dishes",
      createdAt: new Date(),
    };

    this.destinations.set(kashmir.id, kashmir);
    this.destinations.set(goa.id, goa);
    this.destinations.set(himachal.id, himachal);

    // Sample accommodations
    const houseboatKashmir: Accommodation = {
      id: "acc-1",
      name: "Luxury Dal Lake Houseboat",
      type: "houseboat",
      destinationId: "kashmir-1",
      description: "Traditional Kashmiri houseboat with modern amenities",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      pricePerNight: 4500,
      maxGuests: 4,
      bedrooms: 2,
      amenities: ["Lake View", "Free Wi-Fi", "Breakfast", "Traditional Decor"],
      rating: 49,
      reviewCount: 156,
      available: true,
    };

    this.accommodations.set(houseboatKashmir.id, houseboatKashmir);

    // Sample reviews
    const review1: Review = {
      id: "rev-1",
      destinationId: "kashmir-1",
      userName: "Priya Sharma",
      userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      rating: 5,
      comment: "Kashmir exceeded all expectations! The AI recommendations were spot-on. Found amazing trekking routes that weren't overcrowded. The local cost estimates saved me from getting overcharged.",
      travelType: "Solo Traveler",
      visitDate: "May 2024",
      likes: 24,
      createdAt: new Date(),
    };

    this.reviews.set(review1.id, review1);

    // Sample travel groups
    const travelGroup1: TravelGroup = {
      id: "group-1",
      title: "Manali Trek Group",
      destinationId: "himachal-1",
      organizerName: "Rahul Gupta",
      organizerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      description: "Looking for 2 more members for an epic Manali trek",
      startDate: "Jun 15",
      endDate: "Jun 22",
      maxMembers: 5,
      currentMembers: 3,
      budget: 15000,
      activities: ["trekking", "camping"],
      requirements: "Basic fitness level required",
      status: "open",
      createdAt: new Date(),
    };

    this.travelGroups.set(travelGroup1.id, travelGroup1);

    // Sample local pricing
    const pricing1: LocalPricing = {
      id: "price-1",
      destinationId: "kashmir-1",
      category: "transport",
      item: "Auto Rickshaw",
      priceMin: 12,
      priceMax: 15,
      unit: "per km",
      lastUpdated: new Date(),
    };

    this.localPricing.set(pricing1.id, pricing1);
  }

  async getDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }

  async getDestination(id: string): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }

  async searchDestinations(query: string, activities?: string[]): Promise<Destination[]> {
    const allDestinations = Array.from(this.destinations.values());
    
    return allDestinations.filter(destination => {
      const matchesQuery = destination.name.toLowerCase().includes(query.toLowerCase()) ||
                          destination.location.toLowerCase().includes(query.toLowerCase()) ||
                          destination.description.toLowerCase().includes(query.toLowerCase());
      
      const matchesActivities = !activities || activities.length === 0 ||
                               activities.some(activity => destination.activities.includes(activity));
      
      return matchesQuery && matchesActivities;
    });
  }

  async createDestination(insertDestination: InsertDestination): Promise<Destination> {
    const id = randomUUID();
    const destination: Destination = {
      ...insertDestination,
      id,
      rating: insertDestination.rating ?? 0,
      reviewCount: insertDestination.reviewCount ?? 0,
      culture: insertDestination.culture ?? null,
      food: insertDestination.food ?? null,
      createdAt: new Date(),
    };
    this.destinations.set(id, destination);
    return destination;
  }

  async getAccommodations(destinationId?: string): Promise<Accommodation[]> {
    const accommodations = Array.from(this.accommodations.values());
    if (destinationId) {
      return accommodations.filter(acc => acc.destinationId === destinationId);
    }
    return accommodations;
  }

  async createAccommodation(insertAccommodation: InsertAccommodation): Promise<Accommodation> {
    const id = randomUUID();
    const accommodation: Accommodation = {
      ...insertAccommodation,
      id,
      rating: insertAccommodation.rating ?? 0,
      reviewCount: insertAccommodation.reviewCount ?? 0,
      destinationId: insertAccommodation.destinationId ?? null,
      available: insertAccommodation.available ?? true,
    };
    this.accommodations.set(id, accommodation);
    return accommodation;
  }

  async getReviews(destinationId?: string): Promise<Review[]> {
    const reviews = Array.from(this.reviews.values());
    if (destinationId) {
      return reviews.filter(review => review.destinationId === destinationId);
    }
    return reviews;
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = {
      ...insertReview,
      id,
      destinationId: insertReview.destinationId ?? null,
      likes: insertReview.likes ?? 0,
      createdAt: new Date(),
    };
    this.reviews.set(id, review);
    return review;
  }

  async getTravelGroups(destinationId?: string): Promise<TravelGroup[]> {
    const groups = Array.from(this.travelGroups.values());
    if (destinationId) {
      return groups.filter(group => group.destinationId === destinationId);
    }
    return groups;
  }

  async getTravelGroup(id: string): Promise<TravelGroup | undefined> {
    return this.travelGroups.get(id);
  }

  async createTravelGroup(insertGroup: InsertTravelGroup): Promise<TravelGroup> {
    const id = randomUUID();
    const group: TravelGroup = {
      ...insertGroup,
      id,
      destinationId: insertGroup.destinationId ?? null,
      status: insertGroup.status ?? 'open',
      currentMembers: insertGroup.currentMembers ?? 1,
      requirements: insertGroup.requirements ?? null,
      createdAt: new Date(),
    };
    this.travelGroups.set(id, group);
    return group;
  }

  async getItineraries(destinationId?: string): Promise<Itinerary[]> {
    const itineraries = Array.from(this.itineraries.values());
    if (destinationId) {
      return itineraries.filter(itinerary => itinerary.destinationId === destinationId);
    }
    return itineraries;
  }

  async createItinerary(insertItinerary: InsertItinerary): Promise<Itinerary> {
    const id = randomUUID();
    const itinerary: Itinerary = {
      ...insertItinerary,
      id,
      destinationId: insertItinerary.destinationId ?? null,
      createdAt: new Date(),
    };
    this.itineraries.set(id, itinerary);
    return itinerary;
  }

  async getLocalPricing(destinationId?: string): Promise<LocalPricing[]> {
    const pricing = Array.from(this.localPricing.values());
    if (destinationId) {
      return pricing.filter(price => price.destinationId === destinationId);
    }
    return pricing;
  }

  async createLocalPricing(insertPricing: InsertLocalPricing): Promise<LocalPricing> {
    const id = randomUUID();
    const pricing: LocalPricing = {
      ...insertPricing,
      id,
      destinationId: insertPricing.destinationId ?? null,
      lastUpdated: new Date(),
    };
    this.localPricing.set(id, pricing);
    return pricing;
  }

  async getNearbyLocationData(latitude: number, longitude: number, radius: number = 5): Promise<NearbyLocationData> {
    // Import and use the location data generation service
    const { generateNearbyLocationData } = await import("./services/locationData");
    return generateNearbyLocationData(latitude, longitude, radius);
  }
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Destinations
  async getDestinations(): Promise<Destination[]> {
    return await db.select().from(destinations);
  }

  async getDestination(id: string): Promise<Destination | undefined> {
    const [destination] = await db.select().from(destinations).where(eq(destinations.id, id));
    return destination || undefined;
  }

  async searchDestinations(query: string = "", activities?: string[]): Promise<Destination[]> {
    let whereCondition: any;
    
    if (query && activities && activities.length > 0) {
      whereCondition = and(
        or(
          like(destinations.name, `%${query}%`),
          like(destinations.description, `%${query}%`),
          like(destinations.location, `%${query}%`)
        ),
        // Check if any of the requested activities match using array overlap
        arrayOverlaps(destinations.activities, activities)
      );
    } else if (query) {
      whereCondition = or(
        like(destinations.name, `%${query}%`),
        like(destinations.description, `%${query}%`),
        like(destinations.location, `%${query}%`)
      );
    } else if (activities && activities.length > 0) {
      whereCondition = arrayOverlaps(destinations.activities, activities);
    }

    if (whereCondition) {
      return await db.select().from(destinations).where(whereCondition);
    }
    return await this.getDestinations();
  }

  async createDestination(destination: InsertDestination): Promise<Destination> {
    const [newDestination] = await db
      .insert(destinations)
      .values(destination)
      .returning();
    return newDestination;
  }

  // Accommodations
  async getAccommodations(destinationId?: string): Promise<Accommodation[]> {
    if (destinationId) {
      return await db.select().from(accommodations).where(eq(accommodations.destinationId, destinationId));
    }
    return await db.select().from(accommodations);
  }

  async createAccommodation(accommodation: InsertAccommodation): Promise<Accommodation> {
    const [newAccommodation] = await db
      .insert(accommodations)
      .values(accommodation)
      .returning();
    return newAccommodation;
  }

  // Reviews
  async getReviews(destinationId?: string): Promise<Review[]> {
    if (destinationId) {
      return await db.select().from(reviews).where(eq(reviews.destinationId, destinationId));
    }
    return await db.select().from(reviews);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db
      .insert(reviews)
      .values(review)
      .returning();
    return newReview;
  }

  // Travel Groups
  async getTravelGroups(destinationId?: string): Promise<TravelGroup[]> {
    if (destinationId) {
      return await db.select().from(travelGroups).where(eq(travelGroups.destinationId, destinationId));
    }
    return await db.select().from(travelGroups);
  }

  async getTravelGroup(id: string): Promise<TravelGroup | undefined> {
    const [group] = await db.select().from(travelGroups).where(eq(travelGroups.id, id));
    return group || undefined;
  }

  async createTravelGroup(group: InsertTravelGroup): Promise<TravelGroup> {
    const [newGroup] = await db
      .insert(travelGroups)
      .values(group)
      .returning();
    return newGroup;
  }

  // Itineraries
  async getItineraries(destinationId?: string): Promise<Itinerary[]> {
    if (destinationId) {
      return await db.select().from(itineraries).where(eq(itineraries.destinationId, destinationId));
    }
    return await db.select().from(itineraries);
  }

  async createItinerary(itinerary: InsertItinerary): Promise<Itinerary> {
    const [newItinerary] = await db
      .insert(itineraries)
      .values(itinerary)
      .returning();
    return newItinerary;
  }

  // Local Pricing
  async getLocalPricing(destinationId?: string): Promise<LocalPricing[]> {
    if (destinationId) {
      return await db.select().from(localPricing).where(eq(localPricing.destinationId, destinationId));
    }
    return await db.select().from(localPricing);
  }

  async createLocalPricing(pricing: InsertLocalPricing): Promise<LocalPricing> {
    const [newPricing] = await db
      .insert(localPricing)
      .values(pricing)
      .returning();
    return newPricing;
  }

  // Location-based queries (for map functionality)
  async getNearbyLocationData(latitude: number, longitude: number, radius: number = 5): Promise<NearbyLocationData> {
    // Import and use the location data generation service
    const { generateNearbyLocationData } = await import("./services/locationData");
    return generateNearbyLocationData(latitude, longitude, radius);
  }
}

// Initialize storage and seed database
let storage: IStorage;

async function initializeStorage(): Promise<IStorage> {
  try {
    const dbStorage = new DatabaseStorage();
    // Import and run seeding
    const { seedDatabase } = await import('./seed');
    await seedDatabase();
    return dbStorage;
  } catch (error) {
    console.warn("Database unavailable, using in-memory storage:", error);
    return new MemStorage();
  }
}

// Create storage instance
storage = new MemStorage(); // temporary fallback
initializeStorage().then(initializedStorage => {
  storage = initializedStorage;
  console.log('✅ Storage initialized successfully');
}).catch(error => {
  console.error('❌ Storage initialization failed:', error);
});

export { storage };
