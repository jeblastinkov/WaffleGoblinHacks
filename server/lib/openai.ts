import OpenAI from "openai";

// Check for API key
const apiKey = process.env.OPENAI_API_KEY || "";
if (!apiKey) {
  console.warn("Warning: OPENAI_API_KEY is not set. AI-generated lifehacks will not work.");
}

// Initialize OpenAI
const openai = new OpenAI({ 
  apiKey: apiKey 
});

interface LifehackResponse {
  content: string;
  category: string;
  tags: string[];
  image_prompt: string;
}

/**
 * Generate a daily lifehack using OpenAI GPT-4o
 */
export async function generateLifehack(): Promise<LifehackResponse> {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are the Waffle Goblin, a friendly and helpful creature who loves sharing practical lifehacks with humans. " +
            "Your tone is playful, friendly, and a bit quirky. You create useful, practical lifehacks that solve everyday problems. " +
            "Generate ONE unique, interesting, and practical lifehack that's easy to implement."
        },
        {
          role: "user",
          content: 
            "Generate a fun, practical lifehack. Respond with a JSON object containing: " +
            "1. content: The lifehack text (100-150 words max) " +
            "2. category: A single category (Kitchen, Home, Tech, Garden, Money, Health, Travel, or Cleaning) " +
            "3. tags: An array of 2-3 relevant tags " +
            "4. image_prompt: A short description for a simple image that represents this lifehack"
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 500
    });

    const resultText = response.choices[0].message.content;
    if (!resultText) {
      throw new Error("Empty response from OpenAI");
    }

    const result = JSON.parse(resultText) as LifehackResponse;
    return result;
    
  } catch (error) {
    console.error("Error generating lifehack:", error);
    
    // Return fallback content if API fails
    return {
      content: "Keep a dedicated 'lost items' box in your home. Whenever you find something out of place, put it there. Check this box first when you're looking for something missing.",
      category: "Home",
      tags: ["Organization", "Productivity"],
      image_prompt: "A small box labeled 'lost items' with miscellaneous household objects"
    };
  }
}

/**
 * Generate a simple image prompt for a lifehack
 */
export async function generateImagePrompt(lifehack: string): Promise<string> {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Generate a simple, concise image description for a lifehack. The description should be suitable for generating a small icon or illustration."
        },
        {
          role: "user",
          content: `Generate a simple image prompt for this lifehack: "${lifehack}". Keep it under 15 words.`
        }
      ],
      max_tokens: 50
    });

    return response.choices[0].message.content || "household items organized neatly";
  } catch (error) {
    console.error("Error generating image prompt:", error);
    return "household items organized neatly";
  }
}
