import { useState, useEffect as _ue, useEffect, useRef, useCallback } from "react";
import { Search, X, Send, CornerUpLeft, ImagePlus, Video, ZoomIn, ZoomOut } from "lucide-react";
import { usePinchZoomPan } from "@/hooks/use-pinch-zoom";

interface ChatMsg {
  id: number;
  userName: string;
  content: string;
  replyToId?: number | null;
  replyToUser?: string | null;
  replyToContent?: string | null;
  imageData?: string | null;
  videoData?: string | null;
  videoMime?: string | null;
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
const RANDOM_ADJECTIVES = [
  "졸린", "배고픈", "바쁜", "신난", "피곤한", "느긋한", "깜짝놀란", "당황한", "설레는", "귀찮은",
  "행복한", "진지한", "의심많은", "용감한", "허기진", "냉정한", "열정적인", "수줍은", "씩씩한", "엉뚱한"
];
const RANDOM_ANIMALS = [
  "판다", "나무늘보", "카피바라", "알파카", "미어캣", "해달", "수달", "비버", "라쿤", "고슴도치",
  "치타", "나비", "펭귄", "플라밍고", "코알라", "캥거루", "오리너구리", "아르마딜로", "타조", "라마"
];

function generateRandomName(): string {
  const adj = RANDOM_ADJECTIVES[Math.floor(Math.random() * RANDOM_ADJECTIVES.length)];
  const animal = RANDOM_ANIMALS[Math.floor(Math.random() * RANDOM_ANIMALS.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${adj}${animal}${num}`;
}

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
  const [nameInput, setNameInput] = useState(() => generateRandomName());
  const [replyTo, setReplyTo] = useState<ChatMsg | null>(null);
  const [longPress, setLongPress] = useState<{ msg: ChatMsg; x: number; y: number } | null>(null);
  const [expandedImg, setExpandedImg] = useState<string | null>(null);
  const expandedImgZoom = usePinchZoomPan(expandedImg ?? "closed");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ChatMsg[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [pendingVideo, setPendingVideo] = useState<string | null>(null);
  const [pendingVideoMime, setPendingVideoMime] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const msgRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastIdRef = useRef<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const CACHE_KEY = "chat_msgs_cache";

  const fetchMsgs = useCallback(async (initial = false) => {
    try {
      if (initial) {
        // ① 캐시 즉시 표시
        try {
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            const cachedMsgs = JSON.parse(cached);
            // 캐시는 asc 순으로 저장됨
            setMsgs(cachedMsgs);
            setLoading(false);
            if (cachedMsgs.length > 0) {
              lastIdRef.current = cachedMsgs[cachedMsgs.length - 1].id;
            }
          }
        } catch {}

        // ② 서버에서 최신 데이터 fetch — asc 반환 (오래된→최신)
        const r = await fetch("/api/chat-messages?limit=50");
        if (r.ok) {
          const data = await r.json();
          // 서버가 asc 반환 → 그대로 사용 (오래된 것 위, 최신 아래)
          if (data.length > 0) {
            lastIdRef.current = data[data.length - 1].id;
            const cacheData = data.map((m: any) => ({ ...m, imageData: m.imageData ? "CACHED" : null, videoData: null }));
            try { localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData)); } catch {}
          }
          setMsgs(data);
        }
      } else {
        // 폴링: 마지막 ID 이후 새 메시지만
        if (lastIdRef.current === 0) return;
        const r = await fetch(`/api/chat-messages?after=${lastIdRef.current}&limit=50`);
        if (r.ok) {
          const data = await r.json();
          if (data.length > 0) {
            // asc 반환 → 그대로 기존 목록 뒤에 추가 (오래된→최신 순 유지)
            setMsgs(prev => {
              const existIds = new Set(prev.map((m: any) => m.id));
              const unique = data.filter((m: any) => !existIds.has(m.id));
              return unique.length > 0 ? [...prev, ...unique] : prev;
            });
            lastIdRef.current = data[data.length - 1].id;
          }
        }
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent).detail?.id;
      if (!id) return;
      setTimeout(() => {
        const el = msgRefs.current[id];
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("!bg-purple-50", "dark:!bg-purple-950/30");
          setTimeout(() => el.classList.remove("!bg-purple-50", "dark:!bg-purple-950/30"), 2000);
        }
      }, 200);
    };
    window.addEventListener("scrollToChatMsg", handler);
    return () => window.removeEventListener("scrollToChatMsg", handler);
  }, []);

  // AI검색 답변에서 "채팅에서 묻기"로 넘어온 질문을 입력창에 채워넣기
  useEffect(() => {
    const handler = (e: Event) => {
      const text = (e as CustomEvent).detail?.text;
      if (typeof text !== "string") return;
      setInput(text);
      setTimeout(() => {
        const el = textareaRef.current;
        if (el) {
          el.focus();
          el.setSelectionRange(el.value.length, el.value.length);
        }
      }, 200);
    };
    window.addEventListener("chatPrefill", handler);
    return () => window.removeEventListener("chatPrefill", handler);
  }, []);

  useEffect(() => {
    fetchMsgs(true);
    pollTimer.current = setInterval(() => fetchMsgs(false), 2000);
    return () => { if (pollTimer.current) clearInterval(pollTimer.current); };
  }, [fetchMsgs]);

  const msgListRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (smooth = false) => {
    const el = msgListRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  // 초기 로딩 완료 시 맨 아래로 (애니메이션 없이 즉시)
  useEffect(() => {
    if (!loading) scrollToBottom(false);
  }, [loading]);

  // 새 메시지 수신 시 맨 아래로
  useEffect(() => {
    scrollToBottom(false);
  }, [msgs.length]);

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

  // 이미지 압축 (최대 800px, quality 0.75) — 실패 시 원본 base64 폴백
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        const img = new Image();
        img.onload = () => {
          try {
            const MAX = 800;
            let { width, height } = img;
            if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
            const canvas = document.createElement('canvas');
            canvas.width = width; canvas.height = height;
            canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
            const result = canvas.toDataURL('image/jpeg', 0.75);
            resolve(result);
          } catch {
            resolve(dataUrl); // 압축 실패 → 원본 폴백
          }
        };
        img.onerror = () => resolve(dataUrl); // 이미지 로드 실패 → 원본 폴백
        img.src = dataUrl;
      };
      reader.onerror = () => resolve(""); // 읽기 실패
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photoInputRef.current) photoInputRef.current.value = "";
    // HEIC/HEIF는 브라우저 미지원 → 안내 후 차단
    const isHeic = file.type === "image/heic" || file.type === "image/heif" || file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif");
    if (isHeic) {
      alert("HEIC/HEIF 형식은 지원하지 않습니다.\n아이폰 설정 → 카메라 → 포맷 → '가장 호환성 높은 항목'으로 변경하거나\nJPEG/PNG로 변환 후 첨부해주세요.");
      return;
    }
    const result = await compressImage(file);
    if (result) setPendingImage(result);
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (videoInputRef.current) videoInputRef.current.value = "";
    // 50MB 제한
    if (file.size > 50 * 1024 * 1024) {
      alert("동영상은 50MB 이하만 첨부 가능합니다.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPendingVideo(dataUrl);
      setPendingVideoMime(file.type);
    };
    reader.readAsDataURL(file);
  };

  const sendMsg = async () => {
    if ((!input.trim() && !pendingImage && !pendingVideo) || !userName || sending) return;
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
          imageData: pendingImage || null,
          videoData: pendingVideo || null,
          videoMime: pendingVideoMime || null,
        }),
      });
      if (r.ok) {
        const msg = await r.json();
        setMsgs(prev => [...prev, msg]);
        lastIdRef.current = msg.id;   // 폴링 중복 방지
        setInput("");
        setPendingImage(null);
        setPendingVideo(null);
        setPendingVideoMime(null);
        setReplyTo(null);
        setTimeout(() => scrollToBottom(false), 50);
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

  const deleteMessage = async (id: number) => {
    setLongPress(null);
    if (!confirm("삭제하면 모든 사용자에게 사라집니다. 삭제할까요?")) return;
    try {
      await fetch(`/api/chat-messages/${id}`, { method: "DELETE" });
      setMsgs(prev => prev.map(m => m.id === id
        ? { ...m, content: "", imageData: null, imageThumbnail: null, videoData: null, deletedAt: new Date().toISOString() }
        : m
      ));
    } catch {}
  };

  if (!userName) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 gap-4">
        <div className="text-center">
          <p className="text-base font-medium mb-1">채팅방 입장</p>
          <p className="text-xs text-muted-foreground">표시될 이름을 확인하거나 직접 입력하세요</p>
        </div>
        <div className="flex gap-2 w-full max-w-xs">
          <input
            autoFocus
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && nameInput.trim()) { saveUserName(nameInput.trim()); setUserName(nameInput.trim()); }}}
            placeholder="이름 입력"
            className="flex-1 text-sm bg-secondary border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={() => setNameInput(generateRandomName())}
            className="px-3 py-2 border border-border rounded-xl text-muted-foreground hover:bg-secondary transition-colors"
            title="랜덤 이름 생성"
          >
            🔀
          </button>
        </div>
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
          <p className="text-xs text-muted-foreground">{userName} · 실시간 채팅</p>
        </div>
        <button
          onClick={() => { saveUserName(""); setUserName(""); setNameInput(generateRandomName()); }}
          className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground"
          title="이름 변경"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
        </button>
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
                  <span className="text-xs text-muted-foreground">{msg.userName} · {formatTime(msg.createdAt)}</span>
                  <span className="text-[11px] text-blue-600 flex items-center gap-0.5 shrink-0">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>이동
                  </span>
                </div>
                {msg.replyToUser && (
                  <div className="text-[11px] text-muted-foreground border-l-2 border-green-500 pl-2">
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
        <div ref={msgListRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5">
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
                    <span className="text-[11px] text-muted-foreground">{new Date(msg.createdAt).toLocaleDateString("ko-KR")}</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                )}
                <div className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                  {/* 아바타 */}
                  <div className="w-7 shrink-0 self-start mt-1">
                    {showAvatar && !isMe && (
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium ${avatarColor(msg.userName)}`}>
                        {initials(msg.userName)}
                      </div>
                    )}
                  </div>
                  {/* 말풍선 */}
                  <div className={`flex flex-col gap-0.5 max-w-[78%] ${isMe ? "items-end" : "items-start"}`}>
                    {showAvatar && !isMe && (
                      <span className="text-[11px] text-muted-foreground pl-1">{msg.userName}</span>
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
                          <p className={`text-[11px] font-medium ${isMe ? "text-white/80" : "text-green-700"}`}>{msg.replyToUser}</p>
                          <p className={`text-[11px] truncate ${isMe ? "text-white/70" : "text-muted-foreground"}`}>{msg.replyToContent}</p>
                        </div>
                      )}
                      {msg.deletedAt
                        ? <span className="text-xs italic opacity-60">삭제된 메시지입니다</span>
                        : <>
                          {msg.content && <span>{msg.content}</span>}
                          {msg.imageData && msg.imageData !== "CACHED" && (
                            msg.imageData.startsWith("data:image/heic") || msg.imageData.startsWith("data:image/heif")
                              ? <span className="text-xs text-muted-foreground mt-1 block">[HEIC — 미지원]</span>
                              : <img
                                  src={msg.imageData}
                                  alt="첨부이미지"
                                  className="mt-1 max-w-[200px] rounded-lg block cursor-pointer active:opacity-80"
                                  loading="lazy"
                                  onClick={e => { e.stopPropagation(); setExpandedImg(msg.imageData!); }}
                                />
                          )}
                          {msg.imageThumbnail && !msg.imageData && (
                            <div className="mt-1">
                              <img src={msg.imageThumbnail} alt="미리보기" className="max-w-[60px] rounded opacity-50 blur-[1px] block" loading="lazy" />
                              <span className="text-[10px] opacity-60 mt-0.5 block">원본 만료됨</span>
                            </div>
                          )}
                          {msg.videoData && <video src={msg.videoData} controls className="mt-1 max-w-[220px] rounded-lg block" style={{maxHeight:'160px'}} playsInline />}
                        </>
                      }
                    </div>
                    <span className="text-[8px] text-muted-foreground px-1">{formatTime(msg.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      )}

