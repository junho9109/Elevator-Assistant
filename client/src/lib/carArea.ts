// 카 유효면적 표(별표22 8.2.1.1 표 5·8.2.2.2 표 6·8.2.3.1 표 7)를 코드로 계산한다 — AI 암산 오차를 피하기 위해.
// 값은 원본 PDF(별표22)의 표를 그대로 옮긴 것이며, 보간·초과분 규칙도 원문 비고를 따른다.
// 표 5 (일반 엘리베이터: 정격하중 kg → 최대 카 유효면적 ㎡)
export const TABLE5: [number, number][] = [
  [100, 0.37], [180, 0.58], [225, 0.70], [300, 0.90], [375, 1.10], [400, 1.17], [450, 1.30], [525, 1.45], [600, 1.60], [630, 1.66],
  [675, 1.75], [750, 1.90], [800, 2.00], [825, 2.05], [900, 2.20], [975, 2.35], [1000, 2.40], [1050, 2.50], [1125, 2.65], [1200, 2.80],
  [1250, 2.90], [1275, 2.95], [1350, 3.10], [1425, 3.25], [1500, 3.40], [1600, 3.56], [2000, 4.20], [2500, 5.00],
];
// 표 6 (화물용 엘리베이터)
export const TABLE6: [number, number][] = [
  [400, 1.68], [450, 1.84], [525, 2.08], [600, 2.32], [630, 2.42], [675, 2.56], [750, 2.80], [800, 2.96], [825, 3.04], [900, 3.28],
  [975, 3.52], [1000, 3.60], [1050, 3.72], [1125, 3.90], [1200, 4.08], [1250, 4.20], [1275, 4.26], [1350, 4.44], [1425, 4.62], [1500, 4.80], [1600, 5.04],
];
// 표 7 (정원 인승 → 최소 카 유효면적 ㎡), 20인승 초과는 1명마다 0.115 ㎡ 추가
export const TABLE7: [number, number][] = [
  [1, 0.28], [2, 0.49], [3, 0.60], [4, 0.79], [5, 0.98], [6, 1.17], [7, 1.31], [8, 1.45], [9, 1.59], [10, 1.73],
  [11, 1.87], [12, 2.01], [13, 2.15], [14, 2.29], [15, 2.43], [16, 2.57], [17, 2.71], [18, 2.85], [19, 2.99], [20, 3.13],
];
const r2 = (x: number) => Math.round(x * 1000) / 1000;

function interp(tbl: [number, number][], x: number): number {
  for (let i = 0; i < tbl.length - 1; i++) {
    const [x0, y0] = tbl[i], [x1, y1] = tbl[i + 1];
    if (x >= x0 && x <= x1) return x === x0 ? y0 : x === x1 ? y1 : y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
  }
  return NaN;
}
export type AreaCalc = { value: number; text: string };

