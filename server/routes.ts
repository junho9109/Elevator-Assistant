import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import Anthropic from "@anthropic-ai/sdk";
import { storage } from "./storage";
import { insertCategorySchema, insertStandardSchemaExt, insertHotspotSchema, insertMemoSchema, insertPhotoAnnotationSchema, insertStandardCommentSchema, insertJudgmentPhotoSchema, insertJudgmentCommentSchema, insertInspectionItemEditSchema, insertCustomInspectionItemSchema, insertPpeItemSchema, insertNearMissSchema, insertJudgmentResultSchema } from "@shared/schema";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

function handleError(res: any, error: any, message: string) {
  console.error("========== API ERROR ==========");
  console.error(message);
  console.error(error);
  console.error("================================");
  res.status(500).json({ error: message });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: "Invalid category data" });
    }
  });

  app.put("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, validatedData);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: "Invalid category data" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCategory(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  });

  // Standard routes
  app.get("/api/standards", async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : null;
      const hotspotId = req.query.hotspotId ? parseInt(req.query.hotspotId as string) : null;
      
      let standards;
      if (hotspotId) {
        standards = await storage.getStandardsByHotspot(hotspotId);
      } else if (categoryId) {
        standards = await storage.getStandardsByCategory(categoryId);
      } else {
        standards = await storage.getAllStandards();
      }
      res.json(standards);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch standards" });
    }
  });

  app.get("/api/standards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const standard = await storage.getStandard(id);
      if (!standard) {
        return res.status(404).json({ error: "Standard not found" });
      }
      res.json(standard);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch standard" });
    }
  });

  app.post("/api/standards", async (req, res) => {
    try {
      const validatedData = insertStandardSchemaExt.parse(req.body);
      const standard = await storage.createStandard(validatedData);
      res.status(201).json(standard);
    } catch (error) {
      res.status(400).json({ error: "Invalid standard data" });
    }
  });

  app.put("/api/standards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertStandardSchemaExt.partial().parse(req.body);
      const standard = await storage.updateStandard(id, validatedData);
      if (!standard) {
        return res.status(404).json({ error: "Standard not found" });
      }
      res.json(standard);
    } catch (error) {
      res.status(400).json({ error: "Invalid standard data" });
    }
  });

  app.delete("/api/standards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteStandard(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete standard" });
    }
  });

  // Admin password verification
  app.post("/api/admin/verify-password", async (req, res) => {
    try {
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (!adminPassword) {
        console.error("ADMIN_PASSWORD environment variable is not set");
        return res.status(500).json({ success: false, error: "서버 설정 오류입니다." });
      }
      
      const { password } = req.body;
      if (password === adminPassword) {
        res.json({ success: true });
      } else {
        res.status(401).json({ success: false, error: "잘못된 비밀번호입니다." });
      }
    } catch (error) {
      res.status(400).json({ success: false, error: "비밀번호 검증에 실패했습니다." });
    }
  });

  // Hotspot routes
  app.get("/api/hotspots", async (req, res) => {
    try {
      const hotspots = await storage.getAllHotspots();
      res.json(hotspots);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hotspots" });
    }
  });

  app.get("/api/hotspots/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const hotspot = await storage.getHotspot(id);
      if (!hotspot) {
        return res.status(404).json({ error: "Hotspot not found" });
      }
      res.json(hotspot);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hotspot" });
    }
  });

  app.post("/api/hotspots", async (req, res) => {
    try {
      const validatedData = insertHotspotSchema.parse(req.body);
      const hotspot = await storage.createHotspot(validatedData);
      res.status(201).json(hotspot);
    } catch (error) {
      res.status(400).json({ error: "Invalid hotspot data" });
    }
  });

  app.put("/api/hotspots/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertHotspotSchema.partial().parse(req.body);
      const hotspot = await storage.updateHotspot(id, validatedData);
      if (!hotspot) {
        return res.status(404).json({ error: "Hotspot not found" });
      }
      res.json(hotspot);
    } catch (error) {
      res.status(400).json({ error: "Invalid hotspot data" });
    }
  });

  app.delete("/api/hotspots/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteHotspot(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete hotspot" });
    }
  });

  // Memo routes
  app.get("/api/memos", async (req, res) => {
    try {
      const search = req.query.search as string;
      const memos = search 
        ? await storage.searchMemos(search)
        : await storage.getAllMemos();
      res.json(memos);
    } catch (error) {
      handleError(res, error, "Failed to fetch memos");
    }
  });

  app.get("/api/memos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const memo = await storage.getMemo(id);
      if (!memo) {
        return res.status(404).json({ error: "Memo not found" });
      }
      res.json(memo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch memo" });
    }
  });

  app.post("/api/memos", async (req, res) => {
    try {
      const validatedData = insertMemoSchema.parse(req.body);
      const memo = await storage.createMemo(validatedData);
      res.status(201).json(memo);
    } catch (error) {
      res.status(400).json({ error: "Invalid memo data" });
    }
  });

  app.put("/api/memos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertMemoSchema.partial().parse(req.body);
      const memo = await storage.updateMemo(id, validatedData);
      if (!memo) {
        return res.status(404).json({ error: "Memo not found" });
      }
      res.json(memo);
    } catch (error) {
      res.status(400).json({ error: "Invalid memo data" });
    }
  });

  app.delete("/api/memos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMemo(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete memo" });
    }
  });

  // Photo routes
  app.get("/api/memos/:memoId/photos", async (req, res) => {
    try {
      const memoId = parseInt(req.params.memoId);
      const photos = await storage.getPhotosByMemo(memoId);
      res.json(photos.map(p => ({ ...p, imageData: undefined, hasImage: true })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch photos" });
    }
  });

  app.get("/api/photos/:id/image", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const photo = await storage.getPhoto(id);
      if (!photo) {
        return res.status(404).json({ error: "Photo not found" });
      }
      const base64Data = photo.imageData.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      res.setHeader('Content-Type', photo.mimeType);
      res.send(buffer);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch photo image" });
    }
  });

  app.post("/api/memos/:memoId/photos", upload.single('image'), async (req, res) => {
    try {
      const memoId = parseInt(req.params.memoId);
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "No image provided" });
      }
      
      const existingPhotos = await storage.getPhotosByMemo(memoId);
      if (existingPhotos.length >= 5) {
        return res.status(400).json({ error: "Maximum 5 photos allowed" });
      }

      const base64Data = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      const photo = await storage.createPhoto({
        memoId,
        fileName: file.originalname,
        mimeType: file.mimetype,
        imageData: base64Data
      });
      res.status(201).json({ ...photo, imageData: undefined, hasImage: true });
    } catch (error) {
      res.status(400).json({ error: "Failed to upload photo" });
    }
  });

  app.delete("/api/photos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePhoto(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete photo" });
    }
  });

  // Annotation routes
  app.get("/api/photos/:photoId/annotations", async (req, res) => {
    try {
      const photoId = parseInt(req.params.photoId);
      const annotations = await storage.getAnnotationsByPhoto(photoId);
      res.json(annotations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch annotations" });
    }
  });

  app.post("/api/photos/:photoId/annotations", async (req, res) => {
    try {
      const photoId = parseInt(req.params.photoId);
      const validatedData = insertPhotoAnnotationSchema.parse({ ...req.body, photoId });
      const annotation = await storage.createAnnotation(validatedData);
      res.status(201).json(annotation);
    } catch (error) {
      res.status(400).json({ error: "Invalid annotation data" });
    }
  });

  app.delete("/api/annotations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAnnotation(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete annotation" });
    }
  });

  app.delete("/api/photos/:photoId/annotations", async (req, res) => {
    try {
      const photoId = parseInt(req.params.photoId);
      await storage.deleteAnnotationsByPhoto(photoId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete annotations" });
    }
  });

  // Standard Comment routes
  app.get("/api/standards/:standardId/comments", async (req, res) => {
    try {
      const standardId = parseInt(req.params.standardId);
      const comments = await storage.getCommentsByStandard(standardId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  app.post("/api/standards/:standardId/comments", async (req, res) => {
    try {
      const standardId = parseInt(req.params.standardId);
      const validatedData = insertStandardCommentSchema.parse({
        ...req.body,
        standardId
      });
      const comment = await storage.createComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ error: "Invalid comment data" });
    }
  });

  app.delete("/api/comments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteComment(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete comment" });
    }
  });

  // Judgment Photo routes
  app.get("/api/judgment-items/:itemId/photos", async (req, res) => {
    try {
      const itemId = req.params.itemId;
      const photos = await storage.getJudgmentPhotosByItem(itemId);
      res.json(photos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch photos" });
    }
  });

  app.get("/api/judgment-items/:itemId/photo-count", async (req, res) => {
    try {
      const itemId = req.params.itemId;
      const count = await storage.getJudgmentPhotoCount(itemId);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch photo count" });
    }
  });

  app.post("/api/judgment-items/:itemId/photos", upload.single("photo"), async (req, res) => {
    try {
      const itemId = req.params.itemId;
      const existingCount = await storage.getJudgmentPhotoCount(itemId);
      if (existingCount >= 10) {
        return res.status(400).json({ error: "Maximum 10 photos allowed per item" });
      }
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }
      const base64Data = req.file.buffer.toString("base64");
      const imageData = `data:${req.file.mimetype};base64,${base64Data}`;
      const validatedData = insertJudgmentPhotoSchema.parse({
        itemId,
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        imageData
      });
      const photo = await storage.createJudgmentPhoto(validatedData);
      res.status(201).json(photo);
    } catch (error) {
      res.status(400).json({ error: "Invalid photo data" });
    }
  });

  app.delete("/api/judgment-photos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteJudgmentPhoto(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete photo" });
    }
  });

  app.put("/api/judgment-photos/:id/order", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { sortOrder } = req.body;
      if (typeof sortOrder !== 'number') {
        return res.status(400).json({ error: "sortOrder must be a number" });
      }
      await storage.updateJudgmentPhotoOrder(id, sortOrder);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update photo order" });
    }
  });

  app.put("/api/judgment-items/:itemId/photos/reorder", async (req, res) => {
    try {
      const { photoIds } = req.body;
      if (!Array.isArray(photoIds)) {
        return res.status(400).json({ error: "photoIds must be an array" });
      }
      await storage.reorderJudgmentPhotos(photoIds);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to reorder photos" });
    }
  });

  // Judgment Comment routes
  app.get("/api/judgment-items/:itemId/comments", async (req, res) => {
    try {
      const itemId = req.params.itemId;
      const comments = await storage.getJudgmentCommentsByItem(itemId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  app.post("/api/judgment-items/:itemId/comments", async (req, res) => {
    try {
      const itemId = req.params.itemId;
      const validatedData = insertJudgmentCommentSchema.parse({
        ...req.body,
        itemId
      });
      const comment = await storage.createJudgmentComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ error: "Invalid comment data" });
    }
  });

  app.delete("/api/judgment-comments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteJudgmentComment(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete comment" });
    }
  });

  // Inspection Item Edit routes (for admin modifications synced across all users)
  app.get("/api/inspection-edits", async (req, res) => {
    try {
      const edits = await storage.getAllInspectionItemEdits();
      res.json(edits);
    } catch (error) {
      handleError(res, error, "Failed to fetch inspection edits");
    }
  });

  app.get("/api/inspection-edits/:itemId", async (req, res) => {
    try {
      const itemId = req.params.itemId;
      const edit = await storage.getInspectionItemEdit(itemId);
      if (!edit) {
        return res.status(404).json({ error: "Edit not found" });
      }
      res.json(edit);
    } catch (error) {
      handleError(res, error, "Failed to fetch inspection edits");
    }
  });

  app.put("/api/inspection-edits/:itemId", async (req, res) => {
    try {
      const itemId = req.params.itemId;
      const validatedData = insertInspectionItemEditSchema.parse({
        ...req.body,
        itemId
      });
      const edit = await storage.upsertInspectionItemEdit(validatedData);
      res.json(edit);
    } catch (error) {
      res.status(400).json({ error: "Invalid edit data" });
    }
  });

  // ── 표준화 오버라이드 API ──
  app.get("/api/std-overrides", async (req, res) => {
    try {
      const db = (await import("./db")).db;
      const { stdItemOverrides } = await import("@shared/schema");
      const rows = await db.select().from(stdItemOverrides);
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
      res.json(rows);
    } catch { res.status(500).json({ error: "Failed to fetch std overrides" }); }
  });

  app.put("/api/std-overrides/:title", async (req, res) => {
    try {
      const db = (await import("./db")).db;
      const { stdItemOverrides } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      const title = decodeURIComponent(req.params.title);
      const { overrideTitle, basis, conclusion, source, ref, typeTag, category } = req.body;
      const existing = await db.select().from(stdItemOverrides).where(eq(stdItemOverrides.title, title)).limit(1);
      let row;
      if (existing.length > 0) {
        [row] = await db.update(stdItemOverrides).set({ overrideTitle, basis, conclusion, source, ref, typeTag, category, updatedAt: new Date() }).where(eq(stdItemOverrides.title, title)).returning();
      } else {
        [row] = await db.insert(stdItemOverrides).values({ title, overrideTitle, basis, conclusion, source, ref, typeTag, category }).returning();
      }
      res.json(row);
    } catch (e) { res.status(500).json({ error: "Failed to save std override" }); }
  });

  // ── 검사기준 오버라이드 API ──
  app.get("/api/insp-std-overrides", async (req, res) => {
    try {
      const db = (await import("./db")).db;
      const { inspStdOverrides } = await import("@shared/schema");
      const rows = await db.select().from(inspStdOverrides);
      res.json(rows);
    } catch { res.status(500).json({ error: "Failed to fetch insp-std overrides" }); }
  });

  app.put("/api/insp-std-overrides/:itemKey", async (req, res) => {
    try {
      const db = (await import("./db")).db;
      const { inspStdOverrides } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      const itemKey = req.params.itemKey;
      const { text, source } = req.body;
      const existing = await db.select().from(inspStdOverrides).where(eq(inspStdOverrides.itemKey, itemKey)).limit(1);
      let row;
      if (existing.length > 0) {
        [row] = await db.update(inspStdOverrides).set({ text, source, updatedAt: new Date() }).where(eq(inspStdOverrides.itemKey, itemKey)).returning();
      } else {
        [row] = await db.insert(inspStdOverrides).values({ itemKey, text, source }).returning();
      }
      res.json(row);
    } catch (e) { res.status(500).json({ error: "Failed to save insp-std override" }); }
  });

    app.delete("/api/inspection-edits/:itemId", async (req, res) => {
    try {
      const itemId = req.params.itemId;
      await storage.deleteInspectionItemEdit(itemId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete inspection edit" });
    }
  });

  // Custom Inspection Item routes (for admin-added items synced across all users)
  app.get("/api/custom-items", async (req, res) => {
    try {
      const items = await storage.getAllCustomInspectionItems();
      res.json(items);
    } catch (error) {
      handleError(res, error, "Failed to fetch inspection edits");
    }
  });

  app.post("/api/custom-items", async (req, res) => {
    try {
      const validatedData = insertCustomInspectionItemSchema.parse(req.body)
      const item = await storage.createCustomInspectionItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid item data" });
    }
  });

  app.delete("/api/custom-items/:itemId", async (req, res) => {
    try {
      const itemId = req.params.itemId;
      await storage.deleteCustomInspectionItem(itemId);
      res.status(204).send();
    } catch (error) {
      handleError(res, error, "Failed to fetch custom items");
    }
  });

// PPE routes
  app.get("/api/ppe", async (req, res) => {
    try {
      const { employeeId, employeeName } = req.query as { employeeId?: string; employeeName?: string };
      const isAdmin = employeeId === "910919" && employeeName === "노준호";
      const items = await storage.getAllPpeItems();
      if (isAdmin) {
        res.json(items);
      } else if (employeeId && employeeName) {
        res.json(items.filter(i => i.employeeId === employeeId && i.employeeName === employeeName));
      } else {
        res.json([]);
      }
    } catch (error) {
      handleError(res, error, "Failed to fetch PPE items");
    }
  });

  app.post("/api/ppe", async (req, res) => {
    try {
      const validatedData = insertPpeItemSchema.parse(req.body);
      const item = await storage.createPpeItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid PPE data" });
    }
  });

  app.delete("/api/ppe/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePpeItem(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete PPE item" });
    }
  });

  // Near miss routes
  app.get("/api/near-misses", async (req, res) => {
    try {
      const items = await storage.getAllNearMisses();
      res.json(items);
    } catch (error) {
      handleError(res, error, "Failed to fetch near misses");
    }
  });

  app.post("/api/near-misses", async (req, res) => {
    try {
      const validatedData = insertNearMissSchema.parse(req.body);
      const item = await storage.createNearMiss(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid near miss data" });
    }
  });

  app.delete("/api/near-misses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteNearMiss(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete near miss" });
    }
  });

  // Judgment results routes
  app.get("/api/judgment-results/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const results = await storage.getJudgmentResults(sessionId);
      res.json(results);
    } catch (error) {
      handleError(res, error, "Failed to fetch judgment results");
    }
  });

  app.post("/api/judgment-results", async (req, res) => {
    try {
      const validatedData = insertJudgmentResultSchema.parse(req.body);
      const result = await storage.upsertJudgmentResult(validatedData);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid judgment result data" });
    }
  });


  // PPE routes
  app.get("/api/ppe", async (req, res) => {
    try { res.json(await storage.getAllPpeItems()); } catch (error) { handleError(res, error, "Failed to fetch PPE items"); }
  });
  app.post("/api/ppe", async (req, res) => {
    try { const d = insertPpeItemSchema.parse(req.body); res.status(201).json(await storage.createPpeItem(d)); } catch (error) { res.status(400).json({ error: "Invalid PPE data" }); }
  });
  app.delete("/api/ppe/:id", async (req, res) => {
    try { await storage.deletePpeItem(parseInt(req.params.id)); res.status(204).send(); } catch (error) { res.status(500).json({ error: "Failed to delete PPE item" }); }
  });

  // Near miss routes
  app.get("/api/near-misses", async (req, res) => {
    try { res.json(await storage.getAllNearMisses()); } catch (error) { handleError(res, error, "Failed to fetch near misses"); }
  });
  app.post("/api/near-misses", async (req, res) => {
    try { const d = insertNearMissSchema.parse(req.body); res.status(201).json(await storage.createNearMiss(d)); } catch (error) { res.status(400).json({ error: "Invalid near miss data" }); }
  });
  app.delete("/api/near-misses/:id", async (req, res) => {
    try { await storage.deleteNearMiss(parseInt(req.params.id)); res.status(204).send(); } catch (error) { res.status(500).json({ error: "Failed to delete near miss" }); }
  });

  // Judgment results routes
  app.get("/api/judgment-results/:sessionId", async (req, res) => {
    try { res.json(await storage.getJudgmentResults(req.params.sessionId)); } catch (error) { handleError(res, error, "Failed to fetch judgment results"); }
  });
  app.post("/api/judgment-results", async (req, res) => {
    try { const d = insertJudgmentResultSchema.parse(req.body); res.status(201).json(await storage.upsertJudgmentResult(d)); } catch (error) { res.status(400).json({ error: "Invalid judgment result data" }); }
  });


  // PPE routes
  app.get("/api/ppe", async (req, res) => {
    try { res.json(await storage.getAllPpeItems()); } catch (error) { handleError(res, error, "Failed to fetch PPE items"); }
  });
  app.post("/api/ppe", async (req, res) => {
    try { const d = insertPpeItemSchema.parse(req.body); res.status(201).json(await storage.createPpeItem(d)); } catch (error) { res.status(400).json({ error: "Invalid PPE data" }); }
  });
  app.delete("/api/ppe/:id", async (req, res) => {
    try { await storage.deletePpeItem(parseInt(req.params.id)); res.status(204).send(); } catch (error) { res.status(500).json({ error: "Failed to delete PPE item" }); }
  });

  // Near miss routes
  app.get("/api/near-misses", async (req, res) => {
    try { res.json(await storage.getAllNearMisses()); } catch (error) { handleError(res, error, "Failed to fetch near misses"); }
  });
  app.post("/api/near-misses", async (req, res) => {
    try { const d = insertNearMissSchema.parse(req.body); res.status(201).json(await storage.createNearMiss(d)); } catch (error) { res.status(400).json({ error: "Invalid near miss data" }); }
  });
  app.delete("/api/near-misses/:id", async (req, res) => {
    try { await storage.deleteNearMiss(parseInt(req.params.id)); res.status(204).send(); } catch (error) { res.status(500).json({ error: "Failed to delete near miss" }); }
  });

  // Judgment results routes
  app.get("/api/judgment-results/:sessionId", async (req, res) => {
    try { res.json(await storage.getJudgmentResults(req.params.sessionId)); } catch (error) { handleError(res, error, "Failed to fetch judgment results"); }
  });
  app.post("/api/judgment-results", async (req, res) => {
    try { const d = insertJudgmentResultSchema.parse(req.body); res.status(201).json(await storage.upsertJudgmentResult(d)); } catch (error) { res.status(400).json({ error: "Invalid judgment result data" }); }
  });



  // Inspection item revisions routes
  app.get("/api/inspection-revisions/:itemId", async (req, res) => {
    try {
      const revisions = await storage.getItemRevisions(req.params.itemId);
      res.json(revisions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch revisions" });
    }
  });
  app.post("/api/inspection-revisions", async (req, res) => {
    try {
      const revision = await storage.createItemRevision(req.body);
      res.status(201).json(revision);
    } catch (error) {
      res.status(400).json({ error: "Failed to create revision" });
    }
  });
  app.put("/api/inspection-revisions/:id", async (req, res) => {
    try {
      const updated = await storage.updateItemRevision(parseInt(req.params.id), req.body);
      if (!updated) return res.status(404).json({ error: "Revision not found" });
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: "Failed to update revision" });
    }
  });
  app.delete("/api/inspection-revisions/:id", async (req, res) => {
    try {
      await storage.deleteItemRevision(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete revision" });
    }
  });
  app.delete("/api/inspection-revisions/item/:itemId", async (req, res) => {
    try {
      await storage.deleteAllItemRevisions(req.params.itemId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete revisions" });
    }
  });



  // 통계 요약 API - 서버에서 공공데이터 가공 후 제공
  app.get("/api/stats-summary", async (req, res) => {
    try {
      const apiKey = process.env.PUBLIC_DATA_API_KEY_YEARLY || process.env.PUBLIC_DATA_API_KEY;
      if (!apiKey) return res.status(500).json({ error: "API key not configured" });

      const [yearlyRes, ageRes] = await Promise.all([
        fetch(`http://apis.data.go.kr/1741000/ElevatorSafetyAccidentsByYear/getElevatorSafetyAccidentsByYear?serviceKey=${apiKey}&pageNo=1&numOfRows=20&type=json`),
        fetch(`http://apis.data.go.kr/1741000/ElevatorSafetyAccidentsByAge/getElevatorSafetyAccidentsByAge?serviceKey=${apiKey}&pageNo=1&numOfRows=20&type=json`),
      ]);

      const yearlyData = await yearlyRes.json();
      const ageData = await ageRes.json();

      const yearly = yearlyData?.ElevatorSafetyAccidentsByYear?.[1]?.row || [];
      const age = ageData?.ElevatorSafetyAccidentsByAge?.[1]?.row || [];

      const latest = yearly[yearly.length - 1];
      const prev = yearly[yearly.length - 2];
      const latestAge = age[age.length - 1];

      if (!latest) return res.status(404).json({ error: "No data" });

      const total = parseInt(latest.safe_acci_smry);
      const prevTotal = prev ? parseInt(prev.safe_acci_smry) : null;
      const trend = prevTotal
        ? (total < prevTotal
          ? `전년(${prev.wrttimeid}년, ${prevTotal}건) 대비 ${prevTotal - total}건 감소`
          : `전년(${prev.wrttimeid}년, ${prevTotal}건) 대비 ${total - prevTotal}건 증가`)
        : "";

      const elderPct = latestAge
        ? Math.round(parseInt(latestAge.old65_mor) / parseInt(latestAge.tot) * 100)
        : 0;

      res.json({
        year: latest.wrttimeid,
        total: latest.safe_acci_smry,
        passenger: latest.safe_acci_only_passenger,
        freight: latest.safe_acci_only_freight,
        escalator: latest.safe_acci_escalator,
        deaths: latest.expcas_death,
        serious: latest.expcas_serious_injury,
        trend,
        elderPct,
        message: `행정안전부 승강기 안전사고 통계 (${latest.wrttimeid}년)\n\n• 전체 사고: ${latest.safe_acci_smry}건 (${trend})\n• 승객용 엘리베이터: ${latest.safe_acci_only_passenger}건\n• 화물용 엘리베이터: ${latest.safe_acci_only_freight}건\n• 에스컬레이터: ${latest.safe_acci_escalator}건\n• 사망: ${latest.expcas_death}명 / 중상: ${latest.expcas_serious_injury}명${elderPct > 0 ? `\n• 65세 이상 피해 비율: ${elderPct}%` : ""}\n\n빈도 높은 사고 유형\n1위  승강장문 열림 주행 — 문닫힘 안전장치 불량\n2위  피트 추락 — 최하층 정지장치 미작동\n3위  카 상부 끼임 — 점검운전 중 안전스위치 미사용`
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // 공공데이터 API 프록시 - 연도별 승강기 안전사고
  app.get("/api/elevator-accidents/yearly", async (req, res) => {
    try {
      const apiKey = process.env.PUBLIC_DATA_API_KEY_YEARLY || process.env.PUBLIC_DATA_API_KEY;
      if (!apiKey) return res.status(500).json({ error: "API key not configured" });
      const url = `http://apis.data.go.kr/1741000/ElevatorSafetyAccidentsByYear/getElevatorSafetyAccidentsByYear?serviceKey=${apiKey}&pageNo=1&numOfRows=20&type=json`;
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch yearly accident data" });
    }
  });

  // 공공데이터 API 프록시 - 연령별 승강기 안전사고
  app.get("/api/elevator-accidents/age", async (req, res) => {
    try {
      const apiKey = process.env.PUBLIC_DATA_API_KEY_AGE || process.env.PUBLIC_DATA_API_KEY;
      if (!apiKey) return res.status(500).json({ error: "API key not configured" });
      const url = `http://apis.data.go.kr/1741000/ElevatorSafetyAccidentsByAge/getElevatorSafetyAccidentsByAge?serviceKey=${apiKey}&pageNo=1&numOfRows=20&type=json`;
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch age accident data" });
    }
  });

  // App settings routes
  app.get("/api/settings/:key", async (req, res) => {
    try {
      const value = await storage.getSetting(req.params.key);
      res.json({ key: req.params.key, value });
    } catch (error) {
      res.status(500).json({ error: "Failed to get setting" });
    }
  });
  app.post("/api/settings", async (req, res) => {
    try {
      const { key, value } = req.body;
      await storage.setSetting(key, value);
      res.json({ key, value });
    } catch (error) {
      res.status(500).json({ error: "Failed to save setting" });
    }
  });

  // 항목별 댓글 수 일괄 조회
  app.get("/api/judgment-items/comment-counts", async (req, res) => {
    try {
      const counts = await storage.getItemCommentCounts();
      res.json(counts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comment counts" });
    }
  });

  // 항목별 댓글 수 일괄 조회
  app.get("/api/judgment-items/comment-counts", async (req, res) => {
    try {
      const counts = await storage.getItemCommentCounts();
      res.json(counts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comment counts" });
    }
  });

  // 메모 댓글 API
  app.get("/api/memos/:memoId/comments", async (req, res) => {
    try {
      const comments = await storage.getMemoComments(parseInt(req.params.memoId));
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch memo comments" });
    }
  });

  app.post("/api/memos/:memoId/comments", async (req, res) => {
    try {
      const comment = await storage.createMemoComment({
        memoId: parseInt(req.params.memoId),
        author: req.body.author,
        content: req.body.content,
      });
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ error: "Failed to create memo comment" });
    }
  });

  app.delete("/api/memo-comments/:id", async (req, res) => {
    try {
      await storage.deleteMemoComment(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete memo comment" });
    }
  });

  // 검사기준 DB API
  app.get("/api/inspection-base-items", async (req, res) => {
    try {
      const items = await storage.getInspectionBaseItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inspection base items" });
    }
  });

  app.get("/api/inspection-base-items/:itemId", async (req, res) => {
    try {
      const item = await storage.getInspectionBaseItem(req.params.itemId);
      if (!item) return res.status(404).json({ error: "Not found" });
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inspection base item" });
    }
  });

  // ==================== AI 챗봇 ====================
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, context } = req.body as {
        messages: { role: "user" | "assistant"; content: string }[];
        context?: {
          inspCtx?: { priority: string; title: string; ref: string; content: string }[];
          techCtx?: { priority: string; title: string; ref: string; basis: string; conclusion: string; source: string }[];
          chatCtx?: { priority: string; content: string; note: string }[];
        };
      };

      if (!messages || messages.length === 0) {
        return res.status(400).json({ error: "messages 필드가 필요합니다." });
      }

      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      // 우선순위별 컨텍스트 → 시스템 프롬프트 주입
      let contextText = "";

      if (context) {
        const sections: string[] = [];

        // 1순위: 검사기준(별표22)
        if (context.inspCtx && context.inspCtx.length > 0) {
          sections.push("## [1순위] 검사기준 (별표22)\n" +
            context.inspCtx.map(c =>
              `■ ${c.title}${c.ref ? ` [${c.ref}]` : ""}\n${c.content}`
            ).join("\n\n")
          );
        }

        // 2순위: 기술자료(표준화)
        if (context.techCtx && context.techCtx.length > 0) {
          sections.push("## [2순위] 기술자료 (표준화)\n" +
            context.techCtx.map(c =>
              `■ ${c.title} (${c.ref})\n` +
              (c.basis ? `현안: ${c.basis}\n` : "") +
              (c.conclusion ? `표준화결정: ${c.conclusion}\n` : "") +
              `출처: ${c.source}`
            ).join("\n\n")
          );
        }

        // 3순위: 채팅 참고 (현장 의견 — 공식 기준 아님)
        if (context.chatCtx && context.chatCtx.length > 0) {
          sections.push("## [3순위] 채팅 참고 (현장 의견 — 공식 기준 아님, 참고만 할 것)\n" +
            context.chatCtx.map(c => `• ${c.content}`).join("\n")
          );
        }

        if (sections.length > 0) {
          contextText = "\n\n---\n" + sections.join("\n\n") + "\n---";
        }
      }

      const systemPrompt = `당신은 승강기 안전검사 현장 전문가다. 검사원이 현장에서 바로 판단에 쓸 수 있는 답을 준다.

## 참고 자료 활용 규칙
아래에 [1순위] [2순위] [3순위] 자료가 제공된다.
- **[1순위] 검사기준(별표22)** — 가장 먼저 인용. 조문번호와 수치를 그대로 사용
- **[2순위] 기술자료(표준화)** — 검사기준에 없거나 보완이 필요할 때 인용
- **[3순위] 채팅참고** — 공식 기준 아님. 현장 분위기 파악용으로만 참고. 답변에 직접 인용 금지

## 답변 규칙
- **결론부터** — 첫 문장에 판정(적합/부적합/시정권고/해당없음) 또는 핵심 답
- **조문번호 명시** — [별표22] X.X.X, 승강기안전관리법 제X조 형식으로
- **수치 굵게** — **0.5m**, **125%** 처럼
- **필요한 말만** — "참고사항", "권장 조치", "추가 검토", "주의사항" 섹션 만들지 않음
- **모를 때** — "기준 없음" 또는 "공단 확인 필요" 한 줄로 끝냄
- 인사·서론·마무리 없음
- **표(|---|) 절대 금지** — 마크다운 표는 앱에서 렌더링 안 됨. 여러 항목은 아래처럼 줄바꿈+불릿으로 표현:
  • 3.1.10(10): 1997.08.18 이후 건축허가분
  • 16.1.1-9라(6): 2013.09.15 이후 건축허가분
  • 17.1.5.5: 2019.03.28 이후 건축허가분

## 출처 표시 규칙 (필수)
답변 마지막에 반드시 다음 형식으로 출처를 표시:
> 📌 근거: [검사기준] 조문번호 | [기술자료] 표준화명 | [검사가이드] 항목명
- 실제로 답변에 활용한 자료만 표시
- [별표22] X.X.X 형식 조문은 [검사기준] 태그로 표시
- 표준화 자료는 [기술자료] 태그로 표시
- 검사가이드 항목은 [검사가이드] 태그로 표시${contextText}`

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        system: systemPrompt,
        messages: messages,
      });

      const reply = response.content[0].type === "text" ? response.content[0].text : "";

      // AI 사용량 DB 저장 (모든 사용자 누적 — 껐다 켜도 DB에 영구 보존)
      try {
        const { db: uDb } = await import("./db");
        const { aiUsage } = await import("@shared/schema");
        const usage = response.usage;
        const inputTok = usage?.input_tokens || 0;
        const outputTok = usage?.output_tokens || 0;
        // Sonnet 4.6: input $3/1M, output $15/1M
        const cost = ((inputTok * 3 + outputTok * 15) / 1_000_000).toFixed(6);
        const question = Array.isArray(messages) && messages.length > 0
          ? String(messages[messages.length - 1]?.content || "").slice(0, 200)
          : "";
        await uDb.insert(aiUsage).values({
          question,
          inputTokens: inputTok,
          outputTokens: outputTok,
          costUsd: cost,
        });
      } catch (e) {
        console.error("[usage 저장 오류]", e);
      }

      res.json({ reply });

    } catch (error: any) {
      console.error("Chat API error:", error?.message || error);
      console.error("Chat API error status:", error?.status);
      console.error("ANTHROPIC_API_KEY set:", !!process.env.ANTHROPIC_API_KEY);
      const msg = error?.status === 401 ? "API 키 오류"
        : error?.status === 429 ? "요청 한도 초과"
        : error?.message || "AI 응답 생성 오류";
      res.status(500).json({ error: msg });
    }
  });

  // ==================== Rerank (검색 후 관련성 재순위) ====================
  app.post("/api/rerank", async (req, res) => {
    try {
      const { question, candidates, coreTerms, secondaryTerms } = req.body as {
        question: string;
        candidates: { id: string; title: string; content: string; type: string }[];
        coreTerms?: string[];
        secondaryTerms?: string[];
      };
      if (!question || !candidates?.length) return res.json({ ranked: [] });

      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      const primaryStr = coreTerms && coreTerms.length > 0
        ? `주 키워드(반드시 포함): [${coreTerms.join(", ")}]`
        : "";
      const secondaryStr = secondaryTerms && secondaryTerms.length > 0
        ? `보조 키워드(의도 파악용): [${secondaryTerms.join(", ")}]`
        : "";

      const candidateList = candidates.slice(0, 15).map((c, i) =>
        `${i + 1}. [${c.type}] ${c.title}: ${c.content.slice(0, 150)}`
      ).join("\n");

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 200,
        system: `승강기 안전검사 전문가다. 후보 항목 중 질문과 직접 관련된 항목을 선별해. 규칙:
1. ${primaryStr} — 주 키워드가 항목 제목 또는 내용에 직접 포함된 항목 우선
2. ${secondaryStr} — 보조 키워드는 의도 파악에만 활용 (예: "적용"→날짜 포함 항목 선호)
3. 주 키워드 없이 날짜·수치만 있는 항목은 제외
4. 관련성 높은 순으로 최대 3개 번호만 JSON 배열로 반환. 예: [1,3] 다른 텍스트 없이 JSON만.`,
        messages: [{ role: "user", content: `질문: "${question}"\n${primaryStr}\n${secondaryStr}\n\n후보:\n${candidateList}` }],
      });

      const raw = response.content[0].type === "text" ? response.content[0].text.trim() : "[]";
      const indices: number[] = JSON.parse(raw.replace(/```json|```/g, "").trim());
      const ranked = indices
        .filter((i: number) => i >= 1 && i <= candidates.length)
        .map((i: number) => candidates[i - 1]);

      res.json({ ranked });
    } catch (e) {
      res.json({ ranked: [] });
    }
  });

  // ==================== Query Rewriting (CORS 프록시) ====================
  app.post("/api/query-rewrite", async (req, res) => {
    try {
      const { question } = req.body;
      if (!question) return res.json({ queries: [] });
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const response = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 100,
        system: '승강기 안전검사 전문가다. 사용자 질문에서 별표22·표준화 검색에 쓸 핵심어를 최대 3개 추출해 JSON 배열만 반환해. 적용시기/언제부터 질문이면 반드시 "건축허가일" 또는 "적용" 포함. 검사방법·확인방법 위주 항목(가나다 세부항목)이 아닌 기준 조문 위주로. 예: ["자동구출운전","건축허가일","2017"] 다른 텍스트 없이 JSON만.',
        messages: [{ role: "user", content: question }],
      });
      const raw = response.content[0].type === "text" ? response.content[0].text.trim() : "[]";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      res.json({ queries: Array.isArray(parsed) ? parsed : [] });
    } catch (e) {
      res.json({ queries: [] });
    }
  });

  // ==================== AI 사용량 통계 ====================
  app.get("/api/ai-usage/stats", async (req, res) => {
    try {
      const { db: usageDb } = await import("./db");
      const { aiUsage } = await import("@shared/schema");
      const { gte, desc: usageDesc } = await import("drizzle-orm");

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const allRows = await usageDb.select().from(aiUsage).where(gte(aiUsage.createdAt, monthStart));

      const totalQuestions = allRows.length;
      const totalInput = allRows.reduce((s, r) => s + r.inputTokens, 0);
      const totalOutput = allRows.reduce((s, r) => s + r.outputTokens, 0);
      const totalCost = allRows.reduce((s, r) => s + parseFloat(r.costUsd), 0);

      // 최근 7일 일별
      const daily: Record<string, { input: number; output: number; cost: number }> = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        daily[d.toISOString().slice(0, 10)] = { input: 0, output: 0, cost: 0 };
      }
      allRows.forEach(r => {
        const key = new Date(r.createdAt).toISOString().slice(0, 10);
        if (daily[key]) {
          daily[key].input += r.inputTokens;
          daily[key].output += r.outputTokens;
          daily[key].cost += parseFloat(r.costUsd);
        }
      });

      const recentLogs = await usageDb.select().from(aiUsage).orderBy(usageDesc(aiUsage.id)).limit(10);
      res.json({ totalQuestions, totalInput, totalOutput, totalCost: totalCost.toFixed(4), daily, recentLogs });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // ==================== 채팅 ====================
  const { db: chatDb } = await import("./db");
  const { chatMessages: chatMsgsTable } = await import("@shared/schema");
  const { asc: chatAsc, desc: chatDesc2, ilike: chatIlike, lt: chatLt, gt: chatGt2, and: chatAnd, or: chatOr } = await import("drizzle-orm");

  // chat_messages 인덱스 생성 (최초 1회)
  try {
    const { pool: chatPool } = await import("./db");
    await chatPool.query(`CREATE INDEX IF NOT EXISTS idx_chat_messages_id ON chat_messages(id DESC)`);
    await chatPool.query(`CREATE INDEX IF NOT EXISTS idx_chat_messages_content ON chat_messages USING gin(to_tsvector('simple', content))`);
  } catch {}

  app.get("/api/chat-messages", async (req, res) => {
    try {
      const { search, limit = "50", before, after } = req.query as Record<string, string>;
      let query = chatDb.select().from(chatMsgsTable).$dynamic();
      const conditions = [];
      if (search) {
        // 검색어를 공백으로 분리해서 각 단어별 OR 검색
        const decoded = decodeURIComponent(search);
        const words = decoded.split(/\s+/).filter((w: string) => w.length >= 2);
        if (words.length > 1) {
          // 여러 단어: 각 단어를 OR로 검색 (단어 중 하나라도 포함)
          const wordConds = words.map((w: string) => chatIlike(chatMsgsTable.content, `%${w}%`));
          conditions.push(chatOr(...wordConds));
        } else {
          conditions.push(chatIlike(chatMsgsTable.content, `%${decoded}%`));
        }
      }
      if (before) conditions.push(chatLt(chatMsgsTable.id, parseInt(before)));
      if (after) conditions.push(chatGt2(chatMsgsTable.id, parseInt(after)));
      if (conditions.length) query = query.where(chatAnd(...conditions));
      // search 있을 때: desc(최신 우선) + 넉넉한 limit
      // search 없을 때: asc(오래된 것 먼저)
      const searchLimit = search ? Math.max(parseInt(limit), 100) : parseInt(limit);
      const msgs = await query
        .orderBy(search ? chatDesc2(chatMsgsTable.id) : chatAsc(chatMsgsTable.id))
        .limit(searchLimit);
      res.setHeader('Cache-Control', 'no-store');
      res.json(msgs);
    } catch (e) { res.status(500).json({ error: "Failed to fetch messages" }); }
  });

  app.post("/api/chat-messages", async (req, res) => {
    try {
      const { userName, content, replyToId, replyToUser, replyToContent, imageData, videoData, videoMime } = req.body;
      if (!userName?.trim() || (!content?.trim() && !imageData && !videoData)) return res.status(400).json({ error: "필수 값 누락" });
      const db = (await import("./db")).db;
      const { chatMessages } = await import("@shared/schema");
      const [msg] = await db.insert(chatMessages).values({
        userName: userName.trim().slice(0, 50),
        content: (content || "").trim().slice(0, 2000),
        replyToId: replyToId || null,
        replyToUser: replyToUser || null,
        replyToContent: replyToContent?.slice(0, 100) || null,
        imageData: imageData || null,
        videoData: videoData || null,
        videoMime: videoMime || null,
      }).returning();
      res.json(msg);
    } catch (e) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // 메시지 soft delete
  app.delete("/api/chat-messages/:id", async (req, res) => {
    try {
      const db = (await import("./db")).db;
      const { chatMessages } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      const id = parseInt(req.params.id);
      const [msg] = await db.update(chatMessages)
        .set({ deletedAt: new Date(), content: "", imageData: null, imageThumbnail: null, videoData: null })
        .where(eq(chatMessages.id, id))
        .returning();
      res.json(msg);
    } catch (e) { res.status(500).json({ error: "Failed to delete" }); }
  });

  // 서버 시작 시 15일 이상 이미지 → 50px 썸네일로 교체
  (async () => {
    try {
      const db = (await import("./db")).db;
      const { chatMessages } = await import("@shared/schema");
      const { lt, and, isNotNull, isNull } = await import("drizzle-orm");
      const cutoff = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
      // imageData가 있고 imageThumbnail이 없고 15일 이상 된 메시지
      const expired = await db.select({ id: chatMessages.id, imageData: chatMessages.imageData })
        .from(chatMessages)
        .where(and(lt(chatMessages.createdAt, cutoff), isNotNull(chatMessages.imageData), isNull(chatMessages.imageThumbnail)));
      for (const row of expired) {
        if (!row.imageData || row.imageData === "CACHED") continue;
        // 50px 초소형 썸네일 생성 (서버에서는 base64 그대로 유지, 표시 크기만 제한)
        // imageThumbnail = imageData 앞 2000자 (50px 수준 blur 효과용)
        const thumb = row.imageData.slice(0, 2000);
        await db.update(chatMessages).set({ imageThumbnail: thumb, imageData: null })
          .where((await import("drizzle-orm")).eq(chatMessages.id, row.id));
      }
      if (expired.length > 0) console.log(`[이미지 만료] ${expired.length}개 처리 완료`);
    } catch (e) { console.error("[이미지 만료 처리 오류]", e); }
  })();

  // ==================== 표준화 항목 이미지 ====================
  const STD_PHOTO_DELETE_PW = "910919";

  app.get("/api/std-photos/:itemKey", async (req, res) => {
    try {
      const db = (await import("./db")).db;
      const { stdItemPhotos } = await import("@shared/schema");
      const { eq, asc } = await import("drizzle-orm");
      const key = decodeURIComponent(req.params.itemKey);
      const photos = await db.select({
        id: stdItemPhotos.id,
        displayOrder: stdItemPhotos.displayOrder,
        mimeType: stdItemPhotos.mimeType,
        createdAt: stdItemPhotos.createdAt,
      }).from(stdItemPhotos).where(eq(stdItemPhotos.itemKey, key)).orderBy(asc(stdItemPhotos.displayOrder));
      res.json(photos);
    } catch (e) { res.status(500).json({ error: "Failed" }); }
  });

  app.get("/api/std-photos/:itemKey/:id/image", async (req, res) => {
    try {
      const db = (await import("./db")).db;
      const { stdItemPhotos } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      const [photo] = await db.select().from(stdItemPhotos).where(eq(stdItemPhotos.id, parseInt(req.params.id)));
      if (!photo) return res.status(404).json({ error: "Not found" });
      const b64 = photo.imageData.replace(/^data:image\/\w+;base64,/, '');
      res.setHeader('Content-Type', photo.mimeType || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(Buffer.from(b64, 'base64'));
    } catch (e) { res.status(500).json({ error: "Failed" }); }
  });

  app.post("/api/std-photos/:itemKey", upload.single('image'), async (req, res) => {
    try {
      const db = (await import("./db")).db;
      const { stdItemPhotos } = await import("@shared/schema");
      const { eq, count } = await import("drizzle-orm");
      const key = decodeURIComponent(req.params.itemKey);
      const [{ value: cnt }] = await db.select({ value: count() }).from(stdItemPhotos).where(eq(stdItemPhotos.itemKey, key));
      if (Number(cnt) >= 10) return res.status(400).json({ error: "최대 10장" });
      if (!req.file) return res.status(400).json({ error: "No image" });
      const base64Data = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const [photo] = await db.insert(stdItemPhotos).values({
        itemKey: key,
        imageData: base64Data,
        mimeType: req.file.mimetype,
        displayOrder: Number(cnt),
      }).returning({ id: stdItemPhotos.id, displayOrder: stdItemPhotos.displayOrder, mimeType: stdItemPhotos.mimeType, createdAt: stdItemPhotos.createdAt });
      res.status(201).json(photo);
    } catch (e) { res.status(500).json({ error: "Failed" }); }
  });

  app.delete("/api/std-photos/:id", async (req, res) => {
    try {
      const { password } = req.body;
      if (password !== STD_PHOTO_DELETE_PW) return res.status(403).json({ error: "비밀번호 오류" });
      const db = (await import("./db")).db;
      const { stdItemPhotos } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      await db.delete(stdItemPhotos).where(eq(stdItemPhotos.id, parseInt(req.params.id)));
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: "Failed" }); }
  });

  // ── 종전 기준 일괄 seed (서버 내부용) ──
  app.post("/api/inspection-revisions/bulk-seed", async (req, res) => {
    try {
      const { secret, revisions } = req.body;
      if (secret !== "seed-2009-67") return res.status(403).json({ error: "forbidden" });
      const db2 = (await import("./db")).db;
      const { inspectionItemRevisions } = await import("@shared/schema");
      const { eq, and } = await import("drizzle-orm");
      let added = 0, skipped = 0;
      for (const rev of revisions) {
        // 동일 itemId + expiryDate + description 앞 20자 중복 방지
        const existing = await db2.select().from(inspectionItemRevisions)
          .where(and(
            eq(inspectionItemRevisions.itemId, rev.itemId),
            eq(inspectionItemRevisions.expiryDate, rev.expiryDate || "")
          ));
        const descKey = (rev.description || "").slice(0, 20);
        const dup = existing.some(r => (r.description || "").startsWith(descKey));
        if (dup) { skipped++; continue; }
        await db2.insert(inspectionItemRevisions).values({
          itemId: rev.itemId,
          effectiveDate: rev.effectiveDate || null,
          expiryDate: rev.expiryDate || null,
          introductionType: rev.introductionType || "revision",
          description: rev.description || "",
        });
        added++;
      }
      res.json({ added, skipped });
    } catch (e) { res.status(500).json({ error: String(e) }); }
  });

  const httpServer = createServer(app);

  return httpServer;
}
