import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { pickEraDocs, pickEraDoc, type EraDoc } from "../../client/src/lib/eraPick";

const root = path.resolve(__dirname, "../..");
const genDir = path.join(root, "client/src/data/generations");
const pubDir = path.join(root, "client/public");
const readGen = (f: string) => JSON.parse(fs.readFileSync(path.join(genDir, f), "utf-8"));

const FILES = [
  { f: "2012-14-electric.json", name: "전기식 엘리베이터", byul: "[별표 1]", pdf: "/standards/2012-14/byulpyo1-electric.pdf", equipment: "엘리베이터", family: "전기식" },
  { f: "2012-14-hydraulic.json", name: "유압식 엘리베이터", byul: "[별표 2]", pdf: "/standards/2012-14/byulpyo2-hydraulic.pdf", equipment: "엘리베이터", family: "유압식" },
  { f: "2012-14-escalator.json", name: "에스컬레이터 및 무빙워크", byul: "[별표 3]", pdf: "/standards/2012-14/byulpyo3-escalator.pdf", equipment: "에스컬레이터", family: undefined },
];

describe("2012-14호 검사기준 문서 3종(전기식·유압식·에스컬레이터)", () => {
  for (const spec of FILES) {
    const doc = readGen(spec.f);
    describe(spec.name, () => {
      it("제목은 2012-14호, 적용일은 부칙에 따른 2013-09-15", () => {
        expect(doc.meta.title).toContain("제2012-14호");
        expect(doc.meta.title).toContain(spec.name);
        expect(doc.meta.title).not.toContain("2013");
        expect(doc.meta.effectiveDate).toBe("2013-09-15");
        expect(doc.meta.equipment).toBe(spec.equipment);
        expect(doc.meta.family).toBe(spec.family);
      });
      it("원본 첨부 4개: 해당 별표 → 검사항목(별표 8) → 검사기준 본문 → 고시 순서, 파일이 실제로 있다", () => {
        const files = doc.meta.originalFiles;
        expect(files).toHaveLength(4);
        expect(files[0].label).toContain(spec.byul);
        expect(files[0].href).toBe(spec.pdf);
        expect(files[1].href).toBe("/standards/2012-14/byulpyo8-items.pdf");
        expect(files[2].href).toBe("/standards/2012-14/main-text.pdf");
        expect(files[3].href).toBe("/standards/2012-14/notice.pdf");
        for (const f of files) {
          const p = path.join(pubDir, f.href);
          expect(fs.existsSync(p), p).toBe(true);
          expect(fs.readFileSync(p).subarray(0, 5).toString()).toBe("%PDF-");
        }
      });
      it("항목: 장(1~)과 부속서가 있고, 빈 본문이 없으며, 그림 파일이 실제로 있다", () => {
        const keys = Object.keys(doc.items);
        expect(keys).toContain("1");
        expect(keys.some(k => k.startsWith("부속서"))).toBe(true);
        for (const k of keys) {
          const it = doc.items[k];
          expect((it.text || "").length, k).toBeGreaterThan(0);
          for (const fg of it.figures || []) {
            expect(fs.existsSync(path.join(pubDir, fg.src)), fg.src).toBe(true);
          }
          for (const tb of it.tables || []) {
            expect(tb.rows.length, k).toBeGreaterThan(0);
          }
        }
      });
      it("조항 번호가 건너뛰지 않고 이어진다(부모별 형제 번호의 빈 곳이 없다)", () => {
        const gaps: string[] = [];
        const children: Record<string, number[]> = {};
        for (const k of Object.keys(doc.items)) {
          const slash = k.lastIndexOf("/");
          const pre = slash >= 0 ? k.slice(0, slash + 1) : "";
          const segs = k.slice(slash + 1).split(".");
          const last = Number(segs[segs.length - 1]);
          if (!Number.isInteger(last)) continue;
          const parent = pre + segs.slice(0, -1).join(".");
          (children[parent] ||= []).push(last);
        }
        for (const [p, v] of Object.entries(children)) {
          const max = Math.max(...v);
          for (let n = 1; n <= max; n++) if (!v.includes(n)) gaps.push(`${p}:${n}`);
        }
        // 원문에 번호가 건너뛰는 곳이 일부 있어(예: 16.1.1 없음) 소수만 허용
        expect(gaps.length, gaps.join(",")).toBeLessThan(15);
      });
    });
  }

  it("수식 기호(▢)·빈 수식 표시가 본문에 남아 있지 않고, 수식이 글자로 들어 있다", () => {
    for (const spec of FILES) {
      const items = readGen(spec.f).items;
      for (const [k, it] of Object.entries<any>(items)) {
        expect(it.text, `${spec.f} ${k}`).not.toContain("▢");
        expect(it.text, `${spec.f} ${k}`).not.toContain("수식 — 아래");
        expect(it.text, `${spec.f} ${k}`).not.toContain("⟦");
        for (const tb of it.tables || []) for (const r of tb.rows) for (const c of r) expect(c.t, `${spec.f} ${k}`).not.toContain("▢");
      }
    }
    const e = readGen("2012-14-electric.json").items;
    expect(e["부속서Ⅲ/2.3"].text).toContain("Fk = k1·gn·(P+Q) / n");
    expect(JSON.stringify(e["부속서Ⅷ/2.1"])).toContain("T1/T2");
    expect(e["부속서Ⅷ/2.1"].text).not.toContain("T1/T2 의 평가\nⅧ");
    const h = readGen("2012-14-hydraulic.json").items;
    expect(h["12.5.5.1"].text).toContain("a = Qmax·r / (6·A·n·td)");
    expect(JSON.stringify(h["13.1.3"].tables)).toContain("≤ 500");
    expect(JSON.stringify(h["부속서Ⅱ/2.1"].tables)).toContain("π²·E·Jn / (2·l²)");
  });
  it("핵심 조항 내용이 정확히 들어 있다", () => {
    const e = readGen("2012-14-electric.json").items;
    expect(e["7.7.1"].text).toContain("잠금해제구간은 승강장 바닥의 위·아래로 0.2 m 이하");
    expect(e["8.17.4"].text).toContain("2 lx 이상의 조도로 1시간 동안");
    const s = readGen("2012-14-escalator.json").items;
    expect(s["5.3.2.1"].text).toContain("공칭 폭 Z1은 0.58 m 이상, 1.1 m 이하");
    const h = readGen("2012-14-hydraulic.json").items;
    expect(h["3.9"].text).toContain("멈춤 쇠 장치");
  });
});

