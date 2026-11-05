import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
describe("사진 삭제 비밀번호", () => {
  it("소스코드에 비밀번호가 없다", () => {
    const r = readFileSync("server/routes.ts", "utf-8");
    const h = readFileSync("client/src/pages/home.tsx", "utf-8");
    expect(r).not.toMatch(/STD_PHOTO_DELETE_PW|TECH_PHOTO_DELETE_PW/);
    expect(h).not.toMatch(/pw !== "910919"/);
    expect(r).toContain("PHOTO_DELETE_PASSWORD");
    expect(r).toMatch(/inspection-photos\/:id[\s\S]{0,200}photoDeleteAllowed/);
  });
});
