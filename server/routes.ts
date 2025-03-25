import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateLifehack } from "./lib/openai";
import { z } from "zod";
import { getTodayDate, getPreviousDays } from "../client/src/lib/dates";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize with default categories if empty
  await initializeDefaultData();

  // === LIFEHACK ROUTES ===
  
  // Get today's lifehack
  app.get("/api/lifehacks/today", async (req, res) => {
    try {
      const today = getTodayDate();
      let todayLifehack = await storage.getLifehackByDate(today);
      
      // If no lifehack exists for today, generate one
      if (!todayLifehack) {
        const generatedLifehack = await generateLifehack();
        
        todayLifehack = await storage.createLifehack({
          title: null,
          content: generatedLifehack.content,
          date: today,
          categoryId: await getCategoryIdByName(generatedLifehack.category),
          tags: generatedLifehack.tags,
          image: `https://source.unsplash.com/random/250x250/?${encodeURIComponent(generatedLifehack.image_prompt)}`
        });
      }
      
      res.json(todayLifehack);
    } catch (error) {
      console.error("Error fetching today's lifehack:", error);
      res.status(500).json({ message: "Failed to fetch today's lifehack" });
    }
  });
  
  // Get previous lifehacks (default last 7 days excluding today)
  app.get("/api/lifehacks/previous", async (req, res) => {
    try {
      const days = Number(req.query.days) || 7;
      const previousDays = getPreviousDays(days);
      
      const lifehacks = await Promise.all(
        previousDays.map(date => storage.getLifehackByDate(date))
      );
      
      // Filter out nulls (days without lifehacks)
      const validLifehacks = lifehacks.filter(Boolean);
      
      res.json(validLifehacks);
    } catch (error) {
      console.error("Error fetching previous lifehacks:", error);
      res.status(500).json({ message: "Failed to fetch previous lifehacks" });
    }
  });
  
  // Get all lifehacks
  app.get("/api/lifehacks/all", async (req, res) => {
    try {
      const lifehacks = await storage.getAllLifehacks();
      res.json(lifehacks);
    } catch (error) {
      console.error("Error fetching all lifehacks:", error);
      res.status(500).json({ message: "Failed to fetch all lifehacks" });
    }
  });
  
  // Get lifehack by ID
  app.get("/api/lifehacks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const lifehack = await storage.getLifehack(id);
      
      if (!lifehack) {
        return res.status(404).json({ message: "Lifehack not found" });
      }
      
      res.json(lifehack);
    } catch (error) {
      console.error("Error fetching lifehack:", error);
      res.status(500).json({ message: "Failed to fetch lifehack" });
    }
  });
  
  // Get lifehacks by category
  app.get("/api/lifehacks/category/:categoryId", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const lifehacks = await storage.getLifehacksByCategory(categoryId);
      res.json(lifehacks);
    } catch (error) {
      console.error("Error fetching lifehacks by category:", error);
      res.status(500).json({ message: "Failed to fetch lifehacks by category" });
    }
  });
  
  // === CATEGORY ROUTES ===
  
  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  
  // Get category by ID
  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategory(id);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to initialize default data
async function initializeDefaultData() {
  // Add default categories if they don't exist
  const categories = await storage.getAllCategories();
  
  if (categories.length === 0) {
    const defaultCategories = [
      { name: "Kitchen", icon: "ri-restaurant-line", color: "#5AE053" },
      { name: "Home", icon: "ri-home-line", color: "#8A2B43" },
      { name: "Tech", icon: "ri-computer-line", color: "#3E2844" },
      { name: "Garden", icon: "ri-plant-line", color: "#FFC0CB" },
      { name: "Money", icon: "ri-money-dollar-circle-line", color: "#FFD700" },
      { name: "Health", icon: "ri-heart-pulse-line", color: "#FF6347" },
      { name: "Travel", icon: "ri-suitcase-line", color: "#87CEEB" },
      { name: "Cleaning", icon: "ri-brush-line", color: "#20B2AA" }
    ];
    
    for (const category of defaultCategories) {
      await storage.createCategory(category);
    }
  }
  
  // Add sample lifehacks if there are none
  const lifehacks = await storage.getAllLifehacks();
  
  if (lifehacks.length === 0) {
    // Get category IDs for sample lifehacks
    const kitchenId = await getCategoryIdByName("Kitchen");
    const homeId = await getCategoryIdByName("Home");
    const techId = await getCategoryIdByName("Tech");
    
    // Create sample lifehacks for past days
    const today = getTodayDate();
    const previousDays = getPreviousDays(3);
    
    const sampleLifehacks = [
      {
        title: null,
        content: "Use an ice cube tray to freeze herbs in olive oil. This way, you'll have pre-portioned herb-infused oil ready for cooking anytime!",
        date: previousDays[0],
        categoryId: kitchenId,
        tags: ["Kitchen", "Cooking"],
        image: "https://source.unsplash.com/random/250x250/?herbs,oil,ice,tray"
      },
      {
        title: null,
        content: "Use a binder clip to organize charging cables on your desk. Clip it to the edge and thread cables through.",
        date: previousDays[1],
        categoryId: homeId,
        tags: ["Office", "Organization"],
        image: "https://source.unsplash.com/random/250x250/?desk,cable,organizer"
      },
      {
        title: null,
        content: "Place a wooden spoon across a pot of boiling water to prevent it from boiling over. It breaks the surface tension of bubbles.",
        date: previousDays[2],
        categoryId: kitchenId,
        tags: ["Kitchen", "Cooking"],
        image: "https://source.unsplash.com/random/250x250/?pot,cooking,wooden,spoon"
      }
    ];
    
    for (const lifehack of sampleLifehacks) {
      await storage.createLifehack(lifehack);
    }
  }
}

// Helper function to get category ID by name
async function getCategoryIdByName(name: string): Promise<number | null> {
  const categories = await storage.getAllCategories();
  const category = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
  return category ? category.id : null;
}
