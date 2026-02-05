import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { insertCategorySchema, insertStandardSchemaExt, insertHotspotSchema, insertMemoSchema, insertPhotoAnnotationSchema, insertStandardCommentSchema, insertJudgmentPhotoSchema, insertJudgmentCommentSchema, insertInspectionItemEditSchema, insertCustomInspectionItemSchema } from "@shared/schema";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

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
      res.status(500).json({ error: "Failed to fetch memos" });
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
      res.status(500).json({ error: "Failed to fetch inspection edits" });
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
      res.status(500).json({ error: "Failed to fetch inspection edit" });
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
      res.status(500).json({ error: "Failed to fetch custom items" });
    }
  });

  app.post("/api/custom-items", async (req, res) => {
    try {
      const validatedData = insertCustomInspectionItemSchema.parse(req.body);
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
      res.status(500).json({ error: "Failed to delete custom item" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
