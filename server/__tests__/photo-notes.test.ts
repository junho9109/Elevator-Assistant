import { describe, it, expect } from "vitest";
import { photoNote } from "../../client/src/lib/photoNotes";
describe("사진 판독 글", () => {
  it("제목 공백이 달라도 맞는다", () => {
    expect(photoNote("에이프런과  벽까지  수평거리 측정  방법")).toContain("0.12");
    expect(photoNote("스커트디플렉터 측정치 입력")).toContain("33 mm");
    expect(photoNote("승강로 하부에 위치한 공간의  보호 <예시>")).toContain("5,000");
    expect(photoNote("절연저항 측정값 입력")).toContain("0.25");
    expect(photoNote("META(MHC2)")).toContain("Pre-torque");
    expect(photoNote("관계없는 제목")).toBe("");
  });
});
