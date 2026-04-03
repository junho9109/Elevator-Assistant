import { 
  head -5 server/storage.ts
  type User, 
  type InsertUser,
  type Category,
  type InsertCategory,
  type Standard,
  type InsertStandard,
  type Hotspot,
  type InsertHotspot,
  type Memo,
  type InsertMemo,
  type MemoPhoto,
  type InsertMemoPhoto,
  type PhotoAnnotation,
  type InsertPhotoAnnotation,
  type StandardComment,
  type InsertStandardComment,
  type JudgmentPhoto,
  type InsertJudgmentPhoto,
  type JudgmentComment,
  type InsertJudgmentComment,
  type InspectionItemEdit,
  type InsertInspectionItemEdit,
  type CustomInspectionItem,
  type PpeItem,
  type InsertPpeItem,
  type NearMiss as NearMissType,
  type InsertNearMiss,
  type JudgmentResult,
  type InsertJudgmentResult,
  ppeItems,
  nearMisses,
  judgmentResults,
  type InsertCustomInspectionItem,
  users,
  categories,
  standards,
  hotspots,
  memos,
  memoPhotos,
  photoAnnotations,
  standardComments,
  judgmentPhotos,
  judgmentComments,
  inspectionItemEdits,
  customInspectionItems
} from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or, asc } from "drizzle-orm";

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
  getStandardsByHotspot(hotspotId: number): Promise<Standard[]>;
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

  // Memo methods
  getAllMemos(): Promise<Memo[]>;
  searchMemos(query: string): Promise<Memo[]>;
  getMemo(id: number): Promise<Memo | undefined>;
  createMemo(memo: InsertMemo): Promise<Memo>;
  updateMemo(id: number, memo: Partial<InsertMemo>): Promise<Memo | undefined>;
  deleteMemo(id: number): Promise<void>;

  // MemoPhoto methods
  getPhotosByMemo(memoId: number): Promise<MemoPhoto[]>;
  getPhoto(id: number): Promise<MemoPhoto | undefined>;
  createPhoto(photo: InsertMemoPhoto): Promise<MemoPhoto>;
  deletePhoto(id: number): Promise<void>;

  // PhotoAnnotation methods
  getAnnotationsByPhoto(photoId: number): Promise<PhotoAnnotation[]>;
  createAnnotation(annotation: InsertPhotoAnnotation): Promise<PhotoAnnotation>;
  deleteAnnotation(id: number): Promise<void>;
  deleteAnnotationsByPhoto(photoId: number): Promise<void>;

  // StandardComment methods
  getCommentsByStandard(standardId: number): Promise<StandardComment[]>;
  createComment(comment: InsertStandardComment): Promise<StandardComment>;
  deleteComment(id: number): Promise<void>;

  // JudgmentPhoto methods
  getJudgmentPhotosByItem(itemId: string): Promise<JudgmentPhoto[]>;
  getJudgmentPhotoCount(itemId: string): Promise<number>;
  createJudgmentPhoto(photo: InsertJudgmentPhoto): Promise<JudgmentPhoto>;
  deleteJudgmentPhoto(id: number): Promise<void>;
  updateJudgmentPhotoOrder(id: number, sortOrder: number): Promise<void>;
  reorderJudgmentPhotos(photoIds: number[]): Promise<void>;

  // JudgmentComment methods
  getJudgmentCommentsByItem(itemId: string): Promise<JudgmentComment[]>;
  createJudgmentComment(comment: InsertJudgmentComment): Promise<JudgmentComment>;
  deleteJudgmentComment(id: number): Promise<void>;

  // InspectionItemEdit methods
  getAllInspectionItemEdits(): Promise<InspectionItemEdit[]>;
  getInspectionItemEdit(itemId: string): Promise<InspectionItemEdit | undefined>;
  upsertInspectionItemEdit(edit: InsertInspectionItemEdit): Promise<InspectionItemEdit>;
  deleteInspectionItemEdit(itemId: string): Promise<void>;

  // CustomInspectionItem methods
  getAllCustomInspectionItems(): Promise<CustomInspectionItem[]>;
  createCustomInspectionItem(item: InsertCustomInspectionItem): Promise<CustomInspectionItem>;
  deleteCustomInspectionItem(itemId: string): Promise<void>;
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

  async getStandardsByHotspot(hotspotId: number): Promise<Standard[]> {
    return await db.select().from(standards).where(eq(standards.hotspotId, hotspotId));
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

  // Memo methods
  async getAllMemos(): Promise<Memo[]> {
    return await db.select().from(memos).orderBy(memos.createdAt);
  }

  async searchMemos(query: string): Promise<Memo[]> {
    return await db.select().from(memos).where(
      or(
        ilike(memos.title, `%${query}%`),
        ilike(memos.body, `%${query}%`)
      )
    );
  }

  async getMemo(id: number): Promise<Memo | undefined> {
    const [memo] = await db.select().from(memos).where(eq(memos.id, id));
    return memo || undefined;
  }

  async createMemo(memo: InsertMemo): Promise<Memo> {
    const [created] = await db.insert(memos).values(memo).returning();
    return created;
  }

  async updateMemo(id: number, memo: Partial<InsertMemo>): Promise<Memo | undefined> {
    const [updated] = await db
      .update(memos)
      .set({ ...memo, updatedAt: new Date() })
      .where(eq(memos.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteMemo(id: number): Promise<void> {
    await db.delete(memos).where(eq(memos.id, id));
  }

  // MemoPhoto methods
  async getPhotosByMemo(memoId: number): Promise<MemoPhoto[]> {
    return await db.select().from(memoPhotos).where(eq(memoPhotos.memoId, memoId));
  }

  async getPhoto(id: number): Promise<MemoPhoto | undefined> {
    const [photo] = await db.select().from(memoPhotos).where(eq(memoPhotos.id, id));
    return photo || undefined;
  }

  async createPhoto(photo: InsertMemoPhoto): Promise<MemoPhoto> {
    const [created] = await db.insert(memoPhotos).values(photo).returning();
    return created;
  }

  async deletePhoto(id: number): Promise<void> {
    await db.delete(memoPhotos).where(eq(memoPhotos.id, id));
  }

  // PhotoAnnotation methods
  async getAnnotationsByPhoto(photoId: number): Promise<PhotoAnnotation[]> {
    return await db.select().from(photoAnnotations).where(eq(photoAnnotations.photoId, photoId));
  }

  async createAnnotation(annotation: InsertPhotoAnnotation): Promise<PhotoAnnotation> {
    const [created] = await db.insert(photoAnnotations).values(annotation).returning();
    return created;
  }

  async deleteAnnotation(id: number): Promise<void> {
    await db.delete(photoAnnotations).where(eq(photoAnnotations.id, id));
  }

  async deleteAnnotationsByPhoto(photoId: number): Promise<void> {
    await db.delete(photoAnnotations).where(eq(photoAnnotations.photoId, photoId));
  }

  // StandardComment methods
  async getCommentsByStandard(standardId: number): Promise<StandardComment[]> {
    return await db.select().from(standardComments).where(eq(standardComments.standardId, standardId));
  }

  async createComment(comment: InsertStandardComment): Promise<StandardComment> {
    const [newComment] = await db.insert(standardComments).values(comment).returning();
    return newComment;
  }

  async deleteComment(id: number): Promise<void> {
    await db.delete(standardComments).where(eq(standardComments.id, id));
  }

  // JudgmentPhoto methods
  async getJudgmentPhotosByItem(itemId: string): Promise<JudgmentPhoto[]> {
    return await db.select().from(judgmentPhotos).where(eq(judgmentPhotos.itemId, itemId)).orderBy(asc(judgmentPhotos.sortOrder));
  }

  async getJudgmentPhotoCount(itemId: string): Promise<number> {
    const photos = await db.select().from(judgmentPhotos).where(eq(judgmentPhotos.itemId, itemId));
    return photos.length;
  }

  async createJudgmentPhoto(photo: InsertJudgmentPhoto): Promise<JudgmentPhoto> {
    const [created] = await db.insert(judgmentPhotos).values(photo).returning();
    return created;
  }

  async deleteJudgmentPhoto(id: number): Promise<void> {
    await db.delete(judgmentPhotos).where(eq(judgmentPhotos.id, id));
  }

  async updateJudgmentPhotoOrder(id: number, sortOrder: number): Promise<void> {
    await db.update(judgmentPhotos).set({ sortOrder }).where(eq(judgmentPhotos.id, id));
  }

  async reorderJudgmentPhotos(photoIds: number[]): Promise<void> {
    for (let i = 0; i < photoIds.length; i++) {
      await db.update(judgmentPhotos).set({ sortOrder: i }).where(eq(judgmentPhotos.id, photoIds[i]));
    }
  }

  // JudgmentComment methods
  async getJudgmentCommentsByItem(itemId: string): Promise<JudgmentComment[]> {
    return await db.select().from(judgmentComments).where(eq(judgmentComments.itemId, itemId));
  }

  async createJudgmentComment(comment: InsertJudgmentComment): Promise<JudgmentComment> {
    const [created] = await db.insert(judgmentComments).values(comment).returning();
    return created;
  }

  async deleteJudgmentComment(id: number): Promise<void> {
    await db.delete(judgmentComments).where(eq(judgmentComments.id, id));
  }

  // InspectionItemEdit methods
  async getAllInspectionItemEdits(): Promise<InspectionItemEdit[]> {
    return await db.select().from(inspectionItemEdits);
  }

  async getInspectionItemEdit(itemId: string): Promise<InspectionItemEdit | undefined> {
    const [edit] = await db.select().from(inspectionItemEdits).where(eq(inspectionItemEdits.itemId, itemId));
    return edit || undefined;
  }

  async upsertInspectionItemEdit(edit: InsertInspectionItemEdit): Promise<InspectionItemEdit> {
    const existing = await this.getInspectionItemEdit(edit.itemId);
    if (existing) {
      const [updated] = await db
        .update(inspectionItemEdits)
        .set({ ...edit, updatedAt: new Date() })
        .where(eq(inspectionItemEdits.itemId, edit.itemId))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(inspectionItemEdits).values(edit).returning();
      return created;
    }
  }

  async deleteInspectionItemEdit(itemId: string): Promise<void> {
    await db.delete(inspectionItemEdits).where(eq(inspectionItemEdits.itemId, itemId));
  }

  // CustomInspectionItem methods
  async getAllCustomInspectionItems(): Promise<CustomInspectionItem[]> {
    return await db.select().from(customInspectionItems);
  }

  async createCustomInspectionItem(item: InsertCustomInspectionItem): Promise<CustomInspectionItem> {
    const [created] = await db.insert(customInspectionItems).values(item).returning();
    return created;
  }

  async deleteCustomInspectionItem(itemId: string): Promise<void> {
    await db.delete(customInspectionItems).where(eq(customInspectionItems.itemId, itemId));
  }
// PPE methods
  async getAllPpeItems(): Promise<PpeItem[]> {
    return await db.select().from(ppeItems).orderBy(ppeItems.createdAt);
  }
  async createPpeItem(item: InsertPpeItem): Promise<PpeItem> {
    const [created] = await db.insert(ppeItems).values(item).returning();
    return created;
  }
  async deletePpeItem(id: number): Promise<void> {
    await db.delete(ppeItems).where(eq(ppeItems.id, id));
  }

  // Near miss methods
  async getAllNearMisses(): Promise<NearMiss[]> {
    return await db.select().from(nearMisses).orderBy(nearMisses.createdAt);
  }
  async createNearMiss(item: InsertNearMiss): Promise<NearMiss> {
    const [created] = await db.insert(nearMisses).values(item).returning();
    return created;
  }
  async deleteNearMiss(id: number): Promise<void> {
    await db.delete(nearMisses).where(eq(nearMisses.id, id));
  }

  // Judgment results methods
  async getJudgmentResults(sessionId: string): Promise<JudgmentResult[]> {
    return await db.select().from(judgmentResults).where(eq(judgmentResults.sessionId, sessionId));
  }
  async upsertJudgmentResult(data: InsertJudgmentResult): Promise<JudgmentResult> {
    const existing = await db.select().from(judgmentResults)
      .where(eq(judgmentResults.sessionId, data.sessionId))
      .where(eq(judgmentResults.itemId, data.itemId));
    if (existing.length > 0) {
      const [updated] = await db.update(judgmentResults)
        .set({ result: data.result, updatedAt: new Date() })
        .where(eq(judgmentResults.id, existing[0].id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(judgmentResults).values(data).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
