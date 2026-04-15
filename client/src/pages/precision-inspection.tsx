import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";

// ==================== 일반건축물 연장 규칙 ====================
const generalRules = {
  stage1: [
    {
      specialSituation: "safety_evaluation",
      label: "안전성평가 미완료",
      extensionPeriod: "2개월 (1회 연장 가능)",
      requiredDocs: ["보완연장신청서", "안전성평가 신청서 또는 접수증", "이행계획서"],
      note: "분기별 자체점검 의무, 전산 입력 유지"
    },
    {
      specialSituation: "construction_delay",
      label: "공사 지연",
      extensionPeriod: "최대 1년6개월 (1단계)",
      requiredDocs: ["보완연장신청서", "공사계약서", "공사 일정표", "이행계획서"],
      note: "공사 지연 증빙 필수"
    }
  ],
  stage2: [
    {
      specialSituation: "full_replacement",
      label: "전체교체 예정",
      extensionPeriod: "최대 1년",
      requiredDocs: ["보완연장신청서", "2단계 이행계획서"],
      note: "추가 서류 없음"
    },
    {
      specialSituation: "partial_replacement",
      label: "부분교체 예정",
      extensionPeriod: "6개월 + 추가 6개월",
      requiredDocs: ["보완연장신청서", "2단계 이행계획서", "이행확인서"],
      note: "구동기 또는 제어반 포함 시 적용"
    },
    {
      specialSituation: "redevelopment",
      label: "재개발·재건축 철거 예정",
      extensionPeriod: "최대 1년",
      requiredDocs: ["보완연장신청서", "2단계 이행계획서", "관리처분계획인가 고시"],
      note: "철거 예정 증빙 필수"
    },
    {
      specialSituation: "mobility",
      label: "국민 이동편의 보장 필요",
      extensionPeriod: "최대 1년",
      requiredDocs: ["보완연장신청서", "2단계 이행계획서", "건축물대장 등 용도 확인서류"],
      note: "다중이용건축물 등 해당"
    },
    {
      specialSituation: "director_judgment",
      label: "공단 이사장 인정 현장",
      extensionPeriod: "최대 6개월",
      requiredDocs: ["보완연장신청서", "2단계 이행계획서", "개별 협의 서류"],
      note: "검사기관 통해 공단 검사총괄실 검토"
    }
  ]
};

