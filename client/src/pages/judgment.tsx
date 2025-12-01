import { useState, useMemo, useEffect, useCallback } from "react";
import { ChevronDown, ChevronRight, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
    subsections: []
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
            title: "[1.2.1.1] 주개폐기",
            items: [
              {
                id: "1.2.1.1-가",
                text: "가) 주 개폐기 차단 시「엘리베이터 안전기준」14.5.5에 따라 엘리베이터의 움직임이 방지되는지 확인한다.",
                result: null,
                effectiveDate: "2017-01-01"
              },
              {
                id: "1.2.1.1-나",
                text: "나) 주 개폐기에 「엘리베이터 안전기준」14.5.2에 따라 신속하게 접근 할 수 있고, 여러 대의 엘리베이터가 있는 경우 쉽게 식별되는지 확인한다.",
                result: null,
                effectiveDate: "2019-01-01"
              }
            ]
          },
          {
            id: "1.2.1.2",
            title: "[1.2.1.2] 접근",
            items: [
              {
                id: "1.2.1.2-가",
                text: "가) 기계류 공간의 접근/출입수단(계단, 사다리, 피트 출입문)이 「엘리베이터 안전기준」6.2.4 및 6.2.5에 따라 안전하게 접근 및 출입할 수 있는지 확인한다.",
                result: null,
                effectiveDate: "2015-01-01"
              },
              {
                id: "1.2.1.2-나",
                text: "나) 승강로, 기계실·기계류 공간, 풀리실 및 관련 작업 구역의 접근통로가 「엘리베이터 안전기준」6.2.1 및 6.2.3에 따라 개인적인 공간을 경유하지 않고 접근 가능한지 확인한다. (주택용 엘리베이터 제외 : 지침서 제공)",
                result: null,
                effectiveDate: "2018-06-01"
              },
              {
                id: "1.2.1.2-다",
                text: "다) 기계류 공간 접근 시 안전장치 설치 여부를 확인한다. (2020년 이전 설치 엘리베이터는 해당없음)",
                result: null,
                effectiveDate: "2020-01-01",
                expiryDate: "2019-12-31"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "1.3",
    title: "[1.3] 승강로",
    subsections: []
  },
  {
    id: "1.4",
    title: "[1.4] 카",
    subsections: []
  },
  {
    id: "1.5",
    title: "[1.5] 피트",
    subsections: []
  }
];

type ResultType = "적합" | "부적합" | "시정권고" | "해당없음" | "종전";

export default function JudgmentPage() {
  const [inspectionDate, setInspectionDate] = useState("");
  const [permitDate, setPermitDate] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["1.2", "1.2.1", "1.2.1.1", "1.2.1.2"]));
  const [results, setResults] = useState<Record<string, ResultType>>({});

  const referenceDate = useMemo(() => {
    if (inspectionDate) return new Date(inspectionDate);
    if (permitDate) return new Date(permitDate);
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
            검사기준 적용일 또는 건축허가일자를 입력하면 해당 기준의 적용 여부를 확인할 수 있습니다.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inspectionDate">검사기준 적용일</Label>
              <Input
                id="inspectionDate"
                type="date"
                value={inspectionDate}
                onChange={(e) => {
                  setInspectionDate(e.target.value);
                  setPermitDate("");
                }}
                data-testid="input-inspection-date"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permitDate">건축허가일자</Label>
              <Input
                id="permitDate"
                type="date"
                value={permitDate}
                onChange={(e) => {
                  setPermitDate(e.target.value);
                  setInspectionDate("");
                }}
                data-testid="input-permit-date"
              />
            </div>
          </div>
          
          {referenceDate && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                기준일: <strong>{referenceDate.toISOString().split('T')[0]}</strong> - 
                이 날짜를 기준으로 검사기준 적용 여부가 표시됩니다.
              </p>
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
