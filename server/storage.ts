import { 
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
  type AppSetting,
  type InspectionItemRevision,
  type InsertInspectionItemRevision,
  ppeItems,
  nearMisses,
  judgmentResults,
  appSettings,
  inspectionItemRevisions,
  type PpeItem,
  type InsertPpeItem,
  type NearMiss as NearMissType,
  type InsertNearMiss,
  type JudgmentResult,
  type InsertJudgmentResult,
  type AppSetting,
  type InspectionItemRevision,
  type InsertInspectionItemRevision,
  ppeItems,
  nearMisses,
  judgmentResults,
  appSettings,
  inspectionItemRevisions,
  type InsertCustomInspectionItem,
  users,
  categories,
  standards,
  hotspots,
  memos,
  memoPhotos,
  memoComments,
  type MemoComment,
  type InsertMemoComment,
  photoAnnotations,
  standardComments,
  judgmentPhotos,
  judgmentComments,
  inspectionItemEdits,
  customInspectionItems,
  inspectionBaseItems
} from "@shared/schema";
import { db } from "./db";
import { eq, ilike, like, or, asc, sql } from "drizzle-orm";

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
    return await db.select({
      id: memoPhotos.id,
      memoId: memoPhotos.memoId,
      fileName: memoPhotos.fileName,   // 스키마 필드명: fileName
      mimeType: memoPhotos.mimeType,
      createdAt: memoPhotos.createdAt,
      imageData: sql<string>`''`,    // 목록에서 imageData 제외 → 빈 문자열
    }).from(memoPhotos).where(eq(memoPhotos.memoId, memoId));
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


  // App settings methods
  async getSetting(key: string): Promise<string | null> {
    const [row] = await db.select().from(appSettings).where(eq(appSettings.key, key));
    return row ? row.value : null;
  }
  async setSetting(key: string, value: string): Promise<void> {
    const existing = await db.select().from(appSettings).where(eq(appSettings.key, key));
    if (existing.length > 0) {
      await db.update(appSettings).set({ value, updatedAt: new Date() }).where(eq(appSettings.key, key));
    } else {
      await db.insert(appSettings).values({ key, value });
    }
  }
  // Inspection item revisions
  async getItemRevisions(itemId: string): Promise<InspectionItemRevision[]> {
    // effective_date가 NULL인 항목은 "최초 이전(가장 오래된) 기준"이므로 맨 앞에 오도록 NULLS FIRST 명시.
    // 기본 ASC 정렬은 Postgres에서 NULL을 맨 뒤로 보내 순서가 뒤섞이는 문제가 있었음.
    // introduction_type = 'additional'(추가 종전 기준)은 본 연혁 계보와 무관한 보충 참고 조문이므로
    // 시간순 정렬에서 제외하고 항상 맨 뒤로 보낸다.
    // itemId 완전일치뿐 아니라 "itemId." 로 시작하는 하위(소분류) 조문도 함께 반환한다.
    // (예: "9.7" 조회 시 "9.7.1", "9.7.2" 등 하위 조문도 함께 포함 — 대분류만 인용된 체크리스트
    // 항목에서도 실제 이력이 담긴 소분류 내용이 참조 조문 연혁에 표시되도록 하기 위함)
    // item_id 자체로 먼저 정렬해 같은 조문끼리 묶이도록 한 뒤, 그 안에서 기존 시간순 정렬을 적용한다.
    return await db.select().from(inspectionItemRevisions)
      .where(or(
        eq(inspectionItemRevisions.itemId, itemId),
        like(inspectionItemRevisions.itemId, `${itemId}.%`)
      ))
      .orderBy(
        inspectionItemRevisions.itemId,
        sql`(${inspectionItemRevisions.introductionType} = 'additional') ASC, ${inspectionItemRevisions.effectiveDate} ASC NULLS FIRST`
      );
  }
  async createItemRevision(data: InsertInspectionItemRevision): Promise<InspectionItemRevision> {
    const [created] = await db.insert(inspectionItemRevisions).values(data).returning();
    return created;
  }
  async deleteItemRevision(id: number): Promise<void> {
    await db.delete(inspectionItemRevisions).where(eq(inspectionItemRevisions.id, id));
  }
  async updateItemRevision(id: number, data: Partial<InsertInspectionItemRevision>): Promise<InspectionItemRevision | undefined> {
    const [updated] = await db.update(inspectionItemRevisions)
      .set(data)
      .where(eq(inspectionItemRevisions.id, id))
      .returning();
    return updated;
  }
  async getItemCommentCounts(): Promise<Record<string, number>> {
    const result = await db.select().from(judgmentComments);
    const counts: Record<string, number> = {};
    for (const row of result) {
      counts[row.itemId] = (counts[row.itemId] || 0) + 1;
    }
    return counts;
  }

  async getMemoComments(memoId: number): Promise<MemoComment[]> {
    return await db.select().from(memoComments).where(eq(memoComments.memoId, memoId)).orderBy(memoComments.createdAt);
  }

  async createMemoComment(data: InsertMemoComment): Promise<MemoComment> {
    const [comment] = await db.insert(memoComments).values(data).returning();
    return comment;
  }

  async deleteMemoComment(id: number): Promise<void> {
    await db.delete(memoComments).where(eq(memoComments.id, id));
  }

  async getInspectionBaseItems(): Promise<any[]> {
    return await db.select().from(inspectionBaseItems).orderBy(inspectionBaseItems.sortOrder);
  }

  async getInspectionBaseItem(itemId: string): Promise<any> {
    const result = await db.select().from(inspectionBaseItems).where(eq(inspectionBaseItems.itemId, itemId)).limit(1);
    return result[0];
  }

  async bulkUpsertInspectionBaseItems(items: {
    itemId: string;
    sectionId: string;
    sectionTitle: string;
    parentSectionId: string | null;
    text: string;
    sortOrder: number;
    permitEffectiveDate: string | null;
    standardDates: string;
  }[]): Promise<{ inserted: number; updated: number }> {
    if (items.length === 0) return { inserted: 0, updated: 0 };

    // 수동 편집된 text 보호를 위해 기존 text 먼저 조회
    const existingItems = await db.select({ itemId: inspectionBaseItems.itemId, text: inspectionBaseItems.text })
      .from(inspectionBaseItems);
    const existingMap = new Map(existingItems.map(e => [e.itemId, e.text]));

    let inserted = 0;
    let updated = 0;

    // 100개씩 단일 INSERT ... ON CONFLICT DO UPDATE 쿼리
    const batchSize = 100;
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);

      const values = batch.map(item => {
        const existingText = existingMap.get(item.itemId);
        // 수동 편집된 text 보호: 기존 값이 있고 다르면 기존 값 유지
        const finalText = existingText && existingText !== item.text ? existingText : item.text;
        return {
          itemId: item.itemId,
          sectionId: item.sectionId,
          sectionTitle: item.sectionTitle,
          parentSectionId: item.parentSectionId,
          text: finalText,
          sortOrder: item.sortOrder,
          permitEffectiveDate: item.permitEffectiveDate,
          standardDates: item.standardDates,
          isActive: 'true' as const,
        };
      });

      // drizzle onConflictDoUpdate 사용
      await db.insert(inspectionBaseItems)
        .values(values)
        .onConflictDoUpdate({
          target: inspectionBaseItems.itemId,
          set: {
            sectionTitle: sql`excluded.section_title`,
            parentSectionId: sql`excluded.parent_section_id`,
            sortOrder: sql`excluded.sort_order`,
            permitEffectiveDate: sql`excluded.permit_effective_date`,
            standardDates: sql`excluded.standard_dates`,
            // text: 기존값이 비어있지 않고 다르면 유지 (수동 편집 보호)
            text: sql`CASE WHEN inspection_base_items.text IS NOT NULL AND inspection_base_items.text != '' AND inspection_base_items.text != excluded.text THEN inspection_base_items.text ELSE excluded.text END`,
          }
        });

      // 삽입/업데이트 카운트
      batch.forEach(item => {
        if (existingMap.has(item.itemId)) updated++;
        else inserted++;
      });
    }

    return { inserted, updated };
  }

  // 관리자 화면에서 새 조문을 직접 추가 — VALID_BYULPYO22_IDS(정적 JSON) 배포 없이도
  // isAdminAdded='true'로 표시해 클라이언트 필터를 통과하게 한다.
  async createInspectionBaseItem(data: {
    itemId: string; text: string; sectionTitle?: string; parentSectionId?: string | null; afterItemId?: string;
  }): Promise<any> {
    const existing = await db.select().from(inspectionBaseItems).where(eq(inspectionBaseItems.itemId, data.itemId)).limit(1);
    if (existing[0]) {
      throw new Error(`이미 존재하는 조문번호입니다: ${data.itemId}`);
    }

    // sortOrder 계산: afterItemId가 있으면 그 다음 항목과의 중간값, 없으면 맨 뒤에 추가
    let sortOrder: number;
    if (data.afterItemId) {
      const afterRows = await db.select().from(inspectionBaseItems).where(eq(inspectionBaseItems.itemId, data.afterItemId)).limit(1);
      if (!afterRows[0]) {
        throw new Error(`"다음에 추가" 기준 조문을 찾을 수 없습니다: ${data.afterItemId}`);
      }
      const afterOrder = afterRows[0].sortOrder ?? 0;
      const nextRows = await db.select().from(inspectionBaseItems)
        .where(sql`${inspectionBaseItems.sortOrder} > ${afterOrder}`)
        .orderBy(inspectionBaseItems.sortOrder)
        .limit(1);
      const nextOrder = nextRows[0]?.sortOrder ?? (afterOrder + 2);
      sortOrder = Math.floor((afterOrder + nextOrder) / 2);
      if (sortOrder <= afterOrder) sortOrder = afterOrder + 1;
    } else {
      const maxRows = await db.select({ max: sql<number>`max(${inspectionBaseItems.sortOrder})` }).from(inspectionBaseItems);
      sortOrder = (maxRows[0]?.max ?? 0) + 10;
    }

    const result = await db.insert(inspectionBaseItems).values({
      itemId: data.itemId,
      sectionId: data.itemId,
      sectionTitle: data.sectionTitle || null,
      parentSectionId: data.parentSectionId || null,
      text: data.text,
      sortOrder,
      isActive: 'true',
      isAdminAdded: 'true',
    }).returning();
    return result[0];
  }

  // 관리자 화면에서 조문 하나를 직접 수정 — 별도 override 테이블 없이 원본 행을 갱신한다.
  async updateInspectionBaseItem(itemId: string, data: { text?: string; sectionTitle?: string; isAdminAdded?: string; isActive?: string }): Promise<any> {
    const result = await db.update(inspectionBaseItems)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(inspectionBaseItems.itemId, itemId))
      .returning();
    return result[0];
  }

  // itemId가 아직 DB에 없는 경우(정적 JSON에만 있던 항목) 새 행으로 추가한다.
  async upsertInspectionBaseItemText(itemId: string, data: {
    text: string; sectionId: string; sectionTitle?: string; parentSectionId?: string | null; sortOrder?: number;
  }): Promise<any> {
    const existing = await db.select().from(inspectionBaseItems).where(eq(inspectionBaseItems.itemId, itemId)).limit(1);
    if (existing[0]) {
      const result = await db.update(inspectionBaseItems)
        .set({ text: data.text, sectionTitle: data.sectionTitle, updatedAt: new Date() })
        .where(eq(inspectionBaseItems.itemId, itemId))
        .returning();
      return result[0];
    }
    const result = await db.insert(inspectionBaseItems).values({
      itemId,
      sectionId: data.sectionId,
      sectionTitle: data.sectionTitle || null,
      parentSectionId: data.parentSectionId || null,
      text: data.text,
      sortOrder: data.sortOrder ?? 0,
      isActive: 'true',
    }).returning();
    return result[0];
  }

  async deleteAllItemRevisions(itemId: string): Promise<void> {
    await db.delete(inspectionItemRevisions).where(eq(inspectionItemRevisions.itemId, itemId));
  }

  // inspection_item_edits의 standard_dates, permit_effective_date를 null로 초기화
  // (inspection_base_items.standard_dates / permit_effective_date로 이전 완료)
  async clearStandardDatesFromEdits(): Promise<void> {
    // standard_dates만 초기화 (text, permitEffectiveDate 등 수동 편집은 보호)
    // 단, inspection_base_items에 해당 itemId가 있는 경우에만 초기화
    await db.execute(sql`
      UPDATE inspection_item_edits e
      SET standard_dates = NULL,
          permit_effective_date = NULL
      WHERE EXISTS (
        SELECT 1 FROM inspection_base_items b
        WHERE b.item_id = e.item_id
          AND b.permit_effective_date IS NOT NULL
      )
    `);
  }
}
export const storage = new DatabaseStorage();
