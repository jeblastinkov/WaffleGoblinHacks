import { 
  InsertUser, User, users,
  InsertLifehack, LifehackModel,
  InsertCategory, CategoryModel,
  InsertFavorite, FavoriteModel
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Categories
  getCategory(id: number): Promise<CategoryModel | undefined>;
  getAllCategories(): Promise<CategoryModel[]>;
  createCategory(category: Omit<InsertCategory, "id">): Promise<CategoryModel>;
  
  // Lifehacks
  getLifehack(id: number): Promise<LifehackModel | undefined>;
  getLifehackByDate(date: Date): Promise<LifehackModel | undefined>;
  getAllLifehacks(): Promise<LifehackModel[]>;
  getLifehacksByCategory(categoryId: number): Promise<LifehackModel[]>;
  createLifehack(lifehack: Omit<InsertLifehack, "id">): Promise<LifehackModel>;
  
  // Favorites
  getFavorite(id: number): Promise<FavoriteModel | undefined>;
  getFavoritesByUser(userId: number): Promise<FavoriteModel[]>;
  createFavorite(favorite: Omit<InsertFavorite, "id">): Promise<FavoriteModel>;
  deleteFavorite(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, CategoryModel>;
  private lifehacks: Map<number, LifehackModel>;
  private favorites: Map<number, FavoriteModel>;
  
  private userId: number;
  private categoryId: number;
  private lifehackId: number;
  private favoriteId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.lifehacks = new Map();
    this.favorites = new Map();
    
    this.userId = 1;
    this.categoryId = 1;
    this.lifehackId = 1;
    this.favoriteId = 1;
  }

  // === USERS ===
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // === CATEGORIES ===
  async getCategory(id: number): Promise<CategoryModel | undefined> {
    return this.categories.get(id);
  }
  
  async getAllCategories(): Promise<CategoryModel[]> {
    return Array.from(this.categories.values());
  }
  
  async createCategory(category: Omit<InsertCategory, "id">): Promise<CategoryModel> {
    const id = this.categoryId++;
    const newCategory: CategoryModel = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  // === LIFEHACKS ===
  async getLifehack(id: number): Promise<LifehackModel | undefined> {
    return this.lifehacks.get(id);
  }
  
  async getLifehackByDate(date: Date): Promise<LifehackModel | undefined> {
    // Compare dates by their UTC date string to ignore time differences
    const dateString = date.toISOString().split('T')[0];
    
    return Array.from(this.lifehacks.values()).find(lifehack => {
      const lifehackDateString = lifehack.date.toISOString().split('T')[0];
      return lifehackDateString === dateString;
    });
  }
  
  async getAllLifehacks(): Promise<LifehackModel[]> {
    // Return all lifehacks sorted by date (newest first)
    return Array.from(this.lifehacks.values())
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  
  async getLifehacksByCategory(categoryId: number): Promise<LifehackModel[]> {
    return Array.from(this.lifehacks.values())
      .filter(lifehack => lifehack.categoryId === categoryId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  
  async createLifehack(lifehack: Omit<InsertLifehack, "id">): Promise<LifehackModel> {
    const id = this.lifehackId++;
    const newLifehack: LifehackModel = { ...lifehack, id };
    this.lifehacks.set(id, newLifehack);
    return newLifehack;
  }
  
  // === FAVORITES ===
  async getFavorite(id: number): Promise<FavoriteModel | undefined> {
    return this.favorites.get(id);
  }
  
  async getFavoritesByUser(userId: number): Promise<FavoriteModel[]> {
    return Array.from(this.favorites.values())
      .filter(favorite => favorite.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async createFavorite(favorite: Omit<InsertFavorite, "id">): Promise<FavoriteModel> {
    const id = this.favoriteId++;
    const newFavorite: FavoriteModel = { 
      ...favorite, 
      id, 
      createdAt: new Date() 
    };
    this.favorites.set(id, newFavorite);
    return newFavorite;
  }
  
  async deleteFavorite(id: number): Promise<boolean> {
    return this.favorites.delete(id);
  }
}

export const storage = new MemStorage();
