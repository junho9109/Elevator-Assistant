import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Send, CornerUpLeft } from "lucide-react";

interface ChatMsg {
  id: number;
  userName: string;
  content: string;
  replyToId?: number | null;
  replyToUser?: string | null;
  replyToContent?: string | null;
  createdAt: string;
}

const COLORS = ["bg-blue-100 text-blue-800","bg-green-100 text-green-800","bg-orange-100 text-orange-800","bg-purple-100 text-purple-800","bg-pink-100 text-pink-800","bg-teal-100 text-teal-800"];
function avatarColor(name: string) { let h=0; for(const c of name) h=(h*31+c.charCodeAt(0))%COLORS.length; return COLORS[h]; }
function initials(name: string) { return name.slice(0,2); }
function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  return isToday
    ? d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" }) + " " + d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

// 로컬 유저명 저장
function getUserName(): string {
  return localStorage.getItem("chat_username") || "";
}
function saveUserName(name: string) {
  localStorage.setItem("chat_username", name);
}

export default function ChatPage() {
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState(getUserName());
  const [nameInput, setNameInput] = useState("");
  const [replyTo, setReplyTo] = useState<ChatMsg | null>(null);
  const [longPress, setLongPress] = useState<{ msg: ChatMsg; x: number; y: number } | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ChatMsg[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const msgRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMsgs = useCallback(async () => {
    try {
      const r = await fetch("/api/chat-messages?limit=80");
      if (r.ok) setMsgs(await r.json());
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMsgs();
    pollTimer.current = setInterval(fetchMsgs, 5000);
    return () => { if (pollTimer.current) clearInterval(pollTimer.current); };
  }, [fetchMsgs]);

  useEffect(() => {
    if (!loading) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length, loading]);

  // 검색
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const r = await fetch(`/api/chat-messages?search=${encodeURIComponent(searchQuery)}&limit=30`);
        if (r.ok) setSearchResults(await r.json());
      } catch {}
      setSearching(false);
    }, 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const scrollToMsg = (id: number) => {
    setShowSearch(false);
    setSearchQuery("");
    setTimeout(() => {
      const el = msgRefs.current[id];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("bg-blue-50");
        setTimeout(() => el.classList.remove("bg-blue-50"), 1500);
      }
    }, 100);
  };

  const sendMsg = async () => {
    if (!input.trim() || !userName || sending) return;
    setSending(true);
    try {
      const r = await fetch("/api/chat-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          content: input.trim(),
          replyToId: replyTo?.id || null,
          replyToUser: replyTo?.userName || null,
          replyToContent: replyTo?.content.slice(0, 80) || null,
        }),
      });
      if (r.ok) {
        const msg = await r.json();
        setMsgs(prev => [...prev, msg]);
        setInput("");
        setReplyTo(null);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      }
    } catch {}
    setSending(false);
  };

  // 꾹 누르기
  const onPressStart = (e: React.TouchEvent | React.MouseEvent, msg: ChatMsg) => {
    const touch = "touches" in e ? e.touches[0] : e as React.MouseEvent;
    pressTimer.current = setTimeout(() => {
      setLongPress({ msg, x: touch.clientX, y: touch.clientY });
    }, 500);
  };
  const onPressEnd = () => { if (pressTimer.current) clearTimeout(pressTimer.current); };

  if (!userName) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 gap-4">
        <div className="text-center">
          <p className="text-base font-medium mb-1">채팅방 입장</p>
          <p className="text-xs text-muted-foreground">표시될 이름을 입력하세요</p>
        </div>
        <input
          autoFocus
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && nameInput.trim()) { saveUserName(nameInput.trim()); setUserName(nameInput.trim()); }}}
          placeholder="예) 김검사, 홍길동 등"
          className="w-full max-w-xs text-sm bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          onClick={() => { if (nameInput.trim()) { saveUserName(nameInput.trim()); setUserName(nameInput.trim()); }}}
          className="w-full max-w-xs py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium"
        >
          입장
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background" onClick={() => setLongPress(null)}>
      {/* 헤더 */}
      <div className="px-4 pt-4 pb-3 border-b border-border shrink-0 bg-card flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-green-600 flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">검사원 채팅방</p>
          <p className="text-[10px] text-muted-foreground">{userName} · 실시간 채팅</p>
        </div>
        <button
          onClick={e => { e.stopPropagation(); setShowSearch(s => !s); setSearchQuery(""); setSearchResults([]); }}
          className="p-1.5 hover:bg-secondary rounded-lg"
        >
          {showSearch ? <X size={17} /> : <Search size={17} />}
        </button>
      </div>

      {/* 검색창 */}
      {showSearch && (
        <div className="px-3 py-2 border-b border-border bg-card shrink-0">
          <input
            autoFocus
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="메시지 검색…"
            className="w-full text-sm bg-secondary border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      )}

      {/* 검색 결과 */}
      {showSearch && searchQuery && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {searching && <p className="text-xs text-muted-foreground text-center py-4">검색 중…</p>}
          {!searching && searchResults.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">결과 없음</p>
          )}
          {searchResults.map(msg => {
            const kw = searchQuery.toLowerCase();
            const idx = msg.content.toLowerCase().indexOf(kw);
            const highlighted = idx >= 0
              ? <>{msg.content.slice(0, idx)}<mark className="bg-yellow-100 text-yellow-900 rounded">{msg.content.slice(idx, idx + searchQuery.length)}</mark>{msg.content.slice(idx + searchQuery.length)}</>
              : msg.content;
            return (
              <div
                key={msg.id}
                className="bg-secondary rounded-xl p-3 space-y-1.5 cursor-pointer hover:bg-border transition-colors"
                onClick={() => scrollToMsg(msg.id)}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-muted-foreground">{msg.userName} · {formatTime(msg.createdAt)}</span>
                  <span className="text-[9px] text-blue-600 flex items-center gap-0.5 shrink-0">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>이동
                  </span>
                </div>
                {msg.replyToUser && (
                  <div className="text-[9px] text-muted-foreground border-l-2 border-green-500 pl-2">
                    {msg.replyToUser}: {msg.replyToContent}
                  </div>
                )}
                <p className="text-xs leading-relaxed">{highlighted}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* 채팅 목록 */}
      {!(showSearch && searchQuery) && (
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5">
          {loading && <p className="text-xs text-muted-foreground text-center py-8">불러오는 중…</p>}
          {msgs.map((msg, i) => {
            const isMe = msg.userName === userName;
            const prevMsg = msgs[i - 1];
            const showAvatar = !prevMsg || prevMsg.userName !== msg.userName;
            return (
              <div key={msg.id} ref={el => { msgRefs.current[msg.id] = el; }} className="transition-colors duration-500 rounded-xl">
                {/* 날짜 구분선 */}
                {(!prevMsg || new Date(prevMsg.createdAt).toDateString() !== new Date(msg.createdAt).toDateString()) && (
                  <div className="flex items-center gap-2 my-3">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[9px] text-muted-foreground">{new Date(msg.createdAt).toLocaleDateString("ko-KR")}</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                )}
                <div className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                  {/* 아바타 */}
                  <div className="w-7 shrink-0 self-start mt-1">
                    {showAvatar && !isMe && (
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-medium ${avatarColor(msg.userName)}`}>
                        {initials(msg.userName)}
                      </div>
                    )}
                  </div>
                  {/* 말풍선 */}
                  <div className={`flex flex-col gap-0.5 max-w-[78%] ${isMe ? "items-end" : "items-start"}`}>
                    {showAvatar && !isMe && (
                      <span className="text-[9px] text-muted-foreground pl-1">{msg.userName}</span>
                    )}
                    <div
                      onMouseDown={e => onPressStart(e, msg)}
                      onMouseUp={onPressEnd}
                      onMouseLeave={onPressEnd}
                      onTouchStart={e => onPressStart(e, msg)}
                      onTouchEnd={onPressEnd}
                      className={`rounded-2xl px-3 py-2 text-xs leading-relaxed select-none cursor-pointer ${
                        isMe
                          ? "bg-green-600 text-white rounded-br-sm"
                          : "bg-secondary text-foreground rounded-bl-sm"
                      }`}
                      onClick={e => e.stopPropagation()}
                    >
                      {/* 답변 인용 */}
                      {msg.replyToId && (
                        <div
                          className={`border-l-2 pl-2 mb-1.5 cursor-pointer rounded-r ${isMe ? "border-white/50" : "border-green-500"}`}
                          onClick={e => { e.stopPropagation(); if (msg.replyToId) scrollToMsg(msg.replyToId); }}
                        >
                          <p className={`text-[9px] font-medium ${isMe ? "text-white/80" : "text-green-700"}`}>{msg.replyToUser}</p>
                          <p className={`text-[9px] truncate ${isMe ? "text-white/70" : "text-muted-foreground"}`}>{msg.replyToContent}</p>
                        </div>
                      )}
                      {msg.content}
                    </div>
                    <span className="text-[8px] text-muted-foreground px-1">{formatTime(msg.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      )}

      {/* 꾹 누르기 컨텍스트 메뉴 */}
      {longPress && (
        <div
          className="fixed z-50 bg-card border border-border rounded-xl shadow-lg p-1 flex gap-1"
          style={{ left: Math.min(longPress.x - 20, window.innerWidth - 180), top: Math.max(longPress.y - 80, 60) }}
          onClick={e => e.stopPropagation()}
        >
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-green-700 font-medium hover:bg-secondary"
            onClick={() => { setReplyTo(longPress.msg); setLongPress(null); }}
          >
            <CornerUpLeft size={13} /> 답변
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-secondary"
            onClick={() => { navigator.clipboard?.writeText(longPress.msg.content); setLongPress(null); }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            복사
          </button>
        </div>
      )}

      {/* 답변 바 */}
      {replyTo && (
        <div className="px-3 py-2 border-t border-border bg-secondary shrink-0 flex items-center gap-2">
          <div className="flex-1 border-l-2 border-green-500 pl-2.5 min-w-0">
            <p className="text-[10px] font-medium text-green-700">{replyTo.userName}에게 답변</p>
            <p className="text-[10px] text-muted-foreground truncate">{replyTo.content}</p>
          </div>
          <button onClick={() => setReplyTo(null)} className="p-1 hover:bg-border rounded-lg shrink-0">
            <X size={14} className="text-muted-foreground" />
          </button>
        </div>
      )}

      {/* 입력창 */}
      <div className="px-3 py-2.5 border-t border-border bg-card shrink-0 flex gap-2 items-end">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); }}}
          placeholder="메시지 입력…"
          rows={1}
          className="flex-1 text-sm bg-secondary border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          style={{ maxHeight: "100px", overflowY: "auto" }}
        />
        <button
          onClick={sendMsg}
          disabled={!input.trim() || sending}
          className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity"
        >
          <Send size={15} className="text-white" />
        </button>
      </div>
    </div>
  );
}
