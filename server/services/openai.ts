import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export interface AIDestinationRecommendation {
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

export interface AIItineraryPlan {
  title: string;
  totalDuration: number;
  totalBudget: {
    min: number;
    max: number;
  };
  days: Array<{
    day: number;
    location: string;
    activities: Array<{
      time: string;
      activity: string;
      cost: number;
      description: string;
    }>;
    transportation: {
      method: string;
      cost: number;
      duration: string;
    };
    accommodation: {
      type: string;
      cost: number;
    };
  }>;
}

export async function getAIDestinationRecommendations(
  preferences: {
    activities: string[];
    budget?: { min: number; max: number };
    duration?: string;
    travelStyle?: string;
    location?: string;
  }
): Promise<AIDestinationRecommendation> {
  if (!openai) {
    throw new Error("OpenAI API key not configured");
  }
  try {
    const prompt = `You are a travel expert AI. Based on the following preferences, recommend the best travel destinations in India:

Activities interested in: ${preferences.activities.join(', ')}
Budget range: ₹${preferences.budget?.min || 1000}-${preferences.budget?.max || 10000} per day
Duration: ${preferences.duration || 'flexible'}
Travel style: ${preferences.travelStyle || 'adventurous'}
Preferred region: ${preferences.location || 'anywhere in India'}

Please provide 3-5 destination recommendations with:
- Name and exact location
- Match score (0-100) based on preferences
- Specific reasons why it matches their interests
- Best time to visit
- Estimated budget range per day
- Recommended duration
- Top activities available

Return the response in JSON format with the structure:
{
  "destinations": [
    {
      "name": "destination name",
      "location": "state, India",
      "matchScore": 95,
      "reasons": ["reason 1", "reason 2"],
      "bestTimeToVisit": "month range",
      "estimatedBudget": {"min": 2000, "max": 4000},
      "recommendedDuration": "5-7 days",
      "activities": ["activity1", "activity2"]
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as AIDestinationRecommendation;
  } catch (error) {
    console.error("AI recommendation error:", error);
    throw new Error("Failed to generate AI recommendations");
  }
}

export async function generateItinerary(
  destination: string,
  preferences: {
    duration: number;
    budget: { min: number; max: number };
    activities: string[];
    travelStyle?: string;
  }
): Promise<AIItineraryPlan> {
  if (!openai) {
    throw new Error("OpenAI API key not configured");
  }
  try {
    const prompt = `Create a detailed ${preferences.duration}-day itinerary for ${destination} with the following preferences:

Budget: ₹${preferences.budget.min}-${preferences.budget.max} per day
Activities: ${preferences.activities.join(', ')}
Travel Style: ${preferences.travelStyle || 'balanced adventure and culture'}

Provide a day-by-day breakdown including:
- Specific activities with timings
- Estimated costs for each activity
- Transportation between locations with costs and duration
- Accommodation recommendations with costs
- Local food and cultural experiences

Return in JSON format:
{
  "title": "itinerary title",
  "totalDuration": ${preferences.duration},
  "totalBudget": {"min": total_min, "max": total_max},
  "days": [
    {
      "day": 1,
      "location": "specific place",
      "activities": [
        {
          "time": "9:00 AM",
          "activity": "activity name",
          "cost": 500,
          "description": "detailed description"
        }
      ],
      "transportation": {
        "method": "taxi/bus/train",
        "cost": 300,
        "duration": "2 hours"
      },
      "accommodation": {
        "type": "hotel/guesthouse",
        "cost": 2500
      }
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as AIItineraryPlan;
  } catch (error) {
    console.error("AI itinerary generation error:", error);
    throw new Error("Failed to generate AI itinerary");
  }
}

export async function getCulturalInsights(destination: string): Promise<{
  culture: string;
  food: string;
  specialties: string[];
  localTips: string[];
}> {
  if (!openai) {
    throw new Error("OpenAI API key not configured");
  }
  try {
    const prompt = `Provide detailed cultural insights for ${destination} including:

1. Cultural background and heritage
2. Local food specialties and must-try dishes with specific restaurant/shop names and timings where possible
3. Unique specialties and hidden gems
4. Local tips to avoid tourist traps and have authentic experiences

Return in JSON format:
{
  "culture": "detailed cultural description",
  "food": "food culture and must-try dishes with specific places",
  "specialties": ["unique thing 1", "unique thing 2"],
  "localTips": ["tip 1", "tip 2", "tip 3"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("AI cultural insights error:", error);
    throw new Error("Failed to generate cultural insights");
  }
}
