export type BuildingType = "apartment" | "general";
export type EquipmentType = "elevator_mr" | "elevator_mrl" | "elevator_hydraulic" | "elevator_inclined" | "escalator" | "dumbwaiter" | "wheelchair_lift";
export type InspectionType = "precision" | "periodic";
export type ExtensionType = "3year" | "1stage" | "none";

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
  lastResult: "pass" | "conditional" | "fail" | null
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
        } else if (lastResult === "conditional") {
          warnings.push(`${option.name}을 신청하려면 직전 검사 결과가 '적합'이어야 합니다. 현재 조건부 적합 상태입니다.`);
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
