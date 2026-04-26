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
  password: text("password"),
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

// Judgment item photos and comments
export const judgmentPhotos = pgTable("judgment_photos", {
  id: serial("id").primaryKey(),
  itemId: varchar("item_id", { length: 50 }).notNull(),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  imageData: text("image_data").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const judgmentComments = pgTable("judgment_comments", {
  id: serial("id").primaryKey(),
  itemId: varchar("item_id", { length: 50 }).notNull(),
  author: text("author").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertJudgmentPhotoSchema = createInsertSchema(judgmentPhotos).omit({
  id: true,
  createdAt: true,
});

export const insertJudgmentCommentSchema = createInsertSchema(judgmentComments).omit({
  id: true,
  createdAt: true,
});

export type InsertJudgmentPhoto = z.infer<typeof insertJudgmentPhotoSchema>;
export type JudgmentPhoto = typeof judgmentPhotos.$inferSelect;

export type InsertJudgmentComment = z.infer<typeof insertJudgmentCommentSchema>;
export type JudgmentComment = typeof judgmentComments.$inferSelect;

// Comments table for standards
export const standardComments = pgTable("standard_comments", {
  id: serial("id").primaryKey(),
  standardId: integer("standard_id").references(() => standards.id, { onDelete: 'cascade' }).notNull(),
  author: text("author").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStandardCommentSchema = createInsertSchema(standardComments).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertStandardComment = z.infer<typeof insertStandardCommentSchema>;
export type StandardComment = typeof standardComments.$inferSelect;

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

// Inspection item edits table (for admin modifications that sync across all users)
export const inspectionItemEdits = pgTable("inspection_item_edits", {
  id: serial("id").primaryKey(),
  itemId: varchar("item_id", { length: 50 }).notNull().unique(),
  text: text("text"),
  effectiveDate: varchar("effective_date", { length: 20 }),
  expiryDate: varchar("expiry_date", { length: 20 }),
  introductionType: varchar("introduction_type", { length: 20 }),
  customWarning: text("custom_warning"),
  permitEffectiveDate: varchar("permit_effective_date", { length: 20 }),
  standardDates: text("standard_dates"),
  standardNote: text("standard_note"),
  equipmentTypes: text("equipment_types"),  // 적용 승강기 종류 (JSON 배열)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertInspectionItemEditSchema = createInsertSchema(inspectionItemEdits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertInspectionItemEdit = z.infer<typeof insertInspectionItemEditSchema>;
export type InspectionItemEdit = typeof inspectionItemEdits.$inferSelect;

// Custom inspection items table (for admin-added items that sync across all users)
export const customInspectionItems = pgTable("custom_inspection_items", {
  id: serial("id").primaryKey(),
  itemId: varchar("item_id", { length: 50 }).notNull().unique(),
  sectionId: varchar("section_id", { length: 50 }).notNull(),
  text: text("text").notNull(),
  effectiveDate: varchar("effective_date", { length: 20 }),
  introductionType: varchar("introduction_type", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCustomInspectionItemSchema = createInsertSchema(customInspectionItems).omit({
  id: true,
  createdAt: true,
});

export type InsertCustomInspectionItem = z.infer<typeof insertCustomInspectionItemSchema>;
export type CustomInspectionItem = typeof customInspectionItems.$inferSelect;

// PPE (개인보호구) 테이블
export const ppeItems = pgTable("ppe_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  issuedDate: varchar("issued_date", { length: 10 }),
  expiryDate: varchar("expiry_date", { length: 10 }),
  standard: text("standard"),
  howToWear: text("how_to_wear"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPpeItemSchema = createInsertSchema(ppeItems).omit({
  id: true,
  createdAt: true,
});
export type InsertPpeItem = z.infer<typeof insertPpeItemSchema>;
export type PpeItem = typeof ppeItems.$inferSelect;

// 아차사고 테이블
export const nearMisses = pgTable("near_misses", {
  id: serial("id").primaryKey(),
  date: varchar("date", { length: 10 }).notNull(),
  disasterType: text("disaster_type").notNull(),
  workType: text("work_type").notNull(),
  description: text("description").notNull(),
  imageUrls: text("image_urls").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNearMissSchema = createInsertSchema(nearMisses).omit({
  id: true,
  createdAt: true,
}).extend({
  imageUrls: z.array(z.string()).nullable().optional(),
});
export type InsertNearMiss = z.infer<typeof insertNearMissSchema>;
export type NearMiss = typeof nearMisses.$inferSelect;

// 판정결과 저장 테이블
export const judgmentResults = pgTable("judgment_results", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 50 }).notNull(),
  itemId: varchar("item_id", { length: 50 }).notNull(),
  result: varchar("result", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertJudgmentResultSchema = createInsertSchema(judgmentResults).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertJudgmentResult = z.infer<typeof insertJudgmentResultSchema>;
export type JudgmentResult = typeof judgmentResults.$inferSelect;

// 앱 설정 저장 테이블 (구조도 이미지, 카드 위치 등)
export const appSettings = pgTable("app_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AppSetting = typeof appSettings.$inferSelect;

// 검사항목 개정 이력 테이블 (복수 개정일 지원)
export const inspectionItemRevisions = pgTable("inspection_item_revisions", {
  id: serial("id").primaryKey(),
  itemId: varchar("item_id", { length: 50 }).notNull(),
  revisionDate: varchar("revision_date", { length: 20 }),
  description: text("description"),
  effectiveDate: varchar("effective_date", { length: 20 }),
  expiryDate: varchar("expiry_date", { length: 20 }),
  introductionType: varchar("introduction_type", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInspectionItemRevisionSchema = createInsertSchema(inspectionItemRevisions).omit({
  id: true,
  createdAt: true,
});
export type InsertInspectionItemRevision = z.infer<typeof insertInspectionItemRevisionSchema>;
export type InspectionItemRevision = typeof inspectionItemRevisions.$inferSelect;

// ── 검사기준 항목 DB 저장 테이블 ──
// 정적 파일 대신 DB에서 검사기준을 관리
export const inspectionBaseItems = pgTable("inspection_base_items", {
  id: serial("id").primaryKey(),
  itemId: varchar("item_id", { length: 50 }).notNull().unique(),  // e.g. "1.2.1.1-가"
  sectionId: varchar("section_id", { length: 50 }).notNull(),     // e.g. "1.2.1.1"
  sectionTitle: varchar("section_title", { length: 200 }),        // e.g. "[1.2.1.1] 주개폐기"
  parentSectionId: varchar("parent_section_id", { length: 50 }),  // e.g. "1.2.1"
  text: text("text").notNull(),                                   // 검사 내용
  sortOrder: integer("sort_order").default(0),                    // 정렬 순서
  permitEffectiveDate: varchar("permit_effective_date", { length: 20 }),  // 건축허가일 기준 적용일
  standardDates: text("standard_dates"),                          // 검사기준 적용일 목록 (JSON)
  equipmentTypes: varchar("equipment_types", { length: 200 }),    // 적용 승강기 종류 (JSON)
  isActive: varchar("is_active", { length: 5 }).default("true"),  // 활성 여부
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertInspectionBaseItemSchema = createInsertSchema(inspectionBaseItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertInspectionBaseItem = z.infer<typeof insertInspectionBaseItemSchema>;
export type InspectionBaseItem = typeof inspectionBaseItems.$inferSelect;
