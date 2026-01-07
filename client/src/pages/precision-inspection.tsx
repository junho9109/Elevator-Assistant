import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle, FileText, Calendar, Building, Cog, ChevronRight, ChevronLeft, Info, Layers } from "lucide-react";
import {
  BUILDING_TYPES,
  EQUIPMENT_TYPES,
  INSPECTION_RESULTS,
  EXTENSION_STAGES_APARTMENT,
  EXTENSION_STAGES_GENERAL,
  EXTENSION_STAGES,
  EXTENSION_REASONS,
  BuildingType,
  EquipmentType,
  InspectionResult,
  ExtensionStage,
  ExtensionReason,
  evaluateWorkflow,
  WorkflowResult
} from "@/data/inspection-workflow";

interface FormState {
  buildingType: BuildingType | null;
  equipmentType: EquipmentType | null;
  installDate: string;
  lastPrecisionDate: string;
  lastPeriodicDate: string;
  lastResult: InspectionResult | null;
  extensionStage: ExtensionStage | null;
  extensionReason: ExtensionReason | null;
}

const INITIAL_STATE: FormState = {
  buildingType: null,
  equipmentType: null,
  installDate: "",
  lastPrecisionDate: "",
  lastPeriodicDate: "",
  lastResult: null,
  extensionStage: null,
  extensionReason: null
};

