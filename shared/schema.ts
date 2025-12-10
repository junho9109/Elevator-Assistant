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
  hotspotId: integer("hotspot_id").references(() => hotspots.id, { onDelete: 'set null' }),
  title: text("title").notNull(),
  standardNumber: varchar("standard_number", { length: 50 }),
  body: text("body").notNull(),
  imageUrls: text("image_urls").array(),
  permitDate: varchar("permit_date", { length: 10 }),
  inspectionDate: varchar("inspection_date", { length: 10 }),
  inspectionYear: varchar("inspection_year", { length: 4 }),
  inspectionRound: varchar("inspection_round", { length: 10 }),
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
  hotspotId: z.number().nullable().optional(),
  imageUrls: z.array(z.string()).nullable().optional(),
});

// Memo tables for 3rd slide
export const memos = pgTable("memos", {
  id: serial("id").primaryKey(),
  title: text("title"),
  body: text("body").notNull().default(""),
  keywords: text("keywords").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const memoPhotos = pgTable("memo_photos", {
  id: serial("id").primaryKey(),
  memoId: integer("memo_id").references(() => memos.id, { onDelete: 'cascade' }).notNull(),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  imageData: text("image_data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const photoAnnotations = pgTable("photo_annotations", {
  id: serial("id").primaryKey(),
  photoId: integer("photo_id").references(() => memoPhotos.id, { onDelete: 'cascade' }).notNull(),
  tool: varchar("tool", { length: 20 }).notNull(),
  color: varchar("color", { length: 20 }).notNull(),
  strokeWidth: integer("stroke_width").default(2),
  points: text("points").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas for memo tables
export const insertMemoSchema = createInsertSchema(memos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMemoPhotoSchema = createInsertSchema(memoPhotos).omit({
  id: true,
  createdAt: true,
});

export const insertPhotoAnnotationSchema = createInsertSchema(photoAnnotations).omit({
  id: true,
  createdAt: true,
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

export type InsertMemo = z.infer<typeof insertMemoSchema>;
export type Memo = typeof memos.$inferSelect;

export type InsertMemoPhoto = z.infer<typeof insertMemoPhotoSchema>;
export type MemoPhoto = typeof memoPhotos.$inferSelect;

export type InsertPhotoAnnotation = z.infer<typeof insertPhotoAnnotationSchema>;
export type PhotoAnnotation = typeof photoAnnotations.$inferSelect;
