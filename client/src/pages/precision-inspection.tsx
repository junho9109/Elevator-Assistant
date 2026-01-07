import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrecisionInspectionPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">
            정밀안전검사 업무처리
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center" data-testid="text-placeholder">
            내용을 추가해 주세요.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
