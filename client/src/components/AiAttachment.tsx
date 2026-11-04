// AI 답변 안의 "[[첨부:행id:번호]]"(연혁집 그림·표)와 "[[그림:키]]"(별표22·24·종전 고시 그림) 표시를 실제 이미지로 바꿔 그린다.
// 표시는 서버가 AI 컨텍스트로 넘긴 목록에서만 나오며, 없는 키/번호이면 아무것도 그리지 않는다(조용히 무시).
// AI가 컨텍스트에 없는 표시를 지어내도 글자 그대로 화면에 남지 않도록 짝이 맞지 않는 표시는 지운다.
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import RevisionAttachments, { type RevisionAttachment } from "@/components/RevisionAttachments";
import { resolveFigure } from "@/lib/figureRef";

import { splitAttachmentMarkers, type AnswerPart } from "@/lib/answerMarkers";
export { splitAttachmentMarkers };
export type { AnswerPart };

const cache = new Map<string, RevisionAttachment | null>();

function Viewer({ images, index, onClose }: { images: string[]; index: number; onClose: () => void }) {
  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center p-3" onClick={onClose}>
      <img src={images[index]} alt="" className="max-w-full max-h-full object-contain bg-white rounded" />
    </div>,
    document.body
  );
}

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
      {viewer && <Viewer images={viewer.images} index={viewer.index} onClose={() => setViewer(null)} />}
    </div>
  );
}

// 별표22·24(조문·부속서)·종전 고시의 그림 — 키는 서버가 아닌 앱이 컨텍스트로 만든 것이며, 없는 키면 아무것도 그리지 않는다.
const figCache = new Map<string, { caption: string; srcs: string[] } | null>();
export function AiFigure({ figKey }: { figKey: string }) {
  const [fig, setFig] = useState<{ caption: string; srcs: string[] } | null | undefined>(figCache.has(figKey) ? figCache.get(figKey) : undefined);
  const [viewer, setViewer] = useState<{ images: string[]; index: number } | null>(null);
  useEffect(() => {
    if (figCache.has(figKey)) { setFig(figCache.get(figKey)); return; }
    let alive = true;
    resolveFigure(figKey).catch(() => null).then(d => { figCache.set(figKey, d); if (alive) setFig(d); });
    return () => { alive = false; };
  }, [figKey]);
  if (!fig) return null;
  return (
    <div className="my-1.5 rounded-lg border border-border bg-white p-1.5 space-y-1">
      {fig.caption && <p className="text-[11px] font-semibold text-center">{fig.caption}</p>}
      {fig.srcs.map((s, i) => (
        <img key={s} src={s} alt={fig.caption} loading="lazy" onClick={() => setViewer({ images: fig.srcs, index: i })} className="mx-auto max-w-full rounded cursor-zoom-in" />
      ))}
      {viewer && <Viewer images={viewer.images} index={viewer.index} onClose={() => setViewer(null)} />}
    </div>
  );
}
