import { useState, useMemo, useEffect, useCallback } from "react";
import { ChevronDown, ChevronRight, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface InspectionItem {
  id: string;
  text: string;
  result: "적합" | "부적합" | "시정권고" | "해당없음" | "종전" | null;
  effectiveDate?: string;
  expiryDate?: string;
}

interface InspectionSection {
  id: string;
  title: string;
  items?: InspectionItem[];
  subsections?: InspectionSection[];
}

const INSPECTION_DATA: InspectionSection[] = [
  {
    id: "1.1",
    title: "[1.1] 기본제원",
    subsections: [
      {
        id: "1.1.1",
        title: "[1.1.1] 적용범위",
        items: [
          {
            id: "1.1.1-가",
            text: "가) 정격속도가 0.15 m/s 이하의 엘리베이터는 이 기준을 적용하지 않는다.",
            result: null,
            effectiveDate: "2013-09-15"
          }
        ]
      }
    ]
  },
  {
    id: "1.2",
    title: "[1.2] 기계류 공간",
    subsections: [
      {
        id: "1.2.1",
        title: "[1.2.1] 일반사항",
        subsections: [
          {
            id: "1.2.1.1",
            title: "[1.2.1.1] 접근 및 출입",
            items: [
              {
                id: "1.2.1.1-가",
                text: "가) 승강로, 기계실·기계류 공간 및 풀리실의 접근 통로는 개인적인 공간을 경유하지 않고 항상 접근 가능하여야 한다.",
                result: null,
                effectiveDate: "2013-09-15"
              },
              {
                id: "1.2.1.1-나",
                text: "나) 기계실·기계류 공간 및 풀리실 출입문은 폭 0.6 m 이상, 높이 1.8 m 이상이어야 하며, 밖으로 열리거나 미닫이 문이어야 한다.",
                result: null,
                effectiveDate: "1997-08-18"
              }
            ]
          },
          {
            id: "1.2.1.2",
            title: "[1.2.1.2] 주개폐기",
            items: [
              {
                id: "1.2.1.2-가",
                text: "가) 주 개폐기는 기계실·기계류 공간(해당되는 경우)에 설치되어야 하며 신속하게 접근할 수 있어야 한다.",
                result: null,
                effectiveDate: "2013-09-15"
              },
              {
                id: "1.2.1.2-나",
                text: "나) 주 개폐기는 차단 위치에서 잠금 가능해야 하며, 여러 대의 엘리베이터가 있는 경우 쉽게 식별되어야 한다.",
                result: null,
                effectiveDate: "2019-03-28"
              }
            ]
          },
          {
            id: "1.2.1.3",
            title: "[1.2.1.3] 양중 지지대",
            items: [
              {
                id: "1.2.1.3-가",
                text: "가) 무거운 설비를 편리한 위치에서 양중할 수 있는 금속 지지대 또는 고리가 기계실 천장에 1개 이상 설치되어야 한다.",
                result: null,
                effectiveDate: "1997-08-18"
              },
              {
                id: "1.2.1.3-나",
                text: "나) 금속 지지대 또는 고리에는 안전한 양중을 위해 허용 하중이 표시되어야 한다.",
                result: null,
                effectiveDate: "2013-09-15"
              }
            ]
          }
        ]
      },
      {
        id: "1.2.2",
        title: "[1.2.2] 기계실 없는 엘리베이터(MRL)",
        items: [
          {
            id: "1.2.2-가",
            text: "가) 기계실이 없는 엘리베이터는 2005년 12월 1일 이후 건축허가분부터 적용한다.",
            result: null,
            effectiveDate: "2005-12-01"
          }
        ]
      }
    ]
  },
  {
    id: "1.3",
    title: "[1.3] 승강로",
    subsections: [
      {
        id: "1.3.1",
        title: "[1.3.1] 구조",
        items: [
          {
            id: "1.3.1-가",
            text: "가) 승강로의 벽 또는 울 및 출입문은 불연재료 또는 내화구조로 만들거나 씌워야 한다.",
            result: null,
            effectiveDate: "2009-11-24"
          },
          {
            id: "1.3.1-나",
            text: "나) 승강로 구조는 건축 관련 법령에 적합하여야 하고, 추락방지안전장치 작동 순간의 주행안내 레일 하중을 지지할 수 있어야 한다.",
            result: null,
            effectiveDate: "2013-09-15"
          }
        ]
      },
      {
        id: "1.3.2",
        title: "[1.3.2] 비상통화장치",
        items: [
          {
            id: "1.3.2-가",
            text: "가) 승강로에서 작업하는 사람이 갇히게 되는 경우를 대비하여 비상통화장치가 설치되어야 한다.",
            result: null,
            effectiveDate: "2013-09-15"
          }
        ]
      },
      {
        id: "1.3.3",
        title: "[1.3.3] 조명",
        items: [
          {
            id: "1.3.3-가",
            text: "가) 승강로 내에는 카의 최상층 및 최하층 위치에서 측정하여 바닥면에서 1 m 위의 조도가 50 럭스 이상인 고정된 전기 조명이 설치되어야 한다.",
            result: null,
            effectiveDate: "2015-05-13"
          },
          {
            id: "1.3.3-나",
            text: "나) 승강로 내에는 조명 조절용 스위치가 설치되어야 한다.",
            result: null,
            effectiveDate: "1997-08-18"
          }
        ]
      }
    ]
  },
  {
    id: "1.4",
    title: "[1.4] 카",
    subsections: [
      {
        id: "1.4.1",
        title: "[1.4.1] 문열림출발 방지",
        items: [
          {
            id: "1.4.1-가",
            text: "가) 문열림출발(UCMP) 방지를 위한 장치가 설치되어야 한다.",
            result: null,
            effectiveDate: "2019-03-28"
          }
        ]
      },
      {
        id: "1.4.2",
        title: "[1.4.2] 카 비상통화장치",
        items: [
          {
            id: "1.4.2-가",
            text: "가) 카 내부에는 비상시 외부와 양방향 통화가 가능한 장치가 설치되어야 한다.",
            result: null,
            effectiveDate: "1997-08-18"
          },
          {
            id: "1.4.2-나",
            text: "나) 비상통화장치는 자동 다이얼 기능을 갖추어야 하며, 24시간 운영되는 구조대와 연결되어야 한다.",
            result: null,
            effectiveDate: "2013-09-15"
          }
        ]
      },
      {
        id: "1.4.3",
        title: "[1.4.3] 조명",
        items: [
          {
            id: "1.4.3-가",
            text: "가) 카 내부 바닥에서의 조명은 100 럭스 이상이어야 한다.",
            result: null,
            effectiveDate: "2013-09-15"
          },
          {
            id: "1.4.3-나",
            text: "나) 카 내 조명은 50 럭스 이상이어야 한다. (2013년 9월 15일 이전 건축허가분)",
            result: null,
            effectiveDate: "1997-08-18",
            expiryDate: "2013-09-14"
          }
        ]
      }
    ]
  },
  {
    id: "1.5",
    title: "[1.5] 피트",
    subsections: [
      {
        id: "1.5.1",
        title: "[1.5.1] 구조",
        items: [
          {
            id: "1.5.1-가",
            text: "가) 피트 바닥은 거의 수평이어야 하고 충분히 매끄러워야 한다.",
            result: null,
            effectiveDate: "2013-09-15"
          },
          {
            id: "1.5.1-나",
            text: "나) 피트 깊이가 1.6 m를 초과하는 경우 피트 출입문이 설치되어야 한다.",
            result: null,
            effectiveDate: "1997-08-18"
          },
          {
            id: "1.5.1-다",
            text: "다) 피트에는 정지스위치 및 전원콘센트가 설치되어야 한다.",
            result: null,
            effectiveDate: "1995-06-07"
          }
        ]
      },
      {
        id: "1.5.2",
        title: "[1.5.2] 피트 사다리",
        items: [
          {
            id: "1.5.2-가",
            text: "가) 피트 깊이가 0.5 m를 초과하고 피트 출입문이 없는 경우 피트 사다리가 설치되어야 한다.",
            result: null,
            effectiveDate: "2013-09-15"
          },
          {
            id: "1.5.2-나",
            text: "나) 피트 사다리는 부속서 Ⅶ에 따라 설치되어야 한다.",
            result: null,
            effectiveDate: "2022-03-02"
          }
        ]
      }
    ]
  }
];

type ResultType = "적합" | "부적합" | "시정권고" | "해당없음" | "종전";

type EquipmentType = "엘리베이터" | "에스컬레이터" | "덤웨이터" | "휠체어리프트";
type ElevatorSubType = "전기식(MR)" | "전기식(MRL)" | "유압식" | "경사형";
type EscalatorSubType = "에스컬레이터" | "무빙워크";
type WheelchairLiftSubType = "수직형" | "경사형";

const EQUIPMENT_SUBTYPES: Record<EquipmentType, string[]> = {
  "엘리베이터": ["전기식(MR)", "전기식(MRL)", "유압식", "경사형"],
  "에스컬레이터": ["에스컬레이터", "무빙워크"],
  "덤웨이터": [],
  "휠체어리프트": ["수직형", "경사형"]
};

export default function JudgmentPage() {
  const [equipmentType, setEquipmentType] = useState<EquipmentType>("엘리베이터");
  const [subType, setSubType] = useState<string>("전기식(MR)");
  const [inspectionDate, setInspectionDate] = useState("");
  const [permitDate, setPermitDate] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["1.1", "1.1.1", "1.2", "1.2.1", "1.2.1.1", "1.2.1.2", "1.2.1.3", "1.2.2", "1.3", "1.3.1", "1.3.2", "1.3.3", "1.4", "1.4.1", "1.4.2", "1.4.3", "1.5", "1.5.1", "1.5.2"]));
  const [results, setResults] = useState<Record<string, ResultType>>({});

  const handleEquipmentTypeChange = (type: EquipmentType) => {
    setEquipmentType(type);
    const subtypes = EQUIPMENT_SUBTYPES[type];
    if (subtypes.length > 0) {
      setSubType(subtypes[0]);
    } else {
      setSubType("");
    }
  };

  const referenceDate = useMemo(() => {
    if (permitDate && inspectionDate) {
      const permit = new Date(permitDate);
      const inspection = new Date(inspectionDate);
      return permit < inspection ? permit : inspection;
    }
    if (permitDate) return new Date(permitDate);
    if (inspectionDate) return new Date(inspectionDate);
    return null;
  }, [inspectionDate, permitDate]);

  const getItemStatus = (item: InspectionItem): "applicable" | "previous" | "not-applicable" => {
    if (!referenceDate) return "applicable";
    
    if (item.expiryDate) {
      const expiryDate = new Date(item.expiryDate);
      if (referenceDate <= expiryDate) return "not-applicable";
    }
    
    if (item.effectiveDate) {
      const effectiveDate = new Date(item.effectiveDate);
      if (referenceDate < effectiveDate) return "previous";
    }
    
    return "applicable";
  };

  const getAutoResult = (item: InspectionItem): ResultType | null => {
    const status = getItemStatus(item);
    if (status === "previous") return "종전";
    if (status === "not-applicable") return "해당없음";
    return null;
  };

  const collectAllItems = useCallback((sections: InspectionSection[]): InspectionItem[] => {
    const items: InspectionItem[] = [];
    const processSection = (section: InspectionSection) => {
      if (section.items) {
        items.push(...section.items);
      }
      if (section.subsections) {
        section.subsections.forEach(processSection);
      }
    };
    sections.forEach(processSection);
    return items;
  }, []);

  useEffect(() => {
    if (!referenceDate) return;
    
    const allItems = collectAllItems(INSPECTION_DATA);
    const newResults: Record<string, ResultType> = {};
    let hasChanges = false;
    
    allItems.forEach(item => {
      const autoResult = getAutoResult(item);
      if (autoResult) {
        if (results[item.id] !== autoResult) {
          newResults[item.id] = autoResult;
          hasChanges = true;
        } else {
          newResults[item.id] = results[item.id];
        }
      } else if (results[item.id]) {
        newResults[item.id] = results[item.id];
      }
    });
    
    if (hasChanges) {
      setResults(newResults);
    }
  }, [referenceDate, collectAllItems]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const setResult = (itemId: string, result: ResultType) => {
    setResults(prev => ({
      ...prev,
      [itemId]: result
    }));
  };

  const renderResultButton = (itemId: string, resultType: ResultType, status: "applicable" | "previous" | "not-applicable", autoResult: ResultType | null) => {
    const isSelected = results[itemId] === resultType;
    const isAutoSelected = autoResult === resultType && !results[itemId];
    const isDisabled = (status === "previous" && resultType !== "종전") || 
                       (status === "not-applicable" && resultType !== "해당없음");
    
    const baseClasses = "px-2 py-1 text-xs rounded border transition-all min-w-[40px]";
    
    if (isSelected || isAutoSelected) {
      return (
        <button
          className={cn(
            baseClasses, 
            isAutoSelected 
              ? "bg-amber-500 text-white border-amber-500 ring-2 ring-amber-300" 
              : "bg-primary text-primary-foreground border-primary"
          )}
          onClick={() => setResult(itemId, resultType)}
          data-testid={`result-${itemId}-${resultType}`}
        >
          {resultType}
        </button>
      );
    }
    
    return (
      <button
        className={cn(
          baseClasses,
          isDisabled 
            ? "bg-muted text-muted-foreground border-muted cursor-not-allowed opacity-50" 
            : "bg-background hover:bg-accent border-border"
        )}
        onClick={() => !isDisabled && setResult(itemId, resultType)}
        disabled={isDisabled}
        data-testid={`result-${itemId}-${resultType}`}
      >
        {resultType}
      </button>
    );
  };

  const renderItem = (item: InspectionItem) => {
    const status = getItemStatus(item);
    const autoResult = getAutoResult(item);
    
    return (
      <div key={item.id} className="border-b border-border last:border-b-0">
        <div className="flex items-start gap-4 p-4">
          <div className="flex items-center justify-center w-6 h-6 mt-1">
            <Check className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 text-sm leading-relaxed">{item.text}</div>
          <div className="flex gap-1 shrink-0">
            {renderResultButton(item.id, "적합", status, autoResult)}
            {renderResultButton(item.id, "부적합", status, autoResult)}
            {renderResultButton(item.id, "시정권고", status, autoResult)}
            {renderResultButton(item.id, "해당없음", status, autoResult)}
            {renderResultButton(item.id, "종전", status, autoResult)}
          </div>
        </div>
        {status === "previous" && referenceDate && (
          <div className="px-4 pb-2 text-xs text-amber-600 ml-10">
            ※ 이 항목은 {item.effectiveDate} 이후 적용되는 기준입니다. 입력하신 날짜({referenceDate.toISOString().split('T')[0]}) 기준으로 「종전」 기준이 자동 적용됩니다.
          </div>
        )}
        {status === "not-applicable" && referenceDate && (
          <div className="px-4 pb-2 text-xs text-gray-600 ml-10">
            ※ 이 항목은 입력하신 날짜({referenceDate.toISOString().split('T')[0]}) 기준으로 「해당없음」이 자동 적용됩니다.
          </div>
        )}
      </div>
    );
  };

  const renderSection = (section: InspectionSection, depth: number = 0) => {
    const isExpanded = expandedSections.has(section.id);
    const hasContent = (section.items && section.items.length > 0) || 
                       (section.subsections && section.subsections.length > 0);
    
    return (
      <div key={section.id} className={cn("border-b border-border", depth === 0 && "bg-slate-50")}>
        <button
          className={cn(
            "w-full flex items-center gap-2 p-3 text-left hover:bg-accent/50 transition-colors",
            depth === 0 && "font-semibold text-primary",
            depth === 1 && "pl-6 text-sm text-muted-foreground",
            depth === 2 && "pl-10 text-sm text-blue-600"
          )}
          onClick={() => hasContent && toggleSection(section.id)}
          data-testid={`section-${section.id}`}
        >
          {hasContent ? (
            isExpanded ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />
          ) : (
            <div className="w-4 h-4 shrink-0" />
          )}
          <span>{section.title}</span>
        </button>
        
        {isExpanded && (
          <div className={cn(depth > 0 && "bg-background")}>
            {section.subsections?.map(sub => renderSection(sub, depth + 1))}
            {section.items?.map(item => renderItem(item))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans text-foreground">
      <div className="mx-auto max-w-5xl bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border bg-slate-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20">
              E
            </div>
            <h1 className="text-2xl font-bold tracking-tight">판정결과(예시)</h1>
          </div>
          <p className="text-muted-foreground text-sm mb-6">
            승강기 종류를 선택하고 건축허가일자 또는 검사기준 적용일을 입력하면 해당 기준의 적용 여부를 확인할 수 있습니다.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label>승강기 종류</Label>
              <Select 
                value={equipmentType} 
                onValueChange={(value) => handleEquipmentTypeChange(value as EquipmentType)}
              >
                <SelectTrigger data-testid="select-equipment-type">
                  <SelectValue placeholder="승강기 종류 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="엘리베이터">엘리베이터</SelectItem>
                  <SelectItem value="에스컬레이터">에스컬레이터</SelectItem>
                  <SelectItem value="덤웨이터">덤웨이터</SelectItem>
                  <SelectItem value="휠체어리프트">휠체어리프트</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {EQUIPMENT_SUBTYPES[equipmentType].length > 0 && (
              <div className="space-y-2">
                <Label>세부 종류</Label>
                <Select value={subType} onValueChange={setSubType}>
                  <SelectTrigger data-testid="select-sub-type">
                    <SelectValue placeholder="세부 종류 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {EQUIPMENT_SUBTYPES[equipmentType].map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="permitDate">건축허가일자</Label>
              <Input
                id="permitDate"
                type="date"
                value={permitDate}
                onChange={(e) => setPermitDate(e.target.value)}
                data-testid="input-permit-date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inspectionDate">검사기준 적용일</Label>
              <Input
                id="inspectionDate"
                type="date"
                value={inspectionDate}
                onChange={(e) => setInspectionDate(e.target.value)}
                data-testid="input-inspection-date"
              />
            </div>
          </div>
          
          {(permitDate || inspectionDate) && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-800 space-y-1">
                {permitDate && (
                  <p>건축허가일: <strong>{permitDate}</strong></p>
                )}
                {inspectionDate && (
                  <p>검사기준 적용일: <strong>{inspectionDate}</strong></p>
                )}
                <p className="text-xs text-blue-600 mt-2">
                  {permitDate && inspectionDate 
                    ? "두 날짜 중 더 이른 날짜를 기준으로 적용 여부가 판정됩니다."
                    : "이 날짜를 기준으로 검사기준 적용 여부가 표시됩니다."}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-hidden">
          <div className="bg-slate-100 border-b border-border">
            <div className="flex items-center">
              <div className="flex-1 p-3 font-semibold text-center border-r border-border">검사기준</div>
              <div className="w-12 p-3 text-xs font-semibold text-center border-r border-border">적합</div>
              <div className="w-12 p-3 text-xs font-semibold text-center border-r border-border">부적합</div>
              <div className="w-12 p-3 text-xs font-semibold text-center border-r border-border">시정<br/>권고</div>
              <div className="w-12 p-3 text-xs font-semibold text-center border-r border-border">해당<br/>없음</div>
              <div className="w-12 p-3 text-xs font-semibold text-center">종전</div>
            </div>
          </div>
          
          <div className="max-h-[600px] overflow-y-auto">
            {INSPECTION_DATA.map(section => renderSection(section))}
          </div>
        </div>
      </div>
    </div>
  );
}