/** 표 5 — 정격하중(kg) → 최대 카 유효면적. 표 범위 밖(100 kg 미만)은 null, 2,500 kg 초과는 100 kg마다 0.16 ㎡ 추가 */
export function maxAreaPassenger(kg: number): AreaCalc | null {
  if (!(kg >= 100)) return null;
  const last = TABLE5[TABLE5.length - 1];
  if (kg > last[0]) {
    const add = ((kg - last[0]) / 100) * 0.16;
    return { value: r2(last[1] + add), text: `${last[0].toLocaleString()} kg = ${last[1]} ㎡ + (${(kg - last[0]).toLocaleString()} kg ÷ 100 kg) × 0.16 ㎡ = ${r2(last[1] + add)} ㎡ (표 5 비고 3)` };
  }
  const hit = TABLE5.find(r => r[0] === kg);
  if (hit) return { value: hit[1], text: `표 5에서 ${kg.toLocaleString()} kg = ${hit[1].toFixed(2)} ㎡` };
  const i = TABLE5.findIndex(r => r[0] > kg);
  const [x0, y0] = TABLE5[i - 1], [x1, y1] = TABLE5[i];
  const v = r2(interp(TABLE5, kg));
  return { value: v, text: `표 5 ${x0.toLocaleString()} kg = ${y0.toFixed(2)} ㎡, ${x1.toLocaleString()} kg = ${y1.toFixed(2)} ㎡ 사이를 보간: ${y0.toFixed(2)} + (${kg} − ${x0}) ÷ (${x1} − ${x0}) × (${y1.toFixed(2)} − ${y0.toFixed(2)}) = ${v} ㎡ (표 5 비고 4)` };
}
/** 표 6 — 화물용. 1,600 kg 초과는 100 kg마다 0.4 ㎡ 추가 */
export function maxAreaFreight(kg: number): AreaCalc | null {
  if (!(kg >= 400)) return null;
  const last = TABLE6[TABLE6.length - 1];
  if (kg > last[0]) {
    const add = ((kg - last[0]) / 100) * 0.4;
    return { value: r2(last[1] + add), text: `${last[0].toLocaleString()} kg = ${last[1]} ㎡ + (${(kg - last[0]).toLocaleString()} kg ÷ 100 kg) × 0.4 ㎡ = ${r2(last[1] + add)} ㎡ (표 6 비고 1)` };
  }
  const hit = TABLE6.find(r => r[0] === kg);
  if (hit) return { value: hit[1], text: `표 6에서 ${kg.toLocaleString()} kg = ${hit[1].toFixed(2)} ㎡` };
  const v = r2(interp(TABLE6, kg));
  return { value: v, text: `표 6의 인접 값 사이를 보간(비고 2) = ${v} ㎡` };
}
/** 표 7 — 정원(인승) → 최소 카 유효면적. 20인승 초과는 1명마다 0.115 ㎡ 추가 */
export function minAreaByCapacity(n: number): AreaCalc | null {
  if (!(Number.isInteger(n) && n >= 1)) return null;
  if (n <= 20) return { value: TABLE7[n - 1][1], text: `표 7에서 ${n}인승 = ${TABLE7[n - 1][1].toFixed(2)} ㎡` };
  const v = r2(3.13 + (n - 20) * 0.115);
  return { value: v, text: `20인승 3.13 ㎡ + (${n} − 20) × 0.115 ㎡ = ${v} ㎡ (표 7 비고)` };
}

/**
 * 질문에서 카 면적 관련 숫자를 찾아 계산 결과 문구를 만든다. 해당 없으면 "".
 * - 질문이 카 면적/유효면적/정격하중/정원 이야기가 아니면 "" (다른 질문에 끼어들지 않는다)
 * - 숫자가 없으면 표 위치(8.2.1.1·8.2.2.2·8.2.3.1)만 안내한다
 */
export function carAreaNote(question: string): string {
  const q = (question || "").replace(/,/g, "");
  const about = /유효\s*(바닥)?\s*면적|카\s*면적|카\s*크기\s*(와|및)?\s*용량|정격\s*(하중|용량)|(\d+)\s*인승|정원/.test(q);
  if (!about) return "";
  const lines: string[] = [];
  const kg = q.match(/(\d{3,5}(?:\.\d+)?)\s*(?:kg|㎏|킬로)/i);
  const nin = q.match(/(\d{1,3})\s*인승|정원\s*(\d{1,3})\s*명?/);
  const freight = /화물|자동차용/.test(q);
  if (kg) {
    const w = Number(kg[1]);
    const c = freight ? maxAreaFreight(w) : maxAreaPassenger(w);
    if (c) lines.push(`정격하중 ${w.toLocaleString()} kg의 최대 카 유효면적(${freight ? "화물용 표 6" : "일반 표 5"}): ${c.value} ㎡ — ${c.text}`);
  }
  if (nin) {
    const n = Number(nin[1] || nin[2]);
    const c = minAreaByCapacity(n);
    if (c) lines.push(`${n}인승의 최소 카 유효면적(표 7): ${c.value} ㎡ — ${c.text}`);
  }
  const head = "[카 유효면적 표 — 별표22 엘리베이터 8.2.1.1(표 5 정격하중별 최대 유효면적), 8.2.2.2(표 6 화물용), 8.2.3.1(표 7 정원별 최소 유효면적)] 현장에서 말하는 '카 용량별 유효바닥면적'이 이 표입니다.";
  return lines.length ? `${head}\n[코드 계산 결과(AI 암산 아님, 그대로 인용)]\n${lines.join("\n")}` : head;
}
