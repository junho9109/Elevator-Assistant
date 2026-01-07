import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2, AlertTriangle, FileText, Calendar, Building, Cog, ChevronRight, ChevronLeft, Info, Layers, ClipboardList, Target } from "lucide-react";
import {
  BUILDING_TYPES,
  EQUIPMENT_TYPES,
  INSPECTION_RESULTS,
  IMPROVEMENT_PLANS,
  BuildingType,
  EquipmentType,
  InspectionResult,
  CurrentStatus,
  ImprovementPlan,
  generateStatusDiagnosis,
  StatusDiagnosis
} from "@/data/inspection-workflow";

interface FormState {
  buildingType: BuildingType | null;
  equipmentType: EquipmentType | null;
  installDate: string;
  lastPrecisionDate: string;
  precisionResult: InspectionResult | null;
  lastPeriodicDate: string;
  periodicResult: InspectionResult | null;
  is3YearApplied: boolean;
  currentStatus: CurrentStatus | null;
  improvementPlan: ImprovementPlan | null;
}

const INITIAL_STATE: FormState = {
  buildingType: null,
  equipmentType: null,
  installDate: "",
  lastPrecisionDate: "",
  precisionResult: null,
  lastPeriodicDate: "",
  periodicResult: null,
  is3YearApplied: false,
  currentStatus: null,
  improvementPlan: null
};