describe("고시 원문 검색: 같은 시행일 문서는 함께, 경계 연도는 직전 고시도 함께", () => {
  const real: EraDoc[] = fs.readdirSync(genDir).filter(f => f.endsWith(".json")).map(f => {
    const d = readGen(f);
    return { meta: d.meta, items: d.items, ey: Number(String(d.meta.effectiveDate).slice(0, 4)) };
  });
  const ids = (y: number, eq?: string | null) => pickEraDocs(real, y, eq).map(d => d.meta.id);

  it("2015년 엘리베이터: 2012-14 전기식·유압식 둘 다(2009-67이 아님)", () => {
    expect(ids(2015, "엘리베이터").sort()).toEqual(["2012-14-electric", "2012-14-hydraulic"]);
  });
  it("2013년(시행일 2013-09-15이 연도 중간): 2012-14와 직전 2009-67을 함께", () => {
    const r = ids(2013, "엘리베이터");
    expect(r).toContain("2012-14-electric");
    expect(r).toContain("2012-14-hydraulic");
    expect(r).toContain("2009-67");
  });
  it("2012년 이하는 2009-67만", () => {
    expect(ids(2012, "엘리베이터")).toEqual(["2009-67"]);
    expect(ids(2010, "엘리베이터")).toEqual(["2009-67"]);
  });
  it("에스컬레이터: 2015년은 2012-14 에스컬레이터, 2022년 이후는 2022 고시", () => {
    expect(ids(2015, "에스컬레이터")).toEqual(["2012-14-escalator"]);
    // 2022-03-02 시행(연도 중간) → 2022년 질문은 직전 2012-14도 함께, 2023년 이후는 2022 고시만
    expect(ids(2022, "에스컬레이터")).toEqual(["2022-kc2050-53-escalator", "2012-14-escalator"]);
    expect(ids(2025, "에스컬레이터")).toEqual(["2022-kc2050-53-escalator"]);
  });
  it("설비를 모르면 설비별로 각각 고른다", () => {
    const r = ids(2015, null);
    expect(r).toContain("2012-14-electric");
    expect(r).toContain("2012-14-escalator");
    expect(r).not.toContain("closure-guide");
  });
  it("업무 절차 문서는 어떤 연도에서도 고르지 않는다", () => {
    for (const y of [1995, 2013, 2020, 2030]) expect(ids(y, "엘리베이터")).not.toContain("closure-guide");
  });
  it("pickEraDoc 하위 호환(첫 문서)", () => {
    expect(pickEraDoc(real, 2010, "엘리베이터")?.meta.id).toBe("2009-67");
  });
});
