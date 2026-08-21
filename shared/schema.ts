import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, timestamp, integer, boolean} from "drizzle-orm/pg-core";
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

// Memo comments
export const memoComments = pgTable("memo_comments", {
  id: serial("id").primaryKey(),
  memoId: integer("memo_id").references(() => memos.id, { onDelete: "cascade" }).notNull(),
  author: varchar("author", { length: 100 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const insertMemoCommentSchema = createInsertSchema(memoComments).omit({ id: true, createdAt: true });
export type InsertMemoComment = z.infer<typeof insertMemoCommentSchema>;
export type MemoComment = typeof memoComments.$inferSelect;

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

// 표준화 항목 오버라이드 (JSON 원본 위에 DB 수정값 덮어씌우기)
export const stdItemOverrides = pgTable("std_item_overrides", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),           // itemKey (식별자 — 원본 title)
  overrideTitle: text("override_title"),    // 수정된 제목
  basis: text("basis"),                     // 현안 및 근거 조항 수정값
  conclusion: text("conclusion"),           // 표준화 결정 수정값
  source: text("source"),                   // 출처(회차) 수정값
  ref: text("ref"),                         // 검사기준 조항 수정값
  typeTag: text("type_tag"),                // 유형 태그 수정값
  category: text("category"),              // 분류 수정값
  permitDate: varchar("permit_date", { length: 20 }),         // 건축허가일
  inspectionDate: varchar("inspection_date", { length: 20 }), // 기준적용일(검사기준적용일)
  inspectionYear: varchar("inspection_year", { length: 20 }), // 검사일
  installInspectionDate: varchar("install_inspection_date", { length: 20 }), // 설치검사일
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  manuallyEdited: boolean("manually_edited").default(false),  // 수동 수정 여부
});

export const insertStdItemOverrideSchema = createInsertSchema(stdItemOverrides).omit({ id: true, updatedAt: true });
export type StdItemOverride = typeof stdItemOverrides.$inferSelect;

// 검사기준 항목 오버라이드 (별표22_parsed.json 위에 DB 수정값 덮어씌우기)
export const inspStdOverrides = pgTable("insp_std_overrides", {
  id: serial("id").primaryKey(),
  itemKey: varchar("item_key", { length: 50 }).notNull().unique(), // 조문번호 e.g. "6.1.8.1"
  text: text("text"),                       // 조문 내용 수정값
  source: text("source"),                   // 출처 수정값
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertInspStdOverrideSchema = createInsertSchema(inspStdOverrides).omit({ id: true, updatedAt: true });
export type InspStdOverride = typeof inspStdOverrides.$inferSelect;

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
  employeeId: varchar("employee_id", { length: 20 }),
  employeeName: varchar("employee_name", { length: 50 }),
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
  isAdminAdded: varchar("is_admin_added", { length: 5 }).default("false"),  // 관리자 모드에서 새로 추가한 조문 여부
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

// ── 채팅 메시지 ──
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userName: varchar("user_name", { length: 50 }).notNull(),
  content: text("content").notNull(),
  replyToId: integer("reply_to_id"),
  replyToUser: varchar("reply_to_user", { length: 50 }),
  replyToContent: text("reply_to_content"),
  imageData: text("image_data"),            // 첨부 이미지 base64 (200px)
  imageThumbnail: text("image_thumbnail"),  // 만료 후 50px 미리보기
  videoData: text("video_data"),
  videoMime: varchar("video_mime", { length: 50 }),
  deletedAt: timestamp("deleted_at"),       // soft delete
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// ── 표준화 항목 이미지 ──
export const stdItemPhotos = pgTable("std_item_photos", {
  id: serial("id").primaryKey(),
  itemKey: varchar("item_key", { length: 200 }).notNull(), // title 기반 식별자
  imageData: text("image_data").notNull(),
  mimeType: varchar("mime_type", { length: 50 }).default("image/jpeg"),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── 검사기준(별표22) 조문 이미지 — 본문에 여러 장 첨부 ──
export const inspectionItemPhotos = pgTable("inspection_item_photos", {
  id: serial("id").primaryKey(),
  itemId: varchar("item_id", { length: 50 }).notNull(),
  imageData: text("image_data").notNull(),
  mimeType: varchar("mime_type", { length: 50 }).default("image/jpeg"),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// AI 사용량 로그
export const aiUsage = pgTable("ai_usage", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  inputTokens: integer("input_tokens").notNull().default(0),
  outputTokens: integer("output_tokens").notNull().default(0),
  costUsd: text("cost_usd").notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type AiUsage = typeof aiUsage.$inferSelect;

// 업데이트 내역: 깃허브 커밋을 이용자용 문구로 정리해 캐싱 (AI 호출 비용 절감 목적)
export const changelogCache = pgTable("changelog_cache", {
  id: serial("id").primaryKey(),
  sha: varchar("sha", { length: 40 }).notNull().unique(),
  commitDate: timestamp("commit_date").notNull(),
  rawMessage: text("raw_message").notNull(),
  displayText: text("display_text"),  // null이면 이용자에게 보이지 않는(내부용) 커밋으로 판단됨
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type ChangelogCache = typeof changelogCache.$inferSelect;

// ── 위험성평가: 유해위험요인 (모든 이용자가 등록) ──
export const riskHazardItems = pgTable("risk_hazard_items", {
  id: serial("id").primaryKey(),
  method: varchar("method", { length: 20 }).notNull(), // 'checklist' | 'freq_severity'
  workCategory: text("work_category").notNull(),        // 업무구분 (사무 / 엘리베이터 / 에스컬레이터 등)
  subWork: text("sub_work"),                             // 세부 업무
  content: text("content").notNull(),                    // 유해위험요인 내용
  discoveryPath: text("discovery_path"),                  // 발굴 경로 (순회점검/현장업무/아차사고/청취조사/기타)
  fieldInfo: text("field_info"),                          // 현장 추가정보
  imageUrls: text("image_urls").array(),
  branchId: varchar("branch_id", { length: 50 }).notNull(), // 지사
  registeredById: varchar("registered_by_id", { length: 20 }).notNull(),
  registeredByName: varchar("registered_by_name", { length: 50 }).notNull(),
  team: varchar("team", { length: 50 }),                  // 팀(반) — 관리자 예시/팀원 직접등록 시 지정. 기존 항목은 null(미분류)
  isTemplate: boolean("is_template").default(false).notNull(), // true=관리자가 등록한 예시(선택 전까지 평가 대상 아님)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRiskHazardItemSchema = createInsertSchema(riskHazardItems).omit({
  id: true,
  createdAt: true,
}).extend({
  imageUrls: z.array(z.string()).nullable().optional(),
});
export type InsertRiskHazardItem = z.infer<typeof insertRiskHazardItemSchema>;
export type RiskHazardItem = typeof riskHazardItems.$inferSelect;

// ── 위험성평가: 팀원의 항목 선택(예시 선택 또는 직접등록 시 자동 생성) — 항목당 1명만 선택 가능 ──
export const riskItemSelections = pgTable("risk_item_selections", {
  id: serial("id").primaryKey(),
  hazardItemId: integer("hazard_item_id").notNull(),
  employeeId: varchar("employee_id", { length: 50 }).notNull(),
  employeeName: varchar("employee_name", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const insertRiskItemSelectionSchema = createInsertSchema(riskItemSelections).omit({
  id: true,
  createdAt: true,
});
export type InsertRiskItemSelection = z.infer<typeof insertRiskItemSelectionSchema>;
export type RiskItemSelection = typeof riskItemSelections.$inferSelect;

// ── 위험성평가: 개인별 평가입력 ──
export const riskAssessments = pgTable("risk_assessments", {
  id: serial("id").primaryKey(),
  hazardItemId: integer("hazard_item_id").notNull(),
  branchId: varchar("branch_id", { length: 50 }).notNull(),
  employeeId: varchar("employee_id", { length: 20 }).notNull(),
  employeeName: varchar("employee_name", { length: 50 }).notNull(),
  // 체크리스트법(사무)
  level: varchar("level", { length: 10 }),               // '상' | '중' | '하'
  // 빈도강도법(승강기검사)
  hadAccidentExperience: boolean("had_accident_experience"), // 최근 1년 내 사고(아차사고 포함) 경험 여부
  severity: integer("severity"),                          // 중대성 1~4
  // 공통
  currentSafetyMeasure: text("current_safety_measure"),
  reductionPlan: text("reduction_plan"),
  implementStatus: varchar("implement_status", { length: 10 }), // '완료' | '미완료'
  implementDate: varchar("implement_date", { length: 10 }),
  implementOwner: varchar("implement_owner", { length: 50 }),
  actionResult: text("action_result"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertRiskAssessmentSchema = createInsertSchema(riskAssessments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertRiskAssessment = z.infer<typeof insertRiskAssessmentSchema>;
export type RiskAssessment = typeof riskAssessments.$inferSelect;

// ── 위험성평가: 팀 배정 오버라이드 — TEAM_ROSTERS 고정 명단 대신 본인 선택 또는 관리자 지정으로
// 팀을 바꿀 수 있게 함. employeeId(=로그인 이름) 당 1개, 언제든 다시 변경 가능(잠금 없음). ──
export const employeeTeamOverrides = pgTable("employee_team_overrides", {
  id: serial("id").primaryKey(),
  employeeId: varchar("employee_id", { length: 50 }).notNull().unique(), // 로그인 이름
  team: varchar("team", { length: 50 }).notNull(),                      // 배정된 팀(반) 이름
  setBy: varchar("set_by", { length: 20 }),                             // 'self' | 'admin'
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const insertEmployeeTeamOverrideSchema = createInsertSchema(employeeTeamOverrides).omit({
  id: true,
  updatedAt: true,
});
export type InsertEmployeeTeamOverride = z.infer<typeof insertEmployeeTeamOverrideSchema>;
export type EmployeeTeamOverride = typeof employeeTeamOverrides.$inferSelect;

