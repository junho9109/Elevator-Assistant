export type BuildingType = "apartment" | "general";
export type EquipmentType = "elevator_mr" | "elevator_mrl" | "elevator_hydraulic" | "elevator_inclined" | "escalator" | "dumbwaiter" | "wheelchair_lift";
export type InspectionType = "precision" | "periodic";
export type ExtensionType = "3year" | "1stage" | "none";
export type InspectionResult = "pass" | "conditional_next" | "conditional_12" | "fail";
export type ImprovementPlan = "A" | "B" | "C" | "D" | "E";
export type CurrentStatus = "new" | "stage1" | "stage2" | "3year_applied";

export const IMPROVEMENT_PLANS: { 
  value: ImprovementPlan; 
  label: string; 
  description: string; 
  extensionPeriod: string;
  documents: string[];
  obligations: string[];
}[] = [
  { 
    value: "A", 
    label: "전체교체 예정", 
    description: "호환되는 부품이 없어 전체 교체를 예정하는 승강기",
    extensionPeriod: "차기검사 시까지",
    documents: ["보완연장신청서", "이행계획서(관리주체 서명/직인)"],
    obligations: ["일상점검 실시 및 기록 보관", "분기별 자체점검 추가 실시", "차기 정기검사로 정밀안전검사 대체"]
  },
  { 
    value: "B", 
    label: "부분교체 예정", 
    description: "구동기, 제어반 포함 주요 부품 교체가 필요한 승강기",
    extensionPeriod: "6개월 (추가 연장 시 이행확인서 필요)",
    documents: ["보완연장신청서", "이행계획서(관리주체 서명/직인)", "이행확인서 (추가연장 시)"],
    obligations: ["일상점검 실시 및 기록 보관", "분기별 자체점검 추가 실시", "차기 정기검사로 정밀안전검사 대체"]
  },
  { 
    value: "C", 
    label: "재개발·재건축 철거 예정", 
    description: "관리처분계획인가가 고시된 건축물의 승강기",
    extensionPeriod: "차기검사 시까지",
    documents: ["보완연장신청서", "이행계획서(관리주체 서명/직인)", "관리처분계획인가 고시 증명서류"],
    obligations: ["일상점검 실시 및 기록 보관", "분기별 자체점검 추가 실시", "차기 정기검사로 정밀안전검사 대체"]
  },
  { 
    value: "D", 
    label: "국민 이동편의보장 현장", 
    description: "교통약자법, 건축법상 다중이용시설 등 이동편의 보장이 필요한 현장",
    extensionPeriod: "차기검사 시까지",
    documents: ["보완연장신청서", "이행계획서(관리주체 서명/직인)", "건축물대장 등 용도 확인 서류"],
    obligations: ["일상점검 실시 및 기록 보관", "분기별 자체점검 추가 실시", "차기 정기검사로 정밀안전검사 대체"]
  },
  { 
    value: "E", 
    label: "건축물 대수선 필요 현장", 
    description: "승강로 협소 등 건축물 구조상 개선조치가 불가능하여 대수선이 필요한 경우",
    extensionPeriod: "행안부 장관 인정 시 설치 제외 판정",
    documents: ["유지관리계약서(월 2회 이상 자체점검 포함)", "자체개선계획서", "제조·수입업체 2곳 이상의 검토의견서"],
    obligations: ["월 2회 이상 자체점검", "유지관리계약 유지", "안전관리 강화"]
  }
];

export interface CTAActionDetail {
  title: string;
  description: string;
  documents: string[];
  procedures: string[];
  notes: string[];
}

