import { 
  type User, 
  type InsertUser,
  type Category,
  type InsertCategory,
  type Standard,
  type InsertStandard,
  type Hotspot,
  type InsertHotspot,
  users,
  categories,
  standards,
  hotspots
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<void>;

  // Standard methods
  getAllStandards(): Promise<Standard[]>;
  getStandardsByCategory(categoryId: number): Promise<Standard[]>;
  getStandard(id: number): Promise<Standard | undefined>;
  createStandard(standard: InsertStandard): Promise<Standard>;
  updateStandard(id: number, standard: Partial<InsertStandard>): Promise<Standard | undefined>;
  deleteStandard(id: number): Promise<void>;

  // Hotspot methods
  getAllHotspots(): Promise<Hotspot[]>;
  getHotspot(id: number): Promise<Hotspot | undefined>;
  createHotspot(hotspot: InsertHotspot): Promise<Hotspot>;
  updateHotspot(id: number, hotspot: Partial<InsertHotspot>): Promise<Hotspot | undefined>;
  deleteHotspot(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [created] = await db.insert(categories).values(category).returning();
    return created;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updated] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Standard methods
  async getAllStandards(): Promise<Standard[]> {
    return await db.select().from(standards);
  }

  async getStandardsByCategory(categoryId: number): Promise<Standard[]> {
    return await db.select().from(standards).where(eq(standards.categoryId, categoryId));
  }

  async getStandard(id: number): Promise<Standard | undefined> {
    const [standard] = await db.select().from(standards).where(eq(standards.id, id));
    return standard || undefined;
  }

  async createStandard(standard: InsertStandard): Promise<Standard> {
    const [created] = await db.insert(standards).values(standard).returning();
    return created;
  }

  async updateStandard(id: number, standard: Partial<InsertStandard>): Promise<Standard | undefined> {
    const [updated] = await db
      .update(standards)
      .set(standard)
      .where(eq(standards.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteStandard(id: number): Promise<void> {
    await db.delete(standards).where(eq(standards.id, id));
  }

  // Hotspot methods
  async getAllHotspots(): Promise<Hotspot[]> {
    return await db.select().from(hotspots);
  }

  async getHotspot(id: number): Promise<Hotspot | undefined> {
    const [hotspot] = await db.select().from(hotspots).where(eq(hotspots.id, id));
    return hotspot || undefined;
  }

  async createHotspot(hotspot: InsertHotspot): Promise<Hotspot> {
    const [created] = await db.insert(hotspots).values(hotspot).returning();
    return created;
  }

  async updateHotspot(id: number, hotspot: Partial<InsertHotspot>): Promise<Hotspot | undefined> {
    const [updated] = await db
      .update(hotspots)
      .set(hotspot)
      .where(eq(hotspots.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteHotspot(id: number): Promise<void> {
    await db.delete(hotspots).where(eq(hotspots.id, id));
  }
}

export const storage = new DatabaseStorage();
