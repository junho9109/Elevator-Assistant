export type BuildingType = "apartment" | "general";
export type EquipmentType = "elevator_mr" | "elevator_mrl" | "elevator_hydraulic" | "elevator_inclined" | "escalator" | "dumbwaiter" | "wheelchair_lift";
export type InspectionType = "precision" | "periodic";
export type ExtensionType = "3year" | "1stage" | "none";
export type InspectionResult = "pass" | "conditional_next" | "conditional_12" | "fail";

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
  { value: "3year_applied", label: "3년 연장 신청 (서면동의서 제출)", description: "검사규정 부칙 제3조제3항에 따라 서면동의서를 제출하여 3년 연장 적용" },
  { value: "none", label: "이행연장 (1단계) 신청", description: "서면동의서 미제출, 검사규정 제13조제3항제2호에 따른 이행기간 연장" },
  { value: "stage1", label: "1단계 진행 중", description: "1단계 이행기간 연장 중 (최대 1년 6개월)" },
  { value: "stage2", label: "2단계 진행 중", description: "1단계 완료 후 추가 연장 진행 중" }
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
  { value: "apartment", label: "공동주택(아파트)", description: "주택법에 따른 공동주택" },
  { value: "general", label: "일반건축물", description: "상업/업무/기타 건축물" }
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
    recommendations.push("공동주택은 장기수선계획에 승강기 교체/보수 비용을 반영하세요.");
  }

  return {
    eligibleExtensions,
    requiredInspections,
    warnings,
    recommendations,
    nextSteps
  };
}