export const CTA_ACTION_DETAILS: Record<string, CTAActionDetail> = {
  apply_stage1: {
    title: "1단계 연장 신청",
    description: "조건부합격 승강기의 이행기간을 1단계로 연장 신청합니다.",
    documents: [
      "보완연장신청서 (소정 양식)",
      "이행계획서 (관리주체 서명/직인 필수)",
      "부품 설치 관련 공사계약서 (해당 시)"
    ],
    procedures: [
      "1. 보완연장신청서 작성",
      "2. 이행계획서 작성 및 관리주체 서명/직인 날인",
      "3. 관할 검사기관에 서류 제출",
      "4. 최초 2개월 연장 승인 → 추가 2개월 연장 가능 (총 4개월)",
      "5. 또는 최대 1년 6개월 이내 도래하는 차기검사 시까지 연장"
    ],
    notes: [
      "정밀안전검사 관련 부품 추가설치 사항에 한정하여 적용",
      "연장기간은 원래의 검사주기를 초과할 수 없음",
      "분기별 자체점검을 추가 실시해야 함"
    ]
  },
  review_stage2: {
    title: "2단계로 전환 검토",
    description: "1단계 연장 이후 2단계 이행기간 연장 조건을 확인합니다.",
    documents: [
      "보완연장신청서 (소정 양식)",
      "이행계획서 (관리주체 서명/직인 필수)",
      "해당 사유별 증빙서류 (전체교체 계획서, 관리처분계획인가 고시 등)"
    ],
    procedures: [
      "1. 2단계 연장 사유 해당 여부 확인 (A~E 중 선택)",
      "2. 해당 사유에 맞는 증빙서류 준비",
      "3. 1단계 종료 전 2단계 서류 제출",
      "4. 대상별 6개월~1년 추가 연장 승인"
    ],
    notes: [
      "A: 전체교체 예정 - 차기검사 시까지",
      "B: 부분교체 예정 - 6개월 (추가 6개월 가능, 이행확인서 필요)",
      "C: 재개발·재건축 철거 예정 - 차기검사 시까지",
      "D: 국민 이동편의보장 필요 - 차기검사 시까지",
      "E: 건축물 대수선 필요 - 행안부 장관 인정 시 설치 제외 판정",
      "※ 2단계 사유는 중복 적용 불가, 중도 사유변경도 불가"
    ]
  },
  confirmation_inspection: {
    title: "보완 완료 후 확인검사",
    description: "조건부 사항 시정 완료 후 확인검사를 신청합니다.",
    documents: [
      "확인검사 신청서",
      "시정 완료 증빙서류 (부품 교체 완료 사진, 시공 확인서 등)",
      "자체점검 기록부"
    ],
    procedures: [
      "1. 조건부 사항 시정 공사 완료",
      "2. 시정 완료 증빙자료 준비",
      "3. 확인검사 신청서 작성",
      "4. 관할 검사기관에 확인검사 신청",
      "5. 검사 후 합격 시 조건부 해제"
    ],
    notes: [
      "확인검사는 시정 완료 후 신속히 신청해야 함",
      "확인검사 불합격 시 재시정 후 재신청 필요",
      "합격 시 정상 검사주기로 복귀"
    ]
  },
  change_plan: {
    title: "교체 계획 변경",
    description: "기존 개선 계획(A~E)을 다른 계획으로 변경합니다.",
    documents: [
      "계획변경 신청서",
      "변경 사유서",
      "새로운 이행계획서 (관리주체 서명/직인 필수)",
      "변경된 계획에 해당하는 증빙서류"
    ],
    procedures: [
      "1. 계획 변경 필요성 검토",
      "2. 계획변경 신청서 및 사유서 작성",
      "3. 새로운 이행계획서 작성",
      "4. 관할 검사기관에 변경 신청",
      "5. 승인 후 변경된 계획에 따라 진행"
    ],
    notes: [
      "원칙적으로 2단계 사유 변경은 불가",
      "불가피한 사유 발생 시 검사기관과 사전 협의 필요",
      "변경 승인 전까지는 기존 계획 유지"
    ]
  },
  extend_period: {
    title: "이행기간 추가 연장 신청",
    description: "부분교체(B) 등 추가 연장이 가능한 경우 연장을 신청합니다.",
    documents: [
      "추가연장 신청서",
      "이행확인서 (기존 이행 상황 확인)",
      "추가 연장 사유 증빙서류"
    ],
    procedures: [
      "1. 기존 이행기간 내 추가 연장 필요성 확인",
      "2. 이행확인서 작성 (기존 진행 상황 명시)",
      "3. 추가연장 신청서 작성",
      "4. 관할 검사기관에 추가 연장 신청",
      "5. 승인 시 추가 6개월 연장"
    ],
    notes: [
      "부분교체(B) 대상만 추가 연장 가능 (6개월 + 6개월)",
      "이행확인서에 기존 진행 상황을 명확히 기재",
      "연장기간은 원래의 검사주기를 초과할 수 없음"
    ]
  },
  check_schedule: {
    title: "정밀안전검사 일정 확인",
    description: "3년 연장 종료일을 확인하고 차기 검사 일정을 준비합니다.",
    documents: [],
    procedures: [
      "1. 서면동의서 제출일 확인",
      "2. 3년 연장 종료일 계산 (제출일 + 3년)",
      "3. 종료일 6개월 전부터 정밀안전검사 준비",
      "4. 검사기관에 검사 예약 문의"
    ],
    notes: [
      "3년 연장 종료 후에는 정밀안전검사 필수",
      "종료일 초과 시 과태료 부과 가능",
      "미리 검사 일정을 확인하고 준비해야 함"
    ]
  },
  self_inspection: {
    title: "자체점검 기록 관리",
    description: "일상점검 및 자체점검 기록을 관리합니다.",
    documents: [
      "자체점검 기록부",
      "일상점검 체크리스트",
      "점검 결과 보고서"
    ],
    procedures: [
      "1. 일상점검 매일 실시 및 기록",
      "2. 자체점검 분기별 실시",
      "3. 점검 결과 기록부에 기재",
      "4. 이상 발견 시 즉시 보수 조치",
      "5. 기록부 3년간 보관"
    ],
    notes: [
      "자체점검 기록은 검사 시 제출해야 할 수 있음",
      "점검 누락 시 과태료 부과 가능",
      "유지관리업체와 협조하여 점검 실시"
    ]
  },
  long_term_plan: {
    title: "장기수선계획 검토",
    description: "승강기 교체/보수 비용을 장기수선계획에 반영합니다.",
    documents: [
      "장기수선계획서",
      "승강기 교체/보수 견적서",
      "입주자대표회의 의결서 (해당 시)"
    ],
    procedures: [
      "1. 현재 장기수선계획서 검토",
      "2. 승강기 교체/보수 비용 산정",
      "3. 장기수선계획 수정안 작성",
      "4. 입주자대표회의 의결 (공동주택)",
      "5. 수정된 장기수선계획 시행"
    ],
    notes: [
      "공동주택관리법에 따라 장기수선계획 수립 의무",
      "승강기 교체 비용은 장기수선충당금에서 지출",
      "3년 연장 종료 전 미리 계획 수립 권장"
    ]
  }
};