export default function PrecisionInspectionPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);

  const result = useMemo<WorkflowResult | null>(() => {
    if (!form.buildingType || !form.equipmentType || !form.installDate) {
      return null;
    }
    const installDate = new Date(form.installDate);
    const lastPrecisionDate = form.lastPrecisionDate ? new Date(form.lastPrecisionDate) : null;
    const lastPeriodicDate = form.lastPeriodicDate ? new Date(form.lastPeriodicDate) : null;
    return evaluateWorkflow(
      form.buildingType,
      form.equipmentType,
      installDate,
      lastPrecisionDate,
      lastPeriodicDate,
      form.lastResult
    );
  }, [form]);

  const availableStages = useMemo(() => {
    if (!form.buildingType) return [];
    if (form.buildingType === "apartment") return EXTENSION_STAGES_APARTMENT;
    return EXTENSION_STAGES_GENERAL;
  }, [form.buildingType]);

  const availableReasons = useMemo(() => {
    if (!form.extensionStage) return [];
    return EXTENSION_REASONS.filter(r => r.stages.includes(form.extensionStage!));
  }, [form.extensionStage]);

  const selectedReason = useMemo(() => {
    return EXTENSION_REASONS.find(r => r.value === form.extensionReason);
  }, [form.extensionReason]);

  const canProceedStep1 = form.buildingType && form.equipmentType && form.installDate;
  const canProceedStep2 = canProceedStep1 && (form.lastPrecisionDate || form.lastPeriodicDate);
  const canProceedStep3 = canProceedStep2 && form.extensionStage !== null;

  const handleReset = () => {
    setForm(INITIAL_STATE);
    setStep(1);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
  };

  const getGuidanceForApartment = () => {
    if (form.buildingType !== "apartment") return null;
    
    const guidance = {
      title: "공동주택 3년 연장 안내",
      stages: [
        { name: "1단계", period: "최대 1년 6개월", description: "세 번째 정밀안전검사 후 최대 1년 6개월 이내 도래하는 안전검사 또는 확인검사 시까지 연장" },
        { name: "2단계", period: "추가 6개월~1년", description: "1단계 적용 완료된 승강기에 대하여 이행기간 추가 연장 가능" }
      ],
      note: "공동주택(집합건축물)에 따라 서면동의서를 제출한 경우, 3년을 연장했기 때문에 추가 연장은 적용할 수 없음"
    };
    return guidance;
  };

  const getGuidanceForGeneral = () => {
    if (form.buildingType !== "general") return null;
    
    return {
      title: "일반건축물 이행기간 연장 안내",
      stages: [
        { 
          name: "1단계", 
          period: "최대 2개월", 
          description: "조건부합격 이행기간 연장 (보완연장신청서, 이행계획서 제출)",
          details: [
            "정밀관련 부품 추가설치 사항에 한정",
            "최초 검사 시 조건부합격 2개월 부여"
          ]
        },
        { 
          name: "2단계", 
          period: "6개월~1년", 
          description: "대상별 여건에 따른 적정 제도 이행기간 부여",
          details: [
            "ⓐ 전체교체 예정: 최대 1년",
            "ⓑ 부분교체 예정: 6개월 + 추가 6개월",
            "ⓒ 재개발·재건축 철거 예정: 최대 1년",
            "ⓓ 국민 이동편의보장 필요: 최대 1년",
            "ⓔ 공단 이사장 판단: 개별 협의"
          ]
        }
      ],
      warnings: [
        "1단계 종료 전 2단계에 필요한 관련 서류를 제출토록 사전안내",
        "다음 연장사유 ①~⑤중 중복하여 연장 불가, 중도 사유변경도 불가"
      ]
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b px-4 py-3 sticky top-0 z-10">
        <h1 className="text-lg font-bold text-center">정밀안전검사 업무처리</h1>
        <div className="flex justify-center gap-1.5 mt-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                step === s
                  ? "bg-blue-600 text-white"
                  : step > s
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
              data-testid={`step-indicator-${s}`}
            >
              {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-1 text-[10px] text-gray-500">
          <span>기본정보</span>
          <span>검사이력</span>
          <span>연장단계</span>
          <span>결과</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building className="w-5 h-5" />
                기본 정보 입력
              </CardTitle>
              <CardDescription>건축물 유형과 승강기 정보를 선택하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="buildingType">건축물 유형</Label>
                <Select
                  value={form.buildingType || ""}
                  onValueChange={(v) => setForm({ ...form, buildingType: v as BuildingType, extensionStage: null, extensionReason: null })}
                >
                  <SelectTrigger id="buildingType" data-testid="select-building-type">
                    <SelectValue placeholder="건축물 유형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUILDING_TYPES.map((bt) => (
                      <SelectItem key={bt.value} value={bt.value}>
                        {bt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.buildingType === "apartment" && (
                  <Alert className="mt-2 bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800 text-sm">공동주택(아파트) 선택됨</AlertTitle>
                    <AlertDescription className="text-blue-700 text-xs">
                      <p>검사규정 부칙 제3조제3항에 따른 3년 연장 적용</p>
                      <p className="mt-1">• 서면동의서 제출 시 3년간 검사 유예</p>
                      <p className="text-[10px] mt-1 text-blue-600">※ 공동주택은 1단계/2단계 이행연장 적용 불가</p>
                    </AlertDescription>
                  </Alert>
                )}
                {form.buildingType === "general" && (
                  <Alert className="mt-2 bg-amber-50 border-amber-200">
                    <Info className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800 text-sm">일반건축물 선택됨</AlertTitle>
                    <AlertDescription className="text-amber-700 text-xs">
                      <p>검사규정 부칙 제2조제4항 (세부적용방안)</p>
                      <p className="mt-1">• 1단계: 조건부합격 2개월 부여</p>
                      <p>• 2단계: 대상별 여건에 따라 6개월~1년</p>
                      <p className="text-[10px] mt-1 text-amber-600">※ 건축물 대수선이 불가피한 경우에 한함</p>
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipmentType">승강기 종류</Label>
                <Select
                  value={form.equipmentType || ""}
                  onValueChange={(v) => setForm({ ...form, equipmentType: v as EquipmentType })}
                >
                  <SelectTrigger id="equipmentType" data-testid="select-equipment-type">
                    <SelectValue placeholder="승강기 종류 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {EQUIPMENT_TYPES.map((et) => (
                      <SelectItem key={et.value} value={et.value}>
                        {et.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="installDate">설치완료일 (완성검사일)</Label>
                <Input
                  id="installDate"
                  type="date"
                  value={form.installDate}
                  onChange={(e) => setForm({ ...form, installDate: e.target.value })}
                  data-testid="input-install-date"
                />
              </div>

              <Button
                className="w-full"
                disabled={!canProceedStep1}
                onClick={() => setStep(2)}
                data-testid="button-next-step1"
              >
                다음 단계 <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                검사 이력 입력
              </CardTitle>
              <CardDescription>최근 검사 일자와 결과를 입력하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lastPrecisionDate">최근 정밀안전검사일</Label>
                <Input
                  id="lastPrecisionDate"
                  type="date"
                  value={form.lastPrecisionDate}
                  onChange={(e) => setForm({ ...form, lastPrecisionDate: e.target.value })}
                  data-testid="input-precision-date"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastPeriodicDate">최근 정기검사일</Label>
                <Input
                  id="lastPeriodicDate"
                  type="date"
                  value={form.lastPeriodicDate}
                  onChange={(e) => setForm({ ...form, lastPeriodicDate: e.target.value })}
                  data-testid="input-periodic-date"
                />
              </div>

              <div className="space-y-2">
                <Label>직전 검사 결과</Label>
                <div className="grid grid-cols-2 gap-2">
                  {INSPECTION_RESULTS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setForm({ ...form, lastResult: opt.value })}
                      className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        form.lastResult === opt.value
                          ? opt.color + " border-current"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}
                      data-testid={`button-result-${opt.value}`}
                    >
                      <div className="font-medium">{opt.shortLabel}</div>
                      <div className="text-xs opacity-70 mt-0.5">{opt.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {form.lastResult && form.buildingType === "apartment" && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800 text-sm">공동주택 검사결과별 안내</AlertTitle>
                  <AlertDescription className="text-blue-700 text-xs">
                    {form.lastResult === "pass" && (
                      <p>합격 판정으로 정상 운행 가능합니다. 3년 연장 조건 충족 시 신청 가능합니다.</p>
                    )}
                    {form.lastResult === "conditional_next" && (
                      <p>차기안전검사 시까지 조건부 항목 이행 필요. 확인검사 불필요, 차기 안전검사 시 조건부항목 확인하여 판정합니다.</p>
                    )}
                    {form.lastResult === "conditional_12" && (
                      <p>12개월 이내 시정 후 확인검사 필요. 보완기간 연장 또는 차기안전검사 판정을 통해 이행기간 연장 가능합니다.</p>
                    )}
                    {form.lastResult === "fail" && (
                      <p>불합격으로 즉시 시정 조치 후 재검사가 필요합니다.</p>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {form.lastResult && form.buildingType === "general" && (
                <Alert className="bg-amber-50 border-amber-200">
                  <Info className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800 text-sm">일반건축물 검사결과별 안내</AlertTitle>
                  <AlertDescription className="text-amber-700 text-xs">
                    {form.lastResult === "pass" && (
                      <p>합격 판정으로 정상 운행 가능합니다.</p>
                    )}
                    {form.lastResult === "conditional_next" && (
                      <p>차기안전검사 시까지 조건부 항목 이행 필요. 확인검사 불필요합니다.</p>
                    )}
                    {form.lastResult === "conditional_12" && (
                      <div>
                        <p>12개월 이내 시정 후 확인검사 필요.</p>
                        <p className="mt-1">• 1단계: 최초 2개월 조건부 부여 후 추가 2개월 연장 가능</p>
                        <p>• 2단계: 대상별 여건에 따라 6개월~1년 추가 연장</p>
                      </div>
                    )}
                    {form.lastResult === "fail" && (
                      <p>불합격으로 즉시 시정 조치 후 재검사가 필요합니다.</p>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1" data-testid="button-prev-step2">
                  <ChevronLeft className="w-4 h-4 mr-1" /> 이전
                </Button>
                <Button
                  className="flex-1"
                  disabled={!canProceedStep2}
                  onClick={() => setStep(3)}
                  data-testid="button-next-step2"
                >
                  다음 <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="w-5 h-5" />
                {form.buildingType === "apartment" ? "연장 경로 선택" : "연장 단계 선택"}
              </CardTitle>
              <CardDescription>
                {form.buildingType === "apartment" 
                  ? "서면동의서 제출 여부에 따라 연장 경로를 선택하세요"
                  : "현재 이행기간 연장 진행 단계를 선택하세요"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.buildingType === "apartment" && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800 text-sm">공동주택 3년 연장</AlertTitle>
                  <AlertDescription className="text-blue-700 text-xs mt-2">
                    <p>공동주택은 검사규정 부칙 제3조제3항에 따라 서면동의서 제출 시 3년간 검사가 유예됩니다.</p>
                    <p className="mt-1 text-[10px] text-blue-600">※ 1단계/2단계 이행연장은 일반건축물에만 적용</p>
                  </AlertDescription>
                </Alert>
              )}

              {form.buildingType === "general" && getGuidanceForGeneral() && (
                <Alert className="bg-amber-50 border-amber-200">
                  <Info className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800">{getGuidanceForGeneral()?.title}</AlertTitle>
                  <AlertDescription className="text-amber-700 text-xs mt-2">
                    <div className="space-y-2">
                      {getGuidanceForGeneral()?.stages.map((s, i) => (
                        <div key={i}>
                          <strong>{s.name}</strong> ({s.period}): {s.description}
                        </div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label>현재 연장 단계</Label>
                <div className="space-y-2">
                  {availableStages.map((stage) => (
                    <button
                      key={stage.value}
                      onClick={() => setForm({ ...form, extensionStage: stage.value, extensionReason: null })}
                      className={`w-full text-left py-3 px-4 rounded-lg border-2 transition-all ${
                        form.extensionStage === stage.value
                          ? "bg-blue-50 border-blue-500 text-blue-800"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                      data-testid={`button-stage-${stage.value}`}
                    >
                      <div className="font-medium">{stage.label}</div>
                      <div className="text-xs opacity-70 mt-0.5">{stage.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {form.extensionStage === "3year_applied" && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800 text-sm">3년 연장 신청 선택됨</AlertTitle>
                  <AlertDescription className="text-green-700 text-xs mt-2">
                    <p className="font-medium">필요 서류:</p>
                    <p>• 서면동의서 (입주민대표회의 등 관리주체 동의)</p>
                    <p className="mt-2 text-[10px] text-green-600">
                      ※ 검사규정 부칙 제3조제3항에 따라 3년간 검사 유예<br/>
                      ※ 3년 연장 적용 시 1단계/2단계 이행연장은 적용 불가
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              {form.extensionStage === "stage2" && availableReasons.length > 0 && (
                <div className="space-y-2">
                  <Label>2단계 연장 사유</Label>
                  <div className="space-y-2">
                    {availableReasons.map((reason) => (
                      <button
                        key={reason.value}
                        onClick={() => setForm({ ...form, extensionReason: reason.value })}
                        className={`w-full text-left py-3 px-4 rounded-lg border-2 transition-all ${
                          form.extensionReason === reason.value
                            ? "bg-amber-50 border-amber-500 text-amber-800"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                        data-testid={`button-reason-${reason.value}`}
                      >
                        <div className="font-medium text-sm">{reason.label}</div>
                        <div className="text-xs opacity-70 mt-0.5">{reason.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1" data-testid="button-prev-step3">
                  <ChevronLeft className="w-4 h-4 mr-1" /> 이전
                </Button>
                <Button
                  className="flex-1"
                  disabled={!canProceedStep3}
                  onClick={() => setStep(4)}
                  data-testid="button-next-step3"
                >
                  결과 확인 <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && result && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Cog className="w-5 h-5" />
                  업무처리 결과
                </CardTitle>
                <CardDescription>
                  {BUILDING_TYPES.find((b) => b.value === form.buildingType)?.label} |{" "}
                  {EXTENSION_STAGES.find((s) => s.value === form.extensionStage)?.label}
                  {form.extensionReason && ` | ${EXTENSION_REASONS.find((r) => r.value === form.extensionReason)?.label}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.warnings.length > 0 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>주의사항</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        {result.warnings.map((w, i) => (
                          <li key={i} className="text-sm">{w}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {form.extensionStage === "none" && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">1단계 이행연장 신청 안내</AlertTitle>
                    <AlertDescription className="text-green-700 text-sm mt-2">
                      <p className="mb-2">조건부합격 승강기의 이행기간 연장을 처음 신청합니다.</p>
                      <div className="bg-white rounded p-3 border border-green-200">
                        <p className="font-medium mb-1">연장 가능 기간</p>
                        <p className="text-xs">• 최초 2개월 조건부 부여 → 추가 2개월 연장 (총 4개월)</p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {form.extensionStage === "stage1" && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800">1단계 진행 중 안내</AlertTitle>
                    <AlertDescription className="text-blue-700 text-sm mt-2">
                      <p className="mb-2">현재 1단계 이행기간 연장 중입니다.</p>
                      {form.buildingType === "apartment" && (
                        <div className="bg-white rounded p-3 border border-blue-200 text-xs">
                          <p className="font-medium mb-1">공동주택 1단계</p>
                          <p>• 최대 1년 6개월 이내 도래하는 안전검사 또는 확인검사 시까지</p>
                          <p>• 분기별 자체점검 추가 실시 필요</p>
                        </div>
                      )}
                      {form.buildingType === "general" && (
                        <div className="bg-white rounded p-3 border border-blue-200 text-xs">
                          <p className="font-medium mb-1">일반건축물 1단계</p>
                          <p>• 최초 2개월 부여 후 이행확인</p>
                          <p>• 1단계 종료 전 2단계 서류 제출 필요</p>
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                {form.extensionStage === "stage2" && selectedReason && (
                  <Alert className="bg-amber-50 border-amber-200">
                    <FileText className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">2단계 이행연장 안내: {selectedReason.label}</AlertTitle>
                    <AlertDescription className="text-amber-700 text-sm mt-2">
                      <p className="mb-2">{selectedReason.description}</p>
                      <div className="bg-white rounded p-3 border border-amber-200">
                        <p className="font-medium mb-2 text-xs">필요 서류</p>
                        <ul className="text-xs space-y-1">
                          {selectedReason.documents.map((doc, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3 text-amber-600" />
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {result.requiredInspections.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      예정된 검사
                    </h3>
                    {result.requiredInspections.map((insp, i) => (
                      <div key={i} className="flex justify-between items-center border rounded-lg p-3">
                        <div>
                          <span className="font-medium text-sm">
                            {insp.type === "precision" ? "정밀안전검사" : "정기검사"}
                          </span>
                          <p className="text-xs text-gray-500">{insp.description}</p>
                        </div>
                        <Badge variant="outline">{formatDate(insp.dueDate)}</Badge>
                      </div>
                    ))}
                  </div>
                )}

                {result.recommendations.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-medium text-blue-800 text-sm mb-1">참고사항</h4>
                    <ul className="text-sm text-blue-700 list-disc list-inside">
                      {result.recommendations.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.nextSteps.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">다음 단계</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                      {result.nextSteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(3)} className="flex-1" data-testid="button-prev-step4">
                <ChevronLeft className="w-4 h-4 mr-1" /> 수정
              </Button>
              <Button variant="secondary" onClick={handleReset} className="flex-1" data-testid="button-reset">
                처음부터
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
