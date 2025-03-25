import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Lifehack categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(), // Icon class name
  color: text("color").notNull(), // Color for category
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  icon: true,
  color: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Lifehacks
export const lifehacks = pgTable("lifehacks", {
  id: serial("id").primaryKey(),
  title: text("title"),
  content: text("content").notNull(),
  date: timestamp("date").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  tags: text("tags").array(),
  image: text("image").notNull()
});

export const insertLifehackSchema = createInsertSchema(lifehacks).pick({
  title: true,
  content: true,
  date: true,
  categoryId: true,
  tags: true,
  image: true
});

export type InsertLifehack = z.infer<typeof insertLifehackSchema>;
export type Lifehack = typeof lifehacks.$inferSelect;

// Favorites
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  lifehackId: integer("lifehack_id").references(() => lifehacks.id),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertFavoriteSchema = createInsertSchema(favorites).pick({
  userId: true,
  lifehackId: true
});

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

// Define models for in-memory storage
export type CategoryModel = {
  id: number;
  name: string;
  icon: string;
  color: string;
};

export type LifehackModel = {
  id: number;
  title: string | null;
  content: string;
  date: Date;
  categoryId: number | null;
  tags: string[];
  image: string;
};

export type FavoriteModel = {
  id: number;
  userId: number;
  lifehackId: number;
  createdAt: Date;
};
