// AI 답변 안의 "[[첨부:행id:번호]]" 표시를 연혁집의 실제 그림·표로 바꿔 그린다.
// 표시는 서버가 AI 컨텍스트로 넘긴 목록에서만 나오며, 없는 id/번호이면 아무것도 그리지 않는다(조용히 무시).
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import RevisionAttachments, { type RevisionAttachment } from "@/components/RevisionAttachments";

export type AnswerPart =
  | { type: "text"; text: string }
  | { type: "att"; id: number; idx: number };

const MARKER = /\[\[첨부:(\d+):(\d+)\]\]/g;
// 스트리밍 도중 아직 끝나지 않은 표시("[[첨부:12" 등)가 화면에 잠깐 보이지 않도록 끝부분에서 잘라낸다.
const PARTIAL_TAIL = /\[\[(?:첨(?:부(?::[\d:]*\]?)?)?)?$|\[$/;
const MAX_ATTACHMENTS = 3;

export function splitAttachmentMarkers(content: string): AnswerPart[] {
  const src = content.replace(PARTIAL_TAIL, "");
  const parts: AnswerPart[] = [];
  const seen = new Set<string>();
  let last = 0;
  let m: RegExpExecArray | null;
  MARKER.lastIndex = 0;
  while ((m = MARKER.exec(src)) !== null) {
    if (m.index > last) parts.push({ type: "text", text: src.slice(last, m.index) });
    const key = `${m[1]}:${m[2]}`;
    if (!seen.has(key) && seen.size < MAX_ATTACHMENTS) {
      seen.add(key);
      parts.push({ type: "att", id: Number(m[1]), idx: Number(m[2]) });
    }
    last = m.index + m[0].length;
  }
  if (last < src.length) parts.push({ type: "text", text: src.slice(last) });
  return parts.filter(p => p.type !== "text" || p.text.trim() !== "");
}

const cache = new Map<string, RevisionAttachment | null>();

export default function AiAttachment({ id, idx }: { id: number; idx: number }) {
  const key = `${id}:${idx}`;
  const [att, setAtt] = useState<RevisionAttachment | null | undefined>(cache.has(key) ? cache.get(key) : undefined);
  const [viewer, setViewer] = useState<{ images: string[]; index: number } | null>(null);

  useEffect(() => {
    if (cache.has(key)) { setAtt(cache.get(key)); return; }
    let alive = true;
    fetch(`/api/revision-attachment/${id}/${idx}`)
      .then(r => (r.ok ? r.json() : null))
      .catch(() => null)
      .then(data => { cache.set(key, data); if (alive) setAtt(data); });
    return () => { alive = false; };
  }, [key, id, idx]);

  if (!att) return null;
  return (
    <div className="my-1.5 rounded-lg border border-border bg-white p-1.5">
      <RevisionAttachments attachments={[att]} onOpenImage={(images, index) => setViewer({ images, index })} />
      {viewer && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center p-3"
          onClick={() => setViewer(null)}
        >
          <img src={viewer.images[viewer.index]} alt="" className="max-w-full max-h-full object-contain bg-white rounded" />
        </div>,
        document.body
      )}
    </div>
  );
}
