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
import { INSPECTION_DATA_MR, InspectionItem, InspectionSection } from "@/data/inspection-data-mr";

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
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["1.1", "1.2", "1.3", "1.4", "1.5"]));
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
      if (referenceDate < effectiveDate) {
        if (item.introductionType === "new") {
          return "not-applicable";
        }
        return "previous";
      }
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

  const collectAllSectionIds = useCallback((sections: InspectionSection[]): string[] => {
    const ids: string[] = [];
    const processSection = (section: InspectionSection) => {
      ids.push(section.id);
      if (section.subsections) {
        section.subsections.forEach(processSection);
      }
    };
    sections.forEach(processSection);
    return ids;
  }, []);

  const expandAll = () => {
    const allIds = collectAllSectionIds(INSPECTION_DATA_MR);
    setExpandedSections(new Set(allIds));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  useEffect(() => {
    if (!referenceDate) return;
    
    const allItems = collectAllItems(INSPECTION_DATA_MR);
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
          <div className="flex items-center justify-end gap-2 p-2 bg-slate-50 border-b border-border">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={expandAll}
              data-testid="button-expand-all"
            >
              전체 펼치기
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={collapseAll}
              data-testid="button-collapse-all"
            >
              전체 접기
            </Button>
          </div>
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
            {INSPECTION_DATA_MR.map(section => renderSection(section))}
          </div>
        </div>
      </div>
    </div>
  );
}