export default function PrecisionInspectionPage() {
  const [buildingType, setBuildingType] = useState("");
  const [inspectionCount, setInspectionCount] = useState("");
  const [cycle, setCycle] = useState("");
  const [specialSituation, setSpecialSituation] = useState("");
  const [stage, setStage] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  // 상단 도우미 안내창
  const [showHelper, setShowHelper] = useState(false);

  // 하단 스와이프 안내창
  const [showSwipeGuide, setShowSwipeGuide] = useState(false);

  const isApartmentOrCollective = buildingType === "apartment" || buildingType === "collective";
  const isGeneral = buildingType === "general";
  const hasBasicSelection = buildingType && inspectionCount && cycle; // 1~3번 모두 선택했는지

  // 상단 도우미 2초 후 자동 숨김
  useEffect(() => {
    const timer = setTimeout(() => setShowHelper(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 하단 스와이프 안내창 5초 후 자동 숨김
  useEffect(() => {
    const timer = setTimeout(() => setShowSwipeGuide(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleCalculate = () => {
    setError("");
    setResult(null);

    if (!buildingType || !inspectionCount || !cycle || !specialSituation) {
      setError("모든 항목을 선택해주세요.");
      return;
    }

    if (isApartmentOrCollective && inspectionCount === "fourth") {
      setError("⚠️ 공동주택·집합건축물은 서면동의서로 이미 3년 유예를 받은 상태입니다.\n네 번째 정밀안전검사에서는 추가 연장이 불가능합니다.");
      return;
    }

    if (isApartmentOrCollective) {
      setResult({
        extensionPeriod: "3년",
        requiredDocs: ["서면동의서", "건축물대장(표제부)"],
        note: "부칙 제3조제3항에 따른 3년 검사 유예 적용 (서면동의서 제출 시)"
      });
      return;
    }

    if (isGeneral) {
      if (!stage) {
        setError("일반건축물은 단계를 선택해야 합니다.");
        return;
      }
      const rules = stage === "stage1" ? generalRules.stage1 : generalRules.stage2;
      const matched = rules.find(rule => rule.specialSituation === specialSituation);
      if (!matched) {
        setError("해당 단계·사유에 맞는 규정이 없습니다.");
        return;
      }
      setResult(matched);
      return;
    }
  };

  return (
    <div className="p-3 relative min-h-screen">
      <h1 className="text-2xl font-bold mb-8 text-center">정밀안전검사 안내</h1>

      {/* 상단 도우미 안내창 */}
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ${showHelper ? 'opacity-100 -translate-y-1/2' : 'opacity-0 -translate-y-[140%] pointer-events-none'}`}>
        <Card className="w-[420px] shadow-2xl border-primary/30 bg-card">
          <CardHeader>
            <CardTitle className="text-xl text-blue-700">정밀안전검사 안내</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground 600">
            건축물 유형, 검사 회차, 단계, 사유를 선택하면<br />
            연장 기간과 필요 서류를 자동으로 정리해 드립니다.
          </CardContent>
        </Card>
      </div>

      {/* 상단 도우미 다시 보기 버튼 */}


      {/* 하단 스와이프 안내창 */}


      <div className="space-y-6 mt-4">
        {/* 1. 건축물 유형 */}
        <div>
          <Label>1. 건축물 유형</Label>
          <Select value={buildingType} onValueChange={setBuildingType}>
            <SelectTrigger><SelectValue placeholder="선택하세요" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">공동주택</SelectItem>
              <SelectItem value="collective">집합건축물</SelectItem>
              <SelectItem value="general">일반건축물</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 2. 검사 회차 */}
        <div>
          <Label>2. 검사 회차</Label>
          <Select value={inspectionCount} onValueChange={setInspectionCount}>
            <SelectTrigger><SelectValue placeholder="선택하세요" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="third">세 번째 정밀안전검사</SelectItem>
              <SelectItem value="fourth">네 번째 정밀안전검사</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 3. 주기 */}
        <div>
          <Label>3. 주기</Label>
          <Select value={cycle} onValueChange={setCycle}>
            <SelectTrigger><SelectValue placeholder="선택하세요" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="6m">6개월</SelectItem>
              <SelectItem value="1y">1년</SelectItem>
              <SelectItem value="2y">2년</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 단계 선택 (일반건축물만) */}
        {isGeneral && hasBasicSelection && (
          <div>
            <Label>단계 선택</Label>
            <Select value={stage} onValueChange={setStage}>
              <SelectTrigger><SelectValue placeholder="1단계 또는 2단계 선택" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="stage1">1단계 연장</SelectItem>
                <SelectItem value="stage2">2단계 연장</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 4. 사유 */}
        <div>
          <Label>4. 사유</Label>
          <Select 
            value={specialSituation} 
            onValueChange={setSpecialSituation}
            disabled={!hasBasicSelection} // 1~3번 모두 선택해야 활성화
          >
            <SelectTrigger>
              <SelectValue 
                placeholder={
                  !hasBasicSelection 
                    ? "유형·회차·주기를 먼저 선택하세요"
                    : isGeneral && !stage 
                      ? "단계를 선택하면 사유 목록이 업데이트됩니다"
                      : "선택하세요"
                } 
              />
            </SelectTrigger>
            <SelectContent>
              {isApartmentOrCollective ? (
                <SelectItem value="construction_delay">공사 지연</SelectItem>
              ) : isGeneral && hasBasicSelection ? (
                <>
                  {/* stage가 없으면 기본 2개만 보이게 */}
                  {!stage ? (
                    <>
                      <SelectItem value="safety_evaluation">안전성평가 미완료</SelectItem>
                      <SelectItem value="construction_delay">공사 지연</SelectItem>
                    </>
                  ) : stage === "stage1" ? (
                    <>
                      <SelectItem value="safety_evaluation">안전성평가 미완료</SelectItem>
                      <SelectItem value="construction_delay">공사 지연</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="full_replacement">전체교체 예정</SelectItem>
                      <SelectItem value="partial_replacement">부분교체 예정</SelectItem>
                      <SelectItem value="redevelopment">재개발·재건축 철거 예정</SelectItem>
                      <SelectItem value="mobility">국민 이동편의 보장 필요</SelectItem>
                      <SelectItem value="director_judgment">공단 이사장 인정 현장</SelectItem>
                    </>
                  )}
                </>
              ) : null}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleCalculate} className="w-full" size="lg">
          결과 보기
        </Button>

        {error && (
          <div className="text-red-600 font-medium p-4 bg-red-50 border border-red-200 rounded-xl whitespace-pre-line">
            {error}
          </div>
        )}

        {result && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">✅ 연장 적용 결과</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">연장 가능 기간</h3>
                <p className="text-3xl font-bold text-primary">{result.extensionPeriod}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">필요 서류</h3>
                <ul className="space-y-2">
                  {result.requiredDocs.map((doc: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 bg-background p-4 rounded-xl text-sm">
                      ✓ {doc}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl">
                <h3 className="font-semibold text-amber-800 mb-2">중요 안내사항</h3>
                <p className="text-amber-700">{result.note}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}