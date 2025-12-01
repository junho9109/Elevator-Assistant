import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCategorySchema, insertStandardSchemaExt, insertHotspotSchema } from "@shared/schema";

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

  const httpServer = createServer(app);

  return httpServer;
}
