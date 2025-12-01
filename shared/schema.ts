import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const standards = pgTable("standards", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  standardNumber: varchar("standard_number", { length: 50 }),
  body: text("body").notNull(),
  imageUrl: text("image_url"),
  permitDate: varchar("permit_date", { length: 10 }),
  inspectionDate: varchar("inspection_date", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const hotspots = pgTable("hotspots", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  top: varchar("top", { length: 10 }).notNull(),
  left: varchar("left", { length: 10 }).notNull(),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertStandardSchema = createInsertSchema(standards).omit({
  id: true,
  createdAt: true,
});

export const insertHotspotSchema = createInsertSchema(hotspots).omit({
  id: true,
  createdAt: true,
}).extend({
  categoryId: z.number().nullable().optional(),
});

export const insertStandardSchemaExt = createInsertSchema(standards).omit({
  id: true,
  createdAt: true,
}).extend({
  categoryId: z.number().nullable().optional(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertStandard = z.infer<typeof insertStandardSchema>;
export type Standard = typeof standards.$inferSelect;

export type InsertHotspot = z.infer<typeof insertHotspotSchema>;
export type Hotspot = typeof hotspots.$inferSelect;
