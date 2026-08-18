// 팀(반) 편성표 — 위험성평가 화면에서 등록자 이름으로 소속 팀을 표시하는 데 사용.
// 동명이인(이승철)은 "이름(사번)" 형태로 로그인 시 구분되어 name에 그대로 저장됨.
export type TeamRoster = { name: string; members: string[] };

export const TEAM_ROSTERS: TeamRoster[] = [
  { name: "전기식 엘리베이터 1반", members: ["최원식", "전지한", "정지민", "남택우", "이승철(20200165)", "황규실"] },
  { name: "유압식 엘리베이터 2반", members: ["박성준", "차유식", "이승남", "오지헌", "김태엽", "이승철(20210163)"] },
  { name: "에스컬레이터 및 휠체어리프트 3반", members: ["박성준", "노준호", "김은중", "정보영", "이규은", "강신철"] },
  { name: "사무업무 4반", members: ["서지명", "이자영", "정정주", "배병찬", "양성우"] },
];

// 동명이인 — 로그인 시 사번으로 구분해야 하는 이름과, 그 이름을 쓰는 사람들의 사번 목록
export const DUPLICATE_NAME_IDS: Record<string, string[]> = {
  "이승철": ["20200165", "20210163"],
};

export function isDuplicateName(name: string): boolean {
  return !!DUPLICATE_NAME_IDS[name.trim()];
}

export function isValidEmployeeId(name: string, empId: string): boolean {
  const ids = DUPLICATE_NAME_IDS[name.trim()];
  return !!ids && ids.includes(empId.trim());
}

// 위험성평가 등록자 이름(동명이인은 "이름(사번)" 형태)으로 소속 팀(들)을 찾는다.
// 한 사람이 여러 팀에 속할 수 있어 배열로 반환.
export function getTeamsForName(name: string): string[] {
  const n = (name || "").trim();
  if (!n) return [];
  return TEAM_ROSTERS.filter(t => t.members.includes(n)).map(t => t.name);
}
