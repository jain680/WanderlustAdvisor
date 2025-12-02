import { db } from "./db";
import { destinations, accommodations, reviews, travelGroups, localPricing } from "@shared/schema";

export async function seedDatabase() {
  try {
    console.log("🌱 Seeding database with initial data...");

    // Check if data already exists
    const existingDestinations = await db.select().from(destinations).limit(1);
    if (existingDestinations.length > 0) {
      console.log("Database already has data, skipping seed");
      return;
    }

    // Insert destinations
    const destinationData = [
      {
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
        rating: 48,
        reviewCount: 2300,
        highlights: ["Dal Lake", "Gulmarg", "Pahalgam", "Mughal Gardens"],
        culture: "Rich Kashmiri culture with influences from Central Asia, Persia and the Indian subcontinent",
        food: "Famous for Rogan Josh, Yakhni, Kahwa tea, and traditional Wazwan feast"
      },
      {
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
        rating: 46,
        reviewCount: 5100,
        highlights: ["Baga Beach", "Old Goa", "Dudhsagar Falls", "Spice Plantations"],
        culture: "Unique blend of Indian and Portuguese cultures with vibrant festivals",
        food: "Famous for seafood curry, bebinca, feni, and Portuguese-inspired cuisine"
      },
      {
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
        rating: 49,
        reviewCount: 3800,
        highlights: ["Manali", "Shimla", "Dharamshala", "Spiti Valley"],
        culture: "Rich Himalayan culture with Buddhist and Hindu influences",
        food: "Famous for Dham, Chha Gosht, Madra, and local apple-based dishes"
      }
    ];

    await db.insert(destinations).values(destinationData);

    // Insert accommodations
    await db.insert(accommodations).values([
      {
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
        available: true
      }
    ]);

    // Insert reviews
    await db.insert(reviews).values([
      {
        id: "rev-1",
        destinationId: "kashmir-1",
        userName: "Priya Sharma",
        userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        rating: 5,
        comment: "Kashmir exceeded all expectations! The AI recommendations were spot-on. Found amazing trekking routes that weren't overcrowded. The local cost estimates saved me from getting overcharged.",
        travelType: "Solo Traveler",
        visitDate: "May 2024",
        likes: 24
      }
    ]);

    // Insert travel groups
    await db.insert(travelGroups).values([
      {
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
        status: "open"
      }
    ]);

    // Insert local pricing
    await db.insert(localPricing).values([
      {
        id: "price-1",
        destinationId: "kashmir-1",
        category: "transport",
        item: "Auto Rickshaw",
        priceMin: 12,
        priceMax: 15,
        unit: "per km"
      }
    ]);

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}