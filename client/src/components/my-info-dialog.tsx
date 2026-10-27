import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

// 내 정보 — 이름·사번·현재 소속을 보여 주고, 비밀번호 재확인 후 본인 소속을 변경한다.
export default function MyInfoDialog({
  authToken, onClose, onOrgChanged,
}: {
  authToken: string;
  onClose: () => void;
  onOrgChanged: (org: string, token: string) => void;
}) {
  const saved = (() => { try { return JSON.parse(localStorage.getItem("loginInfo") || "{}"); } catch { return {}; } })();
  const [orgs, setOrgs] = useState<string[]>([]);
  const [currentOrg, setCurrentOrg] = useState<string>(saved.org || "");
  const [newOrg, setNewOrg] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ from: string; to: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/organizations").then(r => r.ok ? r.json() : Promise.reject()).then(setOrgs).catch(() => {});
  }, []);

  const submit = async () => {
    setError("");
    if (!newOrg) { setError("변경할 소속을 선택해 주세요."); return; }
    if (newOrg === currentOrg) { setError("현재 소속과 같습니다. 변경할 소속을 선택해 주세요."); return; }
    if (!password) { setError("비밀번호를 입력하세요."); return; }
    setLoading(true);
    try {
      const r = await fetch("/api/auth/change-org", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ org: newOrg, password }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) { setError(data.error || "소속 변경에 실패했습니다."); return; }
      setDone({ from: data.previousOrg || currentOrg, to: data.org });
      setCurrentOrg(data.org);
      setPassword("");
      onOrgChanged(data.org, data.token);
    } catch {
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const row = "flex justify-between text-xs py-1.5 border-b border-border";
  const field = "w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-card";

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl p-5 w-full max-w-xs" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">내 정보</h3>
          <button onClick={onClose} aria-label="닫기"><X className="h-4 w-4 text-muted-foreground" /></button>
        </div>
        <div className={row}><span className="text-muted-foreground">이름</span><span>{saved.name || "-"}</span></div>
        <div className={row}><span className="text-muted-foreground">사번</span><span>{saved.empId || "-"}</span></div>
        <div className={row}><span className="text-muted-foreground">현재 소속</span><span className={done ? "font-semibold text-emerald-600" : ""}>{currentOrg || "-"}</span></div>

        {done ? (
          <>
            <div className="mt-3 text-xs rounded-lg border border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-3 py-2 leading-relaxed">
              소속을 {done.from} → {done.to}(으)로 변경했습니다. 다음 로그인부터 새 소속을 선택해 주세요.
            </div>
            <button onClick={onClose} className="w-full mt-3 py-2.5 text-sm font-semibold rounded-xl bg-[#1e3a5f] text-white">닫기</button>
          </>
        ) : (
          <>
            <label className="block text-[11px] text-muted-foreground mt-3 mb-1">변경할 소속</label>
            <select value={newOrg} onChange={e => { setNewOrg(e.target.value); setError(""); }} className={`${field} appearance-none`}>
              <option value="">소속을 선택하세요</option>
              {orgs.filter(o => o !== currentOrg).map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <label className="block text-[11px] text-muted-foreground mt-3 mb-1">비밀번호 확인</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && submit()}
              placeholder="비밀번호를 입력하세요"
              className={field}
            />
            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
            <button onClick={submit} disabled={loading} className="w-full mt-3 py-2.5 text-sm font-semibold rounded-xl bg-[#1e3a5f] text-white disabled:opacity-60">
              {loading ? "처리 중..." : "소속 변경"}
            </button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
