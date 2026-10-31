// 연혁 카드에 딸린 표·그림(연혁집 PDF). 표는 실제 표로, 그림은 이미지(탭하면 확대)로 보여준다.
export interface RevisionAttachment {
  kind: "table" | "figure";
  caption?: string;
  images?: string[];
  table?: { rows: { t: string; r: number; c: number; rs: number; cs: number; img?: string }[][] } | null;
  notes?: string;
  search?: string;
}

interface Props {
  attachments?: RevisionAttachment[] | null;
  onOpenImage?: (images: string[], index: number) => void;
}

const BASE = "/revision-figures/";

export default function RevisionAttachments({ attachments, onOpenImage }: Props) {
  if (!attachments || attachments.length === 0) return null;
  // 이 연혁에 속한 모든 그림을 한 묶음으로 확대 뷰어에 넘긴다(좌우 넘김 가능)
  const allImages = attachments.flatMap(a => (a.images || []).map(f => BASE + f));
  let imgCursor = 0;
  return (
    <div className="mt-1.5 space-y-2">
      {attachments.map((a, i) => (
        <div key={i}>
          {a.caption && <p className="text-[9px] font-semibold text-gray-700 mb-0.5">{a.caption}</p>}
          {a.kind === "figure" && (a.images || []).map((f, k) => {
            const idx = imgCursor++;
            return (
              <img
                key={k}
                src={BASE + f}
                alt={a.caption || "그림"}
                loading="lazy"
                onClick={() => onOpenImage?.(allImages, idx)}
                className="w-full rounded border border-gray-200 bg-white cursor-zoom-in mb-1"
              />
            );
          })}
          {a.kind === "table" && a.table && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[9px] leading-snug bg-white text-gray-800">
                <tbody>
                  {a.table.rows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((c, ci) => (
                        <td
                          key={ci}
                          rowSpan={c.rs > 1 ? c.rs : undefined}
                          colSpan={c.cs > 1 ? c.cs : undefined}
                          className={`border border-gray-400 px-1.5 py-1 align-middle text-center whitespace-pre-line ${ri === 0 ? "bg-gray-50 font-semibold" : ""}`}
                        >
                          {c.img ? <img src={BASE + c.img} alt={c.t || "표 안 그림"} className="mx-auto max-h-14" /> : c.t}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {a.notes && <p className="mt-0.5 text-[9px] text-gray-600 whitespace-pre-line">{a.notes}</p>}
        </div>
      ))}
    </div>
  );
}
