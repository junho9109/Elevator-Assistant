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

  // AI 답변 피드백 API
  // OpenAI 임베딩 생성 헬퍼 (네트워크가 막혀있는 등의 상황에서 무한 대기하지 않도록 8초 타임아웃)
  async function getEmbedding(text: string): Promise<number[] | null> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const resp = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "text-embedding-3-small",
          input: text.slice(0, 8000),
        }),
        signal: controller.signal,
      });
      if (!resp.ok) {
        const errText = await resp.text().catch(() => "");
        console.error(`[임베딩] OpenAI 응답 오류 status=${resp.status}:`, errText.slice(0, 300));
        return null;
      }
      const data = await resp.json();
      return data?.data?.[0]?.embedding || null;
    } catch (e) {
      console.error("[임베딩] 생성 실패:", e);
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }

  // 질문 임베딩 유사도로 answer_pool 클러스터링 — POST /api/ai-feedback 및 재구축(rebuild) 양쪽에서 공유
  // (질문 문자열이나 답변 문자열이 토씨 하나라도 다르면 별개로 취급하던 기존 방식은
  //  LLM 답변이 매번 표현이 달라지는 특성상 사실상 절대 3표 문턱에 도달하지 못했음.
  //  → 질문을 임베딩해 기존 클러스터들과 코사인 유사도를 비교, 표현이 달라도
  //  같은 취지의 질문이면 같은 클러스터로 묶어 좋아요/아쉬워요를 누적한다)
  const CLUSTER_SIMILARITY_THRESHOLD = 0.88;
  async function applyFeedbackToPool(pool: any, question: string, answer: string, rating: number) {
    const questionEmbedding = await getEmbedding(question);
    return applyFeedbackToPoolWithEmbedding(pool, question, answer, rating, questionEmbedding);
  }
  // 임베딩을 미리 계산해둔 경우(재구축 시 여러 건을 병렬로 임베딩 후 순차 반영할 때) 사용하는 버전
  async function applyFeedbackToPoolWithEmbedding(pool: any, question: string, answer: string, rating: number, questionEmbedding: number[] | null) {
    if (!questionEmbedding) {
      console.error("[피드백 클러스터링] OpenAI 임베딩 생성 실패 — 이 피드백은 독립 클러스터로 저장됩니다 (OPENAI_API_KEY 확인 필요)");
    }

    let matched: { id: number; thumbs_up: number; thumbs_down: number; status: string } | null = null;
    if (questionEmbedding) {
      const vecStr = `[${questionEmbedding.join(",")}]`;
      const nearest = await pool.query(
        `SELECT id, thumbs_up, thumbs_down, status, 1 - (embedding <=> $1::vector) as similarity
         FROM ai_answer_pool WHERE embedding IS NOT NULL
         ORDER BY embedding <=> $1::vector LIMIT 1`,
        [vecStr]
      );
      if (nearest.rows.length > 0 && nearest.rows[0].similarity >= CLUSTER_SIMILARITY_THRESHOLD) {
        matched = nearest.rows[0];
      }
    }
    const previousStatus = matched ? matched.status : 'pending';

    let thumbsUp = 0, thumbsDown = 0, poolId;
    if (matched) {
      poolId = matched.id;
      thumbsUp = matched.thumbs_up + (rating === 1 ? 1 : 0);
      thumbsDown = matched.thumbs_down + (rating === -1 ? 1 : 0);
      // 좋아요를 받은 경우 클러스터 대표 답변을 이번 답변으로 갱신 (참고 자료가 계속 최신 상태 유지)
      if (rating === 1) {
        await pool.query(
          `UPDATE ai_answer_pool SET thumbs_up = $1, thumbs_down = $2, answer = $3, updated_at = NOW() WHERE id = $4`,
          [thumbsUp, thumbsDown, answer, poolId]
        );
      } else {
        await pool.query(
          `UPDATE ai_answer_pool SET thumbs_up = $1, thumbs_down = $2, updated_at = NOW() WHERE id = $3`,
          [thumbsUp, thumbsDown, poolId]
        );
      }
    } else {
      // 유사한 기존 클러스터가 없으면 새 클러스터 생성 (임베딩 생성 실패 시 embedding은 NULL로 저장 — 추후 매칭 대상에서만 제외되고 pending으로는 유지)
      thumbsUp = rating === 1 ? 1 : 0;
      thumbsDown = rating === -1 ? 1 : 0;
      const vecStr = questionEmbedding ? `[${questionEmbedding.join(",")}]` : null;
      const inserted = await pool.query(
        `INSERT INTO ai_answer_pool (question, answer, thumbs_up, thumbs_down, embedding) VALUES ($1, $2, $3, $4, $5::vector) RETURNING id`,
        [question, answer, thumbsUp, thumbsDown, vecStr]
      );
      poolId = inserted.rows[0].id;
    }

    // 상태 자동 분류: 고정 3표 문턱 대신 순 점수(좋아요-아쉬워요)로 판단 —
    // 사용자 수가 적어 같은 취지의 질문에 3명이 좋아요를 누르는 일이 드물기 때문에,
    // 첫 좋아요부터 바로 승인하고 이후 아쉬워요가 더 쌓이면 즉시 재검토(제외)되도록 함
    let newStatus: 'pending' | 'approved' | 'excluded' = 'pending';
    if (thumbsUp > thumbsDown) newStatus = 'approved';
    else if (thumbsDown > thumbsUp) newStatus = 'excluded';
    await pool.query(`UPDATE ai_answer_pool SET status = $1 WHERE id = $2`, [newStatus, poolId]);

    const statusChangedToExcluded = previousStatus !== 'excluded' && newStatus === 'excluded';
    return { poolId, thumbsUp, thumbsDown, newStatus, matchedExisting: !!matched, statusChangedToExcluded };
  }

  // 유사 질문 검색 — approved 답변 중 가장 유사한 것 반환
  app.post("/api/ai-similar-answers", async (req, res) => {
    try {
      const { question } = req.body;
      if (!question) return res.json([]);
      const embedding = await getEmbedding(question);
      if (!embedding) return res.json([]);

      const { pool } = await import("./db");
      const vecStr = `[${embedding.join(",")}]`;
      const rows = await pool.query(
        `SELECT question, answer, thumbs_up,
                1 - (embedding <=> $1::vector) as similarity
         FROM ai_answer_pool
         WHERE status = 'approved' AND embedding IS NOT NULL
         ORDER BY embedding <=> $1::vector
         LIMIT 2`,
        [vecStr]
      );
      // 유사도 0.82 이상만 반환 (너무 다른 질문 배제)
      const filtered = rows.rows.filter((r: any) => r.similarity >= 0.82);
      res.json(filtered);
    } catch (e) {
      res.json([]);
    }
  });

  app.post("/api/ai-feedback", async (req, res) => {
    try {
      const { question, answer, rating, sections, reasons, comment } = req.body;
      if (!question || !answer || ![1, -1].includes(rating)) {
        return res.status(400).json({ error: "잘못된 요청" });
      }
      const { pool } = await import("./db");

      // 1) 피드백 로그 저장 (섹션/이유/기타의견 포함)
      await pool.query(
        `INSERT INTO ai_feedback (question, answer, rating, sections, reasons, comment) VALUES ($1, $2, $3, $4, $5, $6)`,
        [question, answer, rating, sections || [], reasons || [], comment || null]
      );

      // 2) answer_pool 업데이트 — 질문 임베딩 유사도로 클러스터링해서 누적 (공유 헬퍼 사용)
      const { thumbsUp, thumbsDown, newStatus, statusChangedToExcluded } = await applyFeedbackToPool(pool, question, answer, rating);

      // 3) 클러스터가 새로 제외(excluded) 상태로 전환되는 순간 관리자에게 FCM 알림
      if (statusChangedToExcluded) {
        try {
          if (firebaseAdmin) {
            const tokenRows = await pool.query(`SELECT token FROM push_tokens`);
            const tokens = tokenRows.rows.map((r: any) => r.token).filter(Boolean);
            await Promise.allSettled(
              tokens.map((token: string) =>
                firebaseAdmin.messaging().send({
                  token,
                  notification: {
                    title: "⚠️ AI 답변 부정 피드백 누적",
                    body: `질문: ${question.slice(0, 50)}`,
                  },
                  android: { priority: "high" },
                })
              )
            );
          }
        } catch (e) {}
      }

      res.json({ ok: true, thumbsUp, thumbsDown, status: newStatus });
    } catch (e) {
      res.status(500).json({ error: "피드백 저장 실패" });
    }
  });

  // 관리자 모드: 이용자들이 남긴 좋아요/아쉬워요 피드백 전체를 CSV로 다운로드
  app.get("/api/ai-feedback/export", async (req, res) => {
    try {
      const { pool } = await import("./db");
      const rows = await pool.query(
        `SELECT id, question, answer, rating, sections, reasons, comment, created_at
         FROM ai_feedback ORDER BY created_at DESC`
      );

      const escapeCsv = (v: any) => {
        if (v === null || v === undefined) return "";
        const s = Array.isArray(v) ? v.join("; ") : String(v);
        return `"${s.replace(/"/g, '""')}"`;
      };

      const header = ["id", "일시", "평가", "질문", "답변", "선택항목", "이유", "기타의견"];
      const lines = [header.map(escapeCsv).join(",")];
      for (const r of rows.rows) {
        lines.push([
          r.id,
          r.created_at ? new Date(r.created_at).toISOString().slice(0, 19).replace("T", " ") : "",
          r.rating === 1 ? "좋아요" : r.rating === -1 ? "아쉬워요" : r.rating,
          r.question,
          r.answer,
          r.sections,
          r.reasons,
          r.comment,
        ].map(escapeCsv).join(","));
      }
      const csv = "﻿" + lines.join("\r\n"); // BOM: 엑셀 한글 깨짐 방지

      const filename = `ai_feedback_${new Date().toISOString().slice(0, 10)}.csv`;
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.send(csv);
    } catch (e: any) {
      res.status(500).json({ error: e.message || "피드백 내보내기 실패" });
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
      console.error("[POST /api/standards 오류]", error);
      res.status(400).json({ error: "Invalid standard data", detail: String(error) });
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
        author: req.body.author || "",
        itemId
      });
      const comment = await storage.createJudgmentComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ error: "Invalid comment data" });
    }
  });

  // ── 기술자료(표준화) 댓글 API — judgment_comments 테이블 재사용 (itemId: "std_" + title) ──
  app.get("/api/std-comments/:title", async (req, res) => {
    try {
      const itemId = "std_" + decodeURIComponent(req.params.title);
      const comments = await storage.getJudgmentCommentsByItem(itemId);
      res.json(comments);
    } catch (e) { res.status(500).json({ error: "Failed to get comments" }); }
  });

  app.post("/api/std-comments/:title", async (req, res) => {
    try {
      const itemId = "std_" + decodeURIComponent(req.params.title);
      const comment = await storage.createJudgmentComment({
        itemId, author: "", content: req.body.content || ""
      });
      res.status(201).json(comment);
    } catch (e) { res.status(500).json({ error: "Failed to create comment" }); }
  });

  app.delete("/api/std-comments/:id", async (req, res) => {
    try {
      await storage.deleteJudgmentComment(parseInt(req.params.id));
      res.status(204).send();
    } catch (e) { res.status(500).json({ error: "Failed to delete comment" }); }
  });

  app.get("/api/std-comments-counts", async (req, res) => {
    res.json({});
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
      const itemId = decodeURIComponent(req.params.itemId);
      // 알려진 필드만 추출 — standardDatesWithMemo 등 미지 필드 무시
      const {
        text, effectiveDate, expiryDate, introductionType, customWarning,
        permitEffectiveDate, standardNote, equipmentTypes, fixedResult,
      } = req.body;

      // standardDates: 배열이면 JSON 문자열로, 이미 문자열이면 그대로
      let standardDates: string | undefined;
      if (req.body.standardDates !== undefined) {
        standardDates = Array.isArray(req.body.standardDates)
          ? JSON.stringify(req.body.standardDates)
          : typeof req.body.standardDates === "string"
            ? req.body.standardDates
            : undefined;
      }

      const validatedData = insertInspectionItemEditSchema.parse({
        itemId,
        text: text ?? null,
        effectiveDate: effectiveDate ?? null,
        expiryDate: expiryDate ?? null,
        introductionType: introductionType ?? null,
        customWarning: customWarning ?? null,
        permitEffectiveDate: permitEffectiveDate ?? null,
        standardDates: standardDates ?? null,
        standardNote: standardNote ?? null,
        equipmentTypes: equipmentTypes
          ? (Array.isArray(equipmentTypes) ? JSON.stringify(equipmentTypes) : String(equipmentTypes))
          : null,
        fixedResult: fixedResult ?? null,
      });
      const edit = await storage.upsertInspectionItemEdit(validatedData);
      res.json(edit);
    } catch (error) {
      console.error("[inspection-edits PUT 오류]", error);
      res.status(400).json({ error: "Invalid edit data", detail: String(error) });
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
      const title = (() => { try { return decodeURIComponent(req.params.title); } catch { return req.params.title; } })();
      const { overrideTitle, basis, conclusion, source, ref, typeTag, category, permitDate, inspectionDate, inspectionYear, installInspectionDate } = req.body;
      const existing = await db.select().from(stdItemOverrides).where(eq(stdItemOverrides.title, title)).limit(1);
      let row;
      if (existing.length > 0) {
        [row] = await db.update(stdItemOverrides).set({ overrideTitle, basis, conclusion, source, ref, typeTag, category, permitDate, inspectionDate, inspectionYear, installInspectionDate, updatedAt: new Date(), manuallyEdited: true }).where(eq(stdItemOverrides.title, title)).returning();
      } else {
        [row] = await db.insert(stdItemOverrides).values({ title, overrideTitle, basis, conclusion, source, ref, typeTag, category, permitDate, inspectionDate, inspectionYear, installInspectionDate, manuallyEdited: true }).returning();
      }
      res.json(row);
    } catch (e) {
      console.error("[PUT /api/std-overrides 오류]", e);
      res.status(500).json({ error: "Failed to save std override", detail: String(e) });
    }
  });

  app.delete("/api/std-overrides/:title", async (req, res) => {
    try {
      const db = (await import("./db")).db;
      const { stdItemOverrides } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      const title = (() => { try { return decodeURIComponent(req.params.title); } catch { return req.params.title; } })();
      const deleted = await db.delete(stdItemOverrides).where(eq(stdItemOverrides.title, title)).returning();
      if (deleted.length === 0) return res.status(404).json({ error: "Not found" });
      res.status(204).send();
    } catch (e) {
      console.error("[DELETE /api/std-overrides 오류]", e);
      res.status(500).json({ error: "Failed to delete std override", detail: String(e) });
    }
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
      const { employeeId, employeeName, admin } = req.query as { employeeId?: string; employeeName?: string; admin?: string };
      const isAdmin = admin === "true" || (employeeId === "910919" && employeeName === "노준호");
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

  // ── 위험성평가: 지사 목록 (등록된 항목/평가에서 사용된 지사명 취합) ──
  app.get("/api/risk-branches", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { riskHazardItems } = await import("@shared/schema");
      const { sql: sqlOp } = await import("drizzle-orm");
      const rows = await db.selectDistinct({ branchId: riskHazardItems.branchId }).from(riskHazardItems);
      const names = rows.map(r => r.branchId).filter(Boolean);
      if (!names.includes("서울강서지사")) names.unshift("서울강서지사");
      res.json(names);
    } catch (error) {
      handleError(res, error, "Failed to fetch risk branches");
    }
  });

  // ── 위험성평가: 유해위험요인 (모든 이용자 등록 가능) ──
  app.get("/api/risk-hazard-items", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { riskHazardItems } = await import("@shared/schema");
      const { eq, and, desc } = await import("drizzle-orm");
      const branchId = req.query.branchId as string | undefined;
      const team = req.query.team as string | undefined;
      const conditions = [] as any[];
      if (branchId) conditions.push(eq(riskHazardItems.branchId, branchId));
      if (team) conditions.push(eq(riskHazardItems.team, team));
      const rows = conditions.length > 0
        ? await db.select().from(riskHazardItems).where(and(...conditions)).orderBy(desc(riskHazardItems.createdAt))
        : await db.select().from(riskHazardItems).orderBy(desc(riskHazardItems.createdAt));
      res.json(rows);
    } catch (error) {
      handleError(res, error, "Failed to fetch risk hazard items");
    }
  });

  app.post("/api/risk-hazard-items", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { riskHazardItems, riskItemSelections, insertRiskHazardItemSchema } = await import("@shared/schema");
      const { eq, and } = await import("drizzle-orm");
      // selectEmployeeId/selectEmployeeName/selectRound/selectHadAccidentExperience — 팀원이 "직접 등록"할 때만 넘어옴(=등록과 동시에 본인 선택으로 처리)
      const { selectEmployeeId, selectEmployeeName, selectRound, selectHadAccidentExperience, ...body } = req.body;
      const validated = insertRiskHazardItemSchema.parse(body);
      if (!validated.isTemplate && validated.team && selectEmployeeId) {
        // 같은 팀/같은 회차에서 이미 선택한 항목이 있는지 확인 (1인 1항목)
        const mine = await db.select({ id: riskItemSelections.id })
          .from(riskItemSelections)
          .innerJoin(riskHazardItems, eq(riskItemSelections.hazardItemId, riskHazardItems.id))
          .where(and(eq(riskHazardItems.team, validated.team), eq(riskItemSelections.employeeId, selectEmployeeId), eq(riskItemSelections.round, selectRound || "")));
        if (mine.length > 0) {
          return res.status(409).json({ error: "이미 선택한 항목이 있습니다. 먼저 선택을 취소하세요." });
        }
      }
      const [row] = await db.insert(riskHazardItems).values(validated).returning();
      if (!validated.isTemplate && validated.team && selectEmployeeId && selectEmployeeName) {
        await db.insert(riskItemSelections).values({ hazardItemId: row.id, employeeId: selectEmployeeId, employeeName: selectEmployeeName, round: selectRound, hadAccidentExperience: selectHadAccidentExperience ?? null });
      }
      res.status(201).json(row);
    } catch (error) {
      res.status(400).json({ error: "Invalid risk hazard item data", detail: String(error) });
    }
  });

  // 팀별 위험요인(예시/필수 항목) 수정 — 내용, 사진, 현재 안전보건조치, 필수 여부 등을 수정
  app.put("/api/risk-hazard-items/:id", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { riskHazardItems } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      const id = parseInt(req.params.id);
      const allowedFields = ["workCategory", "subWork", "content", "discoveryPath", "fieldInfo", "imageUrls", "referenceSafetyMeasure", "isMandatory"] as const;
      const updates: Record<string, any> = {};
      for (const f of allowedFields) {
        if (f in req.body) updates[f] = req.body[f];
      }
      if (Object.keys(updates).length === 0) return res.status(400).json({ error: "수정할 내용이 없습니다." });
      const [row] = await db.update(riskHazardItems).set(updates).where(eq(riskHazardItems.id, id)).returning();
      if (!row) return res.status(404).json({ error: "항목을 찾을 수 없습니다." });
      res.json(row);
    } catch (error) {
      res.status(400).json({ error: "Invalid risk hazard item update", detail: String(error) });
    }
  });

  // ── 위험성평가: 항목 선택(예시 선택) — 항목 1개당 1명만 선택 가능, 팀당 1인 1항목 (회차별) ──
  app.get("/api/risk-item-selections", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { riskItemSelections, riskHazardItems } = await import("@shared/schema");
      const { eq, and } = await import("drizzle-orm");
      const team = req.query.team as string | undefined;
      const round = req.query.round as string | undefined;
      const cols = {
        id: riskItemSelections.id,
        hazardItemId: riskItemSelections.hazardItemId,
        employeeId: riskItemSelections.employeeId,
        employeeName: riskItemSelections.employeeName,
        round: riskItemSelections.round,
        hadAccidentExperience: riskItemSelections.hadAccidentExperience,
        createdAt: riskItemSelections.createdAt,
      };
      let rows;
      if (team && round) {
        rows = await db.select(cols).from(riskItemSelections)
          .innerJoin(riskHazardItems, eq(riskItemSelections.hazardItemId, riskHazardItems.id))
          .where(and(eq(riskHazardItems.team, team), eq(riskItemSelections.round, round)));
      } else if (team) {
        rows = await db.select(cols).from(riskItemSelections)
          .innerJoin(riskHazardItems, eq(riskItemSelections.hazardItemId, riskHazardItems.id))
          .where(eq(riskHazardItems.team, team));
      } else if (round) {
        rows = await db.select().from(riskItemSelections).where(eq(riskItemSelections.round, round));
      } else {
        rows = await db.select().from(riskItemSelections);
      }
      res.json(rows);
    } catch (error) {
      handleError(res, error, "Failed to fetch risk item selections");
    }
  });

  app.post("/api/risk-item-selections", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { riskItemSelections, riskHazardItems, insertRiskItemSelectionSchema } = await import("@shared/schema");
      const { eq, and } = await import("drizzle-orm");
      const validated = insertRiskItemSelectionSchema.parse(req.body);
      const [item] = await db.select().from(riskHazardItems).where(eq(riskHazardItems.id, validated.hazardItemId));
      if (!item) return res.status(404).json({ error: "항목을 찾을 수 없습니다." });
      if (!item.team) return res.status(400).json({ error: "팀이 지정되지 않은 항목입니다." });
      const [taken] = await db.select().from(riskItemSelections).where(and(eq(riskItemSelections.hazardItemId, validated.hazardItemId), eq(riskItemSelections.round, validated.round)));
      if (taken) return res.status(409).json({ error: "이미 다른 팀원이 선택한 항목입니다." });
      const mine = await db.select({ id: riskItemSelections.id })
        .from(riskItemSelections)
        .innerJoin(riskHazardItems, eq(riskItemSelections.hazardItemId, riskHazardItems.id))
        .where(and(eq(riskHazardItems.team, item.team), eq(riskItemSelections.employeeId, validated.employeeId), eq(riskItemSelections.round, validated.round)));
      if (mine.length > 0) return res.status(409).json({ error: "이미 선택한 항목이 있습니다. 먼저 선택을 취소하세요." });
      const [row] = await db.insert(riskItemSelections).values(validated).returning();
      res.status(201).json(row);
    } catch (error) {
      res.status(400).json({ error: "Invalid selection data", detail: String(error) });
    }
  });

  // ── 위험성평가: 회차 목록 조회 (공유 아카이브에서 연도/회차별로 열람할 때 사용) ──
  app.get("/api/risk-rounds", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { riskAssessments, riskItemSelections } = await import("@shared/schema");
      const a = await db.selectDistinct({ round: riskAssessments.round }).from(riskAssessments);
      const s = await db.selectDistinct({ round: riskItemSelections.round }).from(riskItemSelections);
      const set = new Set<string>();
      [...a, ...s].forEach(r => { if (r.round) set.add(r.round); });
      res.json(Array.from(set));
    } catch (error) {
      handleError(res, error, "Failed to fetch risk rounds");
    }
  });

  // ── 위험성평가: 팀원 절반 이상 선택 완료 시 "무시하고 평가하기"로 전원 완료를 건너뛴 기록 ──
  app.get("/api/risk-round-overrides", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { riskRoundOverrides } = await import("@shared/schema");
      const { eq, and } = await import("drizzle-orm");
      const team = req.query.team as string | undefined;
      const round = req.query.round as string | undefined;
      const phase = req.query.phase as string | undefined;
      const conditions = [] as any[];
      if (team) conditions.push(eq(riskRoundOverrides.team, team));
      if (round) conditions.push(eq(riskRoundOverrides.round, round));
      if (phase) conditions.push(eq(riskRoundOverrides.phase, phase));
      const rows = conditions.length > 0
        ? await db.select().from(riskRoundOverrides).where(and(...conditions))
        : await db.select().from(riskRoundOverrides);
      res.json(rows);
    } catch (error) {
      handleError(res, error, "Failed to fetch risk round overrides");
    }
  });

  app.post("/api/risk-round-overrides", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { riskRoundOverrides, insertRiskRoundOverrideSchema } = await import("@shared/schema");
      const { eq, and } = await import("drizzle-orm");
      const validated = insertRiskRoundOverrideSchema.parse(req.body);
      const phase = validated.phase || "selection";
      const [existing] = await db.select().from(riskRoundOverrides).where(and(eq(riskRoundOverrides.team, validated.team), eq(riskRoundOverrides.round, validated.round), eq(riskRoundOverrides.phase, phase)));
      if (existing) return res.json(existing);
      const [row] = await db.insert(riskRoundOverrides).values({ ...validated, phase }).returning();
      res.status(201).json(row);
    } catch (error) {
      res.status(400).json({ error: "Invalid round override data", detail: String(error) });
    }
  });

  // 처음으로 돌아가기 / 선택 취소 시, 강제로 열어둔 팀 게이트를 다시 잠가 "무시하고 평가하기"를 다시 물어보도록 함
  // phase를 지정하지 않으면 해당 team+round의 모든 단계(selection, experience) 게이트를 초기화함
  app.delete("/api/risk-round-overrides", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { riskRoundOverrides } = await import("@shared/schema");
      const { eq, and } = await import("drizzle-orm");
      const team = req.query.team as string | undefined;
      const round = req.query.round as string | undefined;
      const phase = req.query.phase as string | undefined;
      if (!team || !round) return res.status(400).json({ error: "team, round required" });
      const conditions = [eq(riskRoundOverrides.team, team), eq(riskRoundOverrides.round, round)];
      if (phase) conditions.push(eq(riskRoundOverrides.phase, phase));
      await db.delete(riskRoundOverrides).where(and(...conditions));
      res.status(204).send();
    } catch (error) {
      handleError(res, error, "Failed to clear risk round override");
    }
  });

  app.delete("/api/risk-item-selections/:id", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { riskItemSelections } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      const id = parseInt(req.params.id);
      const { employeeId, admin } = req.query as { employeeId?: string; admin?: string };
      const isAdmin = admin === "true";
      const [sel] = await db.select().from(riskItemSelections).where(eq(riskItemSelections.id, id));
      if (!sel) return res.status(404).json({ error: "Not found" });
      if (!isAdmin && sel.employeeId !== employeeId) {
        return res.status(403).json({ error: "본인이 선택한 항목만 취소할 수 있습니다." });
      }
      await db.delete(riskItemSelections).where(eq(riskItemSelections.id, id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to cancel selection", detail: String(error) });
    }
  });


  app.delete("/api/risk-hazard-items/:id", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { riskHazardItems, riskAssessments } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      const id = parseInt(req.params.id);
      const { employeeId, employeeName, admin } = req.query as { employeeId?: string; employeeName?: string; admin?: string };
      const isAdmin = admin === "true" || (employeeId === "910919" && employeeName === "노준호");
      const [item] = await db.select().from(riskHazardItems).where(eq(riskHazardItems.id, id));
      if (!item) return res.status(404).json({ error: "Not found" });
      if (!isAdmin && item.registeredById !== employeeId) {
        return res.status(403).json({ error: "본인이 등록한 항목만 삭제할 수 있습니다." });
      }
      await db.delete(riskAssessments).where(eq(riskAssessments.hazardItemId, id));
      await db.delete(riskHazardItems).where(eq(riskHazardItems.id, id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete risk hazard item", detail: String(error) });
    }
  });

  // ── 위험성평가: 개인별 평가입력 (사번+회차 기준 upsert) ──
  app.get("/api/risk-assessments", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { riskAssessments } = await import("@shared/schema");
      const { eq, and } = await import("drizzle-orm");
      const branchId = req.query.branchId as string | undefined;
      const round = req.query.round as string | undefined;
      const conditions = [] as any[];
      if (branchId) conditions.push(eq(riskAssessments.branchId, branchId));
      if (round) conditions.push(eq(riskAssessments.round, round));
      const rows = conditions.length > 0
        ? await db.select().from(riskAssessments).where(and(...conditions))
        : await db.select().from(riskAssessments);
      res.json(rows);
    } catch (error) {
      handleError(res, error, "Failed to fetch risk assessments");
    }
  });

  app.post("/api/risk-assessments", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { riskAssessments, insertRiskAssessmentSchema } = await import("@shared/schema");
      const { and, eq } = await import("drizzle-orm");
      const validated = insertRiskAssessmentSchema.parse(req.body);
      const [existing] = await db.select().from(riskAssessments).where(
        and(
          eq(riskAssessments.hazardItemId, validated.hazardItemId),
          eq(riskAssessments.employeeId, validated.employeeId),
          eq(riskAssessments.round, validated.round)
        )
      );
      if (existing) {
        const [row] = await db.update(riskAssessments)
          .set({ ...validated, updatedAt: new Date() })
          .where(eq(riskAssessments.id, existing.id))
          .returning();
        return res.json(row);
      }
      const [row] = await db.insert(riskAssessments).values(validated).returning();
      res.status(201).json(row);
    } catch (error) {
      res.status(400).json({ error: "Invalid risk assessment data", detail: String(error) });
    }
  });

  // "처음으로 돌아가기" 시 본인의 이번 회차 평가 데이터를 완전히 삭제(진짜 처음부터 다시 시작) — 본인 것만 삭제, 팀원 데이터는 유지
  app.delete("/api/risk-assessments", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { riskAssessments } = await import("@shared/schema");
      const { eq, and } = await import("drizzle-orm");
      const employeeId = req.query.employeeId as string | undefined;
      const round = req.query.round as string | undefined;
      const branchId = req.query.branchId as string | undefined;
      if (!employeeId || !round) return res.status(400).json({ error: "employeeId, round required" });
      const conditions = [eq(riskAssessments.employeeId, employeeId), eq(riskAssessments.round, round)];
      if (branchId) conditions.push(eq(riskAssessments.branchId, branchId));
      const deleted = await db.delete(riskAssessments).where(and(...conditions)).returning();
      res.json({ ok: true, count: deleted.length });
    } catch (error) {
      handleError(res, error, "Failed to delete risk assessments");
    }
  });

  // ── 위험성평가: 결과 확인 (평가 종료 후 팀별 결과 열람 확인) ──
  app.get("/api/risk-result-confirmations", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { riskResultConfirmations } = await import("@shared/schema");
      const { eq, and } = await import("drizzle-orm");
      const branchId = req.query.branchId as string | undefined;
      const round = req.query.round as string | undefined;
      const conditions = [] as any[];
      if (branchId) conditions.push(eq(riskResultConfirmations.branchId, branchId));
      if (round) conditions.push(eq(riskResultConfirmations.round, round));
      const rows = conditions.length > 0
        ? await db.select().from(riskResultConfirmations).where(and(...conditions))
        : await db.select().from(riskResultConfirmations);
      res.json(rows);
    } catch (error) {
      handleError(res, error, "Failed to fetch risk result confirmations");
    }
  });

  app.post("/api/risk-result-confirmations", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { riskResultConfirmations, insertRiskResultConfirmationSchema } = await import("@shared/schema");
      const { and, eq } = await import("drizzle-orm");
      const validated = insertRiskResultConfirmationSchema.parse(req.body);
      const [existing] = await db.select().from(riskResultConfirmations).where(
        and(
          eq(riskResultConfirmations.branchId, validated.branchId),
          eq(riskResultConfirmations.round, validated.round),
          eq(riskResultConfirmations.team, validated.team),
          eq(riskResultConfirmations.employeeId, validated.employeeId)
        )
      );
      if (existing) return res.json(existing);
      const [row] = await db.insert(riskResultConfirmations).values(validated).returning();
      res.status(201).json(row);
    } catch (error) {
      res.status(400).json({ error: "Invalid confirmation data", detail: String(error) });
    }
  });

  // ── 위험성평가: 서명 (모든 팀 결과 확인 후 최종 서명) ──
  app.get("/api/risk-signatures", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { riskSignatures } = await import("@shared/schema");
      const { eq, and } = await import("drizzle-orm");
      const branchId = req.query.branchId as string | undefined;
      const round = req.query.round as string | undefined;
      const conditions = [] as any[];
      if (branchId) conditions.push(eq(riskSignatures.branchId, branchId));
      if (round) conditions.push(eq(riskSignatures.round, round));
      const rows = conditions.length > 0
        ? await db.select().from(riskSignatures).where(and(...conditions))
        : await db.select().from(riskSignatures);
      res.json(rows);
    } catch (error) {
      handleError(res, error, "Failed to fetch risk signatures");
    }
  });

  app.post("/api/risk-signatures", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { riskSignatures, insertRiskSignatureSchema } = await import("@shared/schema");
      const { and, eq } = await import("drizzle-orm");
      const validated = insertRiskSignatureSchema.parse(req.body);
      const [existing] = await db.select().from(riskSignatures).where(
        and(
          eq(riskSignatures.branchId, validated.branchId),
          eq(riskSignatures.round, validated.round),
          eq(riskSignatures.employeeId, validated.employeeId)
        )
      );
      if (existing) {
        const [row] = await db.update(riskSignatures)
          .set({ ...validated, signedAt: new Date() })
          .where(eq(riskSignatures.id, existing.id))
          .returning();
        return res.json(row);
      }
      const [row] = await db.insert(riskSignatures).values(validated).returning();
      res.status(201).json(row);
    } catch (error) {
      res.status(400).json({ error: "Invalid signature data", detail: String(error) });
    }
  });

  // ── 위험성평가: 붙임4-1/4-3 양식 엑셀 내보내기 (관리자용) ──
  app.get("/api/risk-assessments/export", async (req, res) => {
    try {
      const branchId = (req.query.branchId as string) || "";
      const round = (req.query.round as string) || "";
      if (!branchId || !round) return res.status(400).json({ error: "branchId, round는 필수입니다." });
      const { db } = await import("./db");
      const { riskHazardItems, riskAssessments, riskItemSelections } = await import("@shared/schema");
      const { eq, and } = await import("drizzle-orm");
      const items = await db.select().from(riskHazardItems).where(eq(riskHazardItems.branchId, branchId));
      const assessments = await db.select().from(riskAssessments).where(and(eq(riskAssessments.branchId, branchId), eq(riskAssessments.round, round)));
      const selections = await db.select().from(riskItemSelections).where(and(eq(riskItemSelections.round, round)));

      const ExcelJS = (await import("exceljs")).default;
      const wb = new ExcelJS.Workbook();

      // 팀별 業무구분 매핑 (붙임4-3 시트 구성과 동일)
      const freqSheetGroups: { sheetName: string; workCategory: string }[] = [
        { sheetName: "엘리베이터", workCategory: "엘리베이터" },
        { sheetName: "에스컬레이터", workCategory: "에스컬레이터" },
        { sheetName: "수직형 휠체어리프트", workCategory: "수직형 휠체어리프트" },
        { sheetName: "경사형 휠체어리프트", workCategory: "경사형 휠체어리프트" },
      ];
      const freqHeader = ["연번","세부 업무","유해위험요인","사고 가능성(빈도)","중대성(강도)","위험성","허용여부","현재 안전보건조치","개선 안전보건조치","평가자","평가일"];

      function levelOfRisk(risk: number): { level: string; allow: string } {
        if (risk >= 15) return { level: "상", allow: "허용 불가능" };
        if (risk >= 9) return { level: "중", allow: "허용 불가능" };
        return { level: "하", allow: "허용 가능" };
      }

      // 중대성(강도)은 이제 평가자 개인별 값이라 위험성/허용여부도 평가자마다 다를 수 있음 — 항목당 한 행이 아니라 평가자당 한 행으로 출력
      for (const g of freqSheetGroups) {
        const groupItems = items.filter(it => it.workCategory === g.workCategory && it.isTemplate);
        if (groupItems.length === 0) continue;
        const sheet = wb.addWorksheet(g.sheetName);
        sheet.addRow(["평가업무", "승강기 검사"]);
        sheet.addRow(["평가방법", "빈도·강도법"]);
        sheet.addRow(["업무구분", g.workCategory]);
        sheet.addRow(["회차", round]);
        sheet.addRow([]);
        sheet.addRow(freqHeader);
        let seq = 1;
        for (const item of groupItems) {
          const itemAssessments = assessments.filter(a => a.hazardItemId === item.id);
          if (itemAssessments.length === 0) {
            sheet.addRow([seq++, item.subWork || "", item.content, "", "", "", "", item.referenceSafetyMeasure || "", "", "", ""]);
            continue;
          }
          const withExp = itemAssessments.filter(a => a.hadAccidentExperience !== null);
          const expCount = withExp.filter(a => a.hadAccidentExperience).length;
          const possibility = withExp.length > 0 ? Math.round((expCount / withExp.length) * 5 * 10) / 10 : 0;
          const withSev = itemAssessments.filter(a => a.severity != null);
          if (withSev.length === 0) {
            sheet.addRow([seq++, item.subWork || "", item.content, possibility, "", "", "", item.referenceSafetyMeasure || "", "", withExp.map(a => a.employeeName).join(", "), ""]);
            continue;
          }
          for (const a of withSev) {
            const risk = Math.round(possibility * (a.severity as number) * 10) / 10;
            const initial = levelOfRisk(risk);
            let finalRisk = risk, finalLevel = initial.level, finalAllow = initial.allow;
            if (initial.allow === "허용 불가능" && a.postImprovementSeverity != null) {
              const postRisk = Math.round(possibility * a.postImprovementSeverity * 10) / 10;
              const post = levelOfRisk(postRisk);
              finalRisk = postRisk; finalLevel = post.level; finalAllow = post.allow;
            }
            sheet.addRow([
              seq++, item.subWork || "", item.content,
              possibility, a.severity, `${finalRisk} (${finalLevel})`, finalAllow,
              item.referenceSafetyMeasure || "", a.reductionPlan || "", a.employeeName,
              new Date(a.updatedAt).toLocaleDateString("ko-KR"),
            ]);
          }
        }
        sheet.columns.forEach(c => { c.width = 22; });
      }

      // 사무(체크리스트법) 시트 — 붙임4-1
      const checklistItems = items.filter(it => it.workCategory === "사무" || it.method === "checklist");
      if (checklistItems.filter(it => it.isTemplate).length > 0) {
        const sheet = wb.addWorksheet("사무");
        sheet.addRow(["평가업무", "사무"]);
        sheet.addRow(["평가방법", "체크리스트법"]);
        sheet.addRow(["회차", round]);
        sheet.addRow([]);
        sheet.addRow(["연번","유해위험요인","위험성(상/중/하)","현재 안전보건조치","개선 안전보건조치","평가자","평가일"]);
        let seq = 1;
        for (const item of checklistItems.filter(it => it.isTemplate)) {
          const itemAssessments = assessments.filter(a => a.hazardItemId === item.id);
          if (itemAssessments.length === 0) {
            sheet.addRow([seq++, item.content, "", item.referenceSafetyMeasure || "", "", "", ""]);
            continue;
          }
          const counts: Record<string, number> = {};
          itemAssessments.forEach(a => { if (a.level) counts[a.level] = (counts[a.level] || 0) + 1; });
          const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
          const level = top ? top[0] : "";
          const plans = itemAssessments.filter(a => a.reductionPlan?.trim()).map(a => `[${a.employeeName}] ${a.reductionPlan}`).join("\n");
          const evaluators = itemAssessments.map(a => a.employeeName).join(", ");
          const latestDate = itemAssessments.reduce((max, a) => a.updatedAt > max ? a.updatedAt : max, itemAssessments[0].updatedAt);
          sheet.addRow([seq++, item.content, level, item.referenceSafetyMeasure || "", plans, evaluators, new Date(latestDate).toLocaleDateString("ko-KR")]);
        }
        sheet.columns.forEach(c => { c.width = 24; });
      }

      if (wb.worksheets.length === 0) wb.addWorksheet("결과없음");

      const buffer = await wb.xlsx.writeBuffer();
      const rawFilename = `${branchId}_${round}_위험성평가.xlsx`;
      const encodedFilename = encodeURIComponent(rawFilename);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      // 헤더 값은 Latin-1 범위 밖 문자(한글 등)를 허용하지 않아 setHeader가 즉시 예외를 던진다.
      // RFC 5987 filename*= 형식으로 인코딩해야 한글 파일명이 안전하게 전달된다.
      res.setHeader("Content-Disposition", `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`);
      res.send(Buffer.from(buffer));
    } catch (error) {
      handleError(res, error, "Failed to export risk assessments");
    }
  });

  // ── 위험성평가: 수시 평가 신청 ──
  // 지정된 팀원(이름)에게만 푸시 알림 전송 — 등록된 토큰이 없으면 조용히 무시
  async function sendPushToEmployees(employeeIds: string[], title: string, body: string, data?: Record<string, string>) {
    try {
      if (!employeeIds || employeeIds.length === 0) return;
      const admin = await import("firebase-admin");
      if (!admin.default.apps.length) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_ADMINSDK || "{}");
        admin.default.initializeApp({ credential: admin.default.credential.cert(serviceAccount) });
      }
      const { pool: pgPool } = await import("./db");
      await pgPool.query(`ALTER TABLE push_tokens ADD COLUMN IF NOT EXISTS employee_id varchar(50)`);
      const rows = await pgPool.query(`SELECT token FROM push_tokens WHERE employee_id = ANY($1)`, [employeeIds]);
      const tokens = rows.rows.map((r: any) => r.token).filter(Boolean);
      if (tokens.length === 0) return;
      await Promise.allSettled(
        tokens.map((token: string) =>
          admin.default.messaging().send({ token, notification: { title, body }, data: data || {}, android: { priority: "high" } })
        )
      );
    } catch (e) {
      console.error("[FCM] 대상자 알림 전송 실패:", e);
    }
  }

  app.get("/api/risk-adhoc-requests", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { riskAdhocRequests } = await import("@shared/schema");
      const { eq, desc } = await import("drizzle-orm");
      const team = req.query.team as string | undefined;
      const rows = team
        ? await db.select().from(riskAdhocRequests).where(eq(riskAdhocRequests.team, team)).orderBy(desc(riskAdhocRequests.createdAt))
        : await db.select().from(riskAdhocRequests).orderBy(desc(riskAdhocRequests.createdAt));
      res.json(rows);
    } catch (error) {
      handleError(res, error, "Failed to fetch adhoc requests");
    }
  });

  app.post("/api/risk-adhoc-requests", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { riskAdhocRequests, insertRiskAdhocRequestSchema } = await import("@shared/schema");
      const validated = insertRiskAdhocRequestSchema.parse(req.body);
      const [row] = await db.insert(riskAdhocRequests).values(validated).returning();
      // 신청 등록 시점에는 알림을 보내지 않음 — 실제로 평가할지는 관리자 승인 후 결정되므로,
      // 알림은 승인되어 실제 평가 대상이 되는 순간(PUT status=진행중)에만 보냄
      res.status(201).json(row);
    } catch (error) {
      res.status(400).json({ error: "Invalid adhoc request data", detail: String(error) });
    }
  });

  app.put("/api/risk-adhoc-requests/:id", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { riskAdhocRequests, riskHazardItems } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      const id = parseInt(req.params.id);
      const { status, round } = req.body as { status?: string; round?: string };
      const [existing] = await db.select().from(riskAdhocRequests).where(eq(riskAdhocRequests.id, id));
      if (!existing) return res.status(404).json({ error: "Not found" });
      const patch: any = { updatedAt: new Date() };
      if (status) patch.status = status;
      if (round !== undefined) patch.round = round || null;
      const [row] = await db.update(riskAdhocRequests).set(patch).where(eq(riskAdhocRequests.id, id)).returning();
      // 대기 → 진행중으로 전환되며 회차가 부여되는 순간, 신고 내용을 그대로 평가 항목으로 자동 생성
      if (status === "진행중" && round && existing.status !== "진행중") {
        const method = row.team === "사무업무 4반" ? "checklist" : "freq_severity";
        await db.insert(riskHazardItems).values({
          method,
          workCategory: method === "checklist" ? "사무" : "기타",
          subWork: null,
          content: row.content || row.reason,
          discoveryPath: "수시평가신청",
          fieldInfo: row.fieldInfo || null,
          imageUrls: row.imageUrls && row.imageUrls.length > 0 ? row.imageUrls : null,
          branchId: row.branchId,
          registeredById: row.requestedById,
          registeredByName: row.requestedByName,
          team: row.team,
          isTemplate: false,
          isMandatory: true,
          sourceRound: round,
          targetMembers: row.targetMembers && row.targetMembers.length > 0 ? row.targetMembers : null,
          referenceSafetyMeasure: row.currentSafetyMeasure || null,
        } as any);
        if (row.targetMembers && row.targetMembers.length > 0) {
          sendPushToEmployees(
            row.targetMembers,
            "수시 위험성평가 평가 요청",
            `수시 위험성평가가 시작되었습니다. 앱에서 평가를 완료해주세요: ${(row.content || row.reason || "").slice(0, 60)}`,
            { type: "risk-adhoc-approved", requestId: String(row.id) }
          );
        }
      }
      res.json(row);
    } catch (error) {
      res.status(500).json({ error: "Failed to update adhoc request", detail: String(error) });
    }
  });

  // ── 위험성평가: 팀 배정 오버라이드 (본인 선택 또는 관리자 지정, 언제든 재변경 가능) ──
  app.get("/api/employee-team-overrides", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { employeeTeamOverrides } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      const employeeId = req.query.employeeId as string | undefined;
      const rows = employeeId
        ? await db.select().from(employeeTeamOverrides).where(eq(employeeTeamOverrides.employeeId, employeeId))
        : await db.select().from(employeeTeamOverrides);
      res.json(rows);
    } catch (error) {
      handleError(res, error, "Failed to fetch employee team overrides");
    }
  });

  app.put("/api/employee-team-overrides/:employeeId", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { employeeTeamOverrides } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      const employeeId = req.params.employeeId;
      const { team, setBy } = req.body as { team: string; setBy?: string };
      if (!team) return res.status(400).json({ error: "team is required" });
      const existing = await db.select().from(employeeTeamOverrides).where(eq(employeeTeamOverrides.employeeId, employeeId)).limit(1);
      let row;
      if (existing.length > 0) {
        [row] = await db.update(employeeTeamOverrides).set({ team, setBy: setBy || null, updatedAt: new Date() }).where(eq(employeeTeamOverrides.employeeId, employeeId)).returning();
      } else {
        [row] = await db.insert(employeeTeamOverrides).values({ employeeId, team, setBy: setBy || null }).returning();
      }
      res.json(row);
    } catch (error) {
      res.status(400).json({ error: "Failed to save team override", detail: String(error) });
    }
  });

  app.delete("/api/employee-team-overrides/:employeeId", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { employeeTeamOverrides } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      await db.delete(employeeTeamOverrides).where(eq(employeeTeamOverrides.employeeId, req.params.employeeId));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete team override", detail: String(error) });
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

  // 연도별 기준 브라우징 — 개정 이력 테이블에 존재하는 연도 목록
  // (effective_date / expiry_date에서 연도만 추출해 선택 버튼을 구성하는 데 사용)
  app.get("/api/inspection-revisions-years", async (req, res) => {
    try {
      const { pool: pgPool } = await import("./db");
      const result = await pgPool.query(
        `SELECT DISTINCT LEFT(d, 4) AS yr FROM (
           SELECT effective_date AS d FROM inspection_item_revisions WHERE effective_date IS NOT NULL
           UNION ALL
           SELECT expiry_date AS d FROM inspection_item_revisions WHERE expiry_date IS NOT NULL
         ) t
         WHERE d ~ '^[0-9]{4}-'
         ORDER BY yr`
      );
      const years = result.rows.map((r: any) => r.yr).filter(Boolean);
      res.json(years);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch revision years" });
    }
  });

  // 전체 연도 통합 검색 — 특정 연도에 한정하지 않고 모든 tier(현행/종전/추가)의
  // description을 대상으로 키워드를 검색해, 항목별 · 연도별 매칭 결과를 반환한다.
  app.get("/api/inspection-revisions-search", async (req, res) => {
    try {
      const q = (req.query.q as string || "").trim();
      if (!q) return res.json([]);
      const { pool: pgPool } = await import("./db");
      const result = await pgPool.query(
        `SELECT item_id, introduction_type, effective_date, expiry_date, description
         FROM inspection_item_revisions
         WHERE introduction_type IN ('current', 'old', 'additional')
           AND description ILIKE $1
         ORDER BY item_id, effective_date ASC NULLS FIRST
         LIMIT 300`,
        [`%${q}%`]
      );
      res.json(result.rows.map((r: any) => ({
        itemId: r.item_id,
        introductionType: r.introduction_type,
        effectiveDate: r.effective_date,
        expiryDate: r.expiry_date,
        description: r.description,
      })));
    } catch (error) {
      res.status(500).json({ error: "Failed to search revisions" });
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
  // 연혁집 데이터 보유 항목 목록 (revision이 1개 이상인 item_id 목록)
  app.get("/api/inspection-items/revision-counts", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { sql } = await import("drizzle-orm");
      const rows = await db.execute(
        sql`SELECT item_id, COUNT(*) as cnt FROM inspection_item_revisions GROUP BY item_id HAVING COUNT(*) > 0`
      );
      const result: Record<string, number> = {};
      (rows.rows || rows).forEach((r: any) => {
        result[r.item_id] = Number(r.cnt);
      });
      res.json(result);
    } catch (e) {
      res.status(500).json({});
    }
  });

  // 조문별 종전 기간 조회 — 검사가이드 종전 판정용
  // ── Firebase Admin SDK 초기화 ──────────────────────────────────
  let firebaseAdmin: any = null;
  try {
    const admin = await import("firebase-admin");
    if (!admin.default.apps.length) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_ADMINSDK || "{}");
      admin.default.initializeApp({
        credential: admin.default.credential.cert(serviceAccount),
      });
    }
    firebaseAdmin = admin.default;
  } catch (e) {
    console.error("[FCM] Firebase Admin 초기화 실패:", e);
  }

  // FCM 토큰 등록
  app.post("/api/push/register", async (req, res) => {
    try {
      const { token, platform, employeeId } = req.body;
      if (!token) return res.status(400).json({ error: "토큰 없음" });
      const { pool: pgPool } = await import("./db");
      await pgPool.query(`ALTER TABLE push_tokens ADD COLUMN IF NOT EXISTS employee_id varchar(50)`);
      await pgPool.query(
        `INSERT INTO push_tokens (token, platform, employee_id, created_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (token) DO UPDATE SET platform = $2, employee_id = COALESCE($3, push_tokens.employee_id), updated_at = NOW()`,
        [token, platform || "android", employeeId || null]
      );
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: "등록 실패" });
    }
  });

  // FCM 푸시 전송 (채팅 새 메시지)
  app.post("/api/push/send", async (req, res) => {
    try {
      const { title, body, data } = req.body;
      if (!firebaseAdmin) return res.status(500).json({ error: "FCM 미초기화" });
      const { pool: pgPool } = await import("./db");
      const rows = await pgPool.query(`SELECT token FROM push_tokens`);
      const tokens = rows.rows.map((r: any) => r.token).filter(Boolean);
      if (tokens.length === 0) return res.json({ sent: 0 });
      const results = await Promise.allSettled(
        tokens.map((token: string) =>
          firebaseAdmin.messaging().send({
            token,
            notification: { title: title || "승벼리", body: body || "새 메시지가 있습니다." },
            data: data || {},
            android: { priority: "high" },
          })
        )
      );
      const sent = results.filter(r => r.status === "fulfilled").length;
      res.json({ sent, total: tokens.length });
    } catch (e) {
      res.status(500).json({ error: "전송 실패" });
    }
  });

  // ── 로그인 API ──────────────────────────────────────────────────
  app.get("/api/auth/organizations", async (req, res) => {
    try {
      const { pool } = await import("./db");
      const rows = await pool.query("SELECT name FROM organizations ORDER BY name");
      res.json(rows.rows.map((r: any) => r.name));
    } catch (e) {
      res.status(500).json([]);
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { org, name, password } = req.body;
      if (!org || !name || !password) return res.status(400).json({ error: "소속, 이름, 비밀번호를 모두 입력하세요." });
      const { pool } = await import("./db");
      const rows = await pool.query("SELECT * FROM organizations WHERE name = $1", [org]);
      if (rows.rows.length === 0) return res.status(401).json({ error: "소속 또는 비밀번호가 올바르지 않습니다." });
      const org_row = rows.rows[0];
      const bcrypt = await import("bcrypt");
      const isUser = await bcrypt.default.compare(password, org_row.user_pw_hash);
      const isAdmin = await bcrypt.default.compare(password, org_row.admin_pw_hash);
      if (!isUser && !isAdmin) return res.status(401).json({ error: "소속 또는 비밀번호가 올바르지 않습니다." });
      const role = isAdmin ? "admin" : "user";
      const jwt = await import("jsonwebtoken");
      const token = jwt.default.sign({ orgId: org_row.id, org, role, name }, process.env.JWT_SECRET || "elevator-secret-key", { expiresIn: "30d" });
      res.json({ token, org, role, name });
    } catch (e) {
      res.status(500).json({ error: "서버 오류" });
    }
  });

  app.get("/api/auth/verify", async (req, res) => {
    try {
      const auth = req.headers.authorization;
      if (!auth) return res.status(401).json({ error: "인증 필요" });
      const token = auth.replace("Bearer ", "");
      const jwt = await import("jsonwebtoken");
      const decoded = jwt.default.verify(token, process.env.JWT_SECRET || "elevator-secret-key");
      res.json(decoded);
    } catch (e) {
      res.status(401).json({ error: "토큰 만료 또는 유효하지 않음" });
    }
  });

  // 승강기 고유번호로 설치정보 조회 (한국승강기안전공단 공공API)
  app.get("/api/elevator-info/:elvtrNo", async (req, res) => {
    try {
      const { elvtrNo } = req.params;
      const apiKey = process.env.ELEVATOR_API_KEY;
      if (!apiKey) return res.status(500).json({ error: "API 키 없음" });

      const url = `https://apis.data.go.kr/B553664/ElevatorInstallationService/getInstallationElvtrListV2?serviceKey=${encodeURIComponent(apiKey)}&elevator_no=${encodeURIComponent(elvtrNo)}&numOfRows=1&pageNo=1&_type=json`;
      const resp = await fetch(url);
      const data = await resp.json();

      const item = data?.response?.body?.items?.item;
      if (!item) return res.status(404).json({ error: "승강기 정보 없음" });

      const info = Array.isArray(item) ? item[0] : item;
      res.json({
        elvtrNo: info.elvtrNo,
        buldNm: info.buldNm,
        address: info.address1,
        elvtrKindNm: info.elvtrKindNm,
        elvtrSttsNm: info.elvtrSttsNm,
        installationDe: info.installationDe,   // 설치일자
        frstInstallationDe: info.frstInstallationDe, // 최초설치일자
        hoistwyCnt: info.hoistwyCnt,
        ratedLoadCap: info.ratedLoadCap,
        ratedSpeed: info.ratedSpeed,
      });
    } catch (e) {
      res.status(500).json({ error: "API 조회 실패" });
    }
  });

  app.get("/api/inspection-items/previous-ranges", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { sql } = await import("drizzle-orm");
      const rows = await db.execute(
        sql`SELECT item_id, MIN(effective_date) as min_date, MAX(expiry_date) as max_expiry
            FROM inspection_item_revisions
            WHERE introduction_type = 'old'
            AND effective_date IS NOT NULL
            GROUP BY item_id`
      );
      const result: Record<string, { minDate: string; maxExpiry: string }> = {};
      (rows.rows || rows).forEach((r: any) => {
        result[r.item_id] = {
          minDate: r.min_date,
          maxExpiry: r.max_expiry,
        };
      });
      res.json(result);
    } catch (e) {
      res.status(500).json({});
    }
  });

  app.get("/api/judgment-items/comment-counts", async (req, res) => {
    try {
      const counts = await storage.getItemCommentCounts();
      res.json(counts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comment counts" });
    }
  });

  // 항목별 댓글 수 일괄 조회
  // 연혁집 데이터 보유 항목 목록 (revision이 1개 이상인 item_id 목록)
  app.get("/api/inspection-items/revision-counts", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { sql } = await import("drizzle-orm");
      const rows = await db.execute(
        sql`SELECT item_id, COUNT(*) as cnt FROM inspection_item_revisions GROUP BY item_id HAVING COUNT(*) > 0`
      );
      const result: Record<string, number> = {};
      (rows.rows || rows).forEach((r: any) => {
        result[r.item_id] = Number(r.cnt);
      });
      res.json(result);
    } catch (e) {
      res.status(500).json({});
    }
  });

  // 조문별 종전 기간 조회 — 검사가이드 종전 판정용
  // ── Firebase Admin SDK 초기화 ──────────────────────────────────

  try {
    const admin = await import("firebase-admin");
    if (!admin.default.apps.length) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_ADMINSDK || "{}");
      admin.default.initializeApp({
        credential: admin.default.credential.cert(serviceAccount),
      });
    }
    firebaseAdmin = admin.default;
  } catch (e) {
    console.error("[FCM] Firebase Admin 초기화 실패:", e);
  }

  // FCM 토큰 등록
  app.post("/api/push/register", async (req, res) => {
    try {
      const { token, platform, employeeId } = req.body;
      if (!token) return res.status(400).json({ error: "토큰 없음" });
      const { pool: pgPool } = await import("./db");
      await pgPool.query(`ALTER TABLE push_tokens ADD COLUMN IF NOT EXISTS employee_id varchar(50)`);
      await pgPool.query(
        `INSERT INTO push_tokens (token, platform, employee_id, created_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (token) DO UPDATE SET platform = $2, employee_id = COALESCE($3, push_tokens.employee_id), updated_at = NOW()`,
        [token, platform || "android", employeeId || null]
      );
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: "등록 실패" });
    }
  });

  // FCM 푸시 전송 (채팅 새 메시지)
  app.post("/api/push/send", async (req, res) => {
    try {
      const { title, body, data } = req.body;
      if (!firebaseAdmin) return res.status(500).json({ error: "FCM 미초기화" });
      const { pool: pgPool } = await import("./db");
      const rows = await pgPool.query(`SELECT token FROM push_tokens`);
      const tokens = rows.rows.map((r: any) => r.token).filter(Boolean);
      if (tokens.length === 0) return res.json({ sent: 0 });
      const results = await Promise.allSettled(
        tokens.map((token: string) =>
          firebaseAdmin.messaging().send({
            token,
            notification: { title: title || "승벼리", body: body || "새 메시지가 있습니다." },
            data: data || {},
            android: { priority: "high" },
          })
        )
      );
      const sent = results.filter(r => r.status === "fulfilled").length;
      res.json({ sent, total: tokens.length });
    } catch (e) {
      res.status(500).json({ error: "전송 실패" });
    }
  });

  // ── 로그인 API ──────────────────────────────────────────────────
  app.get("/api/auth/organizations", async (req, res) => {
    try {
      const { pool } = await import("./db");
      const rows = await pool.query("SELECT name FROM organizations ORDER BY name");
      res.json(rows.rows.map((r: any) => r.name));
    } catch (e) {
      res.status(500).json([]);
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { org, name, password } = req.body;
      if (!org || !name || !password) return res.status(400).json({ error: "소속, 이름, 비밀번호를 모두 입력하세요." });
      const { pool } = await import("./db");
      const rows = await pool.query("SELECT * FROM organizations WHERE name = $1", [org]);
      if (rows.rows.length === 0) return res.status(401).json({ error: "소속 또는 비밀번호가 올바르지 않습니다." });
      const org_row = rows.rows[0];
      const bcrypt = await import("bcrypt");
      const isUser = await bcrypt.default.compare(password, org_row.user_pw_hash);
      const isAdmin = await bcrypt.default.compare(password, org_row.admin_pw_hash);
      if (!isUser && !isAdmin) return res.status(401).json({ error: "소속 또는 비밀번호가 올바르지 않습니다." });
      const role = isAdmin ? "admin" : "user";
      const jwt = await import("jsonwebtoken");
      const token = jwt.default.sign({ orgId: org_row.id, org, role, name }, process.env.JWT_SECRET || "elevator-secret-key", { expiresIn: "30d" });
      res.json({ token, org, role, name });
    } catch (e) {
      res.status(500).json({ error: "서버 오류" });
    }
  });

  app.get("/api/auth/verify", async (req, res) => {
    try {
      const auth = req.headers.authorization;
      if (!auth) return res.status(401).json({ error: "인증 필요" });
      const token = auth.replace("Bearer ", "");
      const jwt = await import("jsonwebtoken");
      const decoded = jwt.default.verify(token, process.env.JWT_SECRET || "elevator-secret-key");
      res.json(decoded);
    } catch (e) {
      res.status(401).json({ error: "토큰 만료 또는 유효하지 않음" });
    }
  });

  // 승강기 고유번호로 설치정보 조회 (한국승강기안전공단 공공API)
  app.get("/api/elevator-info/:elvtrNo", async (req, res) => {
    try {
      const { elvtrNo } = req.params;
      const apiKey = process.env.ELEVATOR_API_KEY;
      if (!apiKey) return res.status(500).json({ error: "API 키 없음" });

      const url = `https://apis.data.go.kr/B553664/ElevatorInstallationService/getInstallationElvtrListV2?serviceKey=${encodeURIComponent(apiKey)}&elevator_no=${encodeURIComponent(elvtrNo)}&numOfRows=1&pageNo=1&_type=json`;
      const resp = await fetch(url);
      const data = await resp.json();

      const item = data?.response?.body?.items?.item;
      if (!item) return res.status(404).json({ error: "승강기 정보 없음" });

      const info = Array.isArray(item) ? item[0] : item;
      res.json({
        elvtrNo: info.elvtrNo,
        buldNm: info.buldNm,
        address: info.address1,
        elvtrKindNm: info.elvtrKindNm,
        elvtrSttsNm: info.elvtrSttsNm,
        installationDe: info.installationDe,   // 설치일자
        frstInstallationDe: info.frstInstallationDe, // 최초설치일자
        hoistwyCnt: info.hoistwyCnt,
        ratedLoadCap: info.ratedLoadCap,
        ratedSpeed: info.ratedSpeed,
      });
    } catch (e) {
      res.status(500).json({ error: "API 조회 실패" });
    }
  });

  app.get("/api/inspection-items/previous-ranges", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { sql } = await import("drizzle-orm");
      const rows = await db.execute(
        sql`SELECT item_id, MIN(effective_date) as min_date, MAX(expiry_date) as max_expiry
            FROM inspection_item_revisions
            WHERE introduction_type = 'old'
            AND effective_date IS NOT NULL
            GROUP BY item_id`
      );
      const result: Record<string, { minDate: string; maxExpiry: string }> = {};
      (rows.rows || rows).forEach((r: any) => {
        result[r.item_id] = {
          minDate: r.min_date,
          maxExpiry: r.max_expiry,
        };
      });
      res.json(result);
    } catch (e) {
      res.status(500).json({});
    }
  });

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

  // 관리자 화면에서 새 조문을 직접 추가 (별표22_유효항목.json 배포 없이도 즉시 화면에 노출됨)
  app.post("/api/inspection-base-items", async (req, res) => {
    try {
      const { itemId, text, sectionTitle, parentSectionId, afterItemId } = req.body as {
        itemId?: string; text?: string; sectionTitle?: string; parentSectionId?: string; afterItemId?: string;
      };
      if (!itemId || !itemId.trim() || !text || !text.trim()) {
        return res.status(400).json({ error: "조문 번호와 내용을 모두 입력해주세요." });
      }
      const trimmedId = itemId.trim();
      // 이미 DB에 같은 itemId 행이 있는 경우 — 화면에는 안 보이던(별표22_유효항목.json 미등재,
      // 다른 문서에서 잘못 인덱싱된) 잡음 행일 수 있다. 그냥 실패시키지 않고 기존 내용을 함께
      // 돌려줘서, 관리자가 그 내용을 보고 "덮어쓰기(이 번호로 등록)"할지 판단할 수 있게 한다.
      const existing = await storage.getInspectionBaseItem(trimmedId);
      if (existing) {
        return res.status(409).json({
          error: `이미 존재하는 조문번호입니다: ${trimmedId} (화면에는 숨겨져 있던 항목일 수 있습니다)`,
          existing: {
            itemId: existing.itemId,
            text: existing.text,
            isAdminAdded: existing.isAdminAdded,
            isActive: existing.isActive,
          },
        });
      }
      const created = await storage.createInspectionBaseItem({
        itemId: trimmedId,
        text: text.trim(),
        sectionTitle,
        parentSectionId,
        afterItemId,
      });
      res.status(201).json(created);
    } catch (error: any) {
      res.status(400).json({ error: error?.message || "Failed to create inspection base item" });
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

  // 관리자 화면에서 조문을 직접 수정 — DB 행 자체를 갱신 (별도 override 테이블 사용 안 함)
  // adopt: true — 화면에 안 보이던(별표22_유효항목.json 미등재) 기존 행을 "덮어쓰기"로 등록할 때,
  //               isAdminAdded/isActive를 true로 같이 세팅해서 즉시 화면에 노출시킨다.
  app.put("/api/inspection-base-items/:itemId", async (req, res) => {
    try {
      const { text, sectionTitle, adopt } = req.body as { text?: string; sectionTitle?: string; adopt?: boolean };
      const updated = await storage.updateInspectionBaseItem(req.params.itemId, {
        text, sectionTitle,
        ...(adopt ? { isAdminAdded: "true", isActive: "true" } : {}),
      });
      if (!updated) return res.status(404).json({ error: "Not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update inspection base item" });
    }
  });

  // ==================== AI 챗봇 ====================
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, context, mode } = req.body as {
        messages: { role: "user" | "assistant"; content: string }[];
        mode?: "fast" | "precise";
        context?: {
          inspCtx?: { priority: string; title: string; ref: string; content: string }[];
          techCtx?: { priority: string; title: string; ref: string; basis: string; conclusion: string; source: string; permitDate?: string; inspectionDate?: string; inspectionYear?: string; installInspectionDate?: string }[];
          verdictCtx?: { priority: string; title: string; content: string }[];
          chatCtx?: { priority: string; content: string; note: string }[];
          memoCtx?: { title: string; content: string }[];
          precisionCtx?: { situation: string; judgment: string; basis: string; source: string }[];
        };
      };

      if (!messages || messages.length === 0) {
        return res.status(400).json({ error: "messages 필요합니다." });
      }

      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const userQuestion = messages[messages.length - 1]?.content || "";

      // 좋은 평가를 받은 유사 답변 참고 (RAG) — 참고만 하고 그대로 복사하지 않도록 프롬프트에 명시
      // 아래에서 바로 await하지 않고 Promise만 만들어 둔 뒤, 뒤따르는 승강기번호 조회/DB조회들과
      // 함께 나중에 한꺼번에 기다린다 — 임베딩 호출 왕복시간을 다른 작업과 겹쳐서 지연을 줄인다.
      const ragTask = (async (): Promise<string> => {
        try {
          const embedding = await getEmbedding(userQuestion);
          if (embedding) {
            const { pool: ragPool } = await import("./db");
            const vecStr = `[${embedding.join(",")}]`;
            const simRows = await ragPool.query(
              `SELECT question, answer, 1 - (embedding <=> $1::vector) as similarity
               FROM ai_answer_pool
               WHERE status = 'approved' AND embedding IS NOT NULL
               ORDER BY embedding <=> $1::vector LIMIT 1`,
              [vecStr]
            );
            if (simRows.rows.length > 0 && simRows.rows[0].similarity >= 0.82) {
              const ref = simRows.rows[0];
              return `\n\n[참고 — 과거 유사 질문에 좋은 평가를 받은 답변 스타일]\n질문: ${ref.question}\n답변: ${ref.answer.slice(0, 500)}\n(참고만 하고 현재 질문에 맞게 새로 작성할 것. 그대로 복사하지 말 것)`;
            }
          }
        } catch (e) {}
        return "";
      })();

      // 승강기 고유번호 감지 (7자리 숫자 또는 4자리-3자리 형식)
      let elevatorInfoSection = "";
      const elvtrMatch = userQuestion.match(/\b(\d{4}-\d{3}|\d{7})\b/);
      if (elvtrMatch) {
        try {
          const elvtrNo = elvtrMatch[1].replace(/-/g, "");  // 하이픈 제거
          const apiKey = process.env.ELEVATOR_API_KEY;
          const url = `https://apis.data.go.kr/B553664/ElevatorInstallationService/getInstallationElvtrListV2?serviceKey=${encodeURIComponent(apiKey)}&elevator_no=${encodeURIComponent(elvtrNo)}&numOfRows=1&pageNo=1&_type=json`;
          const elvResp = await fetch(url);
          const elvData = await elvResp.json();
          console.log("[승강기API] elvtrNo:", elvtrNo, "response:", JSON.stringify(elvData?.response?.header));
          const item = elvData?.response?.body?.items?.item;
          if (item) {
            const info = Array.isArray(item) ? item[0] : item;
            (req as any).elevatorData = info;
            const installDate = String(info.installationDe || info.frstInstallationDe || "");
            // 날짜 포맷 변환 (20020910 → 2002-09-10)
            const formatDate = (d: string) => d.length === 8 ? `${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}` : d;
            elevatorInfoSection = `\n\n[승강기 정보 - ${elvtrNo}]\n건물명: ${info.buldNm || "-"}\n주소: ${info.address1 || "-"} ${info.address2 || ""}\n종류: ${info.elvtrKindNm || "-"} (${info.elvtrDiv || "-"})\n형식: ${info.elvtrForm || "-"} ${info.elvtrDetailForm || ""}\n설치일자: ${installDate ? formatDate(installDate) : "-"}\n최초설치일자: ${info.frstInstallationDe ? formatDate(String(info.frstInstallationDe)) : "-"}\n정격속도: ${info.ratedSpeed || "-"} m/s\n적재하중: ${info.liveLoad || "-"} kg\n정원: ${info.ratedCap || "-"}명\n운행층수: ${info.shuttleFloorCnt || "-"}층\n설치장소: ${info.installationPlace || "-"}`;

            // 설치일자 기준 안전 포인트 추출 (종전 or 신설)
            if (installDate) {
              try {
                const { pool: safetyPool } = await import("./db");
                const isoDate = formatDate(installDate);

                let safetyRows = await safetyPool.query(
                  `SELECT r.item_id, r.description as old_desc, c.description as cur_desc,
                          r.effective_date, r.expiry_date, 'previous' as point_type
                   FROM inspection_item_revisions r
                   JOIN inspection_item_revisions c ON c.item_id = r.item_id AND c.introduction_type = 'current'
                   WHERE r.introduction_type = 'old'
                   AND r.effective_date <= $1
                   AND (r.expiry_date >= $1 OR r.expiry_date IS NULL)
                   AND r.description IS NOT NULL AND TRIM(r.description) != ''
                   AND c.description IS NOT NULL AND TRIM(c.description) != ''
                   ORDER BY RANDOM() LIMIT 3`,
                  [isoDate]
                );

                if (safetyRows.rows.length === 0) {
                  safetyRows = await safetyPool.query(
                    `SELECT sub.item_id, r.description as old_desc, c.description as cur_desc,
                            sub.first_date as effective_date, NULL as expiry_date, 'new' as point_type
                     FROM (
                       SELECT item_id, MIN(effective_date) as first_date
                       FROM inspection_item_revisions
                       WHERE introduction_type = 'old'
                       GROUP BY item_id
                       HAVING MIN(effective_date) > $1
                     ) sub
                     JOIN inspection_item_revisions r ON r.item_id = sub.item_id
                       AND r.introduction_type = 'old' AND r.effective_date = sub.first_date
                     JOIN inspection_item_revisions c ON c.item_id = sub.item_id AND c.introduction_type = 'current'
                     WHERE r.description IS NOT NULL AND TRIM(r.description) != ''
                     AND c.description IS NOT NULL AND TRIM(c.description) != ''
                     ORDER BY RANDOM() LIMIT 3`,
                    [isoDate]
                  );
                }
                // AI로 각 항목 유의사항 생성
                const rows = safetyRows.rows;
                const safetyWithWarn = await Promise.all(rows.map(async (row: any) => {
                  try {
                    const isNew = row.point_type === 'new';
                    const warnResp = await anthropic.messages.create({
                      model: "claude-haiku-4-5-20251001",
                      max_tokens: 150,
                      system: isNew
                        ? `승강기 검사 전문가. 설치 이후 신설/강화된 기준을 안내한다. "✅ [강화된 내용 요약]. 소급 적용 여부를 확인하세요." 형식으로 한 문장만 출력. 마크다운 없음.`
                        : `승강기 검사 전문가. 종전/현행 차이 분석해 한 문장 유의사항. 종전 기준에 적합하게 설치된 현장이므로 과잉 지적 표현은 금지. "⚠️ 현행 기준과 달리 [차이점]이 있을 수 있습니다. 확인 시 참고하세요." 또는 "✅ [확인 포인트]를 현장에서 확인하세요." 형식. 한 문장만. 마크다운 없음.`,
                      messages: [{ role: "user", content: isNew
                        ? `신설/강화 기준: ${row.cur_desc.slice(0,200)}`
                        : `종전: ${row.old_desc.slice(0,200)}
현행: ${row.cur_desc.slice(0,200)}` }],
                    });
                    const warnText = warnResp.content[0].type === "text" ? warnResp.content[0].text.trim() : "";
                    return { ...row, warn: warnText };
                  } catch(e) {
                    return { ...row, warn: "⚠️ 현행 기준과 차이 있는 항목입니다. 현장 확인 시 유의하세요." };
                  }
                }));
                (req as any).safetyPoints = safetyWithWarn;
                (req as any).isElevatorQuery = true;
              } catch(e) {}
            }
          } else {
            console.log("[승강기API] 항목 없음:", JSON.stringify(elvData?.response?.body));
          }
        } catch (e) {
          // 조회 실패 시 무시
        }
      }

      // ── 컨텍스트 텍스트 구성 ──────────────────────────────────────────
      const sections: string[] = [];
      if (context) {
        if (context.inspCtx?.length) {
          sections.push("[1순위] 검사기준(별표22)\n" +
            context.inspCtx.map(c => `■ ${c.title}${c.ref ? ` [${c.ref}]` : ""}\n${c.content}`).join("\n\n"));
        }
        if (context.verdictCtx?.length) {
          sections.push("[2순위] 판정지침\n" +
            context.verdictCtx.map(c => `■ ${c.title}\n${c.content}`).join("\n\n"));
        }
        if (context.techCtx?.length) {
          sections.push("[3순위] 기술자료(표준화)\n" +
            context.techCtx.map(c => {
              const dates = [
                c.permitDate ? `건축허가일: ${c.permitDate}` : "",
                c.inspectionDate ? `검사기준적용일: ${c.inspectionDate}` : "",
                c.inspectionYear ? `검사일: ${c.inspectionYear}` : "",
                c.installInspectionDate ? `설치검사일: ${c.installInspectionDate}` : "",
              ].filter(Boolean).join(" / ");
              return `■ ${c.title}\n${c.basis ? `현안: ${c.basis}\n` : ""}${c.conclusion ? `결정: ${c.conclusion}\n` : ""}${dates ? `적용시기: ${dates}\n` : ""}출처: ${c.source}`;
            }).join("\n\n"));
        }
        if (context.memoCtx?.length) {
          sections.push("[4순위] 현장메모\n" +
            context.memoCtx.map(c => `• [${c.title}] ${c.content}`).join("\n"));
        }
        if (context.precisionCtx?.length) {
          sections.push("[4순위] 정밀안전검사 판정기준\n" +
            context.precisionCtx.map(c =>
              `• ${c.situation}: ${c.judgment} / 근거: ${c.basis}`
            ).join("\n"));
        }
        if (context.chatCtx?.length) {
          sections.push("[참고] 현장의견(비공식)\n" +
            context.chatCtx.map(c => `• ${c.content}`).join("\n"));
        }
      }
      // ── 조문 DB 검색 / 키워드 조문 연혁 검색 / 메모 검색 / 질문유형 분류 ──
      // 네 조회는 서로의 결과를 필요로 하지 않으므로(순서 고정 표시만 나중에 동기 처리)
      // 병렬로 실행해 지연시간을 줄인다. (예전엔 순차 실행이라 4번의 왕복시간이 그대로 더해졌음)
      let articleCards: any[] = [];

      // 조문 DB 검색 (inspection_item_revisions) — 질문에 조문번호가 직접 언급된 경우
      const articleTask = (async (): Promise<any[] | null> => {
        try {
          const refMatches = userQuestion.match(/(?<![\d.])(?:1[0-7]|[1-9])\.\d+(?:\.\d+)*/g);
          if (!refMatches || refMatches.length === 0) return null;
          const uniqueRefs = [...new Set(refMatches)].slice(0, 5) as string[];
          const { pool: pgPool } = await import("./db");
          const placeholders = uniqueRefs.map((_: any, i: number) => `$${i + 1}`).join(", ");
          const revRows = await pgPool.query(
            `SELECT item_id, introduction_type, effective_date, expiry_date, description
             FROM inspection_item_revisions
             WHERE item_id IN (${placeholders})
             AND introduction_type IN ('current', 'old')
             AND description IS NOT NULL AND TRIM(description) != ''
             ORDER BY item_id, effective_date DESC NULLS FIRST`,
            uniqueRefs
          );
          return (revRows.rows && revRows.rows.length > 0) ? (revRows.rows as any[]) : null;
        } catch (e) {
          return null; // 조문 DB 조회 실패 시 무시
        }
      })();

      // 조문 연혁 키워드 검색 (조문번호를 언급하지 않는 질문도 커버) — SQL 자체는 위 조회와 무관하므로
      // 동시에 실행하고, 중복 제거(articleCards와 겹치는 item_id 제외)만 두 결과가 모두 온 뒤 처리한다.
      const keywordTask = (async (): Promise<any[] | null> => {
        try {
          const STOPWORDS = new Set([
            "관련", "대해", "대한", "알려줘", "무엇", "뭐", "어떻게", "해야", "하는지",
            "확인", "경우", "있는지", "해줘", "그리고", "되나요", "되는지", "인가요",
            "입니다", "궁금해요", "궁금합니다", "엘리베이터", "승강기", "기준", "조문", "규정", "조항",
          ]);
          const tokens = (userQuestion.match(/[가-힣A-Za-z0-9]+/g) || [])
            .filter((t: string) => t.length >= 2 && !STOPWORDS.has(t));
          const uniqueTokens = [...new Set(tokens)].slice(0, 6) as string[];
          if (uniqueTokens.length === 0) return null;
          const { pool: kwPool } = await import("./db");
          const likeConds = uniqueTokens.map((_, i) => `description ILIKE $${i + 1}`).join(" OR ");
          const matchCountExpr = uniqueTokens.map((_, i) => `(CASE WHEN description ILIKE $${i + 1} THEN 1 ELSE 0 END)`).join(" + ");
          const likeParams = uniqueTokens.map(t => `%${t}%`);
          const kwRows = await kwPool.query(
            `SELECT item_id, introduction_type, effective_date, expiry_date, description,
                    (${matchCountExpr}) AS match_count
             FROM inspection_item_revisions
             WHERE (${likeConds})
               AND introduction_type IN ('current', 'old')
               AND description IS NOT NULL AND TRIM(description) != ''
             ORDER BY match_count DESC, effective_date DESC NULLS FIRST
             LIMIT 8`,
            likeParams
          );
          return kwRows.rows as any[];
        } catch (e) {
          return null; // 키워드 조문 연혁 검색 실패 시 무시
        }
      })();

      // 메모 자동 검색 — 최대 3개 키워드를 병렬로 조회 (예전엔 for-await 순차 조회였음)
      const memoTask = (async (): Promise<string> => {
        try {
          const kwMatches = userQuestion.match(/[가-힣a-zA-Z]{2,6}/g) || [];
          const kws = [...new Set(kwMatches)].slice(0, 3) as string[];
          const memoResults = await Promise.all(kws.map(kw => storage.searchMemos(kw).catch(() => [] as any[])));
          const memoHits: string[] = [];
          memoResults.forEach((memos: any[]) => {
            memos.slice(0, 2).forEach((m: any) => {
              const content = m.content || m.description || "";
              if (content) memoHits.push(`[${m.title || "메모"}] ${content.slice(0, 250)}`);
            });
          });
          return memoHits.length > 0 ? "\n\n[현장메모]\n" + [...new Set(memoHits)].slice(0, 4).join("\n") : "";
        } catch {
          return "";
        }
      })();

      // ════════════════════════════════════════════════════════════
      // 0단계: 질문 유형 분류 (Haiku — 경량 빠름)
      // 유형: LOOKUP(조문/기준조회) | JUDGMENT(판정/판단) | CALCULATE(계산)
      // ════════════════════════════════════════════════════════════
      const classifierTask = (async (): Promise<"LOOKUP" | "JUDGMENT" | "CALCULATE"> => {
        try {
          const classifier = await anthropic.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 20,
            system: `승강기 검사 질문을 분류한다. 아래 중 하나만 반환한다.
LOOKUP: 조문·기준·규정을 묻는 질문 (예: "기준이 뭐야", "조문 알려줘")
JUDGMENT: 판정·적부·합격여부를 묻는 질문 (예: "적합한가", "지적해야 하나")
CALCULATE: 수치 계산이 필요하거나 계산 가능한 항목을 언급하는 질문
  - 동사형: "구해줘", "계산해줘", "얼마야"
  - 명사형: "균형추 여유거리", "카 상부틈새", "완충기 행정" 등 수치 계산이 명확히 필요한 항목명만 해당
  - 단순 기준 조회("높이 기준", "거리 기준", "설치 높이" 등)는 LOOKUP으로 분류
단어 하나만 반환.`,
            messages: [{ role: "user", content: userQuestion }],
          });
          const cls = classifier.content[0].type === "text" ? classifier.content[0].text.trim() : "";
          if (cls === "JUDGMENT") return "JUDGMENT";
          if (cls === "CALCULATE") return "CALCULATE";
        } catch {}
        return "LOOKUP";
      })();

      const [goodAnswerRefSection, articleRows, keywordRows, memoSection, questionType] = await Promise.all([
        ragTask, articleTask, keywordTask, memoTask, classifierTask,
      ]);

      // ── 병렬 조회 결과를 고정된 순서(조문번호 직접매칭 → 키워드 매칭)로 합성 ──
      if (articleRows) {
        const revText = articleRows.map((r: any) => {
          const dateInfo = r.introduction_type === 'current'
            ? `현행 (${r.effective_date || '2022-03-02'} 시행)`
            : `종전 (${r.effective_date || '이전'} ~ ${r.expiry_date || ''})`;
          return `[${r.item_id}] ${dateInfo}\n${r.description}`;
        }).join("\n\n");
        sections.push("[별표22 조문 원문]\n" + revText);

        const grouped: Record<string, any[]> = {};
        for (const r of articleRows) {
          if (!grouped[r.item_id]) grouped[r.item_id] = [];
          grouped[r.item_id].push({
            type: r.introduction_type === 'current' ? 'current' : 'old',
            effectiveDate: r.effective_date,
            expiryDate: r.expiry_date,
            description: r.description,
          });
        }
        articleCards = Object.entries(grouped).map(([itemId, versions]) => ({ itemId, versions }));
      }

      if (keywordRows) {
        const existingIds = new Set(articleCards.map((a: any) => a.itemId));
        const newRows = keywordRows.filter((r: any) => !existingIds.has(r.item_id));
        if (newRows.length > 0) {
          const revText = newRows.map((r: any) => {
            const dateInfo = r.introduction_type === 'current'
              ? `현행 (${r.effective_date || '2022-03-02'} 시행)`
              : `종전 (${r.effective_date || '이전'} ~ ${r.expiry_date || ''})`;
            return `[${r.item_id}] ${dateInfo}\n${r.description}`;
          }).join("\n\n");
          sections.push("[키워드 매칭 조문 연혁]\n" + revText);

          const kwGrouped: Record<string, any[]> = {};
          for (const r of newRows) {
            if (!kwGrouped[r.item_id]) kwGrouped[r.item_id] = [];
            kwGrouped[r.item_id].push({
              type: r.introduction_type === 'current' ? 'current' : 'old',
              effectiveDate: r.effective_date,
              expiryDate: r.expiry_date,
              description: r.description,
            });
          }
          articleCards.push(...Object.entries(kwGrouped).map(([itemId, versions]) => ({ itemId, versions })));
        }
      }

      const contextText = (sections.length > 0 || elevatorInfoSection || goodAnswerRefSection)
        ? "\n\n---\n" + sections.join("\n\n") + elevatorInfoSection + goodAnswerRefSection + "\n---"
        : "";

      // CALCULATE: 자료에서 공식 추출 → 필요 변수 질문 → 계산
      if (questionType === "CALCULATE") {
        // 대화 히스토리에 이미 변수값이 있는지 확인
        const prevMessages = messages.slice(0, -1);
        const hasVariables = prevMessages.some(m => m.role === "user" && /\d+(\.\d+)?/.test(m.content));

        const calcSystem = hasVariables
          ? `승강기 검사 계산 전문가다. 제공된 자료에서 공식을 찾아 대화에서 수집된 변수값으로 계산하고 결과와 적합/부적합 판정을 내린다. 계산 과정을 단계별로 보여준다.${contextText}${memoSection}`
          : `승강기 검사 계산 전문가다. 제공된 자료(메모 포함)에서 계산 공식과 필요한 변수를 파악한다.
공식을 찾으면: "계산을 위해 다음 값이 필요합니다:" 로 시작하여 필요한 변수만 번호로 나열한다.
공식이 없으면: "해당 계산 기준 없음" 한 줄만 출력한다.
불필요한 설명 없이 필요한 변수 목록만 출력한다.${contextText}${memoSection}`;

        const calcResp = await anthropic.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 800,
          system: calcSystem,
          messages: messages,
        });
        const calcText = calcResp.content[0].type === "text" ? calcResp.content[0].text.trim() : "";

        // 균형추 여유거리 계산 카드 감지
        const isCounterWeight = /균형추.*여유거리|여유거리.*균형추/i.test(userQuestion);
        if (isCounterWeight) {
          const hasVerb = /구해|계산|얼마|알려|나와/.test(userQuestion);
          const replyText = hasVerb
            ? "균형추 최대 여유거리를 계산해드릴게요. 아래 정보를 입력해주세요."
            : "균형추 최대 여유거리는 측정값·완충기 행정·속도로 계산합니다. 아래 카드로 바로 계산해보세요.";
          return res.json({
            reply: replyText,
            usedSources: [],
            type: "CALCULATE",
            calcCard: "COUNTER_WEIGHT",
          });
        }

        return res.json({ reply: calcText, usedSources: [], type: "CALCULATE" });
      }

      // ════════════════════════════════════════════════════════════
      // 3-Agent 파이프라인 (LOOKUP / JUDGMENT)
      // 규칙1: 어플 내 등록된 데이터만 검색한다 (외부 인터넷 검색 없음)
      // 규칙2: 에이전트1 초안 → 에이전트2 독립 재검증 (병렬 실행)
      //        → 불일치 시에만 에이전트3 중재
      // 규칙3: 에이전트 간 대화는 노출하지 않고 최종 결론만 반환한다
      // 규칙4: mode="fast"(기본) / "precise" 에 따라 모델·씽킹 여부가 달라진다
      // ════════════════════════════════════════════════════════════

      const chatMode: "fast" | "precise" = mode === "precise" ? "precise" : "fast";
      const pipelineStart = Date.now();
      // thinking 블록이 섞여 나올 수 있으므로 text 블록을 안전하게 찾아 추출
      const getText = (resp: any): string => {
        const block = (resp.content || []).find((b: any) => b.type === "text");
        return block ? String(block.text).trim() : "";
      };

      const answerRules = `## 자료 정확도 원칙 (최우선)
아래 순서대로 자료를 찾아라. 상위 자료에서 답을 찾으면 하위 자료는 무시한다.

1순위 [검사기준] — 별표22 조문 (법적 근거, 가장 신뢰)
2순위 [판정지침] — 승강기검사결과 판정지침 (공식 판정 기준)
3순위 [기술자료] — 표준화 결정 (공식 적용 방법)
4순위 [현장메모] — 비공식 현장 의견. 1~3순위에서 답을 찾은 경우 메모는 완전 무시.
                   1~3순위에 자료가 전혀 없을 때만 참고하고 반드시 "(비공식 현장의견)" 표시.

★ 메모가 검사기준과 다르면 검사기준이 정답이다.
★ 키워드가 비슷해도 질문의 맥락과 다른 메모는 무시한다.

## 자료가 부족할 때 처리 순서 (중요 — 절대 바로 포기하지 말 것)
1단계: 1~4순위 자료 전체에서 질문과 직접 일치하는 조문·기준을 찾는다.
2단계: 직접 일치하는 조문이 없어도, 관련된 일반 원칙이나 위임·참조 조항
       (예: "이 기준에서 다루지 아니하는 사항은 OOO 법령에 따른다" 같은 문구)이
       자료 안에 있으면 그것을 근거로 최대한 답을 구성한다. 이 경우 어떤 자료를 근거로
       추론했는지 명확히 밝힌다.
3단계: 2단계로도 실마리를 전혀 찾지 못한 경우에만, "해당 기준 없음" 같은 성의 없는
       한 줄 대신 다음 형식으로 답한다: "이 질문은 [이 앱이 다루는 자료 범위] 밖의
       사항입니다. [자료에서 확인된 위임 법령·기관명이 있으면 그 이름]에서 확인이
       필요합니다." 위임 법령·기관명을 모르면 "관련 법령·기관 확인이 필요합니다"로
       마무리하고, 근거 없이 추측한 법령명을 지어내지 않는다.

## 승강기번호 분석 (최우선 처리)
[승강기 정보 - XXXXXXX] 가 컨텍스트에 있는 경우 반드시 다음을 수행한다:
1. 설치일자(또는 최초설치일자)를 건축허가일 근사값으로 사용
2. 2022년 3월 2일 이전 설치 → 종전 기준 적용 항목 존재 가능성 명시
3. 설치 시기별로 검사 시 유의해야 할 주요 항목을 구체적으로 안내:
   - 피트 정지장치 위치/개수 기준 변경 여부
   - 승강장문 잠금장치 기준 변경 여부
   - 카 상부틈새/균형추 여유거리 기준 변경 여부
   - 비상통화장치 기준 변경 여부 등
4. "검사 시 유의사항" 형태로 표현 (위험이라는 단어 대신)
5. 설치일자가 없으면 "설치일자 확인 필요" 안내

## 계산/판정 질문 처리 (최우선)
질문이 수치 계산 또는 현장 판정을 요구하는 경우:
1. 자료(검사기준/판정지침/기술자료/메모)에서 계산법과 필요한 변수를 먼저 파악한다
2. 자료에 공식이 있으면 그 공식에서 필요한 변수만 사용자에게 질문한다
   - 예: 메모에 "균형추 여유거리 = 카 상부틈새 - X" 공식이 있으면 X에 해당하는 측정값만 질문
   - 공식과 무관한 변수는 절대 묻지 않는다
3. 측정값을 받으면 자료의 공식에 대입하여 계산하고 적합/부적합 판정을 내린다
4. 계산 과정과 결과를 명확히 보여준다

## 답변 규칙
- 결론을 첫 줄에 (판정/핵심 수치/날짜)
- 조문번호는 [별표22] X.X.X 형식으로 명시
- 항목 2개 이상이면 반드시 마크다운 리스트 형식으로 각 항목을 별도 줄에 작성:
  - 항목1
  - 항목2
- 단락 사이는 빈 줄로 구분
- 인사·서론·마무리·공단문의 없음
- 1~3순위 자료에 직접 일치가 없을 때는 위 "자료가 부족할 때 처리 순서"를 따른다 ("해당 기준 없음" 한 줄로 끝내지 말 것)
- 표(|---|) 금지
- 외부 인터넷 정보 절대 사용 금지
- • 기호 사용 금지 — 반드시 마크다운 - 리스트 사용

## 출처
답변 마지막:
📌 근거: [검사기준] 조문 | [판정지침] 항목 | [기술자료] 표준화명
메모는 1~3순위 자료 없을 때만 표시`;

      let agent1: any = null, agent2: any = null, compare: any = null, agent3: any = null;
      let reply = "";

      if (chatMode === "fast") {
        // ── 빠른 답변: 교차검증 없이 단일 에이전트 1회 호출 (속도 최우선) ──
        // 예전엔 fast 모드도 rerank + 에이전트1/2 + 비교 + (불일치시)에이전트3, 최대 4번의
        // Claude 왕복을 거쳐 20초+ 걸렸다. 정밀 답변 모드가 따로 있으니, 빠른 답변은
        // 이름 그대로 검증 단계 없이 단일 호출로 바로 답한다.
        agent1 = await anthropic.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 1200,
          system: `당신은 승강기 안전검사 현장 전문가다. 제공된 어플 내부 자료만 근거로 답한다.

${answerRules}${contextText}${memoSection}`,
          messages: messages,
        } as any);
        reply = getText(agent1);
      } else {
        // ── 정밀 답변: 에이전트1 초안 + 에이전트2 독립 재검증(병렬) → 불일치 시에만 에이전트3 중재 ──
        const MODEL = { agent1: "claude-opus-4-8", agent2: "claude-opus-4-8", compare: "claude-sonnet-4-6", agent3: "claude-opus-4-8" };
        // thinking 사용 시 사고 토큰도 max_tokens에 포함되므로 여유를 둔다
        const agentMaxTokens = 3000;
        const thinkingParam = { thinking: { type: "adaptive" as const } };

        [agent1, agent2] = await Promise.all([
          anthropic.messages.create({
            model: MODEL.agent1,
            max_tokens: agentMaxTokens,
            ...thinkingParam,
            system: `당신은 승강기 안전검사 현장 전문가(에이전트1)다. 제공된 어플 내부 자료만 근거로 답한다.

먼저 첫 줄에 "[핵심결론] 한 줄 요약"을 쓰고, 빈 줄 하나 띄운 뒤 아래 형식의 최종 답변을 작성해라.

${answerRules}${contextText}${memoSection}`,
            messages: messages,
          } as any),
          // ── 에이전트2 — 독립 재검증 (에이전트1 답변은 보여주지 않음) ──
          anthropic.messages.create({
            model: MODEL.agent2,
            max_tokens: 400,
            system: `승강기 안전검사 전문 분석가(에이전트2)다. 제공된 자료만으로 이 질문의 결론을 처음부터 독립적으로 도출해라. 다른 사람의 답은 본 적이 없다.

자료 신뢰도 순서: [검사기준] > [판정지침] > [기술자료] > [현장메모]
검사기준/판정지침에서 답을 찾으면 메모는 무시한다.

아래 JSON만 반환해라.
{
  "독립결론": "핵심 판정/수치를 한 줄로",
  "근거조문": ["관련 조문번호 — 검사기준/판정지침 우선"],
  "확신도": "high|medium|low",
  "사용자료": "검사기준|판정지침|기술자료|메모"
}
다른 텍스트 없이 JSON만.${contextText}${memoSection}`,
            messages: [{ role: "user", content: `질문: "${userQuestion}"` }],
          }),
        ]);
        const agent1Text = getText(agent1);
        const agent1Match = agent1Text.match(/^\[핵심결론\]\s*(.+)$/m);
        const agent1Summary = agent1Match ? agent1Match[1].trim() : "";
        const agent1Answer = agent1Text.replace(/^\[핵심결론\].*\n+/, "").trim();

        let agent2Data: any = {};
        try {
          const raw2 = getText(agent2) || "{}";
          agent2Data = JSON.parse(raw2.replace(/```json|```/g, "").trim());
        } catch {}

        // ── 일치 여부 판정 (경량 비교) ───────────────────────────
        compare = await anthropic.messages.create({
          model: MODEL.compare,
          max_tokens: 200,
          system: `두 결론이 실질적으로 같은 판정/수치를 말하는지 비교해라. 표현이 달라도 같은 판정이면 일치로 본다.
아래 JSON만 반환해라.
{ "일치여부": true|false, "불일치_사유": "구체적 차이점 또는 null" }
다른 텍스트 없이 JSON만.`,
          messages: [{
            role: "user",
            content: `결론A(에이전트1): "${agent1Summary}"\n결론B(에이전트2): "${agent2Data.독립결론 || ""}"`,
          }],
        });
        let compareData: any = { 일치여부: true, 불일치_사유: null };
        try {
          const raw3 = getText(compare) || "{}";
          compareData = JSON.parse(raw3.replace(/```json|```/g, "").trim());
        } catch {}

        reply = agent1Answer;

        // ── 에이전트3 — 불일치 시에만 중재 ─────────────────────
        if (compareData.일치여부 === false) {
          agent3 = await anthropic.messages.create({
            model: MODEL.agent3,
            max_tokens: agentMaxTokens,
            ...thinkingParam,
            system: `당신은 승강기 안전검사 수석 전문가(에이전트3, 중재자)다.
두 결론이 불일치했다. 제공된 어플 내부 자료를 다시 확인해 최종 판정을 확정하고, 아래 형식으로 최종 답변만 작성해라(중재 과정은 쓰지 마라).

에이전트1 결론: "${agent1Summary}"
에이전트2 결론: "${agent2Data.독립결론 || ""}"
불일치 사유: "${compareData.불일치_사유 || ""}"

${answerRules}${contextText}${memoSection}`,
            messages: messages,
          } as any);
          reply = getText(agent3) || agent1Answer;
        }
      }

      // AI 사용량 DB 저장 (모든 사용자 누적 — 껐다 켜도 DB에 영구 보존)
      // 모드(fast/precise)에 따라 실제 호출 모델이 달라지므로, 각 응답의 model 필드로
      // 정확한 단가를 찾아 계산한다 (고정된 haiku/sonnet/opus 자리 가정 금지).
      try {
        const { db: uDb } = await import("./db");
        const { aiUsage } = await import("@shared/schema");
        // 1M 토큰당 가격(달러)
        const PRICE: Record<string, { in: number; out: number }> = {
          "claude-opus-4-8": { in: 15, out: 75 },
          "claude-sonnet-4-6": { in: 3, out: 15 },
          "claude-haiku-4-5-20251001": { in: 0.25, out: 1.25 },
        };
        const calls = [agent1, agent2, compare, agent3].filter(Boolean) as any[];
        let inputTok = 0, outputTok = 0, cost = 0;
        for (const c of calls) {
          const price = PRICE[c.model] || PRICE["claude-sonnet-4-6"];
          const inTok = c.usage?.input_tokens || 0;
          const outTok = c.usage?.output_tokens || 0;
          inputTok += inTok;
          outputTok += outTok;
          cost += (inTok * price.in + outTok * price.out) / 1_000_000;
        }
        const question = Array.isArray(messages) && messages.length > 0
          ? String(messages[messages.length - 1]?.content || "").slice(0, 200)
          : "";
        await uDb.insert(aiUsage).values({
          question,
          inputTokens: inputTok,
          outputTokens: outputTok,
          costUsd: cost.toFixed(6),
        });
      } catch (e) {
        console.error("[usage 저장 오류]", e);
      }

      // ── 에이전트가 실제 사용한 자료 파싱 → 카드 연동용 ──────────
      const usedSources: { type: string; title: string; ref: string }[] = [];
      // 📌 근거: [검사기준] 조문 | [기술자료] 표준화명 | [메모] 제목 파싱
      const sourceMatch = reply.match(/📌\s*근거[:\s]+(.+)$/m);
      if (sourceMatch) {
        const sourceStr = sourceMatch[1];
        const parts = sourceStr.split(/\s*\|\s*/);
        parts.forEach(part => {
          const insp = part.match(/\[검사기준\]\s*(.+)/);
          const tech = part.match(/\[기술자료\]\s*(.+)/);
          const guide = part.match(/\[검사가이드\]\s*(.+)/);
          const memo = part.match(/\[메모\]\s*(.+)/);
          const judg = part.match(/\[판정지침\]\s*(.+)/);
          if (insp) usedSources.push({ type: "inspection", title: insp[1].trim(), ref: insp[1].trim() });
          if (tech)  usedSources.push({ type: "standard",   title: tech[1].trim(),  ref: tech[1].trim() });
          if (guide) usedSources.push({ type: "guide",      title: guide[1].trim(), ref: guide[1].trim() });
          if (memo)  usedSources.push({ type: "memo",       title: memo[1].trim(),  ref: memo[1].trim() });
          if (judg)  usedSources.push({ type: "judgment",   title: judg[1].trim(),  ref: judg[1].trim() });
        });
      }

      // AI 답변에서 조문번호 추출 → articleCards 보완
      try {
        const answerRefs = reply.match(/(?<![\d.])(?:1[0-7]|[1-9])\.\d+(?:\.\d+)*/g) || [];
        const questionRefs = userQuestion.match(/(?<![\d.])(?:1[0-7]|[1-9])\.\d+(?:\.\d+)*/g) || [];
        const allRefs = [...new Set([...answerRefs, ...questionRefs])].slice(0, 5) as string[];
        const existingIds = new Set(articleCards.map((a: any) => a.itemId));
        const newRefs = allRefs.filter(r => !existingIds.has(r));
        if (newRefs.length > 0) {
          const { pool: pgPool2 } = await import("./db");
          const placeholders2 = newRefs.map((_: any, i: number) => `$${i + 1}`).join(", ");
          const revRows = await pgPool2.query(
            `SELECT item_id, introduction_type, effective_date, expiry_date, description
             FROM inspection_item_revisions
             WHERE item_id IN (${placeholders2})
             AND introduction_type IN ('current', 'old')
             AND description IS NOT NULL AND TRIM(description) != ''
             ORDER BY item_id, effective_date DESC NULLS FIRST`,
            newRefs
          );
          if (revRows.rows && revRows.rows.length > 0) {
            const grouped: Record<string, any[]> = {};
            for (const r of revRows.rows as any[]) {
              if (!grouped[r.item_id]) grouped[r.item_id] = [];
              grouped[r.item_id].push({
                type: r.introduction_type === 'current' ? 'current' : 'old',
                effectiveDate: r.effective_date,
                expiryDate: r.expiry_date,
                description: r.description,
              });
            }
            const newCards = Object.entries(grouped).map(([itemId, versions]) => ({ itemId, versions }));
            articleCards = [...articleCards, ...newCards];
          }
        }
      } catch (e) {}

      // 승강기 정보 + 안전 포인트 응답에 포함
      const safetyPoints = (req as any).safetyPoints || [];
      const elevatorData = (req as any).elevatorData || null;
      const isElevatorQuery = (req as any).isElevatorQuery || false;
      res.json({
        reply: isElevatorQuery ? "" : reply,
        usedSources: isElevatorQuery ? [] : usedSources,
        articleCards: isElevatorQuery ? [] : articleCards,
        safetyPoints, elevatorData, isElevatorQuery,
        mode: chatMode,
        elapsedMs: Date.now() - pipelineStart,
      });


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

  // ==================== 업데이트 내역 ====================
  // 깃허브 최신 커밋을 가져와 AI로 이용자용 문구로 정리 후 캐싱. 새 커밋만 정리하므로
  // 반복 실행해도 이미 처리된 커밋은 다시 AI를 부르지 않는다(비용 절감).
  // 무거운 작업(깃허브 조회 + AI 호출)은 아래 refreshChangelogCache()가 백그라운드에서
  // 주기적으로 미리 처리해두고, GET /api/changelog는 캐시 테이블만 읽어 즉시 응답한다.
  let changelogRefreshing = false;
  const refreshChangelogCache = async () => {
    if (changelogRefreshing) return;
    changelogRefreshing = true;
    try {
      const { db: clDb } = await import("./db");
      const { changelogCache } = await import("@shared/schema");

      const GITHUB_REPO = process.env.GITHUB_REPO || "junho9109/Elevator-Assistant";
      const ghHeaders: Record<string, string> = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "elevator-assistant-app",
      };
      if (process.env.GITHUB_TOKEN) ghHeaders["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;

      // 1) 깃허브 최근 커밋 목록 조회 (main 브랜치, 최신 30개)
      let commits: any[] = [];
      try {
        const ghRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/commits?sha=main&per_page=30`, { headers: ghHeaders });
        if (ghRes.ok) commits = await ghRes.json();
      } catch {}
      if (commits.length === 0) return;

      // 2) 아직 캐시에 없는 커밋만 골라 AI로 문구 정리 후 저장
      const existing = await clDb.select({ sha: changelogCache.sha }).from(changelogCache);
      const existingShas = new Set(existing.map(r => r.sha));
      const newCommits = commits.filter((c: any) => c.sha && !existingShas.has(c.sha));
      if (newCommits.length === 0 || !process.env.ANTHROPIC_API_KEY) return;

      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      for (const c of newCommits) {
        const rawMsg = (c.commit?.message || "").split("\n")[0];
        let displayText: string | null = null;
        try {
          const resp = await anthropic.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 150,
            messages: [{
              role: "user",
              content: `다음은 승강기 정밀안전검사·검사기준 안내 앱의 git 커밋 메시지입니다.\n"${rawMsg}"\n\n이 앱을 쓰는 일반 이용자가 이해할 수 있는 자연스러운 한국어 한 문장으로 바꿔 주세요. "~했어요" 톤, 40자 내외, 개발 용어(디버그, 리팩터링, 컴포넌트 등) 사용 금지.\n다만 이용자가 화면이나 기능에서 전혀 체감할 수 없는 내부적인 변경(오타·문서·SQL 마이그레이션·빌드 설정·코드 정리 등)이라면 다른 말 없이 정확히 SKIP 이라고만 답하세요.`,
            }],
          });
          const block = resp.content[0];
          const text = block && block.type === "text" ? block.text.trim() : "";
          if (text && !/^SKIP$/i.test(text) && !text.includes("SKIP")) displayText = text;
        } catch {}

        try {
          await clDb.insert(changelogCache).values({
            sha: c.sha,
            commitDate: new Date(c.commit?.author?.date || c.commit?.committer?.date || Date.now()),
            rawMessage: rawMsg,
            displayText,
          }).onConflictDoNothing();
        } catch {}
      }
    } catch {} finally {
      changelogRefreshing = false;
    }
  };

  // 서버 시작 시 1회, 이후 10분마다 백그라운드로 최신 커밋을 미리 정리해둔다.
  refreshChangelogCache();
  setInterval(refreshChangelogCache, 10 * 60 * 1000);

  app.get("/api/changelog", async (req, res) => {
    try {
      const { db: clDb } = await import("./db");
      const { changelogCache } = await import("@shared/schema");
      const { desc: clDesc, isNotNull } = await import("drizzle-orm");

      const visible = await clDb.select().from(changelogCache)
        .where(isNotNull(changelogCache.displayText))
        .orderBy(clDesc(changelogCache.commitDate))
        .limit(30);

      res.json(visible);
    } catch (e: any) {
      res.status(500).json({ error: e.message || "업데이트 내역을 불러오지 못했습니다." });
    }
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

      // FCM 푸시 알림 전송 (비동기 — 응답 후 실행)
      setImmediate(async () => {
        try {
          if (!firebaseAdmin) return;
          const { pool: pushPool } = await import("./db");
          const tokenRows = await pushPool.query(`SELECT token FROM push_tokens`);
          const tokens = tokenRows.rows.map((r: any) => r.token).filter(Boolean);
          if (tokens.length === 0) return;
          const msgContent = content?.trim().slice(0, 50) || (imageData ? "📷 사진" : videoData ? "🎥 영상" : "새 메시지");
          await Promise.allSettled(
            tokens.map((token: string) =>
              firebaseAdmin.messaging().send({
                token,
                notification: {
                  title: `💬 ${userName.trim()}`,
                  body: msgContent,
                },
                android: { priority: "high", notification: { sound: "default", channelId: "chat", visibility: "public", notificationPriority: "PRIORITY_MAX" } },
              })
            )
          );
        } catch (e) {
          console.error("[FCM] 푸시 전송 오류:", e);
        }
      });
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

  // ==================== 검사기준(별표22) 조문 이미지 ====================
  app.get("/api/inspection-photos/:itemId", async (req, res) => {
    try {
      const db = (await import("./db")).db;
      const { inspectionItemPhotos } = await import("@shared/schema");
      const { eq, asc } = await import("drizzle-orm");
      const itemId = decodeURIComponent(req.params.itemId);
      const photos = await db.select({
        id: inspectionItemPhotos.id,
        displayOrder: inspectionItemPhotos.displayOrder,
        mimeType: inspectionItemPhotos.mimeType,
        createdAt: inspectionItemPhotos.createdAt,
      }).from(inspectionItemPhotos).where(eq(inspectionItemPhotos.itemId, itemId)).orderBy(asc(inspectionItemPhotos.displayOrder));
      res.json(photos);
    } catch (e) { res.status(500).json({ error: "Failed" }); }
  });

  app.get("/api/inspection-photos/:itemId/:id/image", async (req, res) => {
    try {
      const db = (await import("./db")).db;
      const { inspectionItemPhotos } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      const [photo] = await db.select().from(inspectionItemPhotos).where(eq(inspectionItemPhotos.id, parseInt(req.params.id)));
      if (!photo) return res.status(404).json({ error: "Not found" });
      const b64 = photo.imageData.replace(/^data:image\/\w+;base64,/, '');
      res.setHeader('Content-Type', photo.mimeType || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(Buffer.from(b64, 'base64'));
    } catch (e) { res.status(500).json({ error: "Failed" }); }
  });

  app.post("/api/inspection-photos/:itemId", upload.single('image'), async (req, res) => {
    try {
      const db = (await import("./db")).db;
      const { inspectionItemPhotos } = await import("@shared/schema");
      const { eq, count } = await import("drizzle-orm");
      const itemId = decodeURIComponent(req.params.itemId);
      const [{ value: cnt }] = await db.select({ value: count() }).from(inspectionItemPhotos).where(eq(inspectionItemPhotos.itemId, itemId));
      if (Number(cnt) >= 10) return res.status(400).json({ error: "최대 10장" });
      if (!req.file) return res.status(400).json({ error: "No image" });
      const base64Data = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const [photo] = await db.insert(inspectionItemPhotos).values({
        itemId,
        imageData: base64Data,
        mimeType: req.file.mimetype,
        displayOrder: Number(cnt),
      }).returning({ id: inspectionItemPhotos.id, displayOrder: inspectionItemPhotos.displayOrder, mimeType: inspectionItemPhotos.mimeType, createdAt: inspectionItemPhotos.createdAt });
      res.status(201).json(photo);
    } catch (e) { res.status(500).json({ error: "Failed" }); }
  });

  app.delete("/api/inspection-photos/:id", async (req, res) => {
    try {
      const db = (await import("./db")).db;
      const { inspectionItemPhotos } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      await db.delete(inspectionItemPhotos).where(eq(inspectionItemPhotos.id, parseInt(req.params.id)));
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

  // ── 전문가 지식 수집 ──
  // 활성 질문 목록 — 앱 첫 접속 시 배너에서 랜덤으로 하나 골라 보여주는 데 사용
  app.get("/api/expert-questions", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { expertQuestions } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      const activeOnly = req.query.active !== "false";
      const rows = activeOnly
        ? await db.select().from(expertQuestions).where(eq(expertQuestions.active, true))
        : await db.select().from(expertQuestions);
      res.json(rows);
    } catch (error) {
      handleError(res, error, "Failed to fetch expert questions");
    }
  });

  // 관리자가 질문을 직접 등록 (기본은 AI 생성이지만 보조 수단으로 남겨둠)
  app.post("/api/expert-questions", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { expertQuestions, insertExpertQuestionSchema } = await import("@shared/schema");
      const validated = insertExpertQuestionSchema.parse(req.body);
      if (!validated.presetAnswers || validated.presetAnswers.length !== 4) {
        return res.status(400).json({ error: "예상 답변은 4개여야 합니다." });
      }
      const [row] = await db.insert(expertQuestions).values(validated).returning();
      res.status(201).json(row);
    } catch (error) {
      res.status(400).json({ error: "Invalid expert question data", detail: String(error) });
    }
  });

  // 질문 활성/비활성 전환, 문구 수정
  app.put("/api/expert-questions/:id", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { expertQuestions } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      const id = parseInt(req.params.id);
      const { active, content, presetAnswers, category } = req.body as {
        active?: boolean; content?: string; presetAnswers?: string[]; category?: string | null;
      };
      const patch: any = {};
      if (active !== undefined) patch.active = active;
      if (content !== undefined) patch.content = content;
      if (presetAnswers !== undefined) patch.presetAnswers = presetAnswers;
      if (category !== undefined) patch.category = category;
      const [row] = await db.update(expertQuestions).set(patch).where(eq(expertQuestions.id, id)).returning();
      if (!row) return res.status(404).json({ error: "Not found" });
      res.json(row);
    } catch (error) {
      handleError(res, error, "Failed to update expert question");
    }
  });

  // AI가 새 질문 + 예상 답변 4개를 생성 — 기본 질문 생성 경로. 매뉴얼/별표에 명확히 없어 현장 판단이 필요한 주제를 노림.
  // 이미 등록된 질문과 겹치지 않도록 기존 질문 목록을 함께 전달함
  app.post("/api/expert-questions/generate", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { expertQuestions } = await import("@shared/schema");
      const existing = await db.select().from(expertQuestions);
      const existingList = existing.map(q => `- ${q.content}`).join("\n") || "(없음)";

      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 600,
        system: `너는 승강기(엘리베이터·에스컬레이터·휠체어리프트) 정밀·정기검사 분야의 베테랑 검사원이다.
현직 검사원들에게 던질 질문 1개를 새로 만들어라. 목적은 법령·판정지침·매뉴얼에 명확한 답이 나와 있지 않아서 검사원 개인의 현장 경험과 판단이 꼭 필요한 주제를 찾아, 그 경험을 데이터로 모으는 것이다.

규칙:
1. 이미 문서화된 기준을 그대로 묻는 질문(예: "몇 mm 이하면 부적합인가요" 같은 단순 수치 확인)은 금지 — 판단 기준이 애매하거나 매뉴얼에 없는 상황을 다뤄야 한다.
2. 비현실적이거나 실무에서 잘 마주치지 않는 상황은 피하고, 실제로 검사원이 종종 마주치는 애매한 판단 상황이어야 한다.
3. 아래 "이미 등록된 질문"과 주제가 겹치지 않게 한다.
4. 예상 답변 4개는 실제 검사원들이 낼 법한, 서로 구별되는 현실적인 대응 방식이어야 한다(비슷비슷한 답 4개 금지).
5. category는 "판정기준" | "현장경험" | "위험성평가" 중 하나로 분류한다.

이미 등록된 질문:
${existingList}

다른 설명 없이 아래 JSON 형식만 반환하라:
{"content": "질문 내용", "presetAnswers": ["답변1","답변2","답변3","답변4"], "category": "판정기준"}`,
        messages: [{ role: "user", content: "새 질문 1개를 만들어줘." }],
      });

      const raw = response.content[0].type === "text" ? response.content[0].text.trim() : "";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      if (!parsed.content || !Array.isArray(parsed.presetAnswers) || parsed.presetAnswers.length !== 4) {
        return res.status(502).json({ error: "AI 응답 형식이 올바르지 않습니다." });
      }
      const [row] = await db.insert(expertQuestions).values({
        content: parsed.content,
        presetAnswers: parsed.presetAnswers,
        category: parsed.category || null,
        active: true,
      }).returning();
      res.status(201).json(row);
    } catch (error) {
      res.status(500).json({ error: "질문 생성에 실패했습니다.", detail: String(error) });
    }
  });

  // 제출된 답변 목록 — employeeId로 조회하면 "이미 첫 접속 질문에 응답(또는 건너뛰기)했는지" 확인용,
  // status로 조회하면 관리자 검수 큐
  app.get("/api/expert-answers", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { expertAnswers } = await import("@shared/schema");
      const { eq, and, desc } = await import("drizzle-orm");
      const employeeId = req.query.employeeId as string | undefined;
      const status = req.query.status as string | undefined;
      const conditions = [] as any[];
      if (employeeId) conditions.push(eq(expertAnswers.employeeId, employeeId));
      if (status) conditions.push(eq(expertAnswers.status, status));
      const rows = conditions.length > 0
        ? await db.select().from(expertAnswers).where(and(...conditions)).orderBy(desc(expertAnswers.createdAt))
        : await db.select().from(expertAnswers).orderBy(desc(expertAnswers.createdAt));
      res.json(rows);
    } catch (error) {
      handleError(res, error, "Failed to fetch expert answers");
    }
  });

  app.post("/api/expert-answers", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { expertAnswers, insertExpertAnswerSchema } = await import("@shared/schema");
      const validated = insertExpertAnswerSchema.parse(req.body);
      const [row] = await db.insert(expertAnswers).values(validated).returning();
      res.status(201).json(row);
    } catch (error) {
      res.status(400).json({ error: "Invalid expert answer data", detail: String(error) });
    }
  });

  // 관리자 검수 — 승인/반려 전 답변 문구를 다듬고 연결 태그를 붙일 수 있음
  app.put("/api/expert-answers/:id", async (req, res) => {
    try {
      const { db } = await import("./db");
      const { expertAnswers } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      const id = parseInt(req.params.id);
      const { status, answerText, tags, reviewedById, reviewedByName } = req.body as {
        status?: string; answerText?: string; tags?: string[]; reviewedById?: string; reviewedByName?: string;
      };
      const patch: any = { reviewedAt: new Date() };
      if (status) patch.status = status;
      if (answerText !== undefined) patch.answerText = answerText;
      if (tags !== undefined) patch.tags = tags;
      if (reviewedById) patch.reviewedById = reviewedById;
      if (reviewedByName) patch.reviewedByName = reviewedByName;
      const [row] = await db.update(expertAnswers).set(patch).where(eq(expertAnswers.id, id)).returning();
      if (!row) return res.status(404).json({ error: "Not found" });
      res.json(row);
    } catch (error) {
      handleError(res, error, "Failed to update expert answer");
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
