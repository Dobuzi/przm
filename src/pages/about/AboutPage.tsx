import { Link } from "react-router-dom";
import { Card } from "@/shared/ui/Card";

export function AboutPage() {
  return (
    <main className="min-h-screen px-4 py-8 lg:px-6">
      <div className="mx-auto max-w-4xl space-y-5">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ocean/70">
            About PRZM
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">
            퍼짐을 읽는 지도 기반 질병 모니터링 앱
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            이 페이지는 메인 지도 경험과 분리된 설명성 라우트가 어떻게 추가될지
            확인하기 위한 scaffold입니다. 실제 운영 단계에서는 서비스 소개,
            데이터 기준, 예측 해석 방식 등을 담을 수 있습니다.
          </p>
          <Link className="mt-5 inline-block text-sm font-medium text-ocean underline" to="/">
            메인 지도 화면으로 돌아가기
          </Link>
        </Card>
      </div>
    </main>
  );
}
