import { describe, it, expect } from "vitest";
import { splitAttachmentMarkers } from "../../client/src/lib/answerMarkers";
import { figureTagLines, resolveStaticFigure, attachmentContext } from "../../client/src/lib/standardAttachments";

describe("그림 표시", () => {
  it("정적 그림 키가 해석된다", () => {
    const tags = figureTagLines("엘리베이터", "6.4.1");
    expect(tags.length).toBeGreaterThan(0);
    const key = tags[0].match(/\[\[그림:([^\]]+)\]\]/)![1];
    const f = resolveStaticFigure(key);
    expect(f?.srcs.length).toBeGreaterThan(0);
    expect(attachmentContext("엘리베이터", "6.4.1")).toContain("[[그림:");
  });
  it("그림 표시를 part로 나눈다", () => {
    const p = splitAttachmentMarkers("설명\n[[그림:s22/6.4.1/f0]] (그림)\n끝");
    expect(p.some(x => x.type === "fig")).toBe(true);
  });
  it("짝 안 맞는 표시는 글자로 남기지 않는다", () => {
    const p = splitAttachmentMarkers("가 [[첨부:그림1:정보]] 나");
    expect(p.every(x => x.type !== "text" || !x.text.includes("[["))).toBe(true);
  });
  it("스트리밍 중 미완성 표시는 숨긴다", () => {
    const p = splitAttachmentMarkers("가 [[그림:s22/6");
    expect(p.map(x => (x as any).text ?? "").join("")).not.toContain("[[");
  });
});
