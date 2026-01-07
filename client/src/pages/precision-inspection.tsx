import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle, FileText, Calendar, Building, Cog, ChevronRight, ChevronLeft, Info } from "lucide-react";
import {
  BUILDING_TYPES,
  EQUIPMENT_TYPES,
  INSPECTION_RESULTS,
  BuildingType,
  EquipmentType,
  InspectionResult,
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
}

const INITIAL_STATE: FormState = {
  buildingType: null,
  equipmentType: null,
  installDate: "",
  lastPrecisionDate: "",
  lastPeriodicDate: "",
  lastResult: null
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

  const canProceedStep1 = form.buildingType && form.equipmentType && form.installDate;
  const canProceedStep2 = canProceedStep1 && (form.lastPrecisionDate || form.lastPeriodicDate);

  const handleReset = () => {
    setForm(INITIAL_STATE);
    setStep(1);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b px-4 py-3 sticky top-0 z-10">
        <h1 className="text-lg font-bold text-center">정밀안전검사 업무처리</h1>
        <div className="flex justify-center gap-2 mt-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step === s
                  ? "bg-blue-600 text-white"
                  : step > s
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
              data-testid={`step-indicator-${s}`}
            >
              {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-4 mt-1 text-xs text-gray-500">
          <span>기본정보</span>
          <span>검사이력</span>
          <span>결과확인</span>
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
                  onValueChange={(v) => setForm({ ...form, buildingType: v as BuildingType })}
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
                {form.buildingType && (
                  <p className="text-xs text-gray-500">
                    {BUILDING_TYPES.find((b) => b.value === form.buildingType)?.description}
                  </p>
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
                  결과 확인 <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && result && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Cog className="w-5 h-5" />
                  업무처리 결과
                </CardTitle>
                <CardDescription>
                  {BUILDING_TYPES.find((b) => b.value === form.buildingType)?.label} |{" "}
                  {EQUIPMENT_TYPES.find((e) => e.value === form.equipmentType)?.label}
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

                {result.eligibleExtensions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      신청 가능한 연장
                    </h3>
                    {result.eligibleExtensions.map((ext) => (
                      <div key={ext.id} className="border rounded-lg p-3 bg-green-50">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-green-600">{ext.name}</Badge>
                          <span className="text-sm text-gray-600">최대 {ext.maxExtensionMonths}개월</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{ext.description}</p>
                        <div className="text-xs text-gray-600">
                          <strong>신청 요건:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {ext.requirements.map((req, i) => (
                              <li key={i}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {result.eligibleExtensions.length === 0 && result.warnings.length === 0 && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>연장 대상 아님</AlertTitle>
                    <AlertDescription>
                      현재 조건에서는 정밀안전검사 연장 신청 대상이 아닙니다.
                    </AlertDescription>
                  </Alert>
                )}

                {result.requiredInspections.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      예정된 검사
                    </h3>
                    {result.requiredInspections.map((insp, i) => (
                      <div key={i} className="flex justify-between items-center border rounded-lg p-3">
                        <div>
                          <span className="font-medium">
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
              </CardContent>
            </Card>

            {result.eligibleExtensions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    필요 서류
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {result.eligibleExtensions.map((ext) => (
                      <AccordionItem key={ext.id} value={ext.id}>
                        <AccordionTrigger className="text-sm">
                          {ext.name} 신청 서류 ({ext.documents.length}건)
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2">
                            {ext.documents.map((doc) => (
                              <li key={doc.id} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className={`w-4 h-4 mt-0.5 ${doc.required ? "text-green-600" : "text-gray-400"}`} />
                                <div>
                                  <span className="font-medium">{doc.name}</span>
                                  {doc.required && <Badge variant="outline" className="ml-2 text-xs">필수</Badge>}
                                  <p className="text-xs text-gray-500">{doc.description}</p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}

            {result.nextSteps.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">다음 단계</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    {result.nextSteps.map((step, i) => (
                      <li key={i} className="text-gray-700">{step}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1" data-testid="button-prev-step3">
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