export default function PrecisionInspectionPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);

  const statusDiagnosis = useMemo<StatusDiagnosis | null>(() => {
    if (!form.buildingType || !form.currentStatus) {
      return null;
    }
    return generateStatusDiagnosis(
      form.buildingType,
      form.currentStatus,
      form.improvementPlan,
      form.is3YearApplied
    );
  }, [form.buildingType, form.currentStatus, form.improvementPlan, form.is3YearApplied]);

  const isApartmentOrCollective = form.buildingType === "apartment" || form.buildingType === "collective";

  const selectedPlan = useMemo(() => {
    return IMPROVEMENT_PLANS.find(p => p.value === form.improvementPlan);
  }, [form.improvementPlan]);

  const canProceedStep1 = form.buildingType && form.equipmentType && form.installDate;
  const canProceedStep2 = canProceedStep1 && (form.lastPrecisionDate || form.lastPeriodicDate);
  const canProceedStep3 = canProceedStep2 && form.currentStatus !== null;
  const canProceedStep4 = canProceedStep3 && (form.is3YearApplied || form.currentStatus === "new" || form.currentStatus === "stage1" || (form.currentStatus === "stage2" && form.improvementPlan !== null));

  useEffect(() => {
    if (step === 4 && (form.is3YearApplied || form.currentStatus === "new" || form.currentStatus === "stage1")) {
      setStep(5);
    }
  }, [step, form.is3YearApplied, form.currentStatus]);

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
        <div className="flex justify-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                step === s
                  ? "bg-blue-600 text-white"
                  : step > s
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
              data-testid={`step-indicator-${s}`}
            >
              {step > s ? <CheckCircle2 className="w-3.5 h-3.5" /> : s}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-1.5 mt-1 text-[10px] text-gray-500">
          <span>정보</span>
          <span>이력</span>
          <span>분류</span>
          <span>계획</span>
          <span>진단</span>
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
                  onValueChange={(v) => setForm({ ...form, buildingType: v as BuildingType, is3YearApplied: false, currentStatus: null, improvementPlan: null })}
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
                <Label htmlFor="installDate">설치검사일 (전면교체일)</Label>
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
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <Label className="text-blue-800 font-medium">정밀안전검사</Label>
                <div className="space-y-2 mt-2">
                  <div className="space-y-1">
                    <Label htmlFor="lastPrecisionDate" className="text-xs text-blue-700">최근 검사일</Label>
                    <Input
                      id="lastPrecisionDate"
                      type="date"
                      value={form.lastPrecisionDate}
                      onChange={(e) => setForm({ ...form, lastPrecisionDate: e.target.value })}
                      data-testid="input-precision-date"
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-blue-700">검사 결과</Label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {INSPECTION_RESULTS.map((opt) => (
                        <button
                          key={`precision-${opt.value}`}
                          onClick={() => setForm({ ...form, precisionResult: opt.value })}
                          className={`py-1.5 px-2 rounded-lg border-2 text-xs font-medium transition-all ${
                            form.precisionResult === opt.value
                              ? opt.color + " border-current"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                          }`}
                          data-testid={`button-precision-result-${opt.value}`}
                        >
                          <div className="font-medium">{opt.shortLabel}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                <Label className="text-amber-800 font-medium">정기검사</Label>
                <div className="space-y-2 mt-2">
                  <div className="space-y-1">
                    <Label htmlFor="lastPeriodicDate" className="text-xs text-amber-700">최근 검사일</Label>
                    <Input
                      id="lastPeriodicDate"
                      type="date"
                      value={form.lastPeriodicDate}
                      onChange={(e) => setForm({ ...form, lastPeriodicDate: e.target.value })}
                      data-testid="input-periodic-date"
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-amber-700">검사 결과</Label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {INSPECTION_RESULTS.map((opt) => (
                        <button
                          key={`periodic-${opt.value}`}
                          onClick={() => setForm({ ...form, periodicResult: opt.value })}
                          className={`py-1.5 px-2 rounded-lg border-2 text-xs font-medium transition-all ${
                            form.periodicResult === opt.value
                              ? opt.color + " border-current"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                          }`}
                          data-testid={`button-periodic-result-${opt.value}`}
                        >
                          <div className="font-medium">{opt.shortLabel}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {(form.precisionResult || form.periodicResult) && form.buildingType === "apartment" && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800 text-sm">공동주택 검사결과별 안내</AlertTitle>
                  <AlertDescription className="text-blue-700 text-xs">
                    {(form.precisionResult === "pass" || form.periodicResult === "pass") && (
                      <p>합격 판정으로 정상 운행 가능합니다. 3년 연장 조건 충족 시 신청 가능합니다.</p>
                    )}
                    {(form.precisionResult === "conditional_next" || form.periodicResult === "conditional_next") && (
                      <p>차기안전검사 시까지 조건부 항목 이행 필요. 확인검사 불필요, 차기 안전검사 시 조건부항목 확인하여 판정합니다.</p>
                    )}
                    {(form.precisionResult === "conditional_12" || form.periodicResult === "conditional_12") && (
                      <p>12개월 이내 시정 후 확인검사 필요. 보완기간 연장 또는 차기안전검사 판정을 통해 이행기간 연장 가능합니다.</p>
                    )}
                    {(form.precisionResult === "fail" || form.periodicResult === "fail") && (
                      <p>불합격으로 즉시 시정 조치 후 재검사가 필요합니다.</p>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {(form.precisionResult || form.periodicResult) && form.buildingType === "general" && (
                <Alert className="bg-amber-50 border-amber-200">
                  <Info className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800 text-sm">일반건축물 검사결과별 안내</AlertTitle>
                  <AlertDescription className="text-amber-700 text-xs">
                    {(form.precisionResult === "pass" || form.periodicResult === "pass") && (
                      <p>합격 판정으로 정상 운행 가능합니다.</p>
                    )}
                    {(form.precisionResult === "conditional_next" || form.periodicResult === "conditional_next") && (
                      <p>차기안전검사 시까지 조건부 항목 이행 필요. 확인검사 불필요합니다.</p>
                    )}
                    {(form.precisionResult === "conditional_12" || form.periodicResult === "conditional_12") && (
                      <div>
                        <p>12개월 이내 시정 후 확인검사 필요.</p>
                        <p className="mt-1">• 1단계: 최초 2개월 조건부 부여 후 추가 2개월 연장 가능</p>
                        <p>• 2단계: 대상별 여건에 따라 6개월~1년 추가 연장</p>
                      </div>
                    )}
                    {(form.precisionResult === "fail" || form.periodicResult === "fail") && (
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
                적용 대상 분류
              </CardTitle>
              <CardDescription>
                {isApartmentOrCollective 
                  ? "3년 연장 적용 여부를 확인하세요"
                  : "현재 이행기간 연장 진행 상태를 선택하세요"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isApartmentOrCollective && (
                <>
                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800 text-sm">
                      {form.buildingType === "apartment" ? "공동주택" : "집합건축물"} 3년 연장
                    </AlertTitle>
                    <AlertDescription className="text-blue-700 text-xs mt-2">
                      <p>부칙 제3조제3항에 따라 서면동의서 제출 시 3년간 검사가 유예됩니다.</p>
                      <p className="mt-1 text-[10px] text-blue-600">※ 3년 연장 적용 중인 경우 추가 이행연장 불가</p>
                    </AlertDescription>
                  </Alert>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <Label className="text-sm font-medium">3년 연장 적용 중</Label>
                      <p className="text-xs text-gray-500 mt-0.5">서면동의서를 제출하여 3년 연장이 적용된 상태입니까?</p>
                    </div>
                    <Switch
                      checked={form.is3YearApplied}
                      onCheckedChange={(checked) => setForm({ 
                        ...form, 
                        is3YearApplied: checked, 
                        currentStatus: checked ? "3year_applied" : null,
                        improvementPlan: null 
                      })}
                      data-testid="switch-3year-applied"
                    />
                  </div>

                  {form.is3YearApplied && (
                    <Alert className="bg-amber-50 border-amber-200">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <AlertTitle className="text-amber-800 text-sm">추가 연장 불가 안내</AlertTitle>
                      <AlertDescription className="text-amber-700 text-xs mt-1">
                        3년 연장 적용 중에는 추가 이행기간 연장이 불가합니다.
                      </AlertDescription>
                    </Alert>
                  )}

                  {!form.is3YearApplied && (
                    <div className="space-y-2">
                      <Label>3년 연장 미적용 시 상태 선택</Label>
                      <div className="space-y-2">
                        {[
                          { value: "new" as CurrentStatus, label: "신규 신청", description: "이행기간 연장을 처음 신청합니다" },
                          { value: "stage1" as CurrentStatus, label: "1단계 연장 중", description: "1단계 이행기간 연장이 진행 중입니다" },
                          { value: "stage2" as CurrentStatus, label: "2단계 연장 중", description: "2단계 이행기간 연장이 진행 중입니다" }
                        ].map((status) => (
                          <button
                            key={status.value}
                            onClick={() => setForm({ ...form, currentStatus: status.value, improvementPlan: null })}
                            className={`w-full text-left py-3 px-4 rounded-lg border-2 transition-all ${
                              form.currentStatus === status.value
                                ? "bg-blue-50 border-blue-500 text-blue-800"
                                : "bg-white border-gray-200 hover:border-gray-300"
                            }`}
                            data-testid={`button-status-apt-${status.value}`}
                          >
                            <div className="font-medium">{status.label}</div>
                            <div className="text-xs opacity-70 mt-0.5">{status.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {!isApartmentOrCollective && (
                <>
                  <Alert className="bg-amber-50 border-amber-200">
                    <Info className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800 text-sm">일반건축물 이행연장</AlertTitle>
                    <AlertDescription className="text-amber-700 text-xs mt-2">
                      <p>• <strong>1단계</strong>: 최초 2개월 + 추가 2개월 (총 4개월) 또는 최대 1년 6개월</p>
                      <p>• <strong>2단계</strong>: 대상별 6개월~1년 추가 연장</p>
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label>현재 상태 선택</Label>
                    <div className="space-y-2">
                      {[
                        { value: "new" as CurrentStatus, label: "신규 신청", description: "이행기간 연장을 처음 신청합니다" },
                        { value: "stage1" as CurrentStatus, label: "1단계 연장 중", description: "1단계 이행기간 연장이 진행 중입니다" },
                        { value: "stage2" as CurrentStatus, label: "2단계 연장 중", description: "2단계 이행기간 연장이 진행 중입니다" }
                      ].map((status) => (
                        <button
                          key={status.value}
                          onClick={() => setForm({ ...form, currentStatus: status.value, improvementPlan: null })}
                          className={`w-full text-left py-3 px-4 rounded-lg border-2 transition-all ${
                            form.currentStatus === status.value
                              ? "bg-amber-50 border-amber-500 text-amber-800"
                              : "bg-white border-gray-200 hover:border-gray-300"
                          }`}
                          data-testid={`button-status-${status.value}`}
                        >
                          <div className="font-medium">{status.label}</div>
                          <div className="text-xs opacity-70 mt-0.5">{status.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
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
                  다음 <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && !form.is3YearApplied && form.currentStatus === "stage2" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                개선 계획 선택
              </CardTitle>
              <CardDescription>2단계 연장에 해당하는 개선 계획을 선택하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {IMPROVEMENT_PLANS.map((plan) => (
                  <button
                    key={plan.value}
                    onClick={() => setForm({ ...form, improvementPlan: plan.value })}
                    className={`w-full text-left py-3 px-4 rounded-lg border-2 transition-all ${
                      form.improvementPlan === plan.value
                        ? "bg-blue-50 border-blue-500 text-blue-800"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                    data-testid={`button-plan-${plan.value}`}
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{plan.value}</Badge>
                      <span className="font-medium">{plan.label}</span>
                    </div>
                    <div className="text-xs opacity-70 mt-1">{plan.description}</div>
                    <div className="text-xs text-blue-600 mt-1">연장 기간: {plan.extensionPeriod}</div>
                  </button>
                ))}
              </div>

              {selectedPlan && (
                <Alert className="bg-blue-50 border-blue-200">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800 text-sm">{selectedPlan.label} 필요 서류</AlertTitle>
                  <AlertDescription className="text-blue-700 text-xs mt-2">
                    <ul className="space-y-1">
                      {selectedPlan.documents.map((doc, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-blue-600 flex-shrink-0" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1" data-testid="button-prev-step4">
                  <ChevronLeft className="w-4 h-4 mr-1" /> 이전
                </Button>
                <Button
                  className="flex-1"
                  disabled={!form.improvementPlan}
                  onClick={() => setStep(5)}
                  data-testid="button-next-step4"
                >
                  결과 확인 <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}


        {step === 5 && statusDiagnosis && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  현재 상태 진단
                </CardTitle>
                <CardDescription>
                  {BUILDING_TYPES.find((b) => b.value === form.buildingType)?.label} | {statusDiagnosis.currentStatus}
                  {statusDiagnosis.improvementPlanLabel !== "-" && ` | ${statusDiagnosis.improvementPlanLabel}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800 text-sm">{statusDiagnosis.statusDescription}</AlertTitle>
                  <AlertDescription className="text-blue-700 text-sm mt-2">
                    {statusDiagnosis.mainMessage}
                  </AlertDescription>
                </Alert>

                {statusDiagnosis.warnings.length > 0 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>주의사항</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        {statusDiagnosis.warnings.map((w, i) => (
                          <li key={i} className="text-sm">{w}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {statusDiagnosis.requiredDocuments.length > 0 && (
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="font-medium text-sm flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      필요 서류
                    </h3>
                    <ul className="space-y-1">
                      {statusDiagnosis.requiredDocuments.map((doc, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {statusDiagnosis.obligations.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h3 className="font-medium text-sm text-amber-800 mb-2">공통 의무사항</h3>
                    <ul className="space-y-1">
                      {statusDiagnosis.obligations.map((obl, i) => (
                        <li key={i} className="text-sm text-amber-700 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-amber-600 rounded-full flex-shrink-0" />
                          {obl}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {statusDiagnosis.ctaButtons.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">향후 선택지</h3>
                    <div className="space-y-2">
                      {statusDiagnosis.ctaButtons.map((btn, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          className="w-full justify-between h-auto py-3"
                          data-testid={`button-cta-${btn.action}`}
                        >
                          <div className="text-left">
                            <div className="font-medium">{btn.label}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{btn.description}</div>
                          </div>
                          <ChevronRight className="w-4 h-4 flex-shrink-0" />
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setStep(form.currentStatus === "stage2" ? 4 : 3)} 
                className="flex-1" 
                data-testid="button-prev-step5"
              >
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
