import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";

// ==================== 이행기간 연장 규칙 (출처: 한국승강기안전공단 검사총괄실 2026.02.27) ====================

// ★ 공통사항
// 1. 검사 시 관리주체가 이행기간 연장 서류를 모두 제출하는 경우, 최초 2개월 부여 없이 바로 조건부기간 부여 가능
// 2. 승강기민원24 보완연장신청 메뉴로 신청한 경우 보완연장신청서 추가 불필요 (단, 연장사유 명확히 확인)
// 3. 근거: 검사규정 제13조제3항

const generalRules = {
  // ── 상세-1: 검사규정 제13조제3항제1호 ──
  // 적용: 세 번째 정밀안전검사(공동주택·집합건축물은 네 번째)
  stage1_construction: {
    specialSituation: "construction_delay",
    label: "공사 지연 (부품 설치 공사 중·예정)",
    applicableInspection: "세 번째 정밀안전검사 (공동주택·집합건축물: 네 번째)",
    extensionPeriod: "2개월 추가 연장 (최초 2개월 + 추가 2개월 = 총 4개월)",
    condition: "2개월 연장으로 안전부품 추가 설치가 완료되는 경우에 한정",
    requiredDocs: [
      "보완연장신청서 (연장기간: 2개월)",
      "부품설치 관련 공사계약서",
    ],
    adminProcess: [
      "① 관리주체: 조건부 이행기간 연장 신청 (공사계약서 첨부)",
      "② 검사기관: 제출서류 검토 (공사계약 또는 안전성평가 신청 완료 여부 확인)",
      "③ 검사기관: 조건부합격 이행기간 연장 처리 (최대 2개월)",
    ],
    note: "1년6개월 이내 연장 요청 시 상세-3(단계적 이행)으로 처리"
  },

  stage1_safety_eval: {
    specialSituation: "safety_evaluation",
    label: "안전성평가 미완료",
    applicableInspection: "안전검사",
    extensionPeriod: "2개월 추가 연장 (총 4개월)",
    condition: "안전성평가 신청 후 미완료된 승강기 (접수 확인 필수)",
    requiredDocs: [
      "보완연장신청서 (연장기간: 2개월)",
      "안전성평가 신청서 (접수이력 확인)",
    ],
    adminProcess: [
      "① 관리주체: 이행기간 연장 신청",
      "② 검사기관: 연구개발실 게시판에서 안전성평가 접수 여부 확인",
      "③ 검사기관: 조건부합격 이행기간 2개월 연장 처리",
    ],
    note: "안전성평가 접수 확인 후에만 연장 가능"
  },

  // ── 상세-2: 재난발생 (검사규정 제13조제3항제2호) ──
  stage_disaster: {
    specialSituation: "disaster",
    label: "재난 발생 (작업자 출입 차단)",
    applicableInspection: "안전검사",
    extensionPeriod: "이행연장 해소일 이후 최대 1년 이내 안전검사 또는 확인검사 시까지",
    periodDetail: {
      "주기 6개월": "1년 이내 매 안전검사 시 이행여부 확인",
      "주기 1년": "차기 안전검사 시 최종 확인",
      "주기 2년": "검사일로부터 1년 이내 확인검사 시 최종 확인",
    },
    condition: "코로나19 등 재난으로 작업자 출입 차단으로 조건부사항 이행 불가한 경우",
    requiredDocs: [
      "보완연장신청서 (~차기안전검사 시까지)",
      "자체개선계획서",
      "격리시설 지정서 또는 건물 폐쇄 명령서 등 공문서",
    ],
    adminProcess: [
      "① 관리주체: 조건부 이행기간 연장 신청",
      "② 검사기관: 제출서류 검토",
      "③ 검사기관: 조건부합격 이행기간 연장 (차기안전검사 판정)",
      "④ 검사기관: 전산 입력 유지 (이행완료 전까지)",
      "⑤ 검사기관: 연장사유 해소 시 즉시 부적합사항 조치 시정권고",
      "⑥ 이행기간 연장해소일 이후 실시 안전검사에서 조건부사항 최종 확인",
    ],
    note: "출입 가능하면 연장 불가. 확인검사 불필요, 차기 안전검사에서 확인"
  },

  // ── 상세-3: 단계적 이행기간 부여 1단계 (검사규정 제13조제3항제2호) ──
  stage3_phase1: {
    specialSituation: "staged_phase1",
    label: "단계적 이행 1단계 (1년6개월)",
    applicableInspection: "세 번째 정밀안전검사 기준",
    extensionPeriod: "세 번째 정밀안전검사일 기준 1년6개월 이내 안전검사 또는 확인검사",
    requiredDocs: [
      "보완연장신청서 (~1년6개월 이내 차기 안전/확인검사 시까지)",
      "검사주기 조정신청서 (수시검사 수검분)",
      "이행계획서",
    ],
    adminProcess: [
      "① 관리주체: 조건부 이행기간 연장 신청",
      "② 검사기관: 제출서류 검토",
      "③ 검사기관: 이행기간 연장 승인",
      "④ 검사기관: 세 번째 정밀안전검사일 기준 1년6개월 이내 안전/확인검사에서 최종 이행여부 확인",
    ],
    note: "1단계 완료 후 추가 연장 필요 시 2단계 적용 가능"
  },

  // ── 상세-4: 단계적 이행기간 부여 2단계 ──
  stage3_phase2: {
    specialSituation: "staged_phase2",
    label: "단계적 이행 2단계 (추가 6개월/1년)",
    applicableInspection: "1단계 완료된 승강기에 한정",
    extensionPeriod: "1단계 이행기간 만료일 기준 6개월 또는 1년 이내",
    requiredDocs: [
      "보완연장신청서",
      "이행계획서",
      "해당사유별 추가서류:",
      "  - 전체교체 예정: 추가 서류 없음",
      "  - 부분교체(구동기 또는 제어반 포함): 이행확인서",
      "  - 재개발·재건축 철거예정: 관리처분계획인가 고시",
      "  - 국민 이동편의보장 필요: 건축물대장 등 건물용도 확인서류",
      "  - 공단 이사장 인정: 상황별 서류 상이",
    ],
    adminProcess: [
      "① 관리주체: 조건부 이행기간 연장 신청",
      "② 검사기관: 제출서류 검토",
      "③ 검사기관: 이행기간 연장 승인",
      "④ 검사기관: 1단계 만료일 기준 6개월/1년 이내 안전/확인검사에서 최종 확인",
      "⑤ 분기별 자체점검 추가 실시 안내",
    ],
    note: "차기안전검사 판정 시 전산 정밀체크 필수"
  },

  // ── 상세-5: 대수선 불가 (검사규정 부칙 제2조제4항) ──
  stage_major_repair: {
    specialSituation: "major_repair",
    label: "대수선 없이 이행 불가",
    applicableInspection: "정밀안전검사 (부칙 제2조제4항 적용)",
    extensionPeriod: "해당 부품 설치 제외 (적용제외 처리)",
    applicableTarget: "승강로 협소한 소형 포지티브 엘리베이터, 사업장 특례 화물용 엘리베이터 등",
    requiredDocs: [
      "유지관리계약서 (월 2회 이상)",
      "자체개선계획서",
      "대수선 관련 증빙서류 (2개 이상 제조·수입업체의 검토의견서)",
    ],
    adminProcess: [
      "① 관리주체: 적용제외 서류 제출",
      "② 검사기관: 제출서류 검토 및 검토의견서 작성",
      "③ 검사기관: 해당 부품에 한하여 설치 제외 후 검사 판정",
      "④ 검사기관: 분기별 적용제외 승강기 행정안전부 보고",
    ],
    note: "이후 안전검사 시 자체개선계획 이행여부 확인 불요. 단, 자체점검 추가실시 및 일상점검 수행 지속 권고"
  }
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

    if (!buildingType || !specialSituation) {
      setError("건축물 유형과 연장 사유를 선택해주세요.");
      return;
    }

    // 공동주택·집합건축물
    if (isApartmentOrCollective) {
      if (inspectionCount === "fourth") {
        setError("⚠️ 공동주택·집합건축물은 서면동의서로 이미 3년 유예를 받은 상태입니다.\n네 번째 정밀안전검사에서는 추가 연장이 불가능합니다.");
        return;
      }
      setResult({
        label: "공동주택·집합건축물 3년 유예",
        extensionPeriod: "3년 (서면동의서 제출 시)",
        applicableInspection: "세 번째 정밀안전검사",
        requiredDocs: ["서면동의서", "건축물대장(표제부)"],
        adminProcess: [
          "① 관리주체: 서면동의서 및 건축물대장 제출",
          "② 검사기관: 서류 검토 후 3년 유예 처리",
          "③ 검사규정 부칙 제3조제3항 적용",
        ],
        note: "부칙 제3조제3항에 따른 3년 검사 유예 적용"
      });
      return;
    }

    // 일반건축물 - 사유별 매칭
    const ruleMap: Record<string, any> = {
      "construction_delay": generalRules.stage1_construction,
      "safety_evaluation": generalRules.stage1_safety_eval,
      "disaster": generalRules.stage_disaster,
      "staged_phase1": generalRules.stage3_phase1,
      "staged_phase2": generalRules.stage3_phase2,
      "major_repair": generalRules.stage_major_repair,
    };

    const matched = ruleMap[specialSituation];
    if (!matched) {
      setError("해당 사유에 맞는 규정이 없습니다.");
      return;
    }
    setResult(matched);
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
        {/* 공통사항 안내 */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 text-xs text-foreground space-y-1">
          <p className="font-semibold text-blue-500">📌 공통사항 (검사규정 제13조제3항)</p>
          <p>• 검사 시 연장 서류 모두 제출 시 → 최초 2개월 없이 바로 조건부기간 부여 가능</p>
          <p>• 승강기민원24 보완연장신청 메뉴 신청 시 → 신청서 추가 불필요 (사유 확인 필수)</p>
        </div>

        {/* 1. 건축물 유형 */}
        <div>
          <Label>1. 건축물 유형</Label>
          <Select value={buildingType} onValueChange={v => { setBuildingType(v); setSpecialSituation(""); setResult(null); }}>
            <SelectTrigger><SelectValue placeholder="선택하세요" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">공동주택</SelectItem>
              <SelectItem value="collective">집합건축물</SelectItem>
              <SelectItem value="general">일반건축물</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 2. 검사 회차 (공동주택·집합건축물만) */}
        {isApartmentOrCollective && (
          <div>
            <Label>2. 검사 회차</Label>
            <Select value={inspectionCount} onValueChange={setInspectionCount}>
              <SelectTrigger><SelectValue placeholder="선택하세요" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="third">세 번째 정밀안전검사</SelectItem>
                <SelectItem value="fourth">네 번째 정밀안전검사 (추가 연장 불가)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 2(일반) or 3. 연장 사유 선택 */}
        {buildingType && (
          <div>
            <Label>{isApartmentOrCollective ? "3" : "2"}. 연장 사유</Label>
            <Select value={specialSituation} onValueChange={v => { setSpecialSituation(v); setResult(null); }}>
              <SelectTrigger><SelectValue placeholder="해당 사유를 선택하세요" /></SelectTrigger>
              <SelectContent>
                {isApartmentOrCollective ? (
                  <SelectItem value="apartment_3year">서면동의서 제출 (3년 유예)</SelectItem>
                ) : (
                  <>
                    <SelectItem value="construction_delay">공사 지연 (부품 설치 공사 중·예정)</SelectItem>
                    <SelectItem value="safety_evaluation">안전성평가 미완료</SelectItem>
                    <SelectItem value="disaster">재난 발생 (작업자 출입 차단)</SelectItem>
                    <SelectItem value="staged_phase1">단계적 이행 1단계 (1년6개월)</SelectItem>
                    <SelectItem value="staged_phase2">단계적 이행 2단계 (추가 6개월/1년)</SelectItem>
                    <SelectItem value="major_repair">대수선 없이 이행 불가 (적용제외)</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

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