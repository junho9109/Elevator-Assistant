import { useState, useMemo, useEffect, useCallback } from "react";
import { ChevronDown, ChevronRight, Check, Settings2, Save, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { INSPECTION_DATA_MR, InspectionItem, InspectionSection } from "@/data/inspection-data-mr";

interface CustomItemEdit {
  id: string;
  text?: string;
  effectiveDate?: string;
  expiryDate?: string;
  introductionType?: "new" | "revision";
}

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
  const { toast } = useToast();
  const [equipmentType, setEquipmentType] = useState<EquipmentType>("엘리베이터");
  const [subType, setSubType] = useState<string>("전기식(MR)");
  const [inspectionDate, setInspectionDate] = useState("");
  const [permitDate, setPermitDate] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["1.1", "1.2", "1.3", "1.4", "1.5"]));
  const [results, setResults] = useState<Record<string, ResultType>>({});
  
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  
  const [customEdits, setCustomEdits] = useState<Record<string, CustomItemEdit>>({});
  const [editingItem, setEditingItem] = useState<InspectionItem | null>(null);
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<CustomItemEdit>({ id: "" });

  const handleAdminModeClick = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
      toast({
        title: "관리자 모드 종료",
        description: "관리자 모드가 비활성화되었습니다.",
      });
    } else {
      setIsPasswordDialogOpen(true);
    }
  };

  const handlePasswordSubmit = () => {
    if (adminPassword === "910919") {
      setIsPasswordDialogOpen(false);
      setAdminPassword("");
      setIsAdminMode(true);
      toast({
        title: "관리자 모드 진입",
        description: "관리자 모드가 활성화되었습니다.",
      });
    } else {
      toast({
        title: "비밀번호 오류",
        description: "비밀번호가 올바르지 않습니다.",
        variant: "destructive",
      });
    }
  };

  const handleSaveConfirm = () => {
    const resultCount = Object.keys(results).length;
    const editCount = Object.keys(customEdits).length;
    toast({
      title: "저장 상태 확인",
      description: `현재 ${resultCount}개 항목의 판정 결과와 ${editCount}개 항목의 수정사항이 저장되었습니다.`,
    });
  };

  const handleOpenEditItem = (item: InspectionItem) => {
    if (!isAdminMode) return;
    const existingEdit = customEdits[item.id];
    setEditingItem(item);
    setEditForm({
      id: item.id,
      text: existingEdit?.text ?? item.text,
      effectiveDate: existingEdit?.effectiveDate ?? item.effectiveDate ?? "",
      expiryDate: existingEdit?.expiryDate ?? item.expiryDate ?? "",
      introductionType: existingEdit?.introductionType ?? item.introductionType,
    });
    setIsEditItemDialogOpen(true);
  };

  const handleSaveItemEdit = () => {
    if (!editingItem) return;
    setCustomEdits(prev => ({
      ...prev,
      [editingItem.id]: editForm
    }));
    setIsEditItemDialogOpen(false);
    setEditingItem(null);
    toast({
      title: "항목 수정 완료",
      description: "검사 항목이 수정되었습니다.",
    });
  };

  const getItemWithEdits = (item: InspectionItem): InspectionItem => {
    const edit = customEdits[item.id];
    if (!edit) return item;
    return {
      ...item,
      text: edit.text ?? item.text,
      effectiveDate: edit.effectiveDate || item.effectiveDate,
      expiryDate: edit.expiryDate || item.expiryDate,
      introductionType: edit.introductionType ?? item.introductionType,
    };
  };

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
    
    // expiryDate: 이 날짜 이후에는 더 이상 적용되지 않음 (만료됨)
    if (item.expiryDate) {
      const expiryDate = new Date(item.expiryDate);
      if (referenceDate > expiryDate) return "not-applicable";
    }
    
    // effectiveDate: 이 날짜부터 적용됨
    // referenceDate >= effectiveDate면 검사 대상 (applicable)
    // referenceDate < effectiveDate면:
    //   - "new" 타입: 아직 도입 전이므로 해당없음
    //   - "revision" 타입: 개정 전 기준 적용 (종전)
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
    
    allItems.forEach(originalItem => {
      const item = getItemWithEdits(originalItem);
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
  }, [referenceDate, collectAllItems, customEdits]);

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

  const renderItem = (originalItem: InspectionItem) => {
    const item = getItemWithEdits(originalItem);
    const status = getItemStatus(item);
    const autoResult = getAutoResult(item);
    const hasCustomEdit = !!customEdits[item.id];
    
    return (
      <div 
        key={item.id} 
        className={cn(
          "border-b border-border last:border-b-0",
          hasCustomEdit && "bg-green-50 border-l-4 border-l-green-500"
        )}
      >
        <div className="flex items-start gap-4 p-4">
          <div className="flex items-center justify-center w-6 h-6 mt-1">
            {isAdminMode ? (
              <button
                onClick={() => handleOpenEditItem(item)}
                className="p-1 hover:bg-accent rounded transition-colors"
                data-testid={`edit-item-${item.id}`}
              >
                <Pencil className="w-4 h-4 text-primary" />
              </button>
            ) : (
              <Check className="w-4 h-4 text-primary" />
            )}
          </div>
          <div 
            className={cn(
              "flex-1 text-sm leading-relaxed",
              isAdminMode && "cursor-pointer hover:text-primary"
            )}
            onClick={() => isAdminMode && handleOpenEditItem(item)}
          >
            {item.text}
            {hasCustomEdit && (
              <span className="ml-2 text-xs text-green-600 font-medium">(수정됨)</span>
            )}
          </div>
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
            ※ 이 항목은 건축허가일(검사기준 적용일) 기준으로 이후에 개정되어 해당없음을 적용합니다.
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20">
                E
              </div>
              <h1 className="text-2xl font-bold tracking-tight">판정결과(예시)</h1>
            </div>
            <div className="flex items-center gap-2">
              {isAdminMode && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSaveConfirm}
                  className="shrink-0 shadow-sm hover:shadow-md transition-all"
                  data-testid="button-save-judgment"
                  title="저장 확인"
                >
                  <Save className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant={isAdminMode ? "default" : "outline"}
                size="icon"
                onClick={handleAdminModeClick}
                className={cn(
                  "shrink-0 shadow-sm hover:shadow-md transition-all",
                  isAdminMode && "bg-red-500 hover:bg-red-600"
                )}
                data-testid="button-admin-mode-judgment"
                title={isAdminMode ? "관리자 모드 종료" : "관리자 모드 진입"}
              >
                <Settings2 className="w-4 h-4" />
              </Button>
            </div>
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

      {/* Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle>관리자 모드</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password-judgment">비밀번호 입력</Label>
              <Input
                id="admin-password-judgment"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePasswordSubmit();
                  }
                }}
                data-testid="input-admin-password-judgment"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>취소</Button>
            <Button onClick={handlePasswordSubmit} data-testid="button-submit-password-judgment">확인</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditItemDialogOpen} onOpenChange={setIsEditItemDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>검사 항목 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-item-id">항목 ID</Label>
              <Input
                id="edit-item-id"
                value={editForm.id}
                disabled
                className="bg-muted"
                data-testid="input-edit-item-id"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-item-text">검사 내용</Label>
              <Textarea
                id="edit-item-text"
                value={editForm.text || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, text: e.target.value }))}
                rows={4}
                data-testid="input-edit-item-text"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-item-effective-date">적용일 (시행일)</Label>
                <Input
                  id="edit-item-effective-date"
                  type="date"
                  value={editForm.effectiveDate || ""}
                  onChange={(e) => setEditForm(prev => ({ ...prev, effectiveDate: e.target.value }))}
                  data-testid="input-edit-item-effective-date"
                />
                <p className="text-xs text-muted-foreground">이 날짜 이후에 적용되는 기준</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-item-expiry-date">만료일</Label>
                <Input
                  id="edit-item-expiry-date"
                  type="date"
                  value={editForm.expiryDate || ""}
                  onChange={(e) => setEditForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                  data-testid="input-edit-item-expiry-date"
                />
                <p className="text-xs text-muted-foreground">이 날짜 이후에는 해당없음 처리</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-item-intro-type">도입 유형</Label>
              <Select
                value={editForm.introductionType || ""}
                onValueChange={(value) => setEditForm(prev => ({ 
                  ...prev, 
                  introductionType: value as "new" | "revision" | undefined 
                }))}
              >
                <SelectTrigger id="edit-item-intro-type" data-testid="select-edit-item-intro-type">
                  <SelectValue placeholder="선택 안함" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">신규</SelectItem>
                  <SelectItem value="revision">개정</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            {customEdits[editForm.id] && (
              <Button 
                variant="destructive" 
                onClick={() => {
                  setCustomEdits(prev => {
                    const newEdits = { ...prev };
                    delete newEdits[editForm.id];
                    return newEdits;
                  });
                  setIsEditItemDialogOpen(false);
                  toast({
                    title: "수정 초기화",
                    description: "원본 데이터로 복원되었습니다.",
                  });
                }}
                data-testid="button-reset-item-edit"
              >
                초기화
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsEditItemDialogOpen(false)}>취소</Button>
            <Button onClick={handleSaveItemEdit} data-testid="button-save-item-edit">저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
