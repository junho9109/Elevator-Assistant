import { useState } from "react";
import { createPortal } from "react-dom";
import { RotateCcw, X, FileText, Image as ImageIcon } from "lucide-react";
import { APT_ROWS, GEN_ROWS, S1_ROWS, S2_ROWS, type CmpRow, type SituationRow } from "./precision-inspection-data";

// ══════════════════════════════════════════════════════════════
// 정밀안전검사 — 「정밀안전검사 관련 승강기 부품 보완 이행기간 연장」
// 붙임 PDF 기준. 표 내용·글자색은 원문 그대로, 선택에 따라 해당 행을 강조합니다.
// ══════════════════════════════════════════════════════════════

type Building = "" | "apt" | "gen";
type Version = "" | "cur" | "am";

const IMG_BASE = "/precision-inspection/";

const SITUATIONS: { value: string; label: string; rows?: SituationRow[]; idx?: number }[] = [
  { value: "stage1a", label: "① 1단계 적용 중 — 세 번째 정밀검사 후, 정기검사 전", rows: S1_ROWS, idx: 0 },
  { value: "stage1b", label: "② 1단계 적용 중 — 정기검사 후 조건부 진행 중", rows: S1_ROWS, idx: 1 },
  { value: "stage2a", label: "③ 2단계 적용 중 — (대체)정밀검사 실시 이전 현장", rows: S2_ROWS, idx: 0 },
  { value: "stage2b", label: "④ 2단계 적용 중 — (대체)정밀검사 실시 후 조건부 진행 중", rows: S2_ROWS, idx: 1 },
  { value: "stage4", label: "⑤ 네 번째 정밀안전검사" },
];

const DOCS: Record<string, { title: string; img: string }> = {
  consent: { title: "서면동의서", img: "consent7.jpg" },
  plan: { title: "설치 이행계획서", img: "form4.jpg" },
  notice: { title: "안내 경고문 부착 증명자료", img: "notice5.jpg" },
};

