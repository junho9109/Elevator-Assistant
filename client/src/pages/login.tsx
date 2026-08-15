import { useState, useEffect } from "react";

interface LoginPageProps {
  onLogin: (token: string, org: string, role: string, name: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [orgs, setOrgs] = useState<string[]>([]);
  const [org, setOrg] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [savePw, setSavePw] = useState(true);
  const [autoLogin, setAutoLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 소속 목록 불러오기
    fetch("/api/auth/organizations").then(r => r.json()).then(setOrgs).catch(() => {});

    // 저장된 정보 복원
    const saved = JSON.parse(localStorage.getItem("loginInfo") || "{}");
    if (saved.org) setOrg(saved.org);
    if (saved.name) setName(saved.name);
    if (saved.pw) setPassword(saved.pw);
    if (saved.autoLogin && saved.token) {
      // 자동 로그인 검증
      fetch("/api/auth/verify", { headers: { Authorization: `Bearer ${saved.token}` } })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data) {
            const n = data.name || saved.name || "";
            onLogin(saved.token, saved.org, n.trim() === "노준호" ? "admin" : data.role, n);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleLogin = async () => {
    if (!org || !name || !password) { setError("소속, 이름, 비밀번호를 모두 입력하세요."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ org, name, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "로그인 실패"); setLoading(false); return; }
      localStorage.setItem("loginInfo", JSON.stringify({
        org,
        name,
        pw: savePw ? password : "",
        token: autoLogin ? data.token : "",
        autoLogin,
      }));
      const finalName = data.name || name;
      onLogin(data.token, org, finalName.trim() === "노준호" ? "admin" : data.role, finalName);
    } catch {
      setError("서버 연결 오류");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-5">
      <div className="w-full max-w-sm">
        {/* 로고 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1e3a5f] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">🛗</div>
          <h1 className="text-xl font-bold text-[#1e3a5f]">AI 검사가이드</h1>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          {/* 소속 */}
          <div className="mb-4">
            <label className="text-[11px] font-semibold text-muted-foreground mb-1.5 block">소속</label>
            <select
              value={org}
              onChange={e => { setOrg(e.target.value); setError(""); }}
              className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-background outline-none focus:border-[#1e3a5f] appearance-none"
            >
              <option value="">소속을 선택하세요</option>
              {orgs.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          {/* 이름 */}
          <div className="mb-4">
            <label className="text-[11px] font-semibold text-muted-foreground mb-1.5 block">이름</label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError(""); }}
              placeholder="이름을 입력하세요"
              className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-background outline-none focus:border-[#1e3a5f]"
            />
          </div>

          {/* 비밀번호 */}
          <div className="mb-5">
            <label className="text-[11px] font-semibold text-muted-foreground mb-1.5 block">비밀번호</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="비밀번호를 입력하세요"
                className={`w-full border rounded-xl px-3.5 py-2.5 text-sm bg-background outline-none pr-10 ${error ? "border-red-400" : "border-border focus:border-[#1e3a5f]"}`}
              />
              <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-base">
                {showPw ? "🙈" : "👁"}
              </button>
            </div>
            {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
          </div>

          {/* 옵션 */}
          <div className="flex items-center justify-between mb-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={savePw} onChange={e => setSavePw(e.target.checked)} className="w-3.5 h-3.5 accent-[#1e3a5f]" />
              <span className="text-[12px] text-muted-foreground">비밀번호 저장</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={autoLogin} onChange={e => setAutoLogin(e.target.checked)} className="w-3.5 h-3.5 accent-[#1e3a5f]" />
              <span className="text-[12px] text-muted-foreground">자동 로그인</span>
            </label>
          </div>

          {/* 로그인 버튼 */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#1e3a5f] text-white rounded-xl py-3 text-sm font-semibold disabled:opacity-60"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </div>
      </div>
    </div>
  );
}
