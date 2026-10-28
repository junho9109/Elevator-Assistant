import type { Express } from "express";
import { isAdminIdentity } from "../admin-identity";

// ── 접속 현황 · 헬스체크 · 앱 버전 ─────────────────────────────────────
// - GET  /api/health      : Railway 무중단 배포용 헬스체크(2xx면 새 서버로 교체)
// - GET  /api/app-version : 배포마다 바뀌는 값. 클라이언트가 달라진 것을 감지하면 자동 새로고침
// - POST /api/presence    : 클라이언트가 60초마다 보내는 "접속 중" 신호 (서버 메모리에만 보관, DB 변경 없음)
// - GET  /api/presence    : 관리자 전용, 최근 2분 안에 신호가 온 접속 중 목록

const ACTIVE_MS = 2 * 60 * 1000;
const PRUNE_MS = 10 * 60 * 1000;
const STARTED_AT = String(Date.now());

type Entry = { employeeId: string; name?: string; team?: string; page?: string; ts: number };
const online = new Map<string, Entry>();

function appVersion(): string {
  return process.env.RAILWAY_DEPLOYMENT_ID || process.env.RAILWAY_GIT_COMMIT_SHA || STARTED_AT;
}

export function registerPresenceRoutes(app: Express) {
  app.get("/api/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.get("/api/app-version", (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({ version: appVersion() });
  });

  app.post("/api/presence", (req, res) => {
    try {
      const { employeeId, employeeName, team, page } = req.body as {
        employeeId?: string; employeeName?: string; team?: string; page?: string;
      };
      if (employeeId) {
        const id = String(employeeId).slice(0, 50);
        online.set(id, {
          employeeId: id,
          name: employeeName ? String(employeeName).slice(0, 50) : undefined,
          team: team ? String(team).slice(0, 50) : undefined,
          page: page ? String(page).slice(0, 50) : undefined,
          ts: Date.now(),
        });
      }
      const now = Date.now();
      online.forEach((v, k) => { if (now - v.ts > PRUNE_MS) online.delete(k); });
    } catch {}
    res.status(204).end();
  });

  app.get("/api/presence", (req, res) => {
    const { admin, employeeId, employeeName } = req.query as { admin?: string; employeeId?: string; employeeName?: string };
    if (!(admin === "true" || isAdminIdentity(employeeId, employeeName))) {
      return res.status(403).json({ error: "관리자만 볼 수 있습니다" });
    }
    const now = Date.now();
    const users = Array.from(online.values())
      .filter(v => now - v.ts <= ACTIVE_MS)
      .sort((a, b) => b.ts - a.ts)
      .map(v => ({ employeeId: v.employeeId, name: v.name, team: v.team, page: v.page, secondsAgo: Math.round((now - v.ts) / 1000) }));
    res.set("Cache-Control", "no-store");
    res.json({ count: users.length, users });
  });
}