function Html({ html }: { html: string }) {
  // 원문 PDF에서 가져온 정적 문자열(사용자 입력 아님)
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function ChoiceButton({ on, onClick, children, disabled }: { on: boolean; onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left p-3 rounded-xl border-2 text-sm transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed bg-muted border-border" : on ? "border-primary bg-primary/5" : "border-border bg-card"
      }`}
    >
      {children}
    </button>
  );
}

function StepTitle({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold flex-shrink-0">{n}</span>
      <span className="text-sm font-semibold">{children}</span>
    </div>
  );
}

const HL = "bg-amber-100 dark:bg-amber-500/25";
const BLOCK_HL = "border-amber-400 bg-amber-50 dark:bg-amber-500/10 ring-2 ring-amber-200 dark:ring-amber-500/30";

export default function PrecisionInspectionPage() {
  const [building, setBuilding] = useState<Building>("");
  const [version, setVersion] = useState<Version>("");
  const [round, setRound] = useState<"" | "3" | "4">(""); // 공동주택 검사 회차
  const [situation, setSituation] = useState(""); // 일반건축물 검사 진행현황
  const [modal, setModal] = useState<{ title: string; img: string } | null>(null);

  const reset = () => { setBuilding(""); setVersion(""); setRound(""); setSituation(""); };
  const isApt = building === "apt";

  const rows: CmpRow[] = isApt ? APT_ROWS : GEN_ROWS;
  const sit = SITUATIONS.find(s => s.value === situation);

  const isHighlighted = (label: string): boolean => {
    if (isApt) {
      if (round === "3") return /제출서류/.test(label);
      if (round === "4") return /네번째/.test(label);
      return false;
    }
    if (/^stage1/.test(situation)) return /제출서류/.test(label);
    if (/^stage2/.test(situation)) return /2단계 후/.test(label);
    if (situation === "stage4") return /네번째/.test(label);
    return false;
  };

  const showStep3 = !!building && !!version;
  const showResult = showStep3 && (isApt ? !!round : !!situation);
  const docKeys = version === "am" ? ["consent", "plan", "notice"] : isApt ? ["consent"] : [];
  const docsHl = isApt && round === "3";
  const colName = version === "cur" ? "현행" : "개정";
  const colIdx = version === "cur" ? 1 : 2;

  const aptPeriod = { cur: "고시 발령 후 3개월 이전까지 유효", curDate: "2026.9.28.~2026.12.28.", am: "고시 발령 후 3개월 이후 의무 적용", amDate: "2026.12.29.부터" };
  const genPeriod = { cur: "적용 불가 (고시 발령으로 종료)", curDate: "", am: "고시 발령 후 즉시", amDate: "2026.9.28.부터" };
  const P = isApt ? aptPeriod : genPeriod;

  const crumb = [
    building && (isApt ? "공동주택, 집합건축물" : "기존의 단계적 이행기간 적용현장"),
    version && colName,
    isApt && round && (round === "3" ? "세 번째" : "네 번째"),
    !isApt && sit && sit.label.slice(0, 1),
  ].filter(Boolean).join(" › ");

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border sticky top-0 z-10 p-3">
        <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">정</div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold tracking-tight">정밀안전검사</h1>
              <p className="text-xs text-muted-foreground truncate">부품보완 이행기간 연장 · 제출서류 · 업무처리 안내</p>
            </div>
          </div>
          <button onClick={reset} className="w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center flex-shrink-0" title="처음부터 다시">
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {crumb && <p className="text-xs text-primary font-medium">{crumb}</p>}

        {/* ① 적용현장 */}
        <div className="space-y-2">
          <StepTitle n={1}>적용현장</StepTitle>
          <ChoiceButton on={building === "apt"} onClick={() => { setBuilding("apt"); setVersion(""); setRound(""); setSituation(""); }}>
            공동주택, 집합건축물 적용현장
          </ChoiceButton>
          <ChoiceButton on={building === "gen"} onClick={() => { setBuilding("gen"); setVersion(""); setRound(""); setSituation(""); }}>
            기존의 단계적 이행기간(1단계, 2단계) 적용현장
            <span className="block text-xs text-muted-foreground mt-0.5">일반건축물</span>
          </ChoiceButton>
        </div>

        {/* ② 현행 / 개정 */}
        {building && (
          <div className="space-y-2">
            <StepTitle n={2}>현행 / 개정 선택</StepTitle>
            <div className="flex gap-2">
              <button
                disabled={!isApt}
                onClick={() => { setVersion("cur"); setRound(""); setSituation(""); }}
                className={`flex-1 text-left p-3 rounded-xl border-2 text-sm transition-colors ${
                  !isApt ? "opacity-50 cursor-not-allowed bg-muted border-border" : version === "cur" ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                <b>현행</b>
                <span className="block text-[11px] text-muted-foreground">적용시점</span>
                <span className="block text-xs">{P.cur}</span>
                {P.curDate && <span className="block text-[11px] text-blue-600 mt-1">{P.curDate}</span>}
              </button>
              <button
                onClick={() => { setVersion("am"); setRound(""); setSituation(""); }}
                className={`flex-1 text-left p-3 rounded-xl border-2 text-sm transition-colors ${version === "am" ? "border-primary bg-primary/5" : "border-border bg-card"}`}
              >
                <b>개정</b>
                <span className="block text-[11px] text-muted-foreground">적용시점</span>
                <span className="block text-xs">{P.am}</span>
                <span className="block text-[11px] text-blue-600 mt-1">{P.amDate}</span>
              </button>
            </div>
          </div>
        )}

        {/* ③ 검사 회차 / 검사 진행현황 */}
        {showStep3 && isApt && (
          <div className="space-y-2">
            <StepTitle n={3}>검사 회차</StepTitle>
            <div className="flex gap-2">
              <button onClick={() => setRound(round === "3" ? "" : "3")} className={`flex-1 p-3 rounded-xl border-2 text-sm ${round === "3" ? "border-primary bg-primary/5" : "border-border bg-card"}`}>세 번째 정밀안전검사</button>
              <button onClick={() => setRound(round === "4" ? "" : "4")} className={`flex-1 p-3 rounded-xl border-2 text-sm ${round === "4" ? "border-primary bg-primary/5" : "border-border bg-card"}`}>네 번째 정밀안전검사</button>
            </div>
          </div>
        )}
        {showStep3 && !isApt && (
          <div className="space-y-2">
            <StepTitle n={3}>검사 진행현황 (1단계 / 2단계)</StepTitle>
            {SITUATIONS.map(s => (
              <ChoiceButton key={s.value} on={situation === s.value} onClick={() => setSituation(s.value)}>{s.label}</ChoiceButton>
            ))}
          </div>
        )}

        {/* 결과 */}
        {showResult && (
          <div className="space-y-3">
            <p className="text-sm font-semibold">결과</p>

            <div className="border border-border rounded-xl p-3 bg-card">
              <p className="text-xs font-semibold text-primary mb-2">
                {colName} ({isApt ? "공동주택, 집합건축물 적용현장" : "기존의 단계적 이행기간(1단계, 2단계) 적용현장"})
              </p>
              <table className="w-full border-collapse text-[11px]">
                <thead>
                  <tr>
                    <th className="border border-border bg-muted p-1.5 w-16">구분</th>
                    <th className="border border-border bg-blue-50 dark:bg-blue-500/10 p-1.5">{colName}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => {
                    const v = r[colIdx] ?? r[1];
                    return (
                      <tr key={i} className={isHighlighted(r[0].replace(/<[^>]+>/g, " ")) ? HL : ""}>
                        <td className="border border-border p-1.5 align-top font-medium"><Html html={r[0]} /></td>
                        <td className="border border-border p-1.5 align-top leading-relaxed"><Html html={v} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 일반건축물: 업무처리 세부설명 (① ~ ④ 선택 시) */}
            {!isApt && sit?.rows && sit.idx !== undefined && (() => {
              const row = sit.rows[sit.idx];
              const hasNote = sit.rows === S2_ROWS;
              return (
                <div className={`border rounded-xl p-3 ${BLOCK_HL}`}>
                  <p className="text-xs font-semibold text-primary mb-2">기존의 단계적 이행기간(1단계, 2단계) 적용현장 업무처리 세부설명</p>
                  <table className="w-full border-collapse text-[11px]">
                    <thead>
                      <tr>
                        <th className="border border-border bg-muted p-1.5 w-8">번호</th>
                        <th className="border border-border bg-muted p-1.5">검사 진행현황</th>
                        <th className="border border-border bg-muted p-1.5">검사실시 시(결과 처리)</th>
                        {hasNote && <th className="border border-border bg-muted p-1.5">비고</th>}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border p-1.5 align-top">{row.no}</td>
                        <td className="border border-border p-1.5 align-top"><Html html={row.status} /></td>
                        <td className="border border-border p-1.5 align-top"><Html html={row.result} /></td>
                        {hasNote && <td className="border border-border p-1.5 align-top">{row.note && <Html html={row.note} />}</td>}
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })()}

            {/* 제출서류 */}
            {docKeys.length > 0 ? (
              <div className={`border rounded-xl p-3 ${docsHl ? BLOCK_HL : "border-border bg-card"}`}>
                <p className="text-xs font-semibold text-primary mb-2">제출서류 (눌러서 서식 보기)</p>
                <div className="flex flex-wrap gap-1.5">
                  {docKeys.map(k => (
                    <button key={k} onClick={() => setModal(DOCS[k])} className="flex items-center gap-1 border border-blue-300 rounded-full px-3 py-1 text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10">
                      <FileText className="h-3 w-3" />{DOCS[k].title} ▸
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border border-border rounded-xl p-3 bg-card">
                <p className="text-xs font-semibold text-primary mb-1">제출서류</p>
                <p className="text-xs">단계별 이행계획서 등 (위 표 참고)</p>
              </div>
            )}

            {/* 원문 도해 */}
            <div className="border border-border rounded-xl p-3 bg-card">
              <p className="text-xs font-semibold text-primary mb-2">원문 도해 (PDF 그대로)</p>
              <div className="flex flex-wrap gap-1.5">
                <Fig title="네 번째 정밀안전검사 판정 흐름도" img="flow.jpg" label="판정 흐름도" onOpen={setModal} />
                {!isApt && (
                  <>
                    <Fig title="기존 안내 · 1단계 진행도" img="timeline.jpg" label="기존 안내 타임라인" onOpen={setModal} />
                    <Fig title="1단계 적용 현장 업무처리" img="stage1.jpg" label="1단계 현장" onOpen={setModal} />
                    <Fig title="2단계 적용 현장 업무처리" img="stage2.jpg" label="2단계 현장" onOpen={setModal} />
                  </>
                )}
                <Fig title="안내 경고문 (엘리베이터)" img="notice5.jpg" label="안내문 서식" onOpen={setModal} />
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center pb-4">
              출처: 「정밀안전검사 관련 승강기 부품 보완 이행기간 연장」 붙임 · 「승강기 설치검사 및 안전검사에 관한 운영규정」 제11조의2·제11조의3
            </p>
          </div>
        )}
      </div>

      {modal && createPortal(
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3" onClick={() => setModal(null)}>
          <div className="bg-card rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-3 border-b border-border">
              <h3 className="text-sm font-semibold">{modal.title}</h3>
              <button onClick={() => setModal(null)}><X className="h-4 w-4 text-muted-foreground" /></button>
            </div>
            <div className="overflow-auto p-3">
              <img src={IMG_BASE + modal.img} alt={modal.title} className="w-full h-auto" />
              <p className="text-[11px] text-muted-foreground mt-2">원본 PDF에서 가져온 이미지입니다.</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

function Fig({ title, img, label, onOpen }: { title: string; img: string; label: string; onOpen: (m: { title: string; img: string }) => void }) {
  return (
    <button onClick={() => onOpen({ title, img })} className="flex items-center gap-1 border border-border rounded-lg px-2.5 py-1 text-xs bg-muted/40">
      <ImageIcon className="h-3 w-3" />{label}
    </button>
  );
}
