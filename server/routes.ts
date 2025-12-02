import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getAIDestinationRecommendations, generateItinerary, getCulturalInsights } from "./services/openai";
import { insertReviewSchema, insertTravelGroupSchema } from "@shared/schema";
import { validateCoordinates } from "./services/locationData";
import { z } from "zod";
export async function registerRoutes(app: Express): Promise<Server> {

  // Destinations
  app.get("/api/destinations", async (req, res) => {
    try {
      const destinations = await storage.getDestinations();
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destinations" });
    }
  });

  app.get("/api/destinations/:id", async (req, res) => {
    try {
      const destination = await storage.getDestination(req.params.id);
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }
      res.json(destination);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destination" });
    }
  });

  app.get("/api/destinations/search", async (req, res) => {
    try {
      const { query, activities } = req.query;
      const activityArray = activities ? (activities as string).split(",") : undefined;
      const destinations = await storage.searchDestinations(query as string || "", activityArray);
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to search destinations" });
    }
  });

  // AI-powered recommendations
  app.post("/api/ai/recommendations", async (req, res) => {
    try {
      const { activities, budget, duration, travelStyle, location } = req.body;
      const recommendations = await getAIDestinationRecommendations({
        activities: activities || [],
        budget,
        duration,
        travelStyle,
        location,
      });
      res.json(recommendations);
    } catch (error) {
      console.error("AI recommendations error:", error);
      res.status(500).json({ message: "Failed to generate AI recommendations" });
    }
  });

  app.post("/api/ai/itinerary", async (req, res) => {
    try {
      const { destination, duration, budget, activities, travelStyle } = req.body;
      const itinerary = await generateItinerary(destination, {
        duration,
        budget,
        activities: activities || [],
        travelStyle,
      });
      res.json(itinerary);
    } catch (error) {
      console.error("AI itinerary error:", error);
      res.status(500).json({ message: "Failed to generate itinerary" });
    }
  });

  app.get("/api/ai/cultural-insights/:destination", async (req, res) => {
    try {
      const insights = await getCulturalInsights(req.params.destination);
      res.json(insights);
    } catch (error) {
      console.error("AI cultural insights error:", error);
      res.status(500).json({ message: "Failed to get cultural insights" });
    }
  });

  // Accommodations
  app.get("/api/accommodations", async (req, res) => {
    try {
      const { destinationId } = req.query;
      const accommodations = await storage.getAccommodations(destinationId as string);
      res.json(accommodations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch accommodations" });
    }
  });

  // Reviews
  app.get("/api/reviews", async (req, res) => {
    try {
      const { destinationId } = req.query;
      const reviews = await storage.getReviews(destinationId as string);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      res.json(review);
    } catch (error) {
      res.status(400).json({ message: "Invalid review data" });
    }
  });

  // Travel Groups
  app.get("/api/travel-groups", async (req, res) => {
    try {
      const { destinationId } = req.query;
      const groups = await storage.getTravelGroups(destinationId as string);
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch travel groups" });
    }
  });

  app.get("/api/travel-groups/:id", async (req, res) => {
    try {
      const group = await storage.getTravelGroup(req.params.id);
      if (!group) {
        return res.status(404).json({ message: "Travel group not found" });
      }
      res.json(group);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch travel group" });
    }
  });

  app.post("/api/travel-groups", async (req, res) => {
    try {
      const validatedData = insertTravelGroupSchema.parse(req.body);
      const group = await storage.createTravelGroup(validatedData);
      res.json(group);
    } catch (error) {
      res.status(400).json({ message: "Invalid travel group data" });
    }
  });

  // Itineraries
  app.get("/api/itineraries", async (req, res) => {
    try {
      const { destinationId } = req.query;
      const itineraries = await storage.getItineraries(destinationId as string);
      res.json(itineraries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch itineraries" });
    }
  });

  // Local Pricing
  app.get("/api/local-pricing", async (req, res) => {
    try {
      const { destinationId } = req.query;
      const pricing = await storage.getLocalPricing(destinationId as string);
      res.json(pricing);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch local pricing" });
    }
  });

  // Location-based queries (for map functionality)
  const locationQuerySchema = z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    radius: z.number().min(0.5).max(20).optional().default(5), // 0.5 to 20 km radius
  });

  app.post("/api/locations/nearby", async (req, res) => {
    try {
      // Validate request body
      const validationResult = locationQuerySchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid coordinates provided",
          errors: validationResult.error.errors
        });
      }

      const { latitude, longitude, radius } = validationResult.data;

      // Validate that coordinates are within India's bounds
      if (!validateCoordinates(latitude, longitude)) {
        return res.status(400).json({ 
          message: "Coordinates must be within India's geographical bounds",
          provided: { latitude, longitude },
          hint: "India's approximate bounds: Latitude: 6.4°N to 37.6°N, Longitude: 68.7°E to 97.25°E"
        });
      }

      // Generate comprehensive location data
      const locationData = await storage.getNearbyLocationData(latitude, longitude, radius);
      
      res.json({
        success: true,
        message: `Found ${locationData.totalResults.places + locationData.totalResults.hotels + locationData.totalResults.restaurants + locationData.totalResults.transportation} locations within ${radius}km`,
        data: locationData,
        coordinates: { latitude, longitude, radius }
      });

    } catch (error) {
      console.error("Location data generation error:", error);
      res.status(500).json({ 
        message: "Failed to generate location data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