export interface StatusDiagnosis {
  currentStatus: string;
  statusDescription: string;
  improvementPlanLabel: string;
  mainMessage: string;
  ctaButtons: { label: string; action: string; description: string }[];
  warnings: string[];
  requiredDocuments: string[];
  obligations: string[];
}

export const INSPECTION_RESULTS: { value: InspectionResult; label: string; shortLabel: string; description: string; color: string }[] = [
  { 
    value: "pass", 
    label: "합격", 
    shortLabel: "합격",
    description: "모든 검사항목 적합", 
    color: "bg-green-100 text-green-800 border-green-300" 
  },
  { 
    value: "conditional_next", 
    label: "차기안전검사 조건부합격", 
    shortLabel: "차기안전검사",
    description: "차기 안전검사 시까지 시정 조건", 
    color: "bg-blue-100 text-blue-800 border-blue-300" 
  },
  { 
    value: "conditional_12", 
    label: "조건부합격(12개월 이하)", 
    shortLabel: "12개월이하",
    description: "12개월 이내 시정 후 재검사 필요", 
    color: "bg-yellow-100 text-yellow-800 border-yellow-300" 
  },
  { 
    value: "fail", 
    label: "불합격", 
    shortLabel: "불합격",
    description: "중대 결함으로 즉시 시정 필요", 
    color: "bg-red-100 text-red-800 border-red-300" 
  }
];

