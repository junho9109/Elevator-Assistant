// 답변 속 [[첨부:…]]·[[그림:…]] 표시를 조각으로 나눈다(순수 함수 — 화면 컴포넌트와 분리).
export type AnswerPart =
  | { type: "text"; text: string }
  | { type: "att"; id: number; idx: number }
  | { type: "fig"; key: string };

const MARKER = /\[\[(?:첨부:(\d+):(\d+)|그림:([^\]\n]+))\]\]/g;
// 어느 쪽이든 짝이 맞지 않는 표시(+ 바로 뒤의 "(그림)"·"(표)")는 글자로 남기지 않는다.
const STRAY = /\[\[(?:첨부|그림):[^\]\n]*\]\](?:[ \t]*\((?:그림|표|표 이미지)\))?/g;
// 스트리밍 도중 아직 끝나지 않은 표시("[[첨부:12", "[[그림:s22/8" 등)가 화면에 잠깐 보이지 않도록 끝부분에서 잘라낸다.
const PARTIAL_TAIL = /\[\[(?:첨(?:부(?::[^\]]*)?)?|그(?:림(?::[^\]]*)?)?)?$|\[$/;
const MAX_ATTACHMENTS = 3;

export function splitAttachmentMarkers(content: string): AnswerPart[] {
  const src = content.replace(PARTIAL_TAIL, "");
  const parts: AnswerPart[] = [];
  const seen = new Set<string>();
  const pushText = (t: string) => { const c = t.replace(STRAY, ""); if (c.trim() !== "") parts.push({ type: "text", text: c }); };
  let last = 0;
  let m: RegExpExecArray | null;
  MARKER.lastIndex = 0;
  while ((m = MARKER.exec(src)) !== null) {
    if (m.index > last) pushText(src.slice(last, m.index));
    const key = m[3] ? `fig:${m[3].trim()}` : `${m[1]}:${m[2]}`;
    if (!seen.has(key) && seen.size < MAX_ATTACHMENTS) {
      seen.add(key);
      parts.push(m[3] ? { type: "fig", key: m[3].trim() } : { type: "att", id: Number(m[1]), idx: Number(m[2]) });
    }
    last = m.index + m[0].length;
    // 표시 바로 뒤의 "(그림)"·"(표)" 꼬리표는 화면에서 중복이므로 건너뛴다
    const tail = src.slice(last).match(/^[ \t]*\((?:그림|표|표 이미지)\)/);
    if (tail) last += tail[0].length;
  }
  if (last < src.length) pushText(src.slice(last));
  return parts;
}