      {/* 꾹 누르기 컨텍스트 메뉴 */}
      {longPress && (
        <div
          className="fixed z-50 bg-card border border-border rounded-xl shadow-lg p-1 flex gap-1"
          style={{
            left: Math.min(Math.max(longPress.x - 80, 8), window.innerWidth - 188),
            top: (longPress.y + 16 > window.innerHeight - 140)
              ? Math.max(longPress.y - 130, 60)
              : longPress.y + 16,
          }}
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
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-destructive hover:bg-secondary"
            onClick={() => deleteMessage(longPress.msg.id)}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            삭제
          </button>
        </div>
      )}

      {/* 이미지 확대 오버레이 */}
      {expandedImg && (
        <div
          data-no-page-pinch="true"
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center"
          onClick={() => setExpandedImg(null)}
        >
          <div
            className="flex items-center justify-center max-w-[90vw] max-h-[80vh] overflow-hidden"
            style={{ touchAction: "none", cursor: expandedImgZoom.cursor }}
            onClick={e => e.stopPropagation()}
            {...expandedImgZoom.containerHandlers}
          >
            <img
              src={expandedImg}
              alt="확대"
              draggable={false}
              className="max-w-[90vw] max-h-[80vh] rounded-xl object-contain"
              style={expandedImgZoom.imgStyle}
            />
          </div>
          <button
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
            onClick={() => setExpandedImg(null)}
          >
            <X size={18} className="text-white" />
          </button>
          <div className="absolute bottom-6 flex items-center gap-3" onClick={e => e.stopPropagation()}>
            <button onClick={expandedImgZoom.zoomOut} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white">
              <ZoomOut size={18} />
            </button>
            <span className="text-white/60 text-xs min-w-[36px] text-center">{Math.round(expandedImgZoom.zoom * 100)}%</span>
            <button onClick={expandedImgZoom.zoomIn} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white">
              <ZoomIn size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 답변 바 */}
      {replyTo && (
        <div className="px-3 py-2 border-t border-border bg-secondary shrink-0 flex items-center gap-2">
          <div className="flex-1 border-l-2 border-green-500 pl-2.5 min-w-0">
            <p className="text-xs font-medium text-green-700">{replyTo.userName}에게 답변</p>
            <p className="text-xs text-muted-foreground truncate">{replyTo.content}</p>
          </div>
          <button onClick={() => setReplyTo(null)} className="p-1 hover:bg-border rounded-lg shrink-0">
            <X size={14} className="text-muted-foreground" />
          </button>
        </div>
      )}

      {/* 입력창 */}
      <div className="border-t border-border bg-card shrink-0">
        {pendingImage && (
          <div className="px-3 pt-2 flex items-center gap-2">
            <img src={pendingImage} alt="미리보기" className="w-16 h-16 object-cover rounded-lg border border-border" />
            <button onClick={() => setPendingImage(null)} className="text-xs text-muted-foreground border border-border rounded px-2 py-1">삭제</button>
          </div>
        )}
        {pendingVideo && (
          <div className="px-3 pt-2 flex items-center gap-2">
            <video src={pendingVideo} className="w-16 h-16 object-cover rounded-lg border border-border" muted playsInline />
            <span className="text-xs text-muted-foreground">동영상 첨부됨</span>
            <button onClick={() => { setPendingVideo(null); setPendingVideoMime(null); }} className="text-xs text-muted-foreground border border-border rounded px-2 py-1">삭제</button>
          </div>
        )}
        <div className="px-3 py-2.5 flex gap-2 items-end">
          <input type="file" accept="image/*" ref={photoInputRef} onChange={handlePhotoSelect} className="hidden" />
          <input type="file" accept="video/*" ref={videoInputRef} onChange={handleVideoSelect} className="hidden" />
          <button
            onClick={() => photoInputRef.current?.click()}
            className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0"
          >
            <ImagePlus size={16} className="text-muted-foreground" />
          </button>
          <button
            onClick={() => videoInputRef.current?.click()}
            className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0"
          >
            <Video size={16} className="text-muted-foreground" />
          </button>
          <textarea
            ref={textareaRef}
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
            disabled={(!input.trim() && !pendingImage) || sending}
            className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity"
          >
            <Send size={15} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