export type ExtensionStage = "none" | "stage1" | "stage2" | "3year_applied";
export type ExtensionReason = 
  | "full_replacement" 
  | "partial_replacement" 
  | "redevelopment" 
  | "accessibility" 
  | "agency_decision"
  | "disaster"
  | "covid19"
  | "building_renovation";

export const EXTENSION_STAGES_APARTMENT: { value: ExtensionStage; label: string; description: string }[] = [
  { value: "3year_applied", label: "3년 연장 (서면동의서 제출)", description: "검사규정 부칙 제3조제3항에 따라 서면동의서를 제출하여 3년간 검사 유예" }
];

export const EXTENSION_STAGES_GENERAL: { value: ExtensionStage; label: string; description: string }[] = [
  { value: "none", label: "신규 (1단계 신청)", description: "조건부합격 이행기간 연장을 처음 신청하는 경우" },
  { value: "stage1", label: "1단계 진행 중", description: "1단계 이행기간 연장 중 (최대 2개월+2개월)" },
  { value: "stage2", label: "2단계 진행 중", description: "2단계 이행기간 연장 중 (대상별 6개월~1년)" }
];

export const EXTENSION_STAGES: { value: ExtensionStage; label: string; description: string; forBuilding: BuildingType[] }[] = [
  { value: "none", label: "신규 (연장 이력 없음)", description: "이행기간 연장을 처음 신청하는 경우", forBuilding: ["apartment", "general"] },
  { value: "stage1", label: "1단계 진행 중", description: "1단계 이행기간 연장 중", forBuilding: ["apartment", "general"] },
  { value: "stage2", label: "2단계 진행 중", description: "2단계 이행기간 연장 중", forBuilding: ["apartment", "general"] },
  { value: "3year_applied", label: "3년 연장 적용", description: "서면동의서 제출로 3년 연장 적용 (공동주택)", forBuilding: ["apartment"] }
];

export const EXTENSION_REASONS: { value: ExtensionReason; label: string; description: string; stages: ExtensionStage[]; documents: string[] }[] = [
  { 
    value: "full_replacement", 
    label: "ⓐ 전체교체 예정", 
    description: "호환되는 부품이 없는 승강기 등으로 전체교체를 예정하는 승강기",
    stages: ["stage2"],
    documents: ["보완연장신청서", "이행계획서"]
  },
  { 
    value: "partial_replacement", 
    label: "ⓑ 부분교체 예정", 
    description: "주요부품(구동기, 제어반) 교체가 필요한 승강기 (추가 6개월 연장 가능)",
    stages: ["stage2"],
    documents: ["보완연장신청서", "이행계획서", "이행확인서"]
  },
  { 
    value: "redevelopment", 
    label: "ⓒ 재개발·재건축 철거 예정", 
    description: "관리처분계획인가가 고시된 건축물의 승강기",
    stages: ["stage2"],
    documents: ["보완연장신청서", "이행계획서", "관리처분계획인가 고시 증명서류"]
  },
  { 
    value: "accessibility", 
    label: "ⓓ 국민 이동편의보장 필요", 
    description: "이동편의시설 관련 법령에 따른 승강기",
    stages: ["stage2"],
    documents: ["보완연장신청서", "이행계획서", "건물용도 확인 가능서류(건축물대장 등)"]
  },
  { 
    value: "agency_decision", 
    label: "ⓔ 공단 이사장 판단", 
    description: "부품 설치를 위해 건축물 수선이 필요하여 이행기간 연장이 필요한 승강기",
    stages: ["stage2"],
    documents: ["보완연장신청서", "이행계획서", "검토의견서(공단 검사기관 검토)"]
  },
  { 
    value: "disaster", 
    label: "재난 발생", 
    description: "재난으로 인해 조건부사항 처리가 불가한 경우",
    stages: ["stage1", "stage2"],
    documents: ["보완연장신청서", "자체개선계획서", "재난 관련 증빙서류"]
  },
  { 
    value: "covid19", 
    label: "코로나19 일상회복 지원", 
    description: "코로나19 관련시설 지정 등으로 정상운행이 불가한 경우",
    stages: ["stage1"],
    documents: ["보완연장신청서", "자체개선계획서", "코로나19 관련 시설 지정서 등"]
  },
  { 
    value: "building_renovation", 
    label: "건축물 대수선 필요", 
    description: "개선조치를 위해 건축물 대수선을 해야 하는 경우",
    stages: ["stage2"],
    documents: ["보완연장신청서", "이행계획서", "대수선 관련 증명서류"]
  }
];

