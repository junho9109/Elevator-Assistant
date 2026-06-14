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
        context?: { title: string; ref?: string; basis?: string; conclusion?: string; source?: string }[];
      };

      if (!messages || messages.length === 0) {
        return res.status(400).json({ error: "messages 필드가 필요합니다." });
      }

      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      // 검색된 관련 자료를 시스템 프롬프트에 포함
      const contextText = context && context.length > 0
        ? `\n\n[관련 표준화 자료]\n` + context.map((c, i) =>
            `${i + 1}. **${c.title}**\n` +
            (c.ref ? `   근거: ${c.ref}\n` : "") +
            (c.basis ? `   검사기준: ${c.basis}\n` : "") +
            (c.conclusion ? `   표준화 결론: ${c.conclusion}\n` : "") +
            (c.source ? `   출처: ${c.source}` : "")
          ).join("\n\n")
        : "";

      const systemPrompt = `당신은 한국 승강기 안전 검사 전문 어시스턴트입니다.
승강기 안전검사기준, 검사 판정 방법, 표준화 자료를 기반으로 검사원들의 질문에 정확하고 실용적으로 답변합니다.

답변 원칙:
- 검사기준 조문번호([별표1] 등)를 가능하면 명시
- 판정 기준(합격/조건부합격/불합격/시정권고)을 명확히 제시
- 종전/개정 기준 구분이 필요한 경우 명시
- 모르거나 불확실한 내용은 솔직히 밝히고 공식 기준 확인 권고
- 답변은 간결하고 현장에서 바로 활용할 수 있도록 작성${contextText}`;

      const response = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages,
      });

      const reply = response.content[0].type === "text" ? response.content[0].text : "";
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

  const httpServer = createServer(app);

  return httpServer;
}
