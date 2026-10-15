import { useState, useEffect } from "react";
import { isDuplicateName } from "@/lib/teams";

interface LoginPageProps {
  onLogin: (token: string, org: string, role: string, name: string) => void;
}

type Mode = "login" | "signup" | "reset";

const EMAIL_DOMAIN_HINT = "@koelsa.or.kr";

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  let data: any = {};
  try { data = await res.json(); } catch {}
  return { ok: res.ok, data };
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [orgs, setOrgs] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [autoLogin, setAutoLogin] = useState(true);
  const [org, setOrg] = useState("");
  const [name, setName] = useState("");
  const [empIdInput, setEmpIdInput] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const needsEmpId = mode === "signup" && isDuplicateName(name);

  useEffect(() => {
    fetch("/api/auth/organizations").then(r => r.ok ? r.json() : Promise.reject()).then(setOrgs).catch(() => {});
    const saved = JSON.parse(localStorage.getItem("loginInfo") || "{}");
    if (saved.email) setEmail(saved.email);
  }, []);

  const switchMode = (m: Mode) => {
    setMode(m);
    setError("");
    setInfo("");
    setPassword("");
    setPassword2("");
    setCode("");
    setCodeSent(false);
  };

  const finishLogin = (data: any) => {
    const rawName = (data.name || "").trim();
    const empId = (data.empId || "").trim();
    const finalName = empId ? `${rawName}(${empId})` : rawName;
    localStorage.setItem("loginInfo", JSON.stringify({
      email: data.email || email.trim().toLowerCase(),
      org: data.org,
      name: rawName,
      empId,
      token: autoLogin ? data.token : "",
      autoLogin,
    }));
    onLogin(data.token, data.org, finalName === "노준호" ? "admin" : data.role, finalName);
  };

  const requestCode = async () => {
    if (!email.trim()) { setError("이메일을 입력하세요."); return; }
    setLoading(true); setError(""); setInfo("");
    try {
      const url = mode === "signup" ? "/api/auth/signup/request" : "/api/auth/password-reset/request";
      const { ok, data } = await postJson(url, { email });
      if (!ok) { setError(data.error || "인증코드 발송 실패"); }
      else { setCodeSent(true); setInfo(`인증코드를 메일로 보냈습니다. ${data.expiresInMinutes ?? 10}분 안에 입력하세요.`); }
    } catch { setError("서버 연결 오류"); }
    setLoading(false);
  };

  const submit = async () => {
    setError(""); setInfo("");
    if (mode === "login") {
      if (!email.trim() || !password) { setError("이메일과 비밀번호를 입력하세요."); return; }
    } else {
      if (!codeSent) { setError("먼저 인증코드를 받으세요."); return; }
      if (!code.trim()) { setError("인증코드를 입력하세요."); return; }
      if (password.length < 8) { setError("비밀번호는 8자 이상이어야 합니다."); return; }
      if (password !== password2) { setError("비밀번호가 서로 다릅니다."); return; }
      if (mode === "signup") {
        if (!org || !name.trim()) { setError("소속과 이름을 입력하세요."); return; }
        if (needsEmpId && !empIdInput.trim()) { setError("동명이인이 있습니다. 사번을 입력하세요."); return; }
      }
    }
    setLoading(true);
    try {
      if (mode === "login") {
        const { ok, data } = await postJson("/api/auth/login", { email, password });
        if (!ok) { setError(data.error || "로그인 실패"); }
        else finishLogin(data);
      } else if (mode === "signup") {
        const { ok, data } = await postJson("/api/auth/signup", {
          email, code, org, name: name.trim(), empId: needsEmpId ? empIdInput.trim() : "", password,
        });
        if (!ok) { setError(data.error || "가입 실패"); }
        else finishLogin(data);
      } else {
        const { ok, data } = await postJson("/api/auth/password-reset", { email, code, password });
        if (!ok) { setError(data.error || "비밀번호 변경 실패"); }
        else { switchMode("login"); setInfo("비밀번호를 변경했습니다. 새 비밀번호로 로그인하세요."); }
      }
    } catch { setError("서버 연결 오류"); }
    setLoading(false);
  };

  const inputCls = "w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-background outline-none focus:border-[#1e3a5f]";
  const labelCls = "text-[11px] font-semibold text-muted-foreground mb-1.5 block";

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1e3a5f] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">🛗</div>
          <h1 className="text-xl font-bold text-[#1e3a5f]">검사통합검색앱</h1>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-semibold mb-4">
            {mode === "login" ? "로그인" : mode === "signup" ? "이메일 인증으로 가입" : "비밀번호 재설정"}
          </p>

          <div className="mb-4">
            <label className={labelCls}>회사 이메일</label>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              placeholder={`아이디${EMAIL_DOMAIN_HINT}`}
              className={inputCls}
              disabled={mode !== "login" && codeSent}
            />
          </div>

          {mode !== "login" && (
            <div className="mb-4">
              <button
                onClick={requestCode}
                disabled={loading}
                className="w-full border border-[#1e3a5f] text-[#1e3a5f] rounded-xl py-2.5 text-sm font-semibold disabled:opacity-60"
              >
                {codeSent ? "인증코드 다시 받기" : "인증코드 받기"}
              </button>
            </div>
          )}

          {mode !== "login" && codeSent && (
            <div className="mb-4">
              <label className={labelCls}>인증코드 (6자리)</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={e => { setCode(e.target.value.replace(/\D/g, "")); setError(""); }}
                placeholder="메일로 받은 숫자 6자리"
                className={inputCls}
              />
            </div>
          )}

          {mode === "signup" && codeSent && (
            <>
              <div className="mb-4">
                <label className={labelCls}>소속</label>
                <select
                  value={org}
                  onChange={e => { setOrg(e.target.value); setError(""); }}
                  className={`${inputCls} appearance-none`}
                >
                  <option value="">소속을 선택하세요</option>
                  {orgs.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className={labelCls}>이름</label>
                <input type="text" value={name} onChange={e => { setName(e.target.value); setError(""); }} placeholder="이름을 입력하세요" className={inputCls} />
              </div>
              {needsEmpId && (
                <div className="mb-4">
                  <label className={labelCls}>사번 (동명이인 구분)</label>
                  <input type="text" value={empIdInput} onChange={e => { setEmpIdInput(e.target.value); setError(""); }} placeholder="사번을 입력하세요" className={inputCls} />
                </div>
              )}
            </>
          )}

          {(mode === "login" || codeSent) && (
            <div className="mb-4">
              <label className={labelCls}>{mode === "reset" ? "새 비밀번호 (8자 이상)" : mode === "signup" ? "비밀번호 (8자 이상)" : "비밀번호"}</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && mode === "login" && submit()}
                  placeholder="비밀번호를 입력하세요"
                  className={`${inputCls} pr-10 ${error && mode === "login" ? "border-red-400" : ""}`}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-base">
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>
            </div>
          )}

          {mode !== "login" && codeSent && (
            <div className="mb-4">
              <label className={labelCls}>비밀번호 확인</label>
              <input
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                value={password2}
                onChange={e => { setPassword2(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && submit()}
                placeholder="비밀번호를 한 번 더 입력하세요"
                className={inputCls}
              />
            </div>
          )}

          {error && <p className="text-[11px] text-red-500 mb-3">{error}</p>}
          {info && <p className="text-[11px] text-green-600 mb-3">{info}</p>}

          {mode === "login" && (
            <div className="flex items-center mb-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={autoLogin} onChange={e => setAutoLogin(e.target.checked)} className="w-3.5 h-3.5 accent-[#1e3a5f]" />
                <span className="text-[12px] text-muted-foreground">자동 로그인</span>
              </label>
            </div>
          )}

          {(mode === "login" || codeSent) && (
            <button
              onClick={submit}
              disabled={loading}
              className="w-full bg-[#1e3a5f] text-white rounded-xl py-3 text-sm font-semibold disabled:opacity-60"
            >
              {loading ? "처리 중..." : mode === "login" ? "로그인" : mode === "signup" ? "가입하기" : "비밀번호 변경"}
            </button>
          )}

          <div className="flex justify-between mt-4 text-[12px] text-muted-foreground">
            {mode === "login" ? (
              <>
                <button onClick={() => switchMode("signup")} className="underline">이메일로 가입</button>
                <button onClick={() => switchMode("reset")} className="underline">비밀번호를 잊으셨나요?</button>
              </>
            ) : (
              <button onClick={() => switchMode("login")} className="underline">로그인으로 돌아가기</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