export interface ExtensionGuidance {
  title: string;
  description: string;
  maxPeriod: string;
  requirements: string[];
  documents: string[];
  nextSteps: string[];
  warnings: string[];
}

export interface ExtensionOption {
  id: string;
  name: string;
  description: string;
  eligibleBuildings: BuildingType[];
  maxExtensionMonths: number;
  requirements: string[];
  documents: DocumentRequirement[];
}

export interface DocumentRequirement {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

export const BUILDING_TYPES: { value: BuildingType; label: string; description: string }[] = [
  { value: "apartment", label: "공동주택/집합건축물", description: "아파트, 상가, 오피스텔 등 (3년 연장 적용 가능)" },
  { value: "general", label: "일반건축물", description: "상업/업무/기타 일반 건축물" }
];

export const EQUIPMENT_TYPES: { value: EquipmentType; label: string }[] = [
  { value: "elevator_mr", label: "엘리베이터 (전기식 MR)" },
  { value: "elevator_mrl", label: "엘리베이터 (전기식 MRL)" },
  { value: "elevator_hydraulic", label: "엘리베이터 (유압식)" },
  { value: "elevator_inclined", label: "엘리베이터 (경사형)" },
  { value: "escalator", label: "에스컬레이터" },
  { value: "dumbwaiter", label: "소형화물용승강기(덤웨이터)" },
  { value: "wheelchair_lift", label: "휠체어리프트" }
];

export const EXTENSION_OPTIONS: ExtensionOption[] = [
  {
    id: "3year",
    name: "3년 연장",
    description: "공동주택(아파트)에 설치된 승강기는 정밀안전검사 주기를 3년까지 연장 가능",
    eligibleBuildings: ["apartment"],
    maxExtensionMonths: 36,
    requirements: [
      "15년 이상 경과된 승강기",
      "직전 정밀안전검사 결과 적합 판정",
      "자체점검 결과 이상 없음",
      "유지관리 기록 정상 유지"
    ],
    documents: [
      { id: "doc1", name: "정밀안전검사 연장신청서", description: "공단 양식 사용", required: true },
      { id: "doc2", name: "직전 정밀안전검사 성적서 사본", description: "적합 판정 확인용", required: true },
      { id: "doc3", name: "자체점검 기록부", description: "최근 1년간 점검 기록", required: true },
      { id: "doc4", name: "유지관리계약서 사본", description: "유지관리업체 계약 현황", required: true },
      { id: "doc5", name: "관리주체 확인서", description: "공동주택 관리사무소 날인", required: true }
    ]
  },
  {
    id: "1stage",
    name: "1단계 연장",
    description: "일반건축물은 정밀안전검사 1단계 연장(최대 1년) 가능",
    eligibleBuildings: ["general"],
    maxExtensionMonths: 12,
    requirements: [
      "15년 이상 경과된 승강기",
      "직전 정밀안전검사 결과 적합 판정",
      "정기검사 미지연 상태"
    ],
    documents: [
      { id: "doc1", name: "정밀안전검사 연장신청서", description: "공단 양식 사용", required: true },
      { id: "doc2", name: "직전 정밀안전검사 성적서 사본", description: "적합 판정 확인용", required: true },
      { id: "doc3", name: "건축물 등기부등본 또는 건축물대장", description: "건축물 유형 확인용", required: true }
    ]
  }
];

export interface InspectionPeriodRule {
  equipmentAge: number;
  inspectionType: InspectionType;
  periodMonths: number;
  description: string;
}

export const INSPECTION_PERIOD_RULES: InspectionPeriodRule[] = [
  { equipmentAge: 0, inspectionType: "precision", periodMonths: 0, description: "설치 후 15년 미만: 정밀안전검사 불필요" },
  { equipmentAge: 15, inspectionType: "precision", periodMonths: 24, description: "15년 이상: 2년마다 정밀안전검사" },
  { equipmentAge: 25, inspectionType: "precision", periodMonths: 12, description: "25년 이상: 1년마다 정밀안전검사" },
  { equipmentAge: 0, inspectionType: "periodic", periodMonths: 12, description: "정기검사: 1년마다" }
];

export interface WorkflowResult {
  eligibleExtensions: ExtensionOption[];
  requiredInspections: { type: InspectionType; dueDate: Date | null; description: string }[];
  warnings: string[];
  recommendations: string[];
  nextSteps: string[];
}

export function calculateEquipmentAge(installDate: Date): number {
  const now = new Date();
  const years = (now.getTime() - installDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.floor(years);
}

export function getInspectionPeriod(equipmentAge: number, inspectionType: InspectionType): InspectionPeriodRule {
  const rules = INSPECTION_PERIOD_RULES
    .filter(r => r.inspectionType === inspectionType && r.equipmentAge <= equipmentAge)
    .sort((a, b) => b.equipmentAge - a.equipmentAge);
  return rules[0] || INSPECTION_PERIOD_RULES[0];
}

export function calculateNextInspectionDate(lastInspectionDate: Date, periodMonths: number): Date {
  const next = new Date(lastInspectionDate);
  next.setMonth(next.getMonth() + periodMonths);
  return next;
}

export function evaluateWorkflow(
  buildingType: BuildingType,
  equipmentType: EquipmentType,
  installDate: Date,
  lastPrecisionDate: Date | null,
  lastPeriodicDate: Date | null,
  lastResult: InspectionResult | null
): WorkflowResult {
  const equipmentAge = calculateEquipmentAge(installDate);
  const eligibleExtensions: ExtensionOption[] = [];
  const requiredInspections: { type: InspectionType; dueDate: Date | null; description: string }[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];
  const nextSteps: string[] = [];

  if (equipmentAge >= 15) {
    EXTENSION_OPTIONS.forEach(option => {
      if (option.eligibleBuildings.includes(buildingType)) {
        if (lastResult === "pass") {
          eligibleExtensions.push(option);
        } else if (lastResult === "conditional_next") {
          recommendations.push(`${option.name} 신청 가능 여부: 차기안전검사 조건부합격 상태에서는 시정 완료 후 신청 검토 가능`);
        } else if (lastResult === "conditional_12") {
          warnings.push(`${option.name}을 신청하려면 직전 검사 결과가 '합격'이어야 합니다. 현재 12개월 이하 조건부합격 상태로 재검사가 필요합니다.`);
          nextSteps.push("12개월 이내 시정 후 재검사 신청");
        } else if (lastResult === "fail") {
          warnings.push(`불합격 상태에서는 연장 신청이 불가합니다. 즉시 시정 후 재검사를 받으세요.`);
          nextSteps.push("즉시 시정 조치 후 재검사 신청");
        }
      }
    });

    const precisionRule = getInspectionPeriod(equipmentAge, "precision");
    if (lastPrecisionDate) {
      const nextPrecision = calculateNextInspectionDate(lastPrecisionDate, precisionRule.periodMonths);
      requiredInspections.push({
        type: "precision",
        dueDate: nextPrecision,
        description: precisionRule.description
      });

      const monthsUntil = (nextPrecision.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30);
      if (monthsUntil < 3) {
        warnings.push("정밀안전검사 기한이 3개월 이내입니다. 검사 일정을 확인하세요.");
      }
      if (monthsUntil < 0) {
        warnings.push("정밀안전검사 기한이 경과했습니다. 즉시 검사를 신청하세요.");
      }
    } else {
      warnings.push("정밀안전검사 이력이 없습니다. 15년 이상 승강기는 정밀안전검사가 필요합니다.");
      nextSteps.push("정밀안전검사 신청");
    }
  } else {
    recommendations.push(`설치 후 ${equipmentAge}년 경과. 15년 경과 시점에 정밀안전검사가 필요합니다.`);
  }

  if (lastPeriodicDate) {
    const periodicRule = getInspectionPeriod(equipmentAge, "periodic");
    const nextPeriodic = calculateNextInspectionDate(lastPeriodicDate, periodicRule.periodMonths);
    requiredInspections.push({
      type: "periodic",
      dueDate: nextPeriodic,
      description: periodicRule.description
    });
  }

  if (eligibleExtensions.length > 0) {
    nextSteps.push("연장 신청 서류 준비");
    nextSteps.push("관할 검사기관에 신청서 제출");
  }

  if (buildingType === "apartment" && equipmentAge >= 15) {
    recommendations.push("공동주택/집합건축물은 장기수선계획에 승강기 교체/보수 비용을 반영하세요.");
  }

  return {
    eligibleExtensions,
    requiredInspections,
    warnings,
    recommendations,
    nextSteps
  };
}

export function generateStatusDiagnosis(
  buildingType: BuildingType,
  currentStatus: CurrentStatus,
  improvementPlan: ImprovementPlan | null,
  is3YearApplied: boolean
): StatusDiagnosis {
  const plan = improvementPlan ? IMPROVEMENT_PLANS.find(p => p.value === improvementPlan) : null;
  
  if (buildingType === "apartment" && is3YearApplied) {
    return {
      currentStatus: "3년 연장 적용 중",
      statusDescription: "부칙 제3조제3항에 따른 3년 연장이 적용 중입니다.",
      improvementPlanLabel: "-",
      mainMessage: "귀하의 현장은 [3년 연장] 상태입니다. 추가 이행연장은 불가하며, 3년 경과 후 정밀안전검사를 받아야 합니다.",
      ctaButtons: [
        { label: "정밀안전검사 일정 확인", action: "check_schedule", description: "3년 연장 종료일 확인" },
        { label: "자체점검 기록 관리", action: "self_inspection", description: "일상점검 및 자체점검 기록" },
        { label: "장기수선계획 검토", action: "long_term_plan", description: "향후 교체/보수 계획 수립" }
      ],
      warnings: [
        "3년 연장 적용 중에는 추가 이행기간 연장이 불가합니다.",
        "3년 경과 전 정밀안전검사 일정을 반드시 확인하세요."
      ],
      requiredDocuments: [],
      obligations: ["서면동의에 따른 의무사항 이행", "일상점검 지속 실시"]
    };
  }

  if (currentStatus === "new") {
    return {
      currentStatus: "1단계 연장 신규 신청",
      statusDescription: "코로나19 일상회복 지원 또는 공사 지연으로 인한 1단계 연장",
      improvementPlanLabel: plan?.label || "-",
      mainMessage: "귀하의 현장은 [1단계 연장 신규 신청] 상태입니다. 연장 조건 충족 시 최초 2개월 + 추가 2개월(총 4개월) 또는 최대 1년 6개월 이내 차기검사 시까지 연장 가능합니다.",
      ctaButtons: [
        { label: "1단계 연장 신청", action: "apply_stage1", description: "연장 신청서 및 서류 제출" },
        { label: "2단계로 전환 검토", action: "review_stage2", description: "2단계 연장 조건 확인" },
        { label: "보완 완료 후 확인검사", action: "confirmation_inspection", description: "시정 완료 시 확인검사 신청" }
      ],
      warnings: [
        "보완기간은 원래의 검사주기를 초과할 수 없습니다.",
        "초과 시 다음 검사 안내문이 발송되지 않으니 시스템을 직접 확인해야 합니다."
      ],
      requiredDocuments: ["보완연장신청서", "이행계획서(관리주체 서명/직인 필수)", "부품 설치 관련 공사계약서"],
      obligations: ["정밀안전검사 관련 부품 추가 설치 공사 진행", "일상점검 기록 유지"]
    };
  }

  if (currentStatus === "stage1") {
    return {
      currentStatus: "1단계 연장 진행 중",
      statusDescription: "코로나19 일상회복 지원 또는 공사 지연으로 인한 1단계 연장",
      improvementPlanLabel: plan?.label || "-",
      mainMessage: "귀하의 현장은 [1단계 연장 진행 중] 상태입니다. 연장 조건 충족 시 최초 2개월 + 추가 2개월(총 4개월) 또는 최대 1년 6개월 이내 차기검사 시까지 연장 가능합니다.",
      ctaButtons: [
        { label: "2단계로 전환 검토", action: "review_stage2", description: "2단계 연장 조건 확인" },
        { label: "보완 완료 후 확인검사", action: "confirmation_inspection", description: "시정 완료 시 확인검사 신청" }
      ],
      warnings: [
        "보완기간은 원래의 검사주기를 초과할 수 없습니다.",
        "초과 시 다음 검사 안내문이 발송되지 않으니 시스템을 직접 확인해야 합니다."
      ],
      requiredDocuments: ["보완연장신청서", "이행계획서(관리주체 서명/직인 필수)", "부품 설치 관련 공사계약서"],
      obligations: ["정밀안전검사 관련 부품 추가 설치 공사 진행", "일상점검 기록 유지"]
    };
  }

  if (currentStatus === "stage2" && plan) {
    return {
      currentStatus: "2단계 연장 진행 중",
      statusDescription: "대상별 적정 제도 이행기간 부여",
      improvementPlanLabel: plan.label,
      mainMessage: `귀하의 현장은 [2단계 이행연장] 상태이며, [${plan.label}] 계획으로 인해 차기 검사 시까지 조건부 상태가 유지됩니다.`,
      ctaButtons: [
        { label: "보완 완료 후 확인검사 신청", action: "confirmation_inspection", description: "시정 완료 시 확인검사 절차 안내" },
        { label: "교체 계획 변경", action: "change_plan", description: "계획 변경 시 필요 서류 안내" },
        { label: "이행기간 추가 연장 신청", action: "extend_period", description: "조건 및 서류 안내" }
      ],
      warnings: [
        "보완기간은 원래의 검사주기를 초과할 수 없습니다.",
        "초과 시 다음 검사 안내문이 발송되지 않으니 시스템을 직접 확인해야 합니다."
      ],
      requiredDocuments: plan.documents,
      obligations: plan.obligations
    };
  }

  return {
    currentStatus: "상태 미정",
    statusDescription: "추가 정보 입력이 필요합니다.",
    improvementPlanLabel: "-",
    mainMessage: "건물 유형과 현재 상태를 선택해주세요.",
    ctaButtons: [],
    warnings: [],
    requiredDocuments: [],
    obligations: []
  };
}
