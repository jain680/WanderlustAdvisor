import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, decimal, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const destinations = pgTable("destinations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  activities: text("activities").array().notNull(),
  bestTimeToVisit: text("best_time_to_visit").notNull(),
  averageBudgetMin: integer("average_budget_min").notNull(),
  averageBudgetMax: integer("average_budget_max").notNull(),
  idealDuration: text("ideal_duration").notNull(),
  rating: integer("rating").notNull().default(0), // stored as integer (0-50 for 0.0-5.0)
  reviewCount: integer("review_count").notNull().default(0),
  highlights: text("highlights").array().notNull(),
  culture: text("culture"),
  food: text("food"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const accommodations = pgTable("accommodations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // houseboat, resort, guesthouse, hotel
  destinationId: varchar("destination_id").references(() => destinations.id),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  pricePerNight: integer("price_per_night").notNull(),
  maxGuests: integer("max_guests").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  amenities: text("amenities").array().notNull(),
  rating: integer("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  available: boolean("available").notNull().default(true),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  destinationId: varchar("destination_id").references(() => destinations.id),
  userName: text("user_name").notNull(),
  userAvatar: text("user_avatar").notNull(),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment").notNull(),
  travelType: text("travel_type").notNull(), // solo, family, couple, friends
  visitDate: text("visit_date").notNull(),
  likes: integer("likes").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const travelGroups = pgTable("travel_groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  destinationId: varchar("destination_id").references(() => destinations.id),
  organizerName: text("organizer_name").notNull(),
  organizerAvatar: text("organizer_avatar").notNull(),
  description: text("description").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  maxMembers: integer("max_members").notNull(),
  currentMembers: integer("current_members").notNull().default(1),
  budget: integer("budget").notNull(),
  activities: text("activities").array().notNull(),
  requirements: text("requirements"),
  status: text("status").notNull().default("open"), // open, full, closed
  createdAt: timestamp("created_at").defaultNow(),
});

export const itineraries = pgTable("itineraries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  destinationId: varchar("destination_id").references(() => destinations.id),
  title: text("title").notNull(),
  duration: integer("duration").notNull(), // days
  totalCost: integer("total_cost").notNull(),
  activities: jsonb("activities").notNull(), // array of day-wise activities
  transportation: jsonb("transportation").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const localPricing = pgTable("local_pricing", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  destinationId: varchar("destination_id").references(() => destinations.id),
  category: text("category").notNull(), // transport, food, attractions, etc.
  item: text("item").notNull(),
  priceMin: integer("price_min").notNull(),
  priceMax: integer("price_max").notNull(),
  unit: text("unit").notNull(), // per km, per meal, per entry, etc.
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Location-based data models for map click functionality
export const nearbyPlaces = pgTable("nearby_places", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // temple, monument, park, market, viewpoint, museum, etc.
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  rating: integer("rating").notNull().default(0), // 0-50 for 0.0-5.0
  reviewCount: integer("review_count").notNull().default(0),
  entryFee: integer("entry_fee").default(0), // in rupees, 0 for free
  openingHours: text("opening_hours"),
  specialFeatures: text("special_features").array().notNull(),
  bestTimeToVisit: text("best_time_to_visit"),
  localName: text("local_name"), // name in local language
  culturalSignificance: text("cultural_significance"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const nearbyHotels = pgTable("nearby_hotels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // hotel, guesthouse, resort, homestay, dhaba, lodge
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  pricePerNight: integer("price_per_night").notNull(),
  rating: integer("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  amenities: text("amenities").array().notNull(),
  roomTypes: text("room_types").array().notNull(),
  maxGuests: integer("max_guests").notNull(),
  checkInTime: text("check_in_time").default("14:00"),
  checkOutTime: text("check_out_time").default("11:00"),
  contactNumber: text("contact_number"),
  available: boolean("available").notNull().default(true),
  distanceFromCenter: decimal("distance_from_center", { precision: 5, scale: 2 }), // km
  createdAt: timestamp("created_at").defaultNow(),
});

export const nearbyRestaurants = pgTable("nearby_restaurants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // restaurant, dhaba, street_food, cafe, sweet_shop, local_eatery
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  cuisine: text("cuisine").array().notNull(), // north_indian, south_indian, local, chinese, etc.
  specialties: text("specialties").array().notNull(),
  averageCostForTwo: integer("average_cost_for_two").notNull(),
  rating: integer("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  openingHours: text("opening_hours"),
  veganFriendly: boolean("vegan_friendly").notNull().default(false),
  localFavorite: boolean("local_favorite").notNull().default(false),
  mustTryDishes: text("must_try_dishes").array().notNull(),
  contactNumber: text("contact_number"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transportationOptions = pgTable("transportation_options", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // auto_rickshaw, taxi, bus, train, local_transport, bike_rental
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  name: text("name").notNull(), // station name, stand name, service name
  description: text("description").notNull(),
  priceRange: text("price_range").notNull(), // "₹10-15 per km", "₹500-800 for city tour"
  availability: text("availability").notNull(), // "24/7", "6 AM - 10 PM", etc.
  contactInfo: text("contact_info"),
  routes: text("routes").array(), // popular routes/destinations
  tips: text("tips").array(), // local tips for using this transport
  bookingRequired: boolean("booking_required").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true,
  createdAt: true,
});

export const insertAccommodationSchema = createInsertSchema(accommodations).omit({
  id: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertTravelGroupSchema = createInsertSchema(travelGroups).omit({
  id: true,
  createdAt: true,
});

export const insertItinerarySchema = createInsertSchema(itineraries).omit({
  id: true,
  createdAt: true,
});

export const insertLocalPricingSchema = createInsertSchema(localPricing).omit({
  id: true,
  lastUpdated: true,
});

export const insertNearbyPlaceSchema = createInsertSchema(nearbyPlaces).omit({
  id: true,
  createdAt: true,
});

export const insertNearbyHotelSchema = createInsertSchema(nearbyHotels).omit({
  id: true,
  createdAt: true,
});

export const insertNearbyRestaurantSchema = createInsertSchema(nearbyRestaurants).omit({
  id: true,
  createdAt: true,
});

export const insertTransportationOptionSchema = createInsertSchema(transportationOptions).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinations.$inferSelect;

export type InsertAccommodation = z.infer<typeof insertAccommodationSchema>;
export type Accommodation = typeof accommodations.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type InsertTravelGroup = z.infer<typeof insertTravelGroupSchema>;
export type TravelGroup = typeof travelGroups.$inferSelect;

export type InsertItinerary = z.infer<typeof insertItinerarySchema>;
export type Itinerary = typeof itineraries.$inferSelect;

export type InsertLocalPricing = z.infer<typeof insertLocalPricingSchema>;
export type LocalPricing = typeof localPricing.$inferSelect;

export type InsertNearbyPlace = z.infer<typeof insertNearbyPlaceSchema>;
export type NearbyPlace = typeof nearbyPlaces.$inferSelect;

export type InsertNearbyHotel = z.infer<typeof insertNearbyHotelSchema>;
export type NearbyHotel = typeof nearbyHotels.$inferSelect;

export type InsertNearbyRestaurant = z.infer<typeof insertNearbyRestaurantSchema>;
export type NearbyRestaurant = typeof nearbyRestaurants.$inferSelect;

export type InsertTransportationOption = z.infer<typeof insertTransportationOptionSchema>;
export type TransportationOption = typeof transportationOptions.$inferSelect;

// Location query interface for the API
export interface LocationQuery {
  latitude: number;
  longitude: number;
  radius?: number; // km, default 5
}

// Response interface for nearby locations API
export interface NearbyLocationData {
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
  };
  places: NearbyPlace[];
  hotels: NearbyHotel[];
  restaurants: NearbyRestaurant[];
  transportation: TransportationOption[];
  totalResults: {
    places: number;
    hotels: number;
    restaurants: number;
    transportation: number;
  };
}

// User types for authentication
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
