import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

// 관리자 전용 사용자 관리 — 목록/검색, 소속 변경, 접속 차단·해제, 최근 변경 기록.
// 서버가 토큰의 사번·이름으로 관리자 여부를 다시 확인하므로, 이 창이 열려도 관리자가 아니면 목록이 오지 않는다.
type AdminUser = {
  id: number; name: string; empId: string; org: string; email: string;
  blocked: boolean; blockedReason: string; lastLoginAt: string | null; isAdmin: boolean;
};
type ChangeLog = {
  id: number; empId: string; name: string; kind: string; from: string | null; to: string | null;
  byEmpId: string; byName: string; createdAt: string;
};

function fmt(d: string): string {
  const t = new Date(d);
  return `${t.getMonth() + 1}/${t.getDate()} ${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
}

export default function UserAdminDialog({ authToken, onClose }: { authToken: string; onClose: () => void }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orgs, setOrgs] = useState<string[]>([]);
  const [logs, setLogs] = useState<ChangeLog[]>([]);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "blocked">("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<{ user: AdminUser; mode: "org" | "block" } | null>(null);
  const [newOrg, setNewOrg] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [ur, lr] = await Promise.all([
        fetch(`/api/admin/users?q=${encodeURIComponent(q)}`, { headers }),
        fetch("/api/admin/account-changes", { headers }),
      ]);
      if (!ur.ok) { const d = await ur.json().catch(() => ({})); setError(d.error || "목록을 불러오지 못했습니다."); setUsers([]); }
      else { setError(""); setUsers(await ur.json()); }
      if (lr.ok) setLogs(await lr.json());
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, authToken]);

  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);
  useEffect(() => { fetch("/api/auth/organizations").then(r => r.ok ? r.json() : Promise.reject()).then(setOrgs).catch(() => {}); }, []);

  const call = async (url: string, body?: any) => {
    setBusy(true); setError("");
    try {
      const r = await fetch(url, { method: "POST", headers, body: JSON.stringify(body || {}) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setError(d.error || "처리에 실패했습니다."); return false; }
      setTarget(null); setNewOrg(""); setReason("");
      await load();
      return true;
    } catch {
      setError("네트워크 오류가 발생했습니다.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const kindLabel = (l: ChangeLog) =>
    l.kind === "org_change" ? `소속 변경\n${l.from || "-"} → ${l.to || "-"}`
    : l.kind === "block" ? `접속 차단${l.to ? `\n사유: ${l.to}` : ""}`
    : l.kind === "unblock" ? "차단 해제" : l.kind;

  const shown = users.filter(u => tab === "all" || u.blocked);
  const blockedCount = users.filter(u => u.blocked).length;
  const field = "w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-card";

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-card w-full max-w-lg max-h-[92vh] rounded-t-2xl sm:rounded-2xl flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">사용자 관리</h3>
          <button onClick={onClose} aria-label="닫기"><X className="h-4 w-4 text-muted-foreground" /></button>
        </div>
        <div className="overflow-auto p-4 space-y-3">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="이름 · 사번 · 소속으로 검색" className={field} />
          <div className="flex gap-1.5">
            <button onClick={() => setTab("all")} className={`text-xs px-3 py-1 rounded-full ${tab === "all" ? "bg-[#1e3a5f] text-white" : "bg-muted text-muted-foreground"}`}>전체 {users.length}</button>
            <button onClick={() => setTab("blocked")} className={`text-xs px-3 py-1 rounded-full ${tab === "blocked" ? "bg-[#1e3a5f] text-white" : "bg-muted text-muted-foreground"}`}>차단 {blockedCount}</button>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          {loading && users.length === 0 && <p className="text-xs text-muted-foreground">불러오는 중...</p>}
          <div className="space-y-2">
            {shown.map(u => (
              <div key={u.id} className="border border-border rounded-xl p-3 text-xs">
                <div className="flex items-center justify-between">
                  <b className="text-sm">{u.name}</b>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${u.blocked ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>{u.blocked ? "차단됨" : "사용 중"}</span>
                </div>
                <p className="text-muted-foreground mt-0.5">사번 {u.empId || "-"} · {u.org}</p>
                {u.blocked && u.blockedReason && <p className="text-red-600 mt-0.5">사유: {u.blockedReason}</p>}
                <div className="flex gap-1.5 mt-2">
                  <button onClick={() => { setTarget({ user: u, mode: "org" }); setNewOrg(""); setError(""); }} className="px-2.5 py-1 rounded-lg border border-border">소속 변경</button>
                  {u.blocked ? (
                    <button disabled={busy} onClick={() => { if (confirm(`${u.name}님의 차단을 해제할까요?`)) call(`/api/admin/users/${u.id}/unblock`); }} className="px-2.5 py-1 rounded-lg border border-emerald-300 text-emerald-700">차단 해제</button>
                  ) : !u.isAdmin ? (
                    <button onClick={() => { setTarget({ user: u, mode: "block" }); setReason(""); setError(""); }} className="px-2.5 py-1 rounded-lg border border-red-300 text-red-700">접속 차단</button>
                  ) : null}
                </div>
              </div>
            ))}
            {!loading && shown.length === 0 && !error && <p className="text-xs text-muted-foreground">해당하는 사용자가 없습니다.</p>}
          </div>

          <div className="pt-2">
            <p className="text-xs font-semibold mb-1">최근 변경 기록</p>
            {logs.length === 0 ? <p className="text-xs text-muted-foreground">기록이 없습니다.</p> : logs.map(l => (
              <div key={l.id} className="text-[11px] text-muted-foreground border-b border-border py-1.5 leading-relaxed whitespace-pre-line">
                <b className="text-foreground">{fmt(l.createdAt)}</b> {l.name}({l.empId}) {kindLabel(l)}{"\n"}변경자 {l.byName === l.name ? "본인" : l.byName}
              </div>
            ))}
          </div>
        </div>

        {target && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4" onClick={() => setTarget(null)}>
            <div className="bg-card rounded-2xl p-4 w-full max-w-xs" onClick={e => e.stopPropagation()}>
              {target.mode === "org" ? (
                <>
                  <h4 className="text-sm font-semibold mb-2">소속 변경 — {target.user.name}</h4>
                  <p className="text-xs text-muted-foreground">현재 소속: {target.user.org}</p>
                  <label className="block text-[11px] text-muted-foreground mt-3 mb-1">변경할 소속</label>
                  <select value={newOrg} onChange={e => setNewOrg(e.target.value)} className={`${field} appearance-none`}>
                    <option value="">소속을 선택하세요</option>
                    {orgs.filter(o => o !== target.user.org).map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
                  <button disabled={busy || !newOrg} onClick={() => call(`/api/admin/users/${target.user.id}/org`, { org: newOrg })} className="w-full mt-3 py-2.5 text-sm font-semibold rounded-xl bg-[#1e3a5f] text-white disabled:opacity-50">변경</button>
                  <p className="text-[10.5px] text-muted-foreground mt-2">관리자 변경은 바로 적용되고 기록에 남습니다.</p>
                </>
              ) : (
                <>
                  <h4 className="text-sm font-semibold mb-2">접속 차단 — {target.user.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">차단하면 이 사번은 로그인할 수 없고, 이미 로그인된 기기도 곧 로그아웃됩니다.</p>
                  <label className="block text-[11px] text-muted-foreground mt-3 mb-1">차단 사유 (기록용, 선택)</label>
                  <input value={reason} onChange={e => setReason(e.target.value)} maxLength={200} placeholder="예: 퇴사, 부서 이동" className={field} />
                  {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
                  <button disabled={busy} onClick={() => call(`/api/admin/users/${target.user.id}/block`, { reason })} className="w-full mt-3 py-2.5 text-sm font-semibold rounded-xl bg-red-600 text-white disabled:opacity-50">접속 차단</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
